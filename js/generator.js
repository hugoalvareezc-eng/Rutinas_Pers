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

/* Los tres músculos "grandes": cuando se combinan con otros, mantienen
   casi el mismo volumen que si se hubieran elegido solos, en vez de
   recortarse al nivel de un músculo chico. */
const LARGE_MUSCLES = ["pecho", "espalda", "pierna"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Selecciona ejercicios de un grupo muscular según la edad del usuario,
   evitando repetir ejercicios ya usados en la misma sesión (usedNames),
   priorizando compuestos sobre aislamiento. */
function pickExercises(group, count, ctx, usedNames) {
  const pool = EXERCISES[group] || [];
  const { avoidHighImpact } = ctx;

  const available = pool.filter(ex => {
    if (usedNames.has(ex.name)) return false;
    if (avoidHighImpact && ex.impact === "high") return false;
    return true;
  });

  const compounds = shuffle(available.filter(e => e.compound));
  const isolations = shuffle(available.filter(e => !e.compound));
  const ordered = [...compounds, ...isolations];

  const chosen = ordered.slice(0, count);
  chosen.forEach(ex => usedNames.add(ex.name));
  return chosen;
}

/* Pierna necesita una selección dedicada: si se deja al azar, los
   compuestos (mayoría sentadillas/prensa = cuádriceps) desplazan casi
   siempre al femoral. Aquí se reparte el cupo mitad y mitad entre
   cuádriceps y femoral (cuádriceps nunca más de 1 por encima), se
   reserva un cupo de pantorrilla, y dentro de femoral se asegura que
   aparezca al menos una máquina (curl acostado/de pie), no solo
   peso muerto rumano. */
function pickLegExercises(count, ctx, usedNames) {
  const pool = EXERCISES.pierna;
  const { avoidHighImpact } = ctx;

  const available = pool.filter(ex => {
    if (usedNames.has(ex.name)) return false;
    if (avoidHighImpact && ex.impact === "high") return false;
    return true;
  });

  const bySub = (sub) => shuffle(available.filter(e => e.sub === sub));

  const calfSlots = count >= 4 ? 1 : 0;
  const remaining = count - calfSlots;
  const femoralSlots = Math.floor(remaining / 2);
  const quadSlots = remaining - femoralSlots;

  const chosen = [];

  if (calfSlots) {
    const calf = bySub("pantorrilla")[0];
    if (calf) chosen.push(calf);
  }

  const femoralMachine = bySub("femoral_machine");
  const femoralCompound = bySub("femoral_compound");
  const femoralChosen = [];
  if (femoralSlots >= 1 && femoralMachine.length) femoralChosen.push(femoralMachine.shift());
  if (femoralSlots >= 2 && femoralCompound.length) femoralChosen.push(femoralCompound.shift());
  const femoralLeftover = shuffle([...femoralMachine, ...femoralCompound]);
  while (femoralChosen.length < femoralSlots && femoralLeftover.length) {
    femoralChosen.push(femoralLeftover.shift());
  }
  chosen.push(...femoralChosen);

  const quadPool = available.filter(e => e.sub === "quad");
  const quadCompounds = shuffle(quadPool.filter(e => e.compound));
  const quadIsolations = shuffle(quadPool.filter(e => !e.compound));
  chosen.push(...[...quadCompounds, ...quadIsolations].slice(0, quadSlots));

  // si algún subgrupo se quedó corto (pool agotado), rellena con lo que quede
  while (chosen.length < count) {
    const chosenNames = new Set(chosen.map(e => e.name));
    const leftover = shuffle(available.filter(e => !chosenNames.has(e.name)));
    if (!leftover.length) break;
    chosen.push(leftover[0]);
  }

  const result = chosen.slice(0, count);
  result.forEach(ex => usedNames.add(ex.name));
  return result;
}

/* Elige UN reemplazo para un ejercicio puntual (botón "Cambiar ejercicio").
   Simplemente evita repetidos y prioriza compuestos. */
function pickReplacement(group, ctx, usedNames) {
  const pool = EXERCISES[group] || [];
  const { avoidHighImpact } = ctx;

  const available = pool.filter(ex => {
    if (usedNames.has(ex.name)) return false;
    if (avoidHighImpact && ex.impact === "high") return false;
    return true;
  });

  const compounds = shuffle(available.filter(e => e.compound));
  const isolations = shuffle(available.filter(e => !e.compound));
  const ordered = [...compounds, ...isolations];

  const chosen = ordered[0] || null;
  if (chosen) usedNames.add(chosen.name);
  return chosen;
}

/* Cantidad de ejercicios para un músculo "chico" (o único) cuando se
   combina con otros. El músculo grande (ver SINGLE_MUSCLE_COUNT) no
   usa esta tabla: conserva casi el mismo volumen que si estuviera solo. */
const PER_GROUP_COUNT = {
  2: { principiante: 3, intermedio: 4, avanzado: 4 },
  3: { principiante: 3, intermedio: 3, avanzado: 4 },
  4: { principiante: 3, intermedio: 3, avanzado: 3 }
};

/* Volumen de un músculo elegido solo, y también el que recibe un
   músculo "grande" (pecho/espalda/pierna) dentro de una combinación. */
const SINGLE_MUSCLE_COUNT = { principiante: 5, intermedio: 5, avanzado: 6 };

function perGroupCount(groupCount, level) {
  const key = Math.min(groupCount, 4);
  return PER_GROUP_COUNT[key][level];
}

/* Arma la plantilla de la sesión: qué grupos musculares y cuántos
   ejercicios de cada uno. Al combinar varios músculos, los grandes
   (pecho, espalda, pierna) mantienen casi el volumen de un día
   dedicado solo a ellos, mientras los chicos usan el cupo reducido. */
function buildBlueprint(muscles, level) {
  if (muscles.includes("fullbody")) {
    const blueprint = FULLBODY_GROUPS.map(g => [g, 2]);
    blueprint.push(["biceps", 1], ["triceps", 1]);
    return blueprint;
  }

  if (muscles.length === 1) {
    return [[muscles[0], SINGLE_MUSCLE_COUNT[level]]];
  }

  const smallCount = perGroupCount(muscles.length, level);
  return muscles.map(g => [g, LARGE_MUSCLES.includes(g) ? SINGLE_MUSCLE_COUNT[level] : smallCount]);
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
      exercises: group === "pierna"
        ? pickLegExercises(count, ctx, usedNames)
        : pickExercises(group, count, ctx, usedNames)
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
  notes.push("La progresión es clave: cuando completes todas las series y repeticiones con buena técnica, aumenta el peso ligeramente en tu próxima sesión de este músculo.");
  notes.push("Descansa al menos 48 horas antes de volver a entrenar el mismo grupo muscular y duerme 7-9 horas para una óptima recuperación.");
  return notes;
}
