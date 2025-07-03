<?php
header('Content-Type: application/json');

// Incluye la configuración y la conexión a la base de datos
require_once __DIR__ . '/config/database.php';

// Lee el JSON recibido
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['motivo']) && isset($data['fecha'])) {
    // Registro de reinicio
    $dispositivo = isset($data['dispositivo']) ? $mysqli->real_escape_string($data['dispositivo']) : 'esp32-1';
    $motivo = $mysqli->real_escape_string($data['motivo']);
    $fecha = $mysqli->real_escape_string($data['fecha']); // formato: "YYYY-MM-DD HH:MM:SS"
    $stmt = $mysqli->prepare("INSERT INTO reinicios (dispositivo, motivo, fecha) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $dispositivo, $motivo, $fecha);
    if ($stmt->execute()) {
        echo json_encode(['status'=>'ok', 'tipo'=>'reinicio']);
    } else {
        echo json_encode(['status'=>'error', 'error'=>$stmt->error]);
    }
    $stmt->close();
} elseif (isset($data['temperatura']) && isset($data['humedad'])) {
    // Registro de datos de sensores
    $temp = floatval($data['temperatura']);
    $hum  = floatval($data['humedad']);
    $dispositivo = isset($data['dispositivo']) ? $mysqli->real_escape_string($data['dispositivo']) : 'esp32-1';
    $stmt = $mysqli->prepare("INSERT INTO sensores (dispositivo, temperatura, humedad) VALUES (?, ?, ?)");
    $stmt->bind_param('sdd', $dispositivo, $temp, $hum);
    if ($stmt->execute()) {
        echo json_encode(['status'=>'ok', 'tipo'=>'sensor']);
    } else {
        echo json_encode(['status'=>'error', 'error'=>$stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['status'=>'error', 'error'=>'Datos incompletos o formato incorrecto.']);
}

$mysqli->close();
?>
