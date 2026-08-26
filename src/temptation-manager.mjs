import { clamp } from "./game-core.mjs";

export const TEMPTATION_CHOICES = {
  reject:{ label:"분명하게 거절한다", npcInterest:-18, npcTrust:-4, partnerTrust:6, conflict:-2 },
  friend:{ label:"친구로 선을 긋는다", npcInterest:-5, npcTrust:6, partnerTrust:1, conflict:0 },
  secret:{ label:"비밀 만남을 받아들인다", npcInterest:6, npcTrust:6, partnerTrust:-30, partnerAffection:-30, conflict:12 }
};

export function getTemptationOpportunity(state) {
  const npc = (state.npcs ?? []).find(entry => entry.relationshipType === "coworker" && entry.interestInPlayer >= 45);
  return npc ? { npc, level:npc.interestInPlayer >= 75 ? "secret" : npc.interestInPlayer >= 60 ? "drinks" : "contact" } : null;
}

export function resolveTemptation(state, npcId, choiceId) {
  const choice = TEMPTATION_CHOICES[choiceId];
  const npc = (state.npcs ?? []).find(entry => entry.instanceId === npcId);
  if (!choice || !npc || npc.relationshipType !== "coworker") return null;
  npc.interestInPlayer = clamp(npc.interestInPlayer + choice.npcInterest);
  npc.trust = clamp(npc.trust + choice.npcTrust);
  state.trust = clamp(state.trust + choice.partnerTrust, 0, 1000);
  state.affection = clamp(state.affection + (choice.partnerAffection??0), 0, 1000);
  state.conflict = clamp(state.conflict + choice.conflict);
  state.temptationHistory ??= [];
  const record = { day:state.day, npcId, choiceId, partnerTrust:choice.partnerTrust, partnerAffection:choice.partnerAffection??0, conflict:choice.conflict };
  state.temptationHistory.push(record);
  return { npc, choice, record };
}
