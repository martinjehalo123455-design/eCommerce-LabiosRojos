document.addEventListener('DOMContentLoaded', async function() {

    // ==========================================
    // 1. ELEMENTOS DEL DOM
    // ==========================================

    const $ = selector => document.querySelector(selector);

    const parametros = new URLSearchParams(window.location.search);
    const slug = parametros.get('slug');

    const imagen = $('#imagen-producto');
    const nombre = $('#nombre-producto');
    const categoria = $('#categoria-producto');
    const precioElemento = $('#precio-producto');
    const existencias = $('#existencias-producto');
    const descripcion = $('#descripcion-producto');

    const cantidadInput = $('#cantidad');
    const formulario = $('#formulario-compra');
    const comprarAhora = $('#boton-comprar-ahora');

    const botonAgregar = formulario ?
        formulario.querySelector('button[type="submit"]') :
        null;

    const imagenDefault = 'imagenes/producto.svg';
    const CLAVE_CARRITO = 'labios_rojos_carrito';

    const formatoPrecio = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });

    let productoActual = null;

    // ==========================================
    // 2. FUNCIONES AUXILIARES
    // ==========================================

    function mostrarNoEncontrado() {
        const detalle = $('#detalle-producto');
        const noEncontrado = $('#producto-no-encontrado');
        const relacionados = $('#seccion-relacionados');

        if (detalle) detalle.hidden = true;
        if (noEncontrado) noEncontrado.hidden = false;
        if (relacionados) relacionados.hidden = true;

        document.title = 'Producto no encontrado | Labios Rojos';
    }

    function obtenerPrecio(producto) {
        const normal = Number(producto.precio);

        const oferta = producto.precio_oferta != null ?
            Number(producto.precio_oferta) :
            null;

        if (
            oferta !== null &&
            oferta > 0 &&
            oferta < normal
        ) {
            return oferta;
        }

        return normal;
    }

    function obtenerCantidad() {
        if (!productoActual || !cantidadInput) return 0;

        const stock = Math.max(
            0,
            Number(productoActual.stock) || 0
        );

        if (stock <= 0) return 0;

        const valor = Number(cantidadInput.value);

        const cantidad = Number.isFinite(valor) ?
            Math.trunc(valor) :
            1;

        return Math.max(1, Math.min(cantidad, stock));
    }

    function obtenerCarritoLocal() {
        try {
            const datos = JSON.parse(
                localStorage.getItem(CLAVE_CARRITO) || '[]'
            );

            return Array.isArray(datos) ? datos : [];

        } catch (error) {
            console.error('Error al leer carrito:', error);
            return [];
        }
    }

    function agregarCantidadAlCarrito(idProducto, cantidad) {
        if (!productoActual) return false;

        const id = Number(idProducto);

        if (!Number.isSafeInteger(id) || id <= 0) {
            return false;
        }

        const stock = Math.max(
            0,
            Number(productoActual.stock) || 0
        );

        if (stock <= 0 || cantidad <= 0) {
            return false;
        }

        const carrito = obtenerCarritoLocal();

        const existente = carrito.find(
            item => Number(item.id) === id
        );

        if (existente) {
            existente.cantidad = Math.min(
                Math.max(0, Number(existente.cantidad) || 0) + cantidad,
                stock
            );
        } else {
            carrito.push({
                id: id,
                cantidad: Math.min(cantidad, stock)
            });
        }

        try {
            localStorage.setItem(
                CLAVE_CARRITO,
                JSON.stringify(carrito)
            );

            if (typeof actualizarContador === 'function') {
                actualizarContador();
            }

            return true;

        } catch (error) {
            console.error('No se pudo guardar carrito:', error);
            return false;
        }
    }

    // ==========================================
    // 3. MOSTRAR INFORMACIÓN DEL PRODUCTO
    // ==========================================

    function mostrarProducto(producto) {

        productoActual = producto;

        // NOMBRE
        if (nombre) {
            nombre.textContent = producto.nombre || 'Producto';
        }

        document.title =
            (producto.nombre || 'Producto') + ' | Labios Rojos';

        const nombreRuta = $('#nombre-producto-ruta');

        if (nombreRuta) {
            nombreRuta.textContent = producto.nombre || 'Producto';
        }

        // CATEGORÍA
        const nombreCategoria = producto.categoria || 'Belleza';

        if (categoria) {
            categoria.textContent = nombreCategoria;
        }

        const enlaceCategoria = $('#enlace-categoria-ruta');

        if (enlaceCategoria) {
            enlaceCategoria.textContent = nombreCategoria;
            enlaceCategoria.href = 'index.html#catalogo';
        }

        // IMAGEN PRINCIPAL
        if (imagen) {
            imagen.src = producto.imagen_principal || imagenDefault;
            imagen.alt = producto.nombre || 'Producto';

            imagen.onerror = function() {
                this.onerror = null;
                this.src = imagenDefault;
            };
        }

        // MARCA
        const marca = $('#marca-producto');
        const filaMarca = $('#fila-marca');

        if (filaMarca) {
            filaMarca.hidden = !producto.marca;
        }

        if (marca) {
            marca.textContent = producto.marca || '';
        }

        // SKU
        const sku = $('#sku-producto');
        const filaSku = $('#fila-sku');

        if (filaSku) {
            filaSku.hidden = !producto.sku;
        }

        if (sku) {
            sku.textContent = producto.sku || '';
        }

        // PRECIOS
        const precioNormal = Number(producto.precio);
        const precioFinal = obtenerPrecio(producto);

        const tieneOferta = precioFinal < precioNormal;

        if (precioElemento) {
            precioElemento.textContent =
                formatoPrecio.format(precioFinal);
        }

        const precioAnterior = $('#precio-anterior-producto');

        if (precioAnterior) {
            precioAnterior.hidden = !tieneOferta;

            if (tieneOferta) {
                precioAnterior.textContent =
                    formatoPrecio.format(precioNormal);
            }
        }

        // ETIQUETA DE OFERTA
        const etiquetaOferta = $('#etiqueta-oferta');

        if (etiquetaOferta) {
            etiquetaOferta.hidden = !tieneOferta;
        }

        // STOCK
        const stock = Math.max(
            0,
            Number(producto.stock) || 0
        );

        if (existencias) {
            existencias.textContent = stock > 0 ?
                stock + ' disponibles' :
                'Agotado';

            existencias.classList.toggle(
                'sin-stock',
                stock <= 0
            );
        }

        if (cantidadInput) {
            cantidadInput.min = 1;
            cantidadInput.max = stock;
            cantidadInput.value = stock > 0 ? 1 : 0;
            cantidadInput.disabled = stock <= 0;
        }

        // DESCRIPCIÓN
        const textoDescripcion =
            producto.descripcion || 'Sin descripción disponible.';

        if (descripcion) {
            descripcion.textContent = textoDescripcion;
        }

        const descripcionCompleta = $('#descripcion-completa');

        if (descripcionCompleta) {
            descripcionCompleta.textContent = textoDescripcion;
        }

        // TONO
        const tono = $('#tono-producto');
        const filaTono = $('.tono-producto');

        if (filaTono) {
            filaTono.hidden = !producto.tono;
        }

        if (tono) {
            tono.textContent = producto.tono || '';
        }

        // CONTENIDO Y MODO DE USO
        const contenido = $('#contenido-producto');
        const modoUso = $('#modo-de-uso-producto');
        const ficha = $('.ficha-tecnica');

        const tieneFicha = Boolean(
            producto.contenido || producto.modo_uso
        );

        if (ficha) {
            ficha.hidden = !tieneFicha;
        }

        if (contenido) {
            contenido.textContent = producto.contenido || '—';
        }

        if (modoUso) {
            modoUso.textContent = producto.modo_uso || '—';
        }

        // BOTONES DE COMPRA
        if (botonAgregar) {
            botonAgregar.disabled = stock <= 0;
            botonAgregar.textContent = stock > 0 ?
                'Agregar al carrito' :
                'Agotado';
        }

        if (comprarAhora) {
            comprarAhora.disabled = stock <= 0;
        }

        // MOSTRAR DETALLE
        const detalle = $('#detalle-producto');
        const noEncontrado = $('#producto-no-encontrado');

        if (detalle) detalle.hidden = false;
        if (noEncontrado) noEncontrado.hidden = true;
    }

    // ==========================================
    // 4. PRODUCTOS RELACIONADOS
    // ==========================================

    async function cargarRelacionados(productoPrincipal) {

        const contenedor = $('#productos-relacionados');
        const seccion = $('#seccion-relacionados');

        if (!contenedor || !seccion) return;

        try {
            const respuesta = await fetch('api/productos.php');

            if (!respuesta.ok) {
                throw new Error('Error al consultar relacionados');
            }

            const datos = await respuesta.json();

            if (!datos.success || !Array.isArray(datos.productos)) {
                throw new Error('Respuesta inválida');
            }

            const relacionados = datos.productos
                .filter(producto => {

                    const diferente =
                        Number(producto.id) !== Number(productoPrincipal.id);

                    const mismaCategoria =
                        producto.categoria_id != null &&
                        productoPrincipal.categoria_id != null &&
                        Number(producto.categoria_id) ===
                        Number(productoPrincipal.categoria_id);

                    return diferente && mismaCategoria;
                })
                .slice(0, 4);

            contenedor.replaceChildren();

            if (!relacionados.length) {
                seccion.hidden = true;
                return;
            }

            relacionados.forEach(producto => {

                if (!producto.slug) return;

                const li = document.createElement('li');
                const enlace = document.createElement('a');
                const img = document.createElement('img');
                const titulo = document.createElement('h3');
                const precio = document.createElement('p');

                li.className = 'producto-card';

                // IMPORTANTE: USAR SLUG, NO ID
                enlace.href =
                    'producto.html?slug=' +
                    encodeURIComponent(producto.slug);

                img.src = producto.imagen_principal || imagenDefault;
                img.alt = producto.nombre || 'Producto';
                img.loading = 'lazy';

                img.onerror = function() {
                    this.onerror = null;
                    this.src = imagenDefault;
                };

                titulo.textContent = producto.nombre || 'Producto';

                precio.textContent = formatoPrecio.format(
                    obtenerPrecio(producto)
                );

                enlace.append(img, titulo, precio);
                li.appendChild(enlace);
                contenedor.appendChild(li);
            });

            seccion.hidden = contenedor.children.length === 0;

        } catch (error) {
            console.error('Productos relacionados:', error);
            seccion.hidden = true;
        }
    }

    // ==========================================
    // 5. VALIDAR SLUG
    // ==========================================

    if (!slug ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ) {
        mostrarNoEncontrado();
        return;
    }

    // ==========================================
    // 6. CONSULTAR PRODUCTO DESDE PHP
    // ==========================================

    try {

        const respuesta = await fetch(
            'api/producto_detalle.php?slug=' +
            encodeURIComponent(slug)
        );

        if (!respuesta.ok) {
            throw new Error(
                'Error HTTP: ' + respuesta.status
            );
        }

        const datos = await respuesta.json();

        if (!datos.success || !datos.producto) {
            throw new Error(
                datos.message || 'Producto no encontrado'
            );
        }

        const producto = datos.producto;

        // VALIDAR ID REAL DE MYSQL
        const idProducto = Number(producto.id);

        if (!Number.isSafeInteger(idProducto) ||
            idProducto <= 0
        ) {
            throw new Error('El producto no tiene un ID válido');
        }

        // MOSTRAR DATOS
        mostrarProducto(producto);

        // ==========================================
        // 7. CONTROLES DE CANTIDAD
        // ==========================================

        if (cantidadInput) {

            document.querySelectorAll('[data-cambio-cantidad]')
                .forEach(boton => {

                    boton.addEventListener('click', function() {

                        if (!productoActual ||
                            Number(productoActual.stock) <= 0
                        ) {
                            return;
                        }

                        const cambio = Number(
                            boton.dataset.cambioCantidad
                        );

                        cantidadInput.value = Math.max(
                            1,
                            Math.min(
                                Number(productoActual.stock),
                                obtenerCantidad() + cambio
                            )
                        );
                    });
                });

            cantidadInput.addEventListener('change', function() {
                cantidadInput.value = obtenerCantidad();
            });
        }

        // ==========================================
        // 8. AGREGAR AL CARRITO
        // ==========================================

        if (formulario) {

            formulario.addEventListener('submit', function(evento) {
                evento.preventDefault();

                if (!productoActual ||
                    Number(productoActual.stock) <= 0
                ) {
                    return;
                }

                const agregado = agregarCantidadAlCarrito(
                    idProducto,
                    obtenerCantidad()
                );

                if (!agregado) {
                    alert('No se pudo agregar el producto al carrito.');
                    return;
                }

                if (botonAgregar) {

                    botonAgregar.textContent = '✓ Agregado al carrito';

                    setTimeout(function() {
                        if (Number(productoActual.stock) > 0) {
                            botonAgregar.textContent = 'Agregar al carrito';
                        }
                    }, 1500);
                }
            });
        }

        // ==========================================
        // 9. COMPRAR AHORA
        // ==========================================

        if (comprarAhora) {

            comprarAhora.addEventListener('click', function() {

                if (!productoActual ||
                    Number(productoActual.stock) <= 0
                ) {
                    return;
                }

                const agregado = agregarCantidadAlCarrito(
                    idProducto,
                    obtenerCantidad()
                );

                if (agregado) {
                    window.location.href = 'carrito.html';
                } else {
                    alert('No fue posible agregar el producto.');
                }
            });
        }

        // ==========================================
        // 10. CARGAR PRODUCTOS RELACIONADOS
        // ==========================================

        await cargarRelacionados(producto);

    } catch (error) {

        console.error('Error en detalle de producto:', error);

        mostrarNoEncontrado();
    }

});