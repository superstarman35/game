import { getMemoryContext } from "./memory-manager.mjs";
import { getItem } from "./items-data.mjs";
import { getHaeunMessageReply } from "./haeun-message-data.mjs?v=3";

export function buildConversationContext(state) {
  const recentActions = (state.actionHistory ?? []).slice(-6).map(entry => ({ day:entry.day, actionId:entry.actionId, tag:entry.tag }));
  const recentEvents = (state.eventHistory ?? []).slice(-4).map(entry => ({ day:entry.day, title:entry.title, message:entry.message }));
  const recentGifts = (state.inventory ?? []).filter(entry => entry.owner === "girlfriend").slice(-3).map(entry => ({ itemId:entry.itemId, givenDay:entry.givenDay, equipped:entry.equipped }));
  const recentTemptations = (state.temptationHistory ?? []).slice(-3).map(entry => ({ day:entry.day, choiceId:entry.choiceId, partnerTrust:entry.partnerTrust }));
  const recentConversation = (state.conversationHistory ?? []).slice(-4).map(turn => ({
    day:turn.day,
    phase:turn.phase,
    user:String(turn.user ?? "").slice(0, 120),
    assistant:String(turn.assistant ?? "").slice(0, 180)
  }));
  const wornInstance=(state.inventory ?? []).find(entry=>entry.owner === "girlfriend" && entry.equipped && getItem(entry.itemId)?.category === "heroine-outfit");
  const wornOutfit=wornInstance ? getItem(wornInstance.itemId) : null;
  return {
    day:state.day, phase:state.phase,
    girlfriend:{ name:state.partner.name, bio:state.partner.bio, heroineId:state.partner.heroineId, age:state.partner.age, ageCategory:state.partner.ageCategory, studentSafe:Boolean(state.partner.studentSafe), archetype:state.partner.archetype, aiVoice:state.partner.aiVoice, messageVoice:state.partner.messageVoice??null, career:structuredClone(state.partner.career??null), personality:{ ...state.partner.personality }, currentOutfit:wornOutfit ? { outfitId:wornOutfit.outfitId,name:wornOutfit.name,styleTags:[...wornOutfit.styleTags],giftedByPlayer:Boolean(wornInstance.giftedByPlayer),lastWorn:wornInstance.lastWorn ?? wornInstance.givenDay } : null },
    relationship:{ affection:state.affection, trust:state.trust, excitement:state.excitement, attachment:state.attachment, conflict:state.conflict, stress:state.relationshipStress },
    player:{ name:state.player?.name??"나", archetype:state.player?.archetypeName??"기본 캐릭터", appearanceRating:state.player?.appearanceRating??"보통", money:state.money, health:state.health, energy:state.energy, fatigue:state.fatigue, stress:state.stress, charm:state.charm, fashion:state.fashion, confidence:state.confidence, job:state.job.name, jobLevel:state.jobLevel },
    recentActions, recentEvents, recentGifts, recentTemptations, recentConversation, girlfriendLoan:structuredClone(state.girlfriendLoan??{borrowed:false,amount:0,day:null}), recentInitiatedMessages:(state.initiatedMessages ?? []).slice(-3), importantMemories:getMemoryContext(state)
  };
}

const BLOCKED_PROFANITY=["시발","씨발","ㅅㅂ","병신","ㅂㅅ","개새끼","새끼야","좆","지랄","꺼져","닥쳐"];
const HOSTILE_PATTERNS=[/죽어/,/혐오/,/한심/,/쓸모없/,/멍청/,/재수없/,/보기\s*싫/,/입\s*닥/,/꺼\s*져/,/미친\s*(년|놈)?/,/개\s*같/,/싫어.*꺼져/];

