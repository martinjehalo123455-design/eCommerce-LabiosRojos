/*
 * Panel de administración (vista de ejemplo).
 *
 * Los pedidos, clientas y notificaciones son datos de ejemplo. En la Fase 2
 * se obtendrán del servidor y los productos publicados se guardarán en la
 * base de datos. Aquí los productos nuevos solo viven mientras la página está abierta.
 *
 * Depende de: catalogo.js, tienda.js
 */

'use strict';

const LIMITE_DE_POCAS_PIEZAS = 5;

const ESTADOS_DE_PEDIDO = {
  nuevo: 'Nuevo',
  pagado: 'Pagado',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado'
};

const pedidosDeEjemplo = [
  { numero: 'LR-000106', clienta: '[Clienta]', piezas: 3, total: 537, estado: 'nuevo' },
  { numero: 'LR-000105', clienta: '[Clienta]', piezas: 1, total: 189, estado: 'pagado' },
  { numero: 'LR-000104', clienta: '[Clienta]', piezas: 2, total: 378, estado: 'preparando' },
  { numero: 'LR-000103', clienta: '[Clienta]', piezas: 4, total: 716, estado: 'enviado' },
  { numero: 'LR-000102', clienta: '[Clienta]', piezas: 1, total: 349, estado: 'entregado' },
  { numero: 'LR-000101', clienta: '[Clienta]', piezas: 2, total: 248, estado: 'entregado' }
];

const CLIENTAS_REGISTRADAS_DE_EJEMPLO = 1;

const notificacionesDeEjemplo = [
  { mensaje: 'Nuevo pedido #LR-000106', momento: 'Hace unos minutos', leida: false },
  { mensaje: 'Nueva clienta registrada', momento: 'Hoy', leida: false },
  { mensaje: 'Pedido #LR-000102 entregado', momento: 'Ayer', leida: true }
];


document.addEventListener('DOMContentLoaded', () => {
  mostrarIndicadores();
  mostrarPedidos();
  mostrarProductos();
  mostrarNotificaciones();
  configurarVentanaDePublicacion();
});


function mostrarIndicadores() {
  const pedidosNuevos = pedidosDeEjemplo.filter((pedido) => pedido.estado === 'nuevo').length;
  const piezasVendidas = pedidosDeEjemplo.reduce((total, pedido) => total + pedido.piezas, 0);
  const ventasDelMes = pedidosDeEjemplo.reduce((total, pedido) => total + pedido.total, 0);

  const indicadores = [
    { nombre: 'Pedidos nuevos', valor: pedidosNuevos },
    { nombre: 'Piezas vendidas este mes', valor: piezasVendidas },
    { nombre: 'Ventas del mes', valor: formatearPrecio(ventasDelMes) },
    { nombre: 'Clientas registradas', valor: CLIENTAS_REGISTRADAS_DE_EJEMPLO }
  ];

  /* Cada indicador es un par nombre y valor dentro de la lista de definiciones. */
  document.getElementById('indicadores').innerHTML = indicadores
    .map((indicador) => `
      <div class="indicador">
        <dt>${indicador.nombre}</dt>
        <dd>${indicador.valor}</dd>
      </div>
    `)
    .join('');
}


function mostrarPedidos() {
  document.getElementById('tabla-pedidos').innerHTML = pedidosDeEjemplo
    .map((pedido) => `
      <tr>
        <td>#${pedido.numero}</td>
        <td>${pedido.clienta}</td>
        <td>${pedido.piezas} ${pedido.piezas === 1 ? 'pieza' : 'piezas'}</td>
        <td>${formatearPrecio(pedido.total)}</td>
        <td><span class="estado estado-${pedido.estado}">${ESTADOS_DE_PEDIDO[pedido.estado]}</span></td>
      </tr>
    `)
    .join('');
}


function obtenerEstadoDeInventario(existencias) {
  if (existencias === 0) {
    return { clase: 'estado-agotado', texto: 'Agotado' };
  }
  if (existencias <= LIMITE_DE_POCAS_PIEZAS) {
    return { clase: 'estado-pocas-piezas', texto: 'Pocas piezas' };
  }
  return { clase: 'estado-disponible', texto: 'Disponible' };
}


function mostrarProductos() {
  document.getElementById('tabla-productos').innerHTML = catalogoDeProductos
    .map((producto) => {
      const estado = obtenerEstadoDeInventario(producto.existencias);
      return `
        <tr>
          <td>${producto.nombre} <span class="texto-suave">(${producto.tono})</span></td>
          <td>${producto.categoria}</td>
          <td>${formatearPrecio(producto.precio)}</td>
          <td>${producto.existencias}</td>
          <td><span class="estado ${estado.clase}">${estado.texto}</span></td>
        </tr>
      `;
    })
    .join('');
}


function mostrarNotificaciones() {
  /* Agrega un aviso por cada producto con pocas piezas o agotado. */
  const avisosDeInventario = catalogoDeProductos
    .filter((producto) => producto.existencias <= LIMITE_DE_POCAS_PIEZAS)
    .map((producto) => ({
      mensaje: `Quedan ${producto.existencias} piezas de ${producto.nombre}`,
      momento: 'Inventario',
      leida: false
    }));

  const notificaciones = [...notificacionesDeEjemplo.slice(0, 2), ...avisosDeInventario, ...notificacionesDeEjemplo.slice(2)];

  document.getElementById('lista-notificaciones').innerHTML = notificaciones
    .map((notificacion) => `
      <li class="${notificacion.leida ? 'notificacion-leida' : ''}">
        <strong>${notificacion.mensaje}</strong>
        <time>${notificacion.momento}</time>
      </li>
    `)
    .join('');
}


function configurarVentanaDePublicacion() {
  const ventana = document.getElementById('ventana-publicar-producto');
  const formulario = document.getElementById('formulario-producto');
  const campoDeCategoria = document.getElementById('campo-categoria');

  campoDeCategoria.innerHTML = categoriasDeProductos
    .map((categoria) => `<option>${categoria.nombre}</option>`)
    .join('');

  document.getElementById('boton-publicar-producto').addEventListener('click', () => {
    formulario.reset();
    ventana.showModal();
  });

  document.getElementById('boton-cancelar').addEventListener('click', () => {
    ventana.close();
  });

  formulario.addEventListener('submit', (evento) => {
    if (!formulario.checkValidity()) {
      evento.preventDefault();
      formulario.reportValidity();
      return;
    }

    const datos = new FormData(formulario);
    const categoria = categoriasDeProductos.find((opcion) => opcion.nombre === datos.get('categoria'));

    catalogoDeProductos.push({
      identificador: crearIdentificador(`${datos.get('nombre')} ${datos.get('tono')}`),
      nombre: datos.get('nombre'),
      categoria: datos.get('categoria'),
      tono: datos.get('tono'),
      colorDelTono: categoria ? categoria.colorDeMuestra : '#A3122A',
      precio: Number(datos.get('precio')),
      existencias: Number(datos.get('existencias')),
      descripcion: datos.get('descripcion') || '',
      contenido: '',
      modoDeUso: ''
    });

    mostrarProductos();
    mostrarNotificaciones();
    mostrarAviso(`Publicaste ${datos.get('nombre')}.`);
    /* El formulario usa method="dialog", así que la ventana se cierra sola. */
  });
}


/* Convierte un texto en un identificador para la dirección: "Labial Rojo" pasa a "labial-rojo". */
function crearIdentificador(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
