/* ============================================================
   MAXIMUS GYM — Base de datos de ejercicios
   Cada ejercicio incluye equipo compatible, tip técnico y
   etiquetas de precaución / impacto para personalizar la rutina.
   equip: 'gym' | 'home_dumbbell' | 'home_bodyweight'
   caution: articulaciones a evitar si el usuario reporta molestia
   impact: 'high' se evita en perfiles de edad avanzada
============================================================ */

const EXERCISES = {
  pecho: [
    { name: "Press de banca con barra", equip: ["gym"], compound: true,
      tip: "Retrae los omóplatos y planta bien los pies; baja la barra controlada hasta rozar el pecho.", caution: ["hombro"] },
    { name: "Press inclinado con mancuernas", equip: ["gym", "home_dumbbell"], compound: true,
      tip: "Inclina el banco 30-45°; un ángulo mayor le quita trabajo al pecho y se lo da al hombro.", caution: ["hombro"] },
    { name: "Aperturas con mancuernas", equip: ["gym", "home_dumbbell"],
      tip: "Codos ligeramente flexionados todo el recorrido, como si abrazaras un tronco.", caution: ["hombro"] },
    { name: "Press en máquina convergente", equip: ["gym"],
      tip: "Ajusta el asiento para que los mangos queden a la altura del pecho; ideal para aislar sin estabilizadores." },
    { name: "Fondos en paralelas (énfasis pecho)", equip: ["gym"], compound: true,
      tip: "Inclina el torso hacia adelante; no bajes más de 90° en el codo si sientes molestia.", caution: ["hombro"] },
    { name: "Flexiones de pecho (push-ups)", equip: ["home_bodyweight", "home_dumbbell", "gym"], compound: true,
      tip: "Cuerpo en línea recta de cabeza a talones; aprieta glúteo y abdomen para no hundir la cadera.", caution: ["muñeca"] },
    { name: "Flexiones con pies elevados", equip: ["home_bodyweight"],
      tip: "Eleva los pies en una silla estable para enfatizar la parte superior del pecho." },
    { name: "Cruce de poleas (cable crossover)", equip: ["gym"],
      tip: "Junta las manos al frente de la cadera y aprieta fuerte el pectoral al final del recorrido." }
  ],

  espalda: [
    { name: "Dominadas", equip: ["gym", "home_bodyweight"], compound: true,
      tip: "Inicia el jalón llevando los codos hacia abajo y atrás, no solo flexionando el brazo.", caution: ["hombro"] },
    { name: "Jalón al pecho en polea", equip: ["gym"], compound: true,
      tip: "Evita balancear el torso; controla tanto la subida como la bajada." },
    { name: "Remo con barra", equip: ["gym"], compound: true,
      tip: "Espalda neutra y core activado; tira hacia el ombligo, no hacia el pecho.", caution: ["espalda"] },
    { name: "Remo con mancuerna a una mano", equip: ["gym", "home_dumbbell"],
      tip: "Apoya rodilla y mano contraria en el banco; evita rotar el torso al tirar.", caution: ["espalda"] },
    { name: "Remo sentado en polea", equip: ["gym"],
      tip: "Pecho arriba, hombros abajo y atrás; aprieta los omóplatos al final del recorrido." },
    { name: "Peso muerto rumano", equip: ["gym", "home_dumbbell"], compound: true,
      tip: "La barra o mancuernas rozan las piernas; la bisagra ocurre en la cadera, no en la zona lumbar.", caution: ["espalda"] },
    { name: "Extensión lumbar tipo 'Superman'", equip: ["home_bodyweight"],
      tip: "Eleva brazo y pierna contrarios de forma controlada, sin impulso, para fortalecer la zona lumbar." },
    { name: "Remo invertido (bajo barra o mesa)", equip: ["home_bodyweight", "gym"],
      tip: "Excelente sustituto de dominadas en casa; mantén el cuerpo recto como una tabla." }
  ],

  hombro: [
    { name: "Press militar con barra", equip: ["gym"], compound: true,
      tip: "No arquees en exceso la zona lumbar; aprieta glúteos y abdomen para estabilizar.", caution: ["hombro", "espalda"] },
    { name: "Press de hombro con mancuernas", equip: ["gym", "home_dumbbell"], compound: true,
      tip: "Baja hasta que el codo quede un poco por debajo del hombro, sin forzar.", caution: ["hombro"] },
    { name: "Elevaciones laterales", equip: ["gym", "home_dumbbell"],
      tip: "Sube liderando con el codo, no con la muñeca; usa poco peso y mucho control.", caution: ["hombro"] },
    { name: "Elevaciones frontales", equip: ["gym", "home_dumbbell"],
      tip: "Alterna un brazo a la vez para mantener el control y evitar el impulso." },
    { name: "Pájaros / posterior en banco inclinado", equip: ["gym", "home_dumbbell"],
      tip: "Inclina el torso hacia adelante y aprieta los omóplatos al subir los brazos." },
    { name: "Press Arnold", equip: ["home_dumbbell", "gym"],
      tip: "Combina rotación con press para trabajar las tres cabezas del deltoides en un solo movimiento." },
    { name: "Face pull en polea", equip: ["gym"],
      tip: "Tira hacia la cara con los codos altos; excelente para la salud del hombro y la postura." }
  ],

  pierna: [
    { name: "Sentadilla con barra", equip: ["gym"], compound: true,
      tip: "Rodillas alineadas con la punta de los pies; baja manteniendo la curvatura lumbar natural.", caution: ["rodilla", "espalda"] },
    { name: "Sentadilla goblet con mancuerna", equip: ["gym", "home_dumbbell"], compound: true,
      tip: "Sostén la mancuerna pegada al pecho; te ayuda a mantener el torso más erguido.", caution: ["rodilla"] },
    { name: "Prensa de piernas", equip: ["gym"], compound: true,
      tip: "No bloquees por completo la rodilla al extender; controla siempre el descenso.", caution: ["rodilla"] },
    { name: "Zancadas (lunges)", equip: ["gym", "home_dumbbell", "home_bodyweight"],
      tip: "Paso amplio, baja la rodilla trasera casi hasta rozar el piso sin golpearlo.", caution: ["rodilla"] },
    { name: "Peso muerto convencional", equip: ["gym"], compound: true,
      tip: "Empuja el piso con los pies y mantén la barra pegada a las piernas todo el recorrido.", caution: ["espalda"] },
    { name: "Extensión de cuádriceps en máquina", equip: ["gym"],
      tip: "Controla la bajada; no dejes caer el peso de golpe.", caution: ["rodilla"] },
    { name: "Curl femoral en máquina", equip: ["gym"],
      tip: "Evita despegar la cadera del banco; el jalón lo hace el isquiotibial, no la cadera." },
    { name: "Sentadilla búlgara", equip: ["gym", "home_dumbbell"],
      tip: "Pie trasero elevado en un banco; concéntrate en la pierna delantera en toda la fase.", caution: ["rodilla"] },
    { name: "Elevación de talones (gemelos) de pie", equip: ["gym", "home_dumbbell", "home_bodyweight"],
      tip: "Sube hasta la punta del pie y baja con control sintiendo el estiramiento en la pantorrilla." },
    { name: "Sentadilla con salto", equip: ["home_bodyweight"], impact: "high",
      tip: "Aterriza suave flexionando la rodilla para absorber el impacto.", caution: ["rodilla"] }
  ],

  gluteo: [
    { name: "Hip thrust con barra", equip: ["gym"], compound: true,
      tip: "Apoya la parte alta de la espalda en el banco, barbilla metida, empuja con los talones.", caution: ["espalda"] },
    { name: "Puente de glúteo", equip: ["gym", "home_dumbbell", "home_bodyweight"],
      tip: "Aprieta fuerte el glúteo arriba 1-2 segundos antes de bajar; evita hiperextender la lumbar." },
    { name: "Patada de glúteo en polea/máquina", equip: ["gym"],
      tip: "Movimiento lento y controlado, sin usar impulso de la cadera." },
    { name: "Abducción de cadera en máquina", equip: ["gym"],
      tip: "Inclina ligeramente el torso hacia adelante para enfatizar más el glúteo medio." },
    { name: "Peso muerto rumano a una pierna", equip: ["home_dumbbell", "gym"],
      tip: "Mantén la cadera cuadrada; apóyate en una pared o silla si te falta equilibrio al inicio.", caution: ["espalda"] }
  ],

  biceps: [
    { name: "Curl con barra", equip: ["gym"],
      tip: "Codos pegados al torso durante todo el recorrido, sin balancear el cuerpo." },
    { name: "Curl con mancuernas alterno", equip: ["gym", "home_dumbbell"],
      tip: "Gira la muñeca (supinación) conforme subes para maximizar la contracción." },
    { name: "Curl martillo", equip: ["gym", "home_dumbbell"],
      tip: "Trabaja también el antebrazo; mantén el agarre neutro en todo el movimiento." },
    { name: "Curl en banco predicador", equip: ["gym"],
      tip: "El apoyo del brazo evita el balanceo y aísla mejor el bíceps." },
    { name: "Curl con banda de resistencia", equip: ["home_bodyweight"],
      tip: "Pisa el centro de la banda y mantén tensión constante en todo el rango." }
  ],

  triceps: [
    { name: "Press francés (skull crusher)", equip: ["gym", "home_dumbbell"],
      tip: "Solo se mueve el antebrazo; mantén el codo fijo apuntando al techo." },
    { name: "Extensión de tríceps en polea alta", equip: ["gym"],
      tip: "Codos pegados al cuerpo, extiende completo y aprieta el tríceps abajo." },
    { name: "Fondos en banco", equip: ["home_bodyweight", "gym"],
      tip: "No bajes en exceso si sientes molestia en el hombro; controla siempre el descenso.", caution: ["hombro"] },
    { name: "Patada de tríceps con mancuerna", equip: ["gym", "home_dumbbell"],
      tip: "Torso paralelo al piso, extiende hacia atrás manteniendo el codo alto y fijo." },
    { name: "Flexiones de agarre cerrado (diamante)", equip: ["home_bodyweight"],
      tip: "Manos juntas bajo el pecho formando un diamante; codos cerca del torso.", caution: ["muñeca"] }
  ],

  abs: [
    { name: "Plancha (plank)", equip: ["home_bodyweight", "gym"],
      tip: "Cuerpo en línea recta; aprieta glúteo y abdomen, no dejes caer la cadera.", caution: ["muñeca"] },
    { name: "Crunch abdominal", equip: ["home_bodyweight", "gym"],
      tip: "Sube solo los omóplatos del piso, exhala en la contracción, evita tirar del cuello." },
    { name: "Elevación de piernas", equip: ["gym", "home_bodyweight"],
      tip: "Controla la bajada de las piernas; si es muy difícil, flexiona un poco las rodillas." },
    { name: "Rueda abdominal (ab wheel)", equip: ["home_bodyweight", "gym"],
      tip: "Abdomen apretado en todo el recorrido para proteger la zona lumbar.", caution: ["espalda"] },
    { name: "Plancha lateral", equip: ["home_bodyweight"],
      tip: "Cadera elevada y alineada; no dejes que caiga hacia el piso." },
    { name: "Mountain climbers", equip: ["home_bodyweight"], impact: "high",
      tip: "Mantén la cadera baja y estable, como si corrieras en posición de plancha." },
    { name: "Russian twist", equip: ["home_bodyweight", "home_dumbbell"],
      tip: "Gira desde el torso, no solo los brazos; pies elevados para mayor dificultad.", caution: ["espalda"] }
  ],

  cardio: [
    { name: "Burpees", equip: ["home_bodyweight"], impact: "high",
      tip: "Prioriza la técnica sobre la velocidad; aterriza suave en cada salto.", caution: ["rodilla", "muñeca"] },
    { name: "Jumping jacks", equip: ["home_bodyweight"], impact: "high",
      tip: "Mantén un ritmo constante; ideal para elevar el pulso entre bloques de fuerza." },
    { name: "Cuerda / salto de cuerda", equip: ["home_bodyweight", "gym"], impact: "high",
      tip: "Salta con la punta de los pies y saltos bajos para cuidar las rodillas.", caution: ["rodilla"] },
    { name: "Intervalos en cinta o bici", equip: ["gym"],
      tip: "Alterna 30 seg de alta intensidad con 60-90 seg de recuperación activa." },
    { name: "Remo en máquina (cardio)", equip: ["gym"],
      tip: "Empuja primero con piernas, luego tira con los brazos; en la vuelta: brazos-torso-piernas." },
    { name: "Caminata inclinada / bici suave", equip: ["gym", "home_bodyweight"],
      tip: "Ritmo sostenido y cómodo, ideal como cardio de bajo impacto para cualquier edad." }
  ]
};

