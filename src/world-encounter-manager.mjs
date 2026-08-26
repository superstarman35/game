export const WORLD_REPEAT_ENCOUNTER_CHANCE = 0.5;
export const MINJUN_ENCOUNTER_CHANCE = 0.5;
export const JAEMIN_ENCOUNTER_CHANCE = 0.3;
export const JUNHO_ENCOUNTER_CHANCE = 0.3;
export const WORLD_LATE_NIGHT_MINUTES = 22 * 60;
export const WORLD_EVENING_START_MINUTES = 19 * 60;
export const YURI_REUNION_EVENT_ID = "situation-ex-girlfriend-reunion";

const MINJUN_LOCATIONS = new Set(["lake-promenade","mountain-trail"]);
const JAEMIN_LOCATIONS = new Set(["prime-gym","boxing-studio","protein-cafe"]);
const supportiveChoice=(id,label,response)=>Object.freeze({id,label,response,npcEffects:Object.freeze({affection:3,trust:3})});
const cautiousChoice=(id,label,response)=>Object.freeze({id,label,response,npcEffects:Object.freeze({affection:1,trust:4})});

export const MINJUN_CONCERNS = Object.freeze([
  Object.freeze({id:"first-impression",question:"예전부터 알고 지낸 사람이 있는데, 다시 연락해도 부담스럽지 않을까?",message:"민준은 자신보다 먼저 알게 된 한 여자를 오래 좋아해 왔다며 조심스럽게 고민을 꺼냈다.",choices:Object.freeze([
    supportiveChoice("honest-greeting","부담 없는 안부부터 솔직하게 물어보라고 한다","상대의 현재 생활을 존중하면서 짧은 안부부터 시작하라는 조언에 민준이 고개를 끄덕였다."),
    cautiousChoice("check-distance","먼저 지금 편하게 연락할 수 있는 사이인지 확인하라고 한다","오래 알았다는 사실보다 지금의 거리를 먼저 확인하라는 말에 민준은 서두르지 않기로 했다.")
  ])}),
  Object.freeze({id:"slow-replies",question:"답장은 다정한데 늘 늦어. 바쁜 건지 일부러 거리를 두는 건지 모르겠어.",message:"그녀는 일과 사람을 세심하게 챙기는 성격이라 답장이 늦어도 말투는 늘 따뜻하다고 했다.",choices:Object.freeze([
    supportiveChoice("ask-timing","답장 속도를 해석하지 말고 편한 연락 시간을 직접 물어보라고 한다","추측 대신 서로 편한 시간을 묻는 게 낫다는 답에 민준은 메시지를 고쳐 쓰기로 했다."),
    cautiousChoice("give-space","며칠 여유를 두고 상대가 먼저 연락할 공간을 주라고 한다","관심을 확인하려 재촉하지 말라는 말에 민준은 한발 물러서 보기로 했다.")
  ])}),
  Object.freeze({id:"favorite-things",question:"꽃이나 비싼 선물보다 작은 약속을 기억해 주는 걸 더 좋아하는 사람 같아. 뭘 해 주는 게 좋을까?",message:"민준은 그녀가 화려한 것보다 함께 정한 시간과 사소한 기억을 소중히 여긴다고 말했다.",choices:Object.freeze([
    supportiveChoice("remember-detail","전에 했던 말을 기억해 실용적인 작은 선물을 고르라고 한다","가격보다 기억이 담긴 선택이 좋다는 조언에 민준은 예전에 들었던 말을 떠올렸다."),
    cautiousChoice("no-gift-yet","선물보다 먼저 편하게 만날 수 있는 시간을 물어보라고 한다","관계를 앞서가는 선물은 부담이 될 수 있다는 답에 민준은 약속부터 확인하기로 했다.")
  ])}),
  Object.freeze({id:"workplace-hint",question:"요즘 프리랜서 일 때문에 마감이 들쭉날쭉하대. 힘들 때 내가 도와주겠다고 해도 될까?",message:"그녀가 집과 공유 작업실을 오가며 혼자 마감을 감당한다는 이야기가 나왔다.",choices:Object.freeze([
    supportiveChoice("specific-help","막연히 돕겠다고 하지 말고 필요한 일이 있는지 구체적으로 물으라고 한다","선택권을 주는 구체적인 도움이라면 부담이 덜하다는 말에 민준이 납득했다."),
    cautiousChoice("respect-work","일을 해결해 주려 하지 말고 쉬는 시간을 존중하라고 한다","능력을 대신 증명하려 들지 말라는 조언에 민준은 응원만 전하기로 했다.")
  ])}),
  Object.freeze({id:"known-before",question:"사실 그 사람은 네가 이 동네에 오기 전부터 내가 알던 사이야. 그런데 요즘 누굴 만나는지는 모르겠어.",message:"민준은 자신이 플레이어보다 먼저 그녀를 알았지만, 현재 연애 여부는 한 번도 묻지 못했다고 털어놓았다.",choices:Object.freeze([
    supportiveChoice("ask-status","마음을 말하기 전에 현재 만나는 사람이 있는지 먼저 확인하라고 한다","상대의 현재 관계를 확인하는 게 먼저라는 답에 민준은 신중해졌다."),
    cautiousChoice("direct-question","공통 지인을 떠보지 말고 본인에게 직접 예의를 갖춰 물으라고 한다","소문으로 관계를 판단하지 말라는 말에 민준은 직접 대화할 기회를 기다리기로 했다.")
  ])}),
  Object.freeze({id:"purple-hair-hint",question:"짙은 보랏빛 머리가 잘 어울리고 웃을 때 손을 머리카락에 대는 버릇이 있어. 자꾸 그 모습이 생각나.",message:"민준이 묘사한 습관은 하은의 평소 모습과 이상할 만큼 닮아 있었다.",choices:Object.freeze([
    supportiveChoice("see-person","겉모습보다 그 사람이 지금 원하는 관계를 먼저 보라고 한다","좋아하는 장면에만 머물지 말라는 답에 민준의 표정이 조금 진지해졌다."),
    cautiousChoice("avoid-idealizing","오래 좋아했다는 이유로 상대를 이상화하지 말라고 한다","기억 속 모습과 현재의 사람은 다를 수 있다는 조언에 민준이 한동안 생각에 잠겼다.")
  ])}),
  Object.freeze({id:"stable-personality",question:"겉으로는 안정적이고 다정한데, 관계가 불안해지면 혼자 참고 거리를 두는 편이야. 어떻게 안심시킬 수 있을까?",message:"민준이 말하는 성향은 플레이어가 알고 있는 하은의 관계 방식과도 겹쳤다.",choices:Object.freeze([
    supportiveChoice("consistent-action","큰 고백보다 약속을 지키는 일관된 행동이 먼저라고 한다","말보다 반복되는 행동이 신뢰를 만든다는 답에 민준이 메모하듯 되뇌었다."),
    cautiousChoice("dont-fix","불안을 대신 해결하려 하지 말고 원하는 방식을 물어보라고 한다","상대의 감정을 고치려 들지 말라는 조언에 민준이 고개를 숙였다.")
  ])}),
  Object.freeze({id:"haeun-schedule-hint",question:"요즘 저녁이면 자주 연락이 끊겨. 가족을 만난다고도 하고, 중요한 사람이 있다고도 했어. 기다려야 할까?",message:"중요한 사람이 있다는 말에 플레이어는 더 이상 우연이라고 넘기기 어려운 느낌을 받았다.",choices:Object.freeze([
    supportiveChoice("respect-boundary","이미 중요한 사람이 있다면 경계를 존중하고 먼저 물러나라고 한다","상대의 애매한 말도 경계일 수 있다는 답에 민준은 쉽게 대답하지 못했다."),
    cautiousChoice("one-question","한 번만 분명히 묻고 답을 회피하면 더 접근하지 말라고 한다","확인 뒤에는 결과를 받아들여야 한다는 말에 민준은 마지막 질문을 준비했다.")
  ])}),
  Object.freeze({id:"name-initial",question:"이름은 두 글자고 ‘하’로 시작해. 친구들은 차분하지만 마음이 여린 사람이라고 하더라. 혹시 너도 아는 사람일까?",message:"민준이 말한 단서가 하나의 이름을 가리켰다. 이제 플레이어는 그 여자가 하은이라는 사실을 거의 확신했다.",choices:Object.freeze([
    supportiveChoice("ask-directly","다음에는 이름을 숨기지 말고 누구인지 정확히 말해 달라고 한다","에둘러 말할수록 모두에게 상처가 될 수 있다는 답에 민준은 다음 만남에는 솔직해지겠다고 했다."),
    cautiousChoice("stop-advice","상대가 누군지 확인되기 전에는 더 이상 조언하기 어렵다고 선을 긋는다","플레이어가 선을 긋자 민준은 미안하다며 다음에는 사실을 모두 밝히겠다고 했다.")
  ])}),
  Object.freeze({id:"haeun-reveal",question:"내가 좋아하는 사람은 하은이야. 오래전부터 알았고 아직 남자친구가 있는지는 몰라. 네가 아는 하은과 같은 사람 맞지?",message:"민준의 입에서 결국 하은의 이름이 나왔다. 그동안 들었던 모든 고민이 플레이어의 여자친구를 향하고 있었다.",choices:Object.freeze([
    Object.freeze({id:"final-boundary",label:"내 여자친구 하은이야. 다시는 나에게 그 이야기를 하지 않았으면 좋겠다.",response:"민준은 충격을 감추지 못했지만 곧 사과했다. 그는 더 이상 하은에 관한 고민을 꺼내거나 두 사람 앞에 나타나지 않겠다고 약속했다.",npcEffects:Object.freeze({affection:-20,trust:-10})})
  ])})
]);

