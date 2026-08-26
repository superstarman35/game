import { validateGirlfriend } from "./girlfriend-manager.mjs?v=7";
import { generateJob, getJobStartingState, validateJob } from "./jobs-data.mjs?v=6";
import { generateNpcs, validateNpcs } from "./npc-manager.mjs?v=2";
import { validateMemories } from "./memory-manager.mjs";
import { createInvestmentState, validateInvestmentState } from "./investment-manager.mjs?v=2";
import { createLotteryState, validateLotteryState } from "./lottery-manager.mjs";
import { createAdvancedEconomyState, validateAdvancedEconomyState } from "./economy-manager.mjs";
import { selectEnding } from "./ending-manager.mjs";
import { createVisualState, validateCharacterAppearance } from "./character-appearance.mjs";
import { createHiddenRouteState, validateHiddenRouteState } from "./hidden-route-manager.mjs";
import { createDaySnapshot } from "./night-manager.mjs";
import { createStoryDirectorState, validateStoryDirectorState } from "./dynamic-story-director.mjs";
import { applyPlayerArchetype, createPlayerProfile, validatePlayerProfile } from "./player-profile-data.mjs";
import { createWorldState, validateWorldState } from "./world-map-manager.mjs";
import { createScenarioState, normalizeGameMode, validateScenarioState } from "./scenario-state.mjs";
import { createYujinSecretRouteState, validateYujinSecretRouteState } from "./yujin-secret-route.mjs";
import { createWorldEncounterRoutes, validateWorldEncounterRoutes } from "./world-encounter-manager.mjs?v=3";

export const MAX_DAY = 30;
export const PHASE_COUNT = 4;

export function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

export function createInitialState(partner, random = Math.random, setup = {}) {
  const gameMode = normalizeGameMode(setup.mode);
  const gamePartner = structuredClone(partner);
  if (gameMode === "marriage-in-30-days" && gamePartner?.heroineId === "haeun") gamePartner.age = 23;
  const selectedJob = setup.job ? structuredClone(setup.job) : generateJob(random);
  const player = setup.player ? structuredClone(setup.player) : createPlayerProfile();
  const jobStart = applyPlayerArchetype(getJobStartingState(selectedJob, random), player);
  let initialAffection = 500 + Math.floor(random() * 41);
  let initialTrust = 480 + Math.floor(random() * 41);
  if (player.archetypeId === "wealthy") initialTrust = Math.max(0, initialTrust - 200);
  if (player.archetypeId === "handsome") initialTrust = Math.max(0, initialTrust - 300);
  if (player.archetypeId === "balanced" && selectedJob.id === "day-laborer") {
    initialAffection = 300 + Math.floor(random() * 100);
    initialTrust = 500 + Math.floor(random() * 100);
  }
  const initialStress = player.archetypeId === "wealthy" ? 80 : jobStart.stress;
  const initialFatigue = player.archetypeId === "handsome" ? 30 : player.archetypeId === "balanced" && selectedJob.id === "day-laborer" ? 50 : jobStart.fatigue;
  const state = {
    version: 1,
    gameMode,
    scenario: createScenarioState(gameMode),
    day: 1,
    phase: 0,
    selected: null,
    partner: gamePartner,
    player,
    world:createWorldState(player),
    ...createVisualState(gamePartner),
    job: selectedJob,
    jobLevel: 1,
    jobProgress: 0,
    economyLedger: [],
    finance: createAdvancedEconomyState(),
    inventory: [],
    equipment: {},
    girlfriendEquipment: {},
    npcs: generateNpcs(random),
    npcHistory: [],
    worldEncounterHistory: [],
    worldEncounterRoutes: createWorldEncounterRoutes(),
    temptationHistory: [],
    rivalHistory: [],
    breakup: null,
    memories: [],
    initiatedMessages: [],
    conversationHistory: [],
    conversationSafety: {hostileCount:0,lastHostileDay:null},
    yujinSecretRoute: createYujinSecretRouteState(),
    storyHistory: [],
    storyFlags: {},
    futureScore: 0,
    pendingStoryId: null,
    cgCollection: [],
    videoCollection: [],
    storyDirector:createStoryDirectorState(0),
    hiddenRoute:createHiddenRouteState(random),
    investment: createInvestmentState(),
    lottery: createLotteryState(),
    revealed: 0,
    revealedTraits: [],
    observations: {},
    affection: initialAffection,
    trust: initialTrust,
    excitement: 500,
    attachment: 450,
    conflict: 0,
    relationshipStress: 10,
    money: jobStart.money,
    health: jobStart.health,
    energy: jobStart.energy,
    stress: initialStress,
    fatigue: initialFatigue,
    charm: jobStart.charm,
    fashion: jobStart.fashion,
    confidence: jobStart.confidence,
    work: jobStart.work,
    social: jobStart.social,
    logs: [],
    choices: [],
    actionHistory: [],
    eventHistory: [],
    microEventHistory: [],
    situationEventStates: {},
    futureEventWeights: {},
    eventRuntime: {activeEvent:null,scene:null,dialogueIndex:0,state:"IDLE",inputLock:{locked:false,owner:null,reason:null,lockedFor:0},eventQueue:[],microQueue:[],pendingEvent:null,triggerReason:[],assetStatus:"IDLE",checkpoint:null,lastError:null,logs:[]},
    settings: {theaterMode:true,guideEnabled:true,guideCompleted:{main:false,atlas:false,district:false,room:false,map:false}},
    ended: false,
    nightState: null,
    dayStartSnapshot: null,
    updatedAt: new Date().toISOString()
  };
  state.dayStartSnapshot = createDaySnapshot(state);
  state.storyDirector=createStoryDirectorState(state.appearanceSeed);
  return state;
}

