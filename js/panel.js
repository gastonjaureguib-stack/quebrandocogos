// panel.js – versión final adaptada para GitHub Pages y módulos
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js"; // ajustá la ruta si es necesario

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Usuario
const usuario = localStorage.getItem("usuario");
if (!usuario) {
    window.location.href = "../index.html"; // GitHub Pages y Live Server
}

document.getElementById("bienvenida").textContent = "Bienvenido " + usuario;

// Función para mostrar reservas
async function mostrarReservas() {
    const { data: reservas, error } = await supabase
        .from("reservas")
        .select("*")
        .eq("usuario", usuario);

    if (error) {
        console.error(error);
        return;
    }

    const lista = document.getElementById("listaReservas");
    lista.innerHTML = "";

    reservas.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `${r.dosis} - ${r.horarios}`; // cambio horario → horarios
        lista.appendChild(li);
    });
}

// Función para cargar horarios disponibles
async function cargarHorarios() {
    const select = document.getElementById("horario");
    const horarios = ["12:00","13:00","14:00","15:00","16:00","17:00","18:00"];

    const { data: reservas, error } = await supabase.from("reservas").select("*");

    if (error) {
        console.error(error);
        return;
    }

    select.innerHTML = "";

    horarios.forEach(horario => {
        const reservasEnHorario = reservas.filter(r => r.horarios === horario); // horario → horarios
        const lugaresDisponibles = 4 - reservasEnHorario.length;

        const option = document.createElement("option");
        option.value = horario;

        if (lugaresDisponibles <= 0) {
            option.textContent = `${horario} (completo)`;
            option.disabled = true;
        } else {
            option.textContent = `${horario} (${lugaresDisponibles} lugares)`;
        }

        select.appendChild(option);
    });
}

// Función para reservar
async function reservar() {
    const dosis = document.getElementById("dosis").value;
    const horario = document.getElementById("horario").value;

    // Verificar cupo
    const { data: reservas, error } = await supabase
        .from("reservas")
        .select("*")
        .eq("horarios", horario); // cambio horario → horarios

    if (error) {
        console.error(error);
        return;
    }

    if (reservas.length >= 4) {
        alert("Este horario está completo. Elegí otro.");
        return;
    }

    // Insertar reserva
    const { data, error: insertError } = await supabase
        .from("reservas")
        .insert([{ usuario, dosis, horarios: horario }]); // cambio horario → horarios

    if (insertError) {
        console.error(insertError);
        alert("Ocurrió un error al guardar la reserva.");
        return;
    }

    alert("Reserva realizada con éxito");

    await cargarHorarios(); // recargar horarios
    await mostrarReservas(); // mostrar reservas actualizadas
}

// Funciones de contraseña y sesión
function cambiarPassword() {
    alert("Función de cambiar contraseña aún no integrada con Supabase Auth.");
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
}

// Inicialización
cargarHorarios();
mostrarReservas();

// 🔹 Vincular botones con addEventListener (GitHub Pages friendly)
document.getElementById("btnReservar").addEventListener("click", reservar);
document.getElementById("btnCambiarPassword").addEventListener("click", cambiarPassword);
document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion);