import { applyEffects } from "./game-core.mjs";
import { appendTransaction } from "./economy-manager.mjs";
import { EVENT_DEFINITIONS } from "./events-data.mjs";
import { activateSituationEvent } from "./situation-event-manager.mjs";
import { SITUATION_EVENTS } from "./situation-events-data.mjs";
import { GAME_MODES, isContentAvailableForMode } from "./scenario-state.mjs";

export const MAX_EVENTS_PER_DAY = 1;
export const CATEGORY_COOLDOWN_DAYS = 3;
const PHASE_TIME = ["morning","day","evening","night"];
const UNAVAILABLE_NPC_STATES = new Set(["away","missing","resigned","broken-up","unavailable"]);

const OPERATORS = {
  ">=": (left, right) => left >= right,
  "<=": (left, right) => left <= right,
  ">": (left, right) => left > right,
  "<": (left, right) => left < right,
  "==": (left, right) => left === right
};

export function meetsConditions(state, conditions = []) {
  return conditions.every(condition => {
    if (condition.recentTag) {
      const minimumDay = state.day - condition.withinDays;
      const count = (state.actionHistory ?? []).filter(entry => entry.tag === condition.recentTag && entry.day >= minimumDay).length;
      return count >= (condition.minCount ?? 1);
    }
    const { stat, operator, value } = condition;
    const compare = OPERATORS[operator];
    const actual = stat.split(".").reduce((current, key) => current?.[key], state);
    return Boolean(compare) && compare(actual, value);
  });
}

export function getEventProbability(state, event) {
  let probability = event.probability;
  for (const modifier of event.probabilityModifiers ?? []) {
    if (!meetsConditions(state, modifier.conditions)) continue;
    if (Number.isFinite(modifier.multiply)) probability *= modifier.multiply;
    if (Number.isFinite(modifier.add)) probability += modifier.add;
  }
  const directorMultiplier=state.storyDirector?.nextDayPlan?.eventWeights?.[event.id]?.multiplier;
  if(Number.isFinite(directorMultiplier))probability*=directorMultiplier;
  return Math.max(0, Math.min(1, probability));
}

function relationshipState(state){if(state.affection<350||state.trust<260||state.relationshipStress>=78)return "BREAKUP_RISK";if(state.conflict>=65||state.relationshipStress>=62)return "CONFLICT";if(state.affection>=720&&state.trust<430)return "SUSPICIOUS";if(state.affection>=760&&state.excitement>=700)return "PASSIONATE";if(state.affection>=680&&state.trust>=650&&state.day<=8)return "HONEYMOON";if(state.affection>=600&&state.trust>=580&&state.conflict<35)return "STABLE";return "DISTANT";}

