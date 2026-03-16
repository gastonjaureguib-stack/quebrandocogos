const usuario = localStorage.getItem("usuario")
const rol = localStorage.getItem("rol")

function guardarPassword(){

const nuevaPassword = document.getElementById("nuevaPassword").value

const usuarioEncontrado = usuarios.find(u => u.usuario === usuario)

usuarioEncontrado.password = nuevaPassword
usuarioEncontrado.cambiarPassword = false

alert("Contraseña actualizada correctamente")

if(rol === "admin"){

window.location.href = "admin.html"

}else{

window.location.href = "panel.html"

}

}