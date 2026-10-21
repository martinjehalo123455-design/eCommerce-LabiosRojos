/*
 * Funciones compartidas por todas las páginas de la tienda:
 * carrito de compras, formato de precios, avisos, tarjetas de producto
 * y menú para celular.
 *
 * Depende de: catalogo.js
 */

'use strict';

const CLAVE_DEL_CARRITO = 'labios-rojos-carrito';
const CLAVE_DEL_ULTIMO_PEDIDO = 'labios-rojos-ultimo-pedido';

const formatoDeMoneda = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
});




/* ---------- Utilidades generales ---------- *

function formatearPrecio(cantidad) {
    return formatoDeMoneda.format(cantidad);
}

function buscarProducto(identificador) {
    return catalogoDeProductos.find((producto) => producto.identificador === identificador);
}

function leerDelNavegador(clave, valorPredeterminado) {
    try {
        const valorGuardado = localStorage.getItem(clave);
        return valorGuardado ? JSON.parse(valorGuardado) : valorPredeterminado;
    } catch (error) {
        return valorPredeterminado;
    }
}

function guardarEnElNavegador(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
        console.warn('No se pudo guardar la información en el navegador.', error);
    }
}


/* ---------- Carrito de compras  Añadir producto al carrito---------- */

/*function obtenerCarrito() {
    return leerDelNavegador(CLAVE_DEL_CARRITO, []);
}*/

/*function guardarCarrito(carrito) {
    guardarEnElNavegador(CLAVE_DEL_CARRITO, carrito);
    actualizarContadorDelCarrito();
}

function agregarAlCarrito(identificador, cantidad = 1) {
    const carrito = obtenerCarrito();
    const articuloExistente = carrito.find((articulo) => articulo.identificador === identificador);

    if (articuloExistente) {
        articuloExistente.cantidad += cantidad;
    } else {
        carrito.push({ identificador, cantidad });
    }

    guardarCarrito(carrito);
}*/

/*
function cambiarCantidadEnCarrito(identificador, cantidadNueva) {
    if (cantidadNueva < 1) {
        eliminarDelCarrito(identificador);
        return;
    }

    const carrito = obtenerCarrito();
    const articulo = carrito.find((articuloGuardado) => articuloGuardado.identificador === identificador);

    if (articulo) {
        articulo.cantidad = cantidadNueva;
        guardarCarrito(carrito);
    }
}

function eliminarDelCarrito(identificador) {
    const carritoActualizado = obtenerCarrito().filter(
        (articulo) => articulo.identificador !== identificador
    );
    guardarCarrito(carritoActualizado);
}

function vaciarCarrito() {
    guardarCarrito([]);
}

/* Devuelve cada artículo del carrito junto con la información completa del producto. *
function obtenerArticulosDelCarrito() {
    return obtenerCarrito()
        .map((articulo) => ({...articulo, producto: buscarProducto(articulo.identificador) }))
        .filter((articulo) => articulo.producto !== undefined);
}

function contarArticulosDelCarrito() {
    return obtenerCarrito().reduce((total, articulo) => total + articulo.cantidad, 0);
}

function calcularSubtotal() {
    return obtenerArticulosDelCarrito().reduce(
        (total, articulo) => total + articulo.producto.precio * articulo.cantidad,
        0
    );
}


function actualizarContadorDelCarrito() {
    const totalDeArticulos = contarArticulosDelCarrito();

    document.querySelectorAll('[data-contador-carrito]').forEach((contador) => {
        contador.textContent = totalDeArticulos;
        contador.hidden = totalDeArticulos === 0;
    });

    document.querySelectorAll('[data-enlace-carrito]').forEach((enlace) => {
        enlace.setAttribute('aria-label', `Ver carrito, ${totalDeArticulos} artículos`);
    });
}*/