export function evaluateEventEligibility(state,event){
  const reasons=[];const blocks=[];const history=state.eventHistory??[];const phaseTime=PHASE_TIME[state.phase]??"day";
  if(!isContentAvailableForMode(state,event))blocks.push("GAME_MODE");
  if(state.gameMode==="free-romance"&&event.trigger==="location-enter")blocks.push("LOCATION_ENTER_ONLY");
  if(state.gameMode==="free-romance"&&event.trigger==="random-before-evening"&&state.phase>=2)blocks.push("BEFORE_EVENING_ONLY");
  if(event.heroineIds?.length&&!event.heroineIds.includes(state.partner?.heroineId))blocks.push("HEROINE_ROUTE");
  if(event.excludedHeroineIds?.includes(state.partner?.heroineId))blocks.push("HEROINE_EXCLUDED");
  if(state.partner?.heroineId==="yuna"&&!event.studentSafe)blocks.push("STUDENT_SAFETY");
  const triggered=history.filter(record=>record.id===event.id);const last=triggered.at(-1);const cooldownRemaining=last?Math.max(0,event.cooldown-(state.day-last.day)):0;
  const alreadyOccurred=triggered.length>0||Boolean(state.situationEventStates?.[event.id])||Boolean(event.storyFlag&&state.storyFlags?.[event.storyFlag])||Boolean(state.storyFlags?.[`${event.id}:TRIGGERED`]);
  if(event.kind==="micro")blocks.push("MICRO_SLOT");
  if(event.dayRange&&(state.day<event.dayRange[0]||state.day>event.dayRange[1]))blocks.push("DAY_RANGE");else if(event.dayRange)reasons.push(`DAY ${state.day} in ${event.dayRange.join("-")}`);
  if(event.timeOfDay&&event.timeOfDay!==phaseTime)blocks.push(`TIME_${phaseTime.toUpperCase()}`);else if(event.timeOfDay)reasons.push(`시간대 ${phaseTime}`);
  if(state.gameMode==="free-romance"&&alreadyOccurred)blocks.push("FREE_MODE_ALREADY_OCCURRED");
  else if(event.repeatable===false&&alreadyOccurred)blocks.push("NON_REPEATABLE_EVENT");
  else if(event.maxTriggerCount&&triggered.length>=event.maxTriggerCount)blocks.push("MAX_TRIGGER_COUNT");
  if(cooldownRemaining)blocks.push(`COOLDOWN_${cooldownRemaining}`);
  if(event.forbiddenFlags?.some(flag=>state.storyFlags?.[flag]))blocks.push("FORBIDDEN_FLAG");
  const missingEvents=(event.requiredEvents??[]).filter(id=>!state.storyFlags?.[`${id}:COMPLETED`]);if(missingEvents.length)blocks.push(`CHAIN_REQUIRED:${missingEvents.join(",")}`);else if(event.requiredEvents?.length)reasons.push(`선행 ${event.requiredEvents.length}개 완료`);
  const missingMemories=(event.requiredMemories??[]).filter(tag=>!(state.memories??[]).some(memory=>memory.tags?.includes(tag)));if(missingMemories.length)blocks.push("REQUIRED_MEMORY");
  const invalidNpcs=(event.npcRequirements??[]).filter(id=>{const npc=(state.npcs??[]).find(item=>item.id===id);return !npc||!npc.active||UNAVAILABLE_NPC_STATES.has(npc.storyState);});if(invalidNpcs.length)blocks.push(`NPC_UNAVAILABLE:${invalidNpcs.join(",")}`);else if(event.npcRequirements?.length)reasons.push(`NPC ${event.npcRequirements.join(",")} 활성`);
  if(Number.isFinite(event.minimumNpcInterest)){const npc=(state.npcs??[]).find(item=>event.npcRequirements?.includes(item.id));if(!npc||npc.interestInPlayer<event.minimumNpcInterest)blocks.push("NPC_INTEREST_LOW");else reasons.push(`NPC 관심 ${npc.interestInPlayer}`);}
  const relation=relationshipState(state);if(event.relationshipStates?.length&&!event.relationshipStates.includes(relation))blocks.push(`RELATIONSHIP_${relation}`);else if(event.relationshipStates?.length)reasons.push(`관계 ${relation}`);
  if(!meetsConditions(state,event.conditions))blocks.push("STAT_CONDITIONS");else reasons.push("수치 조건 충족");
  const recentCategory=history.find(record=>record.category===event.category&&state.day-record.day<CATEGORY_COOLDOWN_DAYS);if(recentCategory)blocks.push("CATEGORY_COOLDOWN");
  const recentHigh=history.find(record=>record.tensionLevel==="high"&&state.day-record.day<=2);if(event.tensionLevel==="high"&&recentHigh)blocks.push("TENSION_RECOVERY");
  const director=state.storyDirector?.nextDayPlan?.eventWeights?.[event.id];if(director?.multiplier)reasons.push(`Director ×${director.multiplier}`);
  return {eligible:blocks.length===0,reasons,blocks,cooldownRemaining,relationshipState:relation,phaseTime,finalWeight:Math.round(getEventProbability(state,event)*100)};
}

