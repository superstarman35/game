import { YUNA_STORY_EVENTS } from "./yuna-data.mjs";

const CATEGORY_CONFIG = {
  romance:{label:"연애·데이트",npcRole:"girlfriend",backgrounds:["home-morning","cafe-rain-evening","river-night","home-night"],bgm:"theme",baseEffects:{affection:4,excitement:3}},
  temptation:{label:"유진·유혹",npcRole:"female-coworker",npcName:"유진",backgrounds:["office-day","cafe-rain-evening","river-night","home-night"],bgm:"crisis",baseEffects:{trust:-2,excitement:5,relationshipStress:2}},
  conflict:{label:"갈등·질투",npcRole:"girlfriend",backgrounds:["home-morning","cafe-rain-evening","river-night","home-night"],bgm:"crisis",baseEffects:{conflict:3,relationshipStress:3}},
  work:{label:"직장",npcRole:"team-lead",backgrounds:["office-day","office-day","cafe-rain-evening","home-night"],bgm:"daily",baseEffects:{work:3,stress:2}},
  friends:{label:"친구·인간관계",npcRole:"best-friend",backgrounds:["cafe-rain-evening","river-night","cafe-rain-evening","home-night"],bgm:"daily",baseEffects:{social:4}},
  money:{label:"돈·쇼핑",npcRole:"girlfriend",backgrounds:["office-day","cafe-rain-evening","river-night","home-night"],bgm:"daily",baseEffects:{stress:2}},
  travel:{label:"여행·특별",npcRole:"girlfriend",backgrounds:["home-morning","river-night","cafe-rain-evening","home-night"],bgm:"theme",baseEffects:{affection:5,excitement:6,energy:-3}},
  mystery:{label:"미스터리·비밀",npcRole:"girlfriend",backgrounds:["office-day","cafe-rain-evening","river-night","home-night"],bgm:"crisis",baseEffects:{trust:-2,relationshipStress:3}}
};

const BLUEPRINTS = [
  ["midnight-drive","계획 없던 심야 드라이브","romance",2,12,"갑자기 바다가 보고 싶다는 메시지가 왔다.","내일 일정과 지금의 설렘 사이에서 망설였다.","연인은 목적지보다 함께 나선 사실이 좋았다고 말했다.","새벽의 편의점 불빛 아래 다음 즉흥 여행을 약속했다."],
  ["front-door-surprise","집 앞의 갑작스러운 방문","romance",3,13,"초인종 너머로 연인의 목소리가 들렸다.","정리되지 않은 방과 마음을 동시에 들킨 기분이었다.","연인은 얼굴을 보고 안심하고 싶었다고 털어놓았다.","짧은 방문은 평범한 집을 둘만의 장소로 바꿨다."],
  ["shared-umbrella","우산 하나로 걷는 귀갓길","romance",4,15,"퇴근길 폭우 속에 우산은 하나뿐이었다.","가까워진 거리만큼 말하지 못한 서운함도 선명해졌다.","연인은 비 오는 날 혼자 기다렸던 기억을 꺼냈다.","젖은 어깨를 닦아 주며 다음 비에는 먼저 연락하기로 했다."],
  ["drunk-pickup","취한 연인을 데리러 가는 밤","romance",6,18,"낯선 번호로 연인을 데리러 와 달라는 전화가 왔다.","술집 앞에서 웃는 얼굴 뒤의 지친 표정을 발견했다.","연인은 늘 괜찮은 척하는 것이 힘들었다고 고백했다.","집 앞에서 건넨 물 한 병과 짧은 포옹이 오래 남았다."],
  ["fine-dining-truth","고급 레스토랑의 솔직한 계산","romance",9,22,"예약하기 어려운 레스토랑의 창가 자리가 준비됐다.","화려한 코스와 부담스러운 가격 사이에 침묵이 길어졌다.","연인은 비싼 식사보다 감추지 않는 형편을 원한다고 말했다.","계산서보다 서로의 기준을 나눈 대화가 더 선명했다."],
  ["future-night-talk","DAY 후반의 미래 대화","romance",22,30,"잠들기 전 통화가 자연스럽게 미래 이야기로 흘렀다.","사는 곳과 일, 결혼의 속도가 서로 다를 수 있음을 알았다.","연인은 정답보다 함께 조정할 의지가 있는지 물었다.","통화를 끊은 뒤 둘만의 미래 목록이 휴대폰에 남았다."],

  ["coworker-private-drink","동료와 단둘이 마시는 술","temptation",8,24,"퇴근 직전 여성 동료가 조용히 한잔하자고 제안했다.","회사 농담은 연애와 외로움에 대한 질문으로 깊어졌다.","동료는 좋아하면 안 되는 사람을 좋아한 것 같다고 말했다.","귀가 뒤 비밀로 해 달라는 메시지가 도착했다."],
  ["team-dinner-spark","회식 자리의 가까운 거리","temptation",7,21,"회사 회식에서 우연히 여성 동료 옆자리에 앉았다.","취기가 오르자 서로의 이상형을 묻는 분위기가 됐다.","동료는 대답 대신 플레이어를 오래 바라봤다.","단체 사진 속 둘의 거리가 소문의 씨앗으로 남았다."],
  ["almost-confession","고백에 가까운 퇴근 메시지","temptation",11,26,"서브 히로인에게 오늘은 특별히 보고 싶었다는 메시지가 왔다.","농담으로 넘기려 할수록 상대의 말은 진지해졌다.","그녀는 대답을 요구하지 않겠다며 마음만 알아 달라고 했다.","읽음 표시 뒤 어떤 관계를 선택할지 질문이 남았다."],
  ["late-dinner-coworker","야근 뒤 둘만의 저녁","temptation",5,20,"마지막까지 남은 동료와 배달 저녁을 나눴다.","업무를 마친 안도감이 사적인 친밀감으로 바뀌었다.","동료는 연인이 기다리는데도 남아 있어도 되냐고 물었다.","엘리베이터 앞에서 다음 야근을 기대하는 표정을 봤다."],
  ["second-secret-meeting","두 번째 비밀 약속","temptation",14,29,"이전 만남을 기억하는 동료가 다시 장소를 보냈다.","이번에는 우연이라고 부를 수 없다는 사실이 무거웠다.","동료는 선을 넘을지 끝낼지 직접 선택해 달라고 했다.","삭제하지 못한 주소가 새로운 비밀의 증거가 됐다."],

  ["phone-notification-seen","연인이 본 휴대폰 알림","conflict",5,20,"테이블 위 휴대폰에 의미심장한 이름이 떠올랐다.","설명하려는 말보다 연인의 표정이 먼저 굳었다.","연인은 내용보다 숨기려 한 순간이 더 아프다고 말했다.","잠금 화면을 사이에 두고 신뢰의 기준을 다시 정했다."],
  ["girlfriend-with-stranger","낯선 남자와 함께 있는 연인","conflict",9,24,"거리 건너편에서 연인이 낯선 남자와 웃고 있었다.","다가가 묻고 싶은 마음과 믿고 싶은 마음이 충돌했다.","그 남자는 오래된 동료였지만 연인은 감시받는 기분을 말했다.","오해는 풀렸어도 서로의 질투 방식은 기억에 남았다."],
  ["caught-with-coworker","다른 여성과 있는 장면을 들키다","conflict",8,23,"카페에서 동료와 마주 앉은 순간 연인이 들어왔다.","설명할수록 준비한 변명처럼 들리는 분위기가 됐다.","연인은 만남보다 자신만 몰랐다는 사실에 상처받았다.","그날 밤 짧은 메시지 하나가 화해와 단절 사이를 갈랐다."],
  ["travel-big-fight","여행지에서 터진 큰 싸움","conflict",13,27,"기대하던 여행에서 작은 일정 착오가 생겼다.","피로와 돈 문제가 겹치며 오래된 불만까지 쏟아졌다.","연인은 혼자 참아 온 관계의 불균형을 처음 말했다.","낯선 숙소의 침묵 속에서 돌아갈지 다시 시작할지 정했다."],
  ["late-night-reconciliation","밤늦게 찾아간 화해","conflict",10,28,"싸움 뒤 답장이 없는 연인의 집 앞으로 향했다.","기다림은 사과가 상대를 위한지 자신을 위한지 묻게 했다.","연인은 문을 열고 같은 일이 반복되지 않을 이유를 물었다.","새벽이 오기 전 두 사람은 구체적인 약속 하나를 남겼다."],

  ["deadline-versus-date","중요 일정과 데이트의 충돌","work",6,19,"발표 일정이 오래 준비한 데이트와 정확히 겹쳤다.","상사와 연인 모두 오늘만은 선택해 달라고 말했다.","어느 쪽을 택해도 잃는 것이 있다는 현실이 드러났다.","선택의 이유를 솔직히 설명한 방식이 관계에 남았다."],
  ["overtime-team-dinner","야근 팀의 늦은 저녁","work",4,18,"긴급 업무 뒤 팀장이 저녁을 사겠다고 했다.","성과 이야기는 승진과 희생해야 할 시간으로 이어졌다.","팀장은 지금의 연애가 커리어를 버틸 수 있겠냐고 물었다.","택시 안에서 성공의 가격을 처음 구체적으로 계산했다."],
  ["office-rumor","회사에 번진 두 사람의 소문","work",10,25,"동료와 가깝다는 소문이 사내 메신저에 돌기 시작했다.","해명할수록 누가 시작했는지에 대한 의심이 커졌다.","가까운 동료가 소문 중 일부는 사실 아니냐고 물었다.","소문을 끊는 선택은 직장 관계와 연애 모두에 흔적을 남겼다."],
  ["promotion-relocation","승진과 지방 발령 제안","work",18,30,"승진 조건으로 몇 달간 다른 도시에서 일하라는 제안을 받았다.","기회와 장거리 연애의 불안이 같은 무게로 다가왔다.","연인은 자신 때문에 포기했다는 말을 듣고 싶지 않다고 했다.","결정 전날 각자의 두려움과 기대를 목록으로 적었다."],

  ["meet-her-friends","연인의 친구들을 처음 만난 날","friends",5,18,"연인의 가장 가까운 친구들이 기다리는 카페에 들어갔다.","가벼운 질문은 관계의 진지함을 확인하는 면접처럼 변했다.","한 친구가 연인을 울리지 않을 자신이 있냐고 물었다.","돌아오는 길 연인은 친구들 앞에서 편을 들어 줘 고맙다고 했다."],
  ["friends-evaluate-partner","내 친구들의 연인 평가","friends",6,20,"오랜 친구들이 연인을 처음 만나는 자리가 열렸다.","친구의 무심한 농담이 연인의 자존심을 건드렸다.","연인은 혼자 견디게 둘지 자신의 편이 될지 지켜봤다고 말했다.","만남 뒤 친구와 연인 사이에 새로운 경계가 생겼다."],
  ["parents-first-story","처음 듣는 부모님 이야기","friends",12,27,"평범한 저녁 중 연인이 가족 이야기를 조심스럽게 꺼냈다.","결혼과 돈을 바라보는 방식이 어린 시절 경험과 연결됐다.","연인은 자신의 가족까지 받아들일 수 있겠냐고 물었다.","당장 답하지 않아도 기억해 달라는 부탁이 남았다."],

  ["budget-date","돈이 부족한 날의 데이트","money",3,17,"약속 당일 예상보다 통장 잔액이 부족했다.","솔직히 말할지 무리해서 계획을 지킬지 고민했다.","연인은 편의점 음식과 공원 산책도 함께라면 괜찮다고 했다.","적게 쓴 날이 오히려 서로의 경제관을 많이 보여 줬다."],
  ["couple-item-shopping","커플 아이템을 고르는 오후","money",7,22,"쇼핑몰에서 우연히 커플 아이템 코너를 발견했다.","가격과 디자인, 관계를 드러내는 방식에서 취향이 갈렸다.","연인은 같은 물건보다 같은 의미를 원하는 것이라고 말했다.","각자 다른 색의 물건에 같은 날짜를 새겼다."],

  ["first-trip","둘만의 첫 여행","travel",10,24,"둘만의 첫 여행을 위해 이른 아침 역에서 만났다.","계획형과 즉흥형의 차이가 첫날부터 드러났다.","길을 잃은 순간 연인은 완벽하지 않아 더 기억난다고 웃었다.","여행 마지막 밤 둘만 아는 장소를 하나 만들었다."],
  ["birthday-preparation","들키지 않는 생일 준비","travel",8,25,"연인의 생일을 위해 친구와 몰래 계획을 세웠다.","비밀 연락이 오히려 연인의 의심을 키우기 시작했다.","서프라이즈 직전 연인은 잊힌 줄 알고 상처받았다고 말했다.","촛불이 켜진 뒤 기쁨과 미안함이 동시에 번졌다."],
  ["birthday-wrong-gift","취향과 어긋난 생일 선물","travel",9,26,"정성껏 고른 선물을 연인이 오래 바라보기만 했다.","좋아하는 척하는 표정이 서로를 더 불편하게 했다.","연인은 가격보다 자신의 말을 기억하지 못한 것이 서운했다.","교환하러 가는 길에 서로의 취향 목록을 새로 만들었다."],

  ["ex-girlfriend-reunion","전 연인과의 우연한 재회","mystery",7,23,"점심 카페에서 오래전 헤어진 사람이 이름을 불렀다.","안부는 과거의 미련과 현재 연애에 대한 질문으로 변했다.","전 연인은 마지막으로 묻고 싶었던 진실이 있다고 말했다.","현재 연인에게 이 만남을 말할지가 새로운 비밀이 됐다."],
  ["her-ex-returns","연인의 전 남자친구가 돌아오다","mystery",11,27,"연인의 휴대폰에 전 남자친구의 장문 메시지가 도착했다.","끝난 관계라는 말과 흔들리는 눈빛이 서로 달랐다.","연인은 과거를 정리할 기회를 믿어 줄 수 있냐고 물었다.","세 사람이 마주할 가능성이 라이벌 스레드에 남았다."]
  ,["haeun-home-outside-talk","집 앞에서 나누는 이야기","romance",2,30,"하은의 집에 도착했지만 아직 안으로 들어오라는 말은 없었다.","두 사람은 현관 앞에서 서로에게 편한 거리를 확인했다.","하은은 부담 없이 여기서 이야기해도 괜찮겠냐고 물었다.","강요하지 않은 대화가 다음 방문의 신뢰로 남았다."]
  ,["haeun-home-tea-talk","차를 마시며 나누는 이야기","romance",3,30,"하은이 현관문을 열고 거실로 안내했다.","테이블 위의 찻잔 두 개 사이로 조금 깊은 이야기가 시작됐다.","하은은 요즘 서로에게 숨기는 고민이 없는지 물었다.","따뜻한 차와 솔직한 대화가 집 안의 거리를 좁혔다."]
  ,["haeun-home-meal","하은의 집에서 함께 먹는 저녁","romance",5,30,"하은의 식탁에는 두 사람 몫의 저녁이 준비되어 있었다.","평범한 식사 안에서 함께 사는 미래가 자연스럽게 떠올랐다.","하은은 다음에는 무엇을 함께 만들어 먹고 싶은지 물었다.","식사가 끝난 뒤 두 사람은 다음 장보기 약속을 정했다."]
];

