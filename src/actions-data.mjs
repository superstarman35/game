export const PHASES = [
  { key:"morning", label:"MORNING · 아침", time:"08:00", icon:"☀", title:"새로운 하루의 시작", text:"연인의 메시지와 함께 아침이 밝았다. 오늘의 첫 선택은?" },
  { key:"day", label:"DAYTIME · 낮", time:"12:30", icon:"◐", title:"바쁜 하루의 한가운데", text:"업무도 관계도 놓칠 수 없다. 점심시간을 어떻게 보낼까?" },
  { key:"evening", label:"EVENING · 저녁", time:"19:00", icon:"◇", title:"퇴근 후의 선택", text:"하루 중 가장 자유로운 시간. 누구와 무엇을 할지 선택하자." },
  { key:"night", label:"NIGHT · 밤", time:"22:00", icon:"☾", title:"하루가 끝나기 전에", text:"잠들기 전, 오늘을 마무리할 마지막 시간이 남았다." }
];

export const ACTIONS = {
  morning: [
    { id:"morning-idle", icon:"☁️", title:"아무것도 안 하기", desc:"잠시 멈춰서 아무 계획 없이 시간을 보낸다.", costLabel:"변화 없음", timeCost:1, effects:{}, tag:"휴식" },
    { id:"morning-contact", icon:"💬", title:"다정하게 연락하기", desc:"좋은 아침 인사로 서로의 하루를 시작한다.", costLabel:"호감 +3 · 신뢰 +2", timeCost:1, fixedEffects:["affection","trust"], effects:{ affection:3, trust:2, energy:-3 }, tag:"연락" },
    { id:"morning-gym", icon:"🏃", title:"아침 운동", desc:"가볍게 뛰며 몸과 자신감을 관리한다.", costLabel:"건강 +3", timeCost:1, requirements:[{ stat:"energy", operator:">=", value:12, message:"체력 12 이상 필요" }], effects:{ health:3, charm:1, confidence:1, fatigue:4, energy:-3, stress:-1 }, tag:"자기관리" },
    { id:"sleep-in", icon:"🛌", title:"조금 더 자기", desc:"피로를 풀지만 출근 준비는 아슬아슬하다.", costLabel:"에너지 +3 · 피로 -3", timeCost:1, effects:{ energy:3, fatigue:-3, work:-1, stress:-1 }, tag:"휴식" },
    { id:"early-work", icon:"☕", title:"일찍 출근하기", desc:"커피 한 잔과 함께 업무를 먼저 시작한다.", costLabel:"수입 +₩25,000 · 업무능력 +1", timeCost:1, effects:{ money:25000, work:1, energy:-8, fatigue:7, stress:8 }, tag:"성공" },
    { id:"manager-feedback", icon:"🗣️", title:"상사와 1:1 피드백", desc:"업무 조언을 얻어 성장 방향을 다듬는다.", costLabel:"업무능력 +1 · 스트레스 +10", timeCost:1, effects:{ work:1, confidence:1, stress:10, energy:-7 }, tag:"성장" }
  ],
  day: [
    { id:"day-idle", icon:"☁️", title:"아무것도 안 하기", desc:"점심시간 동안 조용히 쉬며 아무 행동도 하지 않는다.", costLabel:"변화 없음", timeCost:1, effects:{}, tag:"휴식" },
    { id:"focused-work", icon:"💼", title:"업무에 집중하기", desc:"성과를 내고 수입과 능력을 높인다.", costLabel:"수입 +₩45,000", timeCost:1, effects:{ money:45000, work:10, energy:-10, fatigue:9, stress:13, affection:-4 }, tag:"성공" },
    { id:"lunch-date", icon:"🍝", title:"연인과 점심", desc:"잠깐이라도 얼굴을 보며 함께 식사한다.", costLabel:"₩38,000", timeCost:1, requirements:[{ stat:"money", operator:">=", value:38000, message:"자산 ₩38,000 이상 필요" }], effects:{ money:-38000, affection:5, trust:5, stress:-1 }, tag:"데이트" },
    { id:"coworker-lunch", icon:"👥", title:"동료와 점심", desc:"회사 사람들과 가까워지고 정보를 얻는다.", costLabel:"₩14,000", timeCost:1, effects:{ money:-14000, social:9, work:4, affection:-2 }, tag:"인간관계" },
    { id:"stock-check", icon:"📈", title:"주식 확인하기", desc:"변동성 있는 시장에 작은 승부를 건다.", costLabel:"위험", timeCost:1, random:true, effects:{ stress:5 }, tag:"투자" }
  ],
  evening: [
    { id:"evening-go-home", icon:"🏠", title:"집으로 가기", desc:"약속을 잡지 않고 곧바로 귀가해 저녁 7시부터 집에서 시간을 보낸다.", costLabel:"19:00 귀가", timeCost:1, nightArrivalMinutes:19*60, effects:{ stress:-4, fatigue:-3, energy:4 }, tag:"귀가" },
    { id:"dinner-date", icon:"🌙", title:"근사한 데이트", desc:"예약해 둔 레스토랑에서 특별한 저녁을 보낸다.", costLabel:"₩120,000", timeCost:1, requirements:[{ stat:"money", operator:">=", value:120000, message:"자산 ₩120,000 이상 필요" },{ stat:"energy", operator:">=", value:10, message:"체력 10 이상 필요" }], effects:{ money:-120000, affection:13, trust:5, stress:-2, energy:-8, health:-1 }, tag:"데이트" },
    { id:"gift-shopping", icon:"🛍️", title:"선물 쇼핑", desc:"그녀가 좋아할 만한 작은 선물을 고른다.", costLabel:"₩75,000", timeCost:1, itemId:"rose-parfum", itemOwner:"gift", autoGift:true, effects:{ money:-75000, charm:3, confidence:2 }, tag:"쇼핑" },
    { id:"overtime", icon:"🌃", title:"야근하기", desc:"관계보다 오늘의 성과를 선택한다.", costLabel:"수입 +₩70,000", timeCost:1, effects:{ money:70000, work:1, affection:-7, energy:-16, health:-5, fatigue:10, stress:11 }, tag:"성공" },
    { id:"coworker-drinks", icon:"🍻", title:"동료의 술자리", desc:"새로운 인맥, 혹은 위험한 인연이 시작될 수 있다.", costLabel:"₩45,000 · 위험", timeCost:1, effects:{ money:-45000, social:12, trust:-8, stress:-8 }, tag:"유혹" }
  ],
  night: [
    { id:"night-idle", icon:"☁️", title:"아무것도 안 하기", desc:"별다른 활동 없이 조용히 밤을 보낸다.", costLabel:"변화 없음", timeCost:1, effects:{}, tag:"휴식" },
    { id:"night-call", icon:"♥", title:"통화하며 하루 마무리", desc:"오늘 있었던 일을 솔직하게 나눈다.", costLabel:"시간 1", timeCost:1, effects:{ affection:20, trust:18, energy:-5 }, tag:"연락" },
    { id:"short-message", icon:"📱", title:"짧게 메시지만", desc:"바쁘다는 핑계로 간단한 인사만 남긴다.", costLabel:"시간 0", timeCost:0, effects:{ affection:3, trust:1 }, tag:"연락" },
    { id:"online-shopping", icon:"🛒", title:"온라인 쇼핑", desc:"새 옷으로 패션과 기분을 챙긴다.", costLabel:"₩55,000", timeCost:1, itemId:"linen-shirt", itemOwner:"player", requirements:[{ stat:"money", operator:">=", value:55000, message:"자산 ₩55,000 이상 필요" }], effects:{ money:-55000, charm:8, fashion:8, confidence:4, stress:-5 }, tag:"쇼핑" },
    { id:"early-sleep", icon:"💤", title:"일찍 잠들기", desc:"내일을 위해 충분히 휴식한다.", costLabel:"시간 1", timeCost:1, effects:{ energy:5, health:2, fatigue:-8, stress:-3 }, tag:"휴식" }
  ]
};

