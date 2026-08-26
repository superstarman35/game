import { EVENT_DEFINITIONS } from "./events-data.mjs";
import { STORY_SCENES } from "./story-data.mjs";
import { SITUATION_EVENTS } from "./situation-events-data.mjs";
import { GAME_MODES, isContentAvailableForMode } from "./scenario-state.mjs";

const clamp = (value,min=0,max=100) => Math.max(min,Math.min(max,Number(value)||0));
const count = (items,predicate) => (items??[]).filter(predicate).length;
const recent = (items,day,days,predicate=()=>true) => (items??[]).filter(item=>day-(item.day??day)<=days&&predicate(item));

export function createStoryDirectorState(seed=1) {
  return {version:1,baseSeed:seed>>>0,daySeeds:{},analyses:[],threads:{},dominantThread:"MAIN_RELATIONSHIP",dominantStatus:"CANDIDATE",dominantSinceDay:1,unresolvedEvents:[],foreshadowing:{rival:0,temptation:0,lie:0},nextDayPlan:null};
}

export function migrateStoryDirectorState(state) {
  state.storyDirector ??= createStoryDirectorState(state.appearanceSeed??1);
  const director=state.storyDirector;
  director.version=1;director.baseSeed??=(state.appearanceSeed??1)>>>0;director.daySeeds??={};director.analyses??=[];director.threads??={};director.dominantThread??="MAIN_RELATIONSHIP";director.dominantStatus??="CANDIDATE";director.dominantSinceDay??=1;director.unresolvedEvents??=[];director.foreshadowing??={rival:0,temptation:0,lie:0};director.nextDayPlan??=null;
  return director;
}

export function getDaySeed(state,day) {
  const director=migrateStoryDirectorState(state);
  const key=String(day);
  if(!Number.isInteger(director.daySeeds[key])) director.daySeeds[key]=hash32(`${director.baseSeed}:${day}:${(state.actionHistory??[]).length}:${(state.storyHistory??[]).length}`);
  return director.daySeeds[key];
}

