/*
 * Página del carrito: lista los artículos, permite cambiar cantidades,
 * eliminar productos y muestra el resumen del pedido.
 *
 * Depende de: catalogo.js, tienda.js
 */

'use strict';

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


/* Un solo escuchador para todos los botones de la lista. */
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
}
