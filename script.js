"use strict";

let bd;

const iniciarBD = () => {
    const peticion = indexedDB.open("mrsPcs", 1);
    peticion.addEventListener("error", mostrarError);
    peticion.addEventListener("success", comenzar);
    peticion.addEventListener("upgradeneeded", crearAlmacenes);

    const btnGuardarCliente = document.querySelector(".cont-btn-enviar-cliente > button");
    const btnEditarCliente = document.querySelector(".btn-editar");

    const btnGuardarProducto = document.querySelector(".cont-btn-enviar-producto > button");
    const btnEditarProducto = document.querySelector(".btn-editar-producto");

    // Evento de clic para el botón de guardar cliente
    btnGuardarCliente.addEventListener("click", function (event) {
        event.preventDefault(); // Evita que el formulario se envíe al hacer clic en el botón
        const key = this.getAttribute("data-key"); // Obtener la clave del atributo de datos
        if (this.textContent === "Guardar") {
            ingresarCliente();
        } else if (this.textContent === "Actualizar") {
            editarCliente(key);
        }
    });

        // Evento de clic para el botón de guardar producto
    btnGuardarProducto.addEventListener("click", function (event) {
        event.preventDefault(); // Evita que el formulario se envíe al hacer clic en el botón
        const key = this.getAttribute("data-key"); // Obtener la clave del atributo de datos
        if (this.textContent === "Guardar") {
            ingresarProducto();
        } else if (this.textContent === "Actualizar") {
            editarProducto(key);
        }
    });

    // Evento de clic para el botón de editar cliente
    btnEditarCliente.addEventListener("click", function (event) {
        event.preventDefault();
        const key = this.getAttribute("data-key"); // Obtener la clave del atributo de datos
        btnGuardarCliente.setAttribute("data-key", key); // Pasar la clave al botón de guardar cliente
        seleccionarCliente(key); // Llamar a la función para seleccionar el cliente
    });

    // Evento de clic para el botón de editar producto
    btnEditarProducto.addEventListener("click", function (event) {
        event.preventDefault();
        const key = this.getAttribute("data-key"); // Obtener la clave del atributo de datos
        btnGuardarProducto.setAttribute("data-key", key); // Pasar la clave al botón de guardar cliente
        seleccionarProducto(key); // Llamar a la función para seleccionar el cliente
    });
};

const crearAlmacenes = (e)=>{
    bd = e.target.result;
    let almacenClientes = bd.createObjectStore("clientes", {keyPath : "id", autoIncrement: true });
    let almacenProductos = bd.createObjectStore("productos", {keyPath : "id", autoIncrement: true });
}

const mostrarError = (e)=>{
    const error = e.target.error
    console.error(`Se encontró el ${e.type} (${error.code}): ${error.message}`)
}

const comenzar = (e)=>{
    e.preventDefault();
    bd = e.target.result;
    mostrar();
}

const mostrar = () => {
    let transaccionClientes = bd.transaction(["clientes"], "readonly");
    let almacenClientes = transaccionClientes.objectStore("clientes");
    let punteroClientes = almacenClientes.openCursor();
    const tablaClientes = document.querySelector(".tabla-clientes");
    tablaClientes.innerHTML = '';
    punteroClientes.addEventListener("success", mostrarClientes); 

    let transaccionProductos = bd.transaction(["productos"], "readonly");
    let almacenProductos = transaccionProductos.objectStore("productos");
    let punteroProductos = almacenProductos.openCursor();
    let tablaProductos = document.querySelector(".tabla-productos");
    tablaProductos.innerHTML = '';
    punteroProductos.addEventListener("success", mostrarProductos);
}

const mostrarClientes = (e) => {
    
    const punteroClientes = e.target.result;
    const tablaClientes = document.querySelector(".tabla-clientes");
    const contPrevTable = document.querySelector(".contenido-form-resultados-cliente");

    // Función para crear la fila de cabecera
    const crearCabecera = () => {
        const cabecera = document.createElement('tr');
        cabecera.innerHTML = `
            <th>ID</th>
            <th>Nombre</th>
            <th>Direccion</th>
            <th>Telefono</th>
            <th>Acciones</th>
        `;
        return cabecera;
    }

    if (!tablaClientes.querySelector('thead')) {
        // Si no hay una cabecera en la tabla, la creamos
        const cabecera = document.createElement('thead');
        cabecera.appendChild(crearCabecera());
        tablaClientes.appendChild(cabecera);
    }

    if (punteroClientes) {
        const filaCliente = document.createElement('tr');
        filaCliente.innerHTML = `
            <td>${punteroClientes.value.id}</td>
            <td>${punteroClientes.value.nombre}</td>
            <td>${punteroClientes.value.direccion}</td>
            <td>${punteroClientes.value.telefono}</td>
            <td><button class="btn-editar" onclick="seleccionarCliente(${punteroClientes.value.id})">Editar</button><button class="btn-eliminar" onclick="eliminarCliente(${punteroClientes.value.id})">Eliminar</button></td>
        `;
        tablaClientes.appendChild(filaCliente);
        punteroClientes.continue();
    }

        else {
            if (tablaClientes.rows.length <= 1) { // Verifica si la tabla tiene solo la fila de cabecera
                contPrevTable.innerHTML = "No hay clientes registrados";
                contPrevTable.style.textAlign = "center";
            }
    } 

    
}

