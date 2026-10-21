/*
 * Página del carrito: lista los artículos, permite cambiar cantidades,
 * eliminar productos y muestra el resumen del pedido.
 *
 * Depende de: catalogo.js, tienda.js
 */

'use strict';


/*
document.addEventListener('DOMContentLoaded', () => {
    mostrarCarrito();
    configurarAccionesDelCarrito();
});

function mostrarCarrito() {
    const articulos = obtenerArticulosDelCarrito();
    const carritoEstaVacio = articulos.length === 0;

    document.getElementById('carrito-vacio').hidden = !carritoEstaVacio;
    document.getElementById('contenido-carrito').hidden = carritoEstaVacio;

    if (carritoEstaVacio) {
        return;
    }

    const listaDelCarrito = document.getElementById('lista-carrito');
    listaDelCarrito.replaceChildren(...articulos.map(crearArticuloDelCarrito));

    const subtotal = calcularSubtotal();
    document.getElementById('cantidad-articulos').textContent = contarArticulosDelCarrito();
    document.getElementById('subtotal-carrito').textContent = formatearPrecio(subtotal);
    document.getElementById('total-carrito').textContent = formatearPrecio(subtotal);
}


function crearArticuloDelCarrito({ producto, cantidad }) {
    const elementoDeLista = document.createElement('li');
    elementoDeLista.className = 'articulo-carrito';

    elementoDeLista.innerHTML = `
    <img class="imagen-articulo" src="imagenes/producto.svg" alt="" width="64" height="96">

    <hgroup class="datos-articulo">
      <p class="categoria-producto">${producto.categoria}</p>
      <h2><a href="producto.html?producto=${producto.identificador}">${producto.nombre}</a></h2>
      <p class="tono-producto" style="--color-tono: ${producto.colorDelTono}">
        <span class="muestra-tono" aria-hidden="true"></span>
        Tono: ${producto.tono}
      </p>
    </hgroup>

    <button class="boton-de-texto" type="button"
            data-accion="eliminar" data-producto="${producto.identificador}">
      Eliminar
    </button>

    <span class="control-cantidad">
      <button type="button" data-accion="disminuir" data-producto="${producto.identificador}"
              aria-label="Quitar una pieza de ${producto.nombre}">−</button>
      <output aria-label="Cantidad de ${producto.nombre}">${cantidad}</output>
      <button type="button" data-accion="aumentar" data-producto="${producto.identificador}"
              aria-label="Agregar una pieza de ${producto.nombre}">+</button>
    </span>

    <p class="precio-articulo">${formatearPrecio(producto.precio * cantidad)}</p>
  `;

    return elementoDeLista;
}


 Un solo escuchador para todos los botones de la lista. *
function configurarAccionesDelCarrito() {
    const listaDelCarrito = document.getElementById('lista-carrito');

    listaDelCarrito.addEventListener('click', (evento) => {
        const boton = evento.target.closest('[data-accion]');
        if (!boton) {
            return;
        }

        const identificador = boton.dataset.producto;
        const articulo = obtenerCarrito().find((articuloGuardado) => articuloGuardado.identificador === identificador);
        const producto = buscarProducto(identificador);

        if (!articulo || !producto) {
            return;
        }

        switch (boton.dataset.accion) {
            case 'aumentar':
                if (articulo.cantidad < producto.existencias) {
                    cambiarCantidadEnCarrito(identificador, articulo.cantidad + 1);
                } else {
                    mostrarAviso(`Solo hay ${producto.existencias} piezas disponibles.`);
                }
                break;

            case 'disminuir':
                cambiarCantidadEnCarrito(identificador, articulo.cantidad - 1);
                break;

            case 'eliminar':
                eliminarDelCarrito(identificador);
                mostrarAviso(`Quitaste ${producto.nombre} del carrito.`);
                break;
        }

        mostrarCarrito();
    });
}*/



/**Mostrar los productos en el Div ejemplo */