Object.assign(ACTIONS.evening.find(action=>action.id==="dinner-date"),{excludedHeroineIds:["yuna"]});
Object.assign(ACTIONS.evening.find(action=>action.id==="coworker-drinks"),{excludedHeroineIds:["yuna"]});
Object.assign(ACTIONS.morning.find(action=>action.id==="manager-feedback"),{jobIds:["civil-servant","designer","developer"]});
Object.assign(ACTIONS.morning.find(action=>action.id==="early-work"),{jobIds:["freelancer","civil-servant","writer","multi-job-worker","day-laborer","designer","developer","visual-artist","aspiring-singer","actor","used-car-dealer","professional-athlete"]});
Object.assign(ACTIONS.day.find(action=>action.id==="focused-work"),{excludedJobIds:["college-student","exam-retaker","landlord-heir"]});
Object.assign(ACTIONS.day.find(action=>action.id==="coworker-lunch"),{jobIds:["civil-servant","multi-job-worker","day-laborer","designer","developer","aspiring-singer","actor","used-car-dealer","professional-athlete"]});
Object.assign(ACTIONS.evening.find(action=>action.id==="overtime"),{jobIds:["freelancer","civil-servant","writer","multi-job-worker","day-laborer","designer","developer","visual-artist","used-car-dealer"]});
Object.assign(ACTIONS.evening.find(action=>action.id==="coworker-drinks"),{jobIds:["civil-servant","multi-job-worker","day-laborer","designer","developer","aspiring-singer","actor","used-car-dealer","professional-athlete"]});
Object.assign(ACTIONS.day.find(action=>action.id==="lunch-date"),{weekendOnlyUnlessCareerIds:["university-student","freelancer","unemployed"]});
["early-work","manager-feedback","focused-work","coworker-lunch","overtime","coworker-drinks"].forEach(id=>{
  for(const phaseActions of Object.values(ACTIONS)){
    const action=phaseActions.find(item=>item.id===id);
    if(action)action.weekdayOnly=true;
  }
});

