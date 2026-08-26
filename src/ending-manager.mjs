import { getAssetSummary } from "./economy-manager.mjs";
import { getPortfolioSummary } from "./investment-manager.mjs";

const secretChoiceCount = state => (state.temptationHistory ?? []).filter(entry => ["secret","affair"].includes(entry.choiceId)).length;
const rivalInterest = state => (state.npcs ?? []).find(npc => npc.relationshipType === "rival")?.interestInGirlfriend ?? 0;
const hasFutureTalk = state => (state.storyHistory ?? []).some(entry => entry.sceneId === "future-talk");
const futureReady = (state, minimum) => !hasFutureTalk(state) || (state.futureScore ?? 0) >= minimum;
const hiddenRouteStarted = state => state.hiddenRoute?.active === true && state.hiddenRoute?.started === true;
export const ENDING_BALANCE_THRESHOLDS = Object.freeze({
  wealthyNetWorth: 3000000,
  loveAffection: 820,
  loveTrust: 780
});

export const ENDING_DEFINITIONS = [
  { id:"hidden-escape", title:"도망", description:"돈과 건강, 일상이 무너지는 끝에서 연락을 끊었다. 사랑은 남았지만 살아남았다.", matches:state => hiddenRouteStarted(state) && state.hiddenRoute.choseLeave && (state.stress >= 80 || state.health <= 30 || state.money < 100000 || state.hiddenRoute.burden >= 700) },
  { id:"hidden-role-reversal", title:"이번에는 내가", description:"초반에는 받기만 하던 그녀가 처음으로 힘든 플레이어의 곁을 지키러 왔다.", matches:state => hiddenRouteStarted(state) && state.hiddenRoute.receivedSupport && state.hiddenRoute.change >= 450 && state.hiddenRoute.boundary >= 400 },
  { id:"hidden-mutual-life", title:"우리 둘 다 살아가는 연애", description:"사랑을 지키되 서로의 삶까지 대신 살지는 않기로 했다. 두 사람은 각자의 책임과 도움의 경계를 함께 세웠다.", matches:state => hiddenRouteStarted(state) && !state.hiddenRoute.choseLeave && state.hiddenRoute.change >= 500 && state.hiddenRoute.boundary >= 550 && state.hiddenRoute.dependency < 700 && state.hiddenRoute.stability >= 350 },
  { id:"hidden-dependent-love", title:"나 없으면 안 되잖아", description:"호감은 넘쳤지만 모든 문제를 대신 해결한 끝에 사랑은 벗어날 수 없는 역할이 되었다.", matches:state => hiddenRouteStarted(state) && !state.hiddenRoute.choseLeave && (state.hiddenRoute.dependency >= 700 || state.hiddenRoute.boundary < 300) },
  { id:"hidden-love-to-here", title:"사랑하지만 여기까지", description:"좋아하는 마음은 남아 있었다. 그래서 서로를 계속 망가뜨리기 전에 관계를 끝내기로 했다.", matches:state => hiddenRouteStarted(state) },
  { id:"betrayal-revealed", title:"바람 발각", description:"숨겨 온 선택이 드러나며 두 사람의 신뢰는 돌이킬 수 없이 무너졌다.", matches:state => secretChoiceCount(state) > 0 && state.trust < 400 },
  { id:"rival-chosen", title:"그녀의 다른 선택", description:"멀어진 마음 사이로 들어온 새로운 인연을 그녀는 외면하지 않았다.", matches:state => rivalInterest(state) >= 75 && state.affection < 500 && state.trust < 500 },
  { id:"economic-breakup", title:"경제 문제 이별", description:"계속되는 생활의 압박은 사랑만으로 견디기 어려운 벽이 되었다.", matches:state => getAssetSummary(state).netWorth < 200000 && state.conflict >= 50 },
  { id:"love-breakup", title:"사랑하지만 이별", description:"좋아하는 마음은 남았지만 함께 살아갈 방법을 끝내 찾지 못했다.", matches:state => state.storyFlags?.choseSeparation === true || state.affection < 350 || state.trust < 250 },
  { id:"investment-failure", title:"투자 실패", description:"큰 손실 뒤에 남은 것은 다시 시작할 용기와 값비싼 경험이었다.", matches:state => getPortfolioSummary(state).profitLoss <= -200000 },
  { id:"lottery-reversal", title:"복권 인생 역전", description:"작은 행운을 향한 한 장의 선택이 두 사람의 내일을 완전히 바꾸었다.", matches:state => (state.lottery?.totalWon ?? 0) >= 500000 },
  { id:"investment-success", title:"투자 성공", description:"위험을 읽고 기다린 선택이 눈부신 자산과 새로운 가능성으로 돌아왔다.", matches:state => getPortfolioSummary(state).profitLoss >= 200000 },
  { id:"wealthy-marriage", title:"경제적으로 성공한 결혼", description:"사랑과 경제적 안정을 함께 쌓은 두 사람은 든든한 미래를 약속했다.", matches:state => getAssetSummary(state).netWorth >= ENDING_BALANCE_THRESHOLDS.wealthyNetWorth && state.affection >= 650 && state.trust >= 600 && futureReady(state,8) },
  { id:"happy-marriage", title:"행복한 결혼", description:"수많은 선택 끝에 서로를 가장 잘 아는 두 사람은 평생을 약속했다.", matches:state => state.affection >= 850 && state.trust >= 800 && state.conflict < 45 && futureReady(state,12) },
  { id:"love-marriage", title:"사랑으로 결혼", description:"완벽하지 않아도 서로의 편이 되어 온 시간은 한 번뿐인 약속이 되었다.", matches:state => state.affection >= ENDING_BALANCE_THRESHOLDS.loveAffection && state.trust >= ENDING_BALANCE_THRESHOLDS.loveTrust && futureReady(state,8) },
  { id:"marriage-postponed", title:"결혼 연기", description:"사랑은 충분하지만 지금은 각자의 성장을 조금 더 기다리기로 했다.", matches:state => state.affection >= 550 && state.trust >= 550 && (state.partner.personality.marriageDesire < 45 || (hasFutureTalk(state) && !futureReady(state,8))) },
  { id:"long-romance", title:"장기 연애", description:"서두르지 않아도 좋았다. 두 사람은 익숙하고 단단한 사랑을 이어 갔다.", matches:state => state.affection >= 600 && state.trust >= 600 },
  { id:"ennui", title:"권태기", description:"헤어질 이유도 붙잡을 확신도 없는 채, 두 사람은 관계를 다시 바라보기로 했다.", matches:state => state.conflict >= 55 || state.relationshipStress >= 65 },
  { id:"new-beginning", title:"새로운 시작", description:"30일의 선택은 끝났지만, 자신의 삶을 이해하는 새로운 여정이 시작됐다.", matches:() => true }
];

