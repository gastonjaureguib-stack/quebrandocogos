// lista de socios (luego esto vendrá de una base de datos)

const usuarios = [
 {usuario:"Gaston", password:"1234"},
 {usuario:"maria", password:"abcd"},
 {usuario:"pedro", password:"5678"}
]

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

    localStorage.setItem("usuario", usuarioIngresado)

    window.location.href = "paneldesocio.html"

 }else{

    alert("Usuario o contraseña incorrectos")

 }

})