// Estructura de datos para las 6 Estaciones de la Ruta
const STATIONS = [
  {
    id: 1,
    title: "Popayán - La Ciudad Blanca",
    location: "Popayán (1,760 msnm)",
    desc: "Comienzas tu expedición en la capital caucana. Prepara tus provisiones y demuestra tu conocimiento sobre la gastronomía local.",
    question: "¿Cuál es el ingrediente base tradicional del pipián representativo de Popayán?",
    options: [
      "Papa colorada y maní",
      "Maíz tierno y queso",
      "Yuca y pescado seco",
      "Plátano verde y ahogado"
    ],
    correct: 0,
    badgeName: "Sabueso del Pipián",
    badgeIcon: "fa-utensils"
  },
  {
    id: 2,
    title: "Valle de los Frailejones",
    location: "PNN Puracé (3,100 msnm)",
    desc: "Ingresas a los dominios del páramo. Los frailejones retienen el agua de las nubes y alimentan los ríos de Colombia.",
    question: "¿A qué ritmo promedio crece un frailejón (*Espeletia*) por año?",
    options: [
      "10 a 15 cm por año",
      "Aproximadamente 1 cm por año",
      "50 cm por año",
      "5 cm cada mes"
    ],
    correct: 1,
    badgeName: "Guardián del Páramo",
    badgeIcon: "fa-plant-wilt"
  },
  {
    id: 3,
    title: "Termales de San Juan",
    location: "Sector Termales (3,300 msnm)",
    desc: "Un ecosistema vibrante con aguas azufradas de tonalidades verdosas y turquesas impulsadas por la actividad volcánica subterránea.",
    question: "¿A qué se debe el color característico y las columnas de vapor de los Termales de San Juan?",
    options: [
      "Alas de mariposas endémicas",
      "Minerales sulfurosos y calor geotérmico",
      "Vertimiento de algas marinas artificiales",
      "Filtros de cuarzo en las rocas"
    ],
    correct: 1,
    badgeName: "Explorador Volcánico",
    badgeIcon: "fa-hot-tub-person"
  },
  {
    id: 4,
    title: "Mirador de Cóndores",
    location: "Serranía del Puracé (3,600 msnm)",
    desc: "En esta zona habita el majestuoso Cóndor de los Andes, ave simbólica de los ecosistemas altitudinales sudamericanos.",
    question: "¿Cuál es una de las principales amenazas para la conservación del Cóndor Andino?",
    options: [
      "Pérdida de hábitat y envenenamiento",
      "Exceso de turismo fotográfico",
      "Bajas temperaturas de la cumbre",
      "Competencia con colibríes"
    ],
    correct: 0,
    badgeName: "Amigo del Cóndor",
    badgeIcon: "fa-crow"
  },
  {
    id: 5,
    title: "Nacimiento del Río Cauca",
    location: "Estrella Fluvial (3,650 msnm)",
    desc: "Estás en el Macizo Colombiano, el gran nacedero donde cobran vida algunos de los ríos más importantes del país.",
    question: "¿Qué otro río importante nace en el Macizo Colombiano junto con el Río Cauca?",
    options: [
      "Río Amazonas",
      "Río Magdalena",
      "Río Orinoco",
      "Río Atrato"
    ],
    correct: 1,
    badgeName: "Protector del Agua",
    badgeIcon: "fa-droplet"
  },
  {
    id: 6,
    title: "Cumbre del Volcán Puracé",
    location: "Cráter del Puracé (4,650 msnm)",
    desc: "¡Último esfuerzo! El aire es denso y frío. Responde acertadamente para coronar el volcán activo.",
    question: "¿Qué significa la palabra 'Puracé' en la lengua autóctona de la región?",
    options: [
      "Montaña de Hielo",
      "Montaña de Fuego (o Agua de Fuego)",
      "Valle de las Nubes",
      "Tierra del Viento"
    ],
    correct: 1,
    badgeName: "Cumbre del Puracé",
    badgeIcon: "fa-trophy"
  }
];

// Estado global de la partida
let currentStep = 0;
let energy = 100;
let score = 0;
let answeredCurrent = false;
let unlockedBadges = new Array(STATIONS.length).fill(false);

// Inicializar la interfaz al cargar
document.addEventListener("DOMContentLoaded", () => {
  renderStepper();
  renderBadges();
  loadStation(currentStep);
});

// Renderizar línea de estaciones (stepper)
function renderStepper() {
  const container = document.getElementById("station-stepper");
  const progressLine = document.getElementById("progress-line");
  
  // Limpiar nodos anteriores exceptuando la barra
  container.querySelectorAll(".step-node").forEach(node => node.remove());

  STATIONS.forEach((st, idx) => {
    const node = document.createElement("div");
    let stateClass = "upcoming";
    if (idx < currentStep) stateClass = "completed";
    else if (idx === currentStep) stateClass = "current";

    node.className = `step-node ${stateClass}`;
    node.innerText = idx + 1;
    container.appendChild(node);
  });

  // Actualizar ancho de barra de progreso
  const progressPercent = (currentStep / (STATIONS.length - 1)) * 100;
  progressLine.style.width = `${progressPercent}%`;
}