export const JAEMIN_QUIZZES = Object.freeze({
  "prime-gym":Object.freeze([
    Object.freeze({id:"gym-warmup",question:"웨이트 트레이닝 전 가장 적절한 준비는?",choices:Object.freeze(["가벼운 유산소와 관절 가동성 운동","바로 최대 중량 들기","정적 스트레칭만 20분 하기"]),answer:0,explanation:"체온을 올리고 관절을 움직인 뒤 낮은 중량으로 준비 세트를 하면 부상 위험을 줄일 수 있어."}),
    Object.freeze({id:"gym-progressive-overload",question:"근육과 근력을 계속 키우기 위한 핵심 원리는?",choices:Object.freeze(["매번 같은 중량만 반복하기","점진적으로 중량·횟수·세트 중 하나를 높이기","매일 전신을 실패 지점까지 훈련하기"]),answer:1,explanation:"점진적 과부하는 회복 가능한 범위에서 훈련 자극을 조금씩 높이는 방식이야."}),
    Object.freeze({id:"gym-form",question:"스쿼트 중 자세가 무너지기 시작하면 어떻게 해야 할까?",choices:Object.freeze(["반동으로 남은 횟수를 채운다","속도를 더 빠르게 한다","중량이나 반복 수를 낮추고 자세를 다시 잡는다"]),answer:2,explanation:"목표 반복 수보다 안전한 자세가 먼저야. 자세가 깨지면 강도를 낮추는 게 맞아."}),
    Object.freeze({id:"gym-rest",question:"고강도 근력 운동 후 같은 근육을 다시 강하게 훈련하기 전 필요한 것은?",choices:Object.freeze(["충분한 회복 시간","무조건 다음 날 같은 운동","수분 섭취 금지"]),answer:0,explanation:"근육은 운동 중이 아니라 회복 과정에서 적응하므로 수면과 휴식이 중요해."}),
    Object.freeze({id:"gym-breath",question:"무거운 동작을 할 때 기본적인 호흡 원칙은?",choices:Object.freeze(["세트 내내 숨을 참는다","동작에 맞춰 복압을 만들고 통제해서 호흡한다","가능한 한 빠르게 얕게 쉰다"]),answer:1,explanation:"복압은 몸통을 안정시키지만 무리하게 오래 숨을 참지 말고 동작에 맞춰 통제해야 해."})
  ]),
  "boxing-studio":Object.freeze([
    Object.freeze({id:"boxing-guard",question:"기본 가드를 유지하는 가장 큰 이유는?",choices:Object.freeze(["팔을 빨리 피곤하게 하려고","시야를 가리려고","턱과 몸을 보호하고 다음 동작을 준비하려고"]),answer:2,explanation:"손은 턱 가까이 두고 시야는 열어 둬야 공격 뒤에도 바로 방어할 수 있어."}),
    Object.freeze({id:"boxing-stance",question:"복싱 기본 스탠스에서 중요한 것은?",choices:Object.freeze(["균형을 유지하며 어느 방향으로도 움직일 수 있기","두 발을 완전히 붙이기","뒤꿈치에 체중을 전부 싣기"]),answer:0,explanation:"발 간격과 체중 배분이 안정적이어야 공격과 방어 뒤에도 균형을 잃지 않아."}),
    Object.freeze({id:"boxing-jab",question:"잽의 주된 역할로 가장 적절한 것은?",choices:Object.freeze(["항상 한 방에 끝내기","거리 측정과 견제, 다음 공격 연결","눈을 감고 전진하기"]),answer:1,explanation:"잽은 거리와 리듬을 만들고 상대 반응을 확인하는 가장 기본적인 펀치야."}),
    Object.freeze({id:"boxing-defense",question:"펀치를 피한 직후 가장 먼저 해야 할 일은?",choices:Object.freeze(["자세와 가드로 복귀하기","상대에게 등을 보이기","발을 멈추고 눈을 감기"]),answer:0,explanation:"회피 뒤 중심과 가드를 되찾아야 후속 공격이나 반격에 대응할 수 있어."}),
    Object.freeze({id:"boxing-wrap",question:"핸드랩을 감는 이유는?",choices:Object.freeze(["글러브를 크게 보이게 하려고","손목과 손 관절을 지지하려고","주먹을 더 무겁게 만들려고"]),answer:1,explanation:"핸드랩은 손목과 중수골을 지지해 반복 충격에서 손을 보호해 줘."})
  ]),
  "protein-cafe":Object.freeze([
    Object.freeze({id:"protein-purpose",question:"단백질의 주요 역할은?",choices:Object.freeze(["근육을 포함한 신체 조직의 회복과 구성","수분을 완전히 대체","운동 없이 지방을 즉시 제거"]),answer:0,explanation:"단백질은 근육뿐 아니라 여러 조직과 효소·호르몬을 구성하는 영양소야."}),
    Object.freeze({id:"protein-distribution",question:"하루 단백질 섭취 방법으로 일반적으로 더 나은 것은?",choices:Object.freeze(["한 끼에 전부 몰아 먹기","여러 끼에 적절히 나눠 먹기","운동하지 않는 날에는 전혀 먹지 않기"]),answer:1,explanation:"개인 필요량을 여러 끼에 나누면 소화 부담을 줄이고 꾸준히 공급할 수 있어."}),
    Object.freeze({id:"protein-whole-food",question:"프로틴 보충제에 대한 올바른 설명은?",choices:Object.freeze(["일반 식사를 모두 대체해야 한다","많이 먹을수록 무조건 근육이 커진다","필요량을 채우기 어려울 때 편리하게 보완할 수 있다"]),answer:2,explanation:"보충제는 말 그대로 보완 수단이야. 기본은 균형 잡힌 식사와 총섭취량이야."}),
    Object.freeze({id:"protein-recovery",question:"운동 후 회복에 단백질과 함께 중요한 것은?",choices:Object.freeze(["충분한 수면과 전체 에너지 섭취","밤새 깨어 있기","수분 제한"]),answer:0,explanation:"단백질만으로 회복이 끝나지 않아. 수면·수분·탄수화물과 총열량도 중요해."}),
    Object.freeze({id:"protein-individual",question:"적절한 단백질 섭취량을 정할 때 고려할 것은?",choices:Object.freeze(["광고 문구 하나","체중·활동량·건강 상태와 식습관","친구가 먹는 양만 그대로 따라 하기"]),answer:1,explanation:"필요량은 개인차가 크고 신장 질환 등 건강 문제가 있다면 전문가 상담이 우선이야."})
  ])
});