const MOODS = {
  romance:["설렘","진지함","따뜻한 긴장","잔잔한 확신"],temptation:["가벼운 농담","은밀한 호기심","위험한 솔직함","미완의 여운"],
  conflict:["불편한 예감","방어적인 긴장","감정 폭발","조심스러운 여운"],work:["업무적 긴장","현실적인 압박","선택의 부담","쓴 안도감"],
  friends:["사교적 기대","낯선 긴장","관계 검증","새로운 이해"],money:["가벼운 기대","현실적 부담","가치관 충돌","솔직한 안도"],
  travel:["들뜬 기대","예상 밖의 변수","감정의 절정","오래 남는 추억"],mystery:["낯선 기척","커지는 의심","숨겨진 진실","불완전한 결론"]
};

const PLAYER_LINES = ["갑작스럽긴 하지만 네 이야기를 듣고 싶어.","조금 천천히 말해도 괜찮아.","그 질문에는 솔직하게 답할게.","오늘의 선택을 나중에 변명하고 싶지는 않아."];

function makeTurns(event,sceneIndex) {
  const lead=event.category === "temptation" ? event.npcName ?? "유진" : event.category === "work" ? "직장 동료" : event.category === "friends" ? "친구" : "연인";
  const beats=[event.hook,event.pressure,event.reveal,event.echo];
  const line=beats[sceneIndex];
  return [
    {type:"narration",speaker:"내레이션",text:line},
    {type:"dialogue",speaker:lead,text:`“${line.replace(/\.$/,"")}… 너는 어떻게 생각해?”`,expressionId:sceneIndex===2?"tense":sceneIndex===3?"smile":"calm"},
    {type:"dialogue",speaker:"플레이어",text:PLAYER_LINES[sceneIndex]},
    {type:"dialogue",speaker:lead,text:sceneIndex===0?"처음엔 가볍게 말하려고 했는데, 막상 네 얼굴을 보니 어렵네.":sceneIndex===1?"아무렇지 않은 척하면 오히려 더 이상해질 것 같아.":sceneIndex===2?"지금은 듣기 좋은 대답보다 진짜 마음이 필요해.":"오늘 대화가 내일의 우리를 조금 바꾸겠지."},
    {type:"dialogue",speaker:"플레이어",text:sceneIndex===0?"피하지 않을게. 처음부터 이야기해 줘.":sceneIndex===1?"불편해도 여기서 멈추지는 말자.":sceneIndex===2?"내가 감당해야 할 부분도 분명히 말해 줘.":"기억할게. 그리고 다음에는 먼저 말할게."},
    {type:"narration",speaker:"내레이션",text:`${event.moods[sceneIndex]}의 공기가 두 사람 사이에 오래 머물렀다.`},
    {type:"dialogue",speaker:lead,text:sceneIndex<2?"그럼 한 가지만 더 물어봐도 돼?":"이제야 조금 네 대답을 믿을 수 있을 것 같아."},
    {type:"dialogue",speaker:"플레이어",text:sceneIndex<2?"응. 오늘은 숨기지 말고 끝까지 이야기하자.":"완벽한 답은 없어도 선택의 책임은 질게."}
  ];
}