document.addEventListener('DOMContentLoaded', async() => {

    const contenedor = document.getElementById('productos-carrito');
    const subtotalElemento = document.getElementById('subtotal-carrito');
    const totalElemento = document.getElementById('total-carrito');
    const cantidadElemento = document.getElementById('cantidad-articulos');
    const envioElemento = document.getElementById('envio-carrito');

    if (!contenedor) return;

    const COSTO_ENVIO = 99;

    const formatoPrecio = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let productos = [];
    let cargando = false;

    function actualizarResumen() {
        const carrito = obtenerCarrito();

        let subtotal = 0;
        let cantidadTotal = 0;

        carrito.forEach(item => {
            const producto = productos.find(
                p => Number(p.id) === Number(item.id)
            );

            if (!producto) return;

            const stock = Math.max(0, Number(producto.stock) || 0);
            const cantidad = Math.min(
                Math.max(0, Number(item.cantidad) || 0),
                stock
            );

            if (cantidad <= 0) return;

            const precioNormal = Number(producto.precio);
            const oferta = producto.precio_oferta != null ?
                Number(producto.precio_oferta) :
                null;

            const precio = oferta !== null &&
                oferta > 0 &&
                oferta < precioNormal ?
                oferta :
                precioNormal;

            if (!Number.isFinite(precio) || precio < 0) return;

            subtotal += precio * cantidad;
            cantidadTotal += cantidad;
        });

        const envio = cantidadTotal > 0 ? COSTO_ENVIO : 0;

        if (subtotalElemento) {
            subtotalElemento.textContent = formatoPrecio.format(subtotal);
        }

        if (envioElemento) {
            envioElemento.textContent = formatoPrecio.format(envio);
        }

        if (totalElemento) {
            totalElemento.textContent = formatoPrecio.format(subtotal + envio);
        }

        if (cantidadElemento) {
            cantidadElemento.textContent = cantidadTotal;
        }

        // Actualizar el icono superior del carrito
        if (typeof actualizarContador === 'function') {
            actualizarContador();
        }
    }

    function obtenerPrecio(producto) {
        const normal = Number(producto.precio);

        const oferta = producto.precio_oferta != null ?
            Number(producto.precio_oferta) :
            null;

        return oferta !== null && oferta > 0 && oferta < normal ?
            oferta :
            normal;
    }

    function renderizarCarrito() {
        const carrito = obtenerCarrito();

        contenedor.replaceChildren();

        if (!carrito.length) {
            contenedor.textContent = 'Tu carrito está vacío.';
            actualizarResumen();
            return;
        }

        let mostrados = 0;

        carrito.forEach(item => {
            const producto = productos.find(
                p => Number(p.id) === Number(item.id)
            );

            if (!producto) return;

            const stock = Math.max(0, Number(producto.stock) || 0);
            const cantidad = Math.min(
                Math.max(0, Number(item.cantidad) || 0),
                stock
            );

            if (cantidad <= 0) return;

            const precio = obtenerPrecio(producto);
            if (!Number.isFinite(precio) || precio < 0) return;

            mostrados++;

            const tarjeta = document.createElement('article');
            tarjeta.className = 'producto-carrito';

            // Imagen
            const imagen = document.createElement('img');
            imagen.className = 'imagen-carrito';
            imagen.alt = producto.nombre;
            imagen.loading = 'lazy';

            const imagenDefault =
                'https://cdn-icons-png.flaticon.com/512/4016/4016766.png';

            imagen.src = producto.imagen_principal || imagenDefault;

            imagen.onerror = function() {
                this.onerror = null;
                this.src = imagenDefault;
            };

            // Información
            const informacion = document.createElement('div');
            informacion.className = 'info-carrito';

            const nombre = document.createElement('h3');
            nombre.textContent = producto.nombre;

            const precioTexto = document.createElement('p');
            precioTexto.textContent =
                'Precio: ' + formatoPrecio.format(precio);

            // Controles de cantidad
            const controles = document.createElement('div');
            controles.className = 'controles-cantidad';

            const botonMenos = document.createElement('button');
            botonMenos.type = 'button';
            botonMenos.className = 'btn-cantidad';
            botonMenos.textContent = '−';
            botonMenos.setAttribute('aria-label', 'Disminuir cantidad');

            const cantidadTexto = document.createElement('span');
            cantidadTexto.className = 'numero-cantidad';
            cantidadTexto.textContent = cantidad;

            const botonMas = document.createElement('button');
            botonMas.type = 'button';
            botonMas.className = 'btn-cantidad';
            botonMas.textContent = '+';
            botonMas.disabled = cantidad >= stock;
            botonMas.setAttribute('aria-label', 'Aumentar cantidad');

            controles.append(
                botonMenos,
                cantidadTexto,
                botonMas
            );

            // Subtotal por producto
            const subtotalTexto = document.createElement('strong');
            subtotalTexto.className = 'subtotal-producto';
            subtotalTexto.textContent =
                'Subtotal: ' + formatoPrecio.format(precio * cantidad);

            // Eliminar
            const botonEliminar = document.createElement('button');
            botonEliminar.type = 'button';
            botonEliminar.className = 'btn-eliminar';
            botonEliminar.innerHTML =
                '<i class="bi bi-trash3"></i> Eliminar';

            // Evento aumentar
            botonMas.addEventListener('click', () => {
                cambiarCantidad(producto.id, 1);
            });

            // Evento disminuir
            botonMenos.addEventListener('click', () => {
                cambiarCantidad(producto.id, -1);
            });

            // Evento eliminar
            botonEliminar.addEventListener('click', () => {
                eliminarProducto(producto.id);
            });

            informacion.append(
                nombre,
                precioTexto,
                controles,
                subtotalTexto,
                botonEliminar
            );

            tarjeta.append(imagen, informacion);
            contenedor.appendChild(tarjeta);
        });

        if (mostrados === 0) {
            contenedor.textContent =
                'No hay productos disponibles en el carrito.';
        }

        actualizarResumen();
    }

    function cambiarCantidad(id, cambio) {
        const carrito = obtenerCarrito();

        const item = carrito.find(
            p => Number(p.id) === Number(id)
        );

        if (!item) return;

        const producto = productos.find(
            p => Number(p.id) === Number(id)
        );

        if (!producto) return;

        const nuevaCantidad = Number(item.cantidad) + cambio;
        const stock = Number(producto.stock);

        if (nuevaCantidad <= 0) {
            eliminarProducto(id);
            return;
        }

        if (nuevaCantidad > stock) {
            alert('Solo hay ' + stock + ' unidades disponibles.');
            return;
        }

        item.cantidad = nuevaCantidad;

        guardarCarrito(carrito);
        renderizarCarrito();
    }

    function eliminarProducto(id) {
        const carrito = obtenerCarrito().filter(
            item => Number(item.id) !== Number(id)
        );

        guardarCarrito(carrito);
        renderizarCarrito();
    }

    async function cargarProductos() {
        const carrito = obtenerCarrito();

        if (!carrito.length) {
            productos = [];
            renderizarCarrito();
            return;
        }

        cargando = true;
        contenedor.textContent = 'Cargando productos...';

        try {
            const respuesta = await fetch('api/productos_carrito.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ids: carrito.map(item => item.id)
                })
            });

            if (!respuesta.ok) {
                throw new Error('Error HTTP: ' + respuesta.status);
            }

            const resultado = await respuesta.json();

            if (!resultado.success || !Array.isArray(resultado.productos)) {
                throw new Error(
                    resultado.message || 'Respuesta inválida'
                );
            }

            productos = resultado.productos;
            renderizarCarrito();

        } catch (error) {
            console.error('Error al cargar carrito:', error);

            contenedor.textContent =
                'No fue posible cargar tu carrito. Intenta nuevamente.';

            const botonPago = document.querySelector(
                '.resumen-pedido a[href="pago.html"]'
            );

            if (botonPago) {
                botonPago.style.pointerEvents = 'none';
                botonPago.setAttribute('aria-disabled', 'true');
            }

        } finally {
            cargando = false;
        }
    }

    // Evitar pagar con cantidades que superan existencias
    const botonPago = document.querySelector(
        '.resumen-pedido a[href="pago.html"]'
    );

    if (botonPago) {
        botonPago.addEventListener('click', evento => {
            const carrito = obtenerCarrito();

            const invalido = cargando ||
                !carrito.length ||
                carrito.some(item => {
                    const producto = productos.find(
                        p => Number(p.id) === Number(item.id)
                    );

                    return !producto ||
                        Number(item.cantidad) < 1 ||
                        Number(item.cantidad) > Number(producto.stock);
                });

            if (invalido) {
                evento.preventDefault();
                alert('Revisa las cantidades y existencias de tu carrito.');
            }
        });
    }

    await cargarProductos();
});