/* Esquemas de series/reps/descanso según objetivo */
const GOAL_SCHEMES = {
  hipertrofia: { label: "Ganar músculo (hipertrofia)", sets: "3-4", reps: "8-12", rest: "60-90 seg", cardio: false },
  perdida_peso: { label: "Pérdida de peso", sets: "3", reps: "15-20", rest: "30-45 seg", cardio: true },
  fuerza: { label: "Ganar fuerza", sets: "4-5", reps: "4-6", rest: "2-3 min", cardio: false },
  tonificacion: { label: "Tonificar / definir", sets: "3", reps: "12-15", rest: "45-60 seg", cardio: true },
  resistencia: { label: "Resistencia / acondicionamiento", sets: "2-3", reps: "15-20+", rest: "20-30 seg", cardio: true }
};

const NUTRITION_TIPS = {
  hipertrofia: "Busca un superávit calórico moderado (+300 a +500 kcal), con 1.6-2.2 g de proteína por kg de peso corporal. Prioriza carbohidratos antes y después de entrenar.",
  perdida_peso: "Mantén un déficit calórico moderado (-300 a -500 kcal), con proteína alta para preservar músculo. Prioriza vegetales, fibra y buena hidratación para saciarte.",
  fuerza: "Come en mantenimiento o leve superávit, con buena ingesta de carbohidratos para rendir en cargas pesadas. La proteína (1.6-2 g/kg) sostiene la recuperación.",
  tonificacion: "Déficit leve o mantenimiento, con proteína alta (1.8-2.2 g/kg) en cada comida para definir sin perder masa muscular.",
  resistencia: "Prioriza carbohidratos de calidad, hidratación y electrolitos antes de sesiones largas o de alta intensidad."
};

/* Mapa de palabras clave en español para detectar molestias/lesiones */
const CAUTION_KEYWORDS = {
  rodilla: ["rodilla", "rodillas", "menisco"],
  hombro: ["hombro", "hombros", "manguito"],
  espalda: ["espalda", "lumbar", "lumbares", "columna"],
  muñeca: ["muñeca", "muñecas", "carpo"],
  cadera: ["cadera", "caderas"]
};
