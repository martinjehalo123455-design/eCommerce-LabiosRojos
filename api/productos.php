
<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion.php';

// Se asume que conexion.php crea la variable $pdo.

try {

    $sql = "SELECT
                p.id,
                p.sku,
                p.nombre,
                p.slug,
                p.precio,
                p.precio_oferta,
                p.stock,
                p.imagen_principal,
                c.nombre AS categoria
            FROM productos p
            LEFT JOIN categorias c
                ON c.id = p.categoria_id
            WHERE p.activo = 1
            ORDER BY p.destacado DESC, p.id DESC
            LIMIT 20";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'productos' => $productos
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'No fue posible cargar los productos.'
    ]);
}