function makeChoices(event) {
  return [
    {id:"honest",label:"불편하더라도 전부 솔직히 말한다",preferenceTags:["HONEST","EMOTIONAL","DIRECT"],effects:{trust:10,affection:3,conflict:-2},response:"솔직한 답은 당장의 긴장보다 앞으로의 신뢰를 선택한 말이 되었다.",flag:`${event.id}:HONEST`,memory:`${event.title}에서 솔직함을 선택했다.`,futureEventWeights:{reconciliation:1.25,suspicion:.75}},
    {id:"protect",label:"관계를 지키기 위한 선을 분명히 긋는다",preferenceTags:["BOUNDARY","PRACTICAL","PLANNED","LOGICAL"],effects:{trust:6,excitement:-2,relationshipStress:-2},response:"구체적인 경계가 두 사람이 다시 같은 문제를 겪지 않을 기준이 되었다.",flag:`${event.id}:BOUNDARY`,memory:`${event.title}에서 관계의 경계를 정했다.`,futureEventWeights:{loyalty:1.3,temptation:.7}},
    {id:"risk",label:"지금의 감정을 따라 위험을 감수한다",preferenceTags:["SPONTANEOUS","IMAGINATIVE","RISK"],effects:{excitement:10,trust:-7,conflict:4},response:"순간의 설렘은 커졌지만 선택의 책임과 불안도 함께 남았다.",flag:`${event.id}:RISK`,memory:`${event.title}에서 위험한 감정을 따랐다.`,futureEventWeights:{temptation:1.4,suspicion:1.35}}
  ];
}

function buildEvent([id,title,category,startDay,endDay,hook,pressure,reveal,echo],index) {
  const config=CATEGORY_CONFIG[category];
  const namedText=text=>category==="temptation"?String(text).replaceAll("서브 히로인",config.npcName??"유진"):text;
  const event={id:`situation-${id}`,title,category,categoryLabel:config.label,npcId:config.npcRole,npcName:config.npcName??null,hook:namedText(hook),pressure:namedText(pressure),reveal:namedText(reveal),echo:namedText(echo),moods:MOODS[category]};
  event.scenes=config.backgrounds.map((backgroundId,sceneIndex)=>({
    id:`${event.id}-scene-${sceneIndex+1}`,title:["사건 시작","흔들리는 대화","감정의 절정","NIGHT 후속 반응"][sceneIndex],backgroundId,
    characterIds:[config.npcRole],expression:["calm","worried","tense","smile"][sceneIndex],pose:sceneIndex===3?"phone":"standing",animation:sceneIndex===2?"tense-shift":"soft-sway",
    outfit:sceneIndex===0?"default":"date",itemIds:sceneIndex===3?["aurora-phone"]:[],bgmId:config.bgm,sfxId:backgroundId.includes("rain")?"rain-window":"scene",
    transition:sceneIndex===0?"fade":sceneIndex===3?"blur":"slide",lighting:backgroundId.includes("night")?"night-neon":"soft",timeOfDay:sceneIndex===0?"day":sceneIndex===3?"night":"evening",weather:backgroundId.includes("rain")?"rain":"sunny",
    dialogueTurns:makeTurns(event,sceneIndex)
  }));
  return {
    ...event,message:hook,question:`${title}에서 나는 어떻게 답하고 행동할까?`,eventType:category==="friends"?"FRIEND":category==="work"||category==="temptation"?"COWORKER":"GIRLFRIEND",image:{intro:`assets/events/${category}/${id}-01.png`,result:`assets/events/${category}/${id}-result-01.png`,status:"planned"},conditions:[{stat:"day",operator:">=",value:startDay}],probability:.025+(index%4)*.008,priority:52+(index%7),cooldown:7+(index%5),effects:config.baseEffects,
    baseWeight:45+(index%6)*5,dayRange:[startDay,endDay],timeOfDay:index%3===0?"evening":"day",location:event.scenes[0].backgroundId,tensionLevel:category==="conflict"||category==="mystery"?"high":category==="temptation"?"medium-high":"medium",
    relationshipStates:category==="conflict"?["SUSPICIOUS","CONFLICT","RECOVERING"]:category==="romance"?["HONEYMOON","STABLE","PASSIONATE"]:["DISTANT","STABLE","SUSPICIOUS"],
    npcRequirements:config.npcRole==="girlfriend"?[]:[config.npcRole],requiredMemories:[],requiredEvents:[],forbiddenFlags:[`${event.id}:COMPLETED`],repeatable:false,maxTriggerCount:1,eventState:"LOCKED",
    startMood:event.moods[0],middleMood:event.moods[1],peakMood:event.moods[2],endMood:event.moods[3],choices:makeChoices(event),
    storyFlag:`${event.id}:COMPLETED`,futureEventWeights:{[category]:1.2},cgCandidate:["shared-umbrella","drunk-pickup","coworker-private-drink","travel-big-fight","late-night-reconciliation","first-trip"].includes(id)?`CG_${id.toUpperCase().replaceAll("-","_")}`:null
  };
}

const BASE_SITUATION_EVENTS=BLUEPRINTS.map(buildEvent);
BASE_SITUATION_EVENTS.push(
  buildEvent(["friend-advice-partner-work-stress","요즘 많이 힘들어 보인다는 친구의 말","friends",3,30,"카페에 있던 지훈이 조심스럽게 여자친구의 안부를 물었다.","최근 여자친구가 지쳐 보였지만 대신 단정해서 말하고 싶지는 않다고 했다.","지훈은 추측하지 말고 직접 괜찮은지 물어보라고 조언했다.","친구의 말은 여자친구와 솔직하게 이야기할 계기가 되었다."],100),
  buildEvent(["friend-advice-partner-contact-drop","연락이 줄어든 이유를 확인하라는 조언","friends",4,30,"지훈이 요즘 두 사람의 연락이 줄어든 것 같다고 말했다.","바쁜 것인지 마음이 힘든 것인지 밖에서 판단할 수는 없었다.","지훈은 여자친구에게 먼저 시간을 내어 물어보라고 했다.","조언을 들은 뒤 미뤄 두었던 대화를 시작하기로 했다."],101),
  buildEvent(["minho-reports-minjun-date-invitation","민호가 전한 민준의 데이트 신청","friends",5,30,"퇴근 직전, 친한 남자 동료 민호가 할 말이 있다며 조용히 불러 세웠다.","민호는 며칠 전 민준이 여자친구에게 주말에 단둘이 만나자고 제안하는 모습을 봤다고 말했다.","단순한 친분보다는 데이트 신청에 가까운 분위기였지만, 민호는 단정하지 말고 여자친구에게 먼저 확인하라고 조언했다.","민호의 말을 들은 뒤 민준보다 여자친구의 대답을 먼저 들을지 고민하게 됐다."],102)
);
const PLAYER_EX_EVENT_IDS=new Set(["situation-ex-girlfriend-reunion"]);
for(const event of BASE_SITUATION_EVENTS){
  if(!PLAYER_EX_EVENT_IDS.has(event.id))continue;
  event.title="전 여자친구 유리와의 우연한 재회";
  event.eventType="ETC";
  event.npcId="player-ex";
  event.npcName="유리";
  event.scenes.forEach(scene=>{
    scene.characterIds=["player-ex"];
    scene.dialogueTurns.forEach(turn=>{
      if(turn.speaker==="연인")turn.speaker="전 여자친구 · 유리";
    });
  });
}
const HAEUN_HOME_TIERS={
  "situation-haeun-home-outside-talk":{trust:[null,700],locationId:"haeun-home-outside",question:"집 앞에서 하은에게 어떻게 답할까?",image:"assets/events/locations/haeun-home-outside-talk-01.png"},
  "situation-haeun-home-tea-talk":{trust:[701,900],locationId:"haeun-home-living-room",question:"차를 마시며 하은과 어떤 이야기를 나눌까?",image:"assets/events/locations/haeun-home-tea-talk-01.png"},
  "situation-haeun-home-meal":{trust:[901,null],locationId:"haeun-home-dining-room",question:"하은이 준비한 식사에 어떻게 마음을 전할까?",image:"assets/events/locations/haeun-home-meal-01.png"}
};
for(const event of BASE_SITUATION_EVENTS){
  const tier=HAEUN_HOME_TIERS[event.id];
  if(!tier)continue;
  event.heroineIds=["haeun"];event.locationId=tier.locationId;event.question=tier.question;event.image.intro=tier.image;event.image.result=tier.image;event.image.status="ready";
  if(tier.trust[0]!==null)event.conditions.push({stat:"trust",operator:">=",value:tier.trust[0]});
  if(tier.trust[1]!==null)event.conditions.push({stat:"trust",operator:"<=",value:tier.trust[1]});
}
const LOCATION_RULES={
  "situation-ex-girlfriend-reunion":{categories:["cafe"],probability:.5},
  "situation-fine-dining-truth":{categories:["western"]},
  "situation-couple-item-shopping":{categories:["shopping"]},
  "situation-first-trip":{categories:["transport","landmark"]},
  "situation-haeun-home-outside-talk":{categories:["girlfriend-home"]},
  "situation-haeun-home-tea-talk":{categories:["girlfriend-home"]},
  "situation-haeun-home-meal":{categories:["girlfriend-home"]},
  "situation-meet-her-friends":{categories:["cafe"]},
  "situation-friends-evaluate-partner":{categories:["cafe"]},
  "situation-parents-first-story":{categories:["cafe"]},
  "situation-friend-advice-partner-work-stress":{categories:["cafe"]},
  "situation-friend-advice-partner-contact-drop":{categories:["cafe"]}
};
export const GENERAL_EVENT_PROBABILITY_MULTIPLIER=2;
export const GENERAL_EVENT_PROBABILITY_CAP=.07;
const LOW_TRUST_IDS=new Set(["situation-phone-notification-seen","situation-girlfriend-with-stranger","situation-caught-with-coworker","situation-travel-big-fight","situation-late-night-reconciliation"]);
const FRIEND_ADVICE_IDS=new Set(["situation-friend-advice-partner-work-stress","situation-friend-advice-partner-contact-drop"]);
const FRIEND_RELATED_IDS=new Set(["situation-meet-her-friends","situation-friends-evaluate-partner","situation-parents-first-story"]);
const MINHO_DATE_WARNING_ID="situation-minho-reports-minjun-date-invitation";
const EXCLUDED_FREE_ROMANCE_IDS=new Set(["situation-shared-umbrella"]);