const mostrarProductos = (e)=>{
    const punteroProductos = e.target.result;
    const tablaProductos = document.querySelector(".tabla-productos");
    const contPrevTable = document.querySelector(".contenido-form-resultados-producto");

    // Función para crear la fila de cabecera
    const crearCabecera = () => {
        const cabecera = document.createElement('tr');
        cabecera.innerHTML = `
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Acciones</th>
        `;
        return cabecera;
    }

    if (!tablaProductos.querySelector('thead')) {
        // Si no hay una cabecera en la tabla, la creamos
        const cabecera = document.createElement('thead');
        cabecera.appendChild(crearCabecera());
        tablaProductos.appendChild(cabecera);
    }

    if (punteroProductos) {
        const filaProductos = document.createElement('tr');
        filaProductos.innerHTML = `
            <td>${punteroProductos.value.id}</td>
            <td>${punteroProductos.value.nombre}</td>
            <td>${punteroProductos.value.descripcion}</td>
            <td><button class="btn-editar-producto" onclick="seleccionarProducto(${punteroProductos.value.id})">Editar</button><button class="btn-eliminar" onclick="eliminarProducto(${punteroProductos.value.id})">Eliminar</button></td>
        `;
        tablaProductos.appendChild(filaProductos);
        punteroProductos.continue();
    } else {
        if (tablaProductos.rows.length <= 1) { // Verifica si la tabla tiene solo la fila de cabecera
            contPrevTable.innerHTML = "No hay clientes registrados";
            contPrevTable.style.textAlign = "center";
        }
    } 
}

const ingresarCliente = ()=>{

    const nombre = document.getElementById("nombreCli").value;
    const direccion = document.getElementById("direccionCli").value;
    const telefono = document.getElementById("telefonoCli").value;

    if (nombre.length > 0 && direccion.length > 0 && telefono.length > 0){
        let transaccionClientes = bd.transaction(["clientes"], "readwrite");
        let almacenClientes = transaccionClientes.objectStore("clientes");

        almacenClientes.add({
            nombre: nombre,
            direccion: direccion, 
            telefono: telefono
        });

        transaccionClientes.addEventListener("complete", mostrar());
        document.getElementById("nombreCli").value = "";
        document.getElementById("direccionCli").value = "";
        document.getElementById("telefonoCli").value = "";
    }
    else {
        let divError = document.querySelector(".txt-error");
        divError.style.display = "block";
        divError.textContent = "Debes diligenciar todos los campos"
    }
}

const ingresarProducto = ()=>{

    const nombre = document.getElementById("nombrePro").value;
    const descripcion = document.getElementById("descPro").value;

    if (nombre.length > 0 && descripcion.length > 0){
        let transaccionProductos = bd.transaction(["productos"], "readwrite");
        let almacenProductos = transaccionProductos.objectStore("productos");
    
        almacenProductos.add({
            nombre: nombre,
            descripcion: descripcion
        });

        transaccionProductos.addEventListener("complete", mostrar());
        document.getElementById("nombrePro").value = "";
        document.getElementById("descPro").value = "";
    }
    else {
        let divError = document.querySelector(".txt-error-productos");
        divError.style.display = "block";
        divError.textContent = "Debes diligenciar todos los campos"
    }
}

const seleccionarCliente = (key) => {
    let transaccion = bd.transaction(["clientes"], "readonly");
    let almacen = transaccion.objectStore("clientes");

    let solicitud = almacen.get(key);
    solicitud.addEventListener("success", (e) => {
        let cliente = e.target.result;

        if (cliente) {
            document.getElementById("nombreCli").value = cliente.nombre || "";
            document.getElementById("direccionCli").value = cliente.direccion || "";
            document.getElementById("telefonoCli").value = cliente.telefono || "";

            // Cambiar el texto del botón a "Actualizar"
            let btnGuardar = document.querySelector(".cont-btn-enviar-cliente > button");
            btnGuardar.textContent = "Actualizar";

            // Establecer la clave como un atributo de datos en el botón de guardar cliente
            btnGuardar.setAttribute("data-key", key);

        } else {
            console.log("No se encontró cliente");
        }
    });
}

