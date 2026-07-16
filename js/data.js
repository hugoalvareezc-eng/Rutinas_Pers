/* ============================================================
   MAXIMUS GYM — Base de datos de ejercicios
   Refleja el equipo real de las instalaciones: jaula de sentadilla,
   Smith, hack, prensa lineal y articulada, sentadilla perfecta,
   máquinas de aductor/abductor, curl femoral acostado y de pie,
   pantorrilla de pie y sentado, jungla de poleas completa (agarres
   abiertos, cerrados y cuerdas), máquinas de pecho/hombro/remo/
   dominadas (abiertas y cerradas), pec deck, bancos plano/inclinado/
   declinado/multiposición, bancos de abdomen, silla de ejercicios,
   máquina de bíceps con barra W, predicador, patada de tríceps,
   elípticas y peso libre completo (barras, barras W, mancuernas).
   impact: 'high' se evita en perfiles de edad avanzada (55+)
   pattern: patrón de movimiento usado para elegir el icono ilustrativo
   sub: subgrupo específico dentro de pierna (ver SUB_LABELS)
============================================================ */

/* Etiqueta visible que indica a qué apunta cada ejercicio de pierna */
const SUB_LABELS = {
  quad: "Cuádriceps",
  femoral_compound: "Femoral",
  femoral_machine: "Femoral (máquina)",
  aductor: "Aductor",
  abductor: "Abductor",
  pantorrilla: "Pantorrilla"
};