const FREE_ROMANCE_DIALOGUES={
  "situation-midnight-drive":{
    q1:"갑자기 바다가 보고 싶어졌어. 내일 일정 괜찮으면 지금 같이 갈래?",a1:"내일 아침 일정은 있지만, 시간을 정하고 다녀오는 건 괜찮아.",
    reveal:"목적지도 좋지만 네가 내 갑작스러운 마음을 같이 들어 준 게 더 좋아.",q2:"그럼 몇 시까지 돌아오는 걸로 할까?",a2:"새벽 한 시 전에는 돌아오자. 피곤하면 내가 운전도 바꿔 줄게.",prompt:"갑작스러운 심야 드라이브 제안에 어떻게 답할까?",
    choices:[["지금 출발하되 귀가 시간을 정한다","무작정 나선 대신 서로의 내일을 배려한 약속이 설렘을 더 편안하게 만들었다."],["오늘은 근처를 걷고 주말에 바다를 간다","즉흥적인 마음을 거절하지 않으면서도 현실적인 대안을 제시해 다음 약속이 생겼다."]]
  },
  "situation-front-door-surprise":{
    q1:"연락도 없이 와서 미안해. 잠깐 얼굴만 보고 가도 될까?",a1:"놀라긴 했지만 괜찮아. 다만 다음에는 오기 전에 한 번만 알려 줘.",
    reveal:"오늘 네 목소리가 평소랑 달라서 직접 보고 안심하고 싶었어.",q2:"지금 들어가도 정말 불편하지 않아?",a2:"방은 엉망이어도 괜찮아. 십 분만 같이 차 마시고 이야기하자.",prompt:"예고 없이 찾아온 연인에게 어떻게 답할까?",
    choices:[["잠깐 들어오라고 하고 무슨 일인지 묻는다","정리되지 않은 공간보다 연인의 불안을 먼저 살피자 짧은 방문이 솔직한 대화로 이어졌다."],["오늘은 집 앞에서 이야기하고 방문 규칙을 정한다","반가움과 사생활의 경계를 함께 설명하자 다음부터 지킬 수 있는 편안한 기준이 생겼다."]]
  },
  "situation-drunk-pickup":{
    q1:"나 괜찮아. 그런데 집까지 같이 가 주면 안 돼?",a1:"괜찮은지는 집에 가면서 확인하자. 우선 물부터 마시고 천천히 일어나.",
    reveal:"회사에서는 늘 괜찮은 척했는데 오늘은 그게 너무 힘들었어.",q2:"내가 이렇게 취한 모습 보여서 실망했어?",a2:"실망한 게 아니라 걱정됐어. 내일 맑을 때 힘들었던 일도 다시 듣고 싶어.",prompt:"지친 채 취한 연인을 어떻게 돌볼까?",
    choices:[["안전하게 데려다주고 다음 날 다시 이야기한다","취중의 고백을 몰아붙이지 않고 안전과 휴식을 먼저 챙긴 배려가 오래 남았다."],["친한 친구에게 함께 귀가를 부탁하고 선을 지킨다","혼자 감당하지 않되 필요한 도움을 구해 안전하고 책임감 있게 밤을 마무리했다."]]
  },
  "situation-fine-dining-truth":{
    q1:"메뉴 가격 보고 놀랐지? 부담되면 지금이라도 편하게 말해 줘.",a1:"솔직히 예상보다 비싸서 부담돼. 오늘 쓸 수 있는 금액부터 같이 정하자.",
    reveal:"나도 비싼 걸 먹는 것보다 서로 형편을 숨기지 않는 게 더 중요해.",q2:"그럼 오늘 계산은 어떻게 하는 게 가장 편할까?",a2:"각자 주문한 건 나누고, 다음 데이트는 내가 예산에 맞춰 준비할게.",prompt:"부담스러운 식사 비용을 어떻게 정리할까?",
    choices:[["예산을 솔직히 말하고 각자 계산한다","체면보다 현재 형편을 솔직하게 공유하자 돈 이야기가 관계를 흔드는 대신 신뢰를 만들었다."],["코스 수를 줄이고 둘이 납득할 금액으로 맞춘다","분위기를 포기하지 않으면서 지출을 조정해 두 사람 모두 편하게 식사를 이어 갔다."]]
  },
  "situation-future-night-talk":{
    q1:"우리 둘이 결혼을 생각하는 시기가 다르면 어떻게 해야 할까?",a1:"누가 맞는지 정하기 전에 각자가 원하는 시기와 이유부터 구체적으로 말해 보자.",
    reveal:"정답보다 네가 나와 조정할 생각이 있는지가 궁금했어.",q2:"일과 사는 곳까지 달라져도 같이 계획해 볼 마음은 있어?",a2:"응. 당장 약속하진 못해도 1년 단위로 바뀔 수 있는 것과 없는 걸 같이 적어 보자.",prompt:"서로 다른 미래의 속도를 어떻게 맞출까?",
    choices:[["결혼·직장·주거 계획을 함께 적어 본다","막연한 약속을 일정과 조건으로 나누자 미래 이야기가 압박이 아니라 공동 계획이 되었다."],["결론을 서두르지 않고 다음 달에 다시 점검한다","지금 정할 수 없는 부분을 인정하고 다시 이야기할 날짜를 정해 회피가 아닌 숙려를 선택했다."]]
  },
  "situation-coworker-private-drink":{
    q1:"회사 사람 말고 그냥 나로 보면, 나랑 단둘이 한잔하는 거 불편해?",a1:"동료로서 이야기하는 건 괜찮지만 오해가 생길 분위기는 만들고 싶지 않아.",
    reveal:"사실 좋아하면 안 되는 사람을 좋아하게 된 것 같아. 네가 모른 척해 줬으면 했어.",q2:"오늘 일은 우리 둘만 알고 있으면 안 될까?",a2:"비밀로 이어 갈 생각은 없어. 지금 여기서 관계의 선을 분명히 할게.",prompt:"유진의 고백과 비밀 제안에 어떻게 답할까?",
    choices:[["마음을 받아줄 수 없다고 분명히 말하고 자리를 끝낸다","애매한 위로나 가능성을 남기지 않은 답이 유진에게도 관계를 정리할 기준이 되었다."],["현재 연애를 숨긴 채 유진과 다음 약속을 잡는다","비밀 약속은 순간의 설렘을 키웠지만 직장과 연애 모두에 설명하기 어려운 위험을 남겼다."]]
  },
  "situation-team-dinner-spark":{
    q1:"다들 이상형 얘기하는데 너는 어떤 사람이 좋아?",a1:"나는 지금 만나고 있는 사람의 솔직하고 차분한 점이 좋아.",
    reveal:"그 대답을 들었는데도 이상하게 자꾸 네 쪽을 보게 되네.",q2:"단체 사진 찍을 때 내 옆에 서도 괜찮지?",a2:"사진은 괜찮지만 일부러 오해 살 만큼 가까이 서진 않을게.",prompt:"회식 자리에서 유진의 호감을 어떻게 받아들일까?",
    choices:[["연인이 있다는 사실을 자연스럽게 밝히고 자리를 옮긴다","분위기를 망치지 않으면서도 관계를 공개해 불필요한 기대와 소문을 막았다."],["유진 옆에 남아 사적인 대화를 계속한다","취기에 기대어 거리를 좁힌 선택이 단체 사진과 동료들의 기억에 선명하게 남았다."]]
  },
  "situation-almost-confession":{
    q1:"오늘은 이상하게 네가 보고 싶었어. 이 말 부담스러워?",a1:"솔직하게 말해 줘서 고맙지만, 나는 그 마음에 같은 방식으로 답할 수 없어.",
    reveal:"대답을 강요하고 싶진 않아. 그냥 내 마음을 알아줬으면 했어.",q2:"그래도 가끔 이렇게 연락하는 건 괜찮을까?",a2:"업무 연락은 괜찮지만 사적인 기대가 생길 연락은 여기서 멈추는 게 맞아.",prompt:"유진의 고백에 가까운 메시지에 어떻게 답할까?",
    choices:[["현재 관계를 설명하고 사적인 연락을 정중히 거절한다","유진의 감정을 비난하지 않으면서도 분명한 답을 전해 더 큰 오해를 막았다."],["보고 싶다는 말에 같은 마음이라고 답한다","짧은 답장은 새로운 가능성을 열었지만 현재 연인에게 숨겨야 할 대화도 함께 만들었다."]]
  },
  "situation-late-dinner-coworker":{
    q1:"연인이 기다릴 텐데 나랑 조금 더 있다 가도 괜찮아?",a1:"저녁까지만 먹고 바로 갈게. 늦어진다고 먼저 연락해 둘게.",
    reveal:"일이 끝나면 너랑 이야기하는 시간이 요즘 제일 편해.",q2:"다음 야근 때도 우리 둘이 저녁 먹을까?",a2:"팀원들과 함께라면 좋아. 단둘이 반복해서 만나는 건 조심하고 싶어.",prompt:"야근 뒤 유진과의 가까워진 분위기를 어떻게 정리할까?",
    choices:[["식사를 마치고 연인에게 상황을 알린 뒤 귀가한다","늦은 식사를 숨기지 않고 약속된 시간에 자리에서 일어나 관계의 우선순위를 행동으로 보였다."],["귀가 연락을 미루고 유진과 술자리를 이어 간다","둘만의 시간이 길어지면서 동료 사이의 친밀감은 명확한 비밀로 바뀌기 시작했다."]]
  },
  "situation-second-secret-meeting":{
    q1:"주소 보냈어. 이번에는 올 건지 말 건지 네가 확실히 정해 줘.",a1:"이번 만남은 가지 않을게. 지난번부터 애매하게 둔 건 내 잘못이야.",
    reveal:"나도 이제 우연이나 농담이라고 부를 수 없다는 건 알아.",q2:"그럼 우리 사이에 있었던 감정도 전부 없던 일로 할 거야?",a2:"감정이 있었다는 사실은 부정하지 않지만, 행동으로 이어 가지 않겠다고 선택할게.",prompt:"유진이 보낸 두 번째 비밀 약속에 어떻게 답할까?",
    choices:[["약속을 취소하고 사적인 만남을 끝낸다","뒤늦게라도 명확히 관계를 정리해 반복되던 비밀 약속을 멈췄다."],["주소를 남겨 두고 유진을 만나러 간다","이번 선택은 더 이상 우연이 아니었고 두 사람 모두 선을 넘었다는 사실을 알게 됐다."]]
  },
  "situation-phone-notification-seen":{
    q1:"방금 뜬 이름 누구야? 왜 바로 화면을 뒤집었어?",a1:"회사 동료 유진이야. 숨기려던 행동처럼 보이게 만든 건 미안해. 메시지도 같이 설명할게.",
    reveal:"메시지 내용보다 네가 나한테 감추려 한 것처럼 보여서 더 무서웠어.",q2:"앞으로 이런 연락이 오면 나는 어떻게 알 수 있어?",a2:"사적인 연락은 답하지 않고, 반복되면 바로 말할게. 휴대폰 검사 대신 서로 먼저 설명하는 규칙을 만들자.",prompt:"연인이 본 의심스러운 알림을 어떻게 설명할까?",
    choices:[["메시지의 맥락을 숨김없이 설명하고 질문을 받는다","변명보다 사실과 순서를 차분히 설명하자 굳었던 표정이 조금씩 풀렸다."],["사적인 연락 기준을 함께 정하고 해당 연락을 정리한다","일회성 해명에서 끝내지 않고 다시 적용할 수 있는 연락 기준을 합의했다."]]
  },
  "situation-girlfriend-with-stranger":{
    q1:"아까부터 보고 있었어? 저 사람 때문에 기분 상한 거야?",a1:"놀라고 질투가 난 건 사실이야. 그래도 단정하기 전에 누구인지 네게 직접 묻고 싶었어.",
    reveal:"오래된 직장 동료야. 그런데 멀리서 지켜보는 너를 보니 감시받는 기분이 들었어.",q2:"다음에도 비슷한 장면을 보면 어떻게 할 거야?",a2:"숨어서 확인하지 않고 바로 인사한 뒤 상황을 물어볼게. 너도 미리 말할 수 있으면 알려 줘.",prompt:"질투와 오해를 어떤 방식으로 풀까?",
    choices:[["질투한 감정을 인정하고 상대 관계를 차분히 묻는다","감정을 숨기지 않되 비난하지 않는 질문이 오해를 사실 확인의 대화로 바꿨다."],["서로의 이성 친구를 소개하고 연락 기준을 맞춘다","감시가 아니라 투명성을 높이는 방법을 선택해 다음 만남에 대한 불안을 줄였다."]]
  },
  "situation-caught-with-coworker":{
    q1:"둘이 따로 만난다는 말은 왜 한 번도 안 했어?",a1:"업무 이야기였어도 미리 말하지 않은 건 내 잘못이야. 언제부터 왜 만났는지 차례대로 설명할게.",
    reveal:"만난 것보다 나만 모르게 된 사람이 된 것 같아서 상처받았어.",q2:"내가 우연히 들어오지 않았다면 오늘도 말하지 않았을 거야?",a2:"아마 미뤘을 것 같아. 그래서 더 미안해. 오늘부터 사적인 만남은 먼저 공유할게.",prompt:"동료와의 만남을 들킨 상황에서 어떻게 책임질까?",
    choices:[["사실을 시간순으로 설명하고 숨긴 점을 사과한다","불리한 부분까지 빼지 않고 설명하자 적어도 무엇이 사실인지는 분명해졌다."],["동료와 단둘이 만나는 기준을 다시 정한다","사과를 반복하는 대신 구체적인 재발 방지 기준을 함께 정했다."]]
  },
  "situation-travel-big-fight":{
    q1:"일정도 돈도 왜 항상 내가 맞춰야 해? 이번 여행도 나만 준비한 것 같아.",a1:"네가 더 많이 준비한 게 맞아. 지금 변명하지 않고 남은 일정과 비용부터 내가 나눠 맡을게.",
    reveal:"여행 하나 때문이 아니라 계속 혼자 관계를 끌고 온 기분이 들어서 터진 거야.",q2:"숙소로 돌아가서 쉬고 다시 이야기할까, 아니면 오늘 여기서 끝낼까?",a2:"일단 한 시간 각자 쉬자. 저녁에 서로 바라는 것 세 가지씩 적어서 다시 이야기하자.",prompt:"여행지에서 커진 싸움을 어떻게 수습할까?",
    choices:[["잘못한 부분을 인정하고 남은 준비를 직접 맡는다","구체적인 책임을 나눠 맡자 사과가 말이 아니라 여행의 변화로 보이기 시작했다."],["일정을 취소하고 각자 진정한 뒤 저녁에 다시 만난다","감정이 격해진 상태에서 결론을 내리지 않아 상처를 더 키우지 않을 시간을 만들었다."]]
  },
  "situation-late-night-reconciliation":{
    q1:"이 시간에 여기까지 온 이유가 정말 나를 위한 거야, 아니면 네가 불편해서야?",a1:"내 마음이 불편한 것도 사실이지만, 답을 강요하러 온 건 아니야. 사과만 전하고 원하면 돌아갈게.",
    reveal:"미안하다는 말보다 같은 일이 반복되지 않을 이유가 필요해.",q2:"다음에는 무엇을 다르게 할 건지 한 가지만 말해 줘.",a2:"화가 나도 연락을 끊지 않고 언제 다시 이야기할지 먼저 정할게.",prompt:"늦은 밤의 화해를 어떻게 진심으로 이어 갈까?",
    choices:[["구체적으로 잘못한 행동과 바꿀 행동을 말한다","막연한 미안함 대신 반복을 막을 행동을 약속하자 문 앞의 긴장이 조금 누그러졌다."],["사과를 전하고 오늘은 돌아가 답할 시간을 준다","용서를 재촉하지 않고 선택권을 돌려주자 찾아온 행동이 압박이 아닌 진심으로 남았다."]]
  },
  "situation-deadline-versus-date":{
    q1:"발표와 우리 데이트가 겹쳤다면서. 그래서 어떤 선택을 할 생각이야?",a1:"발표는 내가 책임져야 해. 대신 데이트를 일방적으로 취소하지 않고 가능한 시간을 지금 같이 찾고 싶어.",
    reveal:"일을 선택한 것보다 내가 항상 나중에 통보받는 사람이 되는 게 싫어.",q2:"오늘 약속을 바꾼다면 무엇으로 보상할 수 있어?",a2:"이번 주 토요일 하루를 비우고 내가 전부 준비할게. 오늘도 발표가 끝나는 시간을 바로 알려 줄게.",prompt:"중요한 업무와 데이트 충돌을 어떻게 해결할까?",
    choices:[["업무 사정을 즉시 설명하고 확정된 대체 약속을 잡는다","통보가 아니라 협의로 일정을 바꾸고 구체적인 대체 시간을 약속해 서운함을 줄였다."],["업무를 나눌 방법을 찾아 약속 시간 일부라도 지킨다","모든 것을 혼자 떠안지 않고 도움을 구해 일과 관계 모두에 최소한의 책임을 다했다."]]
  },
  "situation-overtime-team-dinner":{
    q1:"지금 연애가 네 커리어 속도를 따라올 수 있을 것 같아?",a1:"연애를 희생해야만 성장한다고 생각하진 않습니다. 성과와 생활을 함께 지킬 방법을 찾겠습니다.",
    reveal:"승진할수록 포기해야 할 시간이 늘어날 텐데, 그 각오는 필요해.",q2:"이번 분기 야근을 더 맡을 수 있겠어?",a2:"핵심 일정은 맡되 상시 야근은 어렵습니다. 역할과 보상 기준을 먼저 확인하고 싶습니다.",prompt:"팀장의 커리어 압박에 어떻게 답할까?",
    choices:[["가능한 업무 범위와 보상 조건을 구체적으로 협의한다","무조건적인 충성 대신 책임질 수 있는 범위를 제시해 현실적인 협상의 문을 열었다."],["이번 프로젝트만 맡고 이후 근무 조정을 요청한다","한시적인 집중과 이후 회복 계획을 함께 제시해 커리어와 생활의 경계를 지켰다."]]
  },
  "situation-office-rumor":{
    q1:"솔직히 말해 봐. 소문 중에 너랑 유진이 가까운 건 사실 아니야?",a1:"함께 일하며 가까워진 건 사실이지만 사내에서 말하는 관계는 아니야. 필요한 부분은 당사자에게도 확인할게.",
    reveal:"애매하게 해명하면 사람들은 더 재미있는 쪽을 믿을 거야.",q2:"팀에 공식적으로 선을 그을 생각은 있어?",a2:"개인 감정 싸움으로 만들진 않되, 업무 외 만남과 연락 기준은 분명히 하겠어.",prompt:"사내에 번진 관계 소문에 어떻게 대응할까?",
    choices:[["유진과 사실관계를 맞춘 뒤 팀에 짧게 정정한다","과장된 해명 대신 확인된 사실만 전달해 소문에 더 많은 이야깃거리를 주지 않았다."],["업무 외 접촉을 줄이고 공식 채널로만 소통한다","말보다 일관된 행동으로 경계를 보여 주면서 소문이 이어질 여지를 줄였다."]]
  },
  "situation-promotion-relocation":{
    q1:"좋은 기회잖아. 혹시 나 때문에 포기하려는 건 아니지?",a1:"너 때문이라고 결정하지 않을게. 기간과 복귀 조건, 우리가 감당할 거리를 함께 따져 보고 싶어.",
    reveal:"나중에 후회할 때 내 선택 때문이라고 말하는 관계는 되고 싶지 않아.",q2:"발령을 받아들이면 우리는 어떻게 만날 수 있을까?",a2:"주말 일정과 교통비를 계산하고, 최소 주 2회 영상 통화와 월 2회 만남을 약속하자.",prompt:"승진과 장거리 연애 사이에서 어떤 계획을 세울까?",
    choices:[["발령 조건을 확인한 뒤 장거리 계획을 함께 만든다","기회를 바로 포기하지 않고 관계 유지 비용과 시간을 구체화해 공동 결정으로 바꿨다."],["승진을 보류하고 다음 기회의 조건을 회사와 협의한다","감정적인 포기가 아니라 대안과 시기를 확인한 결정으로 서로에게 책임을 떠넘기지 않았다."]]
  },
  "situation-meet-her-friends":{
    q1:"우리 친구를 앞으로도 울리지 않을 자신 있어요?",a1:"절대 안 울리겠다고 장담하진 못하지만, 문제가 생기면 피하지 않고 대화하겠습니다.",
    reveal:"멋있는 답보다 하은이 힘들 때 누구 편에 설 사람인지 알고 싶었어요.",q2:"친구들과 연인 사이 의견이 다르면 어떻게 할 건데요?",a2:"사람 편을 무조건 고르기보다 공개된 자리에서는 연인을 존중하고 둘이 따로 사실을 확인할게요.",prompt:"연인의 친구들이 묻는 진지한 질문에 어떻게 답할까?",
    choices:[["완벽한 약속 대신 지킬 수 있는 행동을 솔직히 말한다","과장된 자신감보다 현실적인 책임을 말하자 친구들의 경계가 조금 누그러졌다."],["친구들 앞에서는 연인을 존중하겠다는 원칙을 밝힌다","관계의 문제를 구경거리로 만들지 않겠다는 태도가 연인에게 든든함을 주었다."]]
  },
  "situation-friends-evaluate-partner":{
    q1:"네 친구가 계속 농담하는데, 너도 내가 예민하다고 생각해?",a1:"아니. 불편할 만한 말이었고 내가 바로 멈추게 했어야 했어.",
    reveal:"나는 네가 웃어넘길지 내 편에서 말해 줄지 보고 있었어.",q2:"다음에도 친구가 선을 넘으면 어떻게 할 거야?",a2:"그 자리에서 농담을 멈춰 달라고 말하고, 필요하면 먼저 자리를 나올게.",prompt:"친구의 농담으로 상처받은 연인에게 어떻게 행동할까?",
    choices:[["친구에게 농담을 멈추라고 즉시 말하고 사과한다","누구의 체면보다 상처받은 사람을 먼저 보호해 연인이 혼자가 아니라는 걸 보여 줬다."],["연인과 먼저 자리를 나온 뒤 친구와 따로 이야기한다","공개된 다툼은 피하면서도 문제를 흐리지 않고 관계별로 필요한 대화를 나눴다."]]
  },
  "situation-parents-first-story":{
    q1:"우리 가족 사정까지 알게 되면 나와의 미래가 부담스러울 수도 있어. 그래도 듣고 싶어?",a1:"응. 판단하려고 듣는 게 아니라 네가 어떤 시간을 지나왔는지 이해하고 싶어.",
    reveal:"가족 때문에 결혼이나 돈 이야기를 쉽게 낙관하지 못해.",q2:"언젠가 내 가족 문제도 우리 일처럼 함께 마주할 수 있어?",a2:"내가 대신 해결하겠다고 약속하진 않을게. 하지만 중요한 결정에서 너를 혼자 두진 않겠어.",prompt:"연인의 가족 이야기에 어떤 태도로 답할까?",
    choices:[["해결책보다 먼저 이야기를 끝까지 듣고 감정을 확인한다","성급한 조언을 멈추고 경험을 존중하자 연인은 더 깊은 이야기를 이어 갈 수 있었다."],["감당할 수 있는 도움의 범위를 솔직히 약속한다","무조건 책임지겠다는 말 대신 함께할 수 있는 현실적인 범위를 밝혀 믿을 수 있는 약속이 됐다."]]
  },
  "situation-budget-date":{
    q1:"오늘 계획대로 가면 부담될 것 같은데, 왜 진작 말하지 않았어?",a1:"괜찮은 척하다가 늦게 말했어. 미안해. 지금 쓸 수 있는 돈은 이 정도야.",
    reveal:"나는 비싼 데이트보다 네가 형편을 숨기지 않는 게 더 중요해.",q2:"그럼 오늘은 무엇을 하고 싶어?",a2:"편의점에서 간단히 사고 공원을 걷자. 다음 데이트 예산도 미리 정해 두고 싶어.",prompt:"예산이 부족한 데이트를 어떻게 바꿀까?",
    choices:[["잔액을 솔직히 말하고 저비용 데이트로 변경한다","체면을 내려놓고 상황을 공유하자 작은 지출로도 편안한 데이트를 만들 수 있었다."],["오늘 약속을 짧게 하고 다음 데이트 예산을 함께 정한다","무리한 소비를 피하면서 다음에는 같은 당황스러움이 없도록 기준을 세웠다."]]
  },
  "situation-couple-item-shopping":{
    q1:"나는 티가 많이 나는 커플 아이템은 조금 부담스러워. 너는 어때?",a1:"나도 같은 디자인을 꼭 맞출 필요는 없어. 둘만 의미를 알 수 있으면 좋아.",
    reveal:"같은 물건보다 같은 의미를 기억하는 게 더 중요한 것 같아.",q2:"그럼 디자인과 가격은 어디까지 맞춰 볼까?",a2:"각자 자주 쓸 수 있는 걸 고르고, 정한 예산 안에서 날짜만 같이 새기자.",prompt:"서로 다른 취향으로 커플 아이템을 어떻게 고를까?",
    choices:[["각자 다른 디자인에 같은 문구를 새긴다","개인의 취향을 지키면서도 둘만의 의미를 남겨 부담 없이 사용할 물건을 골랐다."],["구매를 미루고 온라인에서 예산 안의 제품을 함께 찾는다","분위기에 떠밀려 사지 않고 충분히 비교하기로 해 소비와 취향 모두를 존중했다."]]
  },
  "situation-first-trip":{
    q1:"계획대로 움직이고 싶은데 자꾸 일정이 바뀌어서 불안해. 너는 괜찮아?",a1:"나도 길을 잃으니 당황했어. 오늘 꼭 해야 할 한 가지만 남기고 나머지는 유동적으로 하자.",
    reveal:"완벽하지 않아서 오히려 우리 둘만 기억할 장면이 생긴 것 같아.",q2:"내일부터는 계획을 얼마나 자세히 정할까?",a2:"오전 목적지만 정하고 오후는 현지 상황에 맞추자. 이동 시간은 내가 확인할게.",prompt:"첫 여행에서 다른 여행 방식을 어떻게 맞출까?",
    choices:[["필수 일정 하나만 남기고 나머지는 즉흥적으로 움직인다","계획형과 즉흥형이 각자 하나씩 양보해 변수도 추억으로 받아들일 여유가 생겼다."],["다음 날 동선을 함께 다시 짜고 역할을 나눈다","한 사람이 모든 준비를 맡지 않도록 예약과 길 찾기를 나눠 여행의 부담을 줄였다."]]
  },
  "situation-birthday-preparation":{
    q1:"요즘 누구랑 계속 비밀 연락해? 내 생일도 잊은 것 같고 솔직히 서운해.",a1:"잊은 건 아니야. 네가 불안해하는데 계속 숨기는 건 좋은 서프라이즈가 아닌 것 같아.",
    reveal:"나는 놀라는 것보다 내가 중요하지 않은 사람처럼 느껴지는 게 더 싫었어.",q2:"지금이라도 무슨 일인지 말해 줄 수 있어?",a2:"친구와 네 생일을 준비하고 있었어. 세부 내용만 조금 남겨 두고 연락 내역은 설명할게.",prompt:"서프라이즈 준비로 생긴 오해를 어떻게 풀까?",
    choices:[["준비 사실을 밝히고 불안하게 만든 점을 사과한다","놀라움보다 신뢰를 선택해 준비의 일부는 공개했지만 생일의 기쁨은 충분히 남았다."],["친구에게 연락해 함께 상황을 설명하고 계획을 조정한다","제3자의 확인까지 투명하게 보여 주고 연인이 편한 방식으로 남은 계획을 바꿨다."]]
  },
  "situation-birthday-wrong-gift":{
    q1:"고마운데 솔직히 내가 자주 쓸 스타일은 아닌 것 같아. 기분 나빠?",a1:"조금 아쉽지만 솔직하게 말해 줘서 고마워. 억지로 좋아하는 척하는 게 더 속상했을 거야.",
    reveal:"가격보다 전에 내가 했던 말을 기억하지 못한 것 같아서 서운했어.",q2:"같이 교환하러 가도 괜찮을까?",a2:"당연하지. 내가 놓친 취향도 듣고 네가 정말 원하는 걸 같이 고르자.",prompt:"취향과 어긋난 생일 선물을 어떻게 해결할까?",
    choices:[["서운함을 인정하고 함께 교환하러 간다","선물 선택의 실패를 방어하지 않고 새로운 데이트로 바꿔 서로의 취향을 더 알게 됐다."],["환불하고 다음 선물은 원하는 목록에서 고르기로 한다","정성의 의미와 실제 사용성을 분리해 앞으로 부담 없이 선물을 주고받을 기준을 만들었다."]]
  },
  "situation-ex-girlfriend-reunion":{
    q1:"오랜만이네. 지금 만나는 사람 있어도 나랑 잠깐 이야기할 수는 있지?",a1:"안부 정도는 괜찮지만 현재 연인에게 숨겨야 할 이야기는 하지 않을 거야.",
    reveal:"우리 헤어질 때 내가 묻지 못한 게 있어. 그때 정말 나를 사랑하긴 했어?",q2:"오늘 저녁에 둘이 만나서 마지막으로 이야기하면 안 될까?",a2:"과거를 정리하더라도 둘만의 비밀 약속으로 만들진 않을게.",prompt:"전 여자친구 유리의 재회 제안에 어떻게 답할까?",
    choices:[["저녁 제안을 거절하고 재회 사실을 현재 연인에게 알린다","유리에게 여지를 남기지 않고 현재 관계에 재회 사실을 숨기지 않아 과거와 현재의 경계를 분명히 했다."],["현재 연인에게 숨기고 유리와 저녁 약속을 잡는다","끝내지 못한 감정을 확인할 기회는 생겼지만 새로운 비밀이 현재 관계 안으로 들어왔다."]]
  },
  "situation-her-ex-returns":{
    q1:"전 남자친구가 마지막으로 만나서 정리하고 싶대. 네가 불편해도 다녀오면 안 될까?",a1:"불편하고 걱정되는 건 사실이야. 그래도 네가 왜 만나려는지 먼저 듣고 싶어.",
    reveal:"다시 시작하려는 게 아니라 과거를 제대로 끝낼 기회가 필요해.",q2:"내 선택을 믿어 줄 수 있어?",a2:"믿고 싶어. 다만 시간과 장소를 알려 주고, 끝난 뒤 우리 둘이 다시 이야기하자.",prompt:"연인의 전 남자친구와의 만남을 어떻게 받아들일까?",
    choices:[["불안한 감정을 솔직히 말하되 만남 여부는 연인에게 맡긴다","통제하려 하지 않고 자신의 불안을 설명해 신뢰와 자율성을 함께 지켰다."],["공개된 장소와 연락 시간을 합의한 뒤 만남을 받아들인다","막연히 참는 대신 안전하고 투명한 조건을 정해 과거를 정리할 공간을 만들었다."]]
  },
  "situation-haeun-home-outside-talk":{
    q1:"아직 집 안으로 초대하는 건 조금 부담스러워. 여기서 이야기해도 괜찮아?",a1:"괜찮아. 네가 편한 속도로 만나고 싶어. 잠깐 걷거나 여기서 이야기하자.",
    reveal:"서운해하지 않고 기다려 줘서 고마워. 부담 없이 얼굴을 보고 싶었어.",q2:"오늘은 얼마나 있다 가는 게 좋을까?",a2:"십 분 정도 이야기하고 갈게. 더 필요하면 네가 먼저 말해 줘.",prompt:"집 앞에서 조심스러운 하은에게 어떻게 답할까?",
    choices:[["집 앞에서 짧게 안부를 나누고 약속한 시간에 돌아간다","하은이 정한 거리와 시간을 존중해 다음 방문을 기대할 수 있는 신뢰를 남겼다."],["근처를 잠깐 걷자고 제안하고 선택을 맡긴다","부담 없는 대안을 제시하되 결정은 하은에게 맡겨 편안한 대화를 이어 갔다."]]
  },
  "situation-haeun-home-tea-talk":{
    q1:"요즘 서로 괜찮은 척하면서 숨기는 고민은 없는지 궁금해.",a1:"나는 일 때문에 여유가 없다는 말을 미뤘어. 네 문제라고 오해하게 만들고 싶지 않았어.",
    reveal:"나도 네가 걱정할까 봐 힘든 일을 자세히 말하지 않았어.",q2:"앞으로 힘든 날에는 어느 정도까지 서로 말해 줄까?",a2:"해결책이 없어도 힘들다는 사실은 당일에 알려 주자. 자세한 이야기는 준비됐을 때 하고.",prompt:"차를 마시며 서로 숨긴 고민을 어떻게 나눌까?",
    choices:[["먼저 최근에 숨겼던 고민을 구체적으로 털어놓는다","한 사람이 먼저 솔직해지자 하은도 조심스럽게 자신의 걱정을 꺼낼 수 있었다."],["힘든 날 사용할 짧은 연락 신호를 함께 정한다","매번 긴 설명을 요구하지 않고도 상태를 알릴 수 있는 현실적인 연락 방법을 만들었다."]]
  },
  "situation-haeun-home-meal":{
    q1:"다음에는 우리 같이 요리해 볼까? 어떤 걸 만들어 먹고 싶어?",a1:"복잡한 것보다 카레부터 같이 해 보고 싶어. 장보기와 설거지는 내가 맡을게.",
    reveal:"평범하게 같이 밥 먹는 시간이 생각보다 많이 좋다.",q2:"이런 저녁을 자주 보내도 부담스럽지 않을까?",a2:"좋아. 다만 한 사람이 계속 준비하지 않도록 번갈아 메뉴와 비용을 맡자.",prompt:"하은과 다음 집밥 약속을 어떻게 정할까?",
    choices:[["함께 만들 메뉴와 역할을 지금 정한다","다음 약속이 막연한 인사가 아니라 둘이 함께 준비할 구체적인 저녁이 되었다."],["격주로 서로 한 번씩 저녁을 준비하자고 제안한다","한 사람의 수고에 기대지 않는 규칙이 평범한 식사를 오래 이어 갈 약속으로 만들었다."]]
  },
  "situation-friend-advice-partner-work-stress":{
    q1:"요즘 하은 씨 많이 지쳐 보이던데, 너희 둘은 괜찮아?",a1:"나도 느꼈지만 내 추측으로 단정하고 싶진 않아. 오늘 직접 괜찮은지 물어보려고 해.",
    reveal:"괜히 해결책부터 말하지 말고, 쉴 시간이 필요한지 들어 주는 게 먼저일 것 같아.",q2:"오늘 연락할 때 뭐라고 시작할 건데?",a2:"요즘 힘들어 보이는데 내가 도울 일보다 먼저 네 이야기를 듣고 싶다고 말할게.",prompt:"지훈의 조언을 듣고 연인에게 어떻게 다가갈까?",
    choices:[["오늘 저녁 연인의 상태를 판단하지 않고 직접 묻는다","친구의 추측을 사실처럼 옮기지 않고 연인에게 직접 확인해 솔직한 대화의 기회를 만들었다."],["휴식이 필요한지 묻고 약속을 줄일 선택권을 준다","힘내라는 요구 대신 쉴 수 있는 여지를 제안해 연인이 부담 없이 상태를 말할 수 있게 했다."]]
  },
  "situation-friend-advice-partner-contact-drop":{
    q1:"요즘 둘이 연락이 줄었지? 그냥 바쁜 건지 서로 확인은 해 봤어?",a1:"아직 제대로 묻지 못했어. 괜히 부담 줄까 봐 기다렸는데 오히려 더 멀어진 것 같아.",
    reveal:"밖에서 이유를 맞히려 하지 말고, 짧게라도 대화할 시간을 먼저 잡아 봐.",q2:"오늘 바로 연락한다면 어떻게 말할래?",a2:"답을 재촉하지 않고 이번 주에 십 분이라도 통화할 수 있는 시간을 물어볼게.",prompt:"줄어든 연락에 관한 지훈의 조언을 어떻게 실행할까?",
    choices:[["연락 빈도를 탓하지 않고 대화 가능한 시간을 묻는다","서운함을 비난으로 시작하지 않아 서로의 최근 생활을 설명할 차분한 시간을 만들었다."],["서로 편한 연락 횟수와 바쁜 날의 신호를 다시 정한다","감정에만 기대지 않고 현재 생활에 맞는 연락 기준을 새로 합의할 계기를 만들었다."]]
  },
  "situation-minho-reports-minjun-date-invitation":{
    q1:"이걸 말해야 하나 고민했는데, 네가 모르는 것보다는 아는 게 나을 것 같아서.",a1:"무슨 일인데 그렇게 심각해? 들은 그대로 말해 줘.",
    reveal:"며칠 전에 민준이가 네 여자친구에게 이번 주말에 단둘이 만나자고 했어. 내가 들은 분위기로는 데이트 신청에 가까웠어.",q2:"그래도 바로 민준이한테 따지지는 말고, 여자친구한테 먼저 확인해 보는 게 어때?",a2:"그래. 남의 말만 듣고 단정하지 않고 여자친구의 대답부터 직접 들을게.",prompt:"민준의 데이트 신청을 전해 들은 나는 어떻게 대응할까?",
    choices:[["여자친구에게 사실을 차분하게 확인한다","민호의 충고대로 여자친구에게 먼저 사실을 물었다. 여자친구는 민준의 제안을 이미 거절했다며, 자신의 말을 먼저 들어 줘서 고맙다고 답했다."],["민준에게 먼저 연락해 선을 넘지 말라고 경고한다","여자친구의 대답을 듣기 전에 민준에게 경고했다. 여자친구는 자신이 직접 거절할 수 있었다며 믿어 주지 않은 점을 서운해했다."]]
  }
};

