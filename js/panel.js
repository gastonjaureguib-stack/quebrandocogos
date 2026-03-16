import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Usuario
const usuario = localStorage.getItem('usuario')
if (!usuario) window.location.href = '../index.html'
document.getElementById('bienvenida').textContent = `Bienvenido ${usuario}`

// Botones
document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('rol')
    window.location.href = '../index.html'
})
document.getElementById('cambiar-pass')?.addEventListener('click', () => {
    window.location.href = 'cambiarclave.html'
})

// Opciones
const variedades = ['Lalona Kush', 'DiegoArmateUno']
const cantidades = [5, 10, 15, 20]
const horarios = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

const selectVariedad = document.getElementById('variedad')
const selectCantidad = document.getElementById('dosis')
const selectHorario = document.getElementById('horario')
const ulReservas = document.getElementById('reservas-ul')

// Llenar selects
variedades.forEach(v => selectVariedad.appendChild(new Option(v, v)))
cantidades.forEach(c => selectCantidad.appendChild(new Option(c, c)))
horarios.forEach(h => selectHorario.appendChild(new Option(h, h)))

// Carrito temporal
let carrito = []
let editarId = null // Para saber si estamos editando una reserva existente

function actualizarLista() {
    ulReservas.innerHTML = ''
    carrito.forEach((r) => {
        const li = document.createElement('li')
        li.textContent = `Variedad: ${r.variedad || '-'}, Dosis: ${r.dosis || '-'}g, Horario: ${r.horario || '-'}`
        ulReservas.appendChild(li)
    })
}

// Eventos selects para carrito paso a paso
selectVariedad.addEventListener('change', () => {
    carrito[0] = carrito[0] || {}
    carrito[0].variedad = selectVariedad.value
    actualizarLista()
})
selectCantidad.addEventListener('change', () => {
    carrito[0] = carrito[0] || {}
    carrito[0].dosis = selectCantidad.value
    actualizarLista()
})
selectHorario.addEventListener('change', () => {
    carrito[0] = carrito[0] || {}
    carrito[0].horario = selectHorario.value
    actualizarLista()
})

// Modal de confirmación
const modal = document.createElement('div')
modal.id = 'modal-reserva'
modal.style.cssText = `
    display:none;
    position:fixed;
    top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.7);
    justify-content:center;
    align-items:center;
    z-index:1000;
`
modal.innerHTML = `
    <div style="
        background:#1a1a1a;
        padding:25px 35px;
        border-radius:12px;
        text-align:center;
        box-shadow:0 0 25px rgba(0,128,0,0.5);
        color:#6eff6e;
        font-size:1.1rem;
    ">
        <p>¡Reserva realizada con éxito!</p>
        <button id="cerrar-modal" style="
            margin-top:15px;
            background:#2e7d32;
            padding:10px 20px;
            border:none;
            border-radius:6px;
            color:white;
            font-weight:bold;
            cursor:pointer;
        ">Aceptar</button>
    </div>
`
document.body.appendChild(modal)
const cerrarModal = document.getElementById('cerrar-modal')
cerrarModal.addEventListener('click', () => { modal.style.display = 'none' })
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none' })

// Verificar cupos por horario
async function verificarCupos(horario) {
    const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('horario', horario)
    if (error) throw error
    return data.length
}

// Enviar o actualizar reserva
document.getElementById('form-reserva').addEventListener('submit', async (e) => {
    e.preventDefault()
    const reserva = carrito[0]
    if (!reserva?.variedad || !reserva?.dosis || !reserva?.horario) {
        alert('Completa todos los campos antes de reservar')
        return
    }

    try {
        const cupos = await verificarCupos(reserva.horario)
        if (!editarId && cupos >= 4) { // si es nueva reserva, verificar cupos
            alert('Horario completo, elige otro')
            return
        }

        if (editarId) {
            // Actualizar reserva existente
            const { error } = await supabase
                .from('reservas')
                .update({ variedad: reserva.variedad, dosis: reserva.dosis, horario: reserva.horario })
                .eq('id', editarId)
            if (error) throw error
            editarId = null
        } else {
            // Insertar nueva reserva
            const { error } = await supabase
                .from('reservas')
                .insert([{ usuario, ...reserva }])
            if (error) throw error
        }

        // Limpiar formulario y carrito
        carrito = []
        selectVariedad.value = ''
        selectCantidad.value = ''
        selectHorario.value = ''
        actualizarLista()

        // Mostrar modal
        modal.style.display = 'flex'

        // Recargar reservas del usuario
        cargarReservasUsuario()
    } catch (err) {
        console.error(err)
        alert('Error al guardar la reserva')
    }
})

// Cargar reservas del usuario con botones Editar/Eliminar
async function cargarReservasUsuario() {
    try {
        const { data, error } = await supabase
            .from('reservas')
            .select('*')
            .eq('usuario', usuario)
        if (error) throw error

        ulReservas.innerHTML = ''

        data.forEach(r => {
            const li = document.createElement('li')
            li.style.display = 'flex'
            li.style.justifyContent = 'space-between'
            li.style.alignItems = 'center'

            const span = document.createElement('span')
            span.textContent = `Variedad: ${r.variedad}, Dosis: ${r.dosis}g, Horario: ${r.horario}`
            li.appendChild(span)

            // Botón eliminar
            const btnEliminar = document.createElement('button')
            btnEliminar.textContent = 'Eliminar'
            btnEliminar.style.background = '#b71c1c'
            btnEliminar.style.marginLeft = '10px'
            btnEliminar.onclick = async () => {
                if (confirm('¿Eliminar esta reserva?')) {
                    const { error } = await supabase
                        .from('reservas')
                        .delete()
                        .eq('id', r.id)
                    if (error) alert('Error al eliminar')
                    else cargarReservasUsuario()
                }
            }
            li.appendChild(btnEliminar)

            // Botón editar
            const btnEditar = document.createElement('button')
            btnEditar.textContent = 'Editar'
            btnEditar.style.background = '#f57f17'
            btnEditar.style.marginLeft = '5px'
            btnEditar.onclick = () => {
                selectVariedad.value = r.variedad
                selectCantidad.value = r.dosis
                selectHorario.value = r.horario
                carrito[0] = { ...r }
                editarId = r.id
                actualizarLista()
            }
            li.appendChild(btnEditar)

            ulReservas.appendChild(li)
        })

    } catch (err) {
        console.error(err)
    }
}

// Inicializar
cargarReservasUsuario()
actualizarLista()