const EXERCISES = {
  pecho: [
    { name: "Press de banca plano con barra", compound: true, pattern: "press_horizontal",
      tip: "Retrae los omóplatos y planta bien los pies; baja la barra controlada hasta rozar el pecho." },
    { name: "Press inclinado con barra", compound: true, pattern: "press_horizontal",
      tip: "Usa el banco inclinado a 30-45°; enfatiza la parte superior del pecho sin perder los codos hacia adentro." },
    { name: "Press declinado con barra", compound: true, pattern: "press_horizontal",
      tip: "En el banco declinado, baja la barra a la parte baja del pecho con control, sin rebotar." },
    { name: "Press plano con mancuernas", compound: true, pattern: "press_horizontal",
      tip: "Mayor rango de movimiento que la barra; baja hasta sentir un buen estiramiento en el pecho." },
    { name: "Press inclinado con mancuernas", compound: true, pattern: "press_horizontal",
      tip: "Inclina el banco 30-45°; un ángulo mayor le quita trabajo al pecho y se lo da al hombro." },
    { name: "Press en Smith (banco plano)", compound: true, pattern: "press_horizontal",
      tip: "La barra guiada te permite enfocarte 100% en empujar; coloca el banco para que la barra baje justo al pecho." },
    { name: "Press de pecho en máquina (agarre cerrado)", pattern: "press_horizontal",
      tip: "Agarre cerrado enfatiza más la porción interna del pecho y el tríceps; ajusta el asiento a la altura del pecho." },
    { name: "Press de pecho en máquina (agarre abierto)", pattern: "press_horizontal",
      tip: "Agarre abierto recluta más pecho externo y deltoide anterior; empuja sin bloquear el codo por completo." },
    { name: "Pec deck / aperturas en máquina", pattern: "fly",
      tip: "Junta los brazos al frente sin despegar la espalda del respaldo; controla la vuelta para no perder tensión." },
    { name: "Aperturas con mancuernas", pattern: "fly",
      tip: "Codos ligeramente flexionados todo el recorrido, como si abrazaras un tronco." },
    { name: "Cruce de poleas alto a bajo", pattern: "fly",
      tip: "Desde la polea alta, cruza las manos abajo frente a la cadera apretando el pecho al final." },
    { name: "Cruce de poleas bajo a alto", pattern: "fly",
      tip: "Desde la polea baja, sube en diagonal hacia el hombro contrario para enfatizar la parte alta del pecho." },
    { name: "Fondos en paralelas (énfasis pecho)", compound: true, pattern: "dip",
      tip: "Inclina el torso hacia adelante; no bajes más de 90° en el codo si sientes molestia." },
    { name: "Flexiones de pecho (push-ups)", compound: true, pattern: "pushup",
      tip: "Cuerpo en línea recta de cabeza a talones; aprieta glúteo y abdomen para no hundir la cadera." }
  ],

  espalda: [
    { name: "Dominadas (agarre abierto)", compound: true, pattern: "pull_vertical",
      tip: "Agarre prono más ancho que los hombros; inicia el jalón llevando los codos hacia abajo y atrás." },
    { name: "Dominadas (agarre cerrado/supino)", compound: true, pattern: "pull_vertical",
      tip: "Agarre supino y cerrado; recluta más bíceps y dorsal medio, baja controlado hasta extender casi por completo." },
    { name: "Máquina de dominadas asistidas (agarre abierto)", pattern: "pull_vertical",
      tip: "Ajusta el contrapeso para completar el rango con buena técnica; ve bajando la asistencia semana a semana." },
    { name: "Máquina de dominadas asistidas (agarre cerrado)", pattern: "pull_vertical",
      tip: "Agarre cerrado y neutro, ideal para aprender el patrón de jalón antes de hacer dominadas libres." },
    { name: "Jalón al pecho en polea (agarre abierto)", compound: true, pattern: "pull_vertical",
      tip: "Evita balancear el torso; controla tanto la subida como la bajada, llevando la barra al pecho alto." },
    { name: "Jalón al pecho en polea (agarre cerrado)", compound: true, pattern: "pull_vertical",
      tip: "El agarre cerrado o en V permite tirar con más recorrido; aprieta el dorsal al final del movimiento." },
    { name: "Remo en máquina (agarre abierto)", pattern: "pull_horizontal",
      tip: "Pecho apoyado, hombros abajo; el agarre abierto enfatiza más la espalda alta y los romboides." },
    { name: "Remo en máquina (agarre cerrado)", pattern: "pull_horizontal",
      tip: "El agarre cerrado y neutro carga más el dorsal medio; tira hacia el abdomen apretando omóplatos." },
    { name: "Remo sentado en polea (agarre cerrado)", compound: true, pattern: "pull_horizontal",
      tip: "Pecho arriba, hombros abajo y atrás; aprieta los omóplatos al final del recorrido." },
    { name: "Remo con barra", compound: true, pattern: "pull_horizontal",
      tip: "Espalda neutra y core activado; tira hacia el ombligo, no hacia el pecho." },
    { name: "Remo con mancuerna a una mano", pattern: "pull_horizontal",
      tip: "Apoya rodilla y mano contraria en el banco; evita rotar el torso al tirar." },
    { name: "Peso muerto convencional", compound: true, pattern: "hinge",
      tip: "Empuja el piso con los pies y mantén la barra pegada a las piernas todo el recorrido." },
    { name: "Peso muerto rumano", compound: true, pattern: "hinge",
      tip: "La barra rueda pegada a las piernas; la bisagra ocurre en la cadera, no en la zona lumbar." },
    { name: "Remo invertido", pattern: "pull_horizontal",
      tip: "Excelente ejercicio de jalón horizontal con peso corporal; mantén el cuerpo recto como una tabla." }
  ],

  hombro: [
    { name: "Press militar de pie con barra", compound: true, pattern: "press_vertical",
      tip: "No arquees en exceso la zona lumbar; aprieta glúteos y abdomen para estabilizar." },
    { name: "Press militar sentado con barra", compound: true, pattern: "press_vertical",
      tip: "Espalda apoyada en el banco; empuja la barra en línea recta sobre la cabeza sin arquear el cuello." },
    { name: "Press de hombro en Smith", compound: true, pattern: "press_vertical",
      tip: "El riel guía el recorrido; enfócate en empujar fuerte y controlar la bajada hasta la altura de la oreja." },
    { name: "Press de hombro en máquina (agarre abierto)", pattern: "press_vertical",
      tip: "Agarre ancho recluta más deltoide lateral; empuja sin encoger los hombros hacia las orejas." },
    { name: "Press de hombro en máquina (agarre cerrado)", pattern: "press_vertical",
      tip: "Agarre cerrado enfatiza el deltoide anterior; mantén la espalda pegada al respaldo todo el recorrido." },
    { name: "Press de hombro con mancuernas sentado", compound: true, pattern: "press_vertical",
      tip: "Baja hasta que el codo quede un poco por debajo del hombro, sin forzar." },
    { name: "Press Arnold", pattern: "press_vertical",
      tip: "Combina rotación con press para trabajar las tres cabezas del deltoides en un solo movimiento." },
    { name: "Elevaciones laterales con mancuerna", pattern: "raise_lateral",
      tip: "Sube liderando con el codo, no con la muñeca; usa poco peso y mucho control." },
    { name: "Elevaciones laterales en máquina", pattern: "raise_lateral",
      tip: "Ajusta el asiento para que el eje de la máquina quede a la altura del hombro; sube sin impulso." },
    { name: "Elevaciones laterales en polea", pattern: "raise_lateral",
      tip: "La polea mantiene tensión constante en todo el recorrido, incluso al inicio del movimiento." },
    { name: "Elevaciones frontales con disco o barra", pattern: "raise_front",
      tip: "Sube hasta la altura de los ojos con los brazos casi extendidos, sin balancear la cadera." },
    { name: "Pájaros / posterior con mancuernas en banco inclinado", pattern: "raise_lateral",
      tip: "Inclina el torso hacia adelante y aprieta los omóplatos al subir los brazos." },
    { name: "Face pull en polea con cuerda", pattern: "pull_horizontal",
      tip: "Tira hacia la cara con los codos altos; excelente para la salud del hombro y la postura." },
    { name: "Encogimientos de trapecio con barra", pattern: "shrug",
      tip: "Sube los hombros directo hacia arriba, sin rodarlos, y controla la bajada." }
  ],

  pierna: [
    { name: "Sentadilla libre con barra (jaula)", compound: true, sub: "quad", pattern: "squat",
      tip: "Rodillas alineadas con la punta de los pies; baja manteniendo la curvatura lumbar natural." },
    { name: "Sentadilla en Smith", compound: true, sub: "quad", pattern: "squat",
      tip: "El riel fija la trayectoria; adelanta un poco los pies para que la rodilla no se vaya de más al bajar." },
    { name: "Sentadilla hack en máquina", compound: true, sub: "quad", pattern: "squat",
      tip: "Espalda pegada al respaldo; baja controlado sin despegar los talones de la plataforma." },
    { name: "Sentadilla perfecta (máquina guiada)", compound: true, sub: "quad", pattern: "squat",
      tip: "El movimiento guiado protege la zona lumbar; concéntrate en empujar con todo el pie." },
    { name: "Sentadilla goblet con mancuerna", compound: true, sub: "quad", pattern: "squat",
      tip: "Sostén la mancuerna pegada al pecho; te ayuda a mantener el torso más erguido." },
    { name: "Sentadilla búlgara con mancuernas", sub: "quad", pattern: "lunge",
      tip: "Pie trasero elevado en un banco; concéntrate en la pierna delantera en toda la fase." },
    { name: "Prensa de piernas lineal", compound: true, sub: "quad", pattern: "leg_press",
      tip: "No bloquees por completo la rodilla al extender; controla siempre el descenso." },
    { name: "Prensa de piernas articulada (45°)", compound: true, sub: "quad", pattern: "leg_press",
      tip: "El recorrido angulado permite más carga; mantén la zona lumbar pegada al respaldo sin despegarla." },
    { name: "Zancadas con mancuernas", sub: "quad", pattern: "lunge",
      tip: "Paso amplio, baja la rodilla trasera casi hasta rozar el piso sin golpearlo." },
    { name: "Extensión de cuádriceps en máquina", sub: "quad", pattern: "leg_extension",
      tip: "Controla la bajada; no dejes caer el peso de golpe." },
    { name: "Sentadilla con salto", impact: "high", sub: "quad", pattern: "squat",
      tip: "Aterriza suave flexionando la rodilla para absorber el impacto." },
    { name: "Peso muerto rumano con barra", compound: true, sub: "femoral_compound", pattern: "hinge",
      tip: "La barra rueda pegada a las piernas; la bisagra ocurre en la cadera, no en la zona lumbar." },
    { name: "Peso muerto rumano con mancuernas", compound: true, sub: "femoral_compound", pattern: "hinge",
      tip: "Mismo patrón que con barra pero con mayor rango; siente el estiramiento del isquiotibial al bajar." },
    { name: "Buenos días con barra", sub: "femoral_compound", pattern: "hinge",
      tip: "Rodillas semiflexionadas y fijas, la bisagra ocurre en la cadera; usa poco peso al empezar." },
    { name: "Curl femoral acostado en máquina", sub: "femoral_machine", pattern: "leg_curl",
      tip: "Evita despegar la cadera del banco; el jalón lo hace el isquiotibial, no la cadera." },
    { name: "Curl femoral de pie en máquina", sub: "femoral_machine", pattern: "leg_curl",
      tip: "Trabaja una pierna a la vez; flexiona completo apretando el isquiotibial arriba." },
    { name: "Aducción de cadera en máquina", sub: "aductor", pattern: "hip_machine",
      tip: "Movimiento lento y controlado juntando las piernas contra la resistencia; sin usar impulso." },
    { name: "Abducción de cadera en máquina", sub: "abductor", pattern: "hip_machine",
      tip: "Inclina ligeramente el torso hacia adelante para enfatizar más el glúteo medio." },
    { name: "Elevación de talones de pie en máquina", sub: "pantorrilla", pattern: "calf",
      tip: "Sube hasta la punta del pie y baja con control sintiendo el estiramiento en la pantorrilla." },
    { name: "Elevación de talones sentado en máquina", sub: "pantorrilla", pattern: "calf",
      tip: "Con la rodilla flexionada se enfatiza el sóleo; sube completo y controla la bajada." }
  ],

  gluteo: [
    { name: "Hip thrust con barra", compound: true, pattern: "glute_bridge",
      tip: "Apoya la parte alta de la espalda en el banco, barbilla metida, empuja con los talones." },
    { name: "Puente de glúteo", pattern: "glute_bridge",
      tip: "Aprieta fuerte el glúteo arriba 1-2 segundos antes de bajar; evita hiperextender la lumbar." },
    { name: "Patada de glúteo en máquina", pattern: "glute_kickback",
      tip: "Movimiento lento y controlado; empuja con el talón sin arquear la zona lumbar." },
    { name: "Patada de glúteo en polea", pattern: "glute_kickback",
      tip: "Mantén el torso estable apoyado en el equipo; evita usar impulso de la cadera." },
    { name: "Abducción de cadera en máquina (glúteo medio)", pattern: "hip_machine",
      tip: "Inclina ligeramente el torso hacia adelante para enfatizar más el glúteo medio." },
    { name: "Peso muerto rumano a una pierna con mancuerna", pattern: "hinge",
      tip: "Mantén la cadera cuadrada; apóyate en una pared o silla si te falta equilibrio al inicio." },
    { name: "Sentadilla búlgara con mancuernas", pattern: "lunge",
      tip: "Empuja con el talón de la pierna delantera para reclutar más glúteo que cuádriceps." }
  ],

  biceps: [
    { name: "Curl con barra recta", pattern: "curl",
      tip: "Codos pegados al torso durante todo el recorrido, sin balancear el cuerpo." },
    { name: "Curl con barra W", pattern: "curl",
      tip: "El agarre en zigzag de la barra W cuida la muñeca; sube completo apretando el bíceps." },
    { name: "Curl con mancuernas alterno", pattern: "curl",
      tip: "Gira la muñeca (supinación) conforme subes para maximizar la contracción." },
    { name: "Curl martillo con mancuernas", pattern: "curl",
      tip: "Trabaja también el antebrazo; mantén el agarre neutro en todo el movimiento." },
    { name: "Curl en banco predicador con barra W", pattern: "curl",
      tip: "El apoyo del brazo evita el balanceo y aísla mejor el bíceps; no extiendas del todo el codo abajo." },
    { name: "Curl en máquina sentado con barra W", pattern: "curl",
      tip: "Ajusta el asiento para que el codo quede alineado con el eje de la máquina; controla la bajada." },
    { name: "Curl en polea con cuerda o barra", pattern: "curl",
      tip: "La polea mantiene tensión constante incluso al final del recorrido, donde el bíceps se relaja más." }
  ],

  triceps: [
    { name: "Press francés con barra W", pattern: "triceps_extension",
      tip: "Solo se mueve el antebrazo; mantén el codo fijo apuntando al techo." },
    { name: "Press cerrado en banco con barra", pattern: "press_horizontal",
      tip: "Agarre a la altura de los hombros, codos pegados al cuerpo; baja la barra al pecho bajo con control." },
    { name: "Extensión de tríceps en polea alta (barra recta)", pattern: "triceps_extension",
      tip: "Codos pegados al cuerpo, extiende completo y aprieta el tríceps abajo." },
    { name: "Extensión de tríceps en polea con cuerda", pattern: "triceps_extension",
      tip: "Abre la cuerda al final del recorrido para maximizar la contracción del tríceps." },
    { name: "Patada de tríceps en máquina", pattern: "triceps_extension",
      tip: "Mantén el torso fijo y el codo alto; el antebrazo hace todo el trabajo en la extensión." },
    { name: "Patada de tríceps con mancuerna", pattern: "triceps_extension",
      tip: "Torso paralelo al piso, extiende hacia atrás manteniendo el codo alto y fijo." },
    { name: "Fondos en banco", pattern: "dip",
      tip: "No bajes en exceso si sientes molestia en el hombro; controla siempre el descenso." },
    { name: "Flexiones de agarre cerrado (diamante)", pattern: "pushup",
      tip: "Manos juntas bajo el pecho formando un diamante; codos cerca del torso." }
  ],

  abs: [
    { name: "Crunch en banco de abdomen", pattern: "core_crunch",
      tip: "Sube solo los omóplatos del piso, exhala en la contracción, evita tirar del cuello." },
    { name: "Elevación de piernas en banco declinado", pattern: "core_crunch",
      tip: "Baja las piernas con control sin dejar que la zona lumbar se despegue del banco." },
    { name: "Elevación de rodillas en silla de ejercicios", pattern: "core_crunch",
      tip: "Cuelga con el core activado y sube las rodillas sin balancear el cuerpo." },
    { name: "Crunch en polea (de rodillas, con cuerda)", pattern: "core_crunch",
      tip: "Flexiona desde el abdomen hacia las rodillas, no jales con los brazos ni la espalda baja." },
    { name: "Plancha (plank)", pattern: "core_plank",
      tip: "Cuerpo en línea recta; aprieta glúteo y abdomen, no dejes caer la cadera." },
    { name: "Plancha lateral", pattern: "core_plank",
      tip: "Cadera elevada y alineada; no dejes que caiga hacia el piso." },
    { name: "Rueda abdominal (ab wheel)", pattern: "core_plank",
      tip: "Abdomen apretado en todo el recorrido para proteger la zona lumbar." },
    { name: "Russian twist con disco", pattern: "core_crunch",
      tip: "Gira desde el torso, no solo los brazos; pies elevados para mayor dificultad." },
    { name: "Mountain climbers", impact: "high", pattern: "core_plank",
      tip: "Mantén la cadera baja y estable, como si corrieras en posición de plancha." }
  ],

  cardio: [
    { name: "Elíptica (ritmo sostenido)", pattern: "cardio",
      tip: "Mantén una postura erguida y un ritmo constante; ideal como cardio de bajo impacto." },
    { name: "Elíptica (intervalos)", pattern: "cardio",
      tip: "Alterna 30 seg de alta intensidad con 60-90 seg de recuperación activa." },
    { name: "Remo en máquina (cardio)", pattern: "pull_horizontal",
      tip: "Empuja primero con piernas, luego tira con los brazos; en la vuelta: brazos-torso-piernas." },
    { name: "Burpees", impact: "high", pattern: "jump",
      tip: "Prioriza la técnica sobre la velocidad; aterriza suave en cada salto." },
    { name: "Jumping jacks", impact: "high", pattern: "jump",
      tip: "Mantén un ritmo constante; ideal para elevar el pulso entre bloques de fuerza." }
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
