/* ============================================================
   MAXIMUS GYM — Algoritmo generador de rutinas personalizadas
============================================================ */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function detectCautions(text) {
  if (!text) return [];
  const t = text.toLowerCase();
  const found = [];
  for (const [tag, words] of Object.entries(CAUTION_KEYWORDS)) {
    if (words.some(w => t.includes(w))) found.push(tag);
  }
  return found;
}

/* Selecciona ejercicios de un grupo muscular respetando equipo, edad, molestias
   y evitando repetir ejercicios ya usados en el mismo día (usedNames) */
function pickExercises(group, count, ctx, usedNames = new Set()) {
  const pool = EXERCISES[group] || [];
  const { equip, cautions, avoidHighImpact } = ctx;

  const compatible = pool.filter(ex => ex.equip.includes(equip) && !usedNames.has(ex.name));

  const safe = compatible.filter(ex => {
    if (avoidHighImpact && ex.impact === "high") return false;
    if (ex.caution && ex.caution.some(c => cautions.includes(c))) return false;
    return true;
  });

  const usable = safe.length >= count ? safe : compatible;

  // ordena compuestos primero, luego mezcla el resto
  const compounds = shuffle(usable.filter(e => e.compound));
  const isolations = shuffle(usable.filter(e => !e.compound));
  const ordered = [...compounds, ...isolations];

  const chosen = ordered.slice(0, count).map(ex => ({
    ...ex,
    flagged: !!(ex.caution && ex.caution.some(c => cautions.includes(c)))
  }));

  chosen.forEach(ex => usedNames.add(ex.name));
  return chosen;
}

/* Define la plantilla de días según cuántos días/semana y nivel */
function buildSplit(days, level) {
  if (days <= 2) return ["Full Body A", "Full Body B"].slice(0, days);
  if (days === 3) {
    return level === "principiante"
      ? ["Full Body A", "Full Body B", "Full Body C"]
      : ["Empuje (Push)", "Tirón (Pull)", "Pierna"];
  }
  if (days === 4) return ["Tren Superior A", "Tren Inferior A", "Tren Superior B", "Tren Inferior B"];
  if (days === 5) return ["Empuje (Push)", "Tirón (Pull)", "Pierna", "Tren Superior", "Tren Inferior"];
  return ["Empuje (Push)", "Tirón (Pull)", "Pierna", "Empuje (Push)", "Tirón (Pull)", "Pierna"];
}

/* Grupos musculares y cantidad de ejercicios por tipo de día */
const DAY_BLUEPRINT = {
  "Full Body A": [["pecho", 1], ["espalda", 1], ["pierna", 1], ["hombro", 1], ["abs", 1]],
  "Full Body B": [["espalda", 1], ["pierna", 1], ["pecho", 1], ["biceps", 1], ["abs", 1]],
  "Full Body C": [["pierna", 1], ["hombro", 1], ["espalda", 1], ["triceps", 1], ["abs", 1]],
  "Empuje (Push)": [["pecho", 2], ["hombro", 2], ["triceps", 1]],
  "Tirón (Pull)": [["espalda", 3], ["biceps", 2]],
  "Pierna": [["pierna", 3], ["gluteo", 2], ["abs", 1]],
  "Tren Superior A": [["pecho", 2], ["espalda", 2], ["hombro", 1], ["biceps", 1]],
  "Tren Superior B": [["espalda", 2], ["pecho", 2], ["hombro", 1], ["triceps", 1]],
  "Tren Inferior A": [["pierna", 2], ["gluteo", 2], ["abs", 1]],
  "Tren Inferior B": [["pierna", 3], ["gluteo", 1], ["abs", 1]],
  "Tren Superior": [["pecho", 2], ["espalda", 2], ["hombro", 1], ["biceps", 1], ["triceps", 1]],
  "Tren Inferior": [["pierna", 3], ["gluteo", 2], ["abs", 1]]
};

const WARMUP_BY_DAY = {
  default: "5-8 min de cardio suave (bici o caminadora) + movilidad articular de hombros, cadera y rodillas + 1-2 series ligeras del primer ejercicio."
};

const COOLDOWN = "5-10 min de estiramientos estáticos de los músculos trabajados, respirando profundo en cada posición (20-30 seg por músculo).";

function levelAdjustCount(count, level) {
  if (level === "principiante") return Math.max(1, count - 1);
  if (level === "avanzado") return count + 1;
  return count;
}

function buildRoutine(profile) {
  const { age, sex, goal, level, days, place, focusArea, limitations } = profile;

  const equip = place; // 'gym' | 'home_dumbbell' | 'home_bodyweight'
  const cautions = detectCautions(limitations);
  const avoidHighImpact = age >= 55;
  const scheme = GOAL_SCHEMES[goal];

  const splitNames = buildSplit(days, level);
  const ctx = { equip, cautions, avoidHighImpact };

  const routineDays = splitNames.map((dayName, idx) => {
    const blueprint = DAY_BLUEPRINT[dayName];
    const usedNames = new Set();
    let exercises = [];

    blueprint.forEach(([group, baseCount]) => {
      const count = levelAdjustCount(baseCount, level);
      exercises = exercises.concat(pickExercises(group, count, ctx, usedNames));
    });

    // Prioriza zona de énfasis si el usuario la eligió, agregando 1 ejercicio extra
    if (focusArea && focusArea !== "ninguna") {
      const extra = pickExercises(focusArea, 1, ctx, usedNames);
      if (extra.length) exercises.push(extra[0]);
    }

    // Finisher de cardio para objetivos orientados a pérdida de peso / resistencia
    let cardioFinisher = null;
    if (scheme.cardio) {
      const c = pickExercises("cardio", 1, ctx, usedNames);
      if (c.length) cardioFinisher = c[0];
    }

    return {
      name: `Día ${idx + 1} · ${dayName}`,
      warmup: WARMUP_BY_DAY.default,
      exercises,
      cardioFinisher,
      cooldown: COOLDOWN
    };
  });

  return {
    profile,
    scheme,
    nutrition: NUTRITION_TIPS[goal],
    cautions,
    days: routineDays,
    generalNotes: buildGeneralNotes(profile, cautions)
  };
}

function buildGeneralNotes(profile, cautions) {
  const notes = [];
  if (profile.age < 16) {
    notes.push("Por tu edad, entrena idealmente bajo supervisión de un adulto o entrenador y prioriza siempre la técnica sobre el peso.");
  }
  if (profile.age >= 55) {
    notes.push("Se priorizaron ejercicios de bajo impacto para cuidar tus articulaciones. Aumenta el tiempo de calentamiento y progresa las cargas de forma gradual.");
  }
  if (cautions.length) {
    notes.push("Detectamos molestias que mencionaste; evitamos o marcamos ⚠️ los ejercicios de mayor riesgo para esa zona. Si el dolor persiste, consulta a un profesional de la salud antes de continuar.");
  }
  notes.push("La progresión es clave: cuando completes todas las series y repeticiones con buena técnica, aumenta el peso ligeramente en la siguiente sesión.");
  notes.push("Descansa al menos 48 horas antes de volver a entrenar el mismo grupo muscular y duerme 7-9 horas para una óptima recuperación.");
  return notes;
}