export const JUNHO_PARTNER_INSIGHTS = Object.freeze([
  Object.freeze({id:"mbti",text:state=>`${state.partner.name}은 ${state.partner.mbti} 성향이라, 감정을 몰아붙이는 대화보다 생각을 정리할 시간을 주는 편이 좋아.`}),
  Object.freeze({id:"contact",text:state=>`${state.partner.name}은 연락 횟수 자체보다 바쁜 날에도 짧게 상황을 알려 주는 태도를 중요하게 생각해.`}),
  Object.freeze({id:"romance",text:state=>`${state.partner.name}은 비싼 장소보다 둘만 기억하는 작은 약속과 준비된 시간을 더 오래 기억하는 편이야.`}),
  Object.freeze({id:"trust",text:state=>`지금 ${state.partner.name}은 네가 숨기지 않고 먼저 설명해 줄 때 가장 안심하는 것 같아.`}),
  Object.freeze({id:"gift",text:state=>`${state.partner.name}에게 선물할 땐 가격보다 전에 했던 말을 기억해서 고르는 게 훨씬 효과가 좋아.`}),
  Object.freeze({id:"stress",text:state=>`${state.partner.name}은 힘들 때 해결책부터 듣기보다 먼저 자기 편이 되어 주길 원하는 편이야.`}),
  Object.freeze({id:"jealousy",text:state=>`${state.partner.name}은 질투가 나도 바로 따지기보다 혼자 참을 수 있어. 애매한 관계는 미리 설명하는 게 좋아.`}),
  Object.freeze({id:"future",text:state=>`${state.partner.name}이 원하는 건 거창한 미래 약속보다 내일도 같은 태도로 곁에 있을 거라는 확신이야.`}),
  Object.freeze({id:"emotion",text:state=>`요즘 ${state.partner.name}은 네가 자기를 좋아하는지보다 관계를 우선순위에 두고 있는지를 더 보고 있어.`}),
  Object.freeze({id:"wish",text:state=>`${state.partner.name}이 지금 가장 원하는 건 평가나 조언 없이 자기 하루를 끝까지 들어 주는 시간이야.`})
]);