function hash32(text) { let hash=2166136261;for(const char of text){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return hash>>>0; }

export function getRecencyWeight(currentDay,memory) {
  if((memory.importance??1)>=4)return Math.max(.82,currentDay-(memory.day??currentDay)<=3?1:.82);
  const age=Math.max(0,currentDay-(memory.day??currentDay));
  return age<=3?1:age<=7?.65:.3;
}

export function analyzeRelationshipState(state) {
  const affection=state.affection,trust=state.trust,conflict=state.conflict,stress=state.relationshipStress,excitement=state.excitement>100?state.excitement/10:state.excitement,attachment=state.attachment>100?state.attachment/10:state.attachment;
  if(affection<350||trust<260||stress>=78)return "BREAKUP_RISK";
  if(conflict>=65||stress>=62)return "CONFLICT";
  if(affection>=720&&trust<430)return "SUSPICIOUS";
  if(affection>=760&&excitement>=70)return "PASSIONATE";
  if(attachment>=76&&state.partner.personality.independence<40)return "DEPENDENT";
  if(recent(state.storyHistory,state.day,4,item=>["confess","rebuild","honest"].includes(item.choiceId)).length)return "RECOVERING";
  if(excitement<36&&affection>=520)return "BORED";
  if(affection>=680&&trust>=650&&state.day<=8)return "HONEYMOON";
  if(affection>=600&&trust>=580&&conflict<35)return "STABLE";
  return "DISTANT";
}

export function analyzePlayerBehavior(state,completedDay=state.day) {
  const weighted={ROMANTIC:0,WORKAHOLIC:0,MATERIALISTIC:0,LOYAL:0,FLIRTATIOUS:0,FITNESS:0,INVESTOR:0,SOCIAL:0,HOME_BODY:0};
  for(const action of state.actionHistory??[]){const w=getRecencyWeight(completedDay,{day:action.day,importance:1});const id=String(action.actionId);if(["데이트","연락"].includes(action.tag))weighted.ROMANTIC+=w;if(action.tag==="성공"||/work|overtime|office|야근/.test(id))weighted.WORKAHOLIC+=w;if(action.tag==="쇼핑")weighted.MATERIALISTIC+=w;if(action.tag==="유혹")weighted.FLIRTATIOUS+=w;if(/exercise|workout|운동/.test(id))weighted.FITNESS+=w;if(action.tag==="투자"||/stock|invest/.test(id))weighted.INVESTOR+=w;if(action.tag==="사교")weighted.SOCIAL+=w;if(/sleep|rest|home/.test(id))weighted.HOME_BODY+=w;}
  weighted.LOYAL+=count(state.temptationHistory,item=>item.choiceId==="reject")*2+count(state.storyHistory,item=>["truth","honest","trust"].includes(item.choiceId));
  weighted.FLIRTATIOUS+=count(state.temptationHistory,item=>item.choiceId==="secret")*3;
  weighted.SOCIAL+=(state.npcHistory??[]).length*.6;weighted.INVESTOR+=(state.investment?.transactions??[]).length*.35;
  return Object.fromEntries(Object.entries(weighted).map(([key,value])=>[key,Math.round(clamp(value*11))]));
}

function computeThreads(state,behavior,relationshipState) {
  const coworker=Math.max(0,...(state.npcs??[]).filter(npc=>npc.relationshipType==="coworker").map(npc=>npc.interestInPlayer??0));
  const rival=Math.max(0,...(state.npcs??[]).filter(npc=>npc.relationshipType==="rival").map(npc=>npc.interestInGirlfriend??0));
  return {
    MAIN_RELATIONSHIP:Math.round(clamp(35+state.relationshipStress*.55+state.conflict*.45+(relationshipState==="STABLE"?20:0))),
    WORK:Math.round(clamp(behavior.WORKAHOLIC*.7+state.stress*.25)),
    MONEY:Math.round(clamp((state.money<250000?65:25)+behavior.MATERIALISTIC*.35)),
    HEALTH:Math.round(clamp((100-state.health)*.65+state.fatigue*.45)),
    RIVAL:Math.round(clamp(rival*.65+state.relationshipStress*.25)),
    TEMPTATION:Math.round(clamp(coworker*.55+behavior.FLIRTATIOUS*.55)),
    FRIENDSHIP:Math.round(clamp(behavior.SOCIAL*.8)),
    FAMILY:Math.round(clamp(state.day>20?25:8)),
    INVESTMENT:Math.round(clamp(behavior.INVESTOR*.8+(state.investment?.realizedProfit>0?20:0))),
    SELF_GROWTH:Math.round(clamp((behavior.FITNESS+state.confidence+state.work)/3))
  };
}

function updateUnresolved(state,director,completedDay) {
  const open=new Map((director.unresolvedEvents??[]).filter(item=>item.status!=="resolved").map(item=>[item.id,item]));
  for(const record of state.storyHistory??[]){if(["hide","lie","double-down","suspect"].includes(record.choiceId)){const id=`LIE_${record.sceneId}`;if(!open.has(id))open.set(id,{id,type:"LIE",originDay:record.day,lastTouchedDay:record.day,status:"open",stage:1});}if(["confess","truth"].includes(record.choiceId))for(const item of open.values())if(item.type==="LIE")item.status="resolved";}
  for(const record of state.temptationHistory??[])if(record.choiceId==="secret"){const id=`SECRET_${record.npcId}_${record.day}`;if(!open.has(id))open.set(id,{id,type:"SECRET_MEETING",originDay:record.day,lastTouchedDay:record.day,status:"open",stage:1});}
  for(const item of open.values())if(item.status!=="resolved")item.stage=Math.min(4,1+Math.floor((completedDay-item.originDay)/4));
  director.unresolvedEvents=[...open.values()].slice(-20);
}

function calculateTension(state,relationshipState,previous) {
  let value=state.conflict*.45+state.relationshipStress*.38+(100-Math.min(100,state.trust/10))*.2;
  if(["CONFLICT","SUSPICIOUS"].includes(relationshipState))value+=15;if(relationshipState==="BREAKUP_RISK")value+=25;
  if((previous?.narrativeTension??0)>=78)value-=18;
  return Math.round(clamp(value));
}

function eventCandidate(state,event,threads,tension,completedDay) {
  let multiplier=1;const modifiers=[];
  const add=(label,value)=>{multiplier+=value;modifiers.push({label,value});};
  if(event.id.includes("work")){add("WORK thread",threads.WORK/180);if(state.stress>=70)add("high stress",.35);}
  if(event.id.includes("suspicion")){if(state.trust<500)add("low trust",.45);add("unresolved secrets",(state.storyDirector.unresolvedEvents??[]).length*.12);add("jealousy",state.partner.personality.jealousy/260);}
  if(event.id.includes("rival"))add("rival foreshadowing",(state.storyDirector.foreshadowing.rival??0)*.16);
  if(event.id.includes("crisis")){add("narrative tension",tension/180);if(tension>82)add("climax guard",-.35);}
  if(event.id.includes("date")){add("romantic profile",(state.storyDirector.latestBehavior?.ROMANTIC??0)/250);if(tension>65)add("recovery opportunity",.25);}
  if(event.id.includes("expense")||event.id.includes("windfall"))add("money thread",threads.MONEY/220);
  const conditionsMet=(event.conditions??[]).every(condition=>meetsDirectorCondition(state,condition));if(!conditionsMet)add("conditions unmet",-.95);
  const previous=[...(state.eventHistory??[])].reverse().find(item=>(item.id??item.eventId)===event.id);const cooldownRemaining=previous?Math.max(0,event.cooldown-(completedDay-previous.day)):0;if(cooldownRemaining)add("cooldown",-Math.min(.95,cooldownRemaining/event.cooldown));
  multiplier=clamp(multiplier,.05,2.5);
  return {id:event.id,title:event.title,baseProbability:event.probability,multiplier:Number(multiplier.toFixed(3)),finalProbability:conditionsMet&&cooldownRemaining===0?Number(clamp(event.probability*multiplier,0,.95).toFixed(3)):0,modifiers,cooldownRemaining,conditionsMet,blocked:cooldownRemaining>0||!conditionsMet,blockedReason:cooldownRemaining>0?"COOLDOWN":!conditionsMet?"CONDITIONS":""};
}

function meetsDirectorCondition(state,condition){if(condition.recentTag)return recent(state.actionHistory,state.day,condition.withinDays,item=>item.tag===condition.recentTag).length>=(condition.minCount??1);const actual=condition.stat.split(".").reduce((value,key)=>value?.[key],state);return ({">=":actual>=condition.value,"<=":actual<=condition.value,">":actual>condition.value,"<":actual<condition.value,"==":actual===condition.value})[condition.operator]??false;}

function storyScore(scene,threads,nextDay) {
  let score=scene.priority??50;const arc=`${scene.arc} ${scene.title}`;
  if(/회사|일|약속/.test(arc))score+=threads.WORK*.45;if(/돈|만원|선물|경제/.test(arc))score+=threads.MONEY*.45;if(/라이벌|흔들|전 여자친구/.test(arc))score+=Math.max(threads.RIVAL,threads.TEMPTATION)*.5;if(/거짓말|사라진|맞는 걸까/.test(arc))score+=threads.MAIN_RELATIONSHIP*.45;if(nextDay<scene.window[0]||nextDay>scene.window[1])score-=1000;return Math.round(score);
}

export function runDailyStoryDirector(state,completedDay=state.day) {
  const director=migrateStoryDirectorState(state);const nextDay=completedDay+1;const seed=getDaySeed(state,nextDay);const relationshipState=analyzeRelationshipState(state);const behavior=analyzePlayerBehavior(state,completedDay);director.latestBehavior=behavior;const threads=computeThreads(state,behavior,relationshipState);updateUnresolved(state,director,completedDay);
  director.foreshadowing={rival:Math.min(6,Math.floor(threads.RIVAL/18)),temptation:Math.min(6,Math.floor(threads.TEMPTATION/18)),lie:Math.min(6,(director.unresolvedEvents??[]).filter(item=>item.type==="LIE"&&item.status!=="resolved").length+Math.floor(completedDay/10))};
  const previous=director.analyses.at(-1);const narrativeTension=calculateTension(state,relationshipState,previous);const rankedThreads=Object.entries(threads).sort((a,b)=>b[1]-a[1]);const candidateDominant=rankedThreads[0][0];if(candidateDominant!==director.dominantThread&&completedDay-director.dominantSinceDay>=3){director.dominantThread=candidateDominant;director.dominantSinceDay=completedDay;director.dominantStatus="EMERGING";}else director.dominantStatus=completedDay>=26?"CLIMAX":completedDay-director.dominantSinceDay>=5?"DOMINANT":"ACTIVE";director.threads=threads;
  const runtimeEvents=state.gameMode===GAME_MODES.FREE_ROMANCE?SITUATION_EVENTS:EVENT_DEFINITIONS;
  const eventCandidates=runtimeEvents.filter(event=>isContentAvailableForMode(state,event)).map(event=>eventCandidate(state,event,threads,narrativeTension,completedDay)).sort((a,b)=>b.finalProbability-a.finalProbability);const storyCandidates=STORY_SCENES.filter(scene=>isContentAvailableForMode(state,scene)).map(scene=>({id:scene.id,title:scene.title,score:storyScore(scene,threads,nextDay)})).filter(item=>item.score>-500).sort((a,b)=>b.score-a.score);
  const eventWeights=Object.fromEntries(eventCandidates.map(item=>[item.id,{multiplier:item.multiplier,seed}]));const storyScores=Object.fromEntries(storyCandidates.map(item=>[item.id,item.score]));const worldActivity=selectWorldActivity(state,seed,completedDay);
  const plan={day:nextDay,seed,relationshipState,narrativeTension,dominantThread:director.dominantThread,secondaryThreads:rankedThreads.slice(1,4).map(([id])=>id),slots:{morning:storyCandidates[0]?.id??null,day:"CONDITIONAL",evening:"DYNAMIC",night:"NPC_CONTACT"},eventWeights,storyScores,eventCandidates:eventCandidates.slice(0,6),storyCandidates:storyCandidates.slice(0,6),worldActivity};director.nextDayPlan=plan;
  const analysis={day:completedDay,nextDay,seed,relationshipState,narrativeTension,threads:{...threads},behavior:{...behavior},dominantThread:director.dominantThread,dominantStatus:director.dominantStatus,secondaryThreads:plan.secondaryThreads,riskFactors:deriveRisks(state,director),opportunities:deriveOpportunities(state,relationshipState),importantMemories:(state.memories??[]).filter(memory=>memory.importance>=4).sort((a,b)=>b.importance-a.importance||b.day-a.day).slice(0,8),unresolvedEvents:structuredClone(director.unresolvedEvents),foreshadowing:{...director.foreshadowing},eventCandidates:plan.eventCandidates,storyCandidates:plan.storyCandidates,worldActivity};director.analyses.push(analysis);if(director.analyses.length>30)director.analyses.shift();return analysis;
}

function selectWorldActivity(state,seed,day){const options=state.partner.personality.independence>=60?["친구와 저녁","혼자 쇼핑","집에서 휴식","SNS 업데이트"]:["집에서 휴식","연인에게 메시지","친구와 통화","산책"];return {day,activity:options[seed%options.length],seed};}
function deriveRisks(state,director){const risks=[];if(state.trust<450)risks.push("LOW_TRUST");if(state.stress>70)risks.push("HIGH_STRESS");if((director.unresolvedEvents??[]).some(item=>item.status!=="resolved"))risks.push("UNRESOLVED_SECRET");if((director.threads.TEMPTATION??0)>55)risks.push("NPC_ATTRACTION");return risks;}
function deriveOpportunities(state,relationshipState){const result=[];if(["DISTANT","CONFLICT","RECOVERING"].includes(relationshipState))result.push("HONEST_CONVERSATION","RECONCILIATION");if(state.work>60)result.push("CAREER_GROWTH");if(state.money>1000000)result.push("SPECIAL_DATE");return result;}

export function validateStoryDirectorState(director){return Boolean(director&&director.version===1&&Number.isInteger(director.baseSeed)&&director.daySeeds&&typeof director.daySeeds==="object"&&Array.isArray(director.analyses)&&director.threads&&typeof director.threads==="object"&&typeof director.dominantThread==="string"&&Array.isArray(director.unresolvedEvents)&&(director.nextDayPlan===null||Number.isInteger(director.nextDayPlan.seed)));}

export function createStoryProposalContext(state){const director=migrateStoryDirectorState(state);const latest=director.analyses.at(-1);return {currentDay:state.day,relationshipState:latest?.relationshipState??analyzeRelationshipState(state),recentMemories:(state.memories??[]).filter(item=>state.day-item.day<=7).slice(-8),importantMemories:(state.memories??[]).filter(item=>item.importance>=4).slice(-8),currentStoryThreads:director.threads,unresolvedEvents:director.unresolvedEvents,npcRelations:(state.npcs??[]).map(({id,name,relationshipType,affection,trust,interestInPlayer,interestInGirlfriend})=>({id,name,relationshipType,affection,trust,interestInPlayer,interestInGirlfriend})),playerBehaviorProfile:director.latestBehavior??{},narrativeTension:latest?.narrativeTension??0,availableEvents:director.nextDayPlan?.eventCandidates??[]};}
export function validateStoryProposal(proposal,availableIds=[]){return Boolean(proposal&&typeof proposal.eventId==="string"&&availableIds.includes(proposal.eventId)&&typeof proposal.dialogueTone==="string"&&!Object.keys(proposal).some(key=>["money","affection","trust","effects"].includes(key)));}
