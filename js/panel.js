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

const nuevaReserva = {
usuario: usuario,
dosis: dosis,
horario: horario
}

reservas.push(nuevaReserva)

localStorage.setItem("reservas", JSON.stringify(reservas))

mostrarReservas()

}


function mostrarReservas(){

const lista = document.getElementById("listaReservas")

lista.innerHTML = ""

reservas
.filter(r => r.usuario === usuario)
.forEach(reserva => {

const li = document.createElement("li")

li.textContent = reserva.dosis + " - retiro a las " + reserva.horario

lista.appendChild(li)

})

}


function cambiarPassword(){

const nueva = document.getElementById("nuevaPassword").value

alert("Contraseña cambiada (demo)")

}


function cerrarSesion(){

localStorage.removeItem("usuario")

window.location.href = "../index.html"

}


mostrarReservas()

