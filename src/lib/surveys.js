// src/lib/surveys.js
const SURVEYS_VERSION_KEY = "surveys:version";
const DAILY_COMPLETIONS_KEY = "surveys.dailyCompletions.v1";
const DB_URL = (() => {
  const base = (import.meta?.env?.BASE_URL ?? "/").toString();
  const normBase = (base.startsWith("/") ? base : `/${base}`).replace(/\/+$/, "");
  return `${normBase}/db.json`;
})();
export const USER_KEY = "app:user";
const COMPLETIONS_KEY = "surveys.completions.v1";
const PACKAGE_LIMITS = {
  free: 1,
  silver: 5,
  gold: 10,
  platinum: 20,
};
export function getUser() {
  try {
    const u = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    if (u && u.id) return u;
  } catch {}
  const fresh = {
    id: crypto?.randomUUID?.() || String(Date.now()),
    name: "Guest",
    email: "",
    plan: "free",
    tier: "free",
    balance: 0,
    createdAt: Date.now(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(fresh));
  return fresh;
}
export function setUser(patch) {
  const u = { ...getUser(), ...patch };
  localStorage.setItem(USER_KEY, JSON.stringify(u));
  return u;
}
/* ---------------- Completions ---------------- */
function readCompletions() {
  try {
    return JSON.parse(localStorage.getItem(COMPLETIONS_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeCompletions(all) {
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(all));
}
export function getCompletedIds(userId) {
  const all = readCompletions();
  return new Set(Object.keys(all[userId] || {}));
}
export function hasCompleted(userId, surveyId) {
  const all = readCompletions();
  return Boolean(all?.[userId]?.[surveyId]);
}
export function markCompleted(userId, surveyId, answers = {}) {
  const all = readCompletions();
  all[userId] = all[userId] || {};
  all[userId][surveyId] = { answers, completedAt: new Date().toISOString() };
  writeCompletions(all);
  const today = new Date().toISOString().split("T")[0];
  incrementDailyCompletions(userId, today);
  try {
    localStorage.setItem(SURVEYS_VERSION_KEY, String(Date.now()));
  } catch {}
}
export function resetCompletions(userId) {
  const all = readCompletions();
  if (all[userId]) {
    delete all[userId];
    writeCompletions(all);
    try {
      localStorage.setItem(SURVEYS_VERSION_KEY, String(Date.now()));
    } catch {}
  }
}
/* ---------------- Daily Completions ---------------- */
function getDailyCompletions(userId) {
  try {
    const daily = JSON.parse(localStorage.getItem(DAILY_COMPLETIONS_KEY) || "{}");
    return daily[userId] || {};
  } catch {
    return {};
  }
}
function incrementDailyCompletions(userId, date) {
  const daily = getDailyCompletions(userId);
  daily[date] = (daily[date] || 0) + 1;
  localStorage.setItem(DAILY_COMPLETIONS_KEY, JSON.stringify({ [userId]: daily }));
}
function resetDailyCompletionsIfNeeded(userId) {
  const today = new Date().toISOString().split("T")[0];
  const daily = getDailyCompletions(userId);
  Object.keys(daily).forEach((date) => {
    if (date !== today) delete daily[date];
  });
  localStorage.setItem(DAILY_COMPLETIONS_KEY, JSON.stringify({ [userId]: daily }));
}
export function getRemainingSurveys(userId) {
  const user = getUser();
  const today = new Date().toISOString().split("T")[0];
  resetDailyCompletionsIfNeeded(userId);
  const daily = getDailyCompletions(userId);
  const limit = PACKAGE_LIMITS[user.tier] || 0;
  return Math.max(0, limit - (daily[today] || 0));
}
/* ---------------- Guard Helpers ---------------- */
export function canStartSurvey(surveyId) {
  const user = getUser();
  if (hasCompleted(user.id, surveyId)) return false;
  const today = new Date().toISOString().split("T")[0];
  resetDailyCompletionsIfNeeded(user.id);
  const daily = getDailyCompletions(user.id);
  const limit = PACKAGE_LIMITS[user.tier] || 0;
  return (daily[today] || 0) < limit;
}
export function ensureNotCompleted(surveyId) {
  if (!canStartSurvey(surveyId)) {
    const user = getUser();
    const limit = PACKAGE_LIMITS[user.tier] || 0;
    throw new Error(`You have reached your daily limit of ${limit} surveys.`);
  }
}
/* ---------------- DB Loader ---------------- */
let _dbCache = null;
export async function loadDB() {
  if (_dbCache) return _dbCache;
  const url = DB_URL.includes("?")
    ? `${DB_URL}&_=${Date.now()}`
    : `${DB_URL}?_=${Date.now()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load db.json");
  _dbCache = await res.json();
  return _dbCache;
}
/* ---------------- UI Mapping ---------------- */
export async function listSurveysForUser() {
  const user = getUser();
  const completed = getCompletedIds(user.id);
  const db = await loadDB();
  return (db.surveys || []).map((s) => {
    const count =
      Array.isArray(s.items) ? s.items.length
      : Array.isArray(s.questions) ? s.questions.length
      : Number.isFinite(s.questions) ? s.questions
      : 0;
    const isCompleted = completed.has(s.id);
    return {
      id: s.id,
      title: s.name || s.title || "Survey",
      name: s.name,
      description: s.description || "",
      premium: !!s.premium,
      reward: s.payout,
      currency: (s.currency || "ksh").toLowerCase(),
      questions: Array.isArray(s.items) ? s.items : Array.isArray(s.questions) ? s.questions : [],
      questionsCount: count,
      completed: isCompleted,
      status: isCompleted ? "completed" : "available",
      locked: isCompleted,
      retakeBlockedReason: isCompleted ? "Already completed. Retakes are not allowed." : null,
    };
  });
}
export const KEYS = { SURVEYS_VERSION_KEY, COMPLETIONS_KEY, USER_KEY, DAILY_COMPLETIONS_KEY };
