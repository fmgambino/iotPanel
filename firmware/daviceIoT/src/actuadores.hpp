#include <Arduino.h>
#pragma once

#define RELAY1_PIN  18
#define RELAY2_PIN  19

struct EstadoActuadores {
  bool rele1 = false;
  bool rele2 = false;
};

void initActuadores() {
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  digitalWrite(RELAY1_PIN, HIGH); // Apaga por defecto
  digitalWrite(RELAY2_PIN, HIGH);
}

void setRelay(uint8_t n, bool state) {
  digitalWrite(n == 1 ? RELAY1_PIN : RELAY2_PIN, state ? LOW : HIGH); // LOW=ON, HIGH=OFF
}

EstadoActuadores getEstadoReles() {
  EstadoActuadores e;
  e.rele1 = (digitalRead(RELAY1_PIN) == LOW);
  e.rele2 = (digitalRead(RELAY2_PIN) == LOW);
  return e;
}
