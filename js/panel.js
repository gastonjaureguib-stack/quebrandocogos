// panel.js listo para GitHub Pages
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config-public.js' // Public config
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
let editarId = null

// Actualizar lista de carrito
function actualizarLista() {
    ulReservas.innerHTML = ''
    carrito.forEach(r => {
        const li = document.createElement('li')
        li.textContent = `Variedad: ${r.variedad || '-'}, Dosis: ${r.dosis || '-'}g, Horario: ${r.horario || '-'}`
        ulReservas.appendChild(li)
    })
}

// Eventos selects
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
modal.classList.add('modal')
modal.innerHTML = `
    <div class="modal-content">
        <p>¡Reserva realizada con éxito!</p>
        <button id="cerrar-modal">Aceptar</button>
    </div>
`
document.body.appendChild(modal)
const cerrarModal = document.getElementById('cerrar-modal')
cerrarModal.addEventListener('click', () => { modal.style.display = 'none' })
window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none' })

// Verificar cupos
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
        if (!editarId && cupos >= 4) {
            alert('Horario completo, elige otro')
            return
        }

        if (editarId) {
            // Actualizar
            const { error } = await supabase
                .from('reservas')
                .update({ variedad: reserva.variedad, dosis: reserva.dosis, horario: reserva.horario })
                .eq('id', editarId)
            if (error) throw error
            editarId = null
        } else {
            // Insertar nueva
            const { error } = await supabase
                .from('reservas')
                .insert([{ usuario, ...reserva }])
            if (error) throw error
        }

        carrito = []
        selectVariedad.value = ''
        selectCantidad.value = ''
        selectHorario.value = ''
        actualizarLista()

        modal.style.display = 'flex' // Mostrar modal
        cargarReservasUsuario()
    } catch (err) {
        console.error(err)
        alert('Error al guardar la reserva')
    }
})

// Cargar reservas con botones Editar/Eliminar
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
            li.classList.add('card')
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