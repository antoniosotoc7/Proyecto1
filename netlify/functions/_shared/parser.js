/*
 * Evaluador aritmético pequeño y seguro.
 * No usa eval ni Function.
 * Admite números, +, -, *, / y paréntesis.
 */

function tokenize(expression) {
  if (typeof expression !== "string" || expression.length > 250) {
    throw new Error("Expresión no válida.");
  }

  const compact = expression.replace(/\s+/g, "");

  if (!compact || !/^[0-9+\-*/().]+$/.test(compact)) {
    throw new Error("La expresión contiene símbolos no permitidos.");
  }

  const tokens = [];
  let index = 0;

  while (index < compact.length) {
    const character = compact[index];

    if ("+-*/()".includes(character)) {
      tokens.push({ type: character, value: character });
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(character)) {
      let text = "";

      while (index < compact.length && /[0-9.]/.test(compact[index])) {
        text += compact[index];
        index += 1;
      }

      if (!/^(?:\d+|\d+\.\d+)$/.test(text)) {
        throw new Error("Número mal escrito.");
      }

      const value = Number(text);

      if (!Number.isFinite(value)) {
        throw new Error("Número no válido.");
      }

      tokens.push({ type: "number", value });
      continue;
    }

    throw new Error("Símbolo no permitido.");
  }

  return tokens;
}

function evaluateExpression(expression) {
  const tokens = tokenize(expression);
  let position = 0;

  function peek() {
    return tokens[position] || null;
  }

  function consume(type) {
    const token = peek();

    if (!token || token.type !== type) {
      throw new Error("Expresión mal formada.");
    }

    position += 1;
    return token;
  }

  function parsePrimary() {
    const token = peek();

    if (!token) {
      throw new Error("Expresión incompleta.");
    }

    if (token.type === "number") {
      position += 1;
      return token.value;
    }

    if (token.type === "(") {
      consume("(");
      const value = parseAddSubtract();
      consume(")");
      return value;
    }

    if (token.type === "+") {
      consume("+");
      return parsePrimary();
    }

    if (token.type === "-") {
      consume("-");
      return -parsePrimary();
    }

    throw new Error("Expresión mal formada.");
  }

  function parseMultiplyDivide() {
    let value = parsePrimary();

    while (peek() && (peek().type === "*" || peek().type === "/")) {
      const operator = peek().type;
      position += 1;
      const right = parsePrimary();

      if (operator === "*") {
        value *= right;
      } else {
        if (Math.abs(right) < 1e-12) {
          throw new Error("No se puede dividir entre cero.");
        }

        value /= right;
      }

      if (!Number.isFinite(value)) {
        throw new Error("Resultado no válido.");
      }
    }

    return value;
  }

  function parseAddSubtract() {
    let value = parseMultiplyDivide();

    while (peek() && (peek().type === "+" || peek().type === "-")) {
      const operator = peek().type;
      position += 1;
      const right = parseMultiplyDivide();

      value = operator === "+" ? value + right : value - right;
    }

    return value;
  }

  const result = parseAddSubtract();

  if (position !== tokens.length) {
    throw new Error("Expresión mal formada.");
  }

  return result;
}

function extractNumbers(expression) {
  const tokens = tokenize(expression);

  return tokens
    .filter((token) => token.type === "number")
    .map((token) => token.value);
}

function sameMultiset(first, second) {
  if (first.length !== second.length) {
    return false;
  }

  const a = [...first].sort((x, y) => x - y);
  const b = [...second].sort((x, y) => x - y);

  return a.every((value, index) => Math.abs(value - b[index]) < 1e-12);
}

module.exports = {
  evaluateExpression,
  extractNumbers,
  sameMultiset
};
