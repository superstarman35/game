const scale = value => value / 100;
import { applyJobModifiers } from "./job-manager.mjs";
import { getEquipmentBonuses } from "./inventory-manager.mjs";

export function applySelfManagementModifiers(state, effects) {
  const modified = { ...effects };
  if ((state.fatigue ?? 0) >= 70) {
    for (const key of ["work", "social", "affection", "trust"]) if ((modified[key] ?? 0) > 0) modified[key] *= key === "work" || key === "social" ? 0.75 : 0.9;
    if ((modified.money ?? 0) > 0) modified.money *= 0.85;
    if ((modified.stress ?? 0) > 0) modified.stress *= 1.2;
  }
  if ((state.confidence ?? 0) >= 70) {
    for (const key of ["social", "affection", "trust"]) if ((modified[key] ?? 0) > 0) modified[key] *= key === "social" ? 1.15 : 1.05;
    if ((modified.stress ?? 0) > 0) modified.stress *= 0.9;
  }
  return modified;
}

export function calculateActionEffects(state, action) {
  const effects = { ...action.effects };
  const fixedEffects=Object.fromEntries((action.fixedEffects??[]).filter(key=>key in effects).map(key=>[key,effects[key]]));
  const personality = state.partner.personality;
  const notes = [];
  const equipment = getEquipmentBonuses(state);

  if (action.tag === "연락") {
    effects.affection = (effects.affection ?? 0) * (0.65 + scale(personality.contactImportance));
    effects.trust = (effects.trust ?? 0) * (0.75 + personality.loyalty / 150);
    effects.attachment = 3 + scale(personality.contactImportance) * 4;
    notes.push("연락 선호", "충성도");
  }

  if (action.tag === "데이트") {
    effects.affection = (effects.affection ?? 0) * (0.6 + scale(personality.romanticism));
    effects.affection *= 1 + (equipment.attractiveness + equipment.fashion) / 100;
    effects.excitement = 4 + scale(personality.romanticism) * 9;
    effects.relationshipStress = -4;
    notes.push("낭만성", "장착 스타일");
  }

  if (action.tag === "쇼핑") {
    effects.affection = (effects.affection ?? 0) * (0.45 + scale(personality.materialism));
    effects.excitement = 2 + scale(personality.giftPreference) * 7;
    notes.push("물질성향", "선물 선호");
  }

  if (action.tag === "성공" && (effects.affection ?? 0) < 0) {
    const neglectMultiplier = 0.55 + scale(personality.contactImportance) - personality.economicPreference / 200;
    effects.affection *= Math.max(0.35, neglectMultiplier);
    effects.relationshipStress = 2 + scale(personality.contactImportance) * 5;
    notes.push("연락 선호", "경제 안정 선호");
  }

  if (action.tag === "유혹") {
    effects.trust = (effects.trust ?? 0) * (0.7 + scale(personality.jealousy));
    effects.conflict = 4 + scale(personality.jealousy) * 10;
    effects.relationshipStress = 5 + scale(personality.emotionalSensitivity) * 8;
    notes.push("질투", "예민함");
  }

  if (action.tag === "휴식" && (effects.affection ?? 0) < 0) {
    effects.affection *= 0.5 + scale(personality.contactImportance);
    notes.push("연락 선호");
  }

  const jobEffects = applyJobModifiers(state, action, effects);
  if ((state.fatigue ?? 0) >= 70) notes.push("피로 누적");
  if ((state.confidence ?? 0) >= 70) notes.push("높은 자신감");
  const resolvedEffects=applySelfManagementModifiers(state, jobEffects);
  Object.assign(resolvedEffects,fixedEffects);
  return { effects:resolvedEffects, notes };
}
