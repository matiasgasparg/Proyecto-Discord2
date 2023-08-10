//Creamos la clase usuario
class Usuario {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.imagenUsuarioURL = null; // Nueva propiedad para la imagen del usuario
        this.nombreUsuario = null; // Nueva propiedad para el nombre del usuario
    }

    //Utilizamos async declarar una funcion asyncronica y que el codigo continue
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
                this.id_usuario=data.id_usuario;
                this.img_perfil = data.img_perfil; // Obtener la imagen del usuario
                this.username = data.username; // Obtener el nombre del usuario
                return data; // Devuelve el objeto de respuesta JSON
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

// Función para obtener el ID de usuario desde la respuesta JSON
function obtenerIdUsuarioDeRespuesta(data) {
    return data.idUsuario; // Devuelve el ID del usuario desde la respuesta JSON
}

// Función para manejar el envío del formulario
function handleLoginFormSubmit(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const usuario = new Usuario(email, password);
    usuario.verificarCredenciales()
    .then((data) => {
        if (data) {
            console.log("Respuesta del servidor:", data); // Imprime toda la respuesta JSON
            alert("Inicio de sesión exitoso");
            const id_usuario = data.id_usuario
            localStorage.setItem('idUsuario', id_usuario);

            const imagenUsuarioURL = data.img_perfil;
            const nombreUsuario = data.username;

            // Almacenar la imagen y el nombre del usuario en localStorage
            localStorage.setItem('imagenUsuarioURL', imagenUsuarioURL);
            localStorage.setItem('nombreUsuario', nombreUsuario);

            console.log("Imagen del usuario:", imagenUsuarioURL);
            console.log("Nombre del usuario:", nombreUsuario);

            console.log("ID del usuario:", id_usuario);
            window.location.href = "../servidores.html";

        } else {
            alert("Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    const submitButton = document.getElementById("submit");

    submitButton.addEventListener("click", handleLoginFormSubmit);
});