const CAREER_ACTIONS = [
  ["day",{id:"career-finance-plan",icon:"🧾",title:"공동 자산 계획 세우기",desc:"재무기획자인 그녀와 생활 예산과 목표를 함께 정한다.",costLabel:"신뢰 +18",timeCost:1,careerIds:["financial-planner"],effects:{trust:18,affection:8,work:4,stress:3},tag:"직업지원"}],
  ["evening",{id:"career-finance-report",icon:"📊",title:"투자 보고서 함께 검토하기",desc:"복잡한 수치와 투자 자료를 함께 살펴본다.",costLabel:"업무 +7 · 피로 +5",timeCost:1,careerIds:["financial-planner"],effects:{trust:12,work:7,fatigue:5,stress:3},tag:"직업지원"}],
  ["day",{id:"career-flower-delivery",icon:"💐",title:"꽃 배달 도와주기",desc:"예약된 꽃다발을 함께 포장하고 배달한다.",costLabel:"호감 +16",timeCost:1,careerIds:["florist"],effects:{affection:16,trust:8,energy:-6,fatigue:5},tag:"직업지원"}],
  ["evening",{id:"career-bouquet",icon:"🌹",title:"기념일 꽃다발 만들기",desc:"둘만의 의미를 담은 꽃다발을 함께 만든다.",costLabel:"₩25,000",timeCost:1,careerIds:["florist"],requirements:[{stat:"money",operator:">=",value:25000,message:"자산 ₩25,000 이상 필요"}],effects:{money:-25000,affection:28,trust:10,stress:-6},tag:"데이트"}],
  ["day",{id:"career-consulting-deck",icon:"📑",title:"발표 자료 검토해 주기",desc:"전략 컨설턴트인 그녀의 핵심 발표를 함께 점검한다.",costLabel:"신뢰 +16",timeCost:1,careerIds:["strategy-consultant"],effects:{trust:16,work:6,stress:5,fatigue:4},tag:"직업지원"}],
  ["evening",{id:"career-project-celebration",icon:"🥂",title:"프로젝트 성공 축하하기",desc:"긴 프로젝트를 끝낸 그녀와 근사한 저녁을 보낸다.",costLabel:"₩80,000",timeCost:1,careerIds:["strategy-consultant"],requirements:[{stat:"money",operator:">=",value:80000,message:"자산 ₩80,000 이상 필요"}],effects:{money:-80000,affection:24,trust:12,stress:-14},tag:"데이트"}],
  ["day",{id:"career-photo-assist",icon:"📷",title:"촬영 보조하기",desc:"장비를 챙기고 구도를 맞추며 촬영을 돕는다.",costLabel:"호감 +15",timeCost:1,careerIds:["travel-photographer"],effects:{affection:15,trust:10,social:5,energy:-7},tag:"직업지원"}],
  ["evening",{id:"career-night-photo",icon:"🌃",title:"즉흥 야경 출사 떠나기",desc:"빛이 좋은 장소를 찾아 둘만의 야경 사진을 남긴다.",costLabel:"설렘 +12",timeCost:1,careerIds:["travel-photographer"],effects:{affection:22,excitement:12,fatigue:8,energy:-7},tag:"데이트"}],
  ["day",{id:"career-restoration-material",icon:"📜",title:"복원 재료 구해 주기",desc:"희귀한 종이와 복원 도구를 찾아 전달한다.",costLabel:"₩30,000",timeCost:1,careerIds:["book-conservator"],requirements:[{stat:"money",operator:">=",value:30000,message:"자산 ₩30,000 이상 필요"}],effects:{money:-30000,trust:20,work:4},tag:"직업지원"}],
  ["evening",{id:"career-old-letter",icon:"✉️",title:"오래된 편지 함께 읽기",desc:"복원된 편지에 담긴 오래된 마음을 함께 읽는다.",costLabel:"신뢰 +24",timeCost:1,careerIds:["book-conservator"],effects:{trust:24,affection:16,stress:-5},tag:"추억"}],
  ["day",{id:"career-nurse-lunchbox",icon:"🍱",title:"야간 근무 도시락 챙겨주기",desc:"바쁜 병동에서도 먹을 수 있는 도시락을 준비한다.",costLabel:"₩22,000",timeCost:1,careerIds:["nurse"],requirements:[{stat:"money",operator:">=",value:22000,message:"자산 ₩22,000 이상 필요"}],effects:{money:-22000,trust:20,affection:12,energy:-4},tag:"직업지원"}],
  ["evening",{id:"career-nurse-care",icon:"🩺",title:"지친 여자친구 돌봐주기",desc:"긴 근무를 마친 그녀가 편히 쉴 수 있도록 돌본다.",costLabel:"스트레스 -16",timeCost:1,careerIds:["nurse"],effects:{affection:20,trust:18,stress:-16,energy:-5},tag:"돌봄"}],
  ["day",{id:"career-airport-ride",icon:"✈️",title:"공항까지 데려다주기",desc:"이른 비행을 앞둔 그녀를 공항까지 배웅한다.",costLabel:"₩35,000",timeCost:1,careerIds:["flight-attendant"],requirements:[{stat:"money",operator:">=",value:35000,message:"자산 ₩35,000 이상 필요"}],effects:{money:-35000,trust:24,affection:10,energy:-6},tag:"직업지원"}],
  ["evening",{id:"career-travel-gift",icon:"🎁",title:"여행지 선물 부탁하기",desc:"다음 비행에서 서로를 떠올릴 작은 선물을 정한다.",costLabel:"호감 +17",timeCost:1,careerIds:["flight-attendant"],effects:{affection:17,trust:14,excitement:9},tag:"추억"}],
  ["day",{id:"career-content-shoot",icon:"📱",title:"SNS 콘텐츠 촬영 도와주기",desc:"브랜드 콘텐츠의 모델과 촬영 보조를 맡는다.",costLabel:"매력 +7",timeCost:1,careerIds:["brand-marketer"],effects:{affection:13,trust:8,charm:7,social:6,energy:-5},tag:"직업지원"}],
  ["evening",{id:"career-brand-event",icon:"🎟️",title:"브랜드 행사에 동행하기",desc:"그녀의 공식 행사에서 세련된 파트너가 되어 준다.",costLabel:"패션 +6",timeCost:1,careerIds:["brand-marketer"],effects:{affection:16,social:10,fashion:6,stress:4},tag:"인간관계"}],
  ["day",{id:"career-dessert-tasting",icon:"🧁",title:"신메뉴 시식해 주기",desc:"파티시에인 그녀가 만든 디저트에 솔직한 의견을 전한다.",costLabel:"호감 +18",timeCost:1,careerIds:["patissier"],effects:{affection:18,trust:10,stress:-7},tag:"직업지원"}],
  ["evening",{id:"career-anniversary-cake",icon:"🎂",title:"기념일 케이크 함께 만들기",desc:"둘만의 취향을 담은 특별한 케이크를 완성한다.",costLabel:"₩28,000",timeCost:1,careerIds:["patissier"],requirements:[{stat:"money",operator:">=",value:28000,message:"자산 ₩28,000 이상 필요"}],effects:{money:-28000,affection:28,trust:12,excitement:8},tag:"데이트"}],
  ["day",{id:"career-couple-training",icon:"🏋️",title:"커플 트레이닝 받기",desc:"퍼스널 트레이너인 그녀에게 맞춤 운동을 배운다.",costLabel:"체력 +10",timeCost:1,careerIds:["personal-trainer"],effects:{health:7,energy:-8,fatigue:8,charm:5,affection:13},tag:"자기관리"}],
  ["evening",{id:"career-contest-prep",icon:"🏅",title:"대회 준비 도와주기",desc:"훈련 계획과 장비를 챙기며 대회 준비를 돕는다.",costLabel:"신뢰 +18",timeCost:1,careerIds:["personal-trainer"],effects:{trust:18,affection:10,energy:-7,fatigue:9},tag:"직업지원"}],
  ["day",{id:"career-campus-assignment",icon:"📚",title:"과제와 발표 준비 도와주기",desc:"성인 대학생인 그녀와 과제와 발표를 함께 준비한다.",costLabel:"신뢰 +16",timeCost:1,careerIds:["university-student"],effects:{trust:16,affection:10,work:4,fatigue:5},tag:"직업지원"}],
  ["evening",{id:"career-campus-date",icon:"🏫",title:"캠퍼스 데이트하기",desc:"수업이 끝난 캠퍼스를 걷고 저렴한 식사를 나눈다.",costLabel:"₩15,000",timeCost:1,careerIds:["university-student"],requirements:[{stat:"money",operator:">=",value:15000,message:"자산 ₩15,000 이상 필요"}],effects:{money:-15000,affection:22,excitement:10,stress:-8},tag:"데이트"}],
  ["day",{id:"career-civil-exam",icon:"📝",title:"자격시험 공부 응원하기",desc:"공무원인 그녀의 승진과 자격시험 준비를 응원한다.",costLabel:"신뢰 +18",timeCost:1,careerIds:["civil-servant"],effects:{trust:18,work:5,stress:4,fatigue:3},tag:"직업지원"}],
  ["evening",{id:"career-civil-walk",icon:"🚶",title:"퇴근 후 조용히 산책하기",desc:"안정적인 하루를 이야기하며 동네를 천천히 걷는다.",costLabel:"스트레스 -12",timeCost:1,careerIds:["civil-servant"],effects:{affection:18,trust:16,stress:-12},tag:"데이트"}],
  ["day",{id:"career-freelance-deadline",icon:"💻",title:"작업 마감 함께하기",desc:"프리랜서인 그녀의 촉박한 납품 작업을 함께 끝낸다.",costLabel:"신뢰 +17",timeCost:1,careerIds:["freelancer"],effects:{trust:17,work:6,stress:7,fatigue:6},tag:"직업지원"}],
  ["evening",{id:"career-find-client",icon:"🔎",title:"새로운 의뢰 찾아주기",desc:"포트폴리오를 정리하고 새로운 의뢰처를 함께 찾는다.",costLabel:"사회성 +8",timeCost:1,careerIds:["freelancer"],effects:{affection:12,trust:13,social:8,stress:4},tag:"직업지원"}],
  ["day",{id:"career-unemployed-plan",icon:"🧭",title:"진로 계획 함께 세우기",desc:"다음 일을 찾을 수 있도록 강점과 목표를 함께 정리한다.",costLabel:"신뢰 +20",timeCost:1,careerIds:["unemployed"],effects:{trust:20,affection:10,confidence:6,stress:3},tag:"성장"}],
  ["evening",{id:"career-unemployed-refresh",icon:"🌿",title:"기분 전환하러 나가기",desc:"취업 걱정을 잠시 내려놓고 가까운 곳에서 쉬어 간다.",costLabel:"₩20,000",timeCost:1,careerIds:["unemployed"],requirements:[{stat:"money",operator:">=",value:20000,message:"자산 ₩20,000 이상 필요"}],effects:{money:-20000,affection:20,trust:8,stress:-15},tag:"데이트"}]
];
export const GIRLFRIEND_SUPPORT_REWARD_SCALE = 0.5;
const GIRLFRIEND_SUPPORT_TAGS = new Set(["직업지원","돌봄","성장"]);
const GIRLFRIEND_SUPPORT_REWARD_STATS = new Set(["health","charm","fashion","confidence","work","social","affection","trust","excitement","attachment"]);

