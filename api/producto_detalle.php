
<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion.php';

try {

    $slug = trim($_GET['slug'] ?? '');

    if (
        !$slug ||
        !preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)
    ) {
        http_response_code(400);

        echo json_encode([
            'success' => false,
            'message' => 'Slug no válido'
        ]);
        exit;
    }

    $sql = "SELECT
            id,
            categoria_id,
            sku,
            nombre,
            slug,
            descripcion,
            marca,
            precio,
            precio_oferta,
            stock,
            imagen_principal
        FROM productos
        WHERE slug = :slug
          AND activo = 1
        LIMIT 1
    ";

        // Utilizar tu función de conexión existente
    $conexion = conectar();
    $stmt = $conexion->prepare($sql);

    $stmt->execute([
        ':slug' => $slug
    ]);

    $producto = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$producto) {
        http_response_code(404);

        echo json_encode([
            'success' => false,
            'message' => 'Producto no encontrado'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'producto' => $producto
    ]);

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Error al consultar el producto'
    ]);
}
