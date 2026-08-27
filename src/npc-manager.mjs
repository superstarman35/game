import { NPC_ACTION_RULES, NPC_ARCHETYPES } from "./npcs-data.mjs?v=2";
import { recordMemory } from "./memory-manager.mjs";

const randomInt = (random, min, max) => min + Math.floor(random() * (max - min + 1));
const ACTIVE_QUOTAS = { office:5, friend:3, rival:2, life:4 };
export const FIXED_ACQUAINTANCE_NPC_IDS = Object.freeze(["male-rival","gym-trainer","drinking-friend"]);
const CORE_IDS = new Set(["female-coworker","team-lead","office-best-male","office-partner","best-friend","player-ex",...FIXED_ACQUAINTANCE_NPC_IDS]);

function selectActiveIds(random) {
  const selected=new Set(CORE_IDS);
  for (const [category,quota] of Object.entries(ACTIVE_QUOTAS)) {
    const pool=NPC_ARCHETYPES.filter(character=>character.category===category && !selected.has(character.id));
    for (let index=pool.length-1;index>0;index--) { const swap=Math.floor(random()*(index+1)); [pool[index],pool[swap]]=[pool[swap],pool[index]]; }
    const already=[...selected].filter(id=>NPC_ARCHETYPES.find(character=>character.id===id)?.category===category).length;
    pool.slice(0,Math.max(0,quota-already)).forEach(character=>selected.add(character.id));
  }
  return selected;
}

export function generateNpcs(random = Math.random) {
  const activeIds=selectActiveIds(random);
  return NPC_ARCHETYPES.map((archetype,index) => {
    const attraction=Math.max(0,Math.min(100,archetype.baseAttraction+randomInt(random,-10,10)));
    return {
      ...structuredClone(archetype), instanceId:`npc-${archetype.id}`, active:activeIds.has(archetype.id), storyState:"available",
      affection:Math.max(0,Math.min(100,archetype.affinityToPlayer+randomInt(random,-5,8))),
      heroineAffinity:Math.max(0,Math.min(100,archetype.affinityToHeroine+randomInt(random,-5,8))), trust:Math.max(0,Math.min(100,archetype.baseTrust+randomInt(random,-5,10))), attraction,
      interestInPlayer:archetype.interestTarget === "player" ? attraction : randomInt(random,0,18),
      interestInGirlfriend:archetype.interestTarget === "girlfriend" ? attraction : randomInt(random,0,18)
    };
  });
}

export function migrateNpcRoster(npcs, random = Math.random) {
  const generated=generateNpcs(random);
  if (!Array.isArray(npcs) || !npcs.length) return generated;
  const byId=new Map(npcs.map(character=>[character.id,character]));
  return generated.map(character=>{
    const previous=byId.get(character.id);
    if (!previous) return character;
    return {
      ...character,
      ...previous,
      id:character.id,
      name:character.name,
      age:character.age,
      gender:character.gender,
      job:character.job,
      role:character.role,
      category:character.category,
      relationshipType:character.relationshipType,
      interestTarget:character.interestTarget,
      personality:character.personality,
      storyTags:[...character.storyTags],
      links:[...character.links],
      instanceId:previous.instanceId || character.instanceId,
      active:["player-ex","office-best-male","office-partner"].includes(character.id)||FIXED_ACQUAINTANCE_NPC_IDS.includes(character.id)&&previous.storyState!=="haeun-boundary-closed" ? true : typeof previous.active === "boolean" ? previous.active : true,
      storyState:previous.storyState ?? "available"
    };
  });
}

export function validateNpcs(npcs) {
  if (!Array.isArray(npcs) || npcs.length !== NPC_ARCHETYPES.length) return false;
  const ids=new Set();
  return npcs.every(character=>typeof character.instanceId === "string" && !ids.has(character.instanceId) && ids.add(character.instanceId) && typeof character.name === "string" && typeof character.role === "string" && typeof character.active === "boolean" && typeof character.storyState === "string" && ["affection","trust","attraction","interestInPlayer","interestInGirlfriend"].every(key=>Number.isFinite(character[key]) && character[key]>=0 && character[key]<=100));
}

export function applyNpcActionEffects(state, action) {
  const rules=NPC_ACTION_RULES.filter(entry=>entry.actionId===action.id);
  if (!rules.length) return null;
  state.npcHistory ??=[];
  const results=[],displayEffects={};
  for (const rule of rules) {
    const character=(state.npcs ?? []).find(entry=>entry.id===rule.npcId && entry.active !== false);
    if (!character) continue;
    const applied={};
    for (const [key,amount] of Object.entries(rule.effects)) {
      const before=character[key] ?? 0;
      character[key]=Math.max(0,Math.min(100,before+amount));
      applied[key]=character[key]-before;
    }
    const record={ day:state.day,phase:state.phase,actionId:action.id,npcId:character.instanceId,effects:applied };
    state.npcHistory.push(record);
    recordMemory(state,{type:"npc",summary:`${character.name} · ${action.title}`,importance:2,tags:["NPC",character.id,action.tag]});
    if(rule.displayEffectKey)displayEffects[rule.displayEffectKey]=(displayEffects[rule.displayEffectKey]??0)+(applied.affection??0);
    results.push({npc:character,record});
  }
  if(!results.length)return null;
  return {npc:results[0].npc,record:results[0].record,npcs:results.map(result=>result.npc),records:results.map(result=>result.record),displayEffects};
}

export function getNpcRelationshipStatus(character) {
  if (character.active === false) return {label:"이번 회차 미등장",tone:"neutral"};
  if (isYujinSecretGirlfriend(character)) return {label:"비밀여자친구",tone:"secret"};
  if (["coworker","admirer","ex"].includes(character.relationshipType) && character.interestInPlayer >= 75) return {label:"비밀 만남 직전",tone:"danger"};
  if (["coworker","admirer","ex"].includes(character.relationshipType) && character.interestInPlayer >= 55) return {label:"개인적인 관심",tone:"interest"};
  if (["rival","admirer","ex"].includes(character.relationshipType) && character.interestInGirlfriend >= 75) return {label:"적극적인 접근",tone:"danger"};
  if (["rival","admirer","ex"].includes(character.relationshipType) && character.interestInGirlfriend >= 55) return {label:"경계할 관계",tone:"warning"};
  if (character.trust >= 60) return {label:"믿을 수 있는 사이",tone:"safe"};
  return {label:"아직 어색한 사이",tone:"neutral"};
}

export function isYujinSecretGirlfriend(character) {
  if (!character || character.id !== "female-coworker" || character.active === false) return false;
  const relationshipIndex=Math.round((Number(character.affection??0)+Number(character.trust??0))/2);
  return relationshipIndex>=100 && Number(character.affection)>=100 && Number(character.trust)>=100 && Number(character.interestInPlayer)>=100;
}
