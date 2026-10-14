CREATE DATABASE IF NOT EXISTS labios_rojos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE labios_rojos;

CREATE TABLE categorias (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL,
 slug VARCHAR(120) NOT NULL UNIQUE,
 descripcion TEXT NULL,
 imagen VARCHAR(500) NULL,
 orden INT NOT NULL DEFAULT 0,
 activo TINYINT(1) NOT NULL DEFAULT 1,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE productos (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 categoria_id BIGINT UNSIGNED NOT NULL,
 sku VARCHAR(80) NOT NULL UNIQUE,
 nombre VARCHAR(180) NOT NULL,
 slug VARCHAR(200) NOT NULL UNIQUE,
 descripcion TEXT NULL,
 marca VARCHAR(100) NULL,
 precio DECIMAL(12,2) NOT NULL,
 precio_compra DECIMAL(12,2) NULL,
 precio_oferta DECIMAL(12,2) NULL,
 stock INT UNSIGNED NOT NULL DEFAULT 0,
 stock_minimo INT UNSIGNED NOT NULL DEFAULT 3,
 imagen_principal VARCHAR(500) NULL,
 activo TINYINT(1) NOT NULL DEFAULT 1,
 destacado TINYINT(1) NOT NULL DEFAULT 0,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 INDEX idx_productos_catalogo (categoria_id, activo),
 CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id),
 CONSTRAINT chk_producto_precio CHECK (precio >= 0),
 CONSTRAINT chk_producto_oferta CHECK (precio_oferta IS NULL OR precio_oferta >= 0)
) ENGINE=InnoDB;

CREATE TABLE producto_imagenes (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 producto_id BIGINT UNSIGNED NOT NULL,
 ruta VARCHAR(500) NOT NULL,
 texto_alternativo VARCHAR(200) NULL,
 orden INT NOT NULL DEFAULT 0,
 FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE clientes (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(150) NOT NULL,
 email VARCHAR(190) NULL,
 telefono VARCHAR(25) NOT NULL,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 INDEX idx_clientes_telefono (telefono)
) ENGINE=InnoDB;

CREATE TABLE direcciones (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 cliente_id BIGINT UNSIGNED NOT NULL,
 destinatario VARCHAR(150) NOT NULL,
 telefono VARCHAR(25) NOT NULL,
 calle VARCHAR(180) NOT NULL,
 numero_exterior VARCHAR(30) NOT NULL,
 numero_interior VARCHAR(30) NULL,
 colonia VARCHAR(120) NOT NULL,
 municipio VARCHAR(120) NOT NULL,
 estado VARCHAR(120) NOT NULL DEFAULT 'Jalisco',
 codigo_postal VARCHAR(10) NOT NULL,
 referencias TEXT NULL,
 FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pedidos (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 folio VARCHAR(35) NOT NULL UNIQUE,
 cliente_id BIGINT UNSIGNED NULL,
 nombre_contacto VARCHAR(150) NOT NULL,
 email_contacto VARCHAR(190) NULL,
 telefono_contacto VARCHAR(25) NOT NULL,
 tipo_entrega ENUM('envio','recoger') NOT NULL DEFAULT 'recoger',
 direccion_entrega TEXT NULL,
 subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
 descuento DECIMAL(12,2) NOT NULL DEFAULT 0,
 costo_envio DECIMAL(12,2) NOT NULL DEFAULT 0,
 total DECIMAL(12,2) NOT NULL DEFAULT 0,
 estado ENUM('pendiente','confirmado','preparando','enviado','entregado','cancelado') NOT NULL DEFAULT 'pendiente',
 notas TEXT NULL,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
 INDEX idx_pedidos_estado_fecha (estado, creado_en)
) ENGINE=InnoDB;

CREATE TABLE pedido_detalles (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 pedido_id BIGINT UNSIGNED NOT NULL,
 producto_id BIGINT UNSIGNED NULL,
 sku VARCHAR(80) NOT NULL,
 nombre_producto VARCHAR(180) NOT NULL,
 cantidad INT UNSIGNED NOT NULL,
 precio_unitario DECIMAL(12,2) NOT NULL,
 subtotal DECIMAL(12,2) NOT NULL,
 FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
 FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE SET NULL,
 CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0)
) ENGINE=InnoDB;

CREATE TABLE pagos (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 pedido_id BIGINT UNSIGNED NOT NULL,
 metodo ENUM('efectivo','transferencia','mercado_pago','stripe','otro') NOT NULL,
 proveedor_referencia VARCHAR(190) NULL,
 monto DECIMAL(12,2) NOT NULL,
 moneda CHAR(3) NOT NULL DEFAULT 'MXN',
 estado ENUM('pendiente','aprobado','rechazado','reembolsado') NOT NULL DEFAULT 'pendiente',
 pagado_en DATETIME NULL,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
 INDEX idx_pagos_referencia (proveedor_referencia)
) ENGINE=InnoDB;

CREATE TABLE administradores (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(150) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 activo TINYINT(1) NOT NULL DEFAULT 1,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE movimientos_inventario (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 producto_id BIGINT UNSIGNED NOT NULL,
 tipo ENUM('entrada','salida','ajuste') NOT NULL,
 cantidad INT NOT NULL,
 motivo VARCHAR(255) NULL,
 pedido_id BIGINT UNSIGNED NULL,
 creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (producto_id) REFERENCES productos(id),
 FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
 INDEX idx_movimientos_producto_fecha (producto_id, creado_en)
) ENGINE=InnoDB;

INSERT INTO categorias (nombre,slug,descripcion,orden) VALUES
 ('Labios','labios','Labiales, brillos y delineadores',1),
 ('Ojos','ojos','Sombras, delineadores y máscaras',2),
 ('Rostro','rostro','Bases, rubores y cuidado facial',3),
 ('Uñas','unas','Esmaltes y accesorios de manicura',4);