export function scaleGirlfriendSupportRewards(action) {
  const scaleReward=value=>Math.max(1,Math.round(value*GIRLFRIEND_SUPPORT_REWARD_SCALE));
  const effects=Object.fromEntries(Object.entries(action.effects??{}).map(([key,value])=>{
    if(GIRLFRIEND_SUPPORT_REWARD_STATS.has(key)&&value>0)return [key,scaleReward(value)];
    if(key==="stress"&&value<0)return [key,-scaleReward(Math.abs(value))];
    return [key,value];
  }));
  const costLabel=String(action.costLabel??"").includes("₩")?action.costLabel:String(action.costLabel??"").replace(/([+-])(\d+)/,(_,sign,value)=>`${sign}${scaleReward(Number(value))}`);
  return {...action,costLabel,effects};
}

CAREER_ACTIONS.forEach(([phase,action])=>ACTIONS[phase].push(GIRLFRIEND_SUPPORT_TAGS.has(action.tag)?scaleGirlfriendSupportRewards(action):action));

export const PLAYER_JOB_REWARD_SCALE = 0.5;
const PLAYER_JOB_REWARD_STATS = new Set(["health","charm","fashion","confidence","work","social","affection","trust","excitement","attachment"]);

export function scalePlayerJobActionRewards(action) {
  const scaleReward=value=>Math.max(1,Math.round(value*PLAYER_JOB_REWARD_SCALE));
  const effects=Object.fromEntries(Object.entries(action.effects??{}).map(([key,value])=>[key,PLAYER_JOB_REWARD_STATS.has(key)&&value>0?scaleReward(value):value]));
  const costLabel=String(action.costLabel??"").includes("₩")?action.costLabel:String(action.costLabel??"").replace(/\+(\d+)/,(_,value)=>`+${scaleReward(Number(value))}`);
  return {...action,costLabel,effects};
}

