const npc = (id,name,age,gender,job,role,category,relationshipType,interestTarget,personality,baseAttraction,rivalPotential,temptationPotential,storyTags,links=[]) => ({
  id,name,age,gender,job,role,category,relationshipType,interestTarget,personality,baseAttraction,
  affinityToPlayer:30,affinityToHeroine:30,baseTrust:35,rivalPotential,temptationPotential,storyTags,links
});

export const NPC_ARCHETYPES = [
  npc("female-coworker","유진",27,"female","서비스 기획자","친한 여성 동료","office","coworker","player","사교적·눈치 빠름",52,25,88,["work","temptation"],["team-lead","office-gossip"]),
  npc("team-lead","정태석",39,"male","제품 팀장","직장 상사","office","boss","none","원칙적·성과 중심",8,4,2,["work","promotion"],["executive-director"]),
  npc("office-best-male","민호",30,"male","개발자","친한 남자 동료","office","coworker","none","유쾌·의리",12,5,5,["work","friend"],["female-coworker"]),
  npc("office-rival","서준",32,"male","프로덕트 매니저","승진 경쟁자","office","rival","player","야심·정치적",38,78,12,["work","competition"],["team-lead"]),
  npc("office-rookie","채린",24,"female","신입사원","신입사원","office","coworker","player","성실·호기심",40,15,52,["work","mentoring"],["female-coworker"]),
  npc("office-partner","도현",34,"male","데이터 분석가","프로젝트 파트너","office","coworker","none","논리적·무뚝뚝",15,8,2,["work","project"],["team-lead"]),
  npc("client-manager","수빈",35,"female","브랜드 매니저","거래처 담당자","office","acquaintance","player","세련·협상가",48,18,55,["work","business"],["office-partner"]),
  npc("office-party","강우",33,"male","영업 담당","회식 주도 동료","office","coworker","none","외향·술자리",20,10,20,["work","drinks"],["office-gossip"]),
  npc("office-gossip","미경",36,"female","운영 매니저","소문에 빠른 동료","office","coworker","none","관찰·수다",18,8,15,["work","rumor"],["female-coworker","office-party"]),
  npc("executive-director","윤재호",46,"male","본부장","임원","office","boss","none","냉정·전략적",6,5,1,["work","promotion"],["team-lead"]),

  npc("best-friend","지훈",29,"male","영상 편집자","플레이어 절친","friend","friend","none","솔직·보호적",10,2,3,["advice","friend"],["college-friend"]),
  npc("heroine-best-friend","소라",28,"female","출판 편집자","여자친구의 절친","friend","friend","none","세심·경계심",18,12,8,["heroine","advice"],["male-rival"]),
  npc("female-friend","하린",29,"female","UX 라이터","오래된 여사친","friend","friend","player","편안·장난기",46,24,68,["friend","temptation"],["best-friend"]),
  npc("male-friend","현우",30,"male","건축가","여자친구의 남사친","friend","friend","girlfriend","차분·배려",44,58,5,["heroine","rival"],["heroine-best-friend"]),
  npc("college-friend","태민",29,"male","공무원","대학 동기","friend","friend","none","현실적·안정형",12,5,2,["friend","past"],["best-friend"]),
  npc("investor-friend","다희",31,"female","개인 투자자","투자 친구","friend","friend","none","대담·분석적",28,8,14,["investment","friend"],["asset-advisor"]),
  npc("drinking-friend","준호",30,"male","바 매니저","술 좋아하는 친구","friend","friend","none","호탕·즉흥",16,4,8,["drinks","friend"],["cafe-staff"]),
  npc("love-advisor","예림",33,"female","상담 심리사","연애 상담 친구","friend","friend","none","공감·직관적",14,2,3,["advice","relationship"],["hospital-nurse"]),

  npc("male-rival","민준",34,"male","벤처 대표","조건 좋은 남자","rival","rival","girlfriend","여유·집요",62,92,5,["rival","wealth"],["heroine-best-friend"]),
  npc("heroine-senior","시우",33,"male","크리에이티브 디렉터","여자친구 직장 선배","rival","rival","girlfriend","능숙·세심",55,82,4,["rival","work"],["male-rival"]),
  npc("heroine-ex","도윤",31,"male","뮤지션","여자친구의 전 연인","rival","ex","girlfriend","감성·미련",58,88,2,["rival","ex"],["heroine-best-friend"]),
  npc("player-ex","유리",28,"female","고서 복원가","전 여자친구","rival","ex","player","차분·미스터리·여운",54,36,76,["ex","temptation"],["edit-shop-staff"]),
  npc("ambitious-admirer","세아",30,"female","변호사","플레이어에게 호감 있는 여성","rival","admirer","player","직설·자신감",64,30,90,["temptation","career"],["client-manager"]),
  npc("gentle-admirer","은호",28,"male","수의사","여자친구에게 호감 있는 남성","rival","admirer","girlfriend","온화·꾸준",50,70,3,["rival","daily"],["cafe-staff"]),

  npc("cafe-staff","봄",24,"female","바리스타","단골 카페 직원","life","acquaintance","none","밝음·기억력",30,4,12,["cafe","daily"],["drinking-friend"]),
  npc("gym-trainer","재민",32,"male","퍼스널 트레이너","헬스장 트레이너","life","acquaintance","none","활력·엄격",36,10,8,["health","growth"],["hospital-nurse"]),
  npc("edit-shop-staff","로아",26,"female","스타일리스트","편집숍 직원","life","acquaintance","none","감각·친절",38,5,14,["fashion","shopping"],["player-ex"]),
  npc("hospital-nurse","혜원",35,"female","간호사","병원 직원","life","acquaintance","none","차분·돌봄",22,2,2,["health","care"],["love-advisor"]),
  npc("real-estate-agent","경수",41,"male","공인중개사","부동산 직원","life","acquaintance","none","현실·협상",10,2,1,["home","asset"],["asset-advisor"]),
  npc("asset-advisor","인아",37,"female","자산관리사","투자 상담 NPC","life","acquaintance","none","신중·정확",18,3,3,["investment","asset"],["investor-friend","real-estate-agent"])
];

