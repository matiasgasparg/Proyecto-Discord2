const BASE_URL = "https://matiasgasparg.pythonanywhere.com"; // Cambiar esta dirección si es necesario

document.addEventListener('DOMContentLoaded', () => {
    const idUsuario = localStorage.getItem('idUsuario');
    const userImage = document.getElementById('userImage');
    const userName = document.getElementById('userName');
    const userFullName = document.getElementById('userFullName');
    const userEmail = document.getElementById('userEmail');
    const editImageButton=document.getElementById('editImageButton');
    const updateImageButton=document.getElementById('updateImageButton');
    const volver=document.getElementById('volver');
    // Utilizamos la API fetch para obtener los datos del usuario desde el servidor
    fetch(`${BASE_URL}/users/${idUsuario}`)
        .then(response => response.json())
        .then(userData => {
            // Actualiza los valores en la página con los datos obtenidos del servidor
            userImage.src = userData.img_perfil || 'imagen_predeterminada.png';
            userName.textContent = userData.username;
            userFullName.textContent = userData.name;
            userEmail.textContent = userData.email;
            // Almacenar la imagen y el nombre del usuario en localStorage
            const imagenUsuarioURL = userData.img_perfil;
            const nombreUsuario = userData.username;
            localStorage.setItem('imagenUsuarioURL', imagenUsuarioURL);
            localStorage.setItem('nombreUsuario', nombreUsuario);
        })
        .catch(error => {
            console.error('Error al obtener los datos del usuario:', error);
            // Manejo de errores aquí (por ejemplo, mostrar un mensaje al usuario)
        });

    // Agrega los controladores de eventos para la edición
    const editUserNameButton = document.getElementById('editUserName');
    const editFullNameButton = document.getElementById('editFullName');
    const editEmailButton = document.getElementById('editEmail');
    const changePasswordButton = document.getElementById('changePassword');

    volver.addEventListener('click', () => {
        location.href = 'servidores.html';
    });
    editUserNameButton.addEventListener('click', () => {
        const newUserName = prompt('Ingrese el nuevo nombre de usuario:');
        if (newUserName !== null) {
            actualizarCampoUsuario(idUsuario, 'username', newUserName);
        }
    });
    
    editFullNameButton.addEventListener('click', () => {
        const newFullName = prompt('Ingrese el nuevo nombre completo:');
        if (newFullName !== null) {
            actualizarCampoUsuario(idUsuario, 'name', newFullName);
        }
    });
    
    editEmailButton.addEventListener('click', () => {
        const newEmail = prompt('Ingrese el nuevo email:');
        if (newEmail !== null) {
            actualizarCampoUsuario(idUsuario, 'email', newEmail);
        }
    });
    
    changePasswordButton.addEventListener('click', () => {
        const newPassword = prompt('Ingrese la nueva contraseña:');
        if (newPassword !== null) {
            actualizarCampoUsuario(idUsuario, 'password', newPassword);
        }
    });
    // Abre el modal cuando se hace clic en el botón de edición de imagen
    editImageButton.addEventListener('click', () => {
        imageModal.style.display = 'block';
    });
    
    // Cierra el modal cuando se hace clic en la "X"
    closeModal.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });
    
    updateImageButton.addEventListener('click', () => {
        const newImage = newImageInput.files[0];
        if (newImage) {
            const formData = new FormData();
            formData.append('photo', newImage); // Utiliza 'photo' como clave para la imagen
    
            const url = `${BASE_URL}/upload/${idUsuario}`;
            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.message === 'Imagen subida correctamente') {
                    alert('Imagen de usuario actualizada exitosamente.');
                    userImage.src = result.imagePath; // Actualiza la imagen en la página
                    imageModal.style.display = 'none'; // Cierra el modal
                    location.reload(); // Recargar la página para mostrar los cambios actualizados

                } else {
                    alert('Error al actualizar imagen de usuario.');
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                alert('Error en la solicitud. Consulta la consola para más detalles.');
            });
        }
    });
});
function actualizarCampoUsuario(idUsuario, campo, nuevoValor) {
    const url = `${BASE_URL}/users/${idUsuario}`;
    const data = {
        field: campo,
        value: nuevoValor
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log(result); // Agrega este console.log para ver la respuesta del servidor
        if (result.message.includes('actualizado exitosamente')) {
            alert('Usuario actualizado exitosamente.');
            location.reload(); // Recargar la página para mostrar los cambios actualizados
        } else {
            alert('Error al actualizar usuario.');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud. Consulta la consola para más detalles.');
    });

}

