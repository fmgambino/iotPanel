console.log("main.js cargado al 100%");

let chart;
let intervalId;
const MAX_PUNTOS = 1000; // Guarda todos los del día
let datosDia = []; // {label, temp, hum}
let fechaActual = ""; // Para evitar duplicar datos cuando cambia la fecha

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM totalmente cargado");

  // --- Menú hamburguesa, navegación
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("open");
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if(window.innerWidth <= 600) {
        navLinks.classList.remove("active");
        hamburger.classList.remove("open");
      }
    });
  });

  // Selector dispositivo
  const selector = document.getElementById("device-selector");
  selector && selector.addEventListener("change", () => {
    alert("Dispositivo seleccionado: " + selector.value);
  });

  // Página activa
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  });

  // ---- Datos ficticios demo ----
  demoEstadosRele();
  demoReinicios();
  inicializarBotones();
  inicializarGrafico();

  // Modal reinicios
  document.getElementById('show-reboots').addEventListener('click', () => {
    document.getElementById('reboot-modal').classList.add('active');
    cargarHistorialReinicios();
  });
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('reboot-modal').classList.remove('active');
  });

  // Reinicio remoto (ahora con SweetAlert2)
  document.getElementById('do-reboot').addEventListener('click', () => {
    Swal.fire({
      title: '¿Reiniciar dispositivo?',
      text: "¿Seguro que deseas reiniciar el dispositivo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00ff88',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, reiniciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        agregarReinicio({
          fecha: new Date().toLocaleString(),
          motivo: "Reinicio remoto",
          icon: "restart"
        });
        Swal.fire('Reinicio enviado', 'El dispositivo se reiniciará (simulado).', 'success');
      }
    });
  });
});

// ----------- SIMULADOR DE ESTADOS Y REINICIOS -----------
function demoEstadosRele() {
  if(localStorage.getItem('rele1') === null) localStorage.setItem('rele1', "OFF");
  if(localStorage.getItem('rele2') === null) localStorage.setItem('rele2', "OFF");
  setInterval(() => {
    document.getElementById('temp').textContent = `${(22+Math.random()*6).toFixed(1)} °C`;
    document.getElementById('hum').textContent = `${(50+Math.random()*12).toFixed(1)} %`;
    actualizaBoton('btn1', localStorage.getItem('rele1') === "ON");
    actualizaBoton('btn2', localStorage.getItem('rele2') === "ON");
  }, 2000);
}
function demoReinicios() {
  if (!localStorage.getItem('reinicios_gambino')) {
    const now = new Date();
    const lista = [];
    for(let i=0;i<5;i++){
      let d = new Date(now - i*3600*1000*8);
      lista.push({
        fecha: d.toLocaleString(),
        motivo: ["Alimentación","Reinicio remoto","Software"][i%3],
        icon: ["flashlight","restart","cpu"][i%3]
      });
    }
    localStorage.setItem('reinicios_gambino', JSON.stringify(lista));
  }
}

// ----------- BOTONES RELÉ (demo) + SweetAlert2 -----------
function inicializarBotones() {
  [
    {id:'btn1', storage:'rele1', nombre: "Lámpara 1"},
    {id:'btn2', storage:'rele2', nombre: "Lámpara 2"}
  ].forEach(({id,storage,nombre}) => {
    const btn = document.getElementById(id);
    if(btn) {
      actualizaBoton(id, localStorage.getItem(storage) === "ON");
      btn.addEventListener('click', function () {
        const encender = !this.classList.contains('on');
        Swal.fire({
          title: encender ? `¿Encender ${nombre}?` : `¿Apagar ${nombre}?`,
          icon: encender ? 'question' : 'warning',
          showCancelButton: true,
          confirmButtonColor: encender ? '#00ff88' : '#d33',
          cancelButtonColor: '#666',
          confirmButtonText: encender ? 'Encender' : 'Apagar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.setItem(storage, encender ? "ON" : "OFF");
            actualizaBoton(id, encender);
            Swal.fire(
              encender ? 'Encendida' : 'Apagada',
              `${nombre} ahora está ${encender ? 'encendida' : 'apagada'}.`,
              'success'
            );
          }
        });
      });
    }
  });
}
function actualizaBoton(id, isOn) {
  const btn = document.getElementById(id);
  if(!btn) return;
  if(isOn) { btn.classList.add('on'); btn.classList.remove('off'); }
  else     { btn.classList.remove('on'); btn.classList.add('off'); }
}

