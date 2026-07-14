/* ============================================================
   MAXIMUS GYM — Base de datos de ejercicios
   Todos los ejercicios se asumen disponibles en las instalaciones
   de Maximus Gym (barras, mancuernas, bancos, dip station, barra
   de dominadas). Los ejercicios que dependen de un aparato o
   máquina específica llevan la etiqueta `machine`, y su
   disponibilidad real se controla en AVAILABLE_MACHINES más abajo.
   impact: 'high' se evita en perfiles de edad avanzada (55+)
============================================================ */

const EXERCISES = {
  pecho: [
    { name: "Press de banca con barra", compound: true,
      tip: "Retrae los omóplatos y planta bien los pies; baja la barra controlada hasta rozar el pecho." },
    { name: "Press inclinado con mancuernas", compound: true,
      tip: "Inclina el banco 30-45°; un ángulo mayor le quita trabajo al pecho y se lo da al hombro." },
    { name: "Aperturas con mancuernas",
      tip: "Codos ligeramente flexionados todo el recorrido, como si abrazaras un tronco." },
    { name: "Press en máquina convergente", machine: "chestPressMachine",
      tip: "Ajusta el asiento para que los mangos queden a la altura del pecho; ideal para aislar sin estabilizadores." },
    { name: "Fondos en paralelas (énfasis pecho)", compound: true,
      tip: "Inclina el torso hacia adelante; no bajes más de 90° en el codo si sientes molestia." },
    { name: "Flexiones de pecho (push-ups)", compound: true,
      tip: "Cuerpo en línea recta de cabeza a talones; aprieta glúteo y abdomen para no hundir la cadera." },
    { name: "Cruce de poleas (cable crossover)", machine: "cableStation",
      tip: "Junta las manos al frente de la cadera y aprieta fuerte el pectoral al final del recorrido." }
  ],

  espalda: [
    { name: "Dominadas", compound: true,
      tip: "Inicia el jalón llevando los codos hacia abajo y atrás, no solo flexionando el brazo." },
    { name: "Jalón al pecho en polea", machine: "cableStation", compound: true,
      tip: "Evita balancear el torso; controla tanto la subida como la bajada." },
    { name: "Remo con barra", compound: true,
      tip: "Espalda neutra y core activado; tira hacia el ombligo, no hacia el pecho." },
    { name: "Remo con mancuerna a una mano",
      tip: "Apoya rodilla y mano contraria en el banco; evita rotar el torso al tirar." },
    { name: "Remo sentado en polea", machine: "cableStation",
      tip: "Pecho arriba, hombros abajo y atrás; aprieta los omóplatos al final del recorrido." },
    { name: "Peso muerto rumano", compound: true,
      tip: "La barra o mancuernas rozan las piernas; la bisagra ocurre en la cadera, no en la zona lumbar." },
    { name: "Remo invertido (bajo barra o mesa)",
      tip: "Excelente sustituto de dominadas cuando el agarre en dominadas te queda pesado; mantén el cuerpo recto como una tabla." }
  ],

  hombro: [
    { name: "Press militar con barra", compound: true,
      tip: "No arquees en exceso la zona lumbar; aprieta glúteos y abdomen para estabilizar." },
    { name: "Press de hombro con mancuernas", compound: true,
      tip: "Baja hasta que el codo quede un poco por debajo del hombro, sin forzar." },
    { name: "Elevaciones laterales",
      tip: "Sube liderando con el codo, no con la muñeca; usa poco peso y mucho control." },
    { name: "Elevaciones frontales",
      tip: "Alterna un brazo a la vez para mantener el control y evitar el impulso." },
    { name: "Pájaros / posterior en banco inclinado",
      tip: "Inclina el torso hacia adelante y aprieta los omóplatos al subir los brazos." },
    { name: "Press Arnold",
      tip: "Combina rotación con press para trabajar las tres cabezas del deltoides en un solo movimiento." },
    { name: "Face pull en polea", machine: "cableStation",
      tip: "Tira hacia la cara con los codos altos; excelente para la salud del hombro y la postura." }
  ],

  pierna: [
    { name: "Sentadilla con barra", compound: true,
      tip: "Rodillas alineadas con la punta de los pies; baja manteniendo la curvatura lumbar natural." },
    { name: "Sentadilla goblet con mancuerna", compound: true,
      tip: "Sostén la mancuerna pegada al pecho; te ayuda a mantener el torso más erguido." },
    { name: "Prensa de piernas", machine: "legPressMachine", compound: true,
      tip: "No bloquees por completo la rodilla al extender; controla siempre el descenso." },
    { name: "Zancadas (lunges)",
      tip: "Paso amplio, baja la rodilla trasera casi hasta rozar el piso sin golpearlo." },
    { name: "Peso muerto convencional", compound: true,
      tip: "Empuja el piso con los pies y mantén la barra pegada a las piernas todo el recorrido." },
    { name: "Extensión de cuádriceps en máquina", machine: "legExtensionMachine",
      tip: "Controla la bajada; no dejes caer el peso de golpe." },
    { name: "Curl femoral en máquina", machine: "legCurlMachine",
      tip: "Evita despegar la cadera del banco; el jalón lo hace el isquiotibial, no la cadera." },
    { name: "Sentadilla búlgara",
      tip: "Pie trasero elevado en un banco; concéntrate en la pierna delantera en toda la fase." },
    { name: "Elevación de talones (gemelos) de pie",
      tip: "Sube hasta la punta del pie y baja con control sintiendo el estiramiento en la pantorrilla." },
    { name: "Sentadilla con salto", impact: "high",
      tip: "Aterriza suave flexionando la rodilla para absorber el impacto." }
  ],

  gluteo: [
    { name: "Hip thrust con barra", compound: true,
      tip: "Apoya la parte alta de la espalda en el banco, barbilla metida, empuja con los talones." },
    { name: "Puente de glúteo",
      tip: "Aprieta fuerte el glúteo arriba 1-2 segundos antes de bajar; evita hiperextender la lumbar." },
    { name: "Patada de glúteo en polea/máquina", machine: "cableStation",
      tip: "Movimiento lento y controlado, sin usar impulso de la cadera." },
    { name: "Abducción de cadera en máquina", machine: "hipAbductionMachine",
      tip: "Inclina ligeramente el torso hacia adelante para enfatizar más el glúteo medio." },
    { name: "Peso muerto rumano a una pierna",
      tip: "Mantén la cadera cuadrada; apóyate en una pared o silla si te falta equilibrio al inicio." }
  ],

  biceps: [
    { name: "Curl con barra",
      tip: "Codos pegados al torso durante todo el recorrido, sin balancear el cuerpo." },
    { name: "Curl con mancuernas alterno",
      tip: "Gira la muñeca (supinación) conforme subes para maximizar la contracción." },
    { name: "Curl martillo",
      tip: "Trabaja también el antebrazo; mantén el agarre neutro en todo el movimiento." },
    { name: "Curl en banco predicador",
      tip: "El apoyo del brazo evita el balanceo y aísla mejor el bíceps." }
  ],

  triceps: [
    { name: "Press francés (skull crusher)",
      tip: "Solo se mueve el antebrazo; mantén el codo fijo apuntando al techo." },
    { name: "Extensión de tríceps en polea alta", machine: "cableStation",
      tip: "Codos pegados al cuerpo, extiende completo y aprieta el tríceps abajo." },
    { name: "Fondos en banco",
      tip: "No bajes en exceso si sientes molestia en el hombro; controla siempre el descenso." },
    { name: "Patada de tríceps con mancuerna",
      tip: "Torso paralelo al piso, extiende hacia atrás manteniendo el codo alto y fijo." },
    { name: "Flexiones de agarre cerrado (diamante)",
      tip: "Manos juntas bajo el pecho formando un diamante; codos cerca del torso." }
  ],

  abs: [
    { name: "Plancha (plank)",
      tip: "Cuerpo en línea recta; aprieta glúteo y abdomen, no dejes caer la cadera." },
    { name: "Crunch abdominal",
      tip: "Sube solo los omóplatos del piso, exhala en la contracción, evita tirar del cuello." },
    { name: "Elevación de piernas",
      tip: "Controla la bajada de las piernas; si es muy difícil, flexiona un poco las rodillas." },
    { name: "Rueda abdominal (ab wheel)",
      tip: "Abdomen apretado en todo el recorrido para proteger la zona lumbar." },
    { name: "Plancha lateral",
      tip: "Cadera elevada y alineada; no dejes que caiga hacia el piso." },
    { name: "Mountain climbers", impact: "high",
      tip: "Mantén la cadera baja y estable, como si corrieras en posición de plancha." },
    { name: "Russian twist",
      tip: "Gira desde el torso, no solo los brazos; pies elevados para mayor dificultad." }
  ],

  cardio: [
    { name: "Burpees", impact: "high",
      tip: "Prioriza la técnica sobre la velocidad; aterriza suave en cada salto." },
    { name: "Jumping jacks", impact: "high",
      tip: "Mantén un ritmo constante; ideal para elevar el pulso entre bloques de fuerza." },
    { name: "Cuerda / salto de cuerda", impact: "high",
      tip: "Salta con la punta de los pies y saltos bajos para cuidar las rodillas." },
    { name: "Intervalos en cinta o bici", machine: "cardioMachines",
      tip: "Alterna 30 seg de alta intensidad con 60-90 seg de recuperación activa." },
    { name: "Remo en máquina (cardio)", machine: "rowingMachine",
      tip: "Empuja primero con piernas, luego tira con los brazos; en la vuelta: brazos-torso-piernas." },
    { name: "Caminata inclinada / bici suave", machine: "cardioMachines",
      tip: "Ritmo sostenido y cómodo, ideal como cardio de bajo impacto para cualquier edad." }
  ]
};

/* Disponibilidad real del equipo de aparatos/máquinas de Maximus Gym.
   Cambia a `false` cualquier máquina que el gimnasio NO tenga. */
const AVAILABLE_MACHINES = {
  chestPressMachine: true,
  cableStation: true,
  legPressMachine: true,
  legExtensionMachine: true,
  legCurlMachine: true,
  hipAbductionMachine: true,
  cardioMachines: true,
  rowingMachine: true
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
