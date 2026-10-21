
<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/conexion.php';

try {

    // Recibir los productos enviados desde JavaScript
    $datos = json_decode(
        file_get_contents('php://input'),
        true
    );

    $ids = $datos['ids'] ?? [];

    // Validar que sea un arreglo
    if (!is_array($ids)) {
        throw new InvalidArgumentException('IDs inválidos');
    }

    // Limpiar IDs
    $ids = array_values(array_unique(array_filter(
        array_map('intval', $ids),
        fn($id) => $id > 0
    )));

    // Limitar cantidad de productos consultados
    if (count($ids) > 100) {
        http_response_code(400);

        echo json_encode([
            'success' => false,
            'message' => 'Demasiados productos.'
        ]);
        exit;
    }

    // Si el carrito está vacío
    if (empty($ids)) {
        echo json_encode([
            'success' => true,
            'productos' => []
        ]);
        exit;
    }

    // Crear marcadores para consulta segura
    $marcadores = implode(
        ',',
        array_fill(0, count($ids), '?')
    );

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
              AND p.id IN ($marcadores)
            ORDER BY p.nombre ASC";

    // Utilizar tu función de conexión existente
    $conexion = conectar();

    $stmt = $conexion->prepare($sql);

    $stmt->execute($ids);

    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'productos' => $productos
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {

    error_log('Error productos_carrito: ' . $e->getMessage());

    if (http_response_code() < 400) {
        http_response_code(500);
    }

    echo json_encode([
        'success' => false,
        'message' => 'No fue posible cargar los productos.'
    ], JSON_UNESCAPED_UNICODE);
}
