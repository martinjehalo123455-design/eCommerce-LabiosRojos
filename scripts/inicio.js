/*
 * Página de inicio: muestra las categorías, los filtros y el catálogo de productos.
 *
 * Depende de: catalogo.js, tienda.js
 */

'use strict';

const CATEGORIA_TODOS = 'Todos';

document.addEventListener('DOMContentLoaded', () => {
  const parametrosDeLaDireccion = new URLSearchParams(window.location.search);
  const categoriaInicial = parametrosDeLaDireccion.get('categoria') || CATEGORIA_TODOS;

  mostrarCategorias();
  mostrarFiltros(categoriaInicial);
  mostrarProductos(categoriaInicial);
  configurarBotonesDeAgregar(document.getElementById('rejilla-productos'));
});


function mostrarCategorias() {
  const listaDeCategorias = document.getElementById('lista-categorias');

  const elementos = categoriasDeProductos.map((categoria) => {
    const elementoDeLista = document.createElement('li');
    elementoDeLista.innerHTML = `
      <a class="tarjeta-categoria" href="index.html?categoria=${encodeURIComponent(categoria.nombre)}#catalogo">
        <span class="muestra-categoria" style="--color-muestra: ${categoria.colorDeMuestra}" aria-hidden="true"></span>
        <span class="nombre-categoria">${categoria.nombre}</span>
      </a>
    `;
    return elementoDeLista;
  });

  listaDeCategorias.replaceChildren(...elementos);
}


function mostrarFiltros(categoriaActiva) {
  const listaDeFiltros = document.getElementById('filtros-categoria');
  const nombresDeFiltros = [CATEGORIA_TODOS, ...categoriasDeProductos.map((categoria) => categoria.nombre)];

  const elementos = nombresDeFiltros.map((nombre) => {
    const elementoDeLista = document.createElement('li');
    const boton = document.createElement('button');

    boton.type = 'button';
    boton.className = 'boton-filtro';
    boton.textContent = nombre;
    boton.setAttribute('aria-pressed', String(nombre === categoriaActiva));
    boton.addEventListener('click', () => seleccionarCategoria(nombre));

    elementoDeLista.append(boton);
    return elementoDeLista;
  });

  listaDeFiltros.replaceChildren(...elementos);
}


function seleccionarCategoria(nombreDeCategoria) {
  document.querySelectorAll('.boton-filtro').forEach((boton) => {
    boton.setAttribute('aria-pressed', String(boton.textContent === nombreDeCategoria));
  });

  mostrarProductos(nombreDeCategoria);

  /* Actualiza la dirección para que el filtro se conserve al compartir o recargar. */
  const direccion = new URL(window.location.href);
  if (nombreDeCategoria === CATEGORIA_TODOS) {
    direccion.searchParams.delete('categoria');
  } else {
    direccion.searchParams.set('categoria', nombreDeCategoria);
  }
  window.history.replaceState(null, '', direccion);
}


function mostrarProductos(nombreDeCategoria) {
  const rejilla = document.getElementById('rejilla-productos');
  const mensajeSinProductos = document.getElementById('mensaje-sin-productos');

  const productosVisibles = nombreDeCategoria === CATEGORIA_TODOS
    ? catalogoDeProductos
    : catalogoDeProductos.filter((producto) => producto.categoria === nombreDeCategoria);

  rejilla.replaceChildren(...productosVisibles.map(crearTarjetaDeProducto));
  mensajeSinProductos.hidden = productosVisibles.length > 0;
}
