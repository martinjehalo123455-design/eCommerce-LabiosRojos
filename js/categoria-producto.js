/**Mostrar productos de categorias */

document.addEventListener('DOMContentLoaded', cargarProductos);

const formatoPrecio = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
});



function escaparHTML(valor) {
    if (valor === null || valor === undefined) {
        valor = '';
    }

    return String(valor).replace(/[&<>"']/g, function(c) {
        const caracteres = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        return caracteres[c];
    });
}

async function cargarProductos() {
    const contenedor = document.getElementById('lista-productos');

    if (!contenedor) return;

    try {
        const respuesta = await fetch('api/productos.php');

        if (!respuesta.ok) {
            throw new Error('Error del servidor');
        }

        const datos = await respuesta.json();

        if (!datos.success) {
            throw new Error('Error al cargar productos');
        }

        if (!datos.productos.length) {
            contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        contenedor.innerHTML = datos.productos.map(producto => {
                    const precio = Number(producto.precio);
                    const oferta = Number(producto.precio_oferta);
                    const tieneOferta = producto.precio_oferta !== null &&
                        oferta > 0 && oferta < precio;

                    const precioFinal = tieneOferta ? oferta : precio;
                    const disponible = Number(producto.stock) > 0;

                    const imagen = producto.imagen_principal || 'https://cdn-icons-png.flaticon.com/512/4016/4016766.png';

                    return `
                    <article class="producto-card">

                        <!-- IMAGEN CON ENLACE AL DETALLE -->
                        <div class="producto-imagen">

                            <a href="producto.html?slug=${encodeURIComponent(producto.slug)}"
                            class="producto-enlace-imagen"
                            aria-label="Ver detalles de ${escaparHTML(producto.nombre)}">

                                <img
                                    src="${escaparHTML(imagen)}"
                                    alt="${escaparHTML(producto.nombre)}"
                                    loading="lazy"
                                >

                            </a>

                       ${tieneOferta  ? '<span class="producto-oferta">OFERTA</span>' : ''}
                    </div>

                <div class="producto-info">

                    <span class="producto-categoria">
                        ${escaparHTML(producto.categoria || 'Belleza')}
                    </span>

                    <!-- NOMBRE CON ENLACE -->
                    <h3 class="producto-nombre">
                        <a href="producto.html?slug=${encodeURIComponent(producto.slug)}"
                        class="producto-enlace-nombre">
                            ${escaparHTML(producto.nombre)}
                        </a>
                    </h3>

                    <div class="producto-precios">

                        <span class="precio-actual">
                            ${formatoPrecio.format(precioFinal)}
                        </span>

                        ${tieneOferta ? `
                            <span class="precio-anterior">
                                ${formatoPrecio.format(precio)}
                            </span>
                        ` : ''}

                    </div>

                    <!-- BOTÓN AGREGAR AL CARRITO -->
                    <button
                        type="button"
                        class="btn-agregar"
                        data-id="${Number(producto.id)}"
                        ${disponible ? '' : 'disabled'} >
                        <i class="bi bi-bag-plus"></i>
                        ${disponible ? 'Agregar al carrito' : 'Agotado'}
                    </button>

                </div>

            </article>
        `;
        }).join('');

    } catch (error) {
        console.error(error);
        contenedor.textContent =
            'No fue posible cargar los productos. Intenta nuevamente.';
    }
}

document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-agregar');

    if (!boton || boton.disabled) return;

    const id = Number(boton.dataset.id);

    // Integrar aquí con el carrito existente.
    console.log('Agregar producto:', id);
});