const PLAYER_JOB_ACTIONS = [
  ["day",{id:"job-freelancer-pitch",icon:"🤝",title:"신규 프로젝트 제안하기",desc:"새 고객에게 포트폴리오와 견적을 제안한다.",costLabel:"수입 +₩65,000",timeCost:1,jobIds:["freelancer"],effects:{money:65000,work:8,social:5,stress:7},tag:"직업"}],
  ["evening",{id:"job-freelancer-cowork",icon:"💻",title:"공유 작업실에서 마감하기",desc:"집중할 수 있는 공간에서 프로젝트를 끝낸다.",costLabel:"업무 +10",timeCost:1,jobIds:["freelancer"],effects:{work:10,fatigue:8,stress:5,energy:-8},tag:"직업"}],
  ["day",{id:"job-civil-complaint",icon:"🏛️",title:"민원 해결하기",desc:"복잡한 민원을 차분하게 조정해 시민의 신뢰를 얻는다.",costLabel:"업무 +9",timeCost:1,jobIds:["civil-servant"],effects:{work:9,social:6,stress:6,energy:-6},tag:"직업"}],
  ["evening",{id:"job-civil-emergency",icon:"📢",title:"비상 행정 지원하기",desc:"갑작스러운 현장 업무에 투입되어 추가 수당을 받는다.",costLabel:"수입 +₩45,000",timeCost:1,jobIds:["civil-servant"],effects:{money:45000,work:7,fatigue:9,stress:7},tag:"직업"}],
  ["day",{id:"job-writer-manuscript",icon:"✍️",title:"원고 몰입 집필하기",desc:"방해를 끊고 오늘 분량을 단숨에 써낸다.",costLabel:"업무 +11",timeCost:1,jobIds:["writer"],effects:{work:11,confidence:5,social:-2,stress:6,energy:-7},tag:"창작"}],
  ["evening",{id:"job-writer-talk",icon:"📖",title:"작가 모임 참석하기",desc:"동료 작가와 편집자를 만나 작품 이야기를 나눈다.",costLabel:"사회성 +10",timeCost:1,jobIds:["writer"],effects:{social:10,charm:5,work:5,money:-18000},tag:"인맥"}],
  ["day",{id:"job-multi-extra",icon:"🧾",title:"추가 근무 잡기",desc:"빈 시간에 단기 근무를 하나 더 소화한다.",costLabel:"수입 +₩55,000",timeCost:1,jobIds:["multi-job-worker"],effects:{money:55000,work:7,fatigue:12,energy:-10,stress:7},tag:"직업"}],
  ["evening",{id:"job-multi-swap",icon:"🔄",title:"근무 교대 협상하기",desc:"알바 동료들과 일정을 교환해 다음 날 여유를 만든다.",costLabel:"사회성 +9",timeCost:1,jobIds:["multi-job-worker"],effects:{social:9,trust:4,stress:-5,fatigue:4},tag:"직업"}],
  ["day",{id:"job-labor-skilled",icon:"🛠️",title:"숙련 작업 맡기",desc:"난도가 높은 현장 작업을 안전하게 완수한다.",costLabel:"수입 +₩70,000",timeCost:1,jobIds:["day-laborer"],effects:{money:70000,work:9,confidence:5,fatigue:12,energy:-12},tag:"직업"}],
  ["morning",{id:"job-labor-safety",icon:"⛑️",title:"현장 안전 준비하기",desc:"보호장비와 작업 순서를 점검해 사고 위험을 낮춘다.",costLabel:"건강 +7",timeCost:1,jobIds:["day-laborer"],effects:{health:7,work:5,stress:-5,energy:-4},tag:"자기관리"}],
  ["day",{id:"job-designer-portfolio",icon:"🎨",title:"포트폴리오 리뉴얼하기",desc:"대표 작업을 다듬어 자신의 감각을 선명하게 보여준다.",costLabel:"패션 +7",timeCost:1,jobIds:["designer"],effects:{work:8,fashion:7,charm:4,stress:4},tag:"창작"}],
  ["evening",{id:"job-designer-presentation",icon:"🖼️",title:"클라이언트 시안 발표하기",desc:"완성도 높은 시안으로 신규 계약을 따낸다.",costLabel:"수입 +₩80,000",timeCost:1,jobIds:["designer"],effects:{money:80000,work:8,confidence:7,stress:8},tag:"직업"}],
  ["day",{id:"job-developer-deploy",icon:"🚀",title:"신기능 배포하기",desc:"완성한 기능을 서비스에 안정적으로 반영한다.",costLabel:"업무 +12",timeCost:1,jobIds:["developer"],effects:{work:12,confidence:6,stress:7,fatigue:7},tag:"직업"}],
  ["evening",{id:"job-developer-refactor",icon:"⌨️",title:"코드 리팩터링하기",desc:"오래된 코드를 정리해 다음 개발 속도를 높인다.",costLabel:"업무 +10",timeCost:1,jobIds:["developer"],effects:{work:10,stress:4,fatigue:8,energy:-7},tag:"성장"}],
  ["day",{id:"job-student-project",icon:"🎓",title:"팀 프로젝트 발표하기",desc:"팀원과 준비한 발표로 좋은 평가를 노린다.",costLabel:"업무 +8",timeCost:1,jobIds:["college-student"],effects:{work:8,social:7,confidence:6,stress:5},tag:"성장"}],
  ["evening",{id:"job-student-club",icon:"🎸",title:"동아리 모임 가기",desc:"캠퍼스 친구들과 취미를 나누며 인맥을 넓힌다.",costLabel:"사회성 +12",timeCost:1,jobIds:["college-student"],effects:{social:12,charm:5,stress:-8,money:-15000},tag:"인맥"}],
  ["day",{id:"job-landlord-inspection",icon:"🏢",title:"건물 시설 점검하기",desc:"임대 건물의 시설과 계약 상태를 직접 살핀다.",costLabel:"수입 +₩75,000",timeCost:1,jobIds:["landlord-heir"],effects:{money:75000,work:6,confidence:4,stress:3},tag:"자산"}],
  ["evening",{id:"job-landlord-support",icon:"🔑",title:"세입자 문제 해결하기",desc:"불편 사항을 빠르게 처리해 건물 평판을 지킨다.",costLabel:"신뢰 +8",timeCost:1,jobIds:["landlord-heir"],effects:{social:8,work:5,trust:8,money:-30000},tag:"자산"}],
  ["day",{id:"job-artist-masterpiece",icon:"🖌️",title:"신작에 몰입하기",desc:"감정을 캔버스에 쏟아부어 대표작을 노린다.",costLabel:"업무 +10",timeCost:1,jobIds:["visual-artist"],effects:{work:10,charm:7,stress:5,energy:-8},tag:"창작"}],
  ["evening",{id:"job-artist-gallery",icon:"🖼️",title:"갤러리 관계자 만나기",desc:"큐레이터에게 작품을 소개해 전시 기회를 만든다.",costLabel:"사회성 +11",timeCost:1,jobIds:["visual-artist"],effects:{social:11,confidence:7,money:-25000,stress:4},tag:"인맥"}],
  ["day",{id:"job-singer-audition",icon:"🎤",title:"오디션 무대 서기",desc:"준비한 곡으로 심사위원 앞에서 가능성을 증명한다.",costLabel:"자신감 +10",timeCost:1,jobIds:["aspiring-singer"],effects:{confidence:10,charm:8,work:7,stress:9},tag:"도전"}],
  ["evening",{id:"job-singer-busking",icon:"🎶",title:"거리 공연하기",desc:"관객 앞에서 노래하며 팬과 공연비를 얻는다.",costLabel:"수입 +₩40,000",timeCost:1,jobIds:["aspiring-singer"],effects:{money:40000,charm:9,social:8,fatigue:7},tag:"공연"}],
  ["day",{id:"job-actor-audition",icon:"🎬",title:"배역 오디션 보기",desc:"대본 분석과 연기로 새로운 배역에 도전한다.",costLabel:"매력 +8",timeCost:1,jobIds:["actor"],effects:{charm:8,confidence:8,work:7,stress:8},tag:"도전"}],
  ["evening",{id:"job-actor-rehearsal",icon:"🎭",title:"상대 배우와 리허설하기",desc:"장면의 호흡을 맞추며 연기 완성도를 높인다.",costLabel:"업무 +9",timeCost:1,jobIds:["actor"],effects:{work:9,social:8,trust:-3,fatigue:6},tag:"직업"}],
  ["day",{id:"job-retaker-mock",icon:"📝",title:"실전 모의고사 보기",desc:"시간을 재며 약점을 찾아 다음 학습 계획을 세운다.",costLabel:"업무 +10",timeCost:1,jobIds:["exam-retaker"],effects:{work:10,confidence:5,stress:8,energy:-6},tag:"공부"}],
  ["evening",{id:"job-retaker-study",icon:"📚",title:"스터디 모임 참여하기",desc:"수험생들과 문제 풀이 방법과 진도 계획을 공유한다.",costLabel:"사회성 +7",timeCost:1,jobIds:["exam-retaker"],effects:{work:7,social:7,stress:-4,money:-8000},tag:"공부"}],
  ["day",{id:"job-dealer-buy-car",icon:"🚙",title:"딜러가로 자동차 매입하기",desc:"업계 경매와 인맥을 이용해 전기 세단을 40% 저렴하게 산다.",costLabel:"₩12,000,000",timeCost:1,jobIds:["used-car-dealer"],itemId:"solstice-ev",itemOwner:"player",requirements:[{stat:"money",operator:">=",value:12000000,message:"자산 ₩12,000,000 이상 필요"}],effects:{money:-12000000,social:5,confidence:6},tag:"딜러 특전"}],
  ["evening",{id:"job-dealer-gift-car",icon:"🎁",title:"여자친구에게 자동차 선물하기",desc:"딜러 네트워크로 전기 세단을 30% 할인해 선물한다.",costLabel:"₩14,000,000",timeCost:1,jobIds:["used-car-dealer"],itemId:"solstice-ev",itemOwner:"gift",autoGift:true,requirements:[{stat:"money",operator:">=",value:14000000,message:"자산 ₩14,000,000 이상 필요"}],effects:{money:-14000000,affection:80,trust:35},tag:"딜러 특전"}],
  ["day",{id:"job-athlete-training",icon:"🏋️",title:"프로 훈련 집중하기",desc:"기술과 체력을 한계까지 끌어올리는 훈련을 한다.",costLabel:"건강 +10",timeCost:1,jobIds:["professional-athlete"],effects:{health:10,confidence:8,work:7,fatigue:12,energy:-12},tag:"자기관리"}],
  ["evening",{id:"job-athlete-match",icon:"🏟️",title:"공식 경기 출전하기",desc:"관중 앞에서 실력을 증명하고 출전 수당을 받는다.",costLabel:"수입 +₩120,000",timeCost:1,jobIds:["professional-athlete"],effects:{money:120000,confidence:10,charm:7,fatigue:15,stress:8},tag:"경기"}]
];
PLAYER_JOB_ACTIONS.forEach(([phase,action])=>ACTIONS[phase].push({...action,weekdayOnly:true}));

