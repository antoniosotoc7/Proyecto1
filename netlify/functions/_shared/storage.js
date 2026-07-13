const crypto = require("node:crypto");

const STORE_NAME = "objetivo-x-ranking";

async function getBlobStore(event) {
  const { connectLambda, getStore } = await import("@netlify/blobs");
  connectLambda(event);
  return getStore(STORE_NAME);
}


function cleanUsername(value) {
  if (typeof value !== "string") {
    throw new Error("Escribe un nombre de usuario.");
  }

  const username = value.trim().replace(/\s+/g, " ");

  if (username.length < 3 || username.length > 20) {
    throw new Error("El nombre debe tener entre 3 y 20 caracteres.");
  }

  if (!/^[\p{L}\p{N} _.-]+$/u.test(username)) {
    throw new Error("El nombre contiene caracteres no permitidos.");
  }

  return username;
}

function sessionKey(id) {
  return `sessions/${id}`;
}

function resultKey(date, id) {
  return `results/${date}/${id}`;
}

async function createSession(event, date, username) {
  const store = await getBlobStore(event);
  const sessionId = crypto.randomUUID();
  const session = {
    sessionId,
    date,
    username: cleanUsername(username),
    startedAt: Date.now(),
    status: "playing"
  };

  await store.setJSON(sessionKey(sessionId), session, { onlyIfNew: true });
  return session;
}

async function getSession(event, sessionId) {
  if (typeof sessionId !== "string" || !/^[0-9a-f-]{36}$/i.test(sessionId)) {
    return null;
  }

  const store = await getBlobStore(event);
  return store.get(sessionKey(sessionId), { type: "json" });
}

async function saveResult(event, session, status, elapsedSeconds = null) {
  const store = await getBlobStore(event);
  const result = {
    sessionId: session.sessionId,
    date: session.date,
    username: session.username,
    status,
    elapsedSeconds: status === "solved" ? elapsedSeconds : null,
    finishedAt: Date.now()
  };

  const write = await store.setJSON(
    resultKey(session.date, session.sessionId),
    result,
    { onlyIfNew: true }
  );

  if (write.modified) {
    await store.setJSON(sessionKey(session.sessionId), {
      ...session,
      status,
      finishedAt: result.finishedAt
    });
    return result;
  }

  return store.get(resultKey(session.date, session.sessionId), { type: "json" });
}

async function getLeaderboard(event, date) {
  const store = await getBlobStore(event);
  const { blobs } = await store.list({ prefix: `results/${date}/` });

  const results = (
    await Promise.all(
      blobs.map((blob) => store.get(blob.key, { type: "json" }))
    )
  ).filter(Boolean);

  const solved = results
    .filter((result) => result.status === "solved")
    .sort((a, b) =>
      a.elapsedSeconds - b.elapsedSeconds ||
      a.finishedAt - b.finishedAt
    );

  const surrendered = results
    .filter((result) => result.status === "surrendered")
    .sort((a, b) => a.finishedAt - b.finishedAt);

  return {
    solved: solved.map((result, index) => ({
      position: index + 1,
      username: result.username,
      elapsedSeconds: result.elapsedSeconds,
      sessionId: result.sessionId
    })),
    surrendered: surrendered.map((result) => ({
      position: null,
      username: result.username,
      elapsedSeconds: null,
      sessionId: result.sessionId
    }))
  };
}

function findPosition(leaderboard, sessionId) {
  const solved = leaderboard.solved.find(
    (entry) => entry.sessionId === sessionId
  );

  if (solved) {
    return solved.position;
  }

  return null;
}

module.exports = {
  cleanUsername,
  createSession,
  getSession,
  saveResult,
  getLeaderboard,
  findPosition
};
