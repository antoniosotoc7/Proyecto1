const { getTodayPuzzle, getMadridDate } = require("./_shared/puzzles");

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff"
};

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Método no permitido." })
    };
  }

  const puzzle = getTodayPuzzle();

  if (!puzzle) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        error: "No hay reto configurado para hoy.",
        date: getMadridDate()
      })
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      date: puzzle.date,
      numbers: puzzle.numbers,
      target: puzzle.target
    })
  };
};
