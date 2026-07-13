const { getTodayPuzzle } = require("./_shared/puzzles");
const { createSession } = require("./_shared/storage");

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff"
};

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Método no permitido." }) };
  }

  const puzzle = getTodayPuzzle();

  if (!puzzle) {
    return { statusCode: 404, headers, body: JSON.stringify({ error: "No hay reto configurado para hoy." }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const session = await createSession(event, puzzle.date, body.username);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.sessionId,
        username: session.username,
        startedAt: session.startedAt
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: error.message || "No se pudo iniciar la partida." })
    };
  }
};
