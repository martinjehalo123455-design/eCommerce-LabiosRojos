-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:8889
-- Tiempo de generación: 15-10-2026 a las 00:25:36
-- Versión del servidor: 5.7.34
-- Versión de PHP: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `labios_rojos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `sku` varchar(80) NOT NULL,
  `nombre` varchar(180) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `descripcion` text,
  `marca` varchar(100) DEFAULT NULL,
  `precio` decimal(12,2) NOT NULL,
  `precio_compra` decimal(12,2) DEFAULT NULL,
  `precio_oferta` decimal(12,2) DEFAULT NULL,
  `stock` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `stock_minimo` int(10) UNSIGNED NOT NULL DEFAULT '3',
  `imagen_principal` varchar(500) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `destacado` tinyint(1) NOT NULL DEFAULT '0',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `categoria_id`, `sku`, `nombre`, `slug`, `descripcion`, `marca`, `precio`, `precio_compra`, `precio_oferta`, `stock`, `stock_minimo`, `imagen_principal`, `activo`, `destacado`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 'LR-LAB-001', 'Labial Mate Rojo Intenso', 'labial-mate-rojo-intenso', 'Labial mate de color rojo intenso, acabado uniforme. Producto de demostración.', 'Genérica', '129.00', '65.00', '109.00', 25, 5, 'https://i5.walmartimages.com/asr/393fa81c-c37e-4dbc-bdbc-bbb1886d3d38.4d8f796c538ad31699fd7be6d6f03d14.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF', 1, 1, '2026-10-14 19:34:29', '2026-10-14 20:04:27'),
(2, 2, 'LR-OJO-001', 'Paleta de Sombras Nude', 'paleta-de-sombras-nude', 'Paleta de tonos neutros para maquillaje de día y noche. Producto de demostración.', 'Genérica', '249.00', '130.00', '219.00', 15, 3, NULL, 1, 1, '2026-10-14 19:34:29', '2026-10-14 20:08:08'),
(3, 3, 'LR-ROS-001', 'Base de Maquillaje Natural', 'base-de-maquillaje-natural', 'Base de maquillaje de acabado natural. Producto de demostración.', 'Genérica', '189.00', '95.00', NULL, 20, 4, 'https://amparolopez.mx/cdn/shop/files/Sun_Kissed_2e4b6bf5-8ae1-45c8-be34-f2d6a1e0fe28.png?v=1761254441&width=1000', 1, 0, '2026-10-14 19:34:29', '2026-10-14 20:00:11'),
(4, 4, 'LR-UNA-001', 'Esmalte Gel Rosa Pastel', 'esmalte-gel-rosa-pastel', 'Esmalte tipo gel color rosa pastel. Producto de demostración.', 'Genérica', '99.00', '45.00', '89.00', 30, 5, 'https://http2.mlstatic.com/D_NQ_NP_867696-MLM109278613136_042026-O.webp', 1, 1, '2026-10-14 19:34:29', '2026-10-14 20:00:45'),
(5, 4, 'LR-UNA-002', 'Kit de Uñas Press On', 'kit-unas-press-on', 'Kit de uñas postizas para aplicación en casa. Producto de demostración.', 'Genérica', '159.00', '80.00', NULL, 12, 3, 'https://studionailsoficial.com/wp-content/uploads/2023/12/Poligel.jpg', 1, 0, '2026-10-14 19:34:29', '2026-10-14 20:01:03');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_productos_catalogo` (`categoria_id`,`activo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
