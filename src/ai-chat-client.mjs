import { generateContextualReply } from "./conversation-manager.mjs?v=10";

const EFFECT_KEYS = new Set(["affection","trust","excitement","attachment","conflict","relationshipStress","stress","health","energy","fatigue","charm","fashion","confidence","work","social"]);

export function sanitizeRemoteEffects(effects) {
  if (!effects || typeof effects !== "object" || Array.isArray(effects)) return {};
  return Object.fromEntries(Object.entries(effects)
    .filter(([key,value]) => EFFECT_KEYS.has(key) && Number.isFinite(value))
    .map(([key,value]) => [key,Math.max(-100,Math.min(100,Math.round(value)))]));
}

export const DEFAULT_REMOTE_TIMEOUT_MS = 12000;
export const MAX_REMOTE_REPLY_LENGTH = 500;

export function sanitizeRemoteReply(reply) {
  if (typeof reply !== "string") return "";
  return reply.trim().slice(0, MAX_REMOTE_REPLY_LENGTH);
}

export async function requestGirlfriendReply({ endpoint, context, message, fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_REMOTE_TIMEOUT_MS }) {
  const fallback = () => ({ ...generateContextualReply(context, message), source:"local" });
  if (!endpoint || typeof fetchImpl !== "function") return fallback();
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const safeTimeout = Number.isFinite(timeoutMs) ? Math.max(0, timeoutMs) : DEFAULT_REMOTE_TIMEOUT_MS;
  const timeout = controller && safeTimeout ? setTimeout(() => controller.abort(), safeTimeout) : null;
  try {
    const response = await fetchImpl(endpoint, { method:"POST", headers:{ "Content-Type":"application/json", Accept:"application/json" }, body:JSON.stringify({ context, message }), ...(controller ? { signal:controller.signal } : {}) });
    if (!response.ok) return fallback();
    const contentType = response.headers?.get?.("content-type") ?? "application/json";
    if (!contentType.toLowerCase().includes("application/json")) return fallback();
    const data = await response.json();
    const text = sanitizeRemoteReply(data.reply);
    if (!text) return fallback();
    const effects = sanitizeRemoteEffects(data.effects);
    return { text, effects, source:"remote" };
  } catch {
    return fallback();
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