// ----------- GRÁFICO INTERACTIVO -----------

function inicializarGrafico() {
  const canvas = document.getElementById('chart');
  const fechaInput = document.getElementById('fecha');
  if (!canvas || !fechaInput) return;

  // Destruye el gráfico anterior si existe
  if (chart) {
    chart.destroy();
  }
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Define hoy como fecha por defecto
  const hoy = new Date().toISOString().split('T')[0];
  fechaActual = hoy;
  fechaInput.value = hoy;

  // Limpia datos del día
  datosDia = [];

  // Configuración del gráfico
  const ctx = canvas.getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: [],
          borderColor: 'orange',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
        },
        {
          label: 'Humedad (%)',
          data: [],
          borderColor: 'cyan',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: "#fff" } },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            modifierKey: 'ctrl',
            onPanComplete: function({chart}) {
              // Puedes poner aquí lógica extra si quieres
            }
          },
          zoom: {
            wheel: { enabled: false },
            pinch: { enabled: false },
            mode: 'x'
          }
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        x: { 
          ticks: { color: "#fff" }, 
          grid: { color: "#333" }
        },
        y: { 
          ticks: { color: "#fff" }, 
          grid: { color: "#333" }, 
          beginAtZero: false 
        }
      }
    }
  });

  // Cambiar fecha
  fechaInput.addEventListener('change', () => {
    mostrarDatosDeFecha(fechaInput.value);
  });

  mostrarDatosDeFecha(hoy); // Inicia con hoy

  // Simula la llegada de nuevos datos cada 2 segundos
  intervalId = setInterval(() => agregarDatoSimulado(), 2000);
}

function agregarDatoSimulado() {
  if (!chart) return;

  // Crea una marca de tiempo única
  const ahora = new Date();
  const hoy = ahora.toISOString().split('T')[0];

  if (fechaActual !== hoy) {
    // Si cambió el día, reinicia todo
    fechaActual = hoy;
    datosDia = [];
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    chart.update();
  }

  const label = ahora.toLocaleTimeString().slice(0, 8); // HH:MM:SS
  const temp = Math.random() * 10 + 20;
  const hum = Math.random() * 30 + 50;

  // Guarda el dato
  datosDia.push({ label, temp, hum });
  if (datosDia.length > MAX_PUNTOS) datosDia.shift();

  // Muestra solo los últimos 20 puntos al inicio,
  // pero puedes panear hacia la izquierda con el plugin
  const mostrar = datosDia.slice(-20);

  chart.data.labels = mostrar.map(d => d.label);
  chart.data.datasets[0].data = mostrar.map(d => d.temp);
  chart.data.datasets[1].data = mostrar.map(d => d.hum);
  chart.update();
}

function mostrarDatosDeFecha(fecha) {
  // Si la fecha no es hoy, rellena con datos simulados vacíos
  if (fecha !== fechaActual) {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    chart.update();
    return;
  }

  // Muestra la ventana móvil de los últimos 20 puntos, pero con pan puedes ver más
  const mostrar = datosDia.slice(-20);
  chart.data.labels = mostrar.map(d => d.label);
  chart.data.datasets[0].data = mostrar.map(d => d.temp);
  chart.data.datasets[1].data = mostrar.map(d => d.hum);
  chart.update();
}

// ----------- MODAL HISTORIAL REINICIOS -----------
function cargarHistorialReinicios() {
  const list = JSON.parse(localStorage.getItem('reinicios_gambino')||'[]');
  const ul = document.getElementById('reboot-list');
  ul.innerHTML = list.length ? '' : '<li>No hay reinicios registrados.</li>';
  list.slice().reverse().forEach(r => {
    ul.innerHTML += `<li>
      <i class="ri-${r.icon || "restart"}-line"></i> 
      <b>${r.fecha}</b> &mdash; ${r.motivo}
    </li>`;
  });
}
function agregarReinicio(obj) {
  let list = JSON.parse(localStorage.getItem('reinicios_gambino')||'[]');
  list.push(obj);
  if(list.length>20) list = list.slice(-20);
  localStorage.setItem('reinicios_gambino', JSON.stringify(list));
}
