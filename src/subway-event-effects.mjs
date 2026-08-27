export const SUBWAY_QUESTION_LOCATION_IDS = Object.freeze([
  "dongsu-station",
  "geumsu-station",
  "yeonhui-station",
  "hongdae-station",
  "seongsu-station",
  "jamsil-station",
  "myeongdong-station"
]);

const SUBWAY_QUESTION_LOCATIONS = new Set(SUBWAY_QUESTION_LOCATION_IDS);

export function isSubwayQuestionLocation(locationId) {
  return SUBWAY_QUESTION_LOCATIONS.has(String(locationId ?? ""));
}

export function normalizeSubwayChoiceEffects(locationId, effects = {}) {
  if (!isSubwayQuestionLocation(locationId)) return { ...effects };
  return Object.fromEntries(Object.entries(effects).map(([key, value]) => {
    const amount = Number(value) || 0;
    return [key, amount > 0 ? 1 : amount < 0 ? -1 : 0];
  }));
}

export function normalizeSubwaySituationEffects(event, effects = {}) {
  if (event?.id !== "situation-first-trip") return { ...effects };
  return normalizeSubwayChoiceEffects(event.triggerLocationId, effects);
}
