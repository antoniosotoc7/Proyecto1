const { getTodayPuzzle } = require("./_shared/puzzles");
const {
  evaluateExpression,
  extractNumbers,
  sameMultiset
} = require("./_shared/parser");
const {
  getSession,
  saveResult,
  getLeaderboard,
  findPosition
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
    const expression = body.expression;
    const session = await getSession(event, body.sessionId);

    if (!session || session.date !== puzzle.date) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "La partida no es válida. Recarga la página y vuelve a empezar." })
      };
    }

    if (session.status !== "playing") {
      const leaderboard = await getLeaderboard(event, puzzle.date);
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({
          error: "Esta partida ya ha terminado.",
          status: session.status,
          position: findPosition(leaderboard, session.sessionId)
        })
      };
    }

    const usedNumbers = extractNumbers(expression);

    if (!sameMultiset(usedNumbers, puzzle.numbers)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          correct: false,
          error: "Debes usar exactamente los seis números del reto."
        })
      };
    }

    const result = evaluateExpression(expression);
    const correct = Math.abs(result - puzzle.target) < 0.000001;

    if (!correct) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          correct: false,
          result: Number(result.toFixed(6))
        })
      };
    }

    const elapsedSeconds = Math.max(
      1,
      Math.floor((Date.now() - session.startedAt) / 1000)
    );

    await saveResult(event, session, "solved", elapsedSeconds);
    const leaderboard = await getLeaderboard(event, puzzle.date);
    const position = findPosition(leaderboard, session.sessionId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        correct: true,
        result: puzzle.target,
        elapsedSeconds,
        position,
        totalSolved: leaderboard.solved.length
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        correct: false,
        error: error.message || "La operación no es válida."
      })
    };
  }
};
