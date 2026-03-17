const usuario = localStorage.getItem("usuario")
const rol = localStorage.getItem("rol")

function guardarPassword() {
    // Obtener el valor del input y eliminar espacios al inicio/final
    const nuevaPassword = document.getElementById("nuevaPassword").value.trim()

    // Validación: no puede estar vacío
    if (!nuevaPassword) {
        alert("Debes ingresar una nueva contraseña")
        return
    }

    // Buscar usuario y actualizar
    const usuarioEncontrado = usuarios.find(u => u.usuario === usuario)
    if (!usuarioEncontrado) {
        alert("Usuario no encontrado")
        return
    }

    usuarioEncontrado.password = nuevaPassword
    usuarioEncontrado.cambiarPassword = false

    alert("Contraseña actualizada correctamente")

    // Redirigir según rol
    if (rol === "admin") {
        window.location.href = "admin.html"
    } else {
        window.location.href = "panel.html"
    }
}