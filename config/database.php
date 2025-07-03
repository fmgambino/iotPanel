<?php
// config/database.php

require_once __DIR__ . '/config.php';

define('DB_HOST', 'localhost');
define('DB_USER', 'u197809344_esp32Device');
define('DB_PASS', 'Jamboree0381$$');
define('DB_NAME', 'u197809344_iotpanel');

$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($mysqli->connect_error) {
    die(json_encode(['status'=>'error','error'=>'Error al conectar con la base de datos: ' . $mysqli->connect_error]));
}
?>