const endingPlan=(category,conditionLabel,relatedEventIds=[],systemEvents=[])=>Object.freeze({category,conditionLabel,relatedEventIds:Object.freeze(relatedEventIds),systemEvents:Object.freeze(systemEvents)});

export const ENDING_TOOL_PLANS = Object.freeze({
  "hidden-escape":endingPlan("히든 루트","히든 루트 시작 + 떠나기 선택 + 스트레스 80 이상 / 건강 30 이하 / 자산 10만원 미만 / 부담 700 이상 중 하나",[],["히든 루트 시작","떠나기 선택","생활 붕괴 판정"]),
  "hidden-role-reversal":endingPlan("히든 루트","히든 루트 시작 + 하은에게 도움받음 + 변화 450 이상 + 경계 400 이상",[],["히든 루트 도움 요청","하은의 역할 역전"]),
  "hidden-mutual-life":endingPlan("히든 루트","떠나지 않음 + 변화 500 이상 + 경계 550 이상 + 의존 700 미만 + 안정 350 이상",[],["히든 루트 상호 회복","생활 경계 합의"]),
  "hidden-dependent-love":endingPlan("히든 루트","떠나지 않음 + 의존 700 이상 또는 경계 300 미만",[],["히든 루트 대신 해결","의존 관계 누적"]),
  "hidden-love-to-here":endingPlan("히든 루트","히든 루트를 시작했지만 위의 히든 엔딩 조건을 충족하지 못함",[],["히든 루트 최종 선택"]),
  "betrayal-revealed":endingPlan("관계 파국","비밀 만남 또는 바람 선택 1회 이상 + 신뢰도 400 미만",["situation-coworker-private-drink","situation-second-secret-meeting","situation-phone-notification-seen","situation-caught-with-coworker"],["유혹 행동 · 비밀 선택"]),
  "rival-chosen":endingPlan("관계 파국","라이벌의 여자친구 관심 75 이상 + 호감도 500 미만 + 신뢰도 500 미만",["situation-girlfriend-with-stranger","situation-her-ex-returns","situation-minho-reports-minjun-date-invitation"],["라이벌 압박 누적"]),
  "economic-breakup":endingPlan("관계 파국","순자산 20만원 미만 + 갈등 50 이상",["situation-budget-date","situation-fine-dining-truth"],["생활비 결산","자산 하락"]),
  "love-breakup":endingPlan("관계 파국","이별 선택 또는 호감도 350 미만 또는 신뢰도 250 미만",["situation-future-night-talk","situation-travel-big-fight"],["이별 선택","관계 수치 하락"]),
  "investment-failure":endingPlan("경제","투자 손익 -20만원 이하",[],["스마트폰 · 투자","주식 매도 손익"]),
  "lottery-reversal":endingPlan("경제","복권 누적 당첨금 50만원 이상",[],["스마트폰 · 복권","복권 당첨 기록"]),
  "investment-success":endingPlan("경제","투자 손익 +20만원 이상",[],["스마트폰 · 투자","주식 매도 손익"]),
  "wealthy-marriage":endingPlan("결혼","순자산 300만원 이상 + 호감도 650 이상 + 신뢰도 600 이상 + 미래 대화 미발생 또는 미래 점수 8 이상",["situation-future-night-talk","situation-promotion-relocation"],["자산 결산","미래 점수"]),
  "happy-marriage":endingPlan("결혼","호감도 850 이상 + 신뢰도 800 이상 + 갈등 45 미만 + 미래 대화 미발생 또는 미래 점수 12 이상",["situation-future-night-talk","situation-first-trip","situation-parents-first-story"],["관계 수치 결산","미래 점수"]),
  "love-marriage":endingPlan("결혼","호감도 820 이상 + 신뢰도 780 이상 + 미래 대화 미발생 또는 미래 점수 8 이상",["situation-future-night-talk","situation-meet-her-friends"],["관계 수치 결산","미래 점수"]),
  "marriage-postponed":endingPlan("연애 지속","호감도·신뢰도 550 이상 + 결혼 의향 45 미만 또는 미래 대화 후 미래 점수 8 미만",["situation-future-night-talk","situation-promotion-relocation"],["여자친구 결혼 의향","미래 점수"]),
  "long-romance":endingPlan("연애 지속","호감도 600 이상 + 신뢰도 600 이상",["situation-first-trip","situation-couple-item-shopping"],["관계 수치 결산"]),
  "ennui":endingPlan("연애 지속","갈등 55 이상 또는 관계 스트레스 65 이상",["situation-travel-big-fight","situation-friend-advice-partner-contact-drop","situation-late-night-reconciliation"],["갈등 누적","관계 스트레스"]),
  "new-beginning":endingPlan("기본","다른 엔딩이 선택되지 않았을 때 적용되는 기본 엔딩",[],["DAY 30 최종 결산"])
});

