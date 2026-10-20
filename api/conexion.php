<?php

const CREDENCIALES_BD = '/Applications/XAMPP/xamppfiles/etc/db_labiosrojos.php';
   
function conectar(): PDO {
    static $pdo = null;                                         // Una sola conexión por petición
    if ($pdo) return $pdo;

    if (!is_readable(CREDENCIALES_BD)) {
        throw new RuntimeException('No se puede leer ' . CREDENCIALES_BD . ': no existe o no tiene permisos de lectura.');
    }
    
    $c   = require CREDENCIALES_BD;
    $dsn = "mysql:host={$c['host']};port={$c['port']};dbname={$c['name']};charset=utf8mb4";
    
    try {
        $pdo = new PDO($dsn, $c['user'], $c['password'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,              // Consultas preparadas reales: evitan inyección SQL
        ]);
    } catch (PDOException $e) {
        throw new RuntimeException("No se pudo conectar a MySQL en {$c['host']}:{$c['port']}: " . $e->getMessage(), 0, $e);
    }
    return $pdo;
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    if (PHP_SAPI !== 'cli') {
        header('Content-Type: text/plain; charset=utf-8');
        if (!in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)) {   // El error revela host y usuario
            http_response_code(403);
            exit("Prueba disponible solo desde localhost.\n");
        }
    }
    try {
        $productos = conectar()->query('SELECT * FROM productos;')->fetchAll();
        echo "Conexión exitosa";
        var_dump($productos);

    } catch (Throwable $e) {
        if (PHP_SAPI !== 'cli') http_response_code(500);
        echo 'Error de conexión: ' . $e->getMessage() . "\n";
        exit(1);
    }
}