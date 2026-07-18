/* ============================================================
   MAXIMUS GYM — Iconos de patrón de movimiento
   Pictogramas de línea minimalistas (originales, dibujados a mano
   en SVG) que representan el patrón biomecánico de cada ejercicio,
   no una foto real. Un mismo icono se reutiliza en todos los
   ejercicios que comparten patrón (ej. todas las sentadillas usan
   el icono "squat").
============================================================ */

const MOVEMENT_ICONS = {
  squat: `<circle cx="32" cy="9" r="5"/><path d="M32 14 L32 33"/><path d="M20 17 H44"/><circle cx="20" cy="17" r="2.6"/><circle cx="44" cy="17" r="2.6"/><path d="M32 33 L21 45 L21 58"/><path d="M32 33 L43 45 L43 58"/>`,

  lunge: `<circle cx="21" cy="9" r="5"/><path d="M21 14 L24 30"/><path d="M17 22 L13 34"/><path d="M28 22 L32 34"/><path d="M24 30 L34 41 L34 58"/><path d="M24 30 L14 47 L8 58"/>`,

  hinge: `<circle cx="41" cy="9" r="5"/><path d="M41 14 L31 38"/><path d="M31 38 L29 50 L29 59"/><path d="M31 38 L33 50 L33 59"/><path d="M35 21 L20 43"/><path d="M18 43 H35"/>`,

  leg_press: `<path d="M8 50 L32 58"/><path d="M22 47 L11 32"/><circle cx="9" cy="27" r="5"/><path d="M22 47 L38 37 L54 27"/><path d="M50 22 L58 32"/>`,

  leg_extension: `<circle cx="22" cy="10" r="5"/><path d="M22 15 L22 31"/><path d="M22 31 H38"/><path d="M38 31 L38 14"/><circle cx="38" cy="12" r="2.8"/><path d="M22 31 L22 45 L26 58"/>`,

  leg_curl: `<circle cx="19" cy="9" r="5"/><path d="M19 14 L19 35"/><path d="M19 35 L19 58"/><path d="M19 35 L19 50 L30 43"/><circle cx="30" cy="43" r="2.8"/>`,

  calf: `<circle cx="32" cy="8" r="5"/><path d="M32 13 L32 36"/><path d="M32 36 L28 52 L33 56 L24 58"/><path d="M32 36 L37 52 L42 56 L47 58"/>`,

  hip_machine: `<circle cx="32" cy="10" r="5"/><path d="M32 15 L32 33"/><path d="M32 33 L18 52"/><path d="M32 33 L46 52"/><path d="M12 47 L20 53"/><path d="M52 47 L44 53"/>`,

  glute_bridge: `<path d="M6 43 H21"/><circle cx="10" cy="38" r="5"/><path d="M21 43 L36 30"/><path d="M36 30 L50 43"/><path d="M50 43 L50 58"/><path d="M22 58 L21 43"/>`,

  glute_kickback: `<circle cx="19" cy="9" r="5"/><path d="M19 14 L23 34"/><path d="M23 34 L23 58"/><path d="M23 34 L35 39 L46 32"/><path d="M14 24 L20 30"/>`,

  press_horizontal: `<path d="M6 46 H42"/><circle cx="13" cy="42" r="5"/><path d="M18 44 L27 45"/><path d="M27 45 L27 20"/><path d="M13 20 H41"/><circle cx="13" cy="20" r="3"/><circle cx="41" cy="20" r="3"/>`,

  press_vertical: `<circle cx="32" cy="13" r="5"/><path d="M32 18 L32 37"/><path d="M32 21 L19 9"/><path d="M32 21 L45 9"/><path d="M15 9 H49"/><path d="M32 37 L26 58"/><path d="M32 37 L38 58"/>`,

  fly: `<circle cx="32" cy="11" r="5"/><path d="M32 16 L32 38"/><path d="M32 19 Q20 22 14 27"/><path d="M32 19 Q44 22 50 27"/><path d="M32 38 L27 58"/><path d="M32 38 L37 58"/>`,

  dip: `<path d="M16 18 V40"/><path d="M42 18 V40"/><circle cx="28" cy="13" r="5"/><path d="M28 18 L28 42"/><path d="M28 21 L16 26"/><path d="M28 21 L42 26"/><path d="M28 42 L24 56"/><path d="M28 42 L31 58"/>`,

  pushup: `<circle cx="11" cy="27" r="5"/><path d="M16 29 L51 34"/><path d="M22 30 V45"/><path d="M45 33 L55 45"/>`,

  pull_vertical: `<circle cx="32" cy="19" r="5"/><path d="M32 24 L32 45"/><path d="M32 26 L22 17 L15 8"/><path d="M32 26 L42 17 L49 8"/><path d="M32 45 L27 58"/><path d="M32 45 L37 58"/>`,

  pull_horizontal: `<path d="M18 40 L33 21"/><path d="M18 40 L13 51 L18 58"/><path d="M33 24 L24 29 L45 33"/>`,

  raise_lateral: `<circle cx="32" cy="9" r="5"/><path d="M32 14 L32 39"/><path d="M32 17 H12"/><path d="M32 17 H52"/><path d="M32 39 L27 58"/><path d="M32 39 L37 58"/>`,

  raise_front: `<circle cx="19" cy="9" r="5"/><path d="M19 14 L19 39"/><path d="M19 17 L37 6"/><path d="M19 39 L14 58"/><path d="M19 39 L24 58"/>`,

  shrug: `<circle cx="32" cy="10" r="5"/><path d="M23 15 H41"/><path d="M32 15 L32 39"/><path d="M24 17 V35"/><path d="M40 17 V35"/><path d="M20 35 H44"/><path d="M32 39 L27 58"/><path d="M32 39 L37 58"/>`,

  curl: `<circle cx="23" cy="9" r="5"/><path d="M23 14 L23 39"/><path d="M29 17 V32"/><path d="M29 32 L22 20"/><path d="M17 17 L17 34"/><path d="M23 39 L18 58"/><path d="M23 39 L27 58"/>`,

  triceps_extension: `<circle cx="27" cy="9" r="5"/><path d="M27 14 L27 39"/><path d="M31 17 L36 8"/><path d="M36 8 L41 21"/><path d="M27 39 L22 58"/><path d="M27 39 L31 58"/>`,

  carry: `<circle cx="32" cy="9" r="5"/><path d="M32 14 L32 38"/><path d="M32 18 L20 38"/><circle cx="20" cy="41" r="3"/><path d="M32 18 L44 38"/><circle cx="44" cy="41" r="3"/><path d="M32 38 L26 58"/><path d="M32 38 L40 52"/>`,

  core_crunch: `<path d="M8 49 H22"/><circle cx="6" cy="42" r="5"/><path d="M22 49 L29 37"/><path d="M29 37 L29 49"/>`,

  core_plank: `<circle cx="9" cy="25" r="5"/><path d="M14 27 L51 32"/><path d="M19 28 V44"/><path d="M45 31 L55 44"/>`,

  cardio: `<circle cx="23" cy="9" r="5"/><path d="M23 14 L27 30"/><path d="M27 30 L37 35 L41 47"/><path d="M27 30 L19 39 L13 49"/><path d="M23 17 L14 24"/><path d="M23 17 L33 12"/>`,

  jump: `<circle cx="32" cy="9" r="5"/><path d="M32 14 L32 33"/><path d="M32 17 L13 5"/><path d="M32 17 L51 5"/><path d="M32 33 L15 57"/><path d="M32 33 L49 57"/>`
};

function renderMovementIcon(pattern) {
  const inner = MOVEMENT_ICONS[pattern];
  if (!inner) return "";
  return `<svg class="exercise__icon-svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
