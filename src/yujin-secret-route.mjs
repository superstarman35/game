import { isYujinSecretGirlfriend } from "./npc-manager.mjs";

export const YUJIN_NPC_ID = "female-coworker";
export const YUJIN_ROOFTOP_LOCATION_ID = "rooftop-pub";
export const YUJIN_ROOFTOP_START_MINUTES = 23 * 60;
export const YUJIN_ROOFTOP_EVENT_IMAGE = "assets/events/yujin/moonlight-rooftop-night.png";
export const YUJIN_ROOFTOP_INVITATION = "오늘 밤 11시 이후에 홍대거리 문라이트 루프탑으로 와. 기다릴게.";

const TOPICS = Object.freeze([
  {id:"day",keywords:["오늘","하루","뭐 했"],prompt:"오늘 하루는 어땠어?",lead:"오늘은 회의가 길었어. 그래도 네 메시지 보니까 긴장이 좀 풀린다."},
  {id:"work",keywords:["일","회사","업무","회의"],prompt:"회사에서 힘든 일은 없었어?",lead:"일은 늘 그렇지 뭐. 사람들 눈치 보느라 피곤했는데, 네 앞에서는 솔직해지고 싶어."},
  {id:"meal",keywords:["밥","저녁","점심","먹"],prompt:"밥은 챙겨 먹었어?",lead:"아직 제대로 못 먹었어. 너도 끼니 거르지 말고, 다음엔 같이 따뜻한 거 먹자."},
  {id:"weather",keywords:["날씨","비","추워","더워"],prompt:"오늘 날씨가 묘하게 생각나게 하더라.",lead:"나도 그랬어. 퇴근길 공기가 이상하게 오래 기억에 남더라."},
  {id:"memory",keywords:["기억","예전","처음"],prompt:"우리 처음 가까워졌던 때 기억나?",lead:"기억나. 아무렇지 않은 척했지만 그때부터 네 연락을 기다렸어."},
  {id:"miss",keywords:["보고 싶","그리워","생각나"],prompt:"문득 네가 보고 싶었어.",lead:"그 말 들으니까 나도 숨기기 어렵네. 사실 오늘 종일 네 생각이 났어."},
  {id:"secret",keywords:["비밀","우리 사이","관계"],prompt:"우리 관계, 지금은 어떻게 생각해?",lead:"남들에게 설명할 수 없는 사이라도 내 마음까지 가벼운 건 아니야."},
  {id:"jealousy",keywords:["질투","다른 사람","여자친구"],prompt:"혹시 질투나지는 않아?",lead:"안 난다고 하면 거짓말이겠지. 그래도 감정으로 너를 몰아붙이고 싶진 않아."},
  {id:"rest",keywords:["쉬어","피곤","잠"],prompt:"많이 피곤해 보여. 조금 쉬어.",lead:"고마워. 네가 그렇게 말해 주면 혼자 버티고 있다는 느낌이 덜해."},
  {id:"weekend",keywords:["주말","휴일","쉬는 날"],prompt:"주말에는 뭐 하고 싶어?",lead:"사람 많은 곳 말고 조용한 데서 오래 이야기하고 싶어. 시간에 쫓기지 않게."},
  {id:"music",keywords:["음악","노래","듣"],prompt:"요즘 자주 듣는 노래 있어?",lead:"퇴근할 때 잔잔한 노래를 들어. 가끔 가사가 우리 이야기처럼 들려서 멈칫해."},
  {id:"movie",keywords:["영화","드라마","보자"],prompt:"같이 보고 싶은 영화가 생겼어.",lead:"좋아. 내용보다 네 옆에서 같은 장면을 보고 있다는 게 더 기억에 남을 것 같아."},
  {id:"coffee",keywords:["커피","카페"],prompt:"커피 한잔 같이하고 싶다.",lead:"회사 근처 말고 아무도 우리를 모르는 카페면 좋겠다. 천천히 마시자."},
  {id:"future",keywords:["앞으로","미래","나중"],prompt:"앞으로 우리 사이가 어떻게 될까?",lead:"정답은 모르겠어. 그래도 애매한 말로 피하지 않고 내가 원하는 걸 솔직히 말할게."},
  {id:"apology",keywords:["미안","미안해","잘못"],prompt:"내가 미안한 게 많아.",lead:"사과를 듣고 싶었던 건 맞아. 하지만 같은 일이 반복되지 않는 게 더 중요해."},
  {id:"thanks",keywords:["고마워","고맙"],prompt:"내 이야기를 들어줘서 고마워.",lead:"나도 고마워. 네가 솔직해질 때마다 우리 사이가 조금 더 진짜 같아져."},
  {id:"promise",keywords:["약속","꼭"],prompt:"우리 둘만의 약속 하나 만들까?",lead:"좋아. 피하지 말고, 불편한 마음도 숨기지 말고 먼저 말하기로 하자."},
  {id:"meet",keywords:["만나","볼까","어디"],prompt:"조용히 만날 수 있을까?",lead:"가능해. 사람들 눈에 띄지 않는 시간과 장소를 내가 생각해 볼게."},
  {id:"rooftop",keywords:["루프탑","홍대","11시","열한"],prompt:"문라이트 루프탑에서 만나자는 거지?",lead:"응. 홍대거리 문라이트 루프탑이야. 밤 11시가 지나면 내가 먼저 가 있을게."},
  {id:"heart",keywords:["좋아해","사랑","마음"],prompt:"네 마음을 솔직히 듣고 싶어.",lead:"좋아해. 가볍게 꺼낸 말이 아니라서 더 조심스러웠어. 이제는 숨기고 싶지 않아."}
]);

