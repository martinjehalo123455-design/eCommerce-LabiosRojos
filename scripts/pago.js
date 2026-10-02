/*
 * Página de pago como invitada.
 *
 * Importante: en esta versión el pago se simula. En la integración real,
 * al enviar el formulario se crea el pedido en el servidor y se redirige a la
 * página de pago de Mercado Pago o Stripe. Los datos de la tarjeta nunca pasan
 * por esta página ni se guardan en la tienda.
 *
 * Depende de: catalogo.js, tienda.js
 */

'use strict';

const COSTO_DE_ENVIO_A_DOMICILIO = 99; /* Valor de ejemplo, por confirmar con el negocio. */
const ENTREGA_A_DOMICILIO = 'envio-a-domicilio';

document.addEventListener('DOMContentLoaded', () => {
  if (obtenerArticulosDelCarrito().length === 0) {
    window.location.href = 'carrito.html';
    return;
  }

  document.getElementById('precio-envio-opcion').textContent = formatearPrecio(COSTO_DE_ENVIO_A_DOMICILIO);

  mostrarResumenDelPedido();
  configurarOpcionesDeEntrega();
  configurarMetodoDePago();
  configurarEnvioDelFormulario();
});


function obtenerFormulario() {
  return document.getElementById('formulario-pago');
}

function eligioEnvioADomicilio() {
  return obtenerFormulario().elements.entrega.value === ENTREGA_A_DOMICILIO;
}

function calcularCostoDeEnvio() {
  return eligioEnvioADomicilio() ? COSTO_DE_ENVIO_A_DOMICILIO : 0;
}


function mostrarResumenDelPedido() {
  const listaDeResumen = document.getElementById('lista-resumen');

  const elementos = obtenerArticulosDelCarrito().map(({ producto, cantidad }) => {
    const elementoDeLista = document.createElement('li');
    elementoDeLista.className = 'articulo-resumen';
    elementoDeLista.innerHTML = `
      <img src="imagenes/producto.svg" alt="" width="64" height="96">
      <p>
        ${producto.nombre}<br>
        <span class="texto-suave">Cantidad: ${cantidad}</span>
      </p>
      <p>${formatearPrecio(producto.precio * cantidad)}</p>
    `;
    return elementoDeLista;
  });

  listaDeResumen.replaceChildren(...elementos);
  actualizarTotales();
}


function actualizarTotales() {
  const subtotal = calcularSubtotal();
  const costoDeEnvio = calcularCostoDeEnvio();

  document.getElementById('subtotal-pago').textContent = formatearPrecio(subtotal);
  document.getElementById('envio-pago').textContent = costoDeEnvio === 0 ? 'Gratis' : formatearPrecio(costoDeEnvio);
  document.getElementById('total-pago').textContent = formatearPrecio(subtotal + costoDeEnvio);
}


/* Muestra la dirección solo cuando se elige envío a domicilio.
   Un grupo deshabilitado no se valida, así que sus campos obligatorios no estorban. */
function configurarOpcionesDeEntrega() {
  const datosDeEnvio = document.getElementById('datos-de-envio');

  obtenerFormulario().querySelectorAll('input[name="entrega"]').forEach((opcion) => {
    opcion.addEventListener('change', () => {
      const mostrarDireccion = eligioEnvioADomicilio();
      datosDeEnvio.hidden = !mostrarDireccion;
      datosDeEnvio.disabled = !mostrarDireccion;
      actualizarTotales();
    });
  });
}


function configurarMetodoDePago() {
  const botonPagar = document.getElementById('boton-pagar');

  obtenerFormulario().querySelectorAll('input[name="metodo-de-pago"]').forEach((opcion) => {
    opcion.addEventListener('change', () => {
      botonPagar.textContent = `Pagar con ${opcion.value}`;
    });
  });
}


function configurarEnvioDelFormulario() {
  const formulario = obtenerFormulario();

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
      formulario.reportValidity();
      return;
    }

    const pedido = crearPedido(new FormData(formulario));
    guardarEnElNavegador(CLAVE_DEL_ULTIMO_PEDIDO, pedido);
    vaciarCarrito();

    window.location.href = 'confirmacion.html';
  });
}


function crearPedido(datosDelFormulario) {
  const articulos = obtenerArticulosDelCarrito().map(({ producto, cantidad }) => ({
    identificador: producto.identificador,
    nombre: producto.nombre,
    precio: producto.precio,
    cantidad
  }));

  const costoDeEnvio = calcularCostoDeEnvio();

  return {
    numero: `LR-${Date.now().toString().slice(-6)}`,
    fecha: new Date().toISOString(),
    cliente: {
      nombre: datosDelFormulario.get('nombre'),
      correo: datosDelFormulario.get('correo'),
      telefono: datosDelFormulario.get('telefono'),
      recibirActualizaciones: datosDelFormulario.has('recibir-actualizaciones')
    },
    entrega: datosDelFormulario.get('entrega'),
    direccion: eligioEnvioADomicilio()
      ? {
          calle: datosDelFormulario.get('calle'),
          colonia: datosDelFormulario.get('colonia'),
          codigoPostal: datosDelFormulario.get('codigo-postal'),
          ciudad: datosDelFormulario.get('ciudad'),
          estado: datosDelFormulario.get('estado')
        }
      : null,
    metodoDePago: datosDelFormulario.get('metodo-de-pago'),
    articulos,
    costoDeEnvio,
    total: calcularSubtotal() + costoDeEnvio
  };
}