export function getEligibleEvents(state, definitions = EVENT_DEFINITIONS) {
  const history = state.eventHistory ?? [];
  return definitions.filter(event => evaluateEventEligibility(state,event).eligible).sort((a,b)=>b.priority-a.priority);
}

export function getEventDiagnostics(state, definitions = EVENT_DEFINITIONS) {
  const history = state.eventHistory ?? [];
  const eventsToday = history.filter(entry => entry.day === state.day).length;
  const dailyLimitReached = eventsToday >= MAX_EVENTS_PER_DAY;
  return definitions.map(event => {
    const evaluation=evaluateEventEligibility(state,event);const conditionsMet=meetsConditions(state,event.conditions);
    const cooldownRemaining=evaluation.cooldownRemaining;
    const probability=getEventProbability(state,event);
    return {
      id: event.id,
      title: event.title,
      kind:event.kind??"random",
      conditionsMet,
      cooldownRemaining,
      probability,
      effectiveProbability:evaluation.eligible&&!dailyLimitReached?probability:0,
      priority: event.priority,
      dailyLimitReached,
      eligible: evaluation.eligible && !dailyLimitReached,
      triggerReasons:evaluation.reasons,blockedReasons:evaluation.blocks,finalWeight:evaluation.finalWeight
    };
  }).sort((a, b) => b.priority - a.priority);
}

export function rollEvent(state, random = null, definitions = EVENT_DEFINITIONS) {
  const eventsToday = (state.eventHistory ?? []).filter(entry => entry.day === state.day).length;
  if (eventsToday >= MAX_EVENTS_PER_DAY) return null;
  const eligible=getEligibleEvents(state,definitions);const passing=eligible.filter(event=>(typeof random==="function"?random():getDirectorRoll(state,event.id))<=getEventProbability(state,event));if(!passing.length)return null;
  const recentNpcIds=new Set((state.eventHistory??[]).slice(-4).flatMap(record=>record.npcIds??[]));const ranked=passing.map(event=>{const diversity=(event.npcRequirements??[]).some(id=>recentNpcIds.has(id)) ? .72 : 1;return {event,score:(event.priority??50)*(event.baseWeight??50)*diversity};}).sort((a,b)=>b.score-a.score).slice(0,5);const chooser=typeof random==="function"?random():getDirectorRoll(state,`choice-${state.day}`);return triggerEvent(state,ranked[Math.min(ranked.length-1,Math.floor(chooser*ranked.length))].event);
}

export function getRuntimeEventDefinitions(state) {
  return state?.gameMode === GAME_MODES.FREE_ROMANCE ? SITUATION_EVENTS : EVENT_DEFINITIONS;
}

export function rollRuntimeEvent(state, random = null) {
  return rollEvent(state,random,getRuntimeEventDefinitions(state));
}

function getDirectorRoll(state,eventId){const seed=state.storyDirector?.nextDayPlan?.seed;if(!Number.isInteger(seed))return Math.random();let hash=seed>>>0;for(const char of `${state.day}:${eventId}`){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0)/4294967296;}

export function triggerEvent(state, event) {
  const evaluation=evaluateEventEligibility(state,event);
  applyEffects(state, event.effects);
  if (event.effects.money) appendTransaction(state, { category:"event", label:event.title, amount:Math.round(event.effects.money) });
  state.eventHistory ??= [];
  const record = { id: event.id, day: state.day, phase: state.phase, title: event.title, message: event.message,category:event.category??"random",tensionLevel:event.tensionLevel??"low",npcIds:[...(event.npcRequirements??[])],triggerReason:evaluation.reasons,finalWeight:evaluation.finalWeight,status:event.scenes?.length?"ACTIVE":"COMPLETED" };
  state.eventHistory.push(record);
  if(event.scenes?.length)activateSituationEvent(state,event);
  return { ...event, record };
}
