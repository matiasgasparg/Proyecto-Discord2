// datos.js
//Creamos la clase usuario
class Usuario {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
//Utilizamos async declarar una funcion asyncronica y que el condigo continue
    async verificarCredenciales() {
        try {
            //Hacemos la llamada al backend y utilizamos wait para esperar la respuesta y que continue cuando haya respuesta
            const respuesta = await fetch("http://127.0.0.1:5000/users/login", {
                //Declaramos el metodo de llamada, el encabezado , y convertimos los datos en lineas JSON, con stringfy
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: this.email,
                    password: this.password
                })
            });

            if (!respuesta.ok) {
                throw new Error("Error al realizar la solicitud.");
            }

            const data = await respuesta.json();

            // Verifica si el inicio de sesión fue exitoso
            if (data.message === "Login successful") {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

// Función para manejar el envío del formulario
function handleLoginFormSubmit(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const usuario = new Usuario(email, password);

    usuario.verificarCredenciales()
        .then((isAuthenticated) => {
            if (isAuthenticated) {
                alert("Inicio de sesión exitoso");
            } else {
                alert("Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.");
            }
        })
        .catch((error) => {
            console.error(error);
            alert("Ocurrió un error al realizar la autenticación. Inténtalo de nuevo más tarde.");
        });
}

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    const submitButton = document.getElementById("submit");
    submitButton.addEventListener("click", handleLoginFormSubmit);
});
