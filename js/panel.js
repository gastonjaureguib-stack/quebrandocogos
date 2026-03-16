// panel.js – versión final lista para módulo y Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Usuario
const usuario = localStorage.getItem("usuario");
if (!usuario) {
    window.location.href = "index.html";
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
        li.textContent = `${r.dosis} - ${r.horario}`;
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
        const reservasEnHorario = reservas.filter(r => r.horario === horario);
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

    const { data: reservas, error } = await supabase
        .from("reservas")
        .select("*")
        .eq("horario", horario);

    if (error) {
        console.error(error);
        return;
    }

    if (reservas.length >= 4) {
        alert("Este horario está completo. Elegí otro.");
        return;
    }

    const { data, error: insertError } = await supabase
        .from("reservas")
        .insert([{ usuario, dosis, horario }]);

    if (insertError) {
        console.error(insertError);
        alert("Ocurrió un error al guardar la reserva.");
        return;
    }

    alert("Reserva realizada con éxito");

    cargarHorarios();
    mostrarReservas();
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

// Exponer funciones al HTML
window.reservar = reservar;
window.cargarHorarios = cargarHorarios;
window.mostrarReservas = mostrarReservas;
window.cambiarPassword = cambiarPassword;
window.cerrarSesion = cerrarSesion;