// Importamos Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Datos de Supabase
const SUPABASE_URL = 'https://vxnwfabasgdrrtgpmbtj.supabase.co'
const SUPABASE_KEY = 'sb_publishable_gCZWlyJBPR52cvwsy1Wuww_RQ0t0OCT'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Obtener usuario del localStorage
const usuario = localStorage.getItem('usuario')
if (!usuario) {
    window.location.href = 'index.html'
}

// Mostrar bienvenida
document.getElementById('bienvenida').textContent = `Bienvenido ${usuario}`

// Logout
document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('usuario')
    window.location.href = 'index.html'
})

// Cargar reservas
async function cargarReservas() {
    const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('usuario', usuario) // esto funciona si RLS y policies permiten

    const ul = document.getElementById('reservas-ul')
    ul.innerHTML = ''

    if (error) {
        console.error('Error al cargar reservas:', error)
        return
    }

    data.forEach(r => {
        const li = document.createElement('li')
        li.textContent = `Dosis: ${r.dosis}, Horario: ${r.horario}`
        ul.appendChild(li)
    })
}

// Reservar
document.getElementById('form-reserva').addEventListener('submit', async (e) => {
    e.preventDefault()
    const dosis = document.getElementById('dosis').value
    const horario = document.getElementById('horario').value

    const { data, error } = await supabase
        .from('reservas')
        .insert([{ usuario, dosis, horario }])

    if (error) {
        alert('Error al guardar la reserva')
        console.error(error)
    } else {
        document.getElementById('form-reserva').reset()
        cargarReservas()
    }
})

// Inicializamos
cargarReservas()