export const ENDING_VIDEO_SPEC = Object.freeze({format:"WebM",resolution:"1920×1080",duration:"8–20초",playback:"1회 재생 · 음성 및 엔딩 BGM 사용 가능",directory:"assets/endings/videos",posterDirectory:"assets/endings/posters"});

export function getEndingVideoPlan(endingId){
  return Object.freeze({status:"planned",assetPath:`${ENDING_VIDEO_SPEC.directory}/${endingId}.webm`,posterPath:`${ENDING_VIDEO_SPEC.posterDirectory}/${endingId}.webp`,...ENDING_VIDEO_SPEC});
}

export function getEndingToolEntries(state){
  const selectedId=selectEnding(state).id;
  return ENDING_DEFINITIONS.map((ending,index)=>{
    let eligible=false;try{eligible=Boolean(ending.matches(state));}catch{eligible=false;}
    const plan=ENDING_TOOL_PLANS[ending.id];
    return {...ending,...plan,priority:index+1,eligible,selected:ending.id===selectedId,video:getEndingVideoPlan(ending.id)};
  });
}

export function validateEndingToolPlans(plans=ENDING_TOOL_PLANS){
  const ids=ENDING_DEFINITIONS.map(ending=>ending.id),videoPaths=ids.map(id=>getEndingVideoPlan(id).assetPath);
  return Object.keys(plans).length===ids.length&&ids.every(id=>{const plan=plans[id];return plan&&typeof plan.category==="string"&&typeof plan.conditionLabel==="string"&&Array.isArray(plan.relatedEventIds)&&Array.isArray(plan.systemEvents);})&&new Set(videoPaths).size===ids.length;
}

