const { getTodayPuzzle } = require("./_shared/puzzles");
const {
  getSession,
  saveResult,
  getLeaderboard
} = require("./_shared/storage");

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
    const session = await getSession(event, body.sessionId);

    if (!session || session.date !== puzzle.date) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "La partida no es válida. Recarga la página." })
      };
    }

    if (session.status === "playing") {
      await saveResult(event, session, "surrendered");
    }

    const leaderboard = await getLeaderboard(event, puzzle.date);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        solution: puzzle.solution,
        youtube: puzzle.youtube,
        status: session.status === "solved" ? "solved" : "surrendered",
        totalPlayers: leaderboard.solved.length + leaderboard.surrendered.length
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: error.message || "No se pudo revelar la solución." })
    };
  }
};
