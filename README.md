# Labios Rojos: tienda en línea (Frontend)

Frontend de la tienda en línea de Labios Rojos, construido con HTML, CSS y JavaScript sin dependencias.
Corresponde a la Fase 1 (tienda) y a una vista de ejemplo del panel de la Fase 2.

## Cómo abrirlo

Abre `index.html` en el navegador. Para evitar restricciones del navegador con archivos locales,
también puedes servir la carpeta:

```
python3 -m http.server 8000
```

y visitar `http://localhost:8000`.

## Estructura

```
labios-rojos-frontend/
├── index.html              Inicio, categorías y catálogo con filtros
├── producto.html           Detalle de producto (producto.html?producto=identificador)
├── carrito.html            Carrito de compras
├── pago.html               Compra como invitada: contacto, entrega y método de pago
├── confirmacion.html       Confirmación y seguimiento del pedido
├── administracion.html     Panel de administración (vista de ejemplo)
├── estilos/
│   ├── estilos.css         Estilos de toda la tienda
│   └── administracion.css  Estilos exclusivos del panel
├── scripts/
│   ├── catalogo.js         Datos de productos y categorías (de ejemplo)
│   ├── tienda.js           Funciones compartidas: carrito, precios, avisos, menú
│   ├── inicio.js           Página de inicio
│   ├── producto.js         Detalle de producto
│   ├── carrito.js          Página del carrito
│   ├── pago.js             Formulario de pago
│   ├── confirmacion.js     Confirmación del pedido
│   └── administracion.js   Panel de administración
└── imagenes/
    └── producto.svg        Imagen provisional de producto
```

Cada página carga primero `catalogo.js`, después `tienda.js` y al final su propio script.

## Qué funciona

- Filtro de productos por categoría (se conserva en la dirección de la página).
- Carrito guardado en el navegador (`localStorage`), con contador en el encabezado.
- Cambio de cantidades respetando las piezas disponibles.
- Compra como invitada con validación de campos, entrega en tienda o a domicilio.
- Confirmación con número de pedido y pasos de seguimiento.
- Panel con indicadores, pedidos, inventario con alertas de pocas piezas y ventana para publicar productos.
- Diseño adaptado a computadora, tableta y celular, con menú para celular.

## Pendiente de conectar (Fase 2)

- **Pagos:** `scripts/pago.js` simula el pago. La integración real debe crear el pedido en el
  servidor y redirigir a Mercado Pago o Stripe. Los datos de tarjeta nunca deben pasar por la tienda.
- **Datos:** `scripts/catalogo.js` y los datos de `scripts/administracion.js` son de ejemplo y se
  reemplazarán por la base de datos.
- **Contenido del negocio:** sustituir los textos entre corchetes (`[DIRECCIÓN DEL NEGOCIO]`,
  `[HORARIO DE ATENCIÓN]`, `[NÚMERO]`, `[CORREO DE CONTACTO]`, `[NOMBRE]`), las fotos, los precios
  y el costo de envío (`COSTO_DE_ENVIO_A_DOMICILIO` en `scripts/pago.js`).
- **Acceso al panel:** `administracion.html` todavía no pide inicio de sesión.
