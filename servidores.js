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
        this.init();
    }

    init() {
        this.createServerButton.addEventListener('click', () => {
            console.log("Botón 'Crear servidor nuevo' clickeado");
            this.modal.style.display = 'block';
        });

        this.searchButton.addEventListener('click', () => {
            this.modal.style.display = 'block';
        });
        this.closeChannelModalButton.addEventListener('click',()=>{
            console.log("Boton'Cerrar Canal model'clickeado");
            this.closeChannelModal();

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
        this.selectedServerId = null; // Propiedad para almacenar el ID del servidor seleccionado
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
            this.channelList.addEventListener('click', (event) => {
                if (event.target.classList.contains('channel-item')) {
                    const channelId = event.target.getAttribute('data-channel-id');
                    this.cargarMensajesCanal(channelId);
                }
            });
    }
        

    async cargarMensajesCanal(idCanal) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/canal/${idCanal}`);
            if (!response.ok) {
                throw new Error('Error al obtener los mensajes del canal');
            }
            const mensajes = await response.json();
    
            // Limpiar la lista de mensajes
            const messagesList = document.getElementById('messagesList');
            messagesList.innerHTML = '';
    
            if (mensajes.length === 0) {
                const noMessagesMessage = document.createElement('div');
                noMessagesMessage.textContent = 'No hay mensajes en este canal';
                messagesList.appendChild(noMessagesMessage);
            } else {
                // Mostrar los mensajes en la lista
                mensajes.forEach((mensaje) => {
                    const messageItem = document.createElement('div');
                    messageItem.classList.add('message-item');
                    messageItem.textContent = mensaje.mensaje; // Aquí se ajusta a mensaje.mensaje
                    messagesList.appendChild(messageItem);
                });
            }
    
            // Mostrar la columna sidebar2 con los mensajes del canal
            const sidebar2 = document.querySelector('.sidebar2');
            sidebar2.style.display = 'block';
        } catch (error) {
            console.error('Error al cargar mensajes del canal:', error);
        }
    }
    
    async crearServidor(serverName, serverDescription) {
        const idUsuario = localStorage.getItem('idUsuario');
        const url = `http://127.0.0.1:5000/users/${idUsuario}/servers`;

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
        
        const response = await fetch(`http://127.0.0.1:5000/users/servers/${idUsuario}`);
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
                const url = `http://127.0.0.1:5000/users/${idUsuario}/servidores/${idServidor}/canales`;
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
        const response = await fetch(`http://127.0.0.1:5000/users/servers/${idUsuario}/${idServidor}`);
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
        // Limpiar el contenido del contenedor de botones de servidores antes de mostrar los nuevos
        const serverButtonsContainer = document.querySelector('.server-buttons-container');
        serverButtonsContainer.innerHTML = '';
    
        // Recorrer la matriz de servidores y mostrar cada servidor en un botón
        servidores.forEach((servidorInfo) => {
            const [idServidor, nombre, descripcion] = servidorInfo;

            // Crear un botón para cada servidor con el nombre y el atributo data-id
            const button = document.createElement('button');
            button.classList.add('sv-item');
            button.textContent = nombre;
            button.setAttribute('data-id', idServidor);
            serverButtonsContainer.appendChild(button);
    
            // Agregar evento de clic a cada botón de servidor
            button.addEventListener('click', () => {
                // Remover la clase "selected" de todos los botones de servidores
                serverButtonsContainer.querySelectorAll('.sv-item').forEach((svButton) => {
                    svButton.classList.remove('selected');
                });
    
                // Agregar la clase "selected" al botón del servidor seleccionado
                button.classList.add('selected');
    
                // Cargar los canales del servidor seleccionado
                            
                this.cargarCanalesServidor(idServidor);
            });
        });
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
                    console.log("Canal:", canal); // Agrega esta línea para depurar

                    const channelItem = document.createElement('button');
                    channelItem.classList.add('channel-item');
                    channelItem.textContent = canal.nombre.trim();
                    channelItem.setAttribute('data-channel-id', canal.idCanal); // Aquí asignamos el ID del canal
                    this.channelList.appendChild(channelItem);
                });
                // Mostrar el sidebar con los canales del servidor seleccionado
                this.sidebar.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al obtener los canales del servidor:', error);
        }
    }
    
    // Función para mostrar el modal de creación de canal
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
