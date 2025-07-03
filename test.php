<?php
// test.php - Envía datos aleatorios a guardar.php (simula ESP32)

// URL de tu guardar.php (ajusta si es diferente en tu hosting)
$url = "https://iotpanel.electronicagambino.com/guardar.php";

// --------- Generar datos de sensor aleatorios -----------
$sensor = [
    "temperatura" => round(mt_rand(200, 300)/10, 1), // Ej: 20.0 - 30.0 °C
    "humedad"     => round(mt_rand(400, 700)/10, 1), // Ej: 40.0 - 70.0 %
    "dispositivo" => "esp32-1"
];

// --------- Generar datos de reinicio aleatorios ----------
$motivos = ["Alimentación", "Reinicio remoto", "Software", "Watchdog"];
$reinicio = [
    "motivo"      => $motivos[array_rand($motivos)],
    "fecha"       => date("Y-m-d H:i:s"),
    "dispositivo" => "esp32-1"
];

// --------- Función para enviar POST JSON ----------
function send_post_json($url, $data) {
    $opts = [
        "http" => [
            "method" => "POST",
            "header" => "Content-Type: application/json\r\n",
            "content" => json_encode($data)
        ]
    ];
    $context = stream_context_create($opts);
    $result = file_get_contents($url, false, $context);
    return $result;
}

// --------- Prueba: enviar datos de sensor -----------
echo "Enviando datos de SENSOR...\n";
$response1 = send_post_json($url, $sensor);
echo "Respuesta: $response1\n";

// --------- Prueba: enviar datos de reinicio -----------
sleep(1);
echo "Enviando datos de REINICIO...\n";
$response2 = send_post_json($url, $reinicio);
echo "Respuesta: $response2\n";

?>