const ENCOUNTERS = Object.freeze({
  yuriCafe:Object.freeze({id:"repeat-yuri-cafe",routeType:"standard",chance:WORLD_REPEAT_ENCOUNTER_CHANCE,npcId:"player-ex",npcName:"유리",title:"카페 모퉁이에서 다시 만난 유리",message:"익숙한 창가 자리에 앉아 있던 유리가 먼저 눈을 맞추고 조용히 인사했다.",question:"유리와 잠시 어떤 시간을 보낼까?",choices:Object.freeze([
    Object.freeze({id:"greet",label:"안부를 나누고 요즘 지내는 이야기를 듣는다",response:"부담스럽지 않게 안부를 나누자 유리의 표정이 한결 편안해졌다.",npcEffects:Object.freeze({affection:5,trust:2,interestInPlayer:2})}),
    Object.freeze({id:"coffee",label:"커피를 함께 마시며 조금 더 이야기한다",response:"짧은 커피 한 잔이었지만 예전보다 솔직한 대화가 이어졌다.",npcEffects:Object.freeze({affection:8,trust:3,interestInPlayer:4})})
  ])}),
  yujinNightFood:Object.freeze({id:"repeat-yujin-night-food",routeType:"standard",chance:WORLD_REPEAT_ENCOUNTER_CHANCE,npcId:"female-coworker",npcName:"유진",title:"심야 포차거리에서 만난 유진",message:"퇴근 뒤 혼자 야식을 고르던 유진이 나를 발견하고 반갑게 손을 흔들었다.",question:"늦은 시간에 만난 유진에게 어떻게 할까?",choices:Object.freeze([
    Object.freeze({id:"coworker-talk",label:"근처에 앉아 회사 이야기를 나눈다",response:"업무 중에는 하지 못했던 이야기를 편하게 나누며 동료로서 가까워졌다.",npcEffects:Object.freeze({affection:5,trust:4,interestInPlayer:2})}),
    Object.freeze({id:"late-snack",label:"야식을 함께 먹으며 개인적인 안부를 묻는다",response:"늦은 야식을 함께하며 서로의 일상에 대해 조금 더 알게 됐다.",npcEffects:Object.freeze({affection:8,trust:3,interestInPlayer:5})})
  ])})
});

