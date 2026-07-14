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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Selecciona ejercicios de un grupo muscular según la edad del usuario,
   evitando repetir ejercicios ya usados en la misma sesión (usedNames) */
function pickExercises(group, count, ctx, usedNames) {
  const pool = EXERCISES[group] || [];
  const { avoidHighImpact } = ctx;

  const available = pool.filter(ex => {
    if (usedNames.has(ex.name)) return false;
    if (avoidHighImpact && ex.impact === "high") return false;
    return true;
  });

  // ordena compuestos primero, luego mezcla el resto
  const compounds = shuffle(available.filter(e => e.compound));
  const isolations = shuffle(available.filter(e => !e.compound));
  const ordered = [...compounds, ...isolations];

  const chosen = ordered.slice(0, count);
  chosen.forEach(ex => usedNames.add(ex.name));
  return chosen;
}

/* Cuántos ejercicios por grupo muscular según cuántos grupos se eligieron
   y el nivel del usuario. Menos grupos = rutina más larga por grupo,
   para que una sesión de un solo músculo se sienta completa. */
const PER_GROUP_COUNT = {
  1: { principiante: 5, intermedio: 6, avanzado: 8 },
  2: { principiante: 3, intermedio: 4, avanzado: 5 },
  3: { principiante: 2, intermedio: 3, avanzado: 4 },
  4: { principiante: 2, intermedio: 2, avanzado: 3 }
};

function perGroupCount(groupCount, level) {
  const key = Math.min(groupCount, 4);
  return PER_GROUP_COUNT[key][level];
}

/* Arma la plantilla de la sesión: qué grupos musculares y cuántos
   ejercicios de cada uno */
function buildBlueprint(muscles, level) {
  if (muscles.includes("fullbody")) {
    const coreCount = level === "principiante" ? 1 : 2;
    const blueprint = FULLBODY_GROUPS.map(g => [g, coreCount]);
    if (level !== "principiante") {
      blueprint.push(["biceps", 1], ["triceps", 1]);
    }
    return blueprint;
  }

  const count = perGroupCount(muscles.length, level);
  return muscles.map(g => [g, count]);
}

function buildTitle(muscles) {
  if (muscles.includes("fullbody")) return "Cuerpo Completo";
  const labels = muscles.map(m => MUSCLE_LABELS[m]);
  if (labels.length === 1) return labels[0];
  return labels.slice(0, -1).join(", ") + " y " + labels[labels.length - 1];
}

const WARMUP = "8-10 min de cardio suave (bici, elíptica o cinta) + movilidad articular de la zona que vas a trabajar + 1-2 series de aproximación con poco peso antes de tu primer ejercicio.";
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