function compactFreeRomanceEvent(event){
  const route=LOCATION_RULES[event.id];
  event.modes=["free-romance"];
  event.triggerGroup=FRIEND_ADVICE_IDS.has(event.id)?"friend-advice":FRIEND_RELATED_IDS.has(event.id)?"friend-related":route?"location-visit":LOW_TRUST_IDS.has(event.id)?"low-trust":event.category==="temptation"?"coworker-temptation":event.category==="friends"?"friend-related":"random-before-evening";
  event.trigger=route?"location-enter":event.triggerGroup;
  event.locationCategories=route?.categories??[];
  if(route?.probability!=null)event.probability=route.probability;
  else event.probability=Math.min(event.probability*GENERAL_EVENT_PROBABILITY_MULTIPLIER,GENERAL_EVENT_PROBABILITY_CAP);
  if(LOW_TRUST_IDS.has(event.id)&&!event.conditions.some(condition=>condition.stat==="trust"))event.conditions.push({stat:"trust",operator:"<=",value:200});
  if(event.category==="temptation"){event.npcRequirements=["female-coworker"];event.minimumNpcInterest=45;}
  if(FRIEND_ADVICE_IDS.has(event.id)){event.npcRequirements=["best-friend"];event.conditions.push({stat:"relationshipStress",operator:">=",value:45});}
  if(event.id===MINHO_DATE_WARNING_ID){
    event.npcId="office-best-male";event.npcName="민호";event.eventType="COWORKER";event.timeOfDay="evening";
    event.npcRequirements=["office-best-male","male-rival","female-coworker"];
    event.npcInterestRequirements=[{npcId:"female-coworker",stat:"interestInPlayer",operator:">=",value:95}];
    event.relatedNpcIds=["office-best-male","male-rival","female-coworker"];
    event.conditionLabel="유진의 나에 대한 호감(관심) 95 이상";
    event.relationshipStates=["DISTANT","HONEYMOON","STABLE","PASSIONATE","SUSPICIOUS","CONFLICT","BREAKUP_RISK"];
  }
  const dialogue=FREE_ROMANCE_DIALOGUES[event.id];
  if(!dialogue)throw new Error(`자유모드 대화 데이터 누락: ${event.id}`);
  const source=event.scenes[0],speaker=event.npcName??(event.npcId==="player-ex"?"유리":event.category==="work"?"직장 동료":event.category==="friends"?"지훈":"연인");
  if(route?.categories?.includes("cafe"))source.backgroundId="cafe-rain-evening";
  if(event.id===MINHO_DATE_WARNING_ID){source.backgroundId="office-day";source.timeOfDay="evening";}
  source.title=event.title;source.transition="none";source.characterIds=[event.npcId];source.pose="standing";source.itemIds=[];
  source.dialogueTurns=[
    {type:"narration",speaker:"내레이션",text:event.hook},
    {type:"dialogue",speaker,text:dialogue.q1,expressionId:"calm"},
    {type:"dialogue",speaker:"플레이어",text:dialogue.a1},
    {type:"dialogue",speaker,text:dialogue.reveal,expressionId:"worried"},
    {type:"dialogue",speaker,text:dialogue.q2,expressionId:"calm"},
    {type:"dialogue",speaker:"플레이어",text:dialogue.a2},
    {type:"narration",speaker:"내레이션",text:event.echo}
  ];
  event.scenes=[source];event.question=dialogue.prompt;
  const honest=event.choices.find(choice=>choice.id==="honest"),protect=event.choices.find(choice=>choice.id==="protect"),risk=event.choices.find(choice=>choice.id==="risk");
  const risky=event.category==="temptation"||event.id==="situation-ex-girlfriend-reunion",firstBase=risky?protect:honest,secondBase=risky?risk:protect;
  event.choices=[
    {...firstBase,id:risky?"reject":"honest",label:dialogue.choices[0][0],response:dialogue.choices[0][1],flag:`${event.id}:${risky?"REJECT":"HONEST"}`},
    {...secondBase,id:risky?"accept":"protect",label:dialogue.choices[1][0],response:dialogue.choices[1][1],flag:`${event.id}:${risky?"ACCEPT":"BOUNDARY"}`}
  ];
  if(event.id==="situation-ex-girlfriend-reunion")event.choices=[
    {...event.choices[0],effects:{trust:8,relationshipStress:-3},npcEffects:{"player-ex":{affection:0}}},
    {...event.choices[1],effects:{trust:-8,excitement:10,relationshipStress:5},npcEffects:{"player-ex":{affection:15}}}
  ];
  if(event.id===MINHO_DATE_WARNING_ID)event.choices=[
    {...event.choices[0],id:"ask-partner",effects:{trust:8,affection:3,relationshipStress:-2},npcEffects:{"office-best-male":{trust:3,affection:2}},flag:`${event.id}:ASK_PARTNER`},
    {...event.choices[1],id:"warn-minjun",effects:{confidence:3,conflict:6,trust:-3,relationshipStress:5},npcEffects:{"office-best-male":{trust:-1}},flag:`${event.id}:WARN_MINJUN`}
  ];
  event.maxTriggerCount=1;event.repeatable=false;
  return event;
}
for(const event of BASE_SITUATION_EVENTS){event.excludedHeroineIds=["yuna"];if(!EXCLUDED_FREE_ROMANCE_IDS.has(event.id))compactFreeRomanceEvent(event);}
export const SITUATION_EVENTS=[...BASE_SITUATION_EVENTS.filter(event=>!EXCLUDED_FREE_ROMANCE_IDS.has(event.id)),...YUNA_STORY_EVENTS];
const STORY_CHAINS={
  "situation-almost-confession":["situation-late-dinner-coworker"],
  "situation-second-secret-meeting":["situation-coworker-private-drink","situation-almost-confession"],
  "situation-office-rumor":["situation-team-dinner-spark"],
  "situation-late-night-reconciliation":["situation-phone-notification-seen"],
  "situation-future-night-talk":["situation-parents-first-story"]
};
for(const event of BASE_SITUATION_EVENTS){event.requiredEvents=STORY_CHAINS[event.id]??[];event.chainId=event.category;event.chainStage=event.requiredEvents.length+1;}
export const EVENT_STATE_VALUES=["LOCKED","AVAILABLE","ACTIVE","COMPLETED","FAILED","COOLDOWN","CHAIN_ACTIVE"];

export function validateSituationEvents(events=SITUATION_EVENTS) {
  const ids=new Set(events.map(event=>event.id));
  const categories=Object.fromEntries(Object.keys(CATEGORY_CONFIG).map(category=>[category,events.filter(event=>event.category===category).length]));
  return events.length>=30&&ids.size===events.length&&categories.romance>=5&&categories.temptation>=5&&categories.conflict>=5&&categories.work>=4&&categories.friends>=5&&categories.money>=2&&categories.travel>=3&&categories.mystery>=2&&events.every(event=>event.scenes.length>=1&&event.scenes.reduce((sum,scene)=>sum+scene.dialogueTurns.length,0)>=7&&event.choices.length>=1&&event.storyFlag&&event.scenes.every(scene=>scene.backgroundId&&scene.characterIds.length&&scene.bgmId&&scene.expression&&scene.pose&&scene.transition)&&event.choices.every(choice=>choice.memory&&choice.flag&&choice.futureEventWeights));
}
