#pragma once
#include <DHT.h>

#define DHTPIN   24
#define DHTTYPE  DHT22
DHT dht(DHTPIN, DHTTYPE);

struct SensorData {
  float temperatura = 0;
  float humedad = 0;
};

void initSensores() {
  dht.begin();
}

SensorData leerSensores() {
  SensorData d;
  d.humedad = dht.readHumidity();
  d.temperatura = dht.readTemperature();
  return d;
}
