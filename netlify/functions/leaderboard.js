const { getTodayPuzzle } = require("./_shared/puzzles");
const { getLeaderboard } = require("./_shared/storage");

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff"
};

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método no permitido." }) };
  }

  const puzzle = getTodayPuzzle();

  if (!puzzle) {
    return { statusCode: 404, headers, body: JSON.stringify({ error: "No hay reto configurado para hoy." }) };
  }

  try {
    const leaderboard = await getLeaderboard(event, puzzle.date);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        date: puzzle.date,
        solved: leaderboard.solved.map(({ sessionId, ...entry }) => entry),
        surrendered: leaderboard.surrendered.map(({ sessionId, ...entry }) => entry)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "No se pudo cargar la clasificación." })
    };
  }
};