export function validateEndingDefinitions(definitions = ENDING_DEFINITIONS) {
  const ids = new Set();
  return definitions.length === 19 && definitions.every(ending => typeof ending.id === "string" && !ids.has(ending.id) && ids.add(ending.id) && typeof ending.title === "string" && typeof ending.description === "string" && typeof ending.matches === "function");
}

export function selectEnding(state, definitions = ENDING_DEFINITIONS) {
  return definitions.find(ending => ending.matches(state)) ?? definitions.at(-1);
}

function countValues(values = []) {
  return values.reduce((counts,value) => ({ ...counts, [value]:(counts[value] ?? 0)+1 }),{});
}

function getDominantChoice(counts) {
  const entries = Object.entries(counts);
  if (!entries.length) return { tag:"없음", count:0 };
  const [tag,count] = entries.sort((left,right) => right[1]-left[1] || left[0].localeCompare(right[0],"ko"))[0];
  return { tag, count };
}

function getRelationshipLabel(score) {
  if (score >= 800) return "서로의 확신";
  if (score >= 650) return "단단해진 사랑";
  if (score >= 450) return "계속 알아가는 사이";
  if (score >= 300) return "흔들리는 관계";
  return "멀어진 두 사람";
}

export function analyzePlayHistory(state) {
  const choiceCounts = countValues(state.choices);
  const dominantChoice = getDominantChoice(choiceCounts);
  const relationshipScore = Math.round((state.affection + state.trust) / 2);
  const assets = getAssetSummary(state);
  const secretChoices = secretChoiceCount(state);
  const highlights = [
    `${dominantChoice.tag} 선택을 ${dominantChoice.count}번 하며 가장 중요하게 여겼습니다.`,
    `${state.partner.name}와의 관계는 ‘${getRelationshipLabel(relationshipScore)}’로 기록됐습니다.`,
    `커리어 Lv.${state.jobLevel}, 총자산 ${Math.round(assets.netWorth).toLocaleString("ko-KR")}원으로 30일을 마쳤습니다.`
  ];
  if (secretChoices > 0) highlights.push(`숨긴 유혹의 선택 ${secretChoices}번이 관계의 위험으로 남았습니다.`);
  else if ((state.temptationHistory ?? []).length > 0) highlights.push("유혹 앞에서 관계를 지키는 선택을 했습니다.");
  else highlights.push(`예상 밖의 사건 ${(state.eventHistory ?? []).length}개를 지나왔습니다.`);
  if (hasFutureTalk(state)) highlights.push(`미래에 대한 선택은 ${state.futureScore >= 8 ? "함께할 준비" : "조금 더 필요한 준비"}로 이어졌습니다.`);
  if (hiddenRouteStarted(state)) highlights.push(`히든 루트에서 경계 ${state.hiddenRoute.boundary}, 변화 ${state.hiddenRoute.change}, 의존 ${state.hiddenRoute.dependency}을 기록했습니다.`);
  return {
    daysPlayed:Math.min(30,Math.max(0,state.day > 30 ? 30 : state.day)),
    totalChoices:state.choices.length,
    choiceCounts,
    dominantChoice,
    relationshipScore,
    relationshipLabel:getRelationshipLabel(relationshipScore),
    netWorth:assets.netWorth,
    careerLevel:state.jobLevel,
    events:(state.eventHistory ?? []).length,
    secretChoices,
    highlights
  };
}
