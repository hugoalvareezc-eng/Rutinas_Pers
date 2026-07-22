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
  cuadriceps: "Cuádriceps",
  femoral: "Femoral",
  pantorrilla: "Pantorrilla",
  gluteo: "Glúteo",
  biceps: "Bíceps",
  triceps: "Tríceps",
  antebrazo: "Antebrazo",
  abs: "Abdomen",
  cardio: "Finisher de cardio"
};

const FULLBODY_GROUPS = ["pecho", "espalda", "hombro", "abs", "cuadriceps", "femoral"];

/* Los músculos "grandes": cuando se combinan con otros, mantienen casi
   el mismo volumen que si se hubieran elegido solos, en vez de
   recortarse al nivel de un músculo chico. */
const LARGE_MUSCLES = ["pecho", "espalda", "cuadriceps"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Filtra por edad (alto impacto) y evita repetidos. Si el usuario marcó
   alguna molestia/lesión, separa además un set "seguro" sin esos
   ejercicios; si ese set no alcanza para el cupo pedido, se cae de
   vuelta al set completo (marcando esos ejercicios con ⚠️ más abajo)
   en vez de dejar la sesión más corta de lo prometido. */
function filterByContext(pool, ctx, usedNames) {
  const { avoidHighImpact, limitations } = ctx;
  const base = pool.filter(ex => {
    if (usedNames.has(ex.name)) return false;
    if (avoidHighImpact && ex.impact === "high") return false;
    return true;
  });

  if (!limitations || !limitations.length) return { usable: base, limitations };

  const safe = base.filter(ex => !(ex.caution && ex.caution.some(c => limitations.includes(c))));
  return { usable: safe.length ? safe : base, limitations };
}

function flagExercise(ex, limitations) {
  const flagged = !!(limitations && limitations.length && ex.caution && ex.caution.some(c => limitations.includes(c)));
  return flagged ? { ...ex, flagged: true } : ex;
}

/* Selecciona ejercicios de un grupo muscular, priorizando compuestos
   sobre aislamiento. */
function pickExercises(group, count, ctx, usedNames) {
  const pool = EXERCISES[group] || [];
  const { usable, limitations } = filterByContext(pool, ctx, usedNames);

  const compounds = shuffle(usable.filter(e => e.compound));
  const isolations = shuffle(usable.filter(e => !e.compound));
  const ordered = [...compounds, ...isolations];

  const chosen = ordered.slice(0, count).map(ex => flagExercise(ex, limitations));
  chosen.forEach(ex => usedNames.add(ex.name));
  return chosen;
}

/* Femoral mezcla ejercicios de peso libre (peso muerto rumano, buenos
   días) con máquina (curl acostado/de pie). Los compuestos de peso
   libre siempre saldrían primero por prioridad, dejando la máquina
   fuera; aquí se garantiza que aparezca al menos una máquina. */
function pickFemoralExercises(count, ctx, usedNames) {
  const pool = EXERCISES.femoral;
  const { usable, limitations } = filterByContext(pool, ctx, usedNames);

  const machines = shuffle(usable.filter(e => e.sub === "femoral_machine"));
  const compounds = shuffle(usable.filter(e => e.sub === "femoral_compound"));

  const chosen = [];
  if (count >= 1 && machines.length) chosen.push(machines.shift());

  const rest = shuffle([...machines, ...compounds]);
  while (chosen.length < count && rest.length) chosen.push(rest.shift());

  const flagged = chosen.map(ex => flagExercise(ex, limitations));
  flagged.forEach(ex => usedNames.add(ex.name));
  return flagged;
}

/* Elige UN reemplazo para un ejercicio puntual (botón "Cambiar ejercicio"). */
function pickReplacement(group, ctx, usedNames) {
  const pool = EXERCISES[group] || [];
  const { usable, limitations } = filterByContext(pool, ctx, usedNames);

  const compounds = shuffle(usable.filter(e => e.compound));
  const isolations = shuffle(usable.filter(e => !e.compound));
  const ordered = [...compounds, ...isolations];

  const picked = ordered[0];
  if (!picked) return null;
  const chosen = flagExercise(picked, limitations);
  usedNames.add(chosen.name);
  return chosen;
}

/* Cantidad de ejercicios para un músculo "chico" cuando se combina con
   otros. El músculo grande no usa esta tabla: conserva casi el mismo
   volumen que si estuviera solo (ver SINGLE_MUSCLE_COUNT). */
const PER_GROUP_COUNT = {
  2: { principiante: 3, intermedio: 4, avanzado: 4 },
  3: { principiante: 3, intermedio: 3, avanzado: 4 },
  4: { principiante: 3, intermedio: 3, avanzado: 3 }
};

/* Volumen de un músculo elegido solo, y también el que recibe un
   músculo "grande" dentro de una combinación. */
const SINGLE_MUSCLE_COUNT = { principiante: 5, intermedio: 5, avanzado: 6 };

/* Objetivos orientados a quemar grasa / resistencia usan más ejercicios
   por músculo (estilo circuito) en vez de menos series pesadas, y un
   finisher de cardio más largo (2 ejercicios) en vez de uno solo. */
const GOAL_VOLUME_BONUS = { hipertrofia: 0, perdida_peso: 2, fuerza: 0, tonificacion: 1, resistencia: 2 };
const CARDIO_FINISHER_COUNT = { hipertrofia: 0, perdida_peso: 2, fuerza: 0, tonificacion: 1, resistencia: 2 };

/* Entreno rápido (~45-60 min): recorta ejercicios por músculo sin
   dejar la sesión demasiado corta. */
const DURATION_ADJUST = { completo: 0, rapido: -2 };
const MIN_PER_GROUP = 3;

function perGroupCount(groupCount, level) {
  const key = Math.min(groupCount, 4);
  return PER_GROUP_COUNT[key][level];
}

function applyDuration(count, duration) {
  return Math.max(MIN_PER_GROUP, count + (DURATION_ADJUST[duration] || 0));
}

/* Arma la plantilla de la sesión: qué grupos musculares y cuántos
   ejercicios de cada uno. Al combinar varios músculos, los grandes
   (pecho, espalda, cuádriceps) mantienen casi el volumen de un día
   dedicado solo a ellos, mientras los chicos usan el cupo reducido.
   El bono de volumen por objetivo se suma sobre esa base, y luego se
   ajusta según la duración deseada. */
function buildBlueprint(muscles, level, goal, duration) {
  const bonus = GOAL_VOLUME_BONUS[goal] || 0;

  let blueprint;
  if (muscles.includes("fullbody")) {
    const fullbodyBonus = Math.min(bonus, 1);
    blueprint = FULLBODY_GROUPS.map(g => [g, 2 + fullbodyBonus]);
    blueprint.push(["biceps", 1], ["triceps", 1], ["antebrazo", 1], ["pantorrilla", 1]);
  } else if (muscles.length === 1) {
    blueprint = [[muscles[0], SINGLE_MUSCLE_COUNT[level] + bonus]];
  } else {
    const smallCount = perGroupCount(muscles.length, level) + bonus;
    const largeCount = SINGLE_MUSCLE_COUNT[level] + bonus;
    blueprint = muscles.map(g => [g, LARGE_MUSCLES.includes(g) ? largeCount : smallCount]);
  }

  return blueprint.map(([g, count]) => [g, applyDuration(count, duration)]);
}

function buildTitle(muscles) {
  if (muscles.includes("fullbody")) return "Cuerpo Completo";
  const labels = muscles.map(m => MUSCLE_LABELS[m]);
  if (labels.length === 1) return labels[0];
  return labels.slice(0, -1).join(", ") + " y " + labels[labels.length - 1];
}

const WARMUP = "8-10 min de cardio suave en elíptica o remo + movilidad articular de la zona que vas a trabajar + 1-2 series de aproximación con poco peso antes de tu primer ejercicio.";
const COOLDOWN = "8-10 min de estiramientos estáticos de los músculos trabajados hoy, respirando profundo en cada posición (20-30 seg por músculo).";

function pickForGroup(group, count, ctx, usedNames) {
  if (group === "femoral") return pickFemoralExercises(count, ctx, usedNames);
  return pickExercises(group, count, ctx, usedNames);
}

function buildRoutine(profile) {
  const { age, goal, level, muscles, limitations, duration } = profile;

  const avoidHighImpact = age >= 55;
  const scheme = GOAL_SCHEMES[goal];
  const ctx = { avoidHighImpact, limitations: limitations || [] };
  const usedNames = new Set();

  const blueprint = buildBlueprint(muscles, level, goal, duration);

  const blocks = blueprint
    .map(([group, count]) => ({
      muscle: group,
      label: MUSCLE_LABELS[group],
      exercises: pickForGroup(group, count, ctx, usedNames)
    }))
    .filter(block => block.exercises.length > 0);

  let cardioCount = CARDIO_FINISHER_COUNT[goal] || 0;
  if (duration === "rapido") cardioCount = Math.min(cardioCount, 1);
  if (cardioCount > 0) {
    const cardioExercises = pickExercises("cardio", cardioCount, ctx, usedNames);
    if (cardioExercises.length) {
      blocks.push({ muscle: "cardio", label: MUSCLE_LABELS.cardio, exercises: cardioExercises, isCardio: true });
    }
  }

  const totalExercises = blocks.reduce((sum, b) => sum + b.exercises.length, 0);

  return {
    profile,
    scheme,
    nutrition: NUTRITION_TIPS[goal],
    title: buildTitle(muscles),
    warmup: WARMUP,
    blocks,
    cooldown: COOLDOWN,
    totalExercises,
    generalNotes: buildGeneralNotes(profile),
    ctx,
    usedNames
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
  if (profile.limitations && profile.limitations.length) {
    notes.push("Marcamos con ⚠️ los ejercicios que exigen más la zona que indicaste. Si sientes dolor, usa 'Cambiar ejercicio' o consulta a un profesional de la salud antes de continuar.");
  }
  if (profile.duration === "rapido") {
    notes.push("Esta es una versión condensada para entrenar en aproximadamente una hora. Si te sobra tiempo, agrega 1-2 series extra a tus ejercicios favoritos.");
  }
  notes.push("La progresión es clave: cuando completes todas las series y repeticiones con buena técnica, aumenta el peso ligeramente en tu próxima sesión de este músculo.");
  notes.push("Descansa al menos 48 horas antes de volver a entrenar el mismo grupo muscular y duerme 7-9 horas para una óptima recuperación.");
  return notes;
}
