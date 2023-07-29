class Usuario {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    verificarCredenciales() {
        // Verifica las credenciales del usuario (esto es solo un ejemplo)
        return this.email === "matiasgasparg@gmail.com" && this.password === "contraseña";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

        // Obtiene los valores del formulario
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Crea una instancia del usuario con los valores ingresados
        const usuario = new Usuario(email, password);

        // Verifica las credenciales utilizando el método de la clase Usuario
        if (usuario.verificarCredenciales()) {
            alert("Inicio de sesión exitoso");
        } else {
            alert("Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.");
        }
    });
});