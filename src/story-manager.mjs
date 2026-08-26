import { applyEffects, clamp } from "./game-core.mjs";
import { appendTransaction } from "./economy-manager.mjs";
import { meetsConditions } from "./event-manager.mjs";
import { recordMemory } from "./memory-manager.mjs";
import { STORY_SCENES } from "./story-data.mjs?v=3";
import { applyHiddenRouteEffects, getHiddenRouteSceneEffects } from "./hidden-route-manager.mjs";
import { combineChoiceEffects, getMbtiChoiceAdjustment } from "./event-choice-modifier.mjs";
import { isContentAvailableForMode } from "./scenario-state.mjs";

function hasStoryChoice(state, requirement) {
  return (state.storyHistory ?? []).some(record => record.sceneId === requirement.sceneId && (!requirement.choiceIds || requirement.choiceIds.includes(record.choiceId)));
}

export function meetsStoryConditions(state, conditions = []) {
  return conditions.every(condition => condition.storyChoice ? hasStoryChoice(state,condition.storyChoice) : meetsConditions(state,[condition]));
}

export function getStoryScene(sceneId, scenes = STORY_SCENES) {
  return scenes.find(scene => scene.id === sceneId) ?? null;
}

export function getAvailableStoryChoices(state, scene) {
  return (scene?.choices ?? []).filter(choice => meetsStoryConditions(state,choice.conditions));
}

export function getEligibleStoryScenes(state, scenes = STORY_SCENES) {
  const history = state.storyHistory ?? [];
  if (history.some(record => record.day === state.day)) return [];
  return scenes.filter(scene => {
    if (!isContentAvailableForMode(state,scene)) return false;
    if (scene.heroineIds && !scene.heroineIds.includes(state.partner.heroineId)) return false;
    if (state.partner.heroineId === "yuna" && !scene.studentSafe && !scene.heroineIds?.includes("yuna")) return false;
    if (history.some(record => record.sceneId === scene.id)) return false;
    if (state.day < scene.window[0] || state.day > scene.window[1]) return false;
    if (scene.requires && !hasStoryChoice(state,scene.requires)) return false;
    return meetsStoryConditions(state,scene.conditions);
  }).sort((a,b) => ((state.storyDirector?.nextDayPlan?.storyScores?.[b.id]??b.priority)-(state.storyDirector?.nextDayPlan?.storyScores?.[a.id]??a.priority)) || a.window[0] - b.window[0]);
}

export function selectNextStoryScene(state, scenes = STORY_SCENES) {
  if (state.pendingStoryId) {
    const pendingScene = getStoryScene(state.pendingStoryId,scenes);
    if (pendingScene) return pendingScene;
    state.pendingStoryId = null;
  }
  return getEligibleStoryScenes(state,scenes)[0] ?? null;
}

function selectOutcome(state, choice) {
  return (choice.outcomes ?? []).find(outcome => meetsStoryConditions(state,outcome.conditions)) ?? null;
}

export function resolveStoryChoice(state, sceneId, choiceId, scenes = STORY_SCENES) {
  const scene = getStoryScene(sceneId,scenes);
  const choice = getAvailableStoryChoices(state,scene).find(item => item.id === choiceId);
  if (!scene || !choice || (state.storyHistory ?? []).some(record => record.sceneId === sceneId)) return null;
  const outcome = selectOutcome(state,choice);
  const conditionalEffects = combineChoiceEffects(choice.effects ?? {},outcome?.effects ?? {});
  const mbtiAdjustment = getMbtiChoiceAdjustment(state,choice);
  const effects = combineChoiceEffects(conditionalEffects,mbtiAdjustment.effects);
  const baseRouteEffects = { ...(choice.routeEffects ?? {}), ...(outcome?.routeEffects ?? {}) };
  const traitRouteEffects = getHiddenRouteSceneEffects(state,scene.id);
  const routeEffectKeys = [...new Set([...Object.keys(baseRouteEffects),...Object.keys(traitRouteEffects)])];
  const routeEffects = Object.fromEntries(routeEffectKeys.map(key=>[key,(baseRouteEffects[key] ?? 0)+(traitRouteEffects[key] ?? 0)]));
  const routeFlags = { ...(choice.routeFlags ?? {}), ...(outcome?.routeFlags ?? {}) };
  applyEffects(state,effects);
  applyHiddenRouteEffects(state,routeEffects,routeFlags);
  if (effects.money) appendTransaction(state,{category:"story",label:scene.title,amount:Math.round(effects.money)});
  state.storyFlags ??= {};
  Object.assign(state.storyFlags,choice.flags ?? {},outcome?.flags ?? {});
  if (state.scenario?.enabled) {
    const scenarioEffectKeys=[...new Set([...Object.keys(choice.scenarioEffects??{}),...Object.keys(outcome?.scenarioEffects??{})])];
    for (const key of scenarioEffectKeys) { const value=(choice.scenarioEffects?.[key]??0)+(outcome?.scenarioEffects?.[key]??0); if (Number.isFinite(value) && Number.isFinite(state.scenario[key])) state.scenario[key]=Math.max(0,state.scenario[key]+value); }
    for (const [field,items] of [["clues",[...(choice.clues??[]),...(outcome?.clues??[])]],["profileUnlocks",[...(choice.profileUnlocks??[]),...(outcome?.profileUnlocks??[])]],["unlockedActions",[...(choice.unlockedActions??[]),...(outcome?.unlockedActions??[])]]]) for (const item of items) if (!state.scenario[field].includes(item)) state.scenario[field].push(item);
    for (const hook of [...(choice.followUpHooks??[]),...(outcome?.followUpHooks??[])]) if (!state.scenario.followUpHooks.includes(hook)) state.scenario.followUpHooks.push(hook);
  }
  state.futureScore = clamp((state.futureScore ?? 0) + (choice.futureScore ?? 0) + (outcome?.futureScore ?? 0),-100,100);
  const response = outcome?.response ?? choice.response;
  const record = {sceneId:scene.id,arc:scene.arc,choiceId:choice.id,day:state.day,response};
  state.storyHistory ??= [];
  state.storyHistory.push(record);
  state.pendingStoryId = null;
  const memory = recordMemory(state,{type:"story",summary:choice.memory ?? `${scene.title}: ${choice.label}`,importance:4,tags:["스토리",scene.arc,scene.id,choice.id]});
  return {scene,choice,outcome,effects,routeEffects,response,record,memory,mbtiAdjustment};
}

export function validateStoryState(state) {
  return Array.isArray(state.storyHistory) && state.storyHistory.every(record => typeof record.sceneId === "string" && typeof record.choiceId === "string" && Number.isFinite(record.day) && typeof record.response === "string") && state.storyFlags && typeof state.storyFlags === "object" && Number.isFinite(state.futureScore) && (state.pendingStoryId === null || typeof state.pendingStoryId === "string");
}