export function applyEffects(state, effects) {
  for (const [key, rawValue] of Object.entries(effects)) {
    const value = Number(rawValue) || 0;
    if (key === "money") state.money = Math.max(0, state.money + value);
    else if (["affection", "trust"].includes(key)) state[key] = clamp(state[key] + value, 0, 1000);
    else if (key in state) state[key] = clamp(state[key] + value);
  }
  state.updatedAt = new Date().toISOString();
  return state;
}

export function advanceTime(state) {
  if (state.phase < PHASE_COUNT - 1) state.phase += 1;
  else {
    state.phase = 0;
    state.day += 1;
    state.energy = clamp(state.energy + 18);
    state.stress = clamp(state.stress - 5);
    state.fatigue = clamp(state.fatigue - 18);
  }
  if (state.day > MAX_DAY) state.ended = true;
  state.selected = null;
  state.updatedAt = new Date().toISOString();
  return state;
}

export function validateState(value) {
  if (!value || typeof value !== "object") return false;
  if (value.version !== 1 || !Number.isInteger(value.day) || !Number.isInteger(value.phase)) return false;
  if (value.gameMode !== normalizeGameMode(value.gameMode) || !validateScenarioState(value.gameMode, value.scenario)) return false;
  if (value.day < 1 || value.day > MAX_DAY + 1 || value.phase < 0 || value.phase >= PHASE_COUNT) return false;
  if (!validateGirlfriend(value.partner)) return false;
  if (!validatePlayerProfile(value.player)) return false;
  if (!validateWorldState(value.world)) return false;
  if (!Number.isInteger(value.appearanceSeed) || !validateCharacterAppearance(value.characterAppearance) || !Array.isArray(value.equippedVisualLayers) || typeof value.currentExpression !== "string" || typeof value.currentPose !== "string" || typeof value.currentOutfit !== "string" || typeof value.currentAccessory !== "string" || typeof value.currentBackground !== "string") return false;
  if (!validateJob(value.job) || !Number.isFinite(value.jobLevel) || !Number.isFinite(value.jobProgress) || !Array.isArray(value.economyLedger) || !validateAdvancedEconomyState(value.finance) || !Array.isArray(value.inventory) || !value.equipment || !value.girlfriendEquipment || !validateNpcs(value.npcs) || !Array.isArray(value.npcHistory) || !Array.isArray(value.temptationHistory) || !Array.isArray(value.rivalHistory) || !validateMemories(value.memories) || !Array.isArray(value.initiatedMessages) || !Array.isArray(value.conversationHistory) || !validateInvestmentState(value.investment) || !validateLotteryState(value.lottery)) return false;
  if (!Array.isArray(value.logs) || !Array.isArray(value.choices) || !value.situationEventStates || !value.futureEventWeights || !Array.isArray(value.microEventHistory) || !value.eventRuntime || !value.settings) return false;
  if (!Array.isArray(value.storyHistory) || !value.storyFlags || typeof value.storyFlags !== "object" || !Number.isFinite(value.futureScore) || (value.pendingStoryId !== null && typeof value.pendingStoryId !== "string") || !Array.isArray(value.cgCollection) || !Array.isArray(value.videoCollection)) return false;
  if (!validateHiddenRouteState(value.hiddenRoute)) return false;
  if (!validateYujinSecretRouteState(value.yujinSecretRoute)) return false;
  if (!Array.isArray(value.worldEncounterHistory) || !validateWorldEncounterRoutes(value.worldEncounterRoutes)) return false;
  if (!validateStoryDirectorState(value.storyDirector)) return false;
  if (!value.dayStartSnapshot || typeof value.dayStartSnapshot !== "object" || (value.nightState !== null && typeof value.nightState !== "object")) return false;
  return ["affection", "trust", "excitement", "attachment", "conflict", "relationshipStress", "money", "health", "energy", "stress", "fatigue", "charm", "fashion", "confidence", "work", "social"].every(key => Number.isFinite(value[key]));
}

export function determineEnding(state) {
  const ending = selectEnding(state);
  return [ending.title,ending.description];
}
