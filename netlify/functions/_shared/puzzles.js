/*
 * RETOS PRIVADOS DEL SERVIDOR
 *
 * Este archivo NO se envía al navegador.
 * Cada semana modifica únicamente esta lista.
 *
 * Comprueba siempre:
 * - fecha en formato AAAA-MM-DD;
 * - seis números;
 * - solución que use exactamente esos seis números;
 * - resultado igual al objetivo;
 * - enlace correcto de YouTube.
 */

const puzzles = [
  {
    date: "2026-07-12",
    numbers: [2, 3, 4, 5, 6, 9],
    target: 100,
    solution: "(9+6+5)*(4+3-2)",
    youtube: "https://youtu.be/VIDEO_LUNES"
  },
  {
    date: "2026-07-13",
    numbers: [1, 2, 3, 4, 5, 10],
    target: 66,
    solution: "(10+5-4)*(3+2+1)",
    youtube: "https://youtu.be/VIDEO_MARTES"
  },
  {
    date: "2026-07-14",
    numbers: [2, 4, 5, 6, 7, 9],
    target: 90,
    solution: "(9+7+2)*(6+4-5)",
    youtube: "https://youtu.be/VIDEO_MIERCOLES"
  },
  {
    date: "2026-07-15",
    numbers: [1, 2, 3, 5, 8, 10],
    target: 60,
    solution: "(10+8+5-3)*(2+1)",
    youtube: "https://youtu.be/VIDEO_JUEVES"
  },
  {
    date: "2026-07-16",
    numbers: [2, 3, 4, 6, 8, 10],
    target: 90,
    solution: "(10+8)*(6+4-3-2)",
    youtube: "https://youtu.be/VIDEO_VIERNES"
  },
  {
    date: "2026-07-17",
    numbers: [1, 3, 5, 6, 8, 9],
    target: 112,
    solution: "(9+8+6+5)*(3+1)",
    youtube: "https://youtu.be/VIDEO_SABADO"
  },
  {
    date: "2026-07-18",
    numbers: [2, 4, 5, 7, 8, 9],
    target: 174,
    solution: "(9+8+7+5)*(4+2)",
    youtube: "https://youtu.be/VIDEO_DOMINGO"
  }
];

function getMadridDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function getTodayPuzzle() {
  const today = getMadridDate();
  return puzzles.find((puzzle) => puzzle.date === today) || null;
}

module.exports = {
  puzzles,
  getMadridDate,
  getTodayPuzzle
};