const editarCliente = (key) => {
    let inpNombre = document.getElementById("nombreCli").value;
    let inpDireccion = document.getElementById("direccionCli").value;
    let inpTelefono = document.getElementById("telefonoCli").value;

    if (inpNombre.length > 0 && inpDireccion.length > 0 && inpTelefono.length > 0) {
        let transaccion = bd.transaction(["clientes"], "readwrite");
        let almacen = transaccion.objectStore("clientes");
        let solicitud = almacen.get(Number(key));

        solicitud.addEventListener("success", (e) => {
            let cliente = e.target.result;
            if (cliente) {
                // Actualizar los datos del cliente
                cliente.nombre = inpNombre;
                cliente.direccion = inpDireccion;
                cliente.telefono = inpTelefono;

                let actualizacion = almacen.put(cliente);

                actualizacion.addEventListener("success", (e) => {
                    console.log("Cliente modificado correctamente");
                });
            } else {
                console.log("No se encontró cliente");
            }
        });

        transaccion.addEventListener("complete", () => {
            mostrar();
        });
    } else {
        let divError = document.querySelector(".txt-error");
        divError.style.display = "block";
        divError.textContent = "Debes diligenciar todos los campos";
    }
}; 

const seleccionarProducto = (key)=>{
    let transaccion = bd.transaction(["productos"], "readonly");
    let almacen = transaccion.objectStore("productos");
    let solicitud = almacen.get(key);

    const inpNombre = document.getElementById("nombrePro");
    const inpDesc = document.getElementById("descPro");

    solicitud.addEventListener("success", (e)=>{
        let producto = e.target.result;

        if(producto){
            inpNombre.value = producto.nombre;
            inpDesc.value = producto.descripcion;

            let btnGuardar = document.querySelector(".cont-btn-enviar-producto > button");
            btnGuardar.textContent = "Actualizar";

            // Establecer la clave como un atributo de datos en el botón de guardar cliente
            btnGuardar.setAttribute("data-key", key);
        }
        else {
            console.log("No hay un producto")
        }
    })
}

const editarProducto = (key)=>{

    const inpNombre = document.getElementById("nombrePro").value;
    const inpDescripcion = document.getElementById("descPro").value;

    if(inpNombre.length > 0 && inpDescripcion.length > 0){
        let transaccion = bd.transaction(["productos"], "readwrite");
        let almacen = transaccion.objectStore("productos");
        let peticion = almacen.get(Number(key))
    
        peticion.addEventListener("success", (e) => {
            let producto = e.target.result;
            
            if (producto){
                producto.nombre = inpNombre;
                producto.descripcion = inpDescripcion;

                let actualizacion = almacen.put(producto);
                actualizacion.addEventListener("success", ()=>{
                    console.log("Producto actualizado correctamente");
                    mostrar()
                })
                actualizacion.addEventListener("error", ()=>console.error("Error en la actualizacion del producto"))
            }
            else {
                console.log("Producto no econtrado")
            }
        })
    }
    else {
        let divError = document.querySelector(".txt-error-productos");
        divError.style.display = "block";
        divError.textContent = "Debes diligenciar todos los campos"
    }
}

const eliminarCliente = (key)=>{
    let transaccion = bd.transaction(["clientes"], "readwrite");
    let almacen = transaccion.objectStore("clientes");
    let peticion = almacen.get(key);

    peticion.addEventListener("success", (e)=>{
        let cliente = e.target.result;

        let pregunta = confirm(`¿Estas seguro de eliminar el cliente ${cliente.nombre}?`)
        if(pregunta){
            let eliminar = almacen.delete(key);
            eliminar.addEventListener("success", ()=>{
                alert("Cliente eliminado");
                mostrar();
            })
        }
    });

    peticion.addEventListener("error", ()=> console.error("El cliente no existe"))
}

const eliminarProducto = (key)=>{
    let transaccion = bd.transaction(["productos"], "readwrite");
    let almacen = transaccion.objectStore("productos");
    let peticion = almacen.get(key);

    peticion.addEventListener("success", (e)=>{
        let producto = e.target.result;

        let pregunta = confirm(`¿Estas seguro de eliminar el producto ${producto.nombre}?`)
        if(pregunta){
            let eliminar = almacen.delete(key);
            eliminar.addEventListener("success", ()=>{
                alert("Producto eliminado");
                mostrar();
            })
        }
    });

    peticion.addEventListener("error", ()=> console.error("El producto no existe"))
}

addEventListener("load", iniciarBD)