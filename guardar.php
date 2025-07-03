<?php
header('Content-Type: application/json');

// Conexión a la base de datos
$mysqli = new mysqli('localhost', 'u197809344_esp32Device', 'Jamboree0381$$', 'u197809344_iotpanel');
if ($mysqli->connect_error) {
  echo json_encode(['status'=>'error','error'=>$mysqli->connect_error]);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Detecta si es un registro de reinicio
if (isset($data['motivo']) && isset($data['fecha'])) {
    // Datos para tabla reinicios
    $dispositivo = isset($data['dispositivo']) ? $mysqli->real_escape_string($data['dispositivo']) : 'esp32-1';
    $motivo = $mysqli->real_escape_string($data['motivo']);
    $fecha = $mysqli->real_escape_string($data['fecha']); // Formato: "2025-07-04 18:15:00"

    $stmt = $mysqli->prepare("INSERT INTO reinicios (dispositivo, motivo, fecha) VALUES (?, ?, ?)");
    $stmt->bind_param('sss', $dispositivo, $motivo, $fecha);

    if ($stmt->execute()) {
        echo json_encode(['status'=>'ok','tipo'=>'reinicio']);
    } else {
        echo json_encode(['status'=>'error','error'=>$stmt->error]);
    }
    $stmt->close();
} elseif (isset($data['temperatura']) && isset($data['humedad'])) {
    // Datos para tabla sensores
    $temp = floatval($data['temperatura']);
    $hum  = floatval($data['humedad']);
    $dispositivo = isset($data['dispositivo']) ? $mysqli->real_escape_string($data['dispositivo']) : 'esp32-1';

    $stmt = $mysqli->prepare("INSERT INTO sensores (dispositivo, temperatura, humedad) VALUES (?, ?, ?)");
    $stmt->bind_param('sdd', $dispositivo, $temp, $hum);

    if ($stmt->execute()) {
        echo json_encode(['status'=>'ok','tipo'=>'sensor']);
    } else {
        echo json_encode(['status'=>'error','error'=>$stmt->error]);
    }
    $stmt->close();
} else {
    echo json_encode(['status'=>'error','error'=>'Datos incompletos o formato incorrecto.']);
}

$mysqli->close();
?>