/* ---------- Avisos breves en pantalla ---------- *

let temporizadorDelAviso;

function mostrarAviso(mensaje) {
    const aviso = document.getElementById('aviso');
    if (!aviso) {
        return;
    }

    aviso.textContent = mensaje;
    aviso.classList.add('aviso-visible');

    clearTimeout(temporizadorDelAviso);
    temporizadorDelAviso = setTimeout(() => {
        aviso.classList.remove('aviso-visible');
    }, 2500);
}


/* ---------- Tarjeta de producto ---------- *

function crearTarjetaDeProducto(producto) {
    const elementoDeLista = document.createElement('li');
    const enlaceDelProducto = `producto.html?producto=${producto.identificador}`;

    elementoDeLista.innerHTML = `
    <article class="tarjeta-producto" style="--color-tono: ${producto.colorDelTono}">
      <a class="imagen-producto" href="${enlaceDelProducto}" tabindex="-1" aria-hidden="true">
        <img src="imagenes/producto.svg" alt="" width="64" height="96">
      </a>
      <p class="categoria-producto">${producto.categoria}</p>
      <h3 class="nombre-producto">
        <a href="${enlaceDelProducto}">${producto.nombre}</a>
      </h3>
      <p class="tono-producto">
        <span class="muestra-tono" aria-hidden="true"></span>
        ${producto.tono}
      </p>
      <footer class="pie-tarjeta">
        <p class="precio-producto">${formatearPrecio(producto.precio)}</p>
        <button class="boton boton-principal boton-pequeno" type="button"
                data-agregar-producto="${producto.identificador}">
          Agregar
        </button>
      </footer>
    </article>
  `;

    return elementoDeLista;
}

 Escucha los botones "Agregar" dentro de un contenedor de tarjetas. *
function configurarBotonesDeAgregar(contenedor) {
    if (!contenedor) {
        return;
    }

    contenedor.addEventListener('click', (evento) => {
        const boton = evento.target.closest('[data-agregar-producto]');
        if (!boton) {
            return;
        }

        const producto = buscarProducto(boton.dataset.agregarProducto);
        agregarAlCarrito(producto.identificador);
        mostrarAviso(`Agregaste ${producto.nombre} al carrito.`);
    });
}
*/


function obtenerCarrito() {
    try {
        const datos = JSON.parse(
            localStorage.getItem(CLAVE_DEL_CARRITO) || '[]'
        );

        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(
        CLAVE_DEL_CARRITO,
        JSON.stringify(carrito)
    );

    actualizarContador();
}

function actualizarContador() {
    const carrito = obtenerCarrito();

    const total = carrito.reduce(
        (suma, producto) => suma + producto.cantidad, 0
    );

    document.querySelectorAll(
        '[data-contador-carrito]'
    ).forEach(contador => {
        contador.textContent = total;
        contador.hidden = total === 0;
    });
}

function agregarAlCarrito(id) {
    const carrito = obtenerCarrito();

    const producto = carrito.find(
        item => item.id === id
    );
    if (producto) {
        producto.cantidad++;

    } else {
        carrito.push({
            id: id,
            cantidad: 1,
        });
    }

    guardarCarrito(carrito);
}

document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-agregar');

    if (!boton || boton.disabled) return;

    const id = Number(boton.dataset.id);

    if (!Number.isSafeInteger(id) || id <= 0) return;

    agregarAlCarrito(id);

    const textoOriginal = boton.textContent;

    boton.textContent = '✓ Agregado';
    boton.disabled = true;

    setTimeout(() => {
        boton.textContent = textoOriginal;
        boton.disabled = false;
    }, 900);
});

document.addEventListener(
    'DOMContentLoaded',
    actualizarContador
);

window.addEventListener(
    'storage',
    actualizarContador
);



/* ---------- Menú para celular ---------- */


function configurarMenuParaCelular() {
    const botonDelMenu = document.querySelector('.boton-menu');
    const navegacion = document.getElementById('navegacion-principal');

    if (!botonDelMenu || !navegacion) {
        return;
    }

    function cambiarEstadoDelMenu(abrir) {
        botonDelMenu.setAttribute('aria-expanded', String(abrir));
        botonDelMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
        navegacion.classList.toggle('navegacion-abierta', abrir);
    }

    botonDelMenu.addEventListener('click', () => {
        const estaAbierto = botonDelMenu.getAttribute('aria-expanded') === 'true';
        cambiarEstadoDelMenu(!estaAbierto);
    });

    /* Cierra el menú al elegir una opción, útil para los enlaces dentro de la misma página. */
    navegacion.addEventListener('click', (evento) => {
        if (evento.target.closest('a')) {
            cambiarEstadoDelMenu(false);
        }
    });
}


/* ---------- Inicio común a todas las páginas ---------- */

document.addEventListener('DOMContentLoaded', () => {
    configurarMenuParaCelular();
    /* actualizarContadorDelCarrito();*/
});