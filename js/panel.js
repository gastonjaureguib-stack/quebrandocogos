const usuario = localStorage.getItem("usuario")

if(!usuario){
    window.location.href = "index.html"
}

document.getElementById("bienvenida").textContent =
"Bienvenido " + usuario


let reservas = JSON.parse(localStorage.getItem("reservas")) || []


function reservar(){

const dosis = document.getElementById("dosis").value
const horario = document.getElementById("horario").value

let reservas = JSON.parse(localStorage.getItem("reservas")) || []

const reservasEnHorario = reservas.filter(r => r.horario === horario)

if(reservasEnHorario.length >= 4){

alert("Este horario está completo. Elegí otro.")

return

}

const nuevaReserva = {

usuario: localStorage.getItem("usuario"),
dosis: dosis,
horario: horario

}

reservas.push(nuevaReserva)

localStorage.setItem("reservas", JSON.stringify(reservas))

alert("Reserva realizada con éxito")

mostrarReservas()

cargarHorarios()

}


function cargarHorarios(){

const select = document.getElementById("horario")

let reservas = JSON.parse(localStorage.getItem("reservas")) || []

const horarios = [
"12:00",
"13:00",
"14:00",
"15:00",
"16:00",
"17:00",
"18:00"
]

select.innerHTML = ""

horarios.forEach(horario => {

const reservasEnHorario = reservas.filter(r => r.horario === horario)

const lugaresDisponibles = 4 - reservasEnHorario.length

const option = document.createElement("option")

option.value = horario

if(lugaresDisponibles <= 0){

option.textContent = `${horario} (completo)`
option.disabled = true

}else{

option.textContent = `${horario} (${lugaresDisponibles} lugares)`

}

select.appendChild(option)

})

}

cargarHorarios()
mostrarReservas()