export function createWorldEncounterRoutes(){return {version:1,minjun:{step:0,completed:false},jaemin:{answered:{"prime-gym":[],"boxing-studio":[],"protein-cafe":[]},correctCount:0,helpOffered:false},junho:{seen:[]}};}
export function migrateWorldEncounterRoutes(value){const initial=createWorldEncounterRoutes(),source=value&&typeof value==="object"?value:{};return {version:1,minjun:{step:Math.max(0,Math.min(MINJUN_CONCERNS.length,Math.round(Number(source.minjun?.step)||0))),completed:Boolean(source.minjun?.completed)},jaemin:{answered:Object.fromEntries(Object.keys(initial.jaemin.answered).map(id=>[id,Array.isArray(source.jaemin?.answered?.[id])?source.jaemin.answered[id].filter(item=>typeof item==="string").slice(0,5):[]])),correctCount:Math.max(0,Math.round(Number(source.jaemin?.correctCount)||0)),helpOffered:Boolean(source.jaemin?.helpOffered)},junho:{seen:Array.isArray(source.junho?.seen)?source.junho.seen.filter(item=>typeof item==="string").slice(0,JUNHO_PARTNER_INSIGHTS.length):[]}};}
export function validateWorldEncounterRoutes(value){return Boolean(value&&value.version===1&&Number.isInteger(value.minjun?.step)&&typeof value.minjun?.completed==="boolean"&&value.jaemin?.answered&&Object.values(value.jaemin.answered).every(Array.isArray)&&Number.isInteger(value.jaemin.correctCount)&&typeof value.jaemin.helpOffered==="boolean"&&Array.isArray(value.junho?.seen));}
function ensureRoutes(state){state.worldEncounterRoutes=migrateWorldEncounterRoutes(state.worldEncounterRoutes);return state.worldEncounterRoutes;}

