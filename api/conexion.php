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