export function normalizeConversationInput(message){return String(message??"").normalize("NFKC").toLowerCase().replace(/[\s._~!@#$%^&*()+=[\]{}|\\;:'",<>/?`·-]/g,"").replace(/(.)\1{2,}/g,"$1$1");}
export function analyzeConversationInput(message){
  const raw=String(message??"").trim(),normalized=normalizeConversationInput(raw);
  if(!raw)return {allowed:false,level:"empty",message:"메시지를 입력해 주세요."};
  if(BLOCKED_PROFANITY.some(word=>normalized.includes(normalizeConversationInput(word))))return {allowed:false,level:"blocked",message:"상대방에게 상처가 될 수 있는 표현이에요. 조금 부드럽게 바꿔 주세요."};
  if(HOSTILE_PATTERNS.some(pattern=>pattern.test(normalized)))return {allowed:true,level:"hostile",message:"공격적인 표현이 감지되었습니다."};
  return {allowed:true,level:"safe",message:""};
}

export function getHostileConversationResponse(state){
  const count=(state.conversationSafety?.hostileCount??0)+1;
  const heroine=state.partner?.heroineId;
  const text=heroine==="nari"?"그런 말을 들으니까 마음이 너무 아파. 정말 실망했어.":heroine==="sejin"?"그런 식의 말은 받아들일 수 없어. 솔직히 많이 실망했어.":"그런 말을 들을 줄은 몰랐어. 농담이어도 정말 실망했어.";
  const scale=Math.min(1.7,1+(count-1)*.35);
  return {text,effects:{affection:-Math.round(55*scale),trust:-Math.round(70*scale),conflict:Math.round(24*scale),relationshipStress:Math.round(22*scale),excitement:-Math.round(18*scale)},count,forceEnd:count>=2};
}

export function getSuggestedConversationReplies(context,turn=0){
  if(context.relationship.conflict>=45||context.relationship.trust<350)return ["미안해. 네 마음부터 제대로 듣고 싶어.","내가 서운하게 한 부분을 솔직히 말해 줄래?","변명하지 않고 행동으로 보여 줄게."];
  if(context.player.fatigue>=70)return ["오늘 조금 힘들었는데 네 목소리를 들으니 좋아.","걱정해 줘서 고마워. 너는 오늘 어땠어?","잠깐이라도 서로의 하루를 이야기하자."];
  return turn%3===0?["오늘 네 생각이 많이 났어.","오늘 하루는 어땠어? 천천히 말해 줘.","다음 데이트 때 하고 싶은 게 있어?"]:turn%3===1?["그랬구나. 네 마음을 더 듣고 싶어.","내가 곁에서 어떻게 해 주면 좋을까?","솔직하게 말해 줘서 고마워."]:["나도 너와 이야기하는 시간이 좋아.","우리 다음에는 함께 좋은 추억 만들자.","오늘 이야기 꼭 기억할게."];
}

const MODERN_SLANG=[
  {terms:["킹받네","킹받아"],intent:"annoyed",meaning:"정말 화나거나 짜증 난다"},{terms:["억텐"],intent:"awkward",meaning:"억지로 분위기를 띄우는 상태"},{terms:["폼미쳤다","폼 미쳤다"],intent:"praise",meaning:"실력이나 모습이 아주 좋다"},{terms:["완내스"],intent:"praise",meaning:"완전히 내 스타일이다"},{terms:["알잘딱깔센"],intent:"request",meaning:"알아서 깔끔하고 센스 있게"},{terms:["스불재"],intent:"regret",meaning:"스스로 불러온 결과"},{terms:["점메추","저메추","메뉴추천"],intent:"food",meaning:"식사 메뉴 추천"},{terms:["무물"],intent:"question",meaning:"무엇이든 물어보기"},{terms:["이왜진"],intent:"surprise",meaning:"이게 왜 진짜인지 놀랍다"},{terms:["갓생"],intent:"growth",meaning:"부지런하고 생산적으로 사는 것"},{terms:["현타"],intent:"down",meaning:"현실을 자각해 허탈해진 상태"},{terms:["과몰입"],intent:"excited",meaning:"어떤 일에 감정적으로 깊게 빠짐"},{terms:["tmi","티엠아이"],intent:"story",meaning:"조금 사소하지만 자세한 이야기"},{terms:["레전드"],intent:"surprise",meaning:"아주 인상적이거나 놀랍다"},{terms:["ㄹㅇ","리얼"],intent:"affirm",meaning:"정말 그렇다"},{terms:["ㅇㅈ","인정"],intent:"affirm",meaning:"동의하거나 인정한다"},{terms:["노잼"],intent:"bored",meaning:"재미없다"},{terms:["꿀잼"],intent:"excited",meaning:"아주 재미있다"},{terms:["플렉스","flex"],intent:"spend",meaning:"과감하게 소비하거나 자랑한다"},{terms:["손절"],intent:"relationship-end",meaning:"관계를 끊는다"},{terms:["뇌절"],intent:"overdo",meaning:"같은 말이나 행동을 지나치게 반복한다"}
];
export function interpretModernSlang(message){const normalized=String(message??"").toLowerCase().replace(/\s+/g,"");return MODERN_SLANG.find(item=>item.terms.some(term=>normalized.includes(term.replace(/\s+/g,"").toLowerCase())))??null;}
export function classifyConversationReply(message,session={}){const text=String(message??"").trim(),slang=interpretModernSlang(text);if(slang)return {type:"slang",intent:slang.intent,slang};if(/^(응|어|그래|맞아|좋아|ㅇㅇ|웅|그럼|당연)([.!~ㅋㅎ]*)$/.test(text))return {type:"affirmative",intent:session.lastQuestionId??"general"};if(/^(아니|싫어|별로|ㄴㄴ|됐어|안돼)([.!~ㅋㅎ]*)$/.test(text))return {type:"negative",intent:session.lastQuestionId??"general"};if(/^(몰라|그냥|글쎄|아무것도)([.!~ㅋㅎ]*)$/.test(text))return {type:"avoidant",intent:session.lastQuestionId??"general"};if(/[?？]|^(너는|넌|하은|나리|채연).*(어때|뭐|왜|언제|어디)/.test(text))return {type:"question",intent:"question"};if(/힘들|지쳐|피곤|속상|우울|불안|화나|짜증/.test(text))return {type:"emotion",intent:"down"};if(/좋아|행복|신나|재밌|기뻐/.test(text))return {type:"emotion",intent:"up"};return {type:text.length<=5?"short":"explanation",intent:session.topic??"daily"};}
export function inferConversationQuestion(text){const value=String(text??"");if(!/[?？]|(어때|했어|할까|줄래|있어|먹었어)/.test(value))return null;if(/데이트|만나|주말|어디.*갈/.test(value))return "date-plan";if(/밥|먹|메뉴|점심|저녁/.test(value))return "meal";if(/회사|일|상사|업무/.test(value))return "work";if(/결혼|미래|나중|우리/.test(value))return "future";if(/괜찮|기분|힘들|하루.*어땠/.test(value))return "wellbeing";return "general";}
function chooseVariant(items,session={}){const recent=new Set(session.recentReplyIds??[]),available=items.filter(item=>!recent.has(item.id)),pool=available.length?available:items,index=Math.abs((session.turn??0)+(session.variantSeed??0))%pool.length;return pool[index];}
function sessionAwareReply(context,text){
  const session=context.sessionState??{},classification=classifyConversationReply(text,session),name=context.girlfriend.name;
  if(session.lastUserMessage&&normalizeConversationInput(session.lastUserMessage)===normalizeConversationInput(text))return {...chooseVariant([{id:"repeat-1",text:"아까도 같은 말을 했는데, 그만큼 중요해서 다시 말한 거야?"},{id:"repeat-2",text:"응, 그 말은 들었어. 혹시 내가 놓친 마음이 있다면 조금 다르게 설명해 줄래?"},{id:"repeat-3",text:"같은 이야기를 다시 하는 걸 보니 마음에 많이 남았나 봐. 내가 어떻게 반응해 주면 좋겠어?"}],session),effects:{trust:2},topic:session.topic??"daily"};
  if(classification.type==="slang"){
    const pools={annoyed:[{id:"slang-annoyed-1",text:"그 정도로 킹받았구나. 무슨 일이었는지 말해 봐, 같이 화내 줄게."},{id:"slang-annoyed-2",text:"진짜 짜증 날 만한 일이었나 보네. 누가 그렇게 만들었어?"}],food:[{id:"slang-food-1",text:"메뉴 추천? 오늘은 따뜻한 국물 어때? 네가 고르면 나도 같이 먹고 싶다."},{id:"slang-food-2",text:"저메추라면 파스타나 매콤한 떡볶이! 지금 더 당기는 쪽은 뭐야?"}],praise:[{id:"slang-praise-1",text:"그 정도면 정말 마음에 들었다는 뜻이지? 어떤 점이 그렇게 좋았어?"},{id:"slang-praise-2",text:"폼이 미쳤다니 칭찬 제대로네. 나한테 하는 말이면 조금 설레는데?"}],down:[{id:"slang-down-1",text:"현타 왔구나. 지금은 해결책보다 네 얘기를 먼저 들어 주는 게 좋을까?"},{id:"slang-down-2",text:"갑자기 마음이 툭 떨어진 느낌이지. 오늘 무슨 일이 있었어?"}],affirm:[{id:"slang-affirm-1",text:"인정한다는 거지? 그럼 우리 생각이 통한 걸로 알게."},{id:"slang-affirm-2",text:"ㄹㅇ이라고 하니까 확실히 동의한 것 같아서 웃겨. 그다음은 어떻게 할까?"}],bored:[{id:"slang-bored-1",text:"노잼이었구나. 그럼 우리 화제를 바꿔 볼까, 아니면 내가 웃겨 줄까?"}],relationshipEnd:[{id:"slang-cut-1",text:"손절이라는 말은 가볍게 듣기 어렵네. 정말 관계를 끝내고 싶다는 뜻이야?"}],general:[{id:"slang-general-1",text:`그 말 무슨 뜻인지 알아. ${classification.slang.meaning}는 이야기지? 조금 더 들려줘.`},{id:"slang-general-2",text:"요즘 말로 하니까 느낌이 확 오네. 그래서 너는 어떻게 하고 싶은데?"}]};
    return {...chooseVariant(pools[classification.intent]??pools[classification.intent==="relationship-end"?"relationshipEnd":"general"],session),effects:{affection:2,trust:2},topic:classification.intent};
  }
  if(classification.type==="affirmative"){
    const byQuestion={"date-plan":[{id:"yes-date-1",text:"좋아. 그럼 이번에는 네가 가고 싶은 곳으로 갈까?"},{id:"yes-date-2",text:"나도 만나고 싶었어. 조용한 카페랑 산책 중에는 뭐가 더 좋아?"}],meal:[{id:"yes-meal-1",text:"잘 먹었다니 다행이다. 뭐 먹었는지 궁금한데?"}],work:[{id:"yes-work-1",text:"그랬구나. 일 이야기를 조금 더 해도 괜찮아, 내가 듣고 있을게."}],future:[{id:"yes-future-1",text:"나도 우리 미래를 진지하게 생각해 보고 싶어. 가장 먼저 떠오르는 모습은 뭐야?"}],wellbeing:[{id:"yes-well-1",text:"괜찮다니 다행이지만 억지로 괜찮은 척하는 건 아니지?"}],general:[{id:"yes-general-1",text:"응, 그렇게 말해 주니까 마음이 놓여. 그럼 조금 더 이야기해 볼까?"},{id:"yes-general-2",text:"좋아. 네 대답을 들으니 다음 이야기도 궁금해졌어."}]};return {...chooseVariant(byQuestion[classification.intent]??byQuestion.general,session),effects:{affection:3,trust:3},topic:classification.intent};
  }
  if(classification.type==="negative")return {...chooseVariant([{id:"no-1",text:"알겠어. 싫다는 마음도 존중할게. 이유를 물어봐도 괜찮아?"},{id:"no-2",text:"응, 억지로 시키고 싶지는 않아. 대신 네 생각을 조금만 더 알려 줄래?"},{id:"no-3",text:"그렇구나. 내가 너무 앞서갔나 봐. 어떤 쪽이 더 편해?"}],session),effects:{trust:2},topic:classification.intent};
  if(classification.type==="avoidant")return {...chooseVariant([{id:"avoid-1",text:"지금 바로 말하기 어렵다면 괜찮아. 그냥 곁에 있어 달라는 뜻으로 들을게."},{id:"avoid-2",text:"‘그냥’이라고 할 때는 말로 설명하기 어려운 마음이 있더라. 천천히 생각해도 돼."},{id:"avoid-3",text:"모를 수도 있지. 그럼 쉬운 것부터 물어볼게. 지금 기분은 편해, 아니면 답답해?"}],session),effects:{trust:2},topic:session.topic??"emotion"};
  if(classification.type==="question"&&/너는|넌|오늘.*뭐|뭐.*했/.test(text))return {...chooseVariant([{id:"her-day-1",text:`나는 오늘 일하다가 문득 ${context.player.name} 생각이 났어. 별일은 아니었는데 연락이 기다려지더라. 너는?`},{id:"her-day-2",text:"조금 바쁜 하루였어. 그래도 지금 이렇게 이야기하니까 하루가 정리되는 기분이야."},{id:"her-day-3",text:"점심 먹고 잠깐 산책했어. 다음에는 너랑 같이 걷고 싶다는 생각도 했고."}],session),effects:{affection:4,trust:2},topic:"daily"};
  return null;
}

export function getContextualOpening(context) {
  const name = context.girlfriend.name;
  const playerName = context.player.name ?? "자기";
  const initiated = context.recentInitiatedMessages?.at(-1);
  if (initiated?.day === context.day) return `${name}: ${initiated.text}`;
  const latestTemptation = context.recentTemptations.at(-1);
  if (latestTemptation?.choiceId === "secret") return `${name}: 요즘 나한테 숨기는 거 있어? 왠지 느낌이 이상해.`;
  if (context.recentGifts.length) return `${name}: 선물 고마워. 오늘도 그때 생각이 났어.`;
  if (context.relationship.trust < 350) return `${name}: 오늘은 왜 이렇게 연락이 늦었어? 솔직하게 말해 줘.`;
  if (context.player.fatigue >= 70) return `${name}: 많이 지쳐 보여. 오늘은 무리하지 않았으면 좋겠어.`;
  if (context.relationship.affection > 700) return `${name}: 오늘 네 목소리 듣고 싶었는데, 잘 지냈어?`;
  return `${name}: ${playerName}, 뭐 해? 오늘 하루는 어땠어?`;
}

export function generateContextualReply(context, message) {
  const text = String(message ?? "").trim();
  if (!text) return null;
  const latestMemory = context.importantMemories?.at(0);
  const previousTurn = context.recentConversation?.at(-1);
  if (previousTurn && /기억|아까|전에|방금/.test(text)) {
    const previousMessage = previousTurn.user.replace(/\s+/g, " ").slice(0, 42);
    return { text:`응, 기억해. 아까 네가 “${previousMessage}”라고 말해 줬잖아.`, effects:{ affection:3, trust:5 } };
  }
  if(context.girlfriend.heroineId==="haeun")return getHaeunMessageReply(context,text);
  const contextual=sessionAwareReply(context,text);if(contextual)return contextual;
  const voice=context.girlfriend.heroineId==="nari"?{listen:"응, 나도 네 이야기 더 듣고 싶어. 그리고 내 얘기도 해도 돼?",love:"나도 좋아해! 그렇게 말해 주니까 오늘 하루가 환해지는 것 같아."}:context.girlfriend.heroineId==="sejin"?{listen:"그래, 계속 말해 봐. 네 생각을 솔직하게 듣고 싶어.",love:"그 말은 가볍게 듣지 않을게. 나도 네가 많이 소중해."}:{listen:"응, 계속 말해 줘. 오늘 네 이야기를 더 듣고 싶어.",love:"나도 많이 좋아해. 오늘은 그 말이 더 듣고 싶었어."};
  if (/미안|사과/.test(text)) return { text:context.relationship.trust < 450 ? "말해 줘서 고마워. 행동으로도 보여 줬으면 좋겠어." : "괜찮아. 솔직하게 말해 줘서 고마워.", effects:{ affection:4, trust:8 } };
  if (/사랑|좋아해/.test(text)) return { text:context.relationship.affection >= 650 ? voice.love : "고마워. 우리 천천히 더 가까워지자.", effects:{ affection:9, trust:3 } };
  if (/힘들|피곤|지쳤/.test(text)) return { text:"많이 힘들었구나. 오늘은 내가 네 편이 되어 줄게.", effects:{ affection:5, trust:7, stress:-4 } };
  if (latestMemory?.type === "gift") return { text:`응, 듣고 있어. 그리고 ${latestMemory.summary}도 아직 고맙게 기억하고 있어.`, effects:{ affection:4, trust:2 } };
  if (context.relationship.trust < 350) return { text:"무슨 말인지 알겠어. 그래도 지금은 조금 더 솔직한 얘기가 필요해.", effects:{ affection:1, trust:2 } };
  if(/오늘|하루|어땠/.test(text))return {text:context.phase>=2?"오늘은 조금 바빴지만 네 연락을 기다렸어. 너는 어떤 하루였어?":"아직 하루가 남았지만, 지금 이렇게 이야기하니 마음이 놓여.",effects:{affection:3,trust:3}};
  if(/데이트|만나|보고\s*싶/.test(text))return {text:"나도 만나고 싶어. 이번에는 서두르지 말고 우리 둘 다 좋아할 곳을 골라 보자.",effects:{affection:5,excitement:5}};
  return { text:voice.listen, effects:{ affection:3, trust:3 } };
}

export function recordConversationTurn(state, userMessage, assistantMessage,details={}) {
  state.conversationHistory ??= [];
  const turn = { day:state.day, phase:state.phase, user:String(userMessage), assistant:String(assistantMessage),mode:details.mode??"message",tone:details.tone??"safe" };
  state.conversationHistory.push(turn);
  if (state.conversationHistory.length > 40) state.conversationHistory.splice(0, state.conversationHistory.length - 40);
  return turn;
}
