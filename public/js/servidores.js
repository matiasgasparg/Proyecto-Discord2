const BASE_URL = "https://matiasgasparg.pythonanywhere.com"; // Cambiar esta dirección si es necesario

class DiscordApp {
    constructor() {
        this.modal = document.getElementById('createServerModal');
        this.closeModalButton = document.getElementById('closeModalButton');
        this.serverForm = document.getElementById('serverForm');
        this.serverList = document.getElementById('serverList');
        this.createServerButton = document.getElementById('createServerButton');
        this.sidebar = document.querySelector('.sidebar');
        this.channelList = document.getElementById('channelList');
        this.searchButton = document.getElementById('searchButton');
        this.createChannelButton = document.getElementById('channelCreate');
        this.channelForm=document.getElementById('channelForm');
        this.createChannelModal = document.getElementById('createChannelModal');
        this.closeChannelModalButton = document.getElementById('closeChannelModalButton');
        this.messagesCreate=document.getElementById('messagesCreate');
        this.closeSearchModalButton=document.getElementById('closeSearchModalButton')
        this.searchServerForm = document.getElementById('searchServerForm');

        const imagenUsuarioURL = localStorage.getItem('imagenUsuarioURL');
        const nombreUsuario = localStorage.getItem('nombreUsuario');
    
        // Verificar si la imagen y el nombre del usuario están en el almacenamiento local
        if (imagenUsuarioURL && nombreUsuario) {
            const userImage = document.getElementById('userImage');
            const userName = document.getElementById('userName');
            if (!userImage=='null'){
        
                userImage.src = imagenUsuarioURL;
            }
            else{ 
                userImage.src = 'imagen_predeterminada.png';
            }
            userName.textContent = nombreUsuario;
        }
    
        this.init();
    }

