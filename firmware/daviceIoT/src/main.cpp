#include <Arduino.h>
#include <WiFiManager.h>
#include <FS.h>
#include <SPIFFS.h>
#include <PubSubClient.h>
#include <WiFiClient.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "config_general.hpp"
#include "config_mqtt.hpp"
#include "sensores.hpp"
#include "actuadores.hpp"

WiFiClient espClient;
PubSubClient mqttClient(espClient);

SensorData sens;
EstadoActuadores estado;
unsigned long lastSens = 0;

bool flagReinicioPendiente = false;
String motivoReinicio = "";

void guardarEstadoSPIFFS() {
  StaticJsonDocument<128> doc;
  estado = getEstadoReles();
  doc["rele1"] = estado.rele1;
  doc["rele2"] = estado.rele2;
  File f = SPIFFS.open(FILE_STATE, FILE_WRITE);
  if (!f) return;
  serializeJson(doc, f);
  f.close();
}

void cargarEstadoSPIFFS() {
  if (!SPIFFS.exists(FILE_STATE)) return;
  File f = SPIFFS.open(FILE_STATE, FILE_READ);
  if (!f) return;
  StaticJsonDocument<128> doc;
  deserializeJson(doc, f);
  estado.rele1 = doc["rele1"] | false;
  estado.rele2 = doc["rele2"] | false;
  setRelay(1, estado.rele1);
  setRelay(2, estado.rele2);
  f.close();
}

void reportarEventoReinicio(String motivo) {
  // 1. MQTT Evento
  StaticJsonDocument<192> evt;
  evt["motivo"] = motivo;
  evt["fecha"] = obtenerFechaHora();
  evt["dispositivo"] = DEVICE_ID;
  char payload[192];
  serializeJson(evt, payload, sizeof(payload));
  mqttClient.publish(MQTT_TOPIC_EVT, payload);

  // 2. POST HTTP a backend
  if(WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(URL_BACKEND);
    http.addHeader("Content-Type", "application/json");
    String data = "{\"motivo\":\"" + motivo + "\",\"fecha\":\"" + obtenerFechaHora() + "\",\"dispositivo\":\"" + String(DEVICE_ID) + "\"}";
    int httpCode = http.POST(data);
    http.end();
  }
}

String obtenerFechaHora() {
  // Sincronizar con NTP sería ideal, pero como ejemplo usamos RTC del sistema (ajusta si usas NTP)
  time_t now;
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    return String("");
  }
  char fecha[24];
  strftime(fecha, 24, "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(fecha);
}

void enviarDatosBackend() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(URL_BACKEND);
    http.addHeader("Content-Type", "application/json");
    sens = leerSensores();
    estado = getEstadoReles();
    String payload = "{\"temperatura\":" + String(sens.temperatura,1)
                   + ",\"humedad\":" + String(sens.humedad,1)
                   + ",\"rele1\":" + String(estado.rele1 ? "true":"false")
                   + ",\"rele2\":" + String(estado.rele2 ? "true":"false")
                   + ",\"dispositivo\":\"" + String(DEVICE_ID) + "\"}";
    http.POST(payload);
    http.end();
  }
}

void publicarDatosMQTT() {
  sens = leerSensores();
  estado = getEstadoReles();
  StaticJsonDocument<256> doc;
  doc["temperatura"] = sens.temperatura;
  doc["humedad"] = sens.humedad;
  doc["rele1"] = estado.rele1;
  doc["rele2"] = estado.rele2;
  doc["dispositivo"] = DEVICE_ID;
  char buffer[256];
  size_t n = serializeJson(doc, buffer);
  mqttClient.publish(MQTT_TOPIC_PUB, buffer, n);
}

// CALLBACK: Control remoto y reinicio remoto
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<192> doc;
  DeserializationError err = deserializeJson(doc, payload, length);
  if (err) return;
  if (doc.containsKey("rele1")) {
    setRelay(1, doc["rele1"]);
  }
  if (doc.containsKey("rele2")) {
    setRelay(2, doc["rele2"]);
  }
  if (doc.containsKey("reinicio") && doc["reinicio"]) {
    motivoReinicio = "Reinicio remoto";
    flagReinicioPendiente = true;
  }
  guardarEstadoSPIFFS();
}

void conectarMQTT() {
  while (!mqttClient.connected()) {
    String clientId = DEVICE_ID;
    if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASS)) {
      mqttClient.subscribe(MQTT_TOPIC_CMD);
    } else {
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  if (!SPIFFS.begin(true)) {
    Serial.println("Error SPIFFS");
    while(1);
  }
  initSensores();
  initActuadores();
  cargarEstadoSPIFFS();

  // --- Hora/NTP ---
  configTime(-3 * 3600, 0, "pool.ntp.org", "time.nist.gov");
  delay(1000); // Deja que NTP sincronice

  WiFiManager wm;
  wm.setConfigPortalTimeout(120);
  if(!wm.autoConnect(WIFI_AP_SSID, WIFI_AP_PASS)) {
    ESP.restart();
  }

  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  conectarMQTT();

  reportarEventoReinicio("Reinicio (power-up/arranque)");
}

void loop() {
  if (!mqttClient.connected()) conectarMQTT();
  mqttClient.loop();

  if (millis() - lastSens > 10000) {
    publicarDatosMQTT();
    enviarDatosBackend();
    guardarEstadoSPIFFS();
    lastSens = millis();
  }

  if (flagReinicioPendiente) {
    reportarEventoReinicio(motivoReinicio);
    delay(500);
    ESP.restart();
  }
}
