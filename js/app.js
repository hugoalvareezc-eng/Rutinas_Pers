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
  level: null, muscles: []
};

let currentStep = 1;
const totalSteps = 3;

const stepsEls = document.querySelectorAll(".wizard__step");
const barFill = document.getElementById("barFill");
const stepLabels = document.querySelectorAll("[data-step-label]");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnGenerate = document.getElementById("btnGenerate");
const wizardError = document.getElementById("wizardError");

/* Pill selection — soporta selección única (radio) y múltiple (data-multi) */
document.querySelectorAll(".pill-group").forEach(group => {
  const name = group.dataset.name;
  const isMulti = group.dataset.multi === "true";

  group.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      if (!isMulti) {
        group.querySelectorAll(".pill").forEach(p => p.classList.remove("selected"));
        pill.classList.add("selected");
        state[name] = pill.dataset.value;
      } else {
        const value = pill.dataset.value;
        const isFullbody = value === "fullbody";

        if (isFullbody) {
          // "Cuerpo completo" es excluyente con cualquier otra selección
          group.querySelectorAll(".pill").forEach(p => p.classList.remove("selected"));
          pill.classList.add("selected");
          state[name] = ["fullbody"];
        } else {
          group.querySelector('.pill[data-value="fullbody"]')?.classList.remove("selected");
          pill.classList.toggle("selected");
          state[name] = Array.from(group.querySelectorAll(".pill.selected"))
            .map(p => p.dataset.value)
            .filter(v => v !== "fullbody");
        }
      }
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
    if (!state.level) return "Selecciona tu nivel.";
    if (!state.muscles.length) return "Selecciona al menos un músculo a entrenar hoy.";
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

  const profile = {
    age: state.age,
    sex: state.sex,
    goal: state.goal,
    level: state.level,
    muscles: state.muscles
  };

  const routine = buildRoutine(profile);
  renderResults(routine, state.name);

  resultsSection.classList.add("active");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ---------- Render results ---------- */
let currentRoutine = null;

function exerciseCardHTML(ex, opts) {
  const schemeText = opts.schemeLabel || `${opts.scheme.sets}x${opts.scheme.reps}`;
  const swapAttrs = `data-muscle="${opts.muscle}" data-block-idx="${opts.blockIdx}" data-ex-idx="${opts.exIdx}"`;

  return `
    <div class="exercise">
      <div class="exercise__icon">${renderMovementIcon(ex.pattern)}</div>
      <div class="exercise__body">
        <div class="exercise__head">
          <span class="exercise__name">${ex.name}</span>
          <span class="exercise__scheme">${schemeText}</span>
        </div>
        ${ex.sub ? `<span class="exercise__target">🎯 ${SUB_LABELS[ex.sub]}</span>` : ""}
        <p class="exercise__tip">💡 ${ex.tip}</p>
        <button type="button" class="exercise__swap" ${swapAttrs}>⟲ Cambiar ejercicio</button>
      </div>
    </div>
  `;
}

function renderResults(routine, name) {
  currentRoutine = routine;
  const { profile, scheme, nutrition, title, warmup, blocks, cooldown, totalExercises, generalNotes } = routine;

  document.getElementById("resultsTitle").textContent =
    name ? `Rutina de ${title} de ${name}` : `Rutina de ${title}`;

  const goalLabel = GOAL_SCHEMES[profile.goal].label;
  const levelLabel = { principiante: "Principiante", intermedio: "Intermedio", avanzado: "Avanzado" }[profile.level];

  document.getElementById("resultsMeta").innerHTML = `
    <span class="meta-chip">${profile.age} años</span>
    <span class="meta-chip">${goalLabel}</span>
    <span class="meta-chip">${levelLabel}</span>
    <span class="meta-chip">${totalExercises} ejercicios</span>
  `;

  const notesEl = document.getElementById("resultsNotes");
  notesEl.innerHTML = generalNotes.length
    ? `<ul>${generalNotes.map(n => `<li>${n}</li>`).join("")}</ul>`
    : "";

  const sessionEl = document.getElementById("resultsSession");
  sessionEl.innerHTML = `
    <div class="session-card">
      <p class="session-card__block-title">Calentamiento</p>
      <p class="session-card__warmup">${warmup}</p>

      <p class="session-card__scheme-note">${scheme.sets} series x ${scheme.reps} reps · Descanso ${scheme.rest}</p>

      ${blocks.map((block, blockIdx) => `
        <h3 class="session-card__muscle">${block.label}</h3>
        ${block.exercises.map((ex, exIdx) => exerciseCardHTML(ex, {
          scheme,
          schemeLabel: block.isCardio ? "3 x 45 seg" : null,
          muscle: block.muscle,
          blockIdx,
          exIdx
        })).join("")}
      `).join("")}

      <p class="session-card__block-title">Enfriamiento</p>
      <p class="session-card__cooldown">${cooldown}</p>
    </div>
  `;

  document.getElementById("resultsNutrition").innerHTML = `
    <h3>Recomendación nutricional</h3>
    <p>${nutrition}</p>
  `;
}

/* ---------- Cambiar ejercicio (swap) ---------- */
document.getElementById("resultsSession").addEventListener("click", (e) => {
  const btn = e.target.closest(".exercise__swap");
  if (!btn || !currentRoutine) return;

  const muscle = btn.dataset.muscle;
  const replacement = pickReplacement(muscle, currentRoutine.ctx, currentRoutine.usedNames);

  if (!replacement) {
    btn.disabled = true;
    btn.textContent = "No hay más opciones para este músculo";
    return;
  }

  const blockIdx = Number(btn.dataset.blockIdx);
  const exIdx = Number(btn.dataset.exIdx);
  const block = currentRoutine.blocks[blockIdx];
  block.exercises[exIdx] = replacement;

  const opts = {
    scheme: currentRoutine.scheme,
    schemeLabel: block.isCardio ? "3 x 45 seg" : null,
    muscle,
    blockIdx,
    exIdx
  };

  btn.closest(".exercise").outerHTML = exerciseCardHTML(replacement, opts);
});

/* ---------- Print & Restart ---------- */
document.getElementById("btnPrint").addEventListener("click", () => window.print());

document.getElementById("btnRestart").addEventListener("click", () => {
  resultsSection.classList.remove("active");
  document.getElementById("generador").scrollIntoView({ behavior: "smooth", block: "start" });
});
