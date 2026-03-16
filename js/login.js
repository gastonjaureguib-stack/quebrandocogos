const formulario = document.getElementById("loginForm")

formulario.addEventListener("submit", function(e){

e.preventDefault()

const usuarioIngresado = document.getElementById("usuario").value
const passwordIngresado = document.getElementById("password").value


const usuarioValido = usuarios.find(user =>

user.usuario === usuarioIngresado &&
user.password === passwordIngresado

)


if(usuarioValido){

localStorage.setItem("usuario", usuarioValido.usuario)
localStorage.setItem("rol", usuarioValido.rol)

if(usuarioValido.cambiarPassword){

window.location.href = "pages/cambiarclave.html"

}else{

if(usuarioValido.rol === "admin"){

window.location.href = "pages/admin.html"

}else{

window.location.href = "pages/panel.html"

}

}

}else{

alert("Usuario o contraseña incorrectos")

}

})