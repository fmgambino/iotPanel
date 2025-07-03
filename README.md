# 🧠 Taller Práctico: Monitoreo y Control IoT con ESP32 & Arduino  
## Workshop/Curso de Programación de Microcontroladores ESP32 – Electrónica Gambino

![Logo de Electrónica Gambino](https://electronicagambino.com/wp-content/uploads/elementor/thumbs/cropped-Electronica-Gambino-e1684335474114-q6losum0uq8caxhait9doqxx83gv53yq2d8g8oiv7o.png)

![GitHub repo size](https://img.shields.io/github/repo-size/tu_usuario/tu_repositorio?style=for-the-badge) 
![GitHub issues](https://img.shields.io/github/issues/tu_usuario/tu_repositorio?style=for-the-badge) 
![GitHub forks](https://img.shields.io/github/forks/tu_usuario/tu_repositorio?style=for-the-badge)
![GitHub stars](https://img.shields.io/github/stars/tu_usuario/tu_repositorio?style=for-the-badge)

---

<p align="center">
  <img src="https://electronicagambino.com/wp-content/uploads/2023/05/cropped-Electronica-Gambino-e1684335474114-1320x388.png" alt="Imagen del taller ESP32" width="400"/>
</p>

---

## 📌 Descripción del Proyecto

¿Querés aprender a crear tu propia solución de monitoreo y control IoT con ESP32?  
En este taller práctico, **desarrollarás desde cero un sistema completo**:

- Sensado de temperatura y humedad con DHT22  
- Control remoto de relés  
- Dashboard web en tiempo real (MQTT + PHP + Chart.js)  
- Registro de eventos y reinicios  
- Persistencia de estados y WiFiManager para conexión simple  

¡Todo desde el mundo real al navegador, en un mismo curso!

---

## 🏆 ¿Qué vas a lograr?

- Dominar el ciclo completo IoT: Sensor -> ESP32 -> MQTT -> Web  
- Programar el ESP32 con Framework Arduino en PlatformIO/VSCode  
- Implementar almacenamiento local en ESP32 (SPIFFS)  
- Usar WiFiManager para configuración fácil  
- Consumir y publicar datos vía MQTT  
- Guardar datos en MySQL vía PHP  
- Visualizar en tiempo real con dashboard moderno y responsive  

---

## 🚀 ¿Qué incluye el proyecto?

- Firmware ESP32 robusto y optimizado  
- Dashboard web profesional (HTML, CSS, JS, Chart.js, SweetAlert2, Remixicon)  
- Backend PHP de ejemplo para guardar y consultar datos  
- Ejemplo completo de integración y control  

---

## 🗂️ Estructura y Temario del Taller

### 📗 1. Introducción y conceptos clave
- ¿Qué es IoT?  
- MQTT, HTTP y protocolos básicos  
- ESP32, DHT22, relés y conexiones típicas  

### 📘 2. Programación de ESP32
- Configuración de entorno PlatformIO  
- Uso de WiFiManager  
- Lectura de sensor DHT22  
- Publicación y suscripción MQTT  
- Guardado de estados en SPIFFS  
- Envío de datos a base de datos (MySQL vía PHP)  

### 📙 3. Dashboard Web
- Estructura HTML y CSS responsive  
- Consumo de MQTT en el navegador (MQTT over Websocket)  
- Gráficos interactivos en tiempo real (Chart.js)  
- Control de relés y confirmación de cambios (SweetAlert2)  
- Modal de historial de reinicios  

### 📒 4. Práctica y Desafíos
- Simulación local con datos aleatorios  
- Extensión a múltiples dispositivos y tópicos  
- Registro de eventos y reinicios  
- Seguridad y buenas prácticas  

---

## 🛠️ Instalación y Uso

🔹 **Cloná este repositorio:**
```bash
git clone https://github.com/tu_usuario/tu_repositorio


### 🔹 Firmware (ESP32)

1. Abre el proyecto en **VS Code** con **PlatformIO** instalado.
2. Conecta tu placa **ESP32** por USB.
3. Carga el sketch desde **PlatformIO** al ESP32.
4. Al primer encendido, el ESP32 creará una red WiFi llamada **"GambinoESP32"**.
5. Conéctate a esa red desde tu PC o celular.
6. Se abrirá automáticamente el portal de configuración **WiFiManager**  
   Si no se abre, ingresá manualmente a: [http://192.168.4.1](http://192.168.4.1)
7. Elegí tu red WiFi, ingresá la contraseña y guardá.
8. El ESP32 se conectará a tu WiFi habitual y funcionará normalmente.

---

### 🔹 Dashboard Web

- Subí los archivos del dashboard (`dashboard.html`, `style.css`, `main.js`) a tu hosting (por ejemplo: Hostinger).
- Si usás base de datos, subí también los archivos PHP correspondientes.
- Editá en el firmware ESP32 y/o los PHP la **URL del backend** para guardar datos, si es necesario.

---

### 🔹 Dependencias web

No necesitás instalar nada extra:

- **Chart.js**, **SweetAlert2** y **Remixicon** ya están integrados vía CDN en el HTML.
- Solo subí los archivos al hosting y accedé desde tu navegador.

---

### 🔹 ¡Listo!

Ahora podés monitorear y controlar tu ESP32 en tiempo real desde el **Dashboard Web**:

- Visualizá datos
- Controlá relés
- Revisá el historial de eventos fácilmente