export function hasCompletedYuriReunion(state){const saved=state?.situationEventStates?.[YURI_REUNION_EVENT_ID];return saved?.status==="COMPLETED"||Boolean(state?.storyFlags?.[`${YURI_REUNION_EVENT_ID}:COMPLETED`]);}
export function getNightOutingContext(minutes,partnerName="여자친구"){const alone=Number(minutes)>=WORLD_LATE_NIGHT_MINUTES;const name=String(partnerName),last=name.charCodeAt(name.length-1),hasBatchim=last>=0xac00&&last<=0xd7a3&&(last-0xac00)%28!==0;return {alone,message:alone?"나혼자 외출 나왔다.":`${name}${hasBatchim?"이와":"와"} 같이 데이트/외출을 나왔다.`};}
export function shouldShowPartnerAtWorldLocation(minutes){return Number(minutes)>=19*60&&Number(minutes)<WORLD_LATE_NIGHT_MINUTES;}

function createMinjunEncounter(state,location){if(state.partner?.heroineId!=="haeun")return null;const route=ensureRoutes(state).minjun;if(route.completed||route.step>=MINJUN_CONCERNS.length)return null;const concern=MINJUN_CONCERNS[route.step];return {id:`minjun-concern-${concern.id}`,routeType:"minjun",chance:MINJUN_ENCOUNTER_CHANCE,locationId:location.id,npcId:"male-rival",npcName:"민준",title:`민준의 고민 ${route.step+1} / ${MINJUN_CONCERNS.length}`,message:concern.message,question:concern.question,questionId:concern.id,step:route.step,final:route.step===MINJUN_CONCERNS.length-1,choices:concern.choices};}
function createJaeminEncounter(state,location,random){const route=ensureRoutes(state).jaemin,questions=JAEMIN_QUIZZES[location.id]??[],answered=new Set(route.answered[location.id]??[]),remaining=questions.filter(item=>!answered.has(item.id));if(!remaining.length)return null;const quiz=remaining[Math.floor((Number(random())||0)*remaining.length)%remaining.length];return {id:`jaemin-quiz-${quiz.id}`,routeType:"jaemin",chance:JAEMIN_ENCOUNTER_CHANCE,locationId:location.id,npcId:"gym-trainer",npcName:"재민",title:`재민의 ${location.id==="prime-gym"?"헬스":location.id==="boxing-studio"?"복싱":"단백질"} 퀴즈`,message:`재민이 ${location.name}에서 운동 팁을 알려 주겠다며 문제를 냈다.`,question:quiz.question,questionId:quiz.id,choices:quiz.choices.map((label,index)=>({id:`answer-${index}`,label,response:index===quiz.answer?`정답이야. ${quiz.explanation}`:`아쉽지만 정답은 “${quiz.choices[quiz.answer]}”야. ${quiz.explanation}`,correct:index===quiz.answer,npcEffects:index===quiz.answer?{affection:4,trust:3}:{affection:1}}))};}
function createJunhoEncounter(state,location){const route=ensureRoutes(state).junho,insight=JUNHO_PARTNER_INSIGHTS.find(item=>!route.seen.includes(item.id));if(!insight)return null;return {id:`junho-insight-${insight.id}`,routeType:"junho",chance:JUNHO_ENCOUNTER_CHANCE,locationId:location.id,npcId:"drinking-friend",npcName:"준호",title:"클럽 네온에서 만난 준호",message:"바를 정리하던 준호가 음악 소리 사이로 여자친구에 대해 알아 둬야 할 이야기가 있다며 가까이 불렀다.",question:insight.text(state),questionId:insight.id,choices:[{id:"thanks",label:"고마워.",response:"준호는 도움이 됐다면 됐다며 다음에도 솔직한 이야기를 전해 주겠다고 했다.",npcEffects:{affection:4,trust:3}},{id:"decline",label:"안 알려줘도 돼.",response:"준호는 연인에 관한 일은 직접 알아 가고 싶다는 뜻을 존중했지만 조금 머쓱한 표정을 지었다.",npcEffects:{affection:-2,trust:1}}]};}

