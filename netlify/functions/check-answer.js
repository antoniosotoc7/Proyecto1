const { getTodayPuzzle } = require("./_shared/puzzles");
const {
  evaluateExpression,
  extractNumbers,
  sameMultiset
} = require("./_shared/parser");

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff"
};

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
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
      body: JSON.stringify({ error: "No hay reto configurado para hoy." })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const expression = body.expression;

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        correct,
        result: Number(result.toFixed(6))
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