export const NPC_SOCIAL_GRAPH = NPC_ARCHETYPES.flatMap(character => character.links.map(targetId => ({ from:character.id,to:targetId,type:character.relationshipType === "ex" ? "ex" : character.category === "office" ? "coworker" : character.category === "friend" ? "friend" : "acquaintance" })));

export const NPC_ACTION_RULES = [
  { actionId:"coworker-lunch", npcId:"office-best-male", effects:{ affection:1 }, displayEffectKey:"minhoAffection" },
  { actionId:"coworker-lunch", npcId:"office-partner", effects:{ affection:1 }, displayEffectKey:"dohyunAffection" },
  { actionId:"coworker-drinks", npcId:"female-coworker", effects:{ affection:12, trust:3, interestInPlayer:10 } },
  { actionId:"focused-work", npcId:"team-lead", effects:{ affection:3, trust:7 } },
  { actionId:"early-work", npcId:"team-lead", effects:{ affection:2, trust:5 } },
  { actionId:"manager-feedback", npcId:"team-lead", effects:{ affection:5, trust:10 } }
];

export function validateNpcArchetypes(archetypes = NPC_ARCHETYPES) {
  const ids = new Set();
  return archetypes.length >= 30 && archetypes.every(character => typeof character.id === "string" && !ids.has(character.id) && ids.add(character.id) && typeof character.name === "string" && Number.isInteger(character.age) && ["male","female","nonbinary"].includes(character.gender) && typeof character.job === "string" && typeof character.role === "string" && ["office","friend","rival","life"].includes(character.category) && typeof character.relationshipType === "string" && ["player","girlfriend","none"].includes(character.interestTarget) && Number.isFinite(character.baseAttraction) && Number.isFinite(character.rivalPotential) && Number.isFinite(character.temptationPotential) && Array.isArray(character.storyTags));
}