const ENDINGS = Object.freeze([
  "네 답장은 천천히 해도 돼.","오늘은 네 목소리도 듣고 싶네.","괜히 웃게 되잖아.","이 말은 우리 둘만 알고 있자.","너라서 말하는 거야.",
  "다음에 만나면 더 자세히 얘기해 줄게.","지금 네 표정이 궁금하다.","솔직하게 답해 줘.","읽고 그냥 지나가지는 마.","조금 늦어도 기다릴게.",
  "오늘은 거짓말 없이 얘기하자.","네가 먼저 물어봐 줘서 좋았어.","나도 용기 내고 있는 중이야.","이런 얘기는 메시지로도 떨리네.","우리 너무 서두르지는 말자.",
  "그래도 네 마음은 확인하고 싶어.","나만 진심인 건 아니었으면 해.","다음 답장은 조금 다정하게 해 줘.","지금은 네 말이 필요해.","오늘 밤은 오래 기억할 것 같아.",
  "편하게 말해도 괜찮아.","내가 너무 솔직했나?", "답을 재촉하려는 건 아니야.","네 하루 끝에 내가 있었으면 좋겠어.","우리 사이를 소중히 다뤄 줘."
]);

export const YUJIN_MESSAGE_CORPUS = Object.freeze(TOPICS.flatMap((topic,topicIndex)=>ENDINGS.map((ending,variantIndex)=>Object.freeze({
  id:`yujin-${String(topicIndex+1).padStart(2,"0")}-${String(variantIndex+1).padStart(2,"0")}`,
  topicId:topic.id,
  prompt:topic.prompt,
  text:`${topic.lead} ${ending}`
}))));

export function createYujinSecretRouteState() {
  return {version:1,messageHistory:[],recentReplyIds:[],invitation:null,completedDays:[]};
}

export function migrateYujinSecretRouteState(value) {
  const initial=createYujinSecretRouteState();
  const source=value&&typeof value==="object"?value:{};
  return {
    version:1,
    messageHistory:Array.isArray(source.messageHistory)?source.messageHistory.filter(item=>item&&["me","her"].includes(item.speaker)&&typeof item.text==="string").slice(-120):[],
    recentReplyIds:Array.isArray(source.recentReplyIds)?source.recentReplyIds.filter(id=>typeof id==="string").slice(-30):[],
    invitation:source.invitation&&typeof source.invitation==="object"?{...source.invitation}:null,
    completedDays:Array.isArray(source.completedDays)?source.completedDays.filter(Number.isInteger).slice(-30):initial.completedDays
  };
}

