/* ============================================================
   MAXIMUS GYM — Algoritmo generador de rutina del día
   El usuario elige qué músculo(s) quiere entrenar HOY y el
   algoritmo arma una sesión completa y extensa para esa zona,
   no un plan semanal.
============================================================ */

const MUSCLE_LABELS = {
  pecho: "Pecho",
  espalda: "Espalda",
  hombro: "Hombro",
  pierna: "Pierna",
  gluteo: "Glúteo",
  biceps: "Bíceps",
  triceps: "Tríceps",
  abs: "Abdomen"
};

const FULLBODY_GROUPS = ["pecho", "espalda", "pierna", "hombro", "abs"];

/* Los tres músculos "grandes": cuando se combinan con otros, reciben
   un ejercicio extra para no perder prioridad frente a músculos chicos. */
const LARGE_MUSCLES = ["pecho", "espalda", "pierna"];

/* Subgrupos que deben estar representados dentro de un grupo muscular,
   para que la selección aleatoria no favorezca solo un patrón (ej. puro
   cuádriceps en pierna, dejando fuera las máquinas de femoral). */
const MANDATORY_SUBGROUPS = {
  pierna: ["quad", "femoral_compound", "femoral_machine", "pantorrilla"]
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Selecciona ejercicios de un grupo muscular según la edad del usuario,
   evitando repetir ejercicios ya usados en la misma sesión (usedNames).
   Si el grupo tiene subgrupos obligatorios, garantiza al menos uno de
   cada subgrupo antes de rellenar el resto priorizando compuestos. */
function pickExercises(group, count, ctx, usedNames) {
  const pool = EXERCISES[group] || [];
  const { avoidHighImpact } = ctx;

  const available = pool.filter(ex => {
    if (usedNames.has(ex.name)) return false;
    if (avoidHighImpact && ex.impact === "high") return false;
    return true;
  });

  const chosen = [];
  const mandatorySubs = MANDATORY_SUBGROUPS[group] || [];
  mandatorySubs.forEach(sub => {
    if (chosen.length >= count) return;
    const options = shuffle(available.filter(e => e.sub === sub && !chosen.includes(e)));
    if (options.length) chosen.push(options[0]);
  });

  const remaining = available.filter(e => !chosen.includes(e));
  const compounds = shuffle(remaining.filter(e => e.compound));
  const isolations = shuffle(remaining.filter(e => !e.compound));
  const rest = [...compounds, ...isolations];

  while (chosen.length < count && rest.length) {
    chosen.push(rest.shift());
  }

  chosen.forEach(ex => usedNames.add(ex.name));
  return chosen;
}

/* Cuántos ejercicios por grupo muscular según cuántos grupos se eligieron.
   Se mantiene moderado y consistente entre niveles para que la sesión
   nunca se sienta ni demasiado corta ni excesivamente larga. */
const PER_GROUP_COUNT = {
  1: { principiante: 5, intermedio: 5, avanzado: 6 },
  2: { principiante: 4, intermedio: 5, avanzado: 6 },
  3: { principiante: 4, intermedio: 4, avanzado: 5 },
  4: { principiante: 4, intermedio: 4, avanzado: 4 }
};

function perGroupCount(groupCount, level) {
  const key = Math.min(groupCount, 4);
  return PER_GROUP_COUNT[key][level];
}

/* Arma la plantilla de la sesión: qué grupos musculares y cuántos
   ejercicios de cada uno. Al combinar varios músculos, los grandes
   (pecho, espalda, pierna) reciben un ejercicio extra sobre el resto. */
function buildBlueprint(muscles, level) {
  if (muscles.includes("fullbody")) {
    const blueprint = FULLBODY_GROUPS.map(g => [g, 2]);
    blueprint.push(["biceps", 1], ["triceps", 1]);
    return blueprint;
  }

  const base = perGroupCount(muscles.length, level);
  const isCombo = muscles.length > 1;
  return muscles.map(g => [g, base + (isCombo && LARGE_MUSCLES.includes(g) ? 1 : 0)]);
}

function buildTitle(muscles) {
  if (muscles.includes("fullbody")) return "Cuerpo Completo";
  const labels = muscles.map(m => MUSCLE_LABELS[m]);
  if (labels.length === 1) return labels[0];
  return labels.slice(0, -1).join(", ") + " y " + labels[labels.length - 1];
}

const WARMUP = "8-10 min de cardio suave en elíptica o remo + movilidad articular de la zona que vas a trabajar + 1-2 series de aproximación con poco peso antes de tu primer ejercicio.";
const COOLDOWN = "8-10 min de estiramientos estáticos de los músculos trabajados hoy, respirando profundo en cada posición (20-30 seg por músculo).";

function buildRoutine(profile) {
  const { age, goal, level, muscles } = profile;

  const avoidHighImpact = age >= 55;
  const scheme = GOAL_SCHEMES[goal];
  const ctx = { avoidHighImpact };
  const usedNames = new Set();

  const blueprint = buildBlueprint(muscles, level);

  const blocks = blueprint
    .map(([group, count]) => ({
      muscle: group,
      label: MUSCLE_LABELS[group],
      exercises: pickExercises(group, count, ctx, usedNames)
    }))
    .filter(block => block.exercises.length > 0);

  let cardioFinisher = null;
  if (scheme.cardio) {
    const c = pickExercises("cardio", 1, ctx, usedNames);
    if (c.length) cardioFinisher = c[0];
  }

  const totalExercises = blocks.reduce((sum, b) => sum + b.exercises.length, 0) + (cardioFinisher ? 1 : 0);

  return {
    profile,
    scheme,
    nutrition: NUTRITION_TIPS[goal],
    title: buildTitle(muscles),
    warmup: WARMUP,
    blocks,
    cardioFinisher,
    cooldown: COOLDOWN,
    totalExercises,
    generalNotes: buildGeneralNotes(profile)
  };
}

function buildGeneralNotes(profile) {
  const notes = [];
  if (profile.age < 16) {
    notes.push("Por tu edad, entrena idealmente bajo supervisión de un adulto o entrenador y prioriza siempre la técnica sobre el peso.");
  }
  if (profile.age >= 55) {
    notes.push("Se priorizaron ejercicios de bajo impacto para cuidar tus articulaciones. Aumenta el tiempo de calentamiento y progresa las cargas de forma gradual.");
  }
  notes.push("La progresión es clave: cuando completes todas las series y repeticiones con buena técnica, aumenta el peso ligeramente en tu próxima sesión de este músculo.");
  notes.push("Descansa al menos 48 horas antes de volver a entrenar el mismo grupo muscular y duerme 7-9 horas para una óptima recuperación.");
  return notes;
}
