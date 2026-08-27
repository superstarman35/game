import { applyEffects } from "./game-core.mjs";
import { recordMemory } from "./memory-manager.mjs";
import { SITUATION_EVENTS } from "./situation-events-data.mjs";
import { combineChoiceEffects, getMbtiChoiceAdjustment } from "./event-choice-modifier.mjs";
import { normalizeSubwaySituationEffects } from "./subway-event-effects.mjs?v=1";

export function getSituationEvent(id){return SITUATION_EVENTS.find(event=>event.id===id)??null;}

export function hasSituationEventOccurred(state,event) {
  return Boolean(
    state.situationEventStates?.[event.id]||
    state.storyFlags?.[event.storyFlag]||
    state.storyFlags?.[`${event.id}:TRIGGERED`]||
    (state.eventHistory??[]).some(entry=>entry.id===event.id)
  );
}

export function getSituationEventState(state,event) {
  const saved=state.situationEventStates?.[event.id];
  if(saved?.status)return saved.status;
  if(state.storyFlags?.[event.storyFlag])return "COMPLETED";
  if(hasSituationEventOccurred(state,event))return "COMPLETED";
  if(state.day<event.dayRange[0]||state.day>event.dayRange[1])return "LOCKED";
  if(event.forbiddenFlags.some(flag=>state.storyFlags?.[flag]))return "LOCKED";
  if(event.npcRequirements.length&&!event.npcRequirements.every(id=>state.npcs?.some(npc=>npc.id===id&&npc.active)))return "LOCKED";
  return "AVAILABLE";
}

export function activateSituationEvent(state,event) {
  state.storyFlags??={};
  state.storyFlags[`${event.id}:TRIGGERED`]=true;
  state.situationEventStates??={};
  state.situationEventStates[event.id]={status:"ACTIVE",startedDay:state.day,sceneIndex:0,choiceId:null};
  return state.situationEventStates[event.id];
}

export function resolveSituationEventChoice(state,event,choiceId) {
  const choice=event.choices.find(item=>item.id===choiceId);
  if(!choice)return null;
  const mbtiAdjustment=getMbtiChoiceAdjustment(state,choice);
  const effects=normalizeSubwaySituationEffects(event,combineChoiceEffects(choice.effects,mbtiAdjustment.effects));
  applyEffects(state,effects);
  for(const [npcId,npcEffects] of Object.entries(choice.npcEffects??{})){
    const npc=(state.npcs??[]).find(item=>item.id===npcId);if(!npc)continue;
    for(const [key,value] of Object.entries(npcEffects))if(Number.isFinite(value))npc[key]=Math.max(0,Math.min(1000,(npc[key]??0)+value));
  }
  state.storyFlags??={};state.storyFlags[event.storyFlag]=true;state.storyFlags[choice.flag]=true;
  state.situationEventStates??={};state.situationEventStates[event.id]={status:"COMPLETED",startedDay:state.situationEventStates[event.id]?.startedDay??state.day,completedDay:state.day,sceneIndex:event.scenes.length-1,choiceId};
  state.futureEventWeights??={};
  for(const [key,value] of Object.entries({...event.futureEventWeights,...choice.futureEventWeights}))state.futureEventWeights[key]=(state.futureEventWeights[key]??1)*value;
  const memory=recordMemory(state,{type:"situation-event",summary:choice.memory,importance:event.cgCandidate?5:4,tags:[event.category,event.id,choiceId]});
  const record=[...(state.eventHistory??[])].reverse().find(entry=>entry.id===event.id&&entry.day===state.day);if(record){record.choiceId=choiceId;record.status="COMPLETED";record.memoryId=memory.id;}
  return {event,choice,effects,mbtiAdjustment,memory,status:"COMPLETED"};
}

function matchesLocation(event,location){return (event.locationIds??[]).includes(location.id)||(event.locationCategories??[]).includes(location.category);}
function locationEventAvailable(state,event){
  if(state.gameMode!=="free-romance"||event.trigger!=="location-enter"||getSituationEventState(state,event)!=="AVAILABLE")return false;
  if(event.heroineIds?.length&&!event.heroineIds.includes(state.partner?.heroineId))return false;
  if(event.excludedHeroineIds?.includes(state.partner?.heroineId))return false;
  return (event.conditions??[]).every(condition=>{const actual=condition.stat.split(".").reduce((value,key)=>value?.[key],state);return condition.operator===">="?actual>=condition.value:condition.operator==="<="?actual<=condition.value:condition.operator==="=="?actual===condition.value:true;});
}

export function rollLocationSituationEvent(state,location,random=Math.random,events=SITUATION_EVENTS){
  const eventsToday=(state.eventHistory??[]).filter(entry=>entry.day===state.day).length;if(eventsToday>=1)return null;
  const candidates=events.filter(event=>matchesLocation(event,location)&&locationEventAvailable(state,event)).sort((a,b)=>(b.priority??0)-(a.priority??0));
  const event=candidates.find(candidate=>random()<=candidate.probability);if(!event)return null;
  applyEffects(state,event.effects);activateSituationEvent(state,event);state.eventHistory??=[];
  const record={id:event.id,day:state.day,phase:state.phase,title:event.title,message:event.message,category:event.category,tensionLevel:event.tensionLevel,npcIds:[...(event.npcRequirements??[])],triggerReason:[`장소 입장: ${location.id}`],finalWeight:Math.round(event.probability*100),status:"ACTIVE"};
  state.eventHistory.push(record);return {...event,record,triggerLocationId:location.id};
}

export function validateSituationEventState(state) {
  return !state.situationEventStates||Object.entries(state.situationEventStates).every(([id,value])=>getSituationEvent(id)&&value&&typeof value.status==="string"&&Number.isInteger(value.sceneIndex));
}