export function validateYujinSecretRouteState(value) {
  return Boolean(value&&value.version===1&&Array.isArray(value.messageHistory)&&Array.isArray(value.recentReplyIds)&&Array.isArray(value.completedDays)&&(value.invitation===null||typeof value.invitation==="object"));
}

export function getYujinMessageSuggestions(route) {
  const offset=(route?.messageHistory?.filter(item=>item.speaker==="me").length??0)%TOPICS.length;
  return [0,7,13].map(step=>TOPICS[(offset+step)%TOPICS.length].prompt);
}

function findTopic(message) {
  const normalized=String(message??"").toLowerCase();
  return TOPICS.find(topic=>topic.keywords.some(keyword=>normalized.includes(keyword)))??TOPICS[Math.abs(normalized.length)%TOPICS.length];
}

export function appendYujinConversationTurn(route,userMessage,{day=1,random=Math.random}={}) {
  const current=migrateYujinSecretRouteState(route);
  const text=String(userMessage??"").trim().slice(0,180);
  if(!text)return {route:current,reply:null,invitationCreated:false};
  current.messageHistory.push({speaker:"me",text,day});
  const userTurnCount=current.messageHistory.filter(item=>item.speaker==="me").length;
  let reply,invitationCreated=false;
  if(!current.invitation&&userTurnCount>=2){
    current.invitation={id:`yujin-rooftop-${day}`,status:"pending",createdDay:day,locationId:YUJIN_ROOFTOP_LOCATION_ID,earliestMinutes:YUJIN_ROOFTOP_START_MINUTES,message:YUJIN_ROOFTOP_INVITATION};
    reply={id:`yujin-invitation-${day}`,topicId:"rooftop-invitation",text:YUJIN_ROOFTOP_INVITATION};
    invitationCreated=true;
  }else{
    const topic=findTopic(text);
    const candidates=YUJIN_MESSAGE_CORPUS.filter(item=>item.topicId===topic.id&&!current.recentReplyIds.includes(item.id));
    const pool=candidates.length?candidates:YUJIN_MESSAGE_CORPUS.filter(item=>item.topicId===topic.id);
    reply=pool[Math.min(pool.length-1,Math.floor(Math.max(0,Math.min(.999999,Number(random())||0))*pool.length))];
  }
  current.messageHistory.push({speaker:"her",text:reply.text,day,replyId:reply.id});
  current.recentReplyIds.push(reply.id);current.recentReplyIds=current.recentReplyIds.slice(-30);current.messageHistory=current.messageHistory.slice(-120);
  return {route:current,reply,invitationCreated};
}

export function getPendingYujinRooftopInvitation(state) {
  const invitation=state?.yujinSecretRoute?.invitation;
  return invitation?.status==="pending"?invitation:null;
}

export function isYujinRooftopInvitationReady(state,locationId,minutes) {
  const yujin=(state?.npcs??[]).find(npc=>npc.id===YUJIN_NPC_ID);
  const invitation=getPendingYujinRooftopInvitation(state);
  return Boolean(yujin&&isYujinSecretGirlfriend(yujin)&&invitation&&locationId===invitation.locationId&&Number(minutes)>=invitation.earliestMinutes);
}

export function completeYujinRooftopMeeting(state) {
  const invitation=getPendingYujinRooftopInvitation(state);
  if(!invitation)return null;
  const before={affection:Number(state.affection)||0,trust:Number(state.trust)||0};
  state.affection=Math.max(0,before.affection-100);
  state.trust=Math.max(0,before.trust-100);
  invitation.status="completed";invitation.completedDay=state.day;
  state.yujinSecretRoute.completedDays.push(state.day);
  return {invitation,effects:{affection:state.affection-before.affection,trust:state.trust-before.trust}};
}
