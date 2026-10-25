const progressBar = document.getElementById("progressBar");
const mainNav = document.getElementById("mainNav");
const menuToggle = document.getElementById("menuToggle");

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

const processContent = [
  {
    number: "ETAPA 01 / 04", icon: "▤", title: "Datos de entrada",
    text: "El sistema recibe información, como hojas de vida, experiencia, formación y requisitos del cargo. La calidad y representatividad de esos datos importan.",
    note: "Si los datos reflejan desigualdades del pasado, pueden transmitirlas al sistema."
  },
  {
    number: "ETAPA 02 / 04", icon: "⌘", title: "Entrenamiento",
    text: "Durante el entrenamiento, el modelo identifica patrones en los ejemplos disponibles y ajusta sus parámetros para cumplir un objetivo.",
    note: "Si los ejemplos están desequilibrados, el sistema puede aprender asociaciones injustas."
  },
  {
    number: "ETAPA 03 / 04", icon: "⌕", title: "Evaluación",
    text: "El sistema compara los perfiles con los criterios definidos y estima qué tan bien se ajustan a la vacante.",
    note: "Un criterio mal elegido o una variable indirecta puede perjudicar a ciertos grupos."
  },
  {
    number: "ETAPA 04 / 04", icon: "⇢", title: "Recomendación",
    text: "La herramienta puede ordenar perfiles, señalar coincidencias o recomendar candidatos para que el equipo de selección los revise.",
    note: "Una recomendación no debería convertirse automáticamente en una decisión final."
  }
];

const processButtons = document.querySelectorAll(".process-step");
const processDetail = document.getElementById("processDetail");

processButtons.forEach(button => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.step);
    const item = processContent[index];
    processButtons.forEach((other, i) => {
      const active = i === index;
      other.classList.toggle("active", active);
      other.setAttribute("aria-selected", String(active));
      other.querySelector("i").textContent = active ? "−" : "＋";
    });
    processDetail.innerHTML = `
      <div class="detail-number">${item.number}</div>
      <div class="detail-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <div class="detail-note"><b>¿Dónde puede aparecer un riesgo?</b><span>${item.note}</span></div>
    `;
  });
});

// Simulador didáctico: los perfiles son ficticios y no se calcula una puntuación automática.
const candidateFeedback = [
  {
    title: "Perfil A: experiencia inicial",
    text: "Presenta un proyecto personal publicado y seis meses de experiencia. Es relevante revisar la calidad del proyecto y las competencias demostradas, no asumir que la experiencia por sí sola determina el potencial."
  },
  {
    title: "Perfil B: experiencia colaborativa",
    text: "Presenta un proyecto académico y práctica colaborativa. Conviene evaluar su contribución concreta, conocimientos y capacidad para resolver problemas con los mismos criterios usados para los demás perfiles."
  },
  {
    title: "Perfil C: experiencia independiente",
    text: "Presenta un proyecto freelance y un portafolio. Es importante revisar el trabajo realizado y verificar las competencias, sin asumir que el tipo de experiencia garantiza mayor calidad."
  }
];
const simResult = document.getElementById("simResult");
document.querySelectorAll(".candidate-button").forEach(button => {
  button.addEventListener("click", () => {
    const profile = candidateFeedback[Number(button.dataset.candidate)];
    simResult.innerHTML = `
      <div class="result-icon">i</div>
      <div><b>${profile.title}</b><p>${profile.text}</p></div>
    `;
    document.querySelectorAll(".candidate-button").forEach(btn => {
      btn.classList.toggle("selected", btn === button);
    });
  });
});

// Pregunta de comprobación
const quizOptions = document.querySelectorAll("#quizOptions button");
const quizFeedback = document.getElementById("quizFeedback");
const retryQuiz = document.getElementById("retryQuiz");

quizOptions.forEach(option => {
  option.addEventListener("click", () => {
    quizOptions.forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.answer === "correct") btn.classList.add("correct");
    });
    if (option.dataset.answer === "correct") {
      quizFeedback.textContent = "¡Correcto! Los datos históricos pueden contener desigualdades que el sistema reproduzca.";
    } else {
      option.classList.add("wrong");
      quizFeedback.textContent = "No exactamente. El riesgo ético está en que el sistema aprenda patrones de contratación desequilibrados.";
    }
    retryQuiz.hidden = false;
  });
});
retryQuiz.addEventListener("click", () => {
  quizOptions.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("correct", "wrong");
  });
  quizFeedback.textContent = "";
  retryQuiz.hidden = true;
});

// Resaltar enlaces de navegación según la sección visible
const observedSections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".main-nav a");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      const active = link.getAttribute("href") === `#${entry.target.id}`;
      link.classList.toggle("current", active);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px" });
observedSections.forEach(section => observer.observe(section));
