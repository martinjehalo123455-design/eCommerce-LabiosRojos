/*
 * Página de confirmación: muestra el último pedido realizado y su seguimiento.
 *
 * Depende de: catalogo.js, tienda.js
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const pedido = leerDelNavegador(CLAVE_DEL_ULTIMO_PEDIDO, null);

  if (!pedido) {
    document.getElementById('sin-pedido').hidden = false;
    return;
  }

  mostrarPedido(pedido);
});


function mostrarPedido(pedido) {
  document.getElementById('pedido-confirmado').hidden = false;

  document.getElementById('numero-pedido').textContent = `#${pedido.numero}`;
  document.getElementById('correo-pedido').textContent = pedido.cliente.correo;
  document.getElementById('metodo-pago-pedido').textContent = pedido.metodoDePago;
  document.getElementById('total-pedido').textContent = formatearPrecio(pedido.total);

  /* Los últimos pasos cambian según la forma de entrega elegida. */
  if (pedido.entrega === 'recoger-en-tienda') {
    document.getElementById('paso-envio').textContent = 'Listo para recoger';
    document.getElementById('detalle-paso-envio').textContent = 'Te avisaremos cuando puedas pasar a la tienda';
    document.getElementById('paso-entrega').textContent = 'Recogido';
  }

  const elementos = pedido.articulos.map((articulo) => {
    const elementoDeLista = document.createElement('li');
    elementoDeLista.className = 'articulo-resumen';
    elementoDeLista.innerHTML = `
      <img src="imagenes/producto.svg" alt="" width="64" height="96">
      <p>
        ${articulo.nombre}<br>
        <span class="texto-suave">Cantidad: ${articulo.cantidad}</span>
      </p>
      <p>${formatearPrecio(articulo.precio * articulo.cantidad)}</p>
    `;
    return elementoDeLista;
  });

  document.getElementById('lista-confirmacion').replaceChildren(...elementos);
}