// Cargar información de la estación
function loadStation(index) {
  const data = STATIONS[index];
  answeredCurrent = false;

  document.getElementById("station-badge").innerText = `Estación ${data.id} de ${STATIONS.length}`;
  document.getElementById("station-location").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location}`;
  document.getElementById("station-title").innerText = data.title;
  document.getElementById("station-desc").innerText = data.desc;
  document.getElementById("question-text").innerText = data.question;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  data.options.forEach((optText, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = `${String.fromCharCode(65 + i)}. ${optText}`;
    btn.onclick = () => selectOption(i);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("btn-next").disabled = true;
  hideFeedback();
  renderStepper();
}

// Manejar la selección de respuestas
function selectOption(selectedIndex) {
  if (answeredCurrent) return;
  answeredCurrent = true;

  const data = STATIONS[currentStep];
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach(btn => btn.disabled = true);

  if (selectedIndex === data.correct) {
    buttons[selectedIndex].classList.add("correct");
    score += 100;
    unlockedBadges[currentStep] = true;
    showFeedback("¡Respuesta Correcta! Ganaste +100 XP y una insignia.", "bg-emerald-900/80 text-emerald-200 border border-emerald-600");
  } else {
    buttons[selectedIndex].classList.add("wrong");
    buttons[data.correct].classList.add("correct");
    energy = Math.max(0, energy - 15);
    showFeedback("Respuesta incorrecta. Perdiste 15% de energía en la caminata.", "bg-rose-900/80 text-rose-200 border border-rose-600");
  }

  updateStats();
  renderBadges();
  document.getElementById("btn-next").disabled = false;
}

// Avanzar a la siguiente estación
function nextStation() {
  if (energy <= 0) {
    alert("¡Te has quedado sin energía! Toma un descanso para recuperarte antes de continuar.");
    return;
  }

  if (currentStep < STATIONS.length - 1) {
    currentStep++;
    energy = Math.max(5, energy - 10); // Consumo por tramo
    updateStats();
    loadStation(currentStep);
  } else {
    showVictoryScreen();
  }
}

// Recuperar energía
function takeRest() {
  if (energy >= 100) {
    showFeedback("¡Ya estás con la energía al máximo (100%)!", "bg-sky-900/80 text-sky-200 border border-sky-600");
    return;
  }
  energy = Math.min(100, energy + 20);
  updateStats();
  showFeedback("Descansaste y bebiste agua pura. Recuperaste +20% de Energía.", "bg-sky-900/80 text-sky-200 border border-sky-600");
}

// Actualizar marcadores de la interfaz
function updateStats() {
  document.getElementById("energy-val").innerText = energy;
  document.getElementById("score-val").innerText = score;
}

// Galería de insignias
function renderBadges() {
  const container = document.getElementById("badges-container");
  container.innerHTML = "";

  STATIONS.forEach((st, i) => {
    const isUnlocked = unlockedBadges[i];
    const card = document.createElement("div");
    card.className = `badge-card ${isUnlocked ? 'unlocked' : ''}`;
    card.innerHTML = `
      <i class="fa-solid ${st.badgeIcon} text-xl mb-1 ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}"></i>
      <span class="text-[10px] text-center font-semibold leading-tight text-slate-300">${st.badgeName}</span>
    `;
    container.appendChild(card);
  });
}

// Mostrar feedback en pantalla
function showFeedback(text, bgClasses) {
  const el = document.getElementById("feedback-msg");
  el.className = `my-4 p-3 rounded-lg text-sm font-medium transition-all ${bgClasses}`;
  el.innerText = text;
  el.classList.remove("hidden");
}

function hideFeedback() {
  document.getElementById("feedback-msg").classList.add("hidden");
}

// Pantalla final de victoria
function showVictoryScreen() {
  const card = document.getElementById("game-card");
  card.innerHTML = `
    <div class="text-center py-8 space-y-4">
      <i class="fa-solid fa-trophy text-6xl text-amber-400 animate-bounce"></i>
      <h2 class="text-3xl font-extrabold text-white">¡Felicidades, Guardián del Puracé!</h2>
      <p class="text-slate-300 max-w-md mx-auto">
        Has completado el recorrido desde Popayán hasta la cumbre del Volcán Puracé. 
      </p>
      <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-700 inline-block text-left space-y-2">
        <p class="text-sm text-slate-300"><i class="fa-solid fa-star text-yellow-400 mr-2"></i>Puntaje Total: <strong class="text-white">${score} XP</strong></p>
        <p class="text-sm text-slate-300"><i class="fa-solid fa-bolt text-amber-400 mr-2"></i>Energía restante: <strong class="text-white">${energy}%</strong></p>
        <p class="text-sm text-slate-300"><i class="fa-solid fa-medal text-emerald-400 mr-2"></i>Insignias desbloqueadas: <strong class="text-white">${unlockedBadges.filter(Boolean).length} / ${STATIONS.length}</strong></p>
      </div>
      <div>
        <button onclick="location.reload()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition mt-4">
          Volver a Jugar
        </button>
      </div>
    </div>
  `;
}