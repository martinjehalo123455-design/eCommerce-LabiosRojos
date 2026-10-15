<?php
/*$host = '127.0.0.1';
$puerto = '8889';
$db = 'labios_rojos';
$usuario = 'root';
$password = 'root';

const conexion = 'url de los datos';

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$puerto;dbname=$db;charset=utf8mb4",
        $usuario,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    exit("Error de conexión a la base de datos.");
}*/


$config = require __DIR__ . '/../../config/config.php';//Ruta donde tengo la configuracion de msql

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};port={$config['puerto']};dbname={$config['db']};charset=utf8mb4",
        $config['usuario'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    exit('Error de conexión a la base de datos.');
}