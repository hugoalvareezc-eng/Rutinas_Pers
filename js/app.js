/* ============================================================
   MAXIMUS GYM — Interacciones de UI
============================================================ */

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Nav scroll + mobile menu ---------- */
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const navBurger = document.getElementById("navBurger");

navBurger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

window.addEventListener("scroll", () => {
  nav.style.background = window.scrollY > 40 ? "rgba(10,9,8,0.9)" : "rgba(10,9,8,0.65)";
});

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

/* ---------- Wizard state ---------- */
const state = {
  name: "", age: null, sex: null, goal: null,
  level: null, days: null, place: null,
  focusArea: "ninguna", limitations: ""
};

let currentStep = 1;
const totalSteps = 4;

const stepsEls = document.querySelectorAll(".wizard__step");
const barFill = document.getElementById("barFill");
const stepLabels = document.querySelectorAll("[data-step-label]");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnGenerate = document.getElementById("btnGenerate");
const wizardError = document.getElementById("wizardError");

/* Pill / option-card selection */
document.querySelectorAll(".pill-group").forEach(group => {
  const name = group.dataset.name;
  group.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      group.querySelectorAll(".pill").forEach(p => p.classList.remove("selected"));
      pill.classList.add("selected");
      state[name] = pill.dataset.value;
      wizardError.textContent = "";
    });
  });
});

document.querySelectorAll(".option-grid").forEach(group => {
  const name = group.dataset.name;
  group.querySelectorAll(".option-card").forEach(card => {
    card.addEventListener("click", () => {
      group.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      state[name] = card.dataset.value;
      wizardError.textContent = "";
    });
  });
});

function goToStep(n) {
  stepsEls.forEach(s => s.classList.toggle("active", Number(s.dataset.step) === n));
  stepLabels.forEach(l => l.classList.toggle("active", Number(l.dataset.stepLabel) <= n));
  barFill.style.width = `${(n / totalSteps) * 100}%`;
  btnPrev.disabled = n === 1;
  btnNext.style.display = n === totalSteps ? "none" : "inline-flex";
  btnGenerate.style.display = n === totalSteps ? "inline-flex" : "none";
  wizardError.textContent = "";
  currentStep = n;
}

function validateStep(n) {
  const age = document.getElementById("age").value;
  if (n === 1) {
    if (!age || age < 12 || age > 90) return "Ingresa una edad válida (entre 12 y 90 años).";
    if (!state.sex) return "Selecciona una opción de sexo.";
  }
  if (n === 2 && !state.goal) return "Selecciona tu objetivo principal.";
  if (n === 3) {
    if (!state.level) return "Selecciona tu nivel de experiencia.";
    if (!state.days) return "Selecciona cuántos días puedes entrenar.";
    if (!state.place) return "Selecciona dónde entrenas.";
  }
  return null;
}

btnNext.addEventListener("click", () => {
  const err = validateStep(currentStep);
  if (err) { wizardError.textContent = err; return; }
  if (currentStep < totalSteps) goToStep(currentStep + 1);
});

btnPrev.addEventListener("click", () => {
  if (currentStep > 1) goToStep(currentStep - 1);
});

/* ---------- Submit / Generate ---------- */
const form = document.getElementById("routineForm");
const resultsSection = document.getElementById("results");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const err = validateStep(3);
  if (err) { wizardError.textContent = err; return; }

  state.name = document.getElementById("name").value.trim();
  state.age = Number(document.getElementById("age").value);
  state.limitations = document.getElementById("limitations").value.trim();

  const profile = {
    age: state.age,
    sex: state.sex,
    goal: state.goal,
    level: state.level,
    days: Number(state.days),
    place: state.place,
    focusArea: state.focusArea,
    limitations: state.limitations
  };

  const routine = buildRoutine(profile);
  renderResults(routine, state.name);

  resultsSection.classList.add("active");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ---------- Render results ---------- */
function renderResults(routine, name) {
  const { profile, scheme, nutrition, days, generalNotes } = routine;

  document.getElementById("resultsTitle").textContent =
    name ? `Rutina personalizada de ${name}` : "Rutina personalizada";

  const goalLabel = GOAL_SCHEMES[profile.goal].label;
  const placeLabel = { gym: "Gimnasio completo", home_dumbbell: "Casa con mancuernas", home_bodyweight: "Casa sin equipo" }[profile.place];
  const levelLabel = { principiante: "Principiante", intermedio: "Intermedio", avanzado: "Avanzado" }[profile.level];

  document.getElementById("resultsMeta").innerHTML = `
    <span class="meta-chip">${profile.age} años</span>
    <span class="meta-chip">${goalLabel}</span>
    <span class="meta-chip">${levelLabel}</span>
    <span class="meta-chip">${profile.days} días/semana</span>
    <span class="meta-chip">${placeLabel}</span>
  `;

  const notesEl = document.getElementById("resultsNotes");
  notesEl.innerHTML = generalNotes.length
    ? `<ul>${generalNotes.map(n => `<li>${n}</li>`).join("")}</ul>`
    : "";

  const daysEl = document.getElementById("resultsDays");
  daysEl.innerHTML = days.map(day => `
    <div class="day-card">
      <h3>${day.name}</h3>
      <p class="day-card__block-title">Calentamiento</p>
      <p class="day-card__warmup">${day.warmup}</p>
      <p class="day-card__block-title">Ejercicios · ${scheme.sets} series x ${scheme.reps} reps · Descanso ${scheme.rest}</p>
      ${day.exercises.map(ex => `
        <div class="exercise">
          <div class="exercise__head">
            <span class="exercise__name">${ex.flagged ? '<span class="exercise__flag">⚠️ </span>' : ""}${ex.name}</span>
            <span class="exercise__scheme">${scheme.sets}x${scheme.reps}</span>
          </div>
          <p class="exercise__tip">💡 ${ex.tip}</p>
        </div>
      `).join("")}
      ${day.cardioFinisher ? `
        <p class="day-card__block-title">Finisher de cardio</p>
        <div class="exercise">
          <div class="exercise__head">
            <span class="exercise__name">${day.cardioFinisher.name}</span>
            <span class="exercise__scheme">3 x 45 seg</span>
          </div>
          <p class="exercise__tip">💡 ${day.cardioFinisher.tip}</p>
        </div>
      ` : ""}
      <p class="day-card__block-title">Enfriamiento</p>
      <p class="day-card__cooldown">${day.cooldown}</p>
    </div>
  `).join("");

  document.getElementById("resultsNutrition").innerHTML = `
    <h3>Recomendación nutricional</h3>
    <p>${nutrition}</p>
  `;
}

/* ---------- Print & Restart ---------- */
document.getElementById("btnPrint").addEventListener("click", () => window.print());

document.getElementById("btnRestart").addEventListener("click", () => {
  resultsSection.classList.remove("active");
  document.getElementById("generador").scrollIntoView({ behavior: "smooth", block: "start" });
});
