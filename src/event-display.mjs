export function formatEventProbability(probability) {
  const rawPercent=Math.max(0,Math.min(100,Number(probability)*100));
  const percent=Math.round(rawPercent*10)/10;
  return `${Number.isInteger(percent)?percent.toFixed(0):percent.toFixed(1)}%`;
}

export function getEventProbabilityContext(event) {
  if(event?.trigger==="location-enter")return "장소 방문당 판정";
  if(event?.trigger==="random-before-evening")return "오전·낮 행동 후 판정";
  if(event?.trigger==="coworker-temptation")return "동료 조건 충족 시 행동 후 판정";
  if(event?.trigger==="low-trust")return "낮은 신뢰도 조건에서 행동 후 판정";
  if(event?.trigger==="friend-related")return "친구 조건 충족 시 행동 후 판정";
  return "조건 충족 시 행동 후 판정";
}

export function getEventProbabilitySummary(event) {
  return `발생 확률 ${formatEventProbability(event?.probability??0)} · ${getEventProbabilityContext(event)}`;
}
