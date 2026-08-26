import { getCharacterAccessory, getCharacterSprite, getGiftVisualAsset } from "../assets/asset-manifest.mjs";
import { getEquippedHeroineOutfit } from "../heroine-data.mjs";
import { getYunaExpressionAsset, getYunaOutfitAsset } from "../yuna-data.mjs";
import { getGirlfriendVisualAsset } from "../girlfriend-visual-data.mjs";

const HAEUN_EVENT_VIDEO="assets/characters/girlfriend-standing-2d_transparent.webm?v=5";

export function getHeroineEventVideo(heroineId,characterId,sceneType){
  return heroineId==="haeun"&&characterId==="girlfriend"&&["event","temptation"].includes(sceneType)?HAEUN_EVENT_VIDEO:"";
}

export function resolveCharacterExpression(state) {
  if (state.conflict >= 55 || state.trust < 320) return { tone:"tense", icon:"…", label:"긴장한 눈빛" };
  if (state.stress >= 72) return { tone:"worried", icon:"?", label:"걱정스러운 표정" };
  if (state.affection >= 700) return { tone:"smile", icon:"♡", label:"다정한 미소" };
  return { tone:"calm", icon:"✦", label:"차분한 표정" };
}

export function resolveCharacterPose(state, expression = resolveCharacterExpression(state)) {
  return state.phase === 3 && expression.tone === "calm" ? "phone" : "standing";
}

export function resolveCharacterOutfit(state, expression = resolveCharacterExpression(state)) {
  return state.phase === 2 && expression.tone === "calm" ? "date" : "default";
}

export function resolveCharacterAccessory(state) {
  const visualGift=[...(state.inventory ?? [])].reverse().find(entry=>entry.owner==="girlfriend"&&entry.equipped&&getGiftVisualAsset(entry.itemId));
  if (visualGift) return visualGift.itemId;
  return state.characterAppearance?.accessory === "ribbon-pin" ? "ribbon-pin" : "none";
}

export function renderCharacter(image, state, accessoryImage, overrides = {}) {
  const expression = overrides.expressionId ? { tone:overrides.expressionId, icon:"✦", label:overrides.expressionId } : resolveCharacterExpression(state);
  const pose = overrides.poseId ?? resolveCharacterPose(state,expression);
  const equippedOutfit=getEquippedHeroineOutfit(state);
  const outfit = equippedOutfit?.outfitId ?? overrides.outfitId ?? resolveCharacterOutfit(state,expression);
  const accessory = resolveCharacterAccessory(state);
  const yunaSpecialOutfit=state.partner.heroineId==="yuna"&&!equippedOutfit&&overrides.outfitId&&overrides.outfitId!=="uniform"?getYunaOutfitAsset(overrides.outfitId):null;
  const yunaExpression=state.partner.heroineId==="yuna"&&!equippedOutfit&&!yunaSpecialOutfit&&overrides.expressionId?getYunaExpressionAsset(expression.tone):null;
  const profileImage=state.partner.heroineId!=="haeun"?state.partner.referenceImage:null;
  const baseSource = equippedOutfit?.characterWearingImage ?? yunaSpecialOutfit ?? yunaExpression ?? profileImage ?? getGirlfriendVisualAsset(state.partner.visualId,expression.tone,pose,outfit) ?? state.partner.referenceImage ?? getCharacterSprite("girlfriend",expression.tone,pose,outfit);
  const source = state.partner.heroineId==="haeun" ? `${baseSource}?v=9` : baseSource;
  const accessorySource = getGiftVisualAsset(accessory) || getCharacterAccessory("girlfriend",accessory);
  state.currentExpression = expression.tone;
  state.currentPose = pose;
  state.currentOutfit = outfit;
  state.currentAccessory = accessory;
  if (image && image.getAttribute("src") !== source) image.setAttribute("src",source);
  const equippedInstance=(state.inventory ?? []).find(entry=>entry.owner === "girlfriend" && entry.equipped && entry.itemId === equippedOutfit?.id);
  if (equippedInstance) equippedInstance.lastWorn=state.day;
  if (image) image.dataset.expression = expression.tone;
  if (image) image.dataset.pose = pose;
  if (image) image.dataset.outfit = outfit;
  if (accessoryImage) {
    accessoryImage.hidden = !accessorySource;
    accessoryImage.dataset.accessory = accessory;
    if (accessorySource && accessoryImage.getAttribute("src") !== accessorySource) accessoryImage.setAttribute("src",accessorySource);
  }
  return expression;
}