export function rollRepeatWorldEncounter(state,location,minutes,random=Math.random){if(state?.gameMode!=="free-romance"||!location)return null;const time=Number(minutes),evening=time>=WORLD_EVENING_START_MINUTES;let encounter=null;if(location.id==="small-cafe"&&hasCompletedYuriReunion(state))encounter={...structuredClone(ENCOUNTERS.yuriCafe),locationId:location.id};else if(location.id==="night-food"&&time>=WORLD_LATE_NIGHT_MINUTES)encounter={...structuredClone(ENCOUNTERS.yujinNightFood),locationId:location.id};else if(evening&&MINJUN_LOCATIONS.has(location.id))encounter=createMinjunEncounter(state,location);else if(evening&&JAEMIN_LOCATIONS.has(location.id))encounter=createJaeminEncounter(state,location,random);else if(evening&&location.id==="neon-club")encounter=createJunhoEncounter(state,location);if(!encounter||random()>encounter.chance)return null;return structuredClone(encounter);}

export function resolveRepeatWorldEncounter(state,encounter,choiceId){const choice=encounter?.choices?.find(item=>item.id===choiceId),npc=(state?.npcs??[]).find(item=>item.id===encounter?.npcId);if(!choice||!npc)return null;npc.active=true;const applied={};for(const [key,amount] of Object.entries(choice.npcEffects??{})){const before=Number(npc[key])||0;npc[key]=Math.max(0,Math.min(100,before+(Number(amount)||0)));applied[key]=npc[key]-before;}const routes=ensureRoutes(state);let followUpMessage="";if(encounter.routeType==="minjun"){routes.minjun.step=Math.max(routes.minjun.step,Number(encounter.step)+1);if(encounter.final||routes.minjun.step>=MINJUN_CONCERNS.length){routes.minjun.completed=true;npc.storyState="haeun-boundary-closed";npc.active=false;followUpMessage="민준과의 하은 관련 상담은 끝났습니다. 이후 호수 산책로와 남산 산책길에서 민준은 더 이상 등장하지 않습니다.";}}else if(encounter.routeType==="jaemin"){const answered=routes.jaemin.answered[encounter.locationId]??(routes.jaemin.answered[encounter.locationId]=[]);if(!answered.includes(encounter.questionId))answered.push(encounter.questionId);if(choice.correct)routes.jaemin.correctCount+=1;const relationshipIndex=Math.round(((Number(npc.affection)||0)+(Number(npc.trust)||0))/2);if(!routes.jaemin.helpOffered&&routes.jaemin.correctCount>=8&&relationshipIndex>=55&&npc.affection>=60){routes.jaemin.helpOffered=true;npc.storyState="personal-training-offered";followUpMessage="재민: 문제를 제대로 이해하고 있네. 다음부터 헬스하러 오면 내가 자세도 봐주고 네게 맞는 운동 루틴도 같이 짜 줄게.";}}else if(encounter.routeType==="junho"){if(!routes.junho.seen.includes(encounter.questionId))routes.junho.seen.push(encounter.questionId);}state.worldEncounterHistory??=[];const record={id:encounter.id,day:state.day,minutes:Number(state.nightState?.minutes)||0,locationId:encounter.locationId,npcId:npc.id,choiceId,questionId:encounter.questionId??null,correct:choice.correct??null,effects:applied};state.worldEncounterHistory.push(record);state.worldEncounterHistory=state.worldEncounterHistory.slice(-120);state.npcHistory??=[];state.npcHistory.push({day:state.day,phase:state.phase,actionId:encounter.id,npcId:npc.instanceId,effects:applied});return {encounter,choice,npc,effects:applied,record,followUpMessage,routes};}
