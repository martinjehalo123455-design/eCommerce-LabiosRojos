/*
 * Página de detalle de producto.
 * Lee el identificador del producto desde la dirección: producto.html?producto=identificador
 *
 * Depende de: catalogo.js, tienda.js
 */

'use strict';

const CANTIDAD_DE_PRODUCTOS_RELACIONADOS = 4;

document.addEventListener('DOMContentLoaded', () => {
  const parametrosDeLaDireccion = new URLSearchParams(window.location.search);
  const producto = buscarProducto(parametrosDeLaDireccion.get('producto'));

  if (!producto) {
    mostrarProductoNoEncontrado();
    return;
  }

  mostrarInformacionDelProducto(producto);
  configurarFormularioDeCompra(producto);
  mostrarProductosRelacionados(producto);
});


function mostrarProductoNoEncontrado() {
  document.getElementById('detalle-producto').hidden = true;
  document.getElementById('seccion-relacionados').hidden = true;
  document.getElementById('producto-no-encontrado').hidden = false;
}


function mostrarInformacionDelProducto(producto) {
  document.title = `${producto.nombre} | Labios Rojos`;

  const enlaceDeCategoria = document.getElementById('enlace-categoria-ruta');
  enlaceDeCategoria.textContent = producto.categoria;
  enlaceDeCategoria.href = `index.html?categoria=${encodeURIComponent(producto.categoria)}#catalogo`;
  document.getElementById('nombre-producto-ruta').textContent = producto.nombre;

  document.getElementById('categoria-producto').textContent = producto.categoria;
  document.getElementById('nombre-producto').textContent = producto.nombre;
  document.getElementById('tono-producto').textContent = producto.tono;
  document.getElementById('muestra-tono-producto').style.setProperty('--color-tono', producto.colorDelTono);
  document.getElementById('precio-producto').textContent = formatearPrecio(producto.precio);
  document.getElementById('descripcion-producto').textContent = producto.descripcion;
  document.getElementById('contenido-producto').textContent = producto.contenido;
  document.getElementById('modo-de-uso-producto').textContent = producto.modoDeUso;

  const textoDeExistencias = document.getElementById('existencias-producto');
  textoDeExistencias.textContent = producto.existencias > 0
    ? `${producto.existencias} piezas disponibles`
    : 'Agotado por ahora';
}


function configurarFormularioDeCompra(producto) {
  const formulario = document.getElementById('formulario-compra');
  const campoDeCantidad = document.getElementById('cantidad');
  const botonComprarAhora = document.getElementById('boton-comprar-ahora');

  campoDeCantidad.max = producto.existencias;

  /* Botones "−" y "+" */
  formulario.querySelectorAll('[data-cambio-cantidad]').forEach((boton) => {
    boton.addEventListener('click', () => {
      const cambio = Number(boton.dataset.cambioCantidad);
      campoDeCantidad.value = limitarCantidad(Number(campoDeCantidad.value) + cambio, producto.existencias);
    });
  });

  campoDeCantidad.addEventListener('change', () => {
    campoDeCantidad.value = limitarCantidad(Number(campoDeCantidad.value), producto.existencias);
  });

  /* "Agregar al carrito" */
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const cantidad = limitarCantidad(Number(campoDeCantidad.value), producto.existencias);
    agregarAlCarrito(producto.identificador, cantidad);
    mostrarAviso(`Agregaste ${cantidad} ${cantidad === 1 ? 'pieza' : 'piezas'} al carrito.`);
  });

  /* "Comprar ahora": agrega el producto y lleva directo al pago */
  botonComprarAhora.addEventListener('click', () => {
    const cantidad = limitarCantidad(Number(campoDeCantidad.value), producto.existencias);
    agregarAlCarrito(producto.identificador, cantidad);
    window.location.href = 'pago.html';
  });

  if (producto.existencias === 0) {
    formulario.querySelectorAll('button, input').forEach((control) => {
      control.disabled = true;
    });
  }
}


/* Mantiene la cantidad entre 1 y las piezas disponibles. */
function limitarCantidad(cantidad, existencias) {
  if (Number.isNaN(cantidad) || cantidad < 1) {
    return 1;
  }
  return Math.min(cantidad, existencias);
}


/* Muestra primero productos de la misma categoría y completa con otros del catálogo. */
function mostrarProductosRelacionados(productoActual) {
  const otrosProductos = catalogoDeProductos.filter(
    (producto) => producto.identificador !== productoActual.identificador
  );

  const mismaCategoria = otrosProductos.filter((producto) => producto.categoria === productoActual.categoria);
  const otraCategoria = otrosProductos.filter((producto) => producto.categoria !== productoActual.categoria);

  const productosRelacionados = [...mismaCategoria, ...otraCategoria].slice(0, CANTIDAD_DE_PRODUCTOS_RELACIONADOS);

  const listaDeRelacionados = document.getElementById('productos-relacionados');
  listaDeRelacionados.replaceChildren(...productosRelacionados.map(crearTarjetaDeProducto));
  configurarBotonesDeAgregar(listaDeRelacionados);
}
