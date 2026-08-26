export const WORLD_REPEAT_ENCOUNTER_CHANCE = 0.5;
export const WORLD_LATE_NIGHT_MINUTES = 22 * 60;
export const YURI_REUNION_EVENT_ID = "situation-ex-girlfriend-reunion";

const ENCOUNTERS = Object.freeze({
  yuriCafe:Object.freeze({
    id:"repeat-yuri-cafe",
    npcId:"player-ex",
    npcName:"유리",
    title:"카페 모퉁이에서 다시 만난 유리",
    message:"익숙한 창가 자리에 앉아 있던 유리가 먼저 눈을 맞추고 조용히 인사했다.",
    question:"유리와 잠시 어떤 시간을 보낼까?",
    choices:Object.freeze([
      Object.freeze({id:"greet",label:"안부를 나누고 요즘 지내는 이야기를 듣는다",response:"부담스럽지 않게 안부를 나누자 유리의 표정이 한결 편안해졌다.",npcEffects:Object.freeze({affection:5,trust:2,interestInPlayer:2})}),
      Object.freeze({id:"coffee",label:"커피를 함께 마시며 조금 더 이야기한다",response:"짧은 커피 한 잔이었지만 예전보다 솔직한 대화가 이어졌다.",npcEffects:Object.freeze({affection:8,trust:3,interestInPlayer:4})})
    ])
  }),
  yujinNightFood:Object.freeze({
    id:"repeat-yujin-night-food",
    npcId:"female-coworker",
    npcName:"유진",
    title:"심야 포차거리에서 만난 유진",
    message:"퇴근 뒤 혼자 야식을 고르던 유진이 나를 발견하고 반갑게 손을 흔들었다.",
    question:"늦은 시간에 만난 유진에게 어떻게 할까?",
    choices:Object.freeze([
      Object.freeze({id:"coworker-talk",label:"근처에 앉아 회사 이야기를 나눈다",response:"업무 중에는 하지 못했던 이야기를 편하게 나누며 동료로서 가까워졌다.",npcEffects:Object.freeze({affection:5,trust:4,interestInPlayer:2})}),
      Object.freeze({id:"late-snack",label:"야식을 함께 먹으며 개인적인 안부를 묻는다",response:"늦은 야식을 함께하며 서로의 일상에 대해 조금 더 알게 됐다.",npcEffects:Object.freeze({affection:8,trust:3,interestInPlayer:5})})
    ])
  })
});

export function hasCompletedYuriReunion(state) {
  const saved=state?.situationEventStates?.[YURI_REUNION_EVENT_ID];
  return saved?.status==="COMPLETED"||Boolean(state?.storyFlags?.[`${YURI_REUNION_EVENT_ID}:COMPLETED`]);
}

export function getNightOutingContext(minutes, partnerName="여자친구") {
  const alone=Number(minutes)>=WORLD_LATE_NIGHT_MINUTES;
  const name=String(partnerName),last=name.charCodeAt(name.length-1),hasBatchim=last>=0xac00&&last<=0xd7a3&&(last-0xac00)%28!==0;
  return {
    alone,
    message:alone?"혼자 외출 나왔다.":`${name}${hasBatchim?"과":"와"} 같이 외출 나왔다.`
  };
}

export function shouldShowPartnerAtWorldLocation(minutes) {
  return Number(minutes)>=19*60&&Number(minutes)<WORLD_LATE_NIGHT_MINUTES;
}

export function rollRepeatWorldEncounter(state,location,minutes,random=Math.random) {
  if(state?.gameMode!=="free-romance"||!location)return null;
  let encounter=null;
  if(location.id==="small-cafe"&&hasCompletedYuriReunion(state))encounter=ENCOUNTERS.yuriCafe;
  else if(location.id==="night-food"&&Number(minutes)>=WORLD_LATE_NIGHT_MINUTES)encounter=ENCOUNTERS.yujinNightFood;
  if(!encounter||random()>WORLD_REPEAT_ENCOUNTER_CHANCE)return null;
  return structuredClone(encounter);
}

export function resolveRepeatWorldEncounter(state,encounter,choiceId) {
  const choice=encounter?.choices?.find(item=>item.id===choiceId);
  const npc=(state?.npcs??[]).find(item=>item.id===encounter?.npcId);
  if(!choice||!npc)return null;
  const applied={};
  for(const [key,amount] of Object.entries(choice.npcEffects??{})){
    const before=Number(npc[key])||0;
    npc[key]=Math.max(0,Math.min(100,before+(Number(amount)||0)));
    applied[key]=npc[key]-before;
  }
  state.worldEncounterHistory??=[];
  const record={id:encounter.id,day:state.day,minutes:Number(state.nightState?.minutes)||0,locationId:encounter.id==="repeat-yuri-cafe"?"small-cafe":"night-food",npcId:npc.id,choiceId,effects:applied};
  state.worldEncounterHistory.push(record);
  state.npcHistory??=[];
  state.npcHistory.push({day:state.day,phase:state.phase,actionId:encounter.id,npcId:npc.instanceId,effects:applied});
  return {encounter,choice,npc,effects:applied,record};
}
