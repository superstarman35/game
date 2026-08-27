import { YUNA_BACKGROUNDS } from "../yuna-data.mjs";

export const CHARACTER_ASSETS = {
  girlfriend:{
    expressions:{
      calm:"assets/characters/girlfriend-standing-2d.png",
      smile:"assets/characters/girlfriend-standing-smile-2d.png",
      worried:"assets/characters/girlfriend-standing-worried-2d.png",
      tense:"assets/characters/girlfriend-standing-tense-2d.png"
    },
    poses:{
      phone:"assets/characters/girlfriend-phone-calm-2d.png"
    },
    outfits:{
      date:"assets/characters/girlfriend-date-outfit-calm-2d.png"
    },
    accessories:{
      "ribbon-pin":"assets/accessories/lavender-ribbon-star-pin.png"
    }
  }
};

export const NPC_ASSETS = {
  "female-coworker":"assets/npcs/female-coworker-clean.png",
  "office-rookie":"assets/npcs/office-rookie-clean.png",
  "team-lead":"assets/npcs/team-lead.png",
  "office-best-male":"assets/npcs/office-best-male.png",
  "office-rival":"assets/npcs/office-rival.png",
  "office-partner":"assets/npcs/office-partner.png",
  "client-manager":"assets/npcs/client-manager.png",
  "office-party":"assets/npcs/office-party.png",
  "office-gossip":"assets/npcs/office-gossip.png",
  "executive-director":"assets/npcs/executive-director.png",
  "best-friend":"assets/npcs/best-friend.png",
  "cafe-staff":"assets/npcs/cafe-staff.png",
  "edit-shop-staff":"assets/npcs/edit-shop-staff.png",
  "asset-advisor":"assets/npcs/asset-advisor.png",
  "gym-trainer":"assets/npcs/gym-trainer.png",
  "heroine-best-friend":"assets/npcs/heroine-best-friend.png",
  "female-friend":"assets/npcs/female-friend.png",
  "male-friend":"assets/npcs/male-friend.png",
  "college-friend":"assets/npcs/college-friend.png",
  "investor-friend":"assets/npcs/investor-friend.png",
  "drinking-friend":"assets/npcs/drinking-friend.png",
  "love-advisor":"assets/npcs/love-advisor.png",
  "hospital-nurse":"assets/npcs/hospital-nurse.png",
  "male-rival":"assets/npcs/male-rival-clean.png",
  "anonymous-extortionist":"assets/npcs/anonymous-extortionist-2d.png",
  "player-ex":"assets/heroines/yuri/yuri-ex-girlfriend-2d.png?v=2"
};

export const GIFT_VISUAL_ASSETS = Object.freeze({
  "linen-shirt":"assets/items/shop-products/linen-shirt.png",
  "rose-parfum":"assets/items/shop-products/rose-parfum.png",
  "urban-sneakers":"assets/items/shop-products/urban-sneakers.png",
  "classic-watch":"assets/items/shop-products/classic-watch.png",
  "mini-bag":"assets/items/shop-products/mini-bag.png",
  "silver-necklace":"assets/items/shop-products/silver-necklace.png",
  "velvet-lip-kit":"assets/items/shop-products/velvet-lip-kit.png",
  "aurora-phone":"assets/items/shop-products/aurora-phone.png",
  "skyline-studio":"assets/items/shop-products/skyline-studio.png",
  "yuna-star-hairpin":"assets/items/shop-products/yuna-star-hairpin.png",
  "yuna-study-note":"assets/items/shop-products/yuna-study-note.png",
  "yuna-bag-keyring":"assets/items/shop-products/yuna-bag-keyring.png",
  "yuna-snack-box":"assets/items/shop-products/yuna-snack-box.png"
});

export const GIFT_VEHICLE_ASSETS = Object.freeze({
  "solstice-ev":"assets/items/visual-gifts/solstice-ev.png"
});

const FEMALE_NPC_IDS = new Set([
  "female-coworker","office-rookie","client-manager","office-gossip",
  "heroine-best-friend","female-friend","investor-friend","love-advisor",
  "player-ex","ambitious-admirer","cafe-staff","edit-shop-staff",
  "hospital-nurse","asset-advisor"
]);

const MALE_NPC_IDS = new Set([
  "team-lead","office-best-male","office-rival","office-partner","office-party",
  "executive-director","best-friend","male-friend","college-friend","drinking-friend",
  "male-rival","heroine-senior","heroine-ex","gentle-admirer","gym-trainer",
  "real-estate-agent"
]);

const FEMALE_NPC_FALLBACK = "assets/npcs/female-coworker-clean.png";
const MALE_NPC_FALLBACK = "assets/npcs/male-support-clean.png";

export const BACKGROUND_ASSETS = {
  "day1-hospital-ceiling":"assets/backgrounds/hospital/day1-hospital-pov-ceiling-v1.png",
  "day1-hospital-bedside":"assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png",
  "day2-hospital-bedside":"assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png",
  "day2-recovery-corridor":"assets/backgrounds/day2/day2-recovery-corridor-morning-v1.png",
  "day2-hospital-lobby":"assets/backgrounds/day2/day2-hospital-lobby-day-v1.png",
  "day2-hospital-exit":"assets/backgrounds/day2/day2-hospital-exit-day-v1.png",
  "day2-car-interior":"assets/backgrounds/day2/day2-car-interior-day-v1.png",
  "day2-home-exterior":"assets/backgrounds/day2/day2-home-exterior-afternoon-v1.png",
  "day2-home-entry":"assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",
  "day2-bedroom":"assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png",
  "home-morning":"assets/backgrounds/morning-studio-2d.png",
  "home-night":"assets/backgrounds/home/BG_HOME_NIGHT_001.webp",
  "office-day":"assets/backgrounds/office/BG_OFFICE_DAY_001.webp",
  "cafe-rain-evening":"assets/backgrounds/cafe/BG_CAFE_RAIN_EVENING_001.webp",
  "river-night":"assets/backgrounds/street/BG_RIVER_NIGHT_001.webp",
  ...YUNA_BACKGROUNDS
};

export function getCharacterSprite(character = "girlfriend", expression = "calm", pose = "standing", outfit = "default") {
  const assets = CHARACTER_ASSETS[character];
  if (expression === "calm" && pose !== "standing" && assets?.poses?.[pose]) return assets.poses[pose];
  if (expression === "calm" && outfit !== "default" && assets?.outfits?.[outfit]) return assets.outfits[outfit];
  const expressions = assets?.expressions;
  return expressions?.[expression] ?? expressions?.calm ?? "";
}

export function getCharacterAccessory(character = "girlfriend", accessory = "none") {
  return CHARACTER_ASSETS[character]?.accessories?.[accessory] ?? "";
}

export function getNpcSprite(npcId = "") {
  if (NPC_ASSETS[npcId]) return NPC_ASSETS[npcId];
  if (FEMALE_NPC_IDS.has(npcId)) return FEMALE_NPC_FALLBACK;
  if (MALE_NPC_IDS.has(npcId)) return MALE_NPC_FALLBACK;
  return MALE_NPC_FALLBACK;
}

export function getGiftVisualAsset(itemId = "") {
  return GIFT_VISUAL_ASSETS[itemId] ?? "";
}

export function getGiftVehicleAsset(itemId = "") {
  return GIFT_VEHICLE_ASSETS[itemId] ?? "";
}

export function getBackgroundAsset(backgroundId = "home-morning") {
  return BACKGROUND_ASSETS[backgroundId] ?? BACKGROUND_ASSETS["home-morning"];
}