    init() {
        this.createServerButton.addEventListener('click', () => {
            console.log("Botón 'Crear servidor nuevo' clickeado");
            this.modal.style.display = 'block';
        });

          this.searchButton.addEventListener('click', () => {
            const sidebar2 = document.querySelector('.sidebar2');
            const sidebar3=document.querySelector('.sidebar3')
            sidebar2.style.display = 'none';
            sidebar3.style.display='none';
            this.openSearchModal();
        });
        this.closeSearchModalButton.addEventListener('click', () => {
            this.closeSearchModal();

        });
        this.closeChannelModalButton.addEventListener('click',()=>{
            console.log("Boton'Cerrar Canal model'clickeado");
            this.closeChannelModal();

        });
        
        this.searchServerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const serverNameSearch = document.getElementById('serverNameSearch').value;

            console.log("Nombre del servidor a buscar:", serverNameSearch);

            // Realizar la búsqueda utilizando el serverNameSearch
            this.buscarServidoresPorNombre(serverNameSearch);


            this.closeSearchModal();
        });
        const messagesCreate = document.getElementById('messagesCreate');
        messagesCreate.addEventListener('click', async () => {
            const mensajeInput = document.getElementById('messageInput');
            const mensaje = mensajeInput.value;
        
            if (mensaje.trim() !== '') {
                const idUsuario = localStorage.getItem('idUsuario');
                const idServidor = this.selectedServerId;
                const idCanal = this.selectedChannelId;
        
                await this.enviarMensaje(idUsuario, idServidor, idCanal, mensaje);
                
                // Limpiar el contenido del textarea después de enviar el mensaje
                mensajeInput.value = '';
            } else {
                console.error('El mensaje está vacío');
            }
        });
        

        const idUsuario = localStorage.getItem('idUsuario');
        console.log("ID del usuario:", idUsuario);

        if (idUsuario) {
            this.obtenerServidoresPorUsuario(idUsuario)
                .then((servidores) => {
                    console.log("Servidores obtenidos:", servidores);
                    this.mostrarServidores(servidores);
                })
                .catch((error) => {
                    console.error("Error al obtener los servidores:", error);
                });
        }
        this.serverList.querySelectorAll('.sv-item:not(#createServerButton):not(#searchButton)').forEach((button) => {
            button.addEventListener('click', () => {
                const servidorId = button.getAttribute('data-id');
                const servidorNombre = button.textContent;
                console.log(`Botón '${servidorNombre}' clickeado (ID: ${servidorId})`);
                this.selectedServerId = servidorId; // Almacena el ID del servidor seleccionado

                this.cargarCanalesServidor(servidorId, servidorNombre);
            });
        });
        // Evento de clic para el botón "Crear Canal Nuevo"
        this.createChannelButton.addEventListener('click', () => {
            this.showCreateChannelModal();
        });

        this.closeModalButton.addEventListener('click', () => {
            console.log("Botón 'Cancelar' clickeado");
            this.closeModal();
        });
        this.channelList.addEventListener('click', (event) => {
            if (event.target.classList.contains('channel-item')) {
                const channelId = event.target.getAttribute('data-channel-id');
                this.selectedChannelId= channelId;
                this.cargarMensajesCanal(channelId);
            }
        });
     
        
        

        this.serverForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const serverName = document.getElementById('serverName').value;
            const serverDescription = document.getElementById('serverDescription').value;

            console.log("Nombre del servidor:", serverName);
            console.log("Descripción del servidor:", serverDescription);

            this.crearServidor(serverName, serverDescription);
        });
        this.channelForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const channelName = document.getElementById('channelName').value;
            console.log("Nombre del canal:", channelName);

            this.crearChannel(channelName);
        
            });
    
    }
    openSearchModal() {
        const searchServerModal = document.getElementById('searchServerModal');
        searchServerModal.style.display = 'block';
    }   
     closeSearchModal() {
        const searchServerModal = document.getElementById('searchServerModal');
        searchServerModal.style.display = 'none';
        const searchServerForm = document.getElementById('searchServerForm');
        searchServerForm.reset();
    }

    async buscarServidoresPorNombre(nombre) {
        try {
            const response = await fetch(`${BASE_URL}/servers/${nombre}`);
            if (!response.ok) {
                throw new Error('No se ha encontrado el servidor');
            }
    
            const foundServer = await response.json();
            console.log("Servidor encontrado:", foundServer);
            
            // Obtén el contenedor donde se mostrarán los detalles del servidor encontrado
            const serverDetailsContainer = document.querySelector('.sidebar3');
            serverDetailsContainer.innerHTML = '';
    
            // Mostrar los detalles del servidor encontrado
            const serverDetails = document.createElement('button');
            serverDetails.classList.add('server-details');
            serverDetails.innerHTML = `
                <h3>Detalles del servidor encontrado:</h3>
                <p>Nombre: ${foundServer.nombre}</p>
                <p>Descripción: ${foundServer.descripcion}</p>
                <p>Cantidad de usuarios: ${foundServer.cantidad_usuarios}</p>
            `;
            
            serverDetails.addEventListener('click', () => {
                this.unirmeServidor(foundServer.idservidor);
            });
            serverDetailsContainer.appendChild(serverDetails);
            serverDetailsContainer.style.display = 'block'; // Mostrar la columna contigua

            const sidebar = document.querySelector('.sidebar');
            const sidebar2 = document.querySelector('.sidebar2');
            sidebar.style.display='none';
            sidebar2.style.display='none';
    
        } catch (error) {
            console.error("Error al buscar el servidor:", error);
            // En caso de error, obtener todos los servidores
            try {
                const responseAll = await fetch(`${BASE_URL}/servers`);
                if (!responseAll.ok) {
                    throw new Error('Error al obtener todos los servidores');
                }
    
                const allServers = await responseAll.json();
                console.log("Todos los servidores:", allServers);
    
                //  mostrar o utilizar todos los servidores obtenidos como necesites
                const foundServersContainer = document.querySelector('.sidebar3');
                foundServersContainer.innerHTML = '';
                
                 allServers.forEach(foundServer => {
                const serverItem = document.createElement('button');
                serverItem.classList.add('sv-item2');
                serverItem.innerHTML = `
                <h3>Detalles del servidor encontrado:</h3>
                <p>Nombre: ${foundServer.nombre}</p>
                <p>Descripción: ${foundServer.descripcion}</p>
                <p>Cantidad de usuarios: ${foundServer.cantidad_usuarios}</p>
            `;
                serverItem.addEventListener('click', () => {
                    this.unirmeServidor(foundServer.idservidor);

                });
                foundServersContainer.appendChild(serverItem);
                foundServersContainer.style.display='block'
            });

                const serverDetailsContainer = document.querySelector('.found-servers-container');
                serverDetailsContainer.style.display = 'none';




            } catch (error) {
                console.error("Error al obtener todos los servidores:", error);
            }
        }
    }
     
    
        async unirmeServidor(idServidor) {
            const idUsuario = localStorage.getItem('idUsuario');
            
            if (idUsuario && idServidor) {
                try {
                    const url = `${BASE_URL}/servers/${idUsuario}/${idServidor}`;
                    
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
        
                    const data = await response.json();
                    
                    if (response.status === 200) {
                        console.log(data.message); // Unión exitosa

                        this.actualizarServidores(); // Llamar a actualizarServidores después de una unión exitosa
                        console.log('Actualizacion columna servidor') 
                    } else if (response.status === 409) {
                        console.error(data.message); // Usuario ya es miembro del servidor
                        alert(data.message);

                    } else {
                        console.error(data.message); // Otro error al unirse
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                }
            } else {
                console.error('ID de usuario o ID de servidor no proporcionado.');
            }
        }
    
        
        async cargarMensajesCanal(idCanal) {
            try {
                const idUsuario = localStorage.getItem('idUsuario'); // Obtener el idUsuario logeado
                const response = await fetch(`${BASE_URL}/channels/${idCanal}`);
                
                if (!response.ok) {
                    throw new Error('Error al obtener los mensajes del canal');
                }
                
                const mensajes = await response.json();
        
                // Ordenar los mensajes por fecha de manera ascendente (más antiguo a más nuevo)
                mensajes.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
        
                // Limpiar la lista de mensajes
                const messagesList = document.getElementById('messagesList');
                messagesList.innerHTML = '';
        
                if (mensajes.length === 0) {
                    const noMessagesMessage = document.createElement('div');
                    noMessagesMessage.textContent = 'No hay mensajes en este canal';
                    messagesList.appendChild(noMessagesMessage);
                } else {
                    mensajes.forEach((mensaje) => {
                        const messageContainer = document.createElement('div');
                        messageContainer.classList.add('message-container');
        
                        // Agregar la imagen del usuario o la imagen predeterminada
                        const userImage = document.createElement('img');
                        userImage.classList.add('user-image');
                        userImage.alt = 'Imagen del usuario';
                        userImage.src = mensaje.imagen ? mensaje.imagen : 'imagen_predeterminada.png';
                        messageContainer.appendChild(userImage);
        
                        const messageContent = document.createElement('div');
                        messageContent.classList.add('message-content');
        
                        // Agregar el nombre del usuario
                        const userName = document.createElement('div');
                        userName.classList.add('user-name');
                        userName.textContent = mensaje.usuario;
                        messageContent.appendChild(userName);
        
                        // Agregar la fecha y hora
                        const messageDateTime = document.createElement('div');
                        messageDateTime.classList.add('message-datetime');
                        messageDateTime.textContent = mensaje.fecha_hora;
                        messageContent.appendChild(messageDateTime);
        
                        // Agregar el contenido del mensaje
                        const messageText = document.createElement('div');
                        messageText.classList.add('message-text');
                        messageText.textContent = mensaje.mensaje;
                        messageContent.appendChild(messageText);
        
                        // Agregar el botón de editar solo si el idUsuario coincide con el id_usuario del mensaje
                        if (mensaje.id_usuario === parseInt(idUsuario)) {
                            const editButton = document.createElement('button');
                            editButton.classList.add('edit-button');
                            editButton.textContent = 'Editar';
                            editButton.addEventListener('click', () => {
                                this.abrirCampoEdicion(messageContent, mensaje.idchat, mensaje.mensaje);
                            });
                            messageContent.appendChild(editButton);
                        }
        
                        messageContainer.appendChild(messageContent);
                        messagesList.appendChild(messageContainer);
                    });
                }
        
                // Mostrar la columna sidebar2 con los mensajes del canal
                const sidebar2 = document.querySelector('.sidebar2');
                sidebar2.style.display = 'block';
            } catch (error) {
                console.error('Error al cargar mensajes del canal:', error);
            }
        }
        
    abrirCampoEdicion(messageContent, idMensaje, contenido) { // Recibe messageContent como parámetro
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = contenido;
    
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Guardar';
        saveButton.addEventListener('click', () => {
            this.guardarEdicionMensaje(idMensaje, editInput.value);
        });
    
        messageContent.innerHTML = ''; // Limpia el contenido anterior del mensaje
        messageContent.appendChild(editInput);
        messageContent.appendChild(saveButton);
    }

    async guardarEdicionMensaje(idMensaje, nuevoContenido) {
        const idUsuario = localStorage.getItem('idUsuario');
        const idServidor = this.selectedServerId;
        const idCanal=this.selectedChannelId
    
    try {
        const response = await fetch(`${BASE_URL}/messages/${idUsuario}/${idCanal}/${idMensaje}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nuevo_mensaje: nuevoContenido,
            }),
        });

        if (response.ok) {
            console.log('Mensaje editado correctamente');
            // Actualiza los mensajes del canal después de editar
            this.cargarMensajesCanal(this.selectedChannelId);
        } else {
            console.error('Error al editar el mensaje');
        }
    } catch (error) {
        console.error('Error al editar el mensaje:', error);
    }
}

    
    async enviarMensaje(idUsuario, idServidor, idCanal, mensaje) {
        if (idUsuario && idServidor && idCanal) {
            try {
                const url = `${BASE_URL}/messages/${idUsuario}/${idServidor}/${idCanal}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mensaje: mensaje,
                    }),
                });
    
                if (response.ok) {
                    console.log('Mensaje enviado correctamente');
                    // Solo carga mensajes si el ID del canal está definido
                    if (this.selectedChannelId) {
                        this.cargarMensajesCanal(this.selectedChannelId);
                    }
                } else {
                    console.error('Error al enviar el mensaje');
                }
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
            }
        } else {
            console.error('Faltan datos para enviar el mensaje');
        }
    }

    async crearServidor(serverName, serverDescription) {
        const idUsuario = localStorage.getItem('idUsuario');
        const url = `${BASE_URL}/servers/${idUsuario}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: serverName,
                    descripcion: serverDescription,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el servidor');
            }

            this.closeModal();
            this.actualizarServidores();
        } catch (error) {
            console.error('Error al crear el servidor:', error);
        }
    }


    async obtenerServidoresPorUsuario(idUsuario) {
        
        const response = await fetch(`${BASE_URL}/servers/${idUsuario}`);
        console.log(idUsuario)
        if (!response.ok) {
            throw new Error('Error al obtener los servidores del usuario');
        }
        return await response.json();
    }
    async crearChannel(channelName) {
        const idUsuario = localStorage.getItem('idUsuario');
        const idServidor = this.selectedServerId;
    
        if (idServidor) {
            try {
                const url = `${BASE_URL}/channels/${idUsuario}/${idServidor}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre: channelName,
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Error al crear el Canal');
                }
    
                this.closeChannelModal();
                this.actualizarCanales(); // Actualiza la lista de canales
            } catch (error) {
                console.error('Error al crear el canal:', error);
            }
        } else {
            console.error('ID del servidor no definido al intentar crear el canal');
        }
    }
    

    async obtenerCanalesPorServidor(idUsuario, idServidor) {
        const response = await fetch(`${BASE_URL}/servers/${idUsuario}/${idServidor}`);
        if (!response.ok) {
            if (response.status === 404) {
                // Retornar un array vacío en caso de error 404 (no se encontraron canales)
                return [];
            } else {
                throw new Error('Error al obtener los canales del servidor');
            }
        }
        return await response.json();
    }

    mostrarServidores(servidores) {
        const serverButtonsContainer = document.querySelector('.server-buttons-container');
        serverButtonsContainer.innerHTML = '';
    
        servidores.forEach((servidorInfo) => {
            const [idServidor, nombre, descripcion] = servidorInfo;
    
            const button = document.createElement('button');
            button.classList.add('sv-item');
            button.textContent = nombre;
            button.setAttribute('data-id', idServidor);
            serverButtonsContainer.appendChild(button);
    
            button.addEventListener('click', () => {
                serverButtonsContainer.querySelectorAll('.sv-item').forEach((svButton) => {
                    svButton.classList.remove('selected');
                });
    
                const userImageURL = localStorage.getItem('imagenUsuarioURL');
                const userNameText = localStorage.getItem('nombreUsuario');
                const userImage = document.getElementById('userImage');
                const userName = document.getElementById('userName');
                
                if (userImageURL !== 'null') {
                    userImage.src = userImageURL;
                } else {
                    userImage.src = 'imagen_predeterminada.png';
                }        
                
                userName.textContent = userNameText ? userNameText : 'Nombre de Usuario';
                button.classList.add('selected');
                
                this.cargarCanalesServidor(idServidor);
            });
        });
    
        const userCard = document.querySelector('.user-card');
        userCard.addEventListener('click', () => {
            this.editarDatosUsuario();
        });
        userCard.style.cursor = 'pointer';
    
        const userImageURL = localStorage.getItem('imagenUsuarioURL');
        const userNameText = localStorage.getItem('nombreUsuario');
        const userImage = document.getElementById('userImage');
        const userName = document.getElementById('userName');
        
        if (userImageURL !== 'null') {
            userImage.src = userImageURL;
        } else {
            userImage.src = 'imagen_predeterminada.png';
        }        
        
        userName.textContent = userNameText ? userNameText : 'Nombre de Usuario';
    }
    
     editarDatosUsuario() {
        // Aquí puedes implementar la lógica para editar los datos del usuario
        // Por ejemplo, abrir un modal de edición o redirigir a una página de edición
        console.log('Editar datos de usuario');
        window.location.href = "./editarUser.html"; // Redireccionar a la página de servidores

    }
     actualizarServidores() {
        const idUsuario = localStorage.getItem('idUsuario');
        console.log("ID del usuario:", idUsuario);

        if (idUsuario) {
            this.obtenerServidoresPorUsuario(idUsuario)
                .then((servidores) => {
                    console.log("Servidores obtenidos:", servidores);
                    this.mostrarServidores(servidores);
                })
                .catch((error) => {
                    console.error("Error al obtener los servidores:", error);
                });
        }
    }
    actualizarCanales() {
        const idUsuario = localStorage.getItem('idUsuario');
        const idServidor = this.selectedServerId; // Obtén el ID del servidor seleccionado
        
        if (idUsuario && idServidor) { // Verifica si hay un servidor y canal seleccionado
            this.obtenerCanalesPorServidor(idUsuario, idServidor)
                .then((canales) => {
                    console.log('Canales obtenidos: ', canales);
                    this.mostrarCanales(canales); // Llama a una nueva función para mostrar los canales
                })
                .catch((error) => {
                    console.error("Error al obtener los canales:", error);
                });
        }
    }
    mostrarCanales(canales) {
        // Limpiar la lista de canales
        this.channelList.innerHTML = '';
    
        if (canales.length === 0) {
            const noCanalesMessage = document.createElement('div');
            noCanalesMessage.textContent = 'No hay canales';
            this.channelList.appendChild(noCanalesMessage);
        } else {
            // Mostrar los canales en la lista
            canales.forEach((canal) => {

                const channelItem = document.createElement('button');
                channelItem.classList.add('channel-item');
                channelItem.textContent = canal.nombre.trim();
                channelItem.setAttribute('data-channel-id', canal.idCanal); // Asignar el ID del canal aquí
                this.channelList.appendChild(channelItem);
            });
    
            // Mostrar el sidebar con los canales del servidor seleccionado
            this.sidebar.style.display = 'block';
        }
    }
    async cargarCanalesServidor(servidorId) {
        this.selectedServerId = servidorId; // Establecer el ID del servidor seleccionado
        console.log("cargarCanalesServidor - servidorId:", servidorId);
    
        // Ocultar el sidebar al cambiar de servidor
        const sidebar2 = document.querySelector('.sidebar2');
        const sidebar3=document.querySelector('.sidebar3')
        sidebar2.style.display = 'none';
        sidebar3.style.display='none';
        
    
        // Obtener el ID del usuario desde localStorage (o de donde lo obtengas)
        const idUsuario = localStorage.getItem('idUsuario');
    
        try {
            const canales = await this.obtenerCanalesPorServidor(idUsuario, servidorId);
            console.log("Canales obtenidos:", canales); // Mensaje de depuración
    
            // Limpiar la lista de canales (opcional, dependiendo de tu lógica)
            this.channelList.innerHTML = '';
    
            if (canales.length === 0) {
                // Si no hay canales, mostrar un mensaje y el botón "Crear Canal"
                const noCanalesMessage = document.createElement('div');
                noCanalesMessage.textContent = 'No hay canales';
                this.channelList.appendChild(noCanalesMessage);
    
                // Mostrar el sidebar con el mensaje "No hay canales" y el botón "Crear Canal"
                this.sidebar.style.display = 'block';
            } else {
                // Si hay canales, recorrer y muestra los canales en el sidebar
                canales.forEach((canal) => {
                    const channelItem = document.createElement('button');
                    channelItem.classList.add('channel-item');
                    channelItem.textContent = canal.nombre.trim();
                    channelItem.setAttribute('data-channel-id', canal.idCanal);
                    channelItem.addEventListener('click', () => {
                        this.selectedChannelId = canal.idCanal; // Almacena el ID del canal seleccionado
                        this.cargarMensajesCanal(canal.idCanal);
                    });
                    this.channelList.appendChild(channelItem);
                });
                // Mostrar el sidebar con los canales del servidor seleccionado
                this.sidebar.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al obtener los canales del servidor:', error);
        }
    }
    
    // Función para mostrar el modal de creación de canalc
    showCreateChannelModal() {
        const createChannelModal = document.getElementById('createChannelModal');
        createChannelModal.style.display = 'block';
    
        // Aquí puedes asignar el ID del servidor al formulario de creación de canal
        const channelForm = document.getElementById('channelForm');
        channelForm.setAttribute('data-server-id', this.selectedServerId);
    }

    closeChannelModal() {
        const createChannelModal = document.getElementById('createChannelModal');
        createChannelModal.style.display = 'none';
        console.log("Botón 'Cerrar' clickeado");
        this.channelForm.reset();
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.serverForm.reset();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new DiscordApp();
});