const ARCHETYPE_ACTIONS = [
  ["evening",{id:"handsome-meet-friends",icon:"🧑‍🤝‍🧑",title:"친구들 만나기",desc:"오랜 친구들과 편하게 어울리며 기분을 푼다.",costLabel:"사회성 +1 · 스트레스 -3",timeCost:1,archetypeIds:["handsome"],effects:{social:1,stress:-3,confidence:1},tag:"외모 특전"}],
  ["evening",{id:"handsome-meet-female-friends",icon:"✨",title:"여자 사람 친구들 만나기",desc:"호감을 보이는 여자 사람 친구들과 어울린다. 연인의 신뢰가 흔들릴 수 있다.",costLabel:"신뢰 -24 · 호감 -24 · 갈등 +10",timeCost:1,archetypeIds:["handsome"],effects:{social:1,confidence:1,trust:-24,affection:-24,conflict:10},tag:"유혹"}],
  ["evening",{id:"wealthy-social-club",icon:"🥂",title:"프라이빗 사교 모임 가기",desc:"사업가와 투자자가 모이는 비공개 모임에서 인맥을 만든다.",costLabel:"₩180,000",timeCost:1,archetypeIds:["wealthy"],requirements:[{stat:"money",operator:">=",value:180000,message:"자산 ₩180,000 이상 필요"}],effects:{money:-180000,social:18,work:7,confidence:8},tag:"부자 특전"}],
  ["evening",{id:"wealthy-spend-relief",icon:"💎",title:"호화롭게 돈 쓰기",desc:"좋은 음식과 서비스를 마음껏 즐기며 스트레스를 푼다.",costLabel:"₩300,000 · 스트레스 -30",timeCost:1,archetypeIds:["wealthy"],requirements:[{stat:"money",operator:">=",value:300000,message:"자산 ₩300,000 이상 필요"}],effects:{money:-300000,stress:-30,fatigue:-8,confidence:8},tag:"부자 특전"}]
];
ARCHETYPE_ACTIONS.forEach(([phase,action])=>ACTIONS[phase].push(action));
ACTIONS.day.push({id:"yuna-library-study",icon:"📚",title:"유나와 도서관 공부",desc:"시험과 진로 이야기를 나누며 함께 문제를 푼다.",costLabel:"₩8,000",timeCost:1,heroineIds:["yuna"],requirements:[{stat:"money",operator:">=",value:8000,message:"자산 ₩8,000 이상 필요"}],effects:{money:-8000,affection:14,trust:14,stress:-4,energy:-4},tag:"데이트"});
ACTIONS.evening.push({id:"yuna-after-school-snack",icon:"🍢",title:"유나와 방과 후 분식",desc:"분식집에서 오늘 학교에서 있었던 일을 듣는다.",costLabel:"₩16,000",timeCost:1,heroineIds:["yuna"],requirements:[{stat:"money",operator:">=",value:16000,message:"자산 ₩16,000 이상 필요"}],effects:{money:-16000,affection:20,trust:9,excitement:8,stress:-7},tag:"데이트"});

for(const phase of PHASES)ACTIONS[phase.key]=ACTIONS[phase.key].map(action=>action.jobIds?.length?scalePlayerJobActionRewards(action):action);

export function validateActionData(actions = ACTIONS, phases = PHASES) {
  const ids = new Set();
  return phases.every(phase => Array.isArray(actions[phase.key]) && actions[phase.key].every(action => {
    const requirementsValid = (action.requirements ?? []).every(item => typeof item.stat === "string" && typeof item.operator === "string" && Number.isFinite(item.value) && typeof item.message === "string");
    const valid = typeof action.id === "string" && !ids.has(action.id) && typeof action.title === "string" && typeof action.desc === "string" && typeof action.costLabel === "string" && Number.isFinite(action.timeCost) && typeof action.tag === "string" && action.effects && Object.values(action.effects).every(Number.isFinite) && requirementsValid;
    ids.add(action.id);
    return valid;
  }));
}
