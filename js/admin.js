let reservas = JSON.parse(localStorage.getItem("reservas")) || []

const tbody = document.querySelector("#tablaReservas tbody")


function mostrarReservas(){

tbody.innerHTML = ""

reservas.forEach((reserva, index) => {

const fila = document.createElement("tr")

fila.innerHTML = `

<td>${reserva.usuario}</td>
<td>${reserva.dosis}</td>
<td>${reserva.horario}</td>
<td><button onclick="eliminarReserva(${index})">Eliminar</button></td>

`

tbody.appendChild(fila)

})

}


function eliminarReserva(index){

reservas.splice(index,1)

localStorage.setItem("reservas", JSON.stringify(reservas))

mostrarReservas()

}


function cerrarSesion(){

localStorage.removeItem("usuario")
localStorage.removeItem("rol")

window.location.href = "../index.html"

}


mostrarReservas()