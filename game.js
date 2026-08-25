import { advanceTime, applyEffects, clamp, createInitialState, determineEnding } from "./src/game-core.mjs?v=9";
import { SaveManager } from "./src/save-manager.mjs?v=13";
import { createGirlfriendFromProfile, generateGirlfriend, getVisibleTraitRows, observePersonality, rerollGirlfriendPersonality } from "./src/girlfriend-manager.mjs?v=8";
import { getEventDiagnostics, rollEvent } from "./src/event-manager.mjs?v=7";
import { SITUATION_EVENTS } from "./src/situation-events-data.mjs?v=6";
import { resolveSituationEventChoice, rollLocationSituationEvent } from "./src/situation-event-manager.mjs?v=5";
import { EventRuntimeManager } from "./src/event-runtime-manager.mjs?v=4";
import { getMicroEventDiagnostics, rollMicroEvents } from "./src/micro-event-manager.mjs?v=5";
import { auditEventSystems } from "./src/event-audit.mjs?v=4";
import { EVENT_DEFINITIONS } from "./src/events-data.mjs?v=5";
import { ACTIONS as actions, PHASES as phases } from "./src/actions-data.mjs?v=8";
import { getActionAvailability, getWeekdayName, isActionVisible, isWeekend } from "./src/action-manager.mjs?v=5";
import { calculateActionEffects } from "./src/consequence-manager.mjs";
import { getRelationshipState } from "./src/relationship-manager.mjs";
import { addJobProgress, getCareerSummary } from "./src/job-manager.mjs";
import { appendTransaction, BOND_PURCHASE_AMOUNT, BOND_RETURN_RATE, BOND_TERM_DAYS, calculatePaycheck, depositSavings, getAssetSummary, getEconomySummary, getNextPayday, getPaycheckRange, processDayEndEconomy, purchaseBond, recordTransaction, SAVINGS_TRANSFER_AMOUNT, withdrawSavings } from "./src/economy-manager.mjs?v=6";
import { acquireActionItem, addItem, equipGirlfriendOutfit, equipItem, getEffectiveAppearance, getEquipmentBonuses, getPurchaseQuote, purchaseItem } from "./src/inventory-manager.mjs?v=8";
import { getItem, ITEMS } from "./src/items-data.mjs?v=7";
import { giveGift } from "./src/gift-manager.mjs?v=7";
import { applyNpcActionEffects, getNpcRelationshipStatus } from "./src/npc-manager.mjs";
import { getTemptationOpportunity, resolveTemptation, TEMPTATION_CHOICES } from "./src/temptation-manager.mjs";
import { applyRivalPressure, calculateRivalRisk } from "./src/rival-manager.mjs";
import { calculateBreakupRisk, evaluateBreakup } from "./src/conflict-manager.mjs";
import { analyzeConversationInput, buildConversationContext, getContextualOpening, getHostileConversationResponse, getSuggestedConversationReplies, inferConversationQuestion, recordConversationTurn } from "./src/conversation-manager.mjs?v=9";
import { requestGirlfriendReply } from "./src/ai-chat-client.mjs";
import { advanceStockMarket, buyStock, getPortfolioSummary, sellStock } from "./src/investment-manager.mjs?v=2";
import { buyInstantLottery, DAILY_TICKET_LIMIT, getLotterySummary, LOTTERY_TICKET_PRICE } from "./src/lottery-manager.mjs?v=2";
import { analyzePlayHistory } from "./src/ending-manager.mjs";
import { SoundManager } from "./src/sound-manager.mjs?v=6";
import { DAY1_BGM_CUES } from "./src/day1-audio-data.mjs";
import { LOCKED_DAY1_SCENE_ID, applyLockedDay1ChoiceState, getLockedDay1Segment } from "./src/day1-campaign-runtime.mjs";
import { DAY2_BGM_CUES } from "./src/day2-audio-data.mjs";
import { LOCKED_DAY2_SCENE_ID, applyLockedDay2ChoiceState, getLockedDay2LegacyChoice, getLockedDay2ResumePresentation, getLockedDay2Segment } from "./src/day2-campaign-runtime.mjs?v=2";
import { recordMemory } from "./src/memory-manager.mjs";
import { maybeGenerateInitiatedMessage } from "./src/initiated-message-manager.mjs?v=6";
import { getWrappedFocusIndex } from "./src/ui-manager.mjs";
import { renderCharacter, resolveCharacterAccessory, resolveCharacterExpression, resolveCharacterOutfit, resolveCharacterPose } from "./src/ui/character-renderer.mjs?v=10";
import { getBackgroundAsset, getGiftVehicleAsset, getNpcSprite } from "./src/assets/asset-manifest.mjs?v=13";
import { getAvailableStoryChoices, getStoryScene, resolveStoryChoice, selectNextStoryScene } from "./src/story-manager.mjs?v=6";
import { STORY_SCENES } from "./src/story-data.mjs";
import { createDaySnapshot, ensureNightState, formatNightTime, getDailyReport, getLateSleepEffects, resetForNextDay, setNightStartTime, spendNightTime } from "./src/night-manager.mjs?v=2";
import { completeLateNightInvitation, getPendingLateNightInvitation, LATE_NIGHT_INVITATION_CHANCE, LATE_NIGHT_INVITATION_MESSAGE, LATE_NIGHT_INVITATION_MIN_DAY, LATE_NIGHT_INVITATION_START_MINUTES, maybeTriggerLateNightInvitation } from "./src/late-night-invitation-manager.mjs?v=1";
import { preloadSceneAssets, resolvePhasePresentation, resolveStoryPresentation } from "./src/scene-presentation.mjs";
import { createEventSceneSequence, createStoryReactionSequence, createStorySceneSequence, createTemptationReactionSequence, createTemptationSceneSequence } from "./src/story-scene-controller.mjs";
import { runDailyStoryDirector } from "./src/dynamic-story-director.mjs";
import { HAEUN_SPECIAL_EVENT_OUTFIT, HEROINE_OUTFITS, HEROINE_PROFILES, getEquippedHeroineOutfit, isOutfitUnlocked } from "./src/heroine-data.mjs?v=17";
import { NPC_SOCIAL_GRAPH } from "./src/npcs-data.mjs";
import { GIRLFRIEND_JOBS } from "./src/girlfriend-jobs-data.mjs";
import { generateJob, JOBS } from "./src/jobs-data.mjs?v=6";
import { getGirlfriendVisual } from "./src/girlfriend-visual-data.mjs";
import { createPlayerProfile, PLAYER_ARCHETYPES, sanitizePlayerNameInput } from "./src/player-profile-data.mjs?v=2";
import { getRandomPlayerName } from "./src/player-names-data.mjs?v=1";
import { GAME_MODES, getGameModeConfig } from "./src/scenario-state.mjs?v=2";
import { getActionResultAsset, getHighTrustActionResultAsset, getVisibleActionEffects } from "./src/action-result-assets.mjs?v=11";
import { getActionResultVideo } from "./src/action-result-videos.mjs?v=2";
import { discoverLocation, getNearbyLocation, getPlayerHomeProfile, getRoadCells, isWorldLocationOpen, moveWorldPlayer, selectWorldTransport, TRANSPORT_OPTIONS, travelToCity, WORLD_ATLAS, WORLD_MAPS } from "./src/world-map-manager.mjs?v=2";
import { getMapLocationAsset } from "./src/map-location-assets.mjs";

const $ = (selector) => document.querySelector(selector);
const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[character]));
const touchDevice = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
document.documentElement.classList.toggle("touch-device",touchDevice);

let state;
let onboarding = null;
let titleTransitioning = false;
const INTRO_VIDEO_PLAYLIST = ["assets/video/intro.mp4", "assets/video/intro2.mp4"];
let introVideoIndex = 0;
const sound = new SoundManager();
let modalReturnFocus = null;
let actionResultReturnFocus = null;
let actionResultContinuation = null;
let activeConversation = null;
let dialogueTimer = null;
let dialogueText = "";
let dialogueIndex = 0;
const dialogueHistory = [];
const dialogueSpeeds = [{label:"느림",delay:42},{label:"보통",delay:24},{label:"빠름",delay:10}];
let dialogueSpeedIndex = Number(localStorage.getItem("today-day-one-dialogue-speed") ?? 1);
if (!dialogueSpeeds[dialogueSpeedIndex]) dialogueSpeedIndex = 1;
let lastSceneSoundKey = "";
let autoMode = false;
let autoAdvanceTimer = null;
let immersiveScene = null;
let sceneAdvanceTimer = null;
let gameToolsTab = "outfits";
let selectedToolsNpcId = null;
const eventRuntime = new EventRuntimeManager({timeoutMs:5000,onWarning:warning=>{if(state){state.logs.push({time:`DAY ${state.day} · WATCHDOG`,text:`${warning.eventId} · ${warning.state} ${warning.elapsed}ms`});persistEventRuntime(true);}},onRecover:()=>{const layer=$("#sceneTransition");if(layer){layer.classList.remove("active");layer.classList.add("hidden");}if(immersiveScene)renderImmersiveStep();}});
const runtimeWatchdogTimer=setInterval(()=>eventRuntime.watchdog(),1000);
const modalFocusableSelector = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
const THEATER_SETTING_KEY="today-day-one-theater-mode";
const GAMEPLAY_EVENTS_START_DAY = 4;

function areGameplayEventsUnlocked(day=state?.day) { return Number(day) >= GAMEPLAY_EVENTS_START_DAY; }
function isCampaignPrologueStory(id) { return state?.scenario?.enabled===true && String(id??"").startsWith("m30-day"); }

function persistEventRuntime(save=false){if(!state)return;state.eventRuntime=eventRuntime.snapshot();if(save)SaveManager.save(state);}
function renderFullscreenButtons(){const active=Boolean(document.fullscreenElement)||document.body.classList.contains("theater-mode");for(const button of [$("#fullscreenButton"),$("#storyFullscreenButton")])if(button){button.setAttribute("aria-pressed",String(active));button.textContent=button.id==="storyFullscreenButton"?(active?"WINDOW":"FULLSCREEN"):(active?"▣ 창모드":"⛶ 전체화면");}}
function setTheaterMode(enabled){document.body.classList.toggle("theater-mode",enabled);if(state){state.settings??={};state.settings.theaterMode=enabled;localStorage.setItem(THEATER_SETTING_KEY,String(enabled));SaveManager.save(state);}renderFullscreenButtons();}
async function toggleFullscreen(event){event?.stopPropagation();if(document.fullscreenElement){await document.exitFullscreen();setTheaterMode(false);return;}if(document.body.classList.contains("theater-mode")){setTheaterMode(false);return;}try{if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else setTheaterMode(true);}catch{setTheaterMode(true);}renderFullscreenButtons();}
function requestInitialFullscreen(){
  if(document.fullscreenElement||!document.documentElement.requestFullscreen)return;
  document.documentElement.requestFullscreen().catch(()=>{});
}

function openModal() {
  if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
  const modal = $("#modal");
  if (modal.classList.contains("hidden")) modalReturnFocus = document.activeElement;
  modal.classList.remove("hidden");
  requestAnimationFrame(() => $("#closeModal").focus());
}

function closeModal() {
  closeRelationshipPortrait();
  const modal = $("#modal");
  if (modal.classList.contains("hidden")) return;
  modal.classList.add("hidden");
  modal.classList.remove("phone-menu-active");
  modal.classList.remove("world-event-active");
  modal.classList.remove("transport-modal-active");
  modal.classList.remove("today-record-active");
  modal.classList.remove("relationship-directory-active");
  modal.classList.remove("item-detail-active");
  if (modalReturnFocus?.isConnected) modalReturnFocus.focus();
  modalReturnFocus = null;
  if (state && !state.ended && !state.breakup) { if(state.phase===3){if(state.world?.mode==="district")renderWorldMap();else renderNightHome();}else sound.playScene(phases[state.phase].key,state.day); }
}

function formatActionEffectValue(effect) {
  const sign = effect.value > 0 ? "+" : "";
  return effect.key === "money" ? `${sign}${money(effect.value)}` : `${sign}${effect.value}`;
}

function animateActionResultEffects(rows) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("#actionResultEffects [data-effect-index]").forEach((badge,index) => {
    const effect = rows[index];
    const value = badge.querySelector("em");
    if (!effect || !value) return;
    const finish = () => { value.textContent = formatActionEffectValue(effect); badge.classList.add("effect-settled"); };
    if (reducedMotion) { finish(); return; }
    const delay = index * 110;
    const duration = 720;
    setTimeout(() => {
      if (!badge.isConnected) return;
      badge.classList.add("effect-animating");
      const startedAt = performance.now();
      const count = now => {
        if (!badge.isConnected) return;
        const progress = Math.min(1,(now-startedAt)/duration);
        const eased = 1-Math.pow(1-progress,3);
        const current = Math.round(effect.value*eased);
        value.textContent = formatActionEffectValue({...effect,value:current});
        if (progress < 1) requestAnimationFrame(count); else finish();
      };
      requestAnimationFrame(count);
    },delay);
  });
}

function isGirlfriendAction(action) {
  const effects=action?.effects??{};
  return Number(effects.affection)>0||Number(effects.trust)>0||["데이트","추억","직업지원","돌봄"].includes(action?.tag)||Array.isArray(action?.heroineIds)||Array.isArray(action?.careerIds);
}

function rememberActionMedia(action,imageAsset,videoAsset) {
  if (!isGirlfriendAction(action)) return false;
  state.cgCollection??=[];
  state.videoCollection??=[];
  let changed=false;
  if(imageAsset&&!state.cgCollection.some(entry=>entry.id===`action-${action.id}`)){
    state.cgCollection.push({id:`action-${action.id}`,title:action.title,image:imageAsset,day:state.day,type:"action"});
    changed=true;
  }
  if(videoAsset&&!state.videoCollection.some(entry=>entry.video===videoAsset)){
    state.videoCollection.push({id:`video-${action.id}-${state.videoCollection.length+1}`,actionId:action.id,title:action.title,video:videoAsset,poster:imageAsset??null,day:state.day});
    changed=true;
  }
  return changed;
}

function openActionResultModal(action, message, effects, continuation) {
  const modal = $("#actionResultModal");
  const image = $("#actionResultImage");
  const video = $("#actionResultVideo");
  const pending = $("#actionResultPending");
  state.seenOneTimeActionResults ??= [];
  state.seenActionResultVideos ??= [];
  const highTrustAsset = getHighTrustActionResultAsset(action.id,state,state.seenOneTimeActionResults);
  const asset = highTrustAsset ?? getActionResultAsset(action.id);
  const videoAsset = highTrustAsset ? null : getActionResultVideo(action.id,state,state.seenActionResultVideos);
  const albumChanged=rememberActionMedia(action,asset,videoAsset);
  if (highTrustAsset) {
    state.seenOneTimeActionResults.push(action.id);
    SaveManager.save(state);
  }
  if (videoAsset) {
    state.seenActionResultVideos.push(videoAsset);
    SaveManager.save(state);
  }
  if(albumChanged&&!highTrustAsset&&!videoAsset)SaveManager.save(state);
  actionResultReturnFocus = document.activeElement;
  actionResultContinuation = continuation;
  $("#actionResultTitle").textContent = action.title;
  $("#actionResultText").textContent = message;
  video.pause();
  video.hidden = true;
  video.removeAttribute("src");
  if (videoAsset) {
    image.removeAttribute("src");
    image.alt = "";
    image.hidden = true;
    video.src = videoAsset;
    video.setAttribute("aria-label", `${action.title} 행동 결과 영상`);
    video.hidden = false;
    pending.hidden = true;
    video.play().catch(() => {});
  } else if (asset) {
    image.src = asset;
    image.alt = `${action.title} 활동 결과 장면`;
    image.hidden = false;
    pending.hidden = true;
  } else {
    image.removeAttribute("src");
    image.alt = "";
    image.hidden = true;
    pending.hidden = false;
  }
  const rows = getVisibleActionEffects(effects);
  $("#actionResultEffects").innerHTML = rows.length
    ? rows.map((effect,index) => `<span class="${effect.value > 0 ? "up" : "down"}" data-effect-index="${index}"><b>${escapeHtml(effect.label)}</b><em>0</em></span>`).join("")
    : '<span class="neutral"><b>변화</b><em>기록 완료</em></span>';
  modal.classList.remove("hidden");
  animateActionResultEffects(rows);
  requestAnimationFrame(() => $("#actionResultConfirm").focus());
}

function confirmActionResult() {
  const modal = $("#actionResultModal");
  if (modal.classList.contains("hidden")) return;
  const video = $("#actionResultVideo");
  video.pause();
  video.currentTime = 0;
  video.hidden = true;
  video.removeAttribute("src");
  modal.classList.add("hidden");
  const continuation = actionResultContinuation;
  actionResultContinuation = null;
  if (actionResultReturnFocus?.isConnected) actionResultReturnFocus.focus();
  actionResultReturnFocus = null;
  continuation?.();
}

function handleModalKeydown(event) {
  const albumVideoLayer=document.querySelector(".album-video-layer");
  if(albumVideoLayer&&event.key==="Escape"){
    event.preventDefault();closeAlbumVideoLayer();return;
  }
  const modal = $("#modal");
  if (modal.classList.contains("hidden")) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = [...modal.querySelectorAll(modalFocusableSelector)].filter(element => !element.closest(".hidden"));
  if (!focusable.length) return;
  const currentIndex = focusable.indexOf(document.activeElement);
  const shouldWrap = currentIndex < 0 || (event.shiftKey && currentIndex === 0) || (!event.shiftKey && currentIndex === focusable.length - 1);
  if (!shouldWrap) return;
  event.preventDefault();
  focusable[getWrappedFocusIndex(currentIndex, focusable.length, event.shiftKey)].focus();
}

function renderSoundButton(){ const button=$("#soundButton");const label=sound.enabled?"사운드 끄기":"사운드 켜기";button.innerHTML=`<i class="fa-solid ${sound.enabled?"fa-volume-high":"fa-volume-xmark"}" aria-hidden="true"></i>`;button.setAttribute("aria-pressed",String(sound.enabled));button.setAttribute("aria-label",label);button.title=label; }

function finishDialogueTyping() {
  if (!dialogueTimer) return false;
  clearInterval(dialogueTimer);
  dialogueTimer = null;
  dialogueIndex = dialogueText.length;
  $("#sceneText").textContent = dialogueText;
  $("#visualNovelStage").classList.remove("is-typing");
  return true;
}

function resolveDialogueVariables(text) {
  const playerName=state?.player?.name?.trim()||"플레이어";
  return String(text??"").replaceAll("[플레이어 이름]",playerName);
}

function typeDialogue(text) {
  text=resolveDialogueVariables(text);
  if (text === dialogueText && $("#sceneText").textContent) return;
  finishDialogueTyping();
  dialogueText = text;
  dialogueIndex = 0;
  dialogueHistory.push({ day: state.day, phase: phases[state.phase].label, title: $("#sceneTitle").textContent, text });
  if (dialogueHistory.length > 40) dialogueHistory.shift();
  const sceneText = $("#sceneText");
  const stage = $("#visualNovelStage");
  sceneText.textContent = "";
  stage.classList.add("is-typing");
  dialogueTimer = setInterval(() => {
    dialogueIndex = Math.min(dialogueIndex + 1, dialogueText.length);
    sceneText.textContent = dialogueText.slice(0, dialogueIndex);
    if (dialogueIndex >= dialogueText.length) finishDialogueTyping();
  }, dialogueSpeeds[dialogueSpeedIndex].delay);
}

function handleDialogueAdvance() {
  if(eventRuntime.input.snapshot().locked)return;
  if (finishDialogueTyping()) { sound.play("select"); return; }
  if (immersiveScene) advanceImmersiveScene();
}

function renderAutoButton() {
  const button = $("#autoButton");
  button.textContent = autoMode ? "AUTO ON" : "AUTO OFF";
  button.setAttribute("aria-pressed",String(autoMode));
}

function scheduleAutoAdvance() {
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
  if (immersiveScene) {
    if (sceneAdvanceTimer) clearTimeout(sceneAdvanceTimer);
    sceneAdvanceTimer = autoMode && immersiveScene.currentStep?.type !== "choice" ? setTimeout(()=>{sceneAdvanceTimer=null;if(finishDialogueTyping()){scheduleAutoAdvance();return;}handleDialogueAdvance();},1600) : null;
    return;
  }
  autoAdvanceTimer = autoMode && state?.selected !== null ? setTimeout(()=>{autoAdvanceTimer=null;applyAction();},1200) : null;
}

function toggleAutoMode(event) {
  event.stopPropagation();
  autoMode = !autoMode;
  renderAutoButton();
  scheduleAutoAdvance();
  toast(autoMode ? "선택 후 자동으로 진행합니다." : "자동 진행을 껐어요.");
}

function openDialogueHistory() {
  const rows = dialogueHistory.length ? dialogueHistory.slice().reverse().map(entry=>`<article class="history-entry"><small>DAY ${entry.day} · ${escapeHtml(entry.phase)}</small><b>${escapeHtml(entry.title)}</b><p>${escapeHtml(entry.text)}</p></article>`).join("") : `<p>아직 기록된 대화가 없어요.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">BACKLOG</span><h2>대화 기록</h2><div class="dialogue-history">${rows}</div>`;
  openModal();
}

function openGameMenu() {
  const isNight = state.phase === 3;
  if (isNight) checkLateNightInvitation();
  if (isNight) { ensureNightState(state).phoneChecked = true; SaveManager.save(state); }
  const apps = isNight ? [
    ["message","💬","메시지",`${withParticle(state.partner.name,"과","와")} 대화`,"rose"],["call","📞","전화","통화하기","violet"],["shop","🛍","쇼핑","온라인 상점","green"],
    ["investment","📈","투자","주식·채권","blue"],["sns","📷","SNS","오늘의 피드","orange"],["people","👥","연락처","인맥 확인","mint"],
    ["schedule","📅","일정","30일 캘린더","pink"],["finance","💳","금융","자산·거래","indigo"],["todaylog","📝","오늘 기록","DAY 로그","gray"],
    ["gallery","🖼","포토 앨범","사진 · 동영상 추억","violet"]
  ] : [
    ["save","↓","저장","현재 장면 보관","rose"],["load","↻","불러오기","저장 장면 복귀","violet"],["gallery","🖼","포토 앨범","사진 · 동영상 추억","pink"],
    ["speed","⏩","대사 속도",dialogueSpeeds[dialogueSpeedIndex].label,"indigo"],["debug","⚙","설정","접근성·진단","gray"]
  ];
  const dock = isNight ? [["report","☾","하루 정산"],["save","↓","저장하기"]] : [["history","≡","대화 기록"],["save","↓","저장하기"]];
  const battery = Math.max(1,Math.round((state.energy+state.health)/2));
  const appMarkup = apps.map(([id,icon,label,detail,tone])=>`<button class="phone-app" type="button" data-menu-action="${id}"><span class="phone-app-icon" data-tone="${tone}" aria-hidden="true">${icon}</span><b>${label}</b><small>${escapeHtml(detail)}</small></button>`).join("");
  const dockMarkup = dock.map(([id,icon,label])=>`<button type="button" data-menu-action="${id}"><span aria-hidden="true">${icon}</span><b>${label}</b></button>`).join("");
  $("#modal").classList.add("phone-menu-active");
  $("#modalContent").innerHTML=`<article class="phone-menu ${isNight?"":"story-system-menu"}" aria-label="${isNight?"야간 스마트폰":"스토리 시스템 메뉴"}"><div class="phone-status"><b>${isNight?formatNightTime(state.nightState.minutes):phases[state.phase].time}</b><span>DAY ${state.day} · ${getWeekdayName(state.day)} · ${battery}% ▰</span></div><div class="phone-island" aria-hidden="true"></div><header class="phone-menu-hero"><small>${isNight?"NIGHT TIME · 나의 방":"STORY MODE · SYSTEM"}</small><strong>${isNight?`${state.partner.name}에게 알림이 왔어요`:"이야기를 잠시 멈췄어요"}</strong><span>${isNight?money(state.money):"저장 · 기록 · 설정만 확인할 수 있어요"}</span></header><div class="phone-app-grid">${appMarkup}</div><div class="phone-dock">${dockMarkup}</div><div class="phone-home-indicator" aria-hidden="true"></div></article>`;
  openModal();
  const nightApp = (minutes,label,callback) => () => { const result=spendNightTime(state,minutes,label); if(!result.ok){toast(result.reason);openGameMenu();return;} callback(); SaveManager.save(state); };
  const actions = { inventory:openInventory, shop:isNight?nightApp(20,"온라인 쇼핑",openShop):openShop, finance:openFinance, career:openCareer, people:openPeople, investment:isNight?nightApp(20,"투자 확인",openInvestment):openInvestment, history:openDialogueHistory, gallery:openCgGallery, message:nightApp(10,"메시지",()=>{state.nightState.messagesRead=true;openChat("message");}), call:nightApp(30,"전화",()=>openChat("call")), sns:nightApp(20,"SNS",openSns), schedule:openSchedule, todaylog:openTodayLog, report:openDailyReport, speed:()=>{dialogueSpeedIndex=(dialogueSpeedIndex+1)%dialogueSpeeds.length;localStorage.setItem("today-day-one-dialogue-speed",String(dialogueSpeedIndex));toast(`대화 속도 · ${dialogueSpeeds[dialogueSpeedIndex].label}`);openGameMenu();}, save:()=>{saveGame();closeModal();}, load:()=>{closeModal();loadGame();}, debug:openDebug };
  document.querySelectorAll("[data-menu-action]").forEach(button=>button.addEventListener("click",()=>{$("#modal").classList.remove("phone-menu-active");actions[button.dataset.menuAction]?.();}));
}

function openStoryScene(scene) {
  if (!scene) return;
  const lockedDay1=scene.id===LOCKED_DAY1_SCENE_ID;
  const lockedDay2=scene.id===LOCKED_DAY2_SCENE_ID;
  const presentation=resolveStoryPresentation(scene,state);
  if(!(lockedDay1&&state.storyFlags?.day1QuestionStrategy))state.pendingStoryId = scene.id;
  if(presentation.eventCgId&&!state.cgCollection.some(entry=>entry.id===presentation.eventCgId))state.cgCollection.push({id:presentation.eventCgId,title:scene.title,image:presentation.backgroundUrl,day:state.day});
  SaveManager.save(state);
  if(!lockedDay1&&!lockedDay2)sound.playBgm(scene.bgm ?? "theme",state.day);
  const lockedSegment=state.storyFlags?.day1QuestionStrategy?2:state.storyFlags?.day1ContactStrategy?1:0;
  const day2Resume=lockedDay2?getLockedDay2ResumePresentation(state):null;
  const lockedPresentation=lockedDay1?{...presentation,backgroundId:"day1-hospital-ceiling",backgroundUrl:getBackgroundAsset("day1-hospital-ceiling"),expressionId:"resting-tired",poseId:"seated-dozing"}:lockedDay2?{...presentation,...day2Resume,backgroundUrl:getBackgroundAsset(day2Resume.backgroundId),expressionId:"calm-attentive",poseId:"standing"}:presentation;
  startImmersiveScene({id:scene.id,type:"story",presentation:lockedPresentation,sequence:lockedDay1?getLockedDay1Segment(state,lockedSegment):lockedDay2?getLockedDay2Segment(state):createStorySceneSequence(scene,presentation,getAvailableStoryChoices(state,scene)),onChoice:choiceId=>{
    if(lockedDay1){const stage=applyLockedDay1ChoiceState(state,choiceId);if(!stage)return null;if(stage.stage==="contact"){SaveManager.save(state);return getLockedDay1Segment(state,1);}const result=resolveStoryChoice(state,scene.id,stage.legacyChoiceId);if(!result)return null;SaveManager.save(state);return getLockedDay1Segment(state,2);}
    if(lockedDay2){const result=applyLockedDay2ChoiceState(state,choiceId);if(!result)return null;SaveManager.save(state);return getLockedDay2Segment(state,result.stage);}
    const result=resolveStoryChoice(state,scene.id,choiceId);
    if(!result)return null;
    state.logs.push({time:`DAY ${state.day} · STORY`,text:`${scene.title} — ${result.choice.label}`});
    SaveManager.save(state);sound.play("confirm");
    return createStoryReactionSequence(result);
  }});
}

function startImmersiveScene(session) {
  if (!session?.sequence?.length) return;
  if (["story","event","temptation"].includes(session.type) && !session.debugPreview && !areGameplayEventsUnlocked() && !(session.type==="story"&&isCampaignPrologueStory(session.id))) return;
  const runtimeStart=eventRuntime.start({...session,sceneId:session.sequence.find(step=>step.backgroundId)?.label??session.id,triggerReason:session.triggerReason??[]});
  if(!runtimeStart.started){persistEventRuntime(true);return;}
  if (sceneAdvanceTimer) clearTimeout(sceneAdvanceTimer);
  immersiveScene={...session,index:0,currentStep:null,activeCharacterAssetUrl:session.presentation?.characterAssetUrl??null};
  if(session.id===LOCKED_DAY2_SCENE_ID){
    const resumeVisual=getLockedDay2ResumePresentation(state);
    immersiveScene.presentation={...immersiveScene.presentation,...resumeVisual,backgroundUrl:getBackgroundAsset(resumeVisual.backgroundId)};
    immersiveScene.activeCharacterAssetUrl=resumeVisual.characterAssetUrl;
  }
  document.body.classList.remove("ui-classic-mode");
  document.body.classList.add("ui-story-mode");
  $(".story-toolbar").classList.remove("hidden");
  $("#gameScreen").classList.remove("classic-mode");
  $("#gameScreen").classList.add("story-mode");
  $("#visualNovelStage").classList.toggle("location-event-scene",Boolean(session.locationEvent));
  $("#skipButton").classList.remove("hidden");
  $("#storyChoiceLayer").classList.add("hidden");
  $("#vnNpcRear").hidden=true;
  $("#vnNpcFront").hidden=true;
  $("#vnEventCg").hidden=true;
  $("#actionGrid").classList.add("hidden");
  $("#nextButton").classList.add("hidden");
  applyScenePresentation(immersiveScene.presentation);
  preloadImmersiveAssets(session.sequence);
  eventRuntime.markAssets(immersiveScene.presentation?.backgroundUrl?"READY":"FALLBACK");eventRuntime.transition("TRANSITIONING");persistEventRuntime(true);
  updateImmersiveCharacter(immersiveScene.presentation.expressionId);
  if(session.id===LOCKED_DAY1_SCENE_ID){$("#vnCharacter").hidden=true;delete $("#vnCharacter").dataset.day1Pose;}
  renderImmersiveStep();
}

function preloadImmersiveAssets(sequence=[]) {
  if(typeof Image==="undefined")return [];
  const urls=[...new Set(sequence.flatMap(step=>[step?.assetUrl,step?.source,step?.backgroundId?getBackgroundAsset(step.backgroundId):""]).filter(Boolean))];
  urls.forEach(source=>{const image=new Image();image.decoding="async";image.src=source;});
  return urls;
}

function applyCharacterStage(element,stage={},characterId="") {
  if(!element)return;
  element.dataset.characterId=characterId;
  element.dataset.position=stage.positionPreset??(characterId==="doctor"?"center":characterId==="nurse"?"left":"right");
  element.dataset.depth=stage.depth??(characterId==="nurse"?"background":"normal");
}

function updateDay1Focus(focusCharacterId="pov",effect="") {
  const stage=$("#visualNovelStage");
  if(!stage)return;
  stage.dataset.focusCharacter=focusCharacterId;
  stage.dataset.sceneEffect=effect;
  for(const element of [$("#vnCharacter"),$("#vnNpcFront"),$("#vnNpcRear")]){
    if(!element)continue;
    const active=element.dataset.characterId===focusCharacterId;
    element.dataset.focus=active?"active":"sub";
  }
}

function updateImmersiveCharacter(expressionId="calm") {
  const character=$("#vnCharacter");
  const characterId=immersiveScene?.presentation?.characterId??"girlfriend";
  if(immersiveScene?.id===LOCKED_DAY1_SCENE_ID){const allowed=new Set(["resting-tired","startled-relief","teary-relief","apologetic-worried","calm-attentive","warm-playful","soft-vulnerable","gentle-resolve"]);const id=allowed.has(expressionId)?expressionId:"calm-attentive";if(!character.dataset.day1Pose){character.src=`assets/characters/day1/haeun/expressions/haeun-expression-${id}-2d.png`;}character.dataset.expression=id;applyCharacterStage(character,{},"haeun");$("#vnAccessoryLayer").hidden=true;syncOutfitCharacterMedia(true);return;}
  if(immersiveScene?.id===LOCKED_DAY2_SCENE_ID&&immersiveScene.activeCharacterAssetUrl){character.src=immersiveScene.activeCharacterAssetUrl;character.hidden=false;character.dataset.expression=expressionId;applyCharacterStage(character,{},"haeun");$("#vnAccessoryLayer").hidden=true;syncOutfitCharacterMedia(true);return;}
  updateGiftVehicleLayer(characterId);
  const npcSprite=characterId!=="girlfriend"?getNpcSprite(characterId):"";
  const yuriEventVideo=characterId==="player-ex"&&["event","temptation"].includes(immersiveScene?.type)?"assets/heroines/yuri/yuri-ex-girlfriend-2d_transparent.webm?v=1":"";
  if(npcSprite){character.src=npcSprite;character.dataset.expression=expressionId;$("#vnAccessoryLayer").hidden=true;syncOutfitCharacterMedia(!yuriEventVideo,yuriEventVideo);return;}
  if(characterId==="girlfriend"&&immersiveScene?.previewOutfitImage){character.src=immersiveScene.previewOutfitImage;character.dataset.expression=expressionId;$("#vnAccessoryLayer").hidden=true;syncOutfitCharacterMedia(true);return;}
  state.currentExpression=expressionId;
  const poseId=immersiveScene?.presentation?.poseId,outfitId=immersiveScene?.presentation?.outfitId;
  $("#vnAccessoryLayer").hidden=true;
  renderCharacter(character,state,null,{expressionId,poseId,outfitId});
  updatePartnerPortrait(expressionId,poseId,outfitId);
  const girlfriendEventVideo=characterId==="girlfriend"&&["event","temptation"].includes(immersiveScene?.type)?"assets/characters/girlfriend-standing-2d_transparent.webm?v=5":"";
  syncOutfitCharacterMedia(false,girlfriendEventVideo);
}

function syncOutfitCharacterMedia(forceImage=false,forcedVideo="") {
  const image=$("#vnCharacter"),video=$("#vnCharacterVideo"),outfit=state?getEquippedHeroineOutfit(state):null;
  const showVideo=Boolean(!forceImage&&(forcedVideo||outfit?.characterWearingVideo));
  if(!video||!image)return;
  const showFallback=()=>{video.hidden=true;image.hidden=false;};
  if(!showVideo){video.pause();showFallback();delete video.dataset.outfitSource;video.removeAttribute("src");video.removeAttribute("poster");video.load();return;}
  const source=forcedVideo||outfit.characterWearingVideo;
  const revealVideo=()=>{
    if(video.dataset.outfitSource!==source||video.readyState<2)return;
    video.hidden=false;image.hidden=true;
    video.play().catch(showFallback);
  };
  video.onerror=showFallback;
  video.onloadeddata=revealVideo;
  video.oncanplay=revealVideo;
  video.poster=image.currentSrc||image.src;
  if(video.dataset.outfitSource!==source){
    video.pause();showFallback();video.dataset.outfitSource=source;video.src=source;video.load();return;
  }
  if(video.readyState>=2){revealVideo();return;}
  showFallback();
}

function updateGiftVehicleLayer(characterId="girlfriend") {
  const layer=$("#vnGiftVehicleLayer");
  if(!layer||!state)return;
  const giftedVehicle=[...(state.inventory??[])].reverse().find(entry=>entry.owner==="girlfriend"&&getGiftVehicleAsset(entry.itemId));
  const asset=giftedVehicle?getGiftVehicleAsset(giftedVehicle.itemId):"";
  const show=Boolean(asset&&state.phase===2&&characterId==="girlfriend");
  layer.hidden=!show;
  layer.dataset.item=giftedVehicle?.itemId??"";
  if(show&&layer.getAttribute("src")!==asset)layer.src=asset;
}

function renderImmersiveStep() {
  if (!immersiveScene) return;
  const step=immersiveScene.sequence[immersiveScene.index++];
  immersiveScene.currentStep=step;
  eventRuntime.setProgress({sequenceIndex:Math.max(0,immersiveScene.index-1),sceneId:step?.label??eventRuntime.active?.sceneId,dialogueIndex:Math.max(0,immersiveScene.index-1),backgroundId:step?.backgroundId??immersiveScene.presentation?.backgroundId,bgmId:step?.bgmId??null});persistEventRuntime(step?.type==="transition"||step?.type==="choice");
  $("#storyChoiceLayer").classList.add("hidden");
  $("#storyChoiceLayer").innerHTML="";
  if (!step || step.type === "sceneEnd") { finishImmersiveScene(); return; }
  if(step.bgmCue){const cue=DAY1_BGM_CUES[step.bgmCue]??DAY2_BGM_CUES[step.bgmCue];if(cue?.action==="stop"||cue?.action==="silence")sound.stopBgm();else if(cue)sound.playBgm(cue.category,cue.variant,{volume:cue.volume});}
  if(step.backgroundId){
    immersiveScene.presentation={...immersiveScene.presentation,backgroundId:step.backgroundId,backgroundUrl:getBackgroundAsset(step.backgroundId),characterId:step.characterId??immersiveScene.presentation.characterId,expressionId:step.expressionId??immersiveScene.presentation.expressionId,poseId:step.poseId??immersiveScene.presentation.poseId,outfitId:step.outfitId??immersiveScene.presentation.outfitId,weather:step.weather??immersiveScene.presentation.weather,timeOfDay:step.timeOfDay??immersiveScene.presentation.timeOfDay};
    applyScenePresentation(immersiveScene.presentation);
    if(step.bgmId)sound.playBgm(step.bgmId,state.day);
  }
  if (step.type === "transition") { if(eventRuntime.state!=="TRANSITIONING")eventRuntime.transition("TRANSITIONING",{sceneId:step.label});eventRuntime.input.lock(immersiveScene.id,"StoryTransition");showSceneTransition(step); return; }
  // Some debug/TIP events begin directly with narration instead of a visual
  // transition. Move the runtime into PLAYING before asking it to wait for
  // dialogue or a choice, otherwise TRANSITIONING -> WAITING_* is rejected
  // and every subsequent choice click is ignored while the runtime is ERROR.
  if(eventRuntime.state==="TRANSITIONING")eventRuntime.transition("PLAYING",{sceneId:step.label??immersiveScene.id});
  if (step.type === "characterEnter") { if(step.assetUrl){immersiveScene.activeCharacterAssetUrl=step.assetUrl;$("#vnCharacter").src=step.assetUrl;$("#vnCharacter").hidden=false;$("#vnCharacter").dataset.day1Pose=step.assetUrl;$("#vnCharacter").dataset.expression=step.expressionId??"calm-attentive";applyCharacterStage($("#vnCharacter"),step.stage,step.characterId??"haeun");syncOutfitCharacterMedia(true);}else updateImmersiveCharacter(step.expressionId??immersiveScene.presentation.expressionId);$("#vnCharacter").classList.add("scene-character-enter"); $("#vnCharacter").dataset.animation=step.animationId??"idle-breathe"; queueSceneStep(420); return; }
  if(step.type==="sfx"){if(step.stopCueId)sound.stopCue(step.stopCueId);else if(step.sfxId)sound.playCue(step.sfxId);queueSceneStep(40);return;}
  if(step.type==="animation"){queueSceneStep(40);return;}
  if(step.type==="itemShow"){const layer=step.layer==="npcRear"?$("#vnNpcRear"):$("#vnNpcFront");layer.hidden=!step.source;if(step.source)layer.src=step.source;applyCharacterStage(layer,step.stage,step.characterId??(step.layer==="npcRear"?"nurse":"doctor"));queueSceneStep(120);return;}
  if(step.type==="cgShow"){
    const layer=$("#vnEventCg");
    const owner=immersiveScene.id;
    layer.src=step.source;layer.hidden=false;
    eventRuntime.input.lock(owner,"StoryCg");
    if(sceneAdvanceTimer)clearTimeout(sceneAdvanceTimer);
    sceneAdvanceTimer=setTimeout(()=>{layer.hidden=true;sceneAdvanceTimer=null;eventRuntime.input.unlock(owner);if(immersiveScene?.id===owner)renderImmersiveStep();},step.duration??1800);
    return;
  }
  if (step.type === "expressionChange") { updateImmersiveCharacter(step.expressionId); queueSceneStep(220); return; }
  if (step.type === "choice") { if(eventRuntime.state!=="WAITING_CHOICE")eventRuntime.transition("WAITING_CHOICE");eventRuntime.input.unlock(immersiveScene.id);persistEventRuntime(true);renderImmersiveChoices(step.options); return; }
  if (step.expressionId&&immersiveScene?.id!==LOCKED_DAY1_SCENE_ID) updateImmersiveCharacter(step.expressionId);
  if(immersiveScene?.id===LOCKED_DAY1_SCENE_ID)updateDay1Focus(step.focusCharacterId??(step.type==="narration"?"pov":"haeun"),step.effect??"");
  $("#sceneTitle").textContent=step.type === "narration" ? "" : step.speaker;
  $("#sceneTitle").classList.toggle("hidden",step.type === "narration");
  $("#visualNovelStage").classList.toggle("narration-mode",step.type === "narration");
  typeDialogue(step.text);
  if(eventRuntime.state!=="WAITING_DIALOGUE")eventRuntime.transition("WAITING_DIALOGUE");eventRuntime.input.unlock(immersiveScene.id);persistEventRuntime();
  scheduleAutoAdvance();
}

function queueSceneStep(delay) {
  const owner=immersiveScene?.id;
  if(owner)eventRuntime.input.lock(owner,"StoryAutoCue");
  if(sceneAdvanceTimer)clearTimeout(sceneAdvanceTimer);
  sceneAdvanceTimer=setTimeout(()=>{sceneAdvanceTimer=null;eventRuntime.input.unlock(owner);if(immersiveScene?.id===owner)renderImmersiveStep();},delay);
}
function showSceneTransition(step) {
  const layer=$("#sceneTransition");layer.className=`scene-transition ${step.style??"fade"}`;layer.querySelector("span").textContent=step.label??"";
  requestAnimationFrame(()=>layer.classList.add("active"));
  sceneAdvanceTimer=setTimeout(()=>{layer.classList.remove("active");sceneAdvanceTimer=setTimeout(()=>{layer.classList.add("hidden");sceneAdvanceTimer=null;eventRuntime.input.unlock(immersiveScene?.id);if(eventRuntime.state==="TRANSITIONING")eventRuntime.transition("PLAYING");persistEventRuntime();renderImmersiveStep();},360);},720);
}
function renderImmersiveChoices(options=[]) {
  const layer=$("#storyChoiceLayer");
  const exploration=immersiveScene?.id==="m30-day4-arrive-home";
  layer.classList.toggle("exploration-hotspots",exploration);
  layer.innerHTML=`<p class="choice-prompt">${exploration?"집 안에서 무엇을 먼저 확인할까?":"어떻게 대답할까?"}</p>${options.map((option,index)=>`<button type="button" data-immersive-choice="${escapeHtml(option.id)}"><span>${exploration?"◇":String(index+1).padStart(2,"0")}</span><b>${escapeHtml(option.label)}</b></button>`).join("")}`;
  layer.classList.remove("hidden");
  layer.querySelector("button")?.focus();
}
function chooseImmersiveOption(choiceId) {
  if(!immersiveScene?.onChoice)return;
  if(!eventRuntime.selectChoice(choiceId))return;
  let choiceResult;
  try{
    choiceResult=immersiveScene.onChoice(choiceId);
  }catch(error){
    const failedSceneId=immersiveScene.id;
    eventRuntime.input.unlock(failedSceneId);eventRuntime.fail(error,{sceneId:eventRuntime.active?.sceneId});persistEventRuntime(true);
    toast("선택 결과를 처리하지 못해 이벤트를 안전하게 종료했어요.");
    finishImmersiveScene();
    return;
  }
  const next=Array.isArray(choiceResult)?choiceResult:choiceResult?.sequence;
  if(!next?.length){eventRuntime.input.unlock(immersiveScene.id);eventRuntime.fail(new Error("Choice callback returned no sequence"),{sceneId:eventRuntime.active?.sceneId});persistEventRuntime(true);finishImmersiveScene();return;}
  immersiveScene.sequence=next;immersiveScene.index=0;immersiveScene.currentStep=null;
  eventRuntime.input.unlock(immersiveScene.id);eventRuntime.transition("PLAYING");persistEventRuntime(true);
  const temptationNpc=immersiveScene.type==="temptation"?state.npcs.find(npc=>immersiveScene.id===`temptation-${npc.instanceId}`):null;
  const secretChoice=TEMPTATION_CHOICES.secret;
  const resultPopup=choiceResult?.resultPopup??(temptationNpc&&choiceId==="secret"?{action:{id:"temptation-secret",title:`${temptationNpc.name}와 비밀 만남`},message:`${temptationNpc.name}와 둘만의 술자리를 선택했다. 설렘은 커졌지만 ${state.partner.name}와의 신뢰에는 위험한 균열이 생겼다.`,effects:{npcInterest:secretChoice.npcInterest,npcTrust:secretChoice.npcTrust,trust:secretChoice.partnerTrust,conflict:secretChoice.conflict}}:null);
  if(resultPopup){openActionResultModal(resultPopup.action,resultPopup.message,resultPopup.effects,renderImmersiveStep);return;}
  renderImmersiveStep();
}
function advanceImmersiveScene() { if(!immersiveScene||immersiveScene.currentStep?.type==="choice"||eventRuntime.input.snapshot().locked)return;if(eventRuntime.state==="WAITING_DIALOGUE")eventRuntime.transition("PLAYING");renderImmersiveStep(); }
function skipImmersiveScene(event) { event.stopPropagation();if(!immersiveScene)return;$("#vnEventCg").hidden=true;if(sceneAdvanceTimer)clearTimeout(sceneAdvanceTimer);sceneAdvanceTimer=null;eventRuntime.input.unlock(immersiveScene.id);const choice=immersiveScene.sequence.find(step=>step.type==="choice");if(choice){if(eventRuntime.state==="TRANSITIONING")eventRuntime.transition("PLAYING");if(eventRuntime.state!=="WAITING_CHOICE")eventRuntime.transition("WAITING_CHOICE");immersiveScene.index=immersiveScene.sequence.indexOf(choice)+1;immersiveScene.currentStep=choice;eventRuntime.setProgress({sequenceIndex:immersiveScene.index-1,dialogueIndex:immersiveScene.index-1});persistEventRuntime(true);renderImmersiveChoices(choice.options);}else finishImmersiveScene(); }
function advanceCampaignChapter(completedSession) {
  if(state.scenario?.enabled!==true)return null;
  const match=String(completedSession?.id??"").match(/^m30-day(\d+)-/);
  const completedDay=Number(match?.[1]);
  const recorded=(state.storyHistory??[]).some(record=>record.sceneId===completedSession?.id);
  if(!Number.isInteger(completedDay)||completedDay!==state.day||!recorded)return null;
  state.day=completedDay+1;
  state.phase=0;
  state.selected=null;
  resetForNextDay(state);
  return selectNextStoryScene(state);
}
function finishImmersiveScene() {
  if(sceneAdvanceTimer)clearTimeout(sceneAdvanceTimer);sceneAdvanceTimer=null;const completedSession=immersiveScene;if(completedSession?.id===LOCKED_DAY1_SCENE_ID&&state.storyFlags?.day1QuestionStrategy)state.pendingStoryId=null;if(completedSession?.id===LOCKED_DAY2_SCENE_ID&&state.storyFlags?.day2ContactStrategy&&!state.storyHistory?.some(record=>record.sceneId===LOCKED_DAY2_SCENE_ID)){resolveStoryChoice(state,LOCKED_DAY2_SCENE_ID,getLockedDay2LegacyChoice(state));state.storyFlags.day2RuntimeComplete=true;state.pendingStoryId=null;}const nextCampaignScene=advanceCampaignChapter(completedSession);eventRuntime.input.unlock(completedSession?.id);eventRuntime.complete();immersiveScene=null;persistEventRuntime(true);
  $("#visualNovelStage").classList.remove("narration-mode","location-event-scene");delete $("#visualNovelStage").dataset.focusCharacter;delete $("#visualNovelStage").dataset.sceneEffect;delete $("#vnCharacter").dataset.day1Pose;$("#skipButton").classList.add("hidden");$("#storyChoiceLayer").classList.add("hidden");$("#vnNpcRear").hidden=true;$("#vnNpcFront").hidden=true;$("#vnEventCg").hidden=true;$("#actionGrid").classList.remove("hidden");$("#nextButton").classList.remove("hidden");
  SaveManager.save(state);render();$(".story-toolbar").classList.toggle("hidden",state.scenario?.enabled!==true);const queued=eventRuntime.queue.shift();if(queued)setTimeout(()=>startImmersiveScene(queued),0);else if(nextCampaignScene)setTimeout(()=>openStoryScene(nextCampaignScene),0);
}

function restoreEventCheckpoint(){
  const saved=state?.eventRuntime;if(!saved?.activeEvent||!saved.checkpoint||state.storyFlags?.[`${saved.activeEvent}:COMPLETED`])return;
  if(!areGameplayEventsUnlocked()&&!isCampaignPrologueStory(saved.activeEvent)){state.eventRuntime={...saved,activeEvent:null,state:"IDLE",checkpoint:null,eventQueue:[],microQueue:[],pendingEvent:null,inputLock:{locked:false,owner:null,reason:null,lockedFor:0}};SaveManager.save(state);return;}
  const situation=SITUATION_EVENTS.find(event=>event.id===saved.activeEvent);
  if(situation){const index=Math.max(0,Number(saved.checkpoint.sequenceIndex)||0);openEventScene(situation,{resumeSequenceIndex:index});toast("진행 중이던 에피소드를 안전한 지점에서 복구했어요.");return;}
  const story=getStoryScene(saved.activeEvent);if(story){openStoryScene(story);toast("진행 중이던 스토리를 Scene 시작점에서 복구했어요.");return;}
  state.logs.push({time:`DAY ${state.day} · RECOVERY`,text:`알 수 없는 이벤트 ${saved.activeEvent}를 건너뛰고 안전 지점으로 복구했다.`});state.eventRuntime={...saved,activeEvent:null,state:"IDLE",checkpoint:null,inputLock:{locked:false,owner:null,reason:null,lockedFor:0}};SaveManager.save(state);
}

const MBTI_TYPES = ["ISTJ", "ISFJ", "INFJ", "INTJ", "ISTP", "ISFP", "INFP", "INTP", "ESTP", "ESFP", "ENFP", "ENTP", "ESTJ", "ESFJ", "ENFJ", "ENTJ"];
const PERSONALITY_LABELS = { romanticism:"로맨틱", independence:"독립적", loyalty:"한결같음", emotionalSensitivity:"섬세함", socialPreference:"사교적", contactImportance:"연락 중시" };

function setOnboardingProgress(step, total = 4) {
  $("#onboardingStepLabel").textContent = `STEP ${step} / ${total}`;
  $("#onboardingProgressBar").style.width = `${step / total * 100}%`;
}

function runRoll(button, output, samples, finalize) {
  button.disabled = true;
  let index = 0;
  const timer = setInterval(() => { output.textContent = samples[index++ % samples.length]; }, 75);
  setTimeout(() => {
    clearInterval(timer);
    output.textContent = finalize();
    button.disabled = false;
  }, 900);
}

function personalitySummary(partner) {
  return Object.entries(partner.personality)
    .filter(([key]) => PERSONALITY_LABELS[key])
    .sort((a,b) => b[1] - a[1]).slice(0,3)
    .map(([key,value]) => `${PERSONALITY_LABELS[key]} ${value}`).join(" · ");
}

function markScreenArrival(element){if(!element)return;element.classList.remove("screen-arrival");requestAnimationFrame(()=>element.classList.add("screen-arrival"));setTimeout(()=>element.classList.remove("screen-arrival"),520);}

function beginOnboarding() {
  onboarding = { step:1, mode:null, partner:null, girlfriendTraitsReady:false, girlfriendJobReady:false, playerArchetype:null, playerName:"", playerJob:null, previewState:null };
  document.body.classList.remove("title-ui");
  document.body.classList.add("onboarding-ui","mode-select-stage");
  $("#introScreen").classList.add("hidden");
  $("#onboardingScreen").classList.remove("hidden");
  renderModeSetup();
  markScreenArrival($("#onboardingScreen"));
}

function renderModeSetup() {
  document.body.classList.add("mode-select-stage");
  setOnboardingProgress(1);
  const modes=[GAME_MODES.FREE_ROMANCE,GAME_MODES.MARRIAGE_30].map(getGameModeConfig);
  $("#onboardingContent").innerHTML=`<header class="setup-heading mode-heading"><span>MODE SELECT</span><h1>모드 선택</h1><p>플레이할 모드를 선택해주세요.</p></header><div class="mode-select-grid">${modes.map(mode=>{const story=mode.kind==="story";const tags=story?["기억상실","로맨스","미스터리","선택형 스토리"]:["연애","직장","자산","쇼핑","인맥","자유"];return `<button class="mode-select-card ${story?"story-mode-card":"free-mode-card"}" data-game-mode="${mode.id}" type="button"><span class="mode-card-image" style="--mode-image:url('${story?"assets/backgrounds/hospital/day1-hospital-bedside-day-v1.png":"assets/maps/gangnam-25d.jpg"}')"><img src="${story?"assets/characters/day1/haeun/poses/haeun-pose-standing-bedside-restraint-2d.png":"assets/characters/girlfriend-standing-smile-2d.png"}" alt=""></span><span class="mode-card-copy"><small>${escapeHtml(mode.label)}</small><strong>《${escapeHtml(mode.title)}》</strong><span>${story?"기억을 잃은 나와 30일 뒤 결혼한다는 여자친구.<br>감춰진 기억을 따라가는 로맨스 미스터리.":"직업도, 사랑도, 돈도, 인간관계도.<br>원하는 삶과 관계를 직접 만들어 보세요."}</span><em>${tags.map(tag=>`<i>${tag}</i>`).join("")}</em><b>${story?"스토리 시작하기":"자유롭게 시작하기"} <span>→</span></b></span></button>`;}).join("")}</div>`;
  document.querySelectorAll("[data-game-mode]").forEach(button=>button.addEventListener("click",()=>{
    onboarding.mode=button.dataset.gameMode;
    const config=getGameModeConfig(onboarding.mode);
    if(config.fixedPartnerId){onboarding.partner=createGirlfriendFromProfile(config.fixedPartnerId);onboarding.partner.age=23;onboarding.girlfriendTraitsReady=true;onboarding.girlfriendJobReady=true;onboarding.playerArchetype="balanced";renderPlayerSetup();}
    else{onboarding.partner=null;onboarding.girlfriendTraitsReady=false;onboarding.girlfriendJobReady=false;renderGirlfriendSetup();}
  }));
}

function renderGirlfriendSetup() {
  document.body.classList.remove("mode-select-stage");
  onboarding.step=2; setOnboardingProgress(2);
  const candidates = HEROINE_PROFILES.slice(0,3);
  $("#onboardingContent").innerHTML = `
    <header class="setup-heading"><span>GIRLFRIEND SELECT</span><h1>여자친구 캐릭터 선택</h1><p>보라색 머리 캐릭터를 선택한 뒤 MBTI와 직업을 확인하세요. 이름은 그대로 유지됩니다.</p></header>
    <div class="setup-card-grid heroine-select-grid">${candidates.map((profile,index)=>`<button class="setup-character-card ${onboarding.partner?.heroineId===profile.id?"selected":""}" data-heroine="${profile.id}" type="button" ${index?"disabled":""}><img src="${profile.referenceImage}?v=7" alt="${escapeHtml(profile.name)}"><strong>${escapeHtml(profile.name)}</strong><span>${index?"준비 중 · 선택 불가":"선택 가능"}</span></button>`).join("")}</div>
    <div class="roll-panel ${onboarding.partner?"":"locked"}">
      <div class="roll-row"><div><small>MBTI</small><b id="girlfriendTraitRoll">${onboarding.girlfriendTraitsReady?escapeHtml(onboarding.partner.mbti):"버튼을 눌러 MBTI 선택"}</b></div><button id="rollGirlfriendTraits" type="button" ${onboarding.partner?"":"disabled"}>MBTI 랜덤 선택</button></div>
      <div class="roll-row"><div><small>CAREER</small><b id="girlfriendJobRoll">${onboarding.girlfriendJobReady?escapeHtml(onboarding.partner.career.name):"여자친구의 직업"}</b></div><button id="rollGirlfriendJob" type="button" ${onboarding.partner?"":"disabled"}>직업 랜덤 선택</button></div>
    </div>
    <button id="girlfriendSetupNext" class="primary-button setup-next" type="button" ${onboarding.girlfriendTraitsReady&&onboarding.girlfriendJobReady?"":"disabled"}>나의 캐릭터 선택으로</button>`;
  document.querySelectorAll("[data-heroine]").forEach((button)=>button.addEventListener("click",()=>{
    onboarding.partner=createGirlfriendFromProfile(button.dataset.heroine);
    onboarding.girlfriendTraitsReady=onboarding.girlfriendJobReady=false;
    renderGirlfriendSetup();
  }));
  $("#rollGirlfriendTraits")?.addEventListener("click",(event)=>runRoll(event.currentTarget,$("#girlfriendTraitRoll"),MBTI_TYPES,()=>{rerollGirlfriendPersonality(onboarding.partner);onboarding.partner.mbti=MBTI_TYPES[Math.floor(Math.random()*MBTI_TYPES.length)];onboarding.girlfriendTraitsReady=true;setTimeout(renderGirlfriendSetup,120);return onboarding.partner.mbti;}));
  $("#rollGirlfriendJob")?.addEventListener("click",(event)=>{const careers=GIRLFRIEND_JOBS.filter((career)=>career.id!=="high-school-senior"&&career.id!==onboarding.partner.career?.id);runRoll(event.currentTarget,$("#girlfriendJobRoll"),careers.map((career)=>career.name),()=>{const selected=structuredClone(careers[Math.floor(Math.random()*careers.length)]);selected.heroineId=onboarding.partner.heroineId;onboarding.partner.career=selected;onboarding.partner.job=selected.name;onboarding.girlfriendJobReady=true;setTimeout(renderGirlfriendSetup,120);return selected.name;});});
  $("#girlfriendSetupNext")?.addEventListener("click",renderPlayerSetup);
}

function selectPlayerArchetype(id) {
  onboarding.playerArchetype = id;
  renderPlayerSetup();
}

function showPremiumConfirmation(archetype) {
  const overlay=document.createElement("div");
  overlay.className="premium-confirm-overlay";
  overlay.innerHTML=`<div class="premium-confirm"><span>PREMIUM CHARACTER</span><h2>${escapeHtml(archetype.name)}</h2><p>유료 캐릭터 선택 팝업입니다. 현재 데모에서는 결제 없이 선택 확인만 진행합니다.</p><div><button data-cancel type="button">취소</button><button data-confirm type="button">확인하고 선택</button></div></div>`;
  $("#onboardingContent").append(overlay);
  overlay.querySelector("[data-cancel]").addEventListener("click",()=>overlay.remove());
  overlay.querySelector("[data-confirm]").addEventListener("click",()=>selectPlayerArchetype(archetype.id));
}

function renderPlayerSetup() {
  document.body.classList.remove("mode-select-stage");
  onboarding.step=3; setOnboardingProgress(3);
  const storyMode=getGameModeConfig(onboarding.mode).kind==="story";
  if(storyMode)onboarding.playerArchetype="balanced";
  $("#onboardingContent").innerHTML=`
    <header class="setup-heading"><span>PLAYER SETUP</span><h1>${storyMode?"이름과 직업 설정":"나의 외모 선택"}</h1><p>${storyMode?"STORY MODE의 주인공 외형은 고정됩니다. 이름과 직업만 선택해 주세요.":"외형과 이름, 직업은 게임의 능력치와 대사에 그대로 적용됩니다."}</p></header>
    <div class="setup-card-grid player-select-grid ${storyMode?"story-player-locked":""}">${PLAYER_ARCHETYPES.map((entry)=>{const fixed=storyMode&&entry.id==="balanced",locked=storyMode&&!fixed;return `<button class="setup-character-card ${onboarding.playerArchetype===entry.id?"selected":""} ${locked?"story-locked":""}" data-player="${entry.id}" type="button" ${storyMode?'disabled aria-disabled="true"':""}><img src="${entry.image}" alt="${entry.name}"><strong>${entry.name}${entry.premium?" · PREMIUM":""}</strong><span>${fixed?"STORY MODE 고정":locked?"🔒 STORY MODE 잠금":`능력 ${entry.abilityRating} · 외모 ${entry.appearanceRating}`}</span><small>${locked?"FREE MODE에서 선택할 수 있습니다.":entry.description}</small></button>`;}).join("")}</div>
    <div class="player-input-panel"><label for="playerNameInput">내 이름 <small>최대 3글자 · 한글 또는 영문</small></label><div class="player-name-roll"><input id="playerNameInput" value="${escapeHtml(onboarding.playerName)}" placeholder="이름" autocomplete="off" spellcheck="false" inputmode="text" aria-describedby="playerNameNotice"><button id="rollPlayerName" type="button">내 이름 랜덤 선택</button></div><small id="playerNameNotice" class="player-name-notice" aria-live="polite"></small><div class="roll-row"><div><small>MY CAREER</small><b id="playerJobRoll">${onboarding.playerJob?escapeHtml(onboarding.playerJob.name):"버튼을 눌러 직업 선택"}</b></div><button id="rollPlayerJob" type="button">내 직업 랜덤 선택</button></div></div>
    <button id="playerSetupNext" class="primary-button setup-next" type="button" ${onboarding.playerArchetype&&onboarding.playerName&&onboarding.playerJob?"":"disabled"}>최종 결과 확인</button>`;
  if(!storyMode)document.querySelectorAll("[data-player]").forEach((button)=>button.addEventListener("click",()=>{const archetype=PLAYER_ARCHETYPES.find((entry)=>entry.id===button.dataset.player);if(archetype.premium)showPremiumConfirmation(archetype);else selectPlayerArchetype(archetype.id);}));
  const nameInput=$("#playerNameInput");
  let composingName=false;
  const commitPlayerName=()=>{const result=sanitizePlayerNameInput(nameInput.value);onboarding.playerName=result.value;nameInput.value=result.value;$("#playerNameNotice").textContent=result.reason;$("#playerNameNotice").classList.toggle("warning",Boolean(result.reason));$("#playerSetupNext").disabled=!(onboarding.playerArchetype&&onboarding.playerName&&onboarding.playerJob);};
  nameInput.addEventListener("compositionstart",()=>{composingName=true;});
  nameInput.addEventListener("compositionend",()=>{composingName=false;commitPlayerName();});
  nameInput.addEventListener("input",()=>{if(!composingName)commitPlayerName();});
  $("#rollPlayerName").addEventListener("click",()=>{onboarding.playerName=getRandomPlayerName(onboarding.playerName);$("#playerNameInput").value=onboarding.playerName;$("#playerNameNotice").textContent="200개 이름 중 하나를 선택했어요.";$("#playerNameNotice").classList.remove("warning");$("#playerSetupNext").disabled=!(onboarding.playerArchetype&&onboarding.playerName&&onboarding.playerJob);});
  $("#rollPlayerJob").addEventListener("click",(event)=>runRoll(event.currentTarget,$("#playerJobRoll"),JOBS.map((job)=>job.name),()=>{onboarding.playerJob=generateJob();$("#playerSetupNext").disabled=!(onboarding.playerArchetype&&onboarding.playerName);return onboarding.playerJob.name;}));
  $("#playerSetupNext").addEventListener("click",renderSetupSummary);
}

function renderSetupSummary() {
  document.body.classList.remove("mode-select-stage");
  onboarding.step=4; setOnboardingProgress(4);
  const player=createPlayerProfile(onboarding.playerArchetype,onboarding.playerName);
  onboarding.previewState=createInitialState(onboarding.partner,Math.random,{mode:onboarding.mode,player,job:onboarding.playerJob});
  const preview=onboarding.previewState;
  const mode=getGameModeConfig(preview.gameMode);
  $("#onboardingContent").innerHTML=`<header class="setup-heading"><span>FINAL PROFILE · ${escapeHtml(mode.label)}</span><h1>${escapeHtml(player.name)}의 30일이 시작됩니다</h1><p>선택한 모드와 설정은 저장 데이터와 모든 게임 시스템에 적용됩니다.</p></header><div class="setup-summary"><img src="${player.image}" alt="${escapeHtml(player.name)}"><div><span>${escapeHtml(player.archetypeName)}</span><h2>${escapeHtml(player.name)}</h2><dl><div><dt>게임 모드</dt><dd>${escapeHtml(mode.label)} · ${escapeHtml(mode.title)}</dd></div><div><dt>직업</dt><dd>${escapeHtml(preview.job.name)}</dd></div><div><dt>초기 자금</dt><dd>${money(preview.money)}</dd></div><div><dt>매력 / 패션</dt><dd>${preview.charm} / ${preview.fashion}</dd></div><div><dt>업무 / 사교</dt><dd>${preview.work} / ${preview.social}</dd></div></dl></div><div class="summary-partner"><small>${preview.scenario.enabled?"FIANCÉE · CAMPAIGN":"GIRLFRIEND"}</small><strong>${escapeHtml(preview.partner.name)}${preview.scenario.enabled?` · ${preview.partner.age}세`:""}</strong><span>${preview.scenario.enabled?"MBTI 🔒 · 직업 🔒":`${escapeHtml(preview.partner.mbti)} · ${escapeHtml(preview.partner.career.name)}`}</span><p>${preview.scenario.enabled?"프로필은 함께 보낸 시간과 확인한 기록에 따라 해금됩니다.":personalitySummary(preview.partner)}</p></div></div><button id="openIntroButton" class="primary-button setup-next" type="button">다음 · 프롤로그 보기</button>`;
  $("#openIntroButton").addEventListener("click",openStoryIntro);
}

function openStoryIntro() {
  $("#onboardingScreen").classList.add("hidden");
  $("#storyIntroScreen").classList.remove("hidden");
  markScreenArrival($("#storyIntroScreen"));
  const video=$("#introVideo");
  introVideoIndex=0;
  video.src=INTRO_VIDEO_PLAYLIST[introVideoIndex];
  video.load();
  $("#introGameStartButton").disabled=true;
  $("#introPlaybackHint").textContent="프롤로그 1 / 2를 재생하고 있습니다.";
  video.play().catch(()=>{$("#introPlaybackHint").textContent="재생 버튼을 눌러 프롤로그를 감상해 주세요.";});
}

function playNextIntroVideo() {
  const video=$("#introVideo");
  if (introVideoIndex >= INTRO_VIDEO_PLAYLIST.length - 1) { unlockIntroStart(); return; }
  introVideoIndex += 1;
  video.src=INTRO_VIDEO_PLAYLIST[introVideoIndex];
  video.load();
  $("#introPlaybackHint").textContent=`프롤로그 ${introVideoIndex + 1} / ${INTRO_VIDEO_PLAYLIST.length}를 재생하고 있습니다.`;
  video.play().catch(()=>{$("#introPlaybackHint").textContent="다음 프롤로그의 재생 버튼을 눌러 주세요.";});
}

function unlockIntroStart(message="프롤로그가 끝났습니다. 이제 게임을 시작하세요.") { $("#introPlaybackHint").textContent=message; $("#introGameStartButton").disabled=false; }
function finishOnboarding() { state=onboarding.previewState; SaveManager.save(state); showGame(); }
function startGame() { if(titleTransitioning)return;titleTransitioning=true;$("#startButton").disabled=true;beginOnboarding(); }
function showGame() { requestInitialFullscreen(); state.actionHistory ??= []; $("#introScreen").classList.add("hidden"); $("#onboardingScreen").classList.add("hidden"); $("#storyIntroScreen").classList.add("hidden"); $("#gameScreen").classList.remove("hidden"); markScreenArrival($("#gameScreen")); $("#menuButton").classList.remove("hidden"); $("#fullscreenButton").classList.remove("hidden"); $(".story-toolbar").classList.toggle("hidden",state.scenario?.enabled!==true); $("#tipToolsButton").classList.remove("hidden"); $("#loadButton").classList.add("hidden"); state.settings??={};state.settings.theaterMode=true;localStorage.setItem(THEATER_SETTING_KEY,"true");document.body.classList.add("theater-mode");renderAutoButton();renderFullscreenButtons();render();setTimeout(()=>{restoreEventCheckpoint();if(!state.eventRuntime?.activeEvent){const story=selectNextStoryScene(state);if(isCampaignPrologueStory(story?.id))openStoryScene(story);}},0); }
function money(value) { return `₩ ${Math.round(value).toLocaleString("ko-KR")}`; }
function outfitImageUrl(item) { return item?.heroineId==="haeun"&&item?.productImage?`${item.productImage}?v=8`:item?.productImage??""; }
function getStoredItemDescription(item){const tags=(item.styleTags??item.preferenceTags??[]).join(" · ");return `${tags||item.category} 아이템 · 매력 +${item.attractivenessBonus??0} · 패션 +${item.fashionBonus??0}`;}
function renderPurchasedItemSlots(entries=[]){const cards=entries.slice(-3).map(({instance,item})=>{const image=outfitImageUrl(item);return `<button class="purchased-item-slot" type="button" data-stored-item="${escapeHtml(instance.instanceId)}" aria-label="${escapeHtml(item.name)} 상세 보기">${image?`<img src="${image}" alt="${escapeHtml(item.name)}" loading="lazy">`:`<span aria-hidden="true">${item.icon}</span>`}<b>${escapeHtml(item.name)}</b></button>`;});while(cards.length<3)cards.push(`<span class="purchased-item-slot empty" aria-label="빈 보관 칸"><i aria-hidden="true">＋</i><b>빈 칸</b></span>`);return cards.join("");}
function withParticle(word, consonantParticle, vowelParticle) { const last=String(word).charCodeAt(String(word).length-1); return `${word}${last>=0xac00&&last<=0xd7a3&&(last-0xac00)%28?consonantParticle:vowelParticle}`; }

const HAEUN_PROFILE_PORTRAITS=Object.freeze({
  calm:"assets/characters/girlfriend-standing-2d.png",
  smile:"assets/characters/girlfriend-standing-smile-2d.png",
  tense:"assets/characters/girlfriend-standing-tense-2d.png",
  worried:"assets/characters/girlfriend-standing-tense-2d.png",
  phone:"assets/characters/girlfriend-phone-calm-2d.png",
  date:"assets/characters/girlfriend-date-outfit-calm-2d.png"
});

function updatePartnerPortrait(expressionId="calm",poseId=state?.currentPose,outfitId=state?.currentOutfit) {
  const avatar=$("#partnerAvatar"),partner=state?.partner;
  if(!avatar||!partner)return;
  let image=partner.referenceImage??getGirlfriendVisual(partner.visualId).previewImage;
  if(partner.heroineId==="haeun"){
    const tone=HAEUN_PROFILE_PORTRAITS[expressionId]?expressionId:"calm";
    image=["smile","tense","worried"].includes(tone)
      ? HAEUN_PROFILE_PORTRAITS[tone]
      : poseId==="phone"
        ? HAEUN_PROFILE_PORTRAITS.phone
        : outfitId==="date"
          ? HAEUN_PROFILE_PORTRAITS.date
          : HAEUN_PROFILE_PORTRAITS.calm;
  }
  const nextSource=`${image}?v=8`;
  if(avatar.getAttribute("src")!==nextSource)avatar.src=nextSource;
  avatar.alt=`${partner.name} ${expressionId==="smile"?"미소 짓는":expressionId==="tense"||expressionId==="worried"?"긴장한":poseId==="phone"?"통화 중인":"평온한"} 상반신 사진`;
  avatar.dataset.expression=expressionId;
  avatar.dataset.pose=poseId??"standing";
}

function getLogDay(entry){const match=String(entry?.time??"").match(/^DAY\s+(\d+)(?:\s|$)/);return match?Number(match[1]):null;}
function getTodayLogs(){return (state?.logs??[]).filter(entry=>getLogDay(entry)===state.day);}

function render() {
  const p = state.partner, phase = phases[state.phase];
  const storyCampaign=state.scenario?.enabled===true;
  document.body.classList.toggle("campaign-story-mode",storyCampaign);
  document.body.classList.toggle("campaign-free-mode",!storyCampaign);
  $("#gameScreen").classList.toggle("campaign-story-mode",storyCampaign);
  $("#gameScreen").classList.toggle("campaign-free-mode",!storyCampaign);
  document.body.dataset.gameMode=storyCampaign?"story":"free";
  document.body.dataset.heroine=p.heroineId;document.documentElement.style.setProperty("--heroine-accent",p.uiAccent??"#ff91b5");
  $("#dayLabel").textContent = `${state.day} · ${getWeekdayName(state.day)}`; $("#phaseIcon").textContent = phase.icon;
  const mode=getGameModeConfig(state.gameMode),modeBadge=$("#gameModeBadge");modeBadge.textContent=storyCampaign?`STORY · D-${Math.max(0,31-state.day)}`:"FREE MODE";modeBadge.classList.remove("hidden");modeBadge.dataset.mode=mode.id;modeBadge.setAttribute("aria-label",storyCampaign?`${mode.title}, 결혼식까지 ${Math.max(0,31-state.day)}일`:mode.title);
  if (state.phase === 3) { if(state.world?.mode==="district")renderWorldMap();else renderNightHome(); return; }
  document.body.classList.add("ui-classic-mode");
  document.body.classList.remove("ui-story-mode");
  document.body.classList.remove("ui-night-mode");
  $("#gameScreen").classList.add("classic-mode");
  $("#gameScreen").classList.remove("story-mode");
  $("#gameScreen").classList.remove("night-mode");
  $("#nightHome").classList.add("hidden");
  $(".play-panel").classList.remove("hidden");
  $("#visualNovelStage").dataset.scene = phase.key;
  applyScenePresentation(resolvePhasePresentation(state,phase.key));
  const sceneSoundKey = `${state.day}-${phase.key}`;
  if (sceneSoundKey !== lastSceneSoundKey) { lastSceneSoundKey = sceneSoundKey; sound.playScene(phase.key,state.day); }
  $("#phaseLabel").textContent = phase.label;
  $("#clockLabel").textContent = phase.time; $("#sceneTitle").textContent = state.day === 1 && state.phase === 0 ? "첫날의 아침" : phase.title; $("#sceneTitle").classList.remove("hidden");
  const campaignProfileLocked=state.scenario?.enabled===true;
  typeDialogue(phase.text); $("#partnerName").textContent = campaignProfileLocked?`${p.name} · ${p.age}세`:p.name; $("#partnerMbti").textContent = campaignProfileLocked&&!state.scenario.profileUnlocks.includes("haeun-mbti")?"🔒":p.mbti ?? "----"; $("#partnerJob").textContent = campaignProfileLocked&&!state.scenario.profileUnlocks.includes("haeun-career")?"직업 · 🔒":p.career?.name ?? p.job; $("#partnerTrait").textContent = campaignProfileLocked&&!state.scenario.profileUnlocks.includes("haeun-personality")?"성향 · 🔒":`성향 · ${p.archetype}`;
  $("#vnAccessoryLayer").hidden=true;
  const expression = renderCharacter($("#vnCharacter"),state,null);
  updatePartnerPortrait(expression.tone,state.currentPose,state.currentOutfit);
  syncOutfitCharacterMedia(false);
  updateGiftVehicleLayer("girlfriend");
  $("#vnExpressionLayer").className=`vn-expression-layer ${expression.tone}`;
  $("#vnExpressionLayer").innerHTML=`<span aria-hidden="true">${expression.icon}</span><b>${expression.label}</b>`;
  const relationship = getRelationshipState(state); $("#relationshipState").textContent = `● ${relationship.label}`; $("#relationshipState").dataset.tone = relationship.tone; $("#relationshipState").title = relationship.description;
  $("#affectionValue").textContent = Math.round(state.affection); $("#trustValue").textContent = Math.round(state.trust);
  $("#affectionBar").style.width = `${state.affection/10}%`; $("#trustBar").style.width = `${state.trust/10}%`;
  const traitRows = getVisibleTraitRows(state); const revealedCount = traitRows.filter(row => row.revealed).length;
  $("#moneyValue").textContent = money(state.money); $("#jobValue").textContent = `${state.player.name} · ${state.job.name} · Lv.${state.jobLevel}`; $("#traitProgress").textContent = `${revealedCount} / 5`;
  $("#playerProfileImage").src=state.player.image;$("#playerProfileImage").alt=`${state.player.name} 주인공 이미지`;$("#playerProfileName").textContent=state.player.name;$("#playerProfileJob").textContent=state.job.name;
  $("#lifeStatus").textContent = state.fatigue >= 70 ? "피로가 누적되는 중" : state.stress > 75 ? "한계에 가까움" : state.energy < 25 ? "휴식이 필요함" : state.confidence >= 70 ? "자신감이 넘치는 중" : state.affection > 750 ? "사랑이 깊어지는 중" : "나쁘지 않은 하루";
  $("#traitList").innerHTML = traitRows.map(row => row.revealed ? `<div class="trait"><span>${row.name}</span><b>${row.value}</b></div>` : `<div class="trait locked"><span>${row.name}</span><b>${row.confidence ? `${row.hint} · ${row.confidence}%` : "???"}</b></div>`).join("");
  const appearance = getEffectiveAppearance(state);
  // 구매 아이템은 하단 보관함에서만 보여 준다. 캐릭터 위 장착 배지와 액세서리 오버레이는 표시하지 않는다.
  $("#vnEquipmentLayer").replaceChildren();
  const stats = [["체력",state.energy],["피로",state.fatigue],["건강",state.health],["스트레스",state.stress],[appearance.bonuses.attractiveness?`매력 +${appearance.bonuses.attractiveness}`:"매력",appearance.charm],[appearance.bonuses.fashion?`패션 +${appearance.bonuses.fashion}`:"패션",appearance.fashion],["자신감",state.confidence],["업무 능력",state.work],["사회성",state.social]];
  $("#statList").innerHTML = stats.map(([name,val])=>`<div class="stat"><div class="stat-head"><span>${name}</span><b>${Math.round(val)}</b></div><div class="stat-track"><i style="width:${clamp(val)}%;background:${name==='스트레스'?'#e5846d':''}"></i></div></div>`).join("");
  $("#actionGrid").innerHTML = actions[phase.key].map((a,i)=>({a,i})).filter(({a})=>isActionVisible(state,a)).map(({a,i})=>{ const availability=getActionAvailability(state,a); return `<button class="action-card ${state.selected===i?'selected':''} ${availability.available?'':'locked'}" data-index="${i}" ${availability.available?'':'disabled'}><span class="action-icon">${a.icon}</span><span class="cost">${availability.available?escapeHtml(a.tag):'🔒 '+escapeHtml(availability.reason)}</span><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.desc)}</p></button>`; }).join("");
  const todayLogs=getTodayLogs();
  $("#eventLog").innerHTML = todayLogs.length ? todayLogs.slice(-4).reverse().map(l=>`<div class="log-item"><b>${escapeHtml(l.time)}</b><span>${escapeHtml(l.text)}</span></div>`).join("") : `<div class="log-item"><b>DAY ${state.day}</b><span>오늘의 첫 선택을 기다리고 있습니다.</span></div>`;
  const girlfriendOutfits=(state.inventory??[]).map(instance=>({instance,item:getItem(instance.itemId)})).filter(({instance,item})=>instance.owner==="girlfriend"&&item?.category==="heroine-outfit"&&item.heroineId===state.partner.heroineId);
  const hasEquippedOutfit=girlfriendOutfits.some(({instance})=>instance.equipped);
  const defaultOutfitImage=state.partner.heroineId==="haeun"?HAEUN_PROFILE_PORTRAITS.calm:state.partner.referenceImage;
  const defaultOutfitCard=`<button type="button" class="girlfriend-wardrobe-item ${hasEquippedOutfit?"":"equipped"}" data-warehouse-default="true" aria-pressed="${!hasEquippedOutfit}"><img src="${defaultOutfitImage}?v=8" alt="${escapeHtml(state.partner.name)} 기본 복장" loading="lazy"><span><b>기본 복장</b><small>${hasEquippedOutfit?"클릭해서 갈아입기":"현재 착용 중"}</small></span></button>`;
  $("#girlfriendWardrobeCount").textContent=`보유 의상 ${girlfriendOutfits.length+1}개`;
  $("#girlfriendWardrobe").innerHTML=defaultOutfitCard+girlfriendOutfits.map(({instance,item})=>`<button type="button" class="girlfriend-wardrobe-item ${instance.equipped?"equipped":""}" data-warehouse-outfit="${instance.instanceId}" aria-pressed="${instance.equipped}"><img src="${outfitImageUrl(item)}" alt="${escapeHtml(item.name)}" loading="lazy"><span><b>${escapeHtml(item.name.replace(`${state.partner.name} · `,""))}</b><small>${instance.equipped?"현재 착용 중":"클릭해서 갈아입기"}</small></span></button>`).join("");
  const purchasedItems=(state.inventory??[]).map(instance=>({instance,item:getItem(instance.itemId)})).filter(({instance,item})=>instance.source==="store"&&item&&item.category!=="heroine-outfit");
  const girlfriendItems=purchasedItems.filter(({instance})=>["girlfriend","gift"].includes(instance.owner));
  const playerItems=purchasedItems.filter(({instance})=>instance.owner==="player");
  $("#girlfriendStorageLabel").textContent=state.partner.name;
  $("#playerStorageLabel").textContent=state.player.name;
  $("#girlfriendPurchasedItems").innerHTML=renderPurchasedItemSlots(girlfriendItems);
  $("#playerPurchasedItems").innerHTML=renderPurchasedItemSlots(playerItems);
  const activeNpcs=(state.npcs??[]).filter(npc=>npc.active);
  const activeFriends=activeNpcs.filter(npc=>npc.category==="friend").length;
  $("#turnCount").textContent = `${state.phase+1}번째 선택`;
  $("#relationshipCount").textContent=`${activeNpcs.length}명 · 친구 ${activeFriends}명`;
  $("#nextButton").disabled = state.selected === null;
  $("#nextButton").textContent = state.selected === null ? "행동을 선택해 주세요" : (state.phase === 3 ? "하루 마무리하기 →" : "이 행동으로 결정 →");
  const nextPhase=phases[Math.min(state.phase+1,phases.length-1)];
  preloadSceneAssets([resolvePhasePresentation({...state,phase:Math.min(state.phase+1,3)},nextPhase.key)]);
}

function applyScenePresentation(presentation) {
  state.currentBackground=presentation.backgroundId;
  const stage=$("#visualNovelStage");
  if(stage){stage.dataset.weather=presentation.weather;stage.dataset.timeOfDay=presentation.timeOfDay;}
  const backdrop=$("#vnBackdrop");
  if(backdrop&&backdrop.dataset.backgroundId!==presentation.backgroundId){backdrop.dataset.backgroundId=presentation.backgroundId;backdrop.style.backgroundImage=`linear-gradient(180deg,#1d203114 0 62%,#17182773 100%),url("${presentation.backgroundUrl}")`;}
  verifyPresentationAsset(presentation,backdrop);
  const character=$("#vnCharacter");if(character)character.dataset.animation=presentation.animationId;
}

function verifyPresentationAsset(presentation,backdrop){
  if(!presentation?.backgroundUrl||!backdrop){eventRuntime.markAssets("FALLBACK");return;}
  const expectedId=presentation.backgroundId,image=new Image();let settled=false;
  const settle=(status)=>{if(settled)return;settled=true;eventRuntime.markAssets(status);persistEventRuntime();};
  const timeout=setTimeout(()=>settle("FALLBACK"),1500);
  image.onload=()=>{clearTimeout(timeout);settle("READY");};
  image.onerror=()=>{clearTimeout(timeout);if(backdrop.dataset.backgroundId===expectedId){const fallback=getBackgroundAsset("home-morning");backdrop.dataset.backgroundId="home-morning-fallback";backdrop.style.backgroundImage=`linear-gradient(180deg,#1d203114 0 62%,#17182773 100%),url("${fallback}")`;}settle("FALLBACK");};
  image.src=presentation.backgroundUrl;
}

function renderNightHome() {
  syncOutfitCharacterMedia(true);
  const night = ensureNightState(state);
  checkLateNightInvitation();
  const home=getPlayerHomeProfile(state.player?.archetypeId);
  document.body.classList.remove("ui-story-mode","ui-classic-mode");
  document.body.classList.add("ui-night-mode");
  $("#gameScreen").classList.remove("story-mode","classic-mode");
  $("#gameScreen").classList.add("night-mode");
  $(".play-panel").classList.add("hidden");
  $("#nightHome").classList.remove("hidden");
  $("#worldMap").classList.add("hidden");
  const roomScene=$("#nightRoomScene");
  roomScene.classList.add("has-room-background");
  roomScene.style.backgroundImage=`linear-gradient(180deg,#10121b20,#0c0b16a1),url("${home.background}")`;
  roomScene.style.backgroundSize="cover";
  roomScene.style.backgroundPosition="center";
  $(".night-home-header h2").textContent=home.homeName;
  $("#nightClock").textContent = formatNightTime(night.minutes);
  $("#nightDayLabel").textContent = `DAY ${state.day} · ${getWeekdayName(state.day)}`;
  $("#phoneBadge").classList.toggle("hidden",night.messagesRead);
  $("#nightHomeTip").textContent = night.activities.length ? `오늘 밤: ${night.activities.map(item=>item.label).join(" · ")}` : "밤 활동은 시간을 사용합니다. 늦게 잘수록 내일 더 피곤해져요.";
  const soundKey = `${state.day}-night-home`;
  if (soundKey !== lastSceneSoundKey) { lastSceneSoundKey=soundKey;sound.playScene("night",state.day); }
}

function renderWorldMap() {
  const worldMap=$("#worldMap"),wasHidden=worldMap.classList.contains("hidden");
  if(wasHidden)syncOutfitCharacterMedia(true);
  const night=ensureNightState(state);
  checkLateNightInvitation();
  const world=state.world;
  const map=WORLD_MAPS[world.districtId]??WORLD_MAPS.dongsu;
  document.body.classList.remove("ui-story-mode","ui-classic-mode");document.body.classList.add("ui-night-mode");
  $("#gameScreen").classList.remove("story-mode","classic-mode");$("#gameScreen").classList.add("night-mode");
  $(".play-panel").classList.add("hidden");$("#nightHome").classList.add("hidden");worldMap.classList.remove("hidden");
  $("#worldCityLabel").textContent=`${map.cityId.toUpperCase()} · ${map.theme==="premium"?"PREMIUM DISTRICT":map.theme==="coast"?"COAST DISTRICT":"LOCAL DISTRICT"}`;
  $("#worldMapTitle").textContent=map.name;$("#worldMapSubtitle").textContent=map.subtitle;
  const transport=TRANSPORT_OPTIONS.find(option=>option.id===world.transport)??TRANSPORT_OPTIONS[0];
  $("#worldClock").textContent=`${formatNightTime(night.minutes)} · ${getWeekdayName(state.day)}`;$("#worldTransport").textContent=`${transport.icon} ${transport.name}${world.transportConfirmed?"":" 선택 필요"}`;
  const canvas=$("#worldMapCanvas");canvas.dataset.theme=map.theme;canvas.dataset.district=map.id;
  const discoveredIds=world.discoveredLocations.filter(id=>map.locations.some(location=>location.id===id)).sort().join(",");
  const layerKey=`${map.id}:${discoveredIds}:${state.partner?.name??""}`;
  if(canvas.dataset.layerKey!==layerKey){
    canvas.dataset.layerKey=layerKey;
    $("#worldScenery").innerHTML=getWorldSceneryMarkup(map);
    $("#worldRoadLayer").innerHTML=getRoadCells(map).map(cell=>`<i class="world-road-cell" style="--map-x:${cell.x/(map.width-1)*100}%;--map-y:${cell.y/(map.height-1)*100}%"></i>`).join("");
    $("#worldLocationLayer").innerHTML=map.locations.map(location=>`<button class="world-location ${world.discoveredLocations.includes(location.id)?"discovered":""}" type="button" data-world-location="${escapeHtml(location.id)}" style="--map-x:${location.x/(map.width-1)*100}%;--map-y:${location.y/(map.height-1)*100}%"><span>${location.icon}</span><b>${escapeHtml(getWorldLocationName(location))}</b><small>${escapeHtml(location.category)}</small></button>`).join("");
  }
  const player=$("#worldPlayer");player.style.setProperty("--map-x",String(world.x/(map.width-1)));player.style.setProperty("--map-y",String(world.y/(map.height-1)));player.dataset.transport=world.transport;player.dataset.archetype=state.player?.archetypeId??"balanced";$("#worldPlayerName").textContent=state.player?.name??"나";
  $("#worldPlayerSprite").src=state.player?.mapImage??"assets/characters/map/PLAYER_BALANCED.png";
  const nearby=getNearbyLocation(world);const enter=$("#enterLocationButton");
  if(nearby){$("#nearbyLocation").innerHTML=`<b>${escapeHtml(nearby.name)}</b><span>${escapeHtml(nearby.description)}</span>`;enter.disabled=false;enter.textContent=nearby.category==="home"?"귀가하기":"장소 입장";enter.dataset.locationId=nearby.id;}
  else{$("#nearbyLocation").innerHTML="<b>동네를 둘러보세요</b><span>장소 가까이 이동하면 입장할 수 있습니다.</span>";enter.disabled=true;enter.textContent="장소 입장";delete enter.dataset.locationId;}
  if(wasHidden)requestAnimationFrame(()=>canvas.focus({preventScroll:true}));
}

function openWorldMap() {
  const home=getPlayerHomeProfile(state.player?.archetypeId);const map=WORLD_MAPS[home.districtId];
  state.world.mode="district";state.world.cityId="seoul";state.world.districtId=home.districtId;
  if(!Number.isFinite(state.world.x)||!Number.isFinite(state.world.y)){state.world.x=map.start.x;state.world.y=map.start.y;}
  SaveManager.save(state);renderWorldMap();
  if(!state.world.transportConfirmed)setTimeout(()=>openTransportSelector(true),0);
}

function returnToNightHome() { state.world.mode="home";SaveManager.save(state);renderNightHome(); }

function resetWorldForNextDay() {
  if(!state.world)return;
  const home=getPlayerHomeProfile(state.player?.archetypeId);
  const map=WORLD_MAPS[home.districtId]??WORLD_MAPS.dongsu;
  state.world.mode="home";
  state.world.cityId=map.cityId;
  state.world.districtId=map.id;
  state.world.x=map.start.x;
  state.world.y=map.start.y;
  state.world.transport=state.world.ownedVehicleId&&state.player?.archetypeId==="wealthy"?"car":"walk";
  state.world.transportConfirmed=Boolean(state.world.ownedVehicleId&&state.player?.archetypeId==="wealthy");
}

function payForTransport(option,cost=option.cost,minutes=option.minutes,label=option.name) {
  if(state.money<cost)return {ok:false,reason:`${option.name} 이용에 필요한 돈이 부족해요.`};
  const timeResult=spendNightTime(state,minutes,`${label} 이동`);
  if(!timeResult.ok)return timeResult;
  applyEffects(state,{money:-cost,...(option.effects??{})});
  if(cost>0)appendTransaction(state,{category:"transport",label:`${label} 이동`,amount:-cost});
  return {ok:true,time:timeResult.time};
}

function getWorldSceneryMarkup(map) {
  const labels={premium:"SEOUL · RIVER CITY",coast:"BUSAN · COASTAL NIGHT",romantic:"YEONHUI · HER NEIGHBORHOOD",nightlife:"HONGDAE · NIGHT LIFE",fitness:"SEONGSU · ACTIVE CITY",amusement:"JAMSIL · DREAM LAND",shopping:"MYEONGDONG · SHOPPING CITY",landmark:"NAMSAN · K TOWER",local:"DONGSU · OLD TOWN"};
  return `<span class="map-landmark-label">${labels[map.theme]??labels.local}</span>`;
}

function getWorldLocationName(location) {
  return location.category==="girlfriend-home"?`${state.partner?.name??"여자친구"}의 집`:location.name;
}

function finishWorldMove(option,result,cost=option.cost,label=option.name) {
  const payment=payForTransport(option,cost,option.minutes,label);
  if(!payment.ok){toast(payment.reason);return false;}
  const nearby=getNearbyLocation(state.world),arrived=getNearbyLocation(state.world,.25);
  const discovered=nearby&&!state.world.discoveredLocations.includes(nearby.id);
  if(discovered)state.world.discoveredLocations.push(nearby.id);
  SaveManager.save(state);renderWorldMap();
  toast(`${option.name} · ${result.movedSteps??"바로"}칸 · ${option.minutes}분${cost?` · ${money(cost)}`:" · 무료"}${discovered?` · ${nearby.name} 발견`:""}`);
  if(arrived)setTimeout(()=>openWorldLocation(arrived.id),180);
  return true;
}

function moveOnWorldMap(dx,dy) {
  if(!state.world.transportConfirmed){openTransportSelector(true);return;}
  const option=TRANSPORT_OPTIONS.find(item=>item.id===state.world.transport)??TRANSPORT_OPTIONS[0];
  if(option.fastTravel){openTransportDestination(option);return;}
  const preview=structuredClone(state.world),result=moveWorldPlayer(preview,dx,dy,option.steps);
  if(!result.moved){toast("길을 따라 이동해 주세요.");return;}
  if(state.money<option.cost){toast(`${option.name} 이용에 필요한 돈이 부족해요.`);return;}
  const night=ensureNightState(state);if(night.minutes+option.minutes>26*60){toast("너무 늦어서 오늘은 더 이동할 수 없어요.");return;}
  state.world.x=preview.x;state.world.y=preview.y;
  finishWorldMove(option,result);
}

function handleWorldMapKeydown(event) { const moves={ArrowUp:[0,-1],w:[0,-1],W:[0,-1],ArrowDown:[0,1],s:[0,1],S:[0,1],ArrowLeft:[-1,0],a:[-1,0],A:[-1,0],ArrowRight:[1,0],d:[1,0],D:[1,0]};const move=moves[event.key];if(!move||!$("#modal").classList.contains("hidden"))return;event.preventDefault();moveOnWorldMap(...move); }

function handleWorldMoveClick(event) { const button=event.target.closest("[data-world-move]");if(!button)return;const [dx,dy]=button.dataset.worldMove.split(",").map(Number);moveOnWorldMap(dx,dy); }

function handleWorldMapPointer(event) {
  if(event.pointerType==="mouse"&&event.button!==0)return;
  if(!$("#modal").classList.contains("hidden"))return;
  const canvas=event.currentTarget,rect=canvas.getBoundingClientRect();
  const targetX=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
  const targetY=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
  const map=WORLD_MAPS[state.world.districtId]??WORLD_MAPS.dongsu;
  const playerX=state.world.x/(map.width-1),playerY=state.world.y/(map.height-1);
  const deltaX=targetX-playerX,deltaY=targetY-playerY;
  if(Math.abs(deltaX)<.025&&Math.abs(deltaY)<.035)return;
  event.preventDefault();
  if(Math.abs(deltaX)>=Math.abs(deltaY))moveOnWorldMap(deltaX>0?1:-1,0);
  else moveOnWorldMap(0,deltaY>0?1:-1);
}

function openTransportSelector(required=false) {
  const current=state.world.transport;
  const cards=TRANSPORT_OPTIONS.map(option=>{const locked=option.requiresVehicle&&!state.world.ownedVehicleId;return `<button class="transport-card ${current===option.id?"selected":""}" data-world-transport="${option.id}" type="button" ${locked?"disabled":""}><span>${option.icon}</span><b>${escapeHtml(option.name)}</b><small>${escapeHtml(option.description)}</small><em>${locked?"자동차 미보유":option.cost?`${money(option.cost)} / 1회`:"무료"}</em></button>`;}).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">MOVE STYLE</span><h2>이동수단 선택</h2><p>${required?"지도에서 이동하기 전에 이용할 수단을 선택해 주세요.":"이동수단에 따라 지도 위 캐릭터 표시가 달라집니다."}</p><div class="transport-grid">${cards}</div>`;$("#modal").classList.add("transport-modal-active");openModal();
  document.querySelectorAll("[data-world-transport]:not(:disabled)").forEach(button=>button.addEventListener("click",()=>{if(button.dataset.worldTransport==="subway"&&getNearbyLocation(state.world)?.category!=="transport"){toast("지하철은 역 가까이에서 이용할 수 있어요.");return;}const result=selectWorldTransport(state.world,button.dataset.worldTransport);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);closeModal();renderWorldMap();toast(`${result.option.name} 이동으로 변경했습니다.`);if(result.option.fastTravel)setTimeout(()=>openTransportDestination(result.option),0);}));
}

function openTransportDestination(option) {
  const currentMap=WORLD_MAPS[state.world.districtId]??WORLD_MAPS.dongsu;
  if(option.id==="subway"&&getNearbyLocation(state.world)?.category!=="transport"){toast("지하철은 역 가까이에서 이용할 수 있어요.");openTransportSelector();return;}
  const destinations=option.fastTravel==="station"
    ? Object.values(WORLD_MAPS).filter(map=>map.cityId===currentMap.cityId).flatMap(map=>map.locations.filter(location=>location.category==="transport").map(location=>({...location,mapId:map.id,mapName:map.name})))
    : currentMap.locations.filter(location=>location.category!=="home").map(location=>({...location,mapId:currentMap.id,mapName:currentMap.name}));
  const cards=destinations.map(destination=>{const distance=destination.mapId===state.world.districtId?Math.abs(destination.x-state.world.x)+Math.abs(destination.y-state.world.y):8;const fare=option.id==="taxi"?option.cost+distance*1200:option.cost;return `<button class="transport-card" data-transport-destination="${escapeHtml(destination.id)}" data-map-id="${escapeHtml(destination.mapId)}" data-fare="${fare}" type="button"><span>${destination.icon}</span><b>${escapeHtml(destination.name)}</b><small>${escapeHtml(destination.mapName)} · ${option.minutes}분</small><em>${money(fare)}</em></button>`;}).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">${escapeHtml(option.name.toUpperCase())} DESTINATION</span><h2>${option.icon} 목적지 선택</h2><p>${option.id==="subway"?"이동할 역을 선택하세요. 역에서 역으로 빠르게 이동합니다.":"원하는 장소를 선택하세요. 거리에 따라 요금이 달라집니다."}</p><div class="transport-grid">${cards}</div>`;$("#modal").classList.add("transport-modal-active");openModal();
  document.querySelectorAll("[data-transport-destination]").forEach(button=>button.addEventListener("click",()=>{
    const map=WORLD_MAPS[button.dataset.mapId],destination=map?.locations.find(item=>item.id===button.dataset.transportDestination);if(!destination)return;
    const fare=Number(button.dataset.fare);const payment=payForTransport(option,fare,option.minutes,`${option.name} · ${destination.name}`);if(!payment.ok){toast(payment.reason);return;}
    state.world.cityId=map.cityId;state.world.districtId=map.id;state.world.x=destination.x;state.world.y=destination.y;
    if(!state.world.discoveredLocations.includes(destination.id))state.world.discoveredLocations.push(destination.id);
    state.world.travelHistory.push({cityId:map.cityId,districtId:map.id,transport:option.id,destinationId:destination.id,day:state.day});
    SaveManager.save(state);closeModal();renderWorldMap();toast(`${option.name} · ${destination.name} 도착 · ${option.minutes}분 · ${money(fare)}`);setTimeout(()=>openWorldLocation(destination.id),180);
  }));
}

function openWorldAtlas(viewId=state.world.atlasView||"nationwide") {
  const view=WORLD_ATLAS[viewId]??WORLD_ATLAS.nationwide;state.world.atlasView=view.id;
  const tabs=Object.values(WORLD_ATLAS).map(item=>`<button data-atlas-view="${item.id}" class="${item.id===view.id?"selected":""}" type="button">${item.name}</button>`).join("");
  const homeDistrict=getPlayerHomeProfile(state.player?.archetypeId).districtId;
  const panels=view.id==="nationwide"
    ? `<div class="atlas-korea"><span>SEOUL</span><i></i><span>BUSAN</span></div><div class="atlas-destination-grid"><button data-atlas-view="seoul" type="button"><b>서울</b><small>동수동 · 금수동 · ${escapeHtml(state.partner.name)}의 동네</small></button><button data-atlas-view="busan" type="button"><b>부산</b><small>여행 생활권 · 해운동</small></button></div>`
    : view.id==="seoul"
      ? `<div class="atlas-city-card seoul"><b>서울 생활 지도</b><p>원하는 동네나 번화가로 바로 이동할 수 있습니다.</p><div class="atlas-district-grid"><button data-travel-district="${homeDistrict}" type="button">🏠 내 동네</button><button data-travel-district="yeonhui" type="button">💗 ${escapeHtml(state.partner.name)}의 동네</button><button data-travel-district="hongdae" type="button">🪩 홍대 클럽거리</button><button data-travel-district="seongsu" type="button">🏋️ 성수 피트니스</button><button data-travel-district="jamsil" type="button">🎡 잠실 놀이동산</button><button data-travel-district="myeongdong" type="button">🏬 명동 백화점거리</button><button data-travel-district="namsan" type="button">🗼 남산 K타워</button></div></div>`
      : `<div class="atlas-city-card busan"><b>부산 여행 지도</b><p>해운대·광안리·서면을 잇는 바다 여행 지역입니다.</p><button data-travel-city="busan" type="button">부산 해운동으로 이동</button></div>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">WORLD ATLAS</span><h2>${escapeHtml(view.name)} 지도</h2><p>${escapeHtml(view.subtitle)}</p><nav class="atlas-tabs" aria-label="지도 범위">${tabs}</nav>${panels}`;openModal();
  document.querySelectorAll("[data-atlas-view]").forEach(button=>button.addEventListener("click",()=>openWorldAtlas(button.dataset.atlasView)));
  document.querySelectorAll("[data-travel-district]").forEach(button=>button.addEventListener("click",()=>{travelToCity(state.world,"seoul",button.dataset.travelDistrict);SaveManager.save(state);closeModal();renderWorldMap();toast("서울 생활권으로 이동했습니다.");}));
  document.querySelectorAll("[data-travel-city]").forEach(button=>button.addEventListener("click",()=>{const result=travelToCity(state.world,button.dataset.travelCity,homeDistrict);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);closeModal();renderWorldMap();toast(`${result.map.name}으로 이동했습니다.`);}));
}

function getVenueMenu(location) {
  const menus={korean:"김밥 · 라면 · 순댓국 · 국밥 · 제육쌈밥",japanese:"라멘 · 돈부리 · 돈가스 · 스시",chinese:"짜장면 · 짬뽕 · 딤섬 · 마라탕",western:"파스타 · 스테이크 · 디저트",diet:"샐러드 · 포케 · 단백질 식단",cafe:"커피 · 차 · 디저트",bar:"맥주 · 하이볼 · 안주",club:"춤추기 · 공연 감상 · 새로운 사람 만나기",gym:"운동 · 트레이닝 · 체력 관리",amusement:"놀이기구 · 사진 · 퍼레이드",landmark:"전망 감상 · 사진 · 기념품",shopping:"패션 · 선물 · 생활용품",culture:"전시 관람 · 기념품",date:"산책 · 대화 · 사진 남기기","girlfriend-home":"여자친구와 대화하고 함께 시간을 보낸다"};return menus[location.category]??"주변을 둘러보고 새로운 이야기를 발견한다.";
}

const WORLD_EVENT_MAP_IMAGES={local:"assets/maps/dongsu-25d.jpg",premium:"assets/maps/gangnam-25d.jpg",coast:"assets/maps/busan-25d.jpg",romantic:"assets/maps/yeonhui-girlfriend-25d.png",nightlife:"assets/maps/hongdae-nightlife-25d.png",fitness:"assets/maps/seongsu-fitness-25d.png",amusement:"assets/maps/jamsil-park-25d.png",shopping:"assets/maps/myeongdong-shopping-25d.png",landmark:"assets/maps/namsan-ktower-25d.png"};
const WORLD_EVENT_COPY={korean:["따뜻한 음식 냄새가 두 사람의 긴장을 조금 누그러뜨렸다.","무엇을 먹으며 어떤 이야기를 나눌까?"],japanese:["조용한 식당 안에서 서로의 하루를 돌아볼 시간이 생겼다.","오늘 대화를 어떻게 시작할까?"],chinese:["분주한 식당의 소리 사이로 둘만의 대화가 이어졌다.","이 시간을 어떻게 보낼까?"],western:["차분한 조명 아래 평소보다 진지한 이야기를 꺼낼 수 있을 것 같다.","어떤 마음을 먼저 전할까?"],diet:["건강한 식사를 고르며 서로의 생활 습관을 자연스럽게 이야기했다.","서로에게 어떤 제안을 할까?"],cafe:["따뜻한 음료가 놓이자 미뤄 둔 이야기를 꺼내기 좋은 분위기가 됐다.","무엇부터 이야기할까?"],bar:["밤의 소음과 조명 속에서 평소보다 솔직한 말이 나올 것 같다.","오늘은 어떤 태도를 선택할까?"],club:["음악과 조명 속에서 새로운 사람들과 시선이 오갔다.","연인과 이 시간을 어떻게 보낼까?"],gym:["함께 몸을 움직이며 서로의 속도와 방식을 확인했다.","오늘 운동을 어떻게 이어 갈까?"],amusement:["화려한 불빛과 놀이기구가 평범한 밤을 특별하게 만들었다.","어떤 추억을 먼저 만들까?"],landmark:["도시의 불빛이 내려다보이는 곳에서 두 사람의 미래가 가까이 느껴졌다.","이 순간 어떤 말을 전할까?"],shopping:["여러 물건을 비교하며 취향과 소비 기준의 차이가 드러났다.","무엇을 기준으로 고를까?"],culture:["작품과 음악을 함께 보며 서로 몰랐던 취향을 발견했다.","발견한 마음을 어떻게 표현할까?"],date:["천천히 걷는 동안 말하지 못했던 이야기가 떠올랐다.","어떤 대화를 시작할까?"],transport:["다음 목적지로 향하기 전 잠시 숨을 고를 시간이 생겼다.","이동하기 전에 무엇을 할까?"]};

function getHaeunHomeMapEvent(){if(state.partner?.heroineId!=="haeun")return null;const id=state.trust<=700?"situation-haeun-home-outside-talk":state.trust<=900?"situation-haeun-home-tea-talk":"situation-haeun-home-meal";return SITUATION_EVENTS.find(event=>event.id===id)??null;}
function getWorldEventImage(map,event=null,location=null){return event?.image?.intro??getMapLocationAsset(location?.id)??WORLD_EVENT_MAP_IMAGES[map.theme]??WORLD_EVENT_MAP_IMAGES.local;}
function getEveningPartnerPortrait(){if(ensureNightState(state).minutes<19*60)return "";return state.partner?.heroineId==="haeun"?HAEUN_PROFILE_PORTRAITS.calm:HEROINE_PROFILES.find(profile=>profile.id===state.partner?.heroineId)?.referenceImage??"";}
function renderWorldEventMedia(image,title,characterImage=""){return `<div class="world-event-media"><img class="world-event-image" src="${escapeHtml(image)}" alt="${escapeHtml(title)}">${characterImage?`<img class="world-event-character" src="${escapeHtml(characterImage)}" alt="${escapeHtml(state.partner?.name??"여자친구")}">`:""}</div>`;}
function finishWorldEventLayer(){$("#modal").classList.remove("world-event-active");closeModal();renderWorldMap();}
function showWorldEventResult({map,image,title,response,effects={},mbtiLabel="",characterImage=""}){const labels={affection:"호감도",trust:"신뢰도",excitement:"흥미도",stress:"스트레스",energy:"에너지",fatigue:"피로",social:"사회성",confidence:"자신감",relationshipStress:"관계 스트레스"};const changes=Object.entries(effects).filter(([,value])=>Number(value)).map(([key,value])=>`<span class="${value>=0?"up":"down"}">${escapeHtml(labels[key]??key)} ${value>=0?"+":""}${Math.round(value)}</span>`).join("");$("#modalContent").innerHTML=`<article class="world-event-layer">${renderWorldEventMedia(image,title,characterImage)}<div class="world-event-copy"><span class="eyebrow">${escapeHtml(map.name)} · EVENT RESULT</span><h2>${escapeHtml(title)}</h2><p class="world-event-response">${escapeHtml(response)}</p>${mbtiLabel?`<p class="world-event-mbti">${escapeHtml(mbtiLabel)}에 맞는 반응이 추가로 반영됐습니다.</p>`:""}<div class="world-event-effects">${changes||"<span>특별한 수치 변화 없음</span>"}</div><button id="worldEventClose" class="primary-button" type="button">확인 · 지도로 돌아가기</button></div></article>`;$("#worldEventClose").addEventListener("click",finishWorldEventLayer);}

function openWorldEventLayer(map,location){
  const haeunEvent=location.category==="girlfriend-home"?getHaeunHomeMapEvent():null,image=getWorldEventImage(map,haeunEvent,location),characterImage=getEveningPartnerPortrait();
  const [message,question]=haeunEvent?[haeunEvent.message,haeunEvent.question]:(WORLD_EVENT_COPY[location.category]??[location.description,"이곳에서 무엇을 할까?"]);
  const choices=haeunEvent?.choices??[{id:"talk",label:"함께 둘러보며 솔직하게 대화한다",response:"장소를 천천히 둘러보며 서로의 생각을 편하게 나눴다.",effects:{affection:4,trust:3}},{id:"enjoy",label:"이곳에서 할 수 있는 활동을 즐긴다",response:"복잡한 생각은 잠시 내려놓고 지금의 경험을 함께 즐겼다.",effects:{excitement:6,stress:-3}},{id:"remember",label:"사진과 작은 추억을 남긴다",response:"평범한 방문이 나중에도 떠올릴 수 있는 두 사람의 기억이 됐다.",effects:{affection:5,confidence:2}}];
  $("#modal").classList.add("world-event-active");$("#modalContent").innerHTML=`<article class="world-event-layer">${renderWorldEventMedia(image,`${getWorldLocationName(location)} 이벤트`,characterImage)}<div class="world-event-copy"><span class="eyebrow">${escapeHtml(map.name)} · LOCATION EVENT</span><h2>${location.icon} ${escapeHtml(getWorldLocationName(location))}</h2><p>${escapeHtml(message)}</p><strong class="world-event-question">${escapeHtml(question)}</strong><div class="world-event-choices">${choices.map(choice=>`<button type="button" data-world-event-choice="${escapeHtml(choice.id)}">${escapeHtml(choice.label)}</button>`).join("")}</div></div></article>`;
  document.querySelectorAll("[data-world-event-choice]").forEach(button=>button.addEventListener("click",()=>{const choice=choices.find(item=>item.id===button.dataset.worldEventChoice);if(!choice)return;let effects=choice.effects??{},response=choice.response??choice.memory,mbtiLabel="";if(haeunEvent){const result=resolveSituationEventChoice(state,haeunEvent,choice.id);if(!result)return;effects=result.effects;response=choice.response??choice.memory;mbtiLabel=result.mbtiAdjustment?.label??"";}else applyEffects(state,effects);recordMemory(state,{type:"map-event",summary:`${getWorldLocationName(location)}: ${choice.label}`,importance:3,tags:["지도",map.id,location.id,choice.id]});state.logs.push({time:`DAY ${state.day} · MAP EVENT`,text:`${getWorldLocationName(location)} — ${choice.label}`});SaveManager.save(state);showWorldEventResult({map,image,title:getWorldLocationName(location),response,effects,mbtiLabel,characterImage});}));
}

function hasLateNightSpecialEvent(location) {
  if(location.category==="girlfriend-home"&&getPendingLateNightInvitation(state))return true;
  if(location.category==="girlfriend-home"&&getHaeunHomeMapEvent())return true;
  const activeEvent=state.eventRuntime?.activeEvent;
  return Boolean(location.lateNightEventId||(activeEvent&&[activeEvent.locationId,activeEvent.scene?.locationId,activeEvent.event?.locationId].includes(location.id)));
}

function openClosedVenuePopup(map,location) {
  const locationName=getWorldLocationName(location),time=formatNightTime(ensureNightState(state).minutes);
  $("#modalContent").innerHTML=`<span class="eyebrow">${escapeHtml(map.name)} · CLOSED · ${escapeHtml(time)}</span><h2>🌙 오늘 영업은 끝났어요</h2><p>${escapeHtml(locationName)}은 이미 문을 닫았습니다.</p><div class="venue-menu-preview"><small>밤 10시 이후 이용 안내</small><strong>대부분의 카페·식당·상점은 영업이 종료됩니다. 술집과 심야 장소는 계속 이용할 수 있으며, 특별 이벤트가 발생한 장소는 예외적으로 입장할 수 있습니다.</strong></div><button id="closedVenueConfirm" class="primary-button" type="button">확인 · 지도로 돌아가기</button>`;
  openModal();
  $("#closedVenueConfirm").addEventListener("click",()=>{closeModal();renderWorldMap();});
}

function openWorldLocation(locationId) {
  const id=locationId??$("#enterLocationButton").dataset.locationId;if(!id)return;const map=WORLD_MAPS[state.world.districtId];const location=map.locations.find(item=>item.id===id);if(!location)return;
  const locationName=getWorldLocationName(location),home=location.category==="home";
  if(!home&&!isWorldLocationOpen(location,ensureNightState(state).minutes,{hasSpecialEvent:hasLateNightSpecialEvent(location)})){openClosedVenuePopup(map,location);return;}
  $("#modalContent").innerHTML=`<span class="eyebrow">${escapeHtml(map.name)} · ARRIVAL</span><h2>${location.icon} ${escapeHtml(locationName)}</h2><p>${escapeHtml(location.description)}</p>${home?"":`<div class="venue-menu-preview"><small>이곳에서 할 수 있는 일</small><strong>${escapeHtml(getVenueMenu(location))}</strong></div>`}<p class="venue-visit-question">${escapeHtml(locationName)}에 방문하시겠습니까?</p><div class="venue-confirm-actions"><button id="visitLocationCancel" type="button">아니오</button><button id="visitLocationConfirm" class="primary-button" type="button">예${home?" · 귀가하기":" · 방문하기"}</button></div>`;openModal();
  $("#visitLocationCancel").addEventListener("click",closeModal);
  $("#visitLocationConfirm").addEventListener("click",()=>{if(home){closeModal();returnToNightHome();return;}const result=spendNightTime(state,20,`${location.name} 방문`);if(!result.ok){toast(result.reason);return;}discoverLocation(state.world,location.id,state.day);state.logs.push({time:`DAY ${state.day} · MAP`,text:`${map.name}의 ${location.name}에 방문했다.`});if(location.category==="girlfriend-home"&&getPendingLateNightInvitation(state)){completeLateNightInvitationVisit(map,location);return;}const locationEvent=rollLocationSituationEvent(state,location);SaveManager.save(state);if(locationEvent){closeModal();$(".play-panel").classList.remove("hidden");$("#nightHome").classList.add("hidden");$("#worldMap").classList.add("hidden");openEventScene(locationEvent);return;}openWorldEventLayer(map,location);});
}

function checkLateNightInvitation() {
  const result=maybeTriggerLateNightInvitation(state);
  if(!result.checked)return result;
  if(result.triggered){
    state.logs.push({time:`DAY ${state.day} · MESSAGE`,text:`${state.partner.name}: “${result.invitation.message}”`});
    toast(`${state.partner.name}에게 늦은 밤 메시지가 왔어요.`);
  }
  SaveManager.save(state);
  return result;
}

function completeLateNightInvitationVisit(map,location) {
  const invitation=completeLateNightInvitation(state,ensureNightState(state).minutes);
  if(!invitation)return;
  const effects={affection:18,trust:14,relationshipStress:-6};
  applyEffects(state,effects);
  recordMemory(state,{type:"late-night-invitation",summary:`${state.partner.name}의 힘들었던 하루를 문 앞에서 들어 주었다.`,importance:5,tags:["연인","심야","위로","여자친구의 집"]});
  state.logs.push({time:`DAY ${state.day} · SPECIAL EVENT`,text:`늦은 밤 ${state.partner.name}의 집으로 찾아가 힘들었던 하루를 곁에서 들어 주었다. 호감도 +18 · 신뢰도 +14`});
  SaveManager.save(state);
  closeModal();
  $(".play-panel").classList.remove("hidden");$("#nightHome").classList.add("hidden");$("#worldMap").classList.add("hidden");
  const presentation={...resolvePhasePresentation(state,"night"),backgroundId:`late-night-${location.id}`,backgroundUrl:getWorldEventImage(map,null,location),characterId:"girlfriend",expressionId:"worried",poseId:"standing"};
  startImmersiveScene({
    id:invitation.id,
    type:"late-night-invitation",
    presentation,
    sequence:[
      {type:"narration",text:`밤늦게 ${state.partner.name}의 집 앞에 도착했다.`},
      {type:"characterEnter",expressionId:"worried"},
      {type:"dialogue",speaker:state.partner.name,text:"와줘서 고마워. 정말 와줄 줄 몰랐어.",expressionId:"worried"},
      {type:"dialogue",speaker:state.partner.name,text:"오늘 너무 힘들었어. 혼자 있으니까 네가 더 보고 싶었어.",expressionId:"worried"},
      {type:"dialogue",speaker:state.player?.name??"나",text:"잘 왔어. 지금은 아무 걱정 말고 천천히 이야기해. 내가 곁에 있을게."},
      {type:"expressionChange",expressionId:"smile"},
      {type:"dialogue",speaker:state.partner.name,text:"응… 네가 와줘서 이제 조금 괜찮아졌어.",expressionId:"smile"},
      {type:"narration",text:"힘들었던 하루를 함께 나누며 두 사람의 호감도와 신뢰도가 깊어졌다. · 호감도 +18 · 신뢰도 +14"},
      {type:"sceneEnd"}
    ]
  });
}

function openDailyReport() {
  const rows=getDailyReport(state);
  const statRows=rows.filter(row=>!["affection","trust"].includes(row.key)).map(row=>`<div class="report-row"><span>${row.label}</span><b>${row.key==="money"?money(row.before):row.before} → ${row.key==="money"?money(row.after):row.after}</b><em class="${row.delta>=0?'up':'down'}">${row.delta>=0?'+':''}${row.key==="money"?money(row.delta):row.delta}</em></div>`).join("");
  const relation=rows.filter(row=>["affection","trust"].includes(row.key));
  const relationRows=relation.map(row=>`<div class="report-row"><span>${row.label}</span><b>${row.before} → ${row.after}</b><em class="${row.delta>=0?'up':'down'}">${row.delta>=0?'▲':'▼'} ${Math.abs(row.delta)}</em></div>`).join("");
  const mood=(state.affection-(state.dayStartSnapshot?.affection??state.affection))+(state.trust-(state.dayStartSnapshot?.trust??state.trust));
  const ledger=(state.economyLedger??[]).filter(entry=>entry.day===state.day).map(entry=>`<li><span>${escapeHtml(entry.label)}</span><b>${entry.amount>=0?'+':''}${money(entry.amount)}</b></li>`).join("")||"<li><span>별도 거래 없음</span><b>—</b></li>";
  const traits=getVisibleTraitRows(state).map(row=>`<div class="report-row"><span>${escapeHtml(row.name)}</span><b>${escapeHtml(row.revealed?row.value:row.hint||"아직 잘 모르겠다")}</b>${row.revealed?'<em class="up">알아냄</em>':'<em>???</em>'}</div>`).join("");
  $("#modalContent").innerHTML=`<article class="daily-report"><span class="eyebrow">DAY ${state.day} · ${getWeekdayName(state.day)} REPORT</span><h2>오늘 하루의 기록</h2><p>${mood>8?`${withParticle(state.partner.name,"과","와")} 조금 더 가까워진 하루였어요.`:mood<0?`${state.partner.name}의 마음에 조금 신경 쓰이는 것이 남았어요.`:"평온하지만 여운이 남는 하루였어요."}</p><h3>생활과 성장</h3><div class="report-list">${statRows}</div><h3>${escapeHtml(withParticle(state.partner.name,"과","와"))}의 관계</h3><div class="report-list">${relationRows}</div><h3>지금까지 알아낸 ${escapeHtml(state.partner.name)}</h3><div class="report-list">${traits}</div><h3>오늘의 수입과 지출</h3><ul class="report-ledger">${ledger}</ul></article>`;
  openModal();
}

function openTodayLog() {
  const rows=getTodayLogs().map(entry=>`<div class="history-entry"><small>${escapeHtml(entry.time)}</small><p>${escapeHtml(entry.text)}</p></div>`).join("")||"<p>오늘 기록이 아직 없어요.</p>";
  $("#modal").classList.add("today-record-active");
  $("#modalContent").innerHTML=`<article class="today-record-popup"><header><span class="eyebrow">TODAY'S RECORD</span><h2>DAY ${state.day} · ${getWeekdayName(state.day)} 오늘의 기록</h2><p>오늘 있었던 선택과 사건을 시간순으로 확인할 수 있습니다.</p></header><div class="dialogue-history">${rows}</div><button id="todayRecordClose" class="primary-button" type="button">닫기</button></article>`;openModal();
  $("#todayRecordClose").addEventListener("click",closeModal);
}

function openSns() {
  const close=state.affection>=650;
  $("#modalContent").innerHTML=`<article class="sns-feed"><span class="eyebrow">SOCIAL FEED · NOW</span><h2>${escapeHtml(state.partner.name)}의 오늘</h2><div class="sns-post"><b>${escapeHtml(state.partner.name)} ♥</b><p>${close?'“오늘은 오래 기억하고 싶은 날 🤍”':'“길었던 하루. 이제야 조금 쉬는 중.”'}</p><small>♥ ${87+state.day*4} · 댓글 ${2+state.day%5}</small></div><p class="sns-hint">${state.npcs?.some(npc=>npc.relationshipType==='rival')?'낯익은 계정이 좋아요를 남겼다. 누구인지 조금 신경 쓰인다.':'친구들의 평범한 밤이 피드에 흐르고 있다.'}</p></article>`;openModal();
}

function openSchedule() { const tomorrow=Math.min(30,state.day+1);$("#modalContent").innerHTML=`<span class="eyebrow">30 DAYS CALENDAR</span><h2>우리의 일정</h2><div class="schedule-card"><b>DAY ${state.day} · ${getWeekdayName(state.day)}</b><span>오늘의 일정을 마무리하는 중</span></div><div class="schedule-card"><b>DAY ${tomorrow} · ${getWeekdayName(tomorrow)}</b><span>내일의 선택은 아직 정해지지 않았어요.</span></div>`;openModal(); }

function openCgGallery(activeTab="photos") {
  const photos=state.cgCollection??[];
  const videos=state.videoCollection??[];
  const photoCards=photos.length?photos.map(entry=>`<button class="cg-card album-card" type="button" data-album-photo="${escapeHtml(entry.image)}" data-album-title="${escapeHtml(entry.title)}"><img src="${entry.image}" alt="${escapeHtml(entry.title)}" loading="lazy"><div><small>DAY ${entry.day}${entry.type==="action"?" · 함께한 행동":" · STORY"}</small><b>${escapeHtml(entry.title)}</b></div></button>`).join(""):`<p class="album-empty">여자친구와 함께 행동하거나 중요한 장면을 보면 사진이 저장됩니다.</p>`;
  const videoCards=videos.length?videos.map((entry,index)=>`<article class="cg-card video-album-card"><video src="${entry.video}" ${entry.poster?`poster="${entry.poster}"`:""} controls playsinline preload="metadata" aria-label="${escapeHtml(entry.title)} 영상"></video><div><small>DAY ${entry.day} · HAPPY VIDEO</small><b>${escapeHtml(entry.title)}</b><button class="album-video-expand" type="button" data-album-video="${index}">크게 보기</button></div></article>`).join(""):`<p class="album-empty">여자친구와 행복한 행동 중 영상이 등장하면 이곳에 저장됩니다.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">PHOTO ALBUM</span><h2>우리의 포토 앨범</h2><p>여자친구와 함께한 사진 ${photos.length}장 · 행복한 시간 영상 ${videos.length}개</p><div class="album-tabs" role="tablist"><button type="button" data-album-tab="photos" class="${activeTab==="photos"?"active":""}">사진 앨범 · ${photos.length}</button><button type="button" data-album-tab="videos" class="${activeTab==="videos"?"active":""}">동영상 앨범 · ${videos.length}</button></div><div class="cg-gallery album-panel">${activeTab==="videos"?videoCards:photoCards}</div>`;openModal();
  document.querySelectorAll("[data-album-tab]").forEach(button=>button.addEventListener("click",()=>openCgGallery(button.dataset.albumTab)));
  document.querySelectorAll("[data-album-photo]").forEach(button=>button.addEventListener("click",()=>{$("#modalContent").innerHTML=`<button class="album-back" type="button">← 포토 앨범</button><figure class="album-photo-viewer"><img src="${button.dataset.albumPhoto}" alt="${escapeHtml(button.dataset.albumTitle)}"><figcaption>${escapeHtml(button.dataset.albumTitle)}</figcaption></figure>`;$(".album-back").addEventListener("click",()=>openCgGallery("photos"));}));
  document.querySelectorAll("[data-album-video]").forEach(button=>button.addEventListener("click",()=>openAlbumVideoLayer(videos[Number(button.dataset.albumVideo)])));
}

function closeAlbumVideoLayer(){const layer=document.querySelector(".album-video-layer");if(!layer)return;layer.querySelector("video")?.pause();layer.remove();}
function openAlbumVideoLayer(entry){if(!entry)return;closeAlbumVideoLayer();const layer=document.createElement("div");layer.className="album-video-layer";layer.setAttribute("role","dialog");layer.setAttribute("aria-modal","true");layer.setAttribute("aria-label",`${entry.title} 크게 보기`);layer.innerHTML=`<div class="album-video-stage"><button class="album-video-close" type="button" aria-label="영상 크게 보기 닫기">×</button><video src="${entry.video}" ${entry.poster?`poster="${entry.poster}"`:""} controls autoplay playsinline preload="auto" aria-label="${escapeHtml(entry.title)} 영상"></video><strong>${escapeHtml(entry.title)}</strong></div>`;document.body.append(layer);layer.querySelector(".album-video-close").addEventListener("click",closeAlbumVideoLayer);layer.addEventListener("click",event=>{if(event.target===layer)closeAlbumVideoLayer();});layer.querySelector(".album-video-close").focus();layer.querySelector("video").play().catch(()=>{});}

function openNightPc() {
  const workButton=isWeekend(state.day)?"":`<button data-pc-action="work">💼 야간 업무<small>수입 증가 · 스트레스 증가</small></button>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">MY COMPUTER · 60 MIN</span><h2>컴퓨터로 무엇을 할까?</h2><div class="pc-actions"><button data-pc-action="game">🎮 게임하기<small>스트레스 완화 · 피로 증가</small></button><button data-pc-action="study">📚 자기계발<small>업무 능력 증가 · 피로 증가</small></button>${workButton}</div>`;openModal();
  document.querySelectorAll("[data-pc-action]").forEach(button=>button.addEventListener("click",()=>{const id=button.dataset.pcAction,activity={game:{title:"게임하기",icon:"🎮",effects:{stress:-10,fatigue:8,energy:-5}},study:{title:"자기계발",icon:"📚",effects:{work:6,confidence:3,fatigue:9,energy:-7}},work:{title:"야간 업무",icon:"💼",effects:{money:50000,work:5,stress:10,fatigue:12,energy:-10}}}[id];if(!activity)return;const before=Object.fromEntries(Object.keys(activity.effects).map(key=>[key,state[key]??0])),startTime=formatNightTime(ensureNightState(state).minutes),result=spendNightTime(state,60,activity.title);if(!result.ok){toast(result.reason);return;}applyEffects(state,activity.effects);if(activity.effects.money)appendTransaction(state,{category:"night-work",label:"야간 업무",amount:activity.effects.money});const changes=Object.fromEntries(Object.keys(activity.effects).map(key=>[key,Math.round((state[key]??0)-before[key])]));SaveManager.save(state);render();showNightPcResult(activity,result,startTime,changes);}));
}

function showNightPcResult(activity,result,startTime,changes) {
  const labels={money:"보유 자산",stress:"스트레스",fatigue:"피로",energy:"체력",work:"업무 능력",confidence:"자신감"};
  const rows=Object.entries(changes).map(([key,value])=>`<div class="night-pc-stat ${value>0?'up':value<0?'down':'neutral'}"><span>${escapeHtml(labels[key]??key)}</span><b>${value>0?'+':''}${key==='money'?money(value):value}</b></div>`).join("");
  $("#modalContent").innerHTML=`<article class="night-pc-result"><span class="night-pc-result-icon" aria-hidden="true">${activity.icon}</span><small>MY COMPUTER · ACTIVITY RESULT</small><h2>${escapeHtml(activity.title)} 완료</h2><p>${startTime} → ${result.time} · 60분 사용</p><div class="night-pc-stat-list">${rows}</div><button id="nightPcResultConfirm" class="primary-button" type="button">수치 확인</button></article>`;
  openModal();
  $("#nightPcResultConfirm").addEventListener("click",closeModal);
}

function goToSleep() {
  const night=ensureNightState(state);
  $("#modalContent").innerHTML=`<span class="eyebrow">SLEEP · ${formatNightTime(night.minutes)}</span><h2>오늘은 이제 잘까?</h2><p>${night.minutes>=25*60?'늦은 시간이어서 내일 피곤할 수 있어요.':'오늘의 기록을 저장하고 다음 날로 넘어갑니다.'}</p><button id="sleepConfirm" class="primary-button" type="button">취침 · SAVE · NEXT DAY →</button>`;openModal();
  $("#sleepConfirm").addEventListener("click",()=>{if(!night.messagesRead){const importance=state.partner.personality.contactImportance;applyEffects(state,{affection:-Math.max(1,Math.round(importance/25)),trust:-Math.max(1,Math.round(importance/20))});state.logs.push({time:`DAY ${state.day} · MESSAGE`,text:`${state.partner.name}의 메시지를 확인하지 않고 잠들었다.`});}applyEffects(state,getLateSleepEffects(night.minutes));state.selected=actions.night.findIndex(action=>action.id==="early-sleep");SaveManager.save(state);closeModal();applyAction();});
}

function handleRoomAction(event) {
  const button=event.target.closest("[data-room-action]");if(!button)return;
  const handlers={phone:openGameMenu,pc:openNightPc,wardrobe:openInventory,report:openDailyReport,bed:goToSleep,exit:openWorldMap};handlers[button.dataset.roomAction]?.();
}

function selectAction(index) { state.selected = index; sound.play("select"); render(); scheduleAutoAdvance(); }
function handleActionGridClick(event) {
  event.stopPropagation();
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest(".action-card");
  if (!button || button.disabled) return;
  selectAction(Number(button.dataset.index));
}
function handleGirlfriendWardrobeClick(event) {
  const defaultButton=event.target.closest("[data-warehouse-default]");
  if(defaultButton&&state){
    for(const entry of state.inventory??[])if(entry.owner==="girlfriend"&&getItem(entry.itemId)?.category==="heroine-outfit")entry.equipped=false;
    if(state.girlfriendEquipment)delete state.girlfriendEquipment["heroine-outfit"];
    state.currentOutfit="default";
    state.logs.push({time:`DAY ${state.day} · OUTFIT`,text:`${state.partner.name} 의상 변경 · 기본 복장`});
    SaveManager.save(state);render();toast(`${state.partner.name} 기본 복장 착용`);return;
  }
  const button=event.target.closest("[data-warehouse-outfit]");
  if(!button||!state)return;
  const result=equipGirlfriendOutfit(state,button.dataset.warehouseOutfit);
  if(!result){toast("이 의상으로 갈아입을 수 없습니다.");return;}
  state.logs.push({time:`DAY ${state.day} · OUTFIT`,text:`${state.partner.name} 의상 변경 · ${result.item.name}`});
  SaveManager.save(state);render();toast(`${result.item.name} 착용 · 크로마키 영상 재생`);
}

function unlockSpecialOutfitEventIfEligible() {
  state.specialEvents??={};
  if(state.specialEvents.haeunSailorOutfitUnlocked||state.partner.heroineId!=="haeun")return false;
  const elegantDateCount=(state.actionHistory??[]).filter(entry=>entry.actionId==="dinner-date").length;
  if(elegantDateCount<10)return false;
  let instance=(state.inventory??[]).find(entry=>entry.itemId===HAEUN_SPECIAL_EVENT_OUTFIT.id&&entry.owner==="girlfriend");
  instance??=addItem(state,HAEUN_SPECIAL_EVENT_OUTFIT.id,"girlfriend","special-date-event");
  if(instance)equipGirlfriendOutfit(state,instance.instanceId);
  state.specialEvents.haeunSailorOutfitUnlocked=true;
  state.specialEvents.haeunSailorOutfitUnlockedDay=state.day;
  state.logs.push({time:`DAY ${state.day} · SPECIAL EVENT`,text:`${state.partner.name}가 나를 위해 특별한 이벤트 의상을 준비했다.`});
  return true;
}

function showSpecialOutfitEventPopup(continuation) {
  $("#modalContent").innerHTML=`<article class="special-outfit-event"><video src="assets/characters/girlfriend-special-event-sailor-2d_transparent.webm" autoplay loop muted playsinline aria-label="${escapeHtml(state.partner.name)} 특별 이벤트 의상 영상"></video><span class="eyebrow">SPECIAL DATE EVENT · 10 TIMES</span><h2>${escapeHtml(state.partner.name)}의 특별한 준비</h2><p>“오늘은 내가 준비했어. 너를 위해 특별한 이벤트를 준비했어.”</p><strong>이벤트 의상이 보관함에 추가되었습니다.</strong><button id="specialOutfitEventConfirm" class="primary-button" type="button">확인</button></article>`;
  openModal();
  $("#specialOutfitEventConfirm").addEventListener("click",()=>{closeModal();render();continuation?.();});
}
function applyAction() {
  if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
  if (state.selected === null) return;
  const phase = phases[state.phase], action = actions[phase.key][state.selected];
  const eventsUnlocked = areGameplayEventsUnlocked(state.day);
  const availability = getActionAvailability(state, action);
  if (!availability.available) { toast(availability.reason); state.selected=null; render(); return; }
  if ((action.effects.money ?? 0) < 0 && state.money + action.effects.money < 0) { toast("돈이 부족해 이 행동을 할 수 없어요."); return; }
  const consequence = calculateActionEffects(state, action);
  const fx = consequence.effects;
  if (action.random) { const win = Math.random() > .48, leverage=state.player?.archetypeId==="wealthy"?10:1; fx.money = (win ? Math.round(40000+Math.random()*90000) : -Math.round(25000+Math.random()*70000))*leverage; toast(win ? `투자 성공${leverage>1?" · 부자 특전 ×10":""}! ${money(fx.money)}` : `투자 손실${leverage>1?" · 부자 특전 ×10":""} ${money(Math.abs(fx.money))}`); }
  applyEffects(state, fx);
  if (fx.money) appendTransaction(state, { category:"action", label:action.title, amount:Math.round(fx.money) });
  const acquiredItem = acquireActionItem(state, action);
  if (acquiredItem && getItem(acquiredItem.itemId)?.category==="car" && acquiredItem.owner==="player" && state.world) { state.world.ownedVehicleId=acquiredItem.itemId;state.world.transport="car";state.world.transportConfirmed=true; }
  if (acquiredItem) { const giftResult=action.autoGift?giveGift(state,acquiredItem.instanceId):null; toast(giftResult?`${giftResult.item.name} 선물 · “${giftResult.reaction.reaction}”`:`${getItem(acquiredItem.itemId).name} 획득${acquiredItem.equipped?' · 장착 완료':''}`); }
  const promotion = addJobProgress(state, action, fx);
  if (promotion) toast(`승진! 직업 레벨 ${promotion.level} · 수입 보정 상승`);
  const npcResult = eventsUnlocked ? applyNpcActionEffects(state, action) : null;
  if (npcResult) state.logs.push({time:`DAY ${state.day} · NPC`,text:`${npcResult.npc.name}와의 관계가 변했다.`});
  const rivalResult = eventsUnlocked ? applyRivalPressure(state, action) : null;
  if (rivalResult?.record.delta > 0) state.logs.push({time:`DAY ${state.day} · RIVAL`,text:`${rivalResult.rival.name}의 접근 위험이 높아졌다.`});
  state.choices.push(action.tag); state.actionHistory.push({ day:state.day, phase:state.phase, actionId:action.id, tag:action.tag }); state.logs.push({time:`DAY ${state.day} · ${phase.time}`,text:`${action.title} — ${resultText(action)}`});
  const unlockedSpecialOutfit=unlockSpecialOutfitEventIfEligible();
  if (["데이트","유혹","쇼핑"].includes(action.tag)) recordMemory(state,{type:"action",summary:action.title,importance:action.tag==="유혹"?4:2,tags:[action.tag]});
  const clue = observePersonality(state, action.tag);
  if (clue?.revealed) toast(`${state.partner.name}의 성향을 하나 알아냈어요.`);
  state.selected = null;
  const finishedDay = state.phase === 3; const completedDay = state.day;
  advanceTime(state);
  if(action.nightArrivalMinutes!=null)setNightStartTime(state,action.nightArrivalMinutes,"일찍 귀가");
  const initiatedMessage = eventsUnlocked ? maybeGenerateInitiatedMessage(state) : null;
  if (initiatedMessage) { state.logs.push({time:`DAY ${state.day} · MESSAGE`,text:`${state.partner.name}: ${initiatedMessage.text}`}); toast(`${state.partner.name}에게 메시지가 왔어요`); }
  if (finishedDay) { dailyEvent(completedDay); advanceStockMarket(state); const transactions=processDayEndEconomy(state,completedDay); transactions.forEach(entry=>state.logs.push({time:`DAY ${completedDay} · ECONOMY`,text:`${entry.label} ${entry.amount>=0?'+':''}${money(entry.amount)}`})); runDailyStoryDirector(state,completedDay); SaveManager.save(state); if(state.day<=30){resetForNextDay(state);resetWorldForNextDay();} }
  const microEvents=eventsUnlocked?rollMicroEvents(state):[];microEvents.forEach(micro=>state.logs.push({time:`DAY ${micro.day} · MICRO`,text:micro.text}));
  const event = eventsUnlocked?rollEvent(state):null;
  if (event) {
    state.logs.push({time:`DAY ${state.day} · EVENT`,text:`${event.title} — ${event.message}`});
    recordMemory(state,{type:"event",summary:event.title,importance:3,tags:["이벤트",event.id]});
  }
  const breakup = eventsUnlocked ? evaluateBreakup(state) : null;
  sound.play("confirm");
  const currentExpression = resolveCharacterExpression(state);
  state.currentExpression = currentExpression.tone;
  state.currentPose = resolveCharacterPose(state,currentExpression);
  state.currentOutfit = resolveCharacterOutfit(state,currentExpression);
  state.currentAccessory = resolveCharacterAccessory(state);
  SaveManager.save(state);
  const actionMessage = [resultText(action), ...microEvents.map(micro=>micro.text)].join(" ");
  render();
  openActionResultModal(action, actionMessage, fx, () => {
    const continueAfterSpecialEvent=()=>{if (breakup) showBreakup(breakup); else if (state.day > 30) showEnding(); else { const temptation=eventsUnlocked&&npcResult&&getTemptationOpportunity(state); const nextStory=selectNextStoryScene(state);const story=eventsUnlocked||isCampaignPrologueStory(nextStory?.id)?nextStory:null; if(story) openStoryScene(story); else if(temptation) openTemptation(temptation); else if(event) openEventScene(event); else if(["데이트","쇼핑"].includes(action.tag)) sound.playBgm("dateShopping",state.day); else if(action.tag==="유혹") sound.playBgm("crisis",state.day); }};
    if(unlockedSpecialOutfit)showSpecialOutfitEventPopup(continueAfterSpecialEvent);else continueAfterSpecialEvent();
  });
}

function resultText(a) { if(a.id==="evening-go-home")return "저녁 7시에 집에 도착해 여유로운 밤을 시작했다."; if(a.tag==="데이트") return `${state.partner.name}의 표정이 한결 밝아졌다.`; if(a.tag==="성공") return "미래를 위한 한 걸음을 내디뎠다."; if(a.tag==="유혹") return "새로운 인연의 기척이 느껴진다."; if(a.tag==="연락") return "짧은 대화가 두 사람을 조금 더 가깝게 했다."; return "선택의 결과가 하루에 남았다."; }
function dailyEvent(completedDay) { if(completedDay%5===0){ const good=Math.random()>.45; const amount=good?60000:-35000; const label=good?"예상하지 못한 성과급":"갑작스러운 생활비 지출"; recordTransaction(state,{day:completedDay,category:"event",label,amount}); state.logs.push({time:`DAY ${completedDay} · EVENT`,text:`${label}${good?"이 들어왔다.":"이 생겼다."}`}); } if(completedDay%7===0){state.affection=clamp(state.affection-18,0,1000);state.trust=clamp(state.trust-8,0,1000);state.logs.push({time:`DAY ${completedDay} · RELATIONSHIP`,text:"연락이 뜸했던 영향으로 호감도와 신뢰도가 낮아졌다."});} }

function openChat(mode="message") {
  if(!["message","call"].includes(mode))mode="message";
  const context=buildConversationContext(state),greeting=getContextualOpening(context).replace(`${state.partner.name}: `,"");
  activeConversation={mode,turn:0,topic:"opening",lastQuestionId:inferConversationQuestion(greeting),lastUserMessage:null,recentReplyIds:[],variantSeed:(state.day+state.phase+state.conversationHistory.length)%7,messages:[{speaker:"her",text:greeting}],effects:{},hostile:false};
  renderConversationSession();openModal();
}
function renderConversationSession(){
  if(!activeConversation)return;const session=activeConversation,context=buildConversationContext(state),suggestions=getSuggestedConversationReplies(context,session.turn);
  const waiting=session.replyPending?`<div class="message her reply-waiting" aria-label="${escapeHtml(state.partner.name)} 답장 작성 중"><i></i><i></i><i></i><small>${session.mode==='call'?'잠시 생각 중':'답장 작성 중'}</small></div>`:"";
  const messages=session.messages.map(item=>`<div class="message ${item.speaker}">${escapeHtml(item.text)}</div>`).join("")+waiting;
  $("#modalContent").innerHTML=`<section class="conversation-session ${session.mode==='call'?'phone-conversation':''}"><span class="eyebrow">${session.mode==='call'?'PHONE CALL':'MESSAGES'} · ${escapeHtml(state.partner.name)}</span><div class="conversation-heading"><div class="conversation-avatar"><img src="${state.partner.referenceImage}" alt=""><i>${session.mode==='call'?'☎':'●'}</i></div><div><h2>${session.mode==='call'?`${state.partner.name}와 통화 중`:`${state.partner.name}에게 메시지`}</h2><p>${session.mode==='call'?'목소리를 들으며 천천히 이야기해 보세요.':'서로를 존중하는 말로 마음을 이어 가세요.'}</p></div></div><div id="chatMessages" class="chat-window" aria-live="polite">${messages}</div><div id="chatSafetyNotice" class="chat-safety-notice" hidden></div><div class="chat-suggestions">${suggestions.map(text=>`<button type="button" data-chat-suggestion="${escapeHtml(text)}" ${session.replyPending?'disabled':''}>${escapeHtml(text)}</button>`).join("")}</div><form id="chatForm" class="chat-compose"><input id="chatInput" maxlength="180" autocomplete="off" placeholder="${session.replyPending?'답장을 기다리고 있어요…':'직접 입력하거나 추천 답변을 선택하세요'}" required ${session.replyPending?'disabled':''}><button type="submit" ${session.replyPending?'disabled':''}>보내기</button></form><button id="finishConversation" class="conversation-finish" type="button" ${session.replyPending?'disabled':''}>${session.mode==='call'?'통화 종료':'대화 마치기'}</button></section>`;
  $("#chatForm").addEventListener("submit",event=>{event.preventDefault();chatReply($("#chatInput").value);});
  document.querySelectorAll("[data-chat-suggestion]").forEach(button=>button.addEventListener("click",()=>chatReply(button.dataset.chatSuggestion)));
  $("#finishConversation").addEventListener("click",finishConversation);requestAnimationFrame(()=>{$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight;});
}
async function chatReply(message){
  if(!activeConversation)return;const analysis=analyzeConversationInput(message),notice=$("#chatSafetyNotice");
  if(!analysis.allowed){notice.hidden=false;notice.textContent=analysis.message;$("#chatInput").focus();return;}
  const session=activeConversation;
  session.messages.push({speaker:"me",text:message});session.replyPending=true;renderConversationSession();
  const replyDelay=new Promise(resolve=>setTimeout(resolve,session.mode==="call"?900+Math.random()*900:1500+Math.random()*1600));
  let response;
  if(analysis.level==="hostile"){
    response={...getHostileConversationResponse(state),source:"safety"};await replyDelay;state.conversationSafety??={hostileCount:0,lastHostileDay:null};state.conversationSafety.hostileCount=response.count;state.conversationSafety.lastHostileDay=state.day;session.hostile=true;
  }else{
    const endpoint=document.querySelector('meta[name="today-day-one-ai-endpoint"]')?.content;[response]=await Promise.all([requestGirlfriendReply({endpoint,context:{...buildConversationContext(state),sessionTurn:session.turn,mode:session.mode,sessionState:{topic:session.topic,lastQuestionId:session.lastQuestionId,lastUserMessage:session.lastUserMessage,recentReplyIds:[...session.recentReplyIds],turn:session.turn,variantSeed:session.variantSeed}},message}),replyDelay]);
  }
  if(activeConversation!==session)return;
  session.replyPending=false;
  if(!response){renderConversationSession();return;}
  const scale=session.turn>=7?0:session.turn>=4?.5:1,effects=Object.fromEntries(Object.entries(response.effects??{}).map(([key,value])=>[key,Math.round(value*(analysis.level==="hostile"?1:scale))]));
  for(const [key,value] of Object.entries(effects))session.effects[key]=(session.effects[key]??0)+value;
  session.messages.push({speaker:"her",text:response.text});session.turn+=1;
  session.lastUserMessage=message;session.topic=response.topic??session.topic;session.lastQuestionId=inferConversationQuestion(response.text);const replyId=response.replyId??response.id;if(replyId){session.recentReplyIds.push(replyId);session.recentReplyIds=session.recentReplyIds.slice(-12);}
  recordConversationTurn(state,message,response.text,{mode:session.mode,tone:analysis.level});
  state.logs.push({time:`DAY ${state.day} · ${session.mode==='call'?'CALL':'MESSAGE'}`,text:analysis.level==='hostile'?`${state.partner.name}에게 공격적인 말을 해 관계가 크게 나빠졌다.`:`${state.partner.name}와 대화 · ${message.slice(0,32)}`});
  SaveManager.save(state);
  if(response.forceEnd||session.turn>=10){finishConversation(response.forceEnd?"상대가 상처를 받아 대화를 종료했습니다.":"오늘 나눌 이야기를 충분히 나누었습니다.");return;}renderConversationSession();
}
function finishConversation(reason=""){
  if(!activeConversation)return;const session=activeConversation;session.effects=Object.fromEntries(Object.entries(session.effects).map(([key,value])=>[key,Math.max(-3,Math.min(3,Math.round(value)))]));applyEffects(state,session.effects);const effect=key=>session.effects[key]??0,positive=effect("affection")+effect("trust"),summary=session.hostile?"상처와 실망이 남은 대화":positive>=4?"서로의 마음이 가까워진 대화":positive>0?"잔잔하게 마음을 나눈 대화":"조심스러운 대화";
  recordMemory(state,{type:"conversation",summary:`${state.partner.name}와 ${session.mode==='call'?'통화':'메시지'} · ${summary}`,importance:session.hostile?5:3,tags:["대화",session.mode,session.hostile?"갈등":"교감"]});SaveManager.save(state);render();activeConversation=null;
  $("#modalContent").innerHTML=`<span class="eyebrow">CONVERSATION RESULT</span><h2>${escapeHtml(summary)}</h2>${reason?`<p class="conversation-end-reason">${escapeHtml(reason)}</p>`:""}<div class="conversation-result-grid"><div><span>대화 횟수</span><b>${session.turn}턴</b></div><div><span>호감도</span><b class="${effect('affection')>=0?'up':'down'}">${effect('affection')>=0?'+':''}${effect('affection')}</b></div><div><span>신뢰도</span><b class="${effect('trust')>=0?'up':'down'}">${effect('trust')>=0?'+':''}${effect('trust')}</b></div><div><span>관계 스트레스</span><b class="${effect('relationshipStress')<=0?'up':'down'}">${effect('relationshipStress')>=0?'+':''}${effect('relationshipStress')}</b></div></div><p class="conversation-effect-limit">대화 한 번의 수치 변화는 항목별 최대 ±3입니다.</p><button id="conversationResultClose" class="primary-button" type="button">확인</button>`;$("#conversationResultClose").addEventListener("click",closeModal);
}

function closeGameTools() {
  const layer=$("#gameToolsLayer"),backdrop=$("#gameToolsBackdrop"),trigger=$("#tipToolsButton");
  layer.classList.add("hidden");backdrop.classList.add("hidden");
  layer.setAttribute("aria-hidden","true");backdrop.setAttribute("aria-hidden","true");trigger.setAttribute("aria-expanded","false");
}

function renderGameTools() {
  if(!state)return;
  const yuriEvent=SITUATION_EVENTS.find(event=>event.npcId==="player-ex");
  const tabs=[["outfits","의상",HEROINE_OUTFITS.filter(item=>item.heroineId===state.partner.heroineId).length],["events","이벤트",SITUATION_EVENTS.length+1],["maps","지도",Object.keys(WORLD_MAPS).length],["npcs","NPC",state.npcs?.length??0],["yuri","전여자친구",1]];
  $("#gameToolsTabs").innerHTML=tabs.map(([id,label,count])=>`<button type="button" data-tools-tab="${id}" class="${gameToolsTab===id?"active":""}"><span>${label}</span><b>${count}</b></button>`).join("");
  const content=$("#gameToolsContent");
  if(gameToolsTab==="outfits"){
    const equipped=getEquippedHeroineOutfit(state),outfits=HEROINE_OUTFITS.filter(item=>item.heroineId===state.partner.heroineId);
    content.innerHTML=`<div class="game-tools-intro"><b>${escapeHtml(state.partner.name)} 전체 의상</b><span>잠금·보유 조건과 관계없이 미리 보고 바로 선택할 수 있습니다.</span></div><div class="tools-outfit-grid">${outfits.map((outfit,index)=>`<button type="button" data-tools-outfit="${outfit.id}" class="tools-outfit-card ${equipped?.id===outfit.id?"selected":""}"><img src="${outfitImageUrl(outfit)}" alt="${escapeHtml(outfit.name)}" loading="lazy"><span>${outfit.eventOnly?"이벤트 의상":String(index+1).padStart(2,"0")}</span><b>${escapeHtml(outfit.name.replace(`${state.partner.name} · `,""))}</b><small>${outfit.eventOnly?"근사한 데이트 10회 보상":money(outfit.price)} · ${equipped?.id===outfit.id?"현재 착용 중":"이 의상 선택"}</small></button>`).join("")}</div>`;
  }else if(gameToolsTab==="yuri"){
    content.innerHTML=`<div class="game-tools-intro"><b>전여자친구 · 유리</b><span>특별 이벤트에서 등장하는 유리를 미리 확인하고 가운데 패널 이벤트를 실행할 수 있습니다.</span></div><article class="tools-yuri-card"><div class="tools-yuri-media"><img src="assets/heroines/yuri/yuri-ex-girlfriend-2d.png" alt="전여자친구 유리"><video src="assets/heroines/yuri/yuri-ex-girlfriend-2d_transparent.webm?v=1" autoplay loop muted playsinline aria-label="전여자친구 유리 특별 이벤트 영상"></video></div><div class="tools-yuri-copy"><span>SPECIAL EVENT CHARACTER</span><h3>전여자친구 유리</h3><p>고서 복원가 · 차분하고 쉽게 속내를 읽을 수 없는 옛 연인</p>${yuriEvent?`<button type="button" data-tools-yuri-event="${yuriEvent.id}">가운데 패널에서 특별 이벤트 실행</button>`:`<small>연결된 특별 이벤트가 없습니다.</small>`}</div></article>`;
  }else if(gameToolsTab==="events"){
    const groups=SITUATION_EVENTS.reduce((result,event)=>{(result[event.categoryLabel]??=[]).push(event);return result;},{});
    const invitation=getPendingLateNightInvitation(state),invitationStatus=invitation?"메시지 도착":state.nightState?.lateNightInvitation?.status==="completed"?"완료":state.day>=LATE_NIGHT_INVITATION_MIN_DAY?"발생 가능":"DAY 6 잠금";
    content.innerHTML=`<div class="game-tools-intro"><b>전체 이벤트</b><span>일반 이벤트는 조건을 무시하고 실행할 수 있으며, 확률형 특수 이벤트는 발생 조건과 진행 방법을 확인할 수 있습니다.</span></div>${yuriEvent?`<section class="tools-event-group tools-featured-event"><h3>특별 이벤트 <span>1</span></h3><button type="button" class="tools-list-row" data-tools-yuri-event="${yuriEvent.id}"><span><b>전여자친구 유리</b><small>투명 캐릭터 영상 · 가운데 패널 특별 이벤트</small></span><em>실행</em></button></section>`:""}<section class="tools-event-group"><h3>심야 메시지 이벤트 <span>1</span></h3><button type="button" class="tools-list-row" data-tools-late-invitation><span><b>보고 싶어 · 늦은 밤의 초대</b><small>DAY ${LATE_NIGHT_INVITATION_MIN_DAY}+ · 22:00 이후 · 하루 1회 · ${Math.round(LATE_NIGHT_INVITATION_CHANCE*100)}% · ${escapeHtml(invitationStatus)}</small></span><em>상세</em></button></section>${Object.entries(groups).map(([label,events])=>`<section class="tools-event-group"><h3>${escapeHtml(label)} <span>${events.length}</span></h3>${events.map(event=>`<button type="button" class="tools-list-row" data-tools-event="${event.id}"><span><b>${escapeHtml(event.title)}</b><small>${escapeHtml(event.id)} · DAY ${event.dayRange?.[0]??"-"}–${event.dayRange?.[1]??"-"}</small></span><em>실행</em></button>`).join("")}</section>`).join("")}`;
  }else if(gameToolsTab==="maps"){
    content.innerHTML=`<div class="game-tools-intro"><b>지도·장소 이벤트</b><span>원하는 장소로 바로 이동하거나 해당 장소의 선택 이벤트를 엽니다.</span></div><div class="tools-map-list">${Object.values(WORLD_MAPS).map(map=>`<section class="tools-map-card"><header><span>${map.theme.toUpperCase()}</span><b>${escapeHtml(map.name)}</b><small>${escapeHtml(map.subtitle)}</small></header><div>${map.locations.map(location=>`<article><span>${location.icon}</span><div><b>${escapeHtml(location.name)}</b><small>${escapeHtml(location.category)} · ${escapeHtml(location.description)}</small></div><button type="button" data-tools-map-go="${map.id}:${location.id}">이동</button>${location.category!=="home"?`<button type="button" data-tools-map-event="${map.id}:${location.id}">이벤트</button>`:""}</article>`).join("")}</div></section>`).join("")}</div>`;
  }else{
    selectedToolsNpcId??=state.npcs?.[0]?.id??null;
    const selected=(state.npcs??[]).find(npc=>npc.id===selectedToolsNpcId),selectedSprite=selected?getNpcSprite(selected.id):"",related=selected?SITUATION_EVENTS.filter(event=>event.npcId===selected.id||event.npcId===selected.role):[];
    content.innerHTML=`<div class="game-tools-intro"><b>NPC 데이터베이스</b><span>NPC를 선택하면 관계 상태와 연결된 이벤트를 확인할 수 있습니다.</span></div>${selected?`<article class="tools-npc-detail">${selectedSprite?`<img class="tools-npc-portrait" src="${selectedSprite}" alt="${escapeHtml(selected.name)}">`:""}<div class="tools-npc-copy"><span>${selected.active?"ACTIVE":"INACTIVE"}</span><h3>${escapeHtml(selected.name)} · ${escapeHtml(selected.role)}</h3><p>${escapeHtml(selected.job??selected.storyState??"")} · ${selected.age}세 · 호감 ${selected.affection} · 신뢰 ${selected.trust}</p><small>관계 ${escapeHtml(selected.relationshipType)} · 관심 ${selected.interestInPlayer} · 연인 관심 ${selected.interestInGirlfriend}</small>${related.length?`<div>${related.map(event=>`<button type="button" data-tools-event="${event.id}">${escapeHtml(event.title)} 실행</button>`).join("")}</div>`:""}</div></article>`:""}<div class="tools-npc-list">${(state.npcs??[]).map(npc=>`<button type="button" data-tools-npc="${npc.id}" class="${npc.id===selectedToolsNpcId?"selected":""}"><span>${npc.active?"●":"○"}</span><div><b>${escapeHtml(npc.name)}</b><small>${escapeHtml(npc.role)} · ${escapeHtml(npc.category)}</small></div><em>${getNpcRelationshipStatus(npc).label}</em></button>`).join("")}</div>`;
  }
  document.querySelectorAll("[data-tools-tab]").forEach(button=>button.addEventListener("click",()=>{gameToolsTab=button.dataset.toolsTab;renderGameTools();}));
  document.querySelectorAll("[data-tools-outfit]").forEach(button=>button.addEventListener("click",()=>{const outfit=HEROINE_OUTFITS.find(item=>item.id===button.dataset.toolsOutfit);if(!outfit)return;let instance=(state.inventory??[]).find(item=>item.itemId===outfit.id&&item.owner==="girlfriend");instance??=addItem(state,outfit.id,"girlfriend","tip-tools");const result=equipGirlfriendOutfit(state,instance.instanceId);if(!result)return;SaveManager.save(state);render();renderGameTools();toast(`${outfit.name} 선택 완료`);}));
  document.querySelectorAll("[data-tools-event]").forEach(button=>button.addEventListener("click",()=>{const event=SITUATION_EVENTS.find(item=>item.id===button.dataset.toolsEvent);if(!event)return;closeGameTools();$(".play-panel").classList.remove("hidden");$("#nightHome").classList.add("hidden");$("#worldMap").classList.add("hidden");openEventScene(structuredClone(event),{debugPreview:true});}));
  document.querySelector("[data-tools-yuri-event]")?.addEventListener("click",event=>{const selected=SITUATION_EVENTS.find(item=>item.id===event.currentTarget.dataset.toolsYuriEvent);if(!selected)return;closeGameTools();$(".play-panel").classList.remove("hidden");$("#nightHome").classList.add("hidden");$("#worldMap").classList.add("hidden");openEventScene(structuredClone(selected),{debugPreview:true});});
  document.querySelector("[data-tools-late-invitation]")?.addEventListener("click",openLateNightInvitationToolDetail);
  document.querySelectorAll("[data-tools-npc]").forEach(button=>button.addEventListener("click",()=>{selectedToolsNpcId=button.dataset.toolsNpc;renderGameTools();}));
  const openMapTarget=(value,withEvent=false)=>{const [mapId,locationId]=value.split(":"),map=WORLD_MAPS[mapId],location=map?.locations.find(item=>item.id===locationId);if(!map||!location)return;state.world.mode="district";state.world.cityId=map.cityId;state.world.districtId=map.id;state.world.x=location.x;state.world.y=location.y;state.world.transportConfirmed=true;if(!state.world.discoveredLocations.includes(location.id))state.world.discoveredLocations.push(location.id);SaveManager.save(state);closeGameTools();renderWorldMap();if(withEvent)setTimeout(()=>openWorldEventLayer(map,location),120);};
  document.querySelectorAll("[data-tools-map-go]").forEach(button=>button.addEventListener("click",()=>openMapTarget(button.dataset.toolsMapGo)));
  document.querySelectorAll("[data-tools-map-event]").forEach(button=>button.addEventListener("click",()=>openMapTarget(button.dataset.toolsMapEvent,true)));
}

function openGameTools(tab=gameToolsTab) {
  if(!state)return;gameToolsTab=tab;
  const layer=$("#gameToolsLayer"),backdrop=$("#gameToolsBackdrop"),trigger=$("#tipToolsButton");
  layer.classList.remove("hidden");backdrop.classList.remove("hidden");layer.setAttribute("aria-hidden","false");backdrop.setAttribute("aria-hidden","false");trigger.setAttribute("aria-expanded","true");renderGameTools();$("#gameToolsClose").focus();
}

function openDebug() {
  if (!state) return;
  const keys = ["day","phase","appearanceSeed","money","health","energy","fatigue","stress","charm","fashion","confidence","work","social","affection","trust","excitement","attachment","conflict","relationshipStress"];
  const stateRows = keys.map(key=>`<div class="debug-stat"><span>${key}</span><b>${Math.round(state[key])}</b></div>`).join("");
  const personalityRows = Object.entries(state.partner.personality).map(([key,value])=>`<div class="debug-stat"><span>${key}</span><b>${value}</b></div>`).join("");
  const eventDiagnostics=getEventDiagnostics(state);
  const eventRows = eventDiagnostics.map(event=>`<div class="debug-event ${event.eligible?'':event.cooldownRemaining?'cooldown':'ineligible'}"><div><b>${event.title}</b><span>${event.eligible?`${Math.round(event.effectiveProbability*100)}%`:'0%'}</span></div><small>${event.kind==='story'?'스토리':'일반 랜덤'} · 우선순위 ${event.priority} · 기본 판정 ${Math.round(event.probability*100)}% · ${event.dailyLimitReached?'오늘 사건 한도 도달':event.cooldownRemaining?`재실행 대기 ${event.cooldownRemaining}일`:event.eligible?'실행 후보':'실행 불가'} · ${escapeHtml((event.eligible?event.triggerReasons:event.blockedReasons).join(' / ')||'기본 조건')}</small></div>`).join("");
  const microRows=getMicroEventDiagnostics(state).map(event=>`<div class="debug-event ${event.eligible?'':'ineligible'}"><div><b>${escapeHtml(event.title)}</b><span>${event.eligible?`${Math.round(event.probability*100)}%`:'0%'}</span></div><small>짧은 이벤트 · ${escapeHtml(event.category)} · 기본 판정 ${Math.round(event.probability*100)}% · ${event.cooldownRemaining?`재실행 대기 ${event.cooldownRemaining}일`:event.phaseEligible?'현재 시간대 실행 후보':`현재 시간대 제외 · 실행 phase ${event.phases.join(', ')}`}</small></div>`).join("");
  const director=state.storyDirector,analysis=director?.analyses?.at(-1),plan=director?.nextDayPlan;
  const threadRows=Object.entries(director?.threads??{}).sort((a,b)=>b[1]-a[1]).map(([id,value])=>`<div class="debug-stat"><span>${id}</span><b>${value}</b></div>`).join("")||`<p>첫 DAY 종료 후 분석됩니다.</p>`;
  const candidateRows=(plan?.eventCandidates??[]).map(candidate=>`<div class="debug-event ${candidate.blocked?'cooldown':''}"><div><b>${escapeHtml(candidate.title)}</b><span>${candidate.blocked?(candidate.blockedReason??"BLOCKED"):`${Math.round(candidate.finalProbability*100)}%`}</span></div><small>base ${Math.round(candidate.baseProbability*100)}% · ×${candidate.multiplier} · ${candidate.modifiers.map(item=>item.label).join(" · ")||"기본 가중치"}${candidate.cooldownRemaining?` · cooldown ${candidate.cooldownRemaining}`:''}</small></div>`).join("")||`<p>예약 후보가 없습니다.</p>`;
  const unresolvedRows=(director?.unresolvedEvents??[]).map(item=>`<div class="debug-event"><div><b>${item.id}</b><span>STAGE ${item.stage}</span></div><small>${item.type} · DAY ${item.originDay} · ${item.status}</small></div>`).join("")||`<p>미해결 사건이 없습니다.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">ACCESSIBILITY · DIAGNOSTICS</span><h2>접근성 · 실행 진단</h2><p>현재 DAY ${state.day} · phase ${state.phase} 기준의 실제 실행 조건입니다. 확률은 조건과 재실행 대기를 통과한 후보별 판정 확률이며, 여러 후보가 통과하면 우선순위와 가중치로 한 사건만 선택됩니다.</p><div class="debug-launchers"><button id="characterManagerButton" class="primary-button" type="button">캐릭터 관리 · 히로인 ${HEROINE_PROFILES.length}명 · NPC ${state.npcs.length}명</button><button id="eventViewerButton" class="primary-button" type="button">Event Viewer · 에피소드 ${SITUATION_EVENTS.length}개</button><button id="eventInspectorButton" class="primary-button" type="button">Event Inspector · 실행 상태/큐/복구</button></div><h3>Story Director · ${analysis?`DAY ${analysis.day}`:"WAITING"}</h3><div class="debug-grid"><div class="debug-stat"><span>Relationship</span><b>${analysis?.relationshipState??"-"}</b></div><div class="debug-stat"><span>Tension</span><b>${analysis?.narrativeTension??0}</b></div><div class="debug-stat"><span>Dominant</span><b>${director?.dominantThread??"-"}</b></div><div class="debug-stat"><span>Status</span><b>${director?.dominantStatus??"-"}</b></div><div class="debug-stat"><span>Next Seed</span><b>${plan?.seed??"-"}</b></div><div class="debug-stat"><span>Foreshadow</span><b>R${director?.foreshadowing?.rival??0} · T${director?.foreshadowing?.temptation??0} · L${director?.foreshadowing?.lie??0}</b></div></div><h3>Active Threads</h3><div class="debug-grid">${threadRows}</div><h3>Next DAY Event Candidates</h3><div class="debug-events">${candidateRows}</div><h3>Unresolved Events</h3><div class="debug-events">${unresolvedRows}</div><h3>Game State</h3><div class="debug-grid">${stateRows}</div><h3>${state.partner.name} · Hidden Personality</h3><div class="debug-grid">${personalityRows}</div><h3>일반·스토리 사건 실행 진단</h3><div class="debug-events">${eventRows}</div><h3>짧은 이벤트 실행 진단</h3><div class="debug-events">${microRows}</div>`;
  openModal();
  $("#characterManagerButton").addEventListener("click",openCharacterManager);
  $("#eventViewerButton").addEventListener("click",openEventViewer);
  $("#eventInspectorButton").addEventListener("click",openEventInspector);
}

function openEventInspector(){
  const runtime=eventRuntime.snapshot();
  const audit=auditEventSystems({storyScenes:STORY_SCENES,events:EVENT_DEFINITIONS,situationEvents:SITUATION_EVENTS});
  const stateRows=[
    ["ActiveEvent",runtime.activeEvent??"-"],["Scene",runtime.scene??"-"],["DialogueIndex",runtime.dialogueIndex],
    ["State",runtime.state],["InputLock",runtime.inputLock.locked?`${runtime.inputLock.owner} · ${runtime.inputLock.reason}`:"UNLOCKED"],
    ["EventQueue",runtime.eventQueue.join(", ")||"EMPTY"],["PendingEvent",runtime.pendingEvent??"-"],
    ["StoryThread",state.storyDirector?.dominantThread??"-"],["NarrativeTension",state.storyDirector?.analyses?.at(-1)?.narrativeTension??0],
    ["TriggerReason",runtime.triggerReason.join(" / ")||"-"],["AssetStatus",runtime.assetStatus],["SaveStatus",runtime.checkpoint?`CHECKPOINT ${runtime.checkpoint.savedAt}`:"NO CHECKPOINT"]
  ].map(([label,value])=>`<div class="debug-stat"><span>${label}</span><b>${escapeHtml(value)}</b></div>`).join("");
  const logRows=runtime.logs.slice().reverse().map(log=>`<div class="debug-event ${log.level==='error'?'ineligible':log.level==='warning'?'cooldown':''}"><div><b>${escapeHtml(log.state??log.code??log.level)}</b><span>${escapeHtml(log.eventId??'-')}</span></div><small>${escapeHtml(log.previousState??'-')} → ${escapeHtml(log.state??'-')} · scene ${escapeHtml(log.sceneId??'-')} · dialogue ${log.dialogueIndex??0}</small></div>`).join("")||"<p>아직 이벤트 런타임 로그가 없습니다.</p>";
  const auditRows=audit.priority.slice(0,20).map(row=>`<div class="debug-event ${row.classification==='E_ERROR_RISK'?'ineligible':'cooldown'}"><div><b>${escapeHtml(row.id)}</b><span>${row.classification}</span></div><small>${escapeHtml(row.reasons.join(' / '))}</small></div>`).join("")||"<p>우선 수정 대상이 없습니다.</p>";
  $("#modalContent").innerHTML=`<span class="eyebrow">DEBUG EVENT INSPECTOR</span><h2>Event Runtime</h2><p>이벤트 잠금, 큐, 체크포인트, 에셋 상태와 감사 결과를 한 화면에서 확인합니다.</p><div class="debug-grid">${stateRows}</div><h3>Audit Summary</h3><div class="debug-grid">${Object.entries(audit.counts).map(([key,value])=>`<div class="debug-stat"><span>${key}</span><b>${value}</b></div>`).join("")}</div><h3>Runtime Logs</h3><div class="debug-events">${logRows}</div><h3>Audit Priority</h3><div class="debug-events">${auditRows}</div>`;
  openModal();
}

function openEventViewer() {
  const eventOptions=SITUATION_EVENTS.map(event=>`<option value="${event.id}">${event.categoryLabel} · ${escapeHtml(event.title)}</option>`).join("");
  const npcOptions=(state.npcs??[]).filter(npc=>npc.active).map(npc=>`<option value="${npc.id}">${escapeHtml(npc.name)} · ${escapeHtml(npc.role)}</option>`).join("");
  const heroineOptions=HEROINE_PROFILES.map(profile=>`<option value="${profile.id}" ${profile.id===state.partner.heroineId?'selected':''}>${escapeHtml(profile.name)} · ${escapeHtml(profile.archetype)}</option>`).join("");
  const outfitOptions=HEROINE_OUTFITS.filter(outfit=>outfit.heroineId===state.partner.heroineId).map(outfit=>`<option value="${outfit.id}">${escapeHtml(outfit.name)}</option>`).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">DEBUG EVENT VIEWER</span><h2>상황 에피소드 강제 실행</h2><p>조건을 무시하고 Scene·NPC·히로인·의상을 바꿔 대화 진행과 선택 결과를 테스트합니다.</p><div class="event-viewer-form"><label>이벤트<select id="viewerEvent">${eventOptions}</select></label><label>시작 Scene<select id="viewerScene"><option value="0">Scene 1</option><option value="1">Scene 2</option><option value="2">Scene 3</option><option value="3">Scene 4 · NIGHT</option></select></label><label>등장 NPC<select id="viewerNpc">${npcOptions}</select></label><label>히로인<select id="viewerHeroine">${heroineOptions}</select></label><label>현재 의상<select id="viewerOutfit">${outfitOptions}</select></label><label class="event-viewer-check"><input id="viewerSkip" type="checkbox"> Dialogue Skip 버튼으로 Choice Test</label></div><div id="viewerSummary" class="event-viewer-summary"></div><button id="viewerLaunch" class="primary-button" type="button">조건 무시 실행 →</button>`;
  openModal();
  const refresh=()=>{const event=SITUATION_EVENTS.find(item=>item.id===$("#viewerEvent").value);$("#viewerSummary").innerHTML=`<b>${escapeHtml(event.title)}</b><span>${event.scenes.length} Scenes · ${event.scenes.reduce((sum,scene)=>sum+scene.dialogueTurns.length,0)} Turns · ${escapeHtml(event.startMood)} → ${escapeHtml(event.peakMood)} → ${escapeHtml(event.endMood)}</span><small>DAY ${event.dayRange[0]}–${event.dayRange[1]} · ${escapeHtml(event.location)} · ${escapeHtml(event.tensionLevel)} tension · ${event.choices.length} choices</small>`;};
  $("#viewerEvent").addEventListener("change",refresh);refresh();
  $("#viewerHeroine").addEventListener("change",()=>{$("#viewerOutfit").innerHTML=HEROINE_OUTFITS.filter(outfit=>outfit.heroineId===$("#viewerHeroine").value).map(outfit=>`<option value="${outfit.id}">${escapeHtml(outfit.name)}</option>`).join("");});
  $("#viewerLaunch").addEventListener("click",()=>{const event=SITUATION_EVENTS.find(item=>item.id===$("#viewerEvent").value),sceneIndex=Number($("#viewerScene").value),npc=(state.npcs??[]).find(item=>item.id===$("#viewerNpc").value),heroine=HEROINE_PROFILES.find(item=>item.id===$("#viewerHeroine").value),outfit=HEROINE_OUTFITS.find(item=>item.id===$("#viewerOutfit").value);const preview=structuredClone(event);preview.scenes=preview.scenes.slice(sceneIndex).map(scene=>({...scene,characterIds:scene.characterIds.map(id=>id==="girlfriend"?"girlfriend":npc?.id??id),dialogueTurns:scene.dialogueTurns.map(turn=>({...turn,speaker:turn.speaker==="연인"?heroine?.name??state.partner.name:["서브 히로인","직장 동료","친구"].includes(turn.speaker)?npc?.name??turn.speaker:turn.speaker}))}));closeModal();openEventScene(preview,{debugPreview:true,previewOutfitImage:outfit?.characterWearingImage??heroine?.referenceImage,skipToChoice:$("#viewerSkip").checked});});
}

function openCharacterManager() {
  const equipped=getEquippedHeroineOutfit(state);
  const heroineCards=HEROINE_PROFILES.map(profile=>`<article class="character-admin-card ${profile.id===state.partner.heroineId?'active':''}"><img src="${profile.referenceImage}" alt="${escapeHtml(profile.name)}"><div><small>${escapeHtml(profile.id)} · ${escapeHtml(profile.archetype)}</small><b>${escapeHtml(profile.name)} · ${profile.age}세</b><span>${escapeHtml(profile.job)} · 의상 ${HEROINE_OUTFITS.filter(outfit=>outfit.heroineId===profile.id).length}종</span><em>${profile.id===state.partner.heroineId?`현재 히로인 · ${escapeHtml(equipped?.name??"기본 의상")}`:"다음 회차 후보"}</em></div></article>`).join("");
  const npcCards=(state.npcs??[]).map(character=>{const status=getNpcRelationshipStatus(character),sprite=getNpcSprite(character.id);return `<article class="character-admin-card npc-admin ${character.active?'active':''}"><img src="${sprite}" alt="${escapeHtml(character.name)}" loading="lazy"><div><small>${escapeHtml(character.id)} · ${escapeHtml(character.category)}</small><b>${escapeHtml(character.name)} · ${escapeHtml(character.role)}</b><span>호감 ${character.affection} · 신뢰 ${character.trust} · ${escapeHtml(character.storyState)}</span><em>${character.active?'ACTIVE':'INACTIVE'} · ${escapeHtml(status.label)}</em></div></article>`;}).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">CHARACTER DATABASE</span><h2>캐릭터 관리</h2><p>이번 회차 활성 NPC ${(state.npcs??[]).filter(character=>character.active).length}명 · 관계망 ${NPC_SOCIAL_GRAPH.length}개 · 현재 의상 ${escapeHtml(equipped?.outfitId??"DEFAULT")}</p><h3>히로인</h3><div class="character-admin-grid">${heroineCards}</div><h3>NPC Social Graph</h3><div class="character-admin-grid">${npcCards}</div>`;openModal();
}

function openInventory() {
  const bonuses = getEquipmentBonuses(state);
  const ownerLabel = { player:"내 아이템", gift:"선물 대기", girlfriend:`${state.partner.name} 소유` };
  const cards = state.inventory.length ? state.inventory.map(instance=>{ const item=getItem(instance.itemId); const girlfriendOutfit=instance.owner==='girlfriend'&&item.category==='heroine-outfit'; const control=instance.owner==='player'?`<button class="equip-button" data-instance="${instance.instanceId}" ${instance.equipped?'disabled':''}>${instance.equipped?'장착 중':'장착'}</button>`:instance.owner==='gift'?`<button class="gift-button" data-gift="${instance.instanceId}">${state.partner.name}에게 선물</button>`:girlfriendOutfit?`<button class="equip-button girlfriend-outfit-button" data-girlfriend-outfit="${instance.instanceId}" ${instance.equipped?'disabled':''}>${instance.equipped?'사용 중':'갈아입기'}</button>`:`<em>${instance.equipped?'사용 중':'보관 중'}</em>`; const visual=item.productImage?`<img class="inventory-product-image" src="${outfitImageUrl(item)}" alt="" loading="lazy">`:`<div class="item-icon" aria-hidden="true">${item.icon}</div>`; return `<div class="inventory-item">${visual}<div><small>${item.brand} · ${item.category}</small><b>${item.name}</b><span>${ownerLabel[instance.owner]} · 매력 +${item.attractivenessBonus} · 패션 +${item.fashionBonus}</span></div>${control}</div>`; }).join("") : `<p class="empty-inventory">아직 보유한 아이템이 없습니다.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">INVENTORY</span><h2>나의 가방</h2><p>장착 보너스 · 매력 +${bonuses.attractiveness} · 패션 +${bonuses.fashion}</p><div class="inventory-list">${cards}</div>`;
  openModal();
  document.querySelectorAll("[data-instance]:not(:disabled)").forEach(button=>button.addEventListener("click",()=>{ equipItem(state,button.dataset.instance); SaveManager.save(state); openInventory(); }));
  document.querySelectorAll("[data-girlfriend-outfit]:not(:disabled)").forEach(button=>button.addEventListener("click",()=>{const result=equipGirlfriendOutfit(state,button.dataset.girlfriendOutfit);if(!result){toast("의상을 변경할 수 없습니다.");return;}state.logs.push({time:`DAY ${state.day} · OUTFIT`,text:`${state.partner.name} 의상 변경 · ${result.item.name}`});SaveManager.save(state);render();openInventory();toast(`${state.partner.name}의 의상을 ${result.item.name}(으)로 바꿨어요.`);}));
  document.querySelectorAll(".gift-button").forEach(button=>button.addEventListener("click",()=>{ const result=giveGift(state,button.dataset.gift); if(!result)return; state.logs.push({time:`DAY ${state.day} · GIFT`,text:`${result.item.name} 선물 · ${result.reaction.reaction}`}); recordMemory(state,{type:"gift",summary:`${result.item.name} 선물`,importance:4,tags:["선물",result.item.id]}); SaveManager.save(state); toast(`${state.partner.name}: “${result.reaction.reaction}” · 호감 +${result.reaction.affection}`); render(); openInventory(); }));
}

function openLateNightInvitationToolDetail() {
  closeGameTools();
  const invitation=getPendingLateNightInvitation(state),completed=state.nightState?.lateNightInvitation?.status==="completed";
  const status=invitation?"현재 메시지가 도착해 여자친구 집 방문을 기다리고 있습니다.":completed?"오늘 이 이벤트를 완료했습니다.":state.day<LATE_NIGHT_INVITATION_MIN_DAY?`DAY ${LATE_NIGHT_INVITATION_MIN_DAY}부터 발생할 수 있습니다.`:"오늘 밤 10시 이후 확률 판정을 기다립니다.";
  $("#modalContent").innerHTML=`<span class="eyebrow">SPECIAL EVENT · LATE NIGHT MESSAGE</span><h2>보고 싶어 · 늦은 밤의 초대</h2><p>DAY ${LATE_NIGHT_INVITATION_MIN_DAY} 이후 밤 ${formatNightTime(LATE_NIGHT_INVITATION_START_MINUTES)}부터 하루 한 번 ${Math.round(LATE_NIGHT_INVITATION_CHANCE*100)}% 확률로 발생합니다.</p><div class="venue-menu-preview"><small>휴대폰 메시지</small><strong>“${escapeHtml(LATE_NIGHT_INVITATION_MESSAGE)}”</strong></div><div class="venue-menu-preview"><small>진행 방법</small><strong>메시지를 확인한 뒤 지도에서 ${escapeHtml(state.partner.name)}의 집을 방문하면 문 앞 위로 장면이 시작됩니다.</strong></div><div class="venue-menu-preview"><small>완료 보상</small><strong>호감도 +18 · 신뢰도 +14 · 관계 스트레스 -6</strong></div><p>${escapeHtml(status)}</p><button id="lateInvitationToolClose" class="primary-button" type="button">확인</button>`;
  openModal();
  $("#lateInvitationToolClose").addEventListener("click",closeModal);
}

function openStoredItemDetail(instanceId) {
  const instance=(state.inventory??[]).find(entry=>entry.instanceId===instanceId),item=instance?getItem(instance.itemId):null;
  if(!instance||!item)return;
  const image=outfitImageUrl(item),owner=["girlfriend","gift"].includes(instance.owner)?state.partner.name:state.player.name;
  $("#modal").classList.add("item-detail-active");
  $("#modalContent").innerHTML=`<article class="stored-item-detail"><span class="eyebrow">SHOPPING ITEM · ${escapeHtml(owner)} 보관</span>${image?`<img src="${image}" alt="${escapeHtml(item.name)}">`:`<div class="stored-item-detail-icon" aria-hidden="true">${item.icon}</div>`}<h2>${escapeHtml(item.name)}</h2><p>${escapeHtml(getStoredItemDescription(item))}</p><div class="stored-item-meta"><span>${escapeHtml(item.brand)}</span><b>${money(instance.purchasePrice??item.price)}</b></div><button id="storedItemDetailClose" class="primary-button" type="button">닫기</button></article>`;
  openModal();
  $("#storedItemDetailClose").addEventListener("click",closeModal);
}

function openShop() {
  sound.playBgm("dateShopping",state.day);
  const visibleItems=ITEMS.filter(item=>(item.category!=="heroine-outfit" || item.heroineId===state.partner.heroineId)&&!item.eventOnly);
  const cards = visibleItems.map(item=>{const heroineOutfit=item.category==="heroine-outfit",unlocked=!heroineOutfit||isOutfitUnlocked(state,item),purchased=(state.inventory??[]).some(entry=>entry.itemId===item.id);const visual=item.productImage?`<img class="shop-product-image" src="${outfitImageUrl(item)}" alt="${escapeHtml(item.name)}" loading="lazy">`:`<div class="item-icon" aria-hidden="true">${item.icon}</div>`;const actions=purchased?`<button class="purchased-button" disabled>구매 완료</button>`:heroineOutfit?`<button data-buy="${item.id}" data-owner="gift" ${unlocked?'':'disabled'}>${unlocked?`${state.partner.name} 선물용`:`DAY ${item.unlockConditions.day} 잠금`}</button>`:`<button data-buy="${item.id}" data-owner="player">내 것</button><button data-buy="${item.id}" data-owner="gift">선물용</button>`;return `<div class="shop-item ${heroineOutfit?'heroine-outfit-card':''} ${purchased?'purchased':''}">${visual}<div><small>${item.brand} · ${item.rarity??`LUX ${item.luxuryLevel}`}</small><b>${escapeHtml(item.name)}</b><span>${escapeHtml((item.styleTags??item.preferenceTags).join(" · "))} · 매력 +${item.attractivenessBonus} · 패션 +${item.fashionBonus}</span><strong>${money(item.price)}</strong></div><div class="shop-actions">${actions}</div></div>`;}).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">LIFESTYLE SHOP</span><h2>오늘의 상점</h2><p>보유 자산 ${money(state.money)} · ${state.partner.name} 전용 의상 10종이 관계 진행에 따라 해금됩니다.</p><div class="shop-list">${cards}</div>`;
  openModal();
  if (state.job?.id === "used-car-dealer") $("#modalContent").insertAdjacentHTML("afterbegin", `<p class="career-tip"><b>딜러 네트워크 적용:</b> ${escapeHtml(state.partner.name)}에게 선물할 차량은 결제 시 12% 자동 할인됩니다.</p>`);
  document.querySelectorAll("[data-buy]").forEach(button=>button.addEventListener("click",()=>openPurchaseConfirmation(button.dataset.buy,button.dataset.owner)));
}

function openPurchaseConfirmation(itemId, owner) {
  const item=getItem(itemId),quote=getPurchaseQuote(state,item,owner);
  if(!item||!quote){toast("구매 정보를 확인할 수 없습니다.");return;}
  const target=owner==="gift"?`${state.partner.name} 선물용`:"내 것";
  const visual=item.productImage?`<img class="purchase-confirm-image" src="${outfitImageUrl(item)}" alt="${escapeHtml(item.name)}">`:`<div class="purchase-confirm-icon" aria-hidden="true">${item.icon}</div>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">PURCHASE CONFIRM</span><h2>구매 확인</h2><div class="purchase-confirm-item">${visual}<div><small>${escapeHtml(item.brand)} · ${escapeHtml(target)}</small><b>${escapeHtml(item.name)}</b><strong>${money(quote.price)}</strong></div></div><p class="venue-visit-question">구매하시겠습니까?</p><div class="venue-confirm-actions"><button id="purchaseCancel" type="button">아니오</button><button id="purchaseConfirm" class="primary-button" type="button">예</button></div>`;
  openModal();
  $("#purchaseCancel").addEventListener("click",openShop);
  $("#purchaseConfirm").addEventListener("click",()=>{const result=purchaseItem(state,itemId,owner);if(!result.ok){toast(result.reason);openShop();return;}const outfitGift=result.item.category==="heroine-outfit"?giveGift(state,result.instance.instanceId):null;if(outfitGift){state.logs.push({time:`DAY ${state.day} · OUTFIT`,text:`${outfitGift.item.name} 선물 · 바로 착용`});recordMemory(state,{type:"gift",summary:`${outfitGift.item.name} 의상 선물`,importance:4,tags:["선물","의상",outfitGift.item.id]});}SaveManager.save(state);render();openShop();toast(outfitGift?`${state.partner.name}에게 선물 완료 · 새 의상 착용`:`${result.item.name} 구매 완료`);});
}

function openFinance() {
  const summary = getEconomySummary(state), assets=getAssetSummary(state), nextPayday = getNextPayday(state.day);
  const rows = state.economyLedger.length ? state.economyLedger.slice(-10).reverse().map(entry=>`<div class="ledger-row"><span><b>${entry.label}</b><small>DAY ${entry.day} · ${entry.category}</small></span><strong class="${entry.amount>=0?'income':'expense'}">${entry.amount>=0?'+':''}${money(entry.amount)}</strong></div>`).join("") : `<p class="empty-inventory">아직 기록된 거래가 없습니다.</p>`;
  $("#modalContent").innerHTML=`<span class="eyebrow">MY FINANCE</span><h2>30일 재정 기록</h2><p>총자산 ${money(assets.netWorth)} · ${nextPayday?`다음 급여 DAY ${nextPayday}`:'모든 급여 정산 완료'}</p><div class="finance-summary"><div><small>현금</small><b>${money(assets.cash)}</b></div><div><small>저축</small><b>${money(assets.savings)}</b></div><div><small>주식 평가액</small><b>${money(assets.stockValue)}</b></div><div><small>국채</small><b>${money(assets.bondValue)}</b></div></div><div class="savings-card"><div><small>DAILY INTEREST 0.1%</small><b>안정 저축 계좌</b><span>누적 이자 ${money(state.finance.interestEarned)} · ${money(SAVINGS_TRANSFER_AMOUNT)} 단위 이체</span></div><div><button id="savingsDeposit" ${state.money<SAVINGS_TRANSFER_AMOUNT?'disabled':''}>입금</button><button id="savingsWithdraw" ${state.finance.savings<SAVINGS_TRANSFER_AMOUNT?'disabled':''}>출금</button></div></div><div class="savings-card"><div><small>${BOND_TERM_DAYS} DAYS · RETURN ${(BOND_RETURN_RATE*100).toFixed(0)}%</small><b>안정 국채</b><span>보유 ${state.finance.bonds.length}건 · 누적 수익 ${money(state.finance.bondInterestEarned)}</span></div><div><button id="bondPurchase" ${state.money<BOND_PURCHASE_AMOUNT?'disabled':''}>${money(BOND_PURCHASE_AMOUNT)} 매수</button></div></div><div class="finance-summary"><div><small>누적 수입</small><b>+${money(summary.income)}</b></div><div><small>누적 지출</small><b>-${money(summary.expense)}</b></div><div><small>순손익</small><b>${summary.net>=0?'+':''}${money(summary.net)}</b></div></div><h3>최근 거래</h3><div class="ledger-list">${rows}</div>`;
  openModal();
  $("#savingsDeposit").addEventListener("click",()=>{const result=depositSavings(state);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openFinance();toast(`${money(result.amount)} 저축 완료`);});
  $("#savingsWithdraw").addEventListener("click",()=>{const result=withdrawSavings(state);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openFinance();toast(`${money(result.amount)} 출금 완료`);});
  $("#bondPurchase").addEventListener("click",()=>{const result=purchaseBond(state);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openFinance();toast(`국채 매수 · DAY ${result.bond.maturityDay} 만기`);});
}

function openCareer() {
  const career = getCareerSummary(state), job = state.job;
  const payday = getNextPayday(state.day) ?? state.day;
  const paycheckRange = getPaycheckRange(state);
  $("#modalContent").innerHTML=`<span class="eyebrow">MY CAREER</span><h2>${job.name} · Lv.${state.jobLevel}</h2><p>다음 10일 급여 예상 ${money(calculatePaycheck(state))}</p><div class="career-progress"><div><span>승진 진행도</span><b>${career.progress} / ${career.threshold}</b></div><i><em style="width:${career.percent}%"></em></i><small>승진까지 성장 포인트 ${career.remaining}</small></div><div class="career-stats"><div><small>연봉</small><b>${money(job.salary)}</b></div><div><small>수입 배율</small><b>×${job.incomeMultiplier.toFixed(2)}</b></div><div><small>성장 잠재력</small><b>${job.growthPotential}</b></div><div><small>인맥 기회</small><b>${job.socialOpportunity}</b></div><div><small>스트레스 배율</small><b>×${job.stressRate.toFixed(2)}</b></div></div><p class="career-tip">성공 행동으로 업무 능력을 올리면 승진 진행도가 쌓이고, 승진할 때마다 수입 배율이 증가합니다.</p>`;
  $("#modalContent").insertAdjacentHTML("beforeend", `<section class="career-perk"><small>${escapeHtml(job.incomeType)} · DAY ${payday} 예상 ${money(calculatePaycheck(state, payday))}</small><h3>${escapeHtml(job.perkName)}</h3><p>${escapeHtml(job.perkDescription)}</p><span>급여 범위 ${money(paycheckRange.minimum)} ~ ${money(paycheckRange.maximum)}</span></section>`);
  openModal();
}

function openPeople() {
  const breakupRisk = calculateBreakupRisk(state);
  const career=state.partner.career;
  const partnerCard=career?`<div class="npc-card partner-career-card"><div class="npc-details"><small>MY PARTNER · ${escapeHtml(career.workplace)}</small><b>${escapeHtml(state.partner.name)} · ${escapeHtml(career.name)}</b><span>${escapeHtml(career.workPattern)} · 월수입 ${money(career.incomeRange[0])}~${money(career.incomeRange[1])}</span><span><strong>${escapeHtml(career.perkName)}</strong> · ${escapeHtml(career.perkDescription)}</span><em>목표 · ${escapeHtml(career.careerGoal)}</em></div></div>`:"";
  const activeNpcs=(state.npcs??[]).filter(npc=>npc.active);
  const groupDefinitions=[
    {id:"friend",label:"친구",description:"서로의 일상을 나누는 가까운 사람",matches:npc=>npc.category==="friend"&&npc.relationshipType!=="ex"},
    {id:"office",label:"직장 동료",description:"회사와 업무에서 만나는 사람",matches:npc=>npc.category==="office"&&npc.relationshipType!=="ex"},
    {id:"past",label:"과거 인연",description:"지금의 관계에 영향을 줄 수 있는 인물",matches:npc=>npc.relationshipType==="ex"},
    {id:"other",label:"주변 인물",description:"생활 속에서 알게 된 사람",matches:()=>true}
  ];
  const assigned=new Set();
  const renderRelationshipCard=(npc,groupId)=>{
    const status=npc.relationshipType==='rival'?calculateRivalRisk(state,npc):getNpcRelationshipStatus(npc);
    const relationshipIndex=Math.round((Number(npc.affection??0)+Number(npc.trust??0))/2);
    const interest=npc.interestTarget==="girlfriend"?`여자친구 관심 ${npc.interestInGirlfriend}`:npc.interestTarget==="player"?`나에 대한 관심 ${npc.interestInPlayer}`:"특별한 관심 없음";
    const sprite=getNpcSprite(npc.id);
    return `<article class="relationship-card${sprite?' illustrated':''}">${sprite?`<button class="relationship-portrait-button" type="button" data-relationship-portrait="${escapeHtml(sprite)}" data-relationship-name="${escapeHtml(npc.name)}" data-relationship-scene="${escapeHtml(groupId)}" aria-label="${escapeHtml(npc.name)} 일러스트 확대"><img src="${sprite}" alt="${escapeHtml(npc.name)}" loading="lazy"></button>`:''}<div class="relationship-card-copy"><small>${escapeHtml(npc.role)} · ${escapeHtml(npc.job)}</small><b>${escapeHtml(npc.name)}</b><span>관계 지수 <strong>${relationshipIndex}</strong> · 호감 ${npc.affection} · 신뢰 ${npc.trust}</span><i><em style="width:${Math.max(0,Math.min(100,relationshipIndex))}%"></em></i><span>${interest}</span></div><mark data-tone="${status.tone}">${escapeHtml(status.label)}</mark></article>`;
  };
  const groups=groupDefinitions.map(group=>{
    const members=activeNpcs.filter(npc=>!assigned.has(npc.id)&&group.matches(npc));
    members.forEach(npc=>assigned.add(npc.id));
    if(!members.length)return "";
    return `<section class="relationship-group" data-group="${group.id}"><header><div><h3>${group.label}</h3><p>${group.description}</p></div><b>${members.length}명</b></header><div class="relationship-card-list">${members.map(npc=>renderRelationshipCard(npc,group.id)).join("")}</div></section>`;
  }).join("");
  $("#modal").classList.add("relationship-directory-active");
  $("#modalContent").innerHTML=`<article class="relationship-directory"><header><span class="eyebrow">RELATIONSHIP DIRECTORY</span><h2>인맥 관계</h2><p>관계 지수는 각 인물의 호감도와 신뢰도를 평균한 값입니다. 현재 연애 위기 ${breakupRisk.score} · ${breakupRisk.label}</p></header>${partnerCard}<div class="relationship-groups">${groups||"<p>아직 알게 된 인물이 없습니다.</p>"}</div><button id="relationshipDirectoryClose" class="primary-button" type="button">닫기</button></article>`;
  openModal();
  $("#relationshipDirectoryClose").addEventListener("click",closeModal);
  document.querySelectorAll("[data-relationship-portrait]").forEach(button=>button.addEventListener("click",()=>openRelationshipPortrait(button.dataset.relationshipPortrait,button.dataset.relationshipName,button.dataset.relationshipScene)));
}

function closeRelationshipPortrait() {
  const layer=$("#relationshipPortraitLightbox");
  if(!layer)return;
  if(layer._onKey)document.removeEventListener("keydown",layer._onKey);
  layer.remove();
}

function openRelationshipPortrait(src,name,scene="other") {
  closeRelationshipPortrait();
  const layer=document.createElement("div");
  layer.id="relationshipPortraitLightbox";
  layer.className="relationship-portrait-lightbox";
  const sceneId=["office","past","friend","other"].includes(scene)?scene:"other";
  layer.innerHTML=`<section class="relationship-portrait-dialog scene-${sceneId}" role="dialog" aria-modal="true" aria-label="${escapeHtml(name)} 일러스트"><button class="relationship-portrait-close" type="button" aria-label="확대 이미지 닫기">× 닫기</button><img src="${escapeHtml(src)}" alt="${escapeHtml(name)} 전체 일러스트"><strong>${escapeHtml(name)}</strong></section>`;
  document.body.append(layer);
  const close=()=>closeRelationshipPortrait();
  const onKey=event=>{if(event.key==="Escape")close();};
  layer._onKey=onKey;
  layer.addEventListener("click",event=>{if(event.target===layer)close();});
  layer.querySelector(".relationship-portrait-close").addEventListener("click",close);
  document.addEventListener("keydown",onKey);
  requestAnimationFrame(()=>layer.querySelector(".relationship-portrait-close").focus());
}

function showBreakup(breakup) {
  sound.play("alert");
  sound.playBgm("crisis",breakup.day);
  const presentation={...resolvePhasePresentation(state,"evening"),expressionId:"tense",animationId:"look-away"};
  startImmersiveScene({id:`breakup-${breakup.day}`,type:"ending",presentation,sequence:[
    {type:"transition",style:"fade",label:`DAY ${breakup.day} · 마지막 대화`},
    {type:"narration",text:breakup.reason},
    {type:"dialogue",speaker:state.partner.name,text:"우리, 여기까지 하는 게 좋을 것 같아.",expressionId:"tense"},
    {type:"narration",text:`${state.partner.name}와의 관계는 더 이어지지 못했다. 정확한 수치보다 마지막 표정이 오래 남았다.`},
    {type:"choice",options:[{id:"restart",label:"새로운 30일 시작하기 →"}]}
  ],onChoice:choiceId=>{if(choiceId==="restart")location.reload();return null;}});
}

function openTemptation({ npc, level }) {
  sound.play("alert");
  sound.playBgm("crisis",state.day);
  const message = level==='secret'?`${npc.name}(이)가 둘만의 비밀 만남을 제안했다.`:level==='drinks'?`${npc.name}(이)가 다음에는 단둘이 마시자고 한다.`:`${npc.name}(이)가 개인 연락처로 메시지를 보냈다.`;
  const presentation={...resolvePhasePresentation(state,"evening"),characterId:npc.id,expressionId:"calm",animationId:"soft-sway"};
  const choices=Object.entries(TEMPTATION_CHOICES).map(([id,choice])=>({id,label:choice.label}));
  startImmersiveScene({id:`temptation-${npc.instanceId}`,type:"temptation",presentation,sequence:createTemptationSceneSequence({npc,choices},message),onChoice:choiceId=>{const result=resolveTemptation(state,npc.instanceId,choiceId);if(!result)return null;state.logs.push({time:`DAY ${state.day} · CHOICE`,text:`${npc.name}에게 “${result.choice.label}”`});recordMemory(state,{type:"temptation",summary:`${npc.name}: ${result.choice.label}`,importance:5,tags:["유혹",choiceId]});SaveManager.save(state);return createTemptationReactionSequence(npc,choiceId);}});
}

function openEventScene(event,{debugPreview=false,previewOutfitImage=null,skipToChoice=false,resumeSequenceIndex=0}={}) {
  const presentation=resolveStoryPresentation({id:event.id,title:event.title,message:event.message,bgm:"theme"},state);
  const sequence=createEventSceneSequence(event).slice(Math.max(0,resumeSequenceIndex));
  const triggerReason=event.record?.triggerReason??[],locationEvent=event.trigger==="location-enter"||triggerReason.some(reason=>String(reason).startsWith("장소 입장:"));
  startImmersiveScene({id:event.id,type:"event",presentation,sequence,previewOutfitImage,triggerReason,locationEvent,onChoice:event.scenes?.length?choiceId=>{const result=resolveSituationEventChoice(state,event,choiceId);if(!result)return null;state.logs.push({time:`DAY ${state.day} · EPISODE`,text:`${event.title} · ${result.choice.label}`});SaveManager.save(state);const lastScene=event.scenes?.at(-1),reactionSpeaker=lastScene?.dialogueTurns?.find(turn=>turn.type==="dialogue")?.speaker??event.npcName??state.partner.name,reactionText=result.choice.response??result.choice.memory??"선택의 의미가 앞으로의 관계에 남았다.",reactionExpression=choiceId==="risk"?"tense":"smile";return {sequence:[{type:"narration",text:`나는 “${result.choice.label}”라고 답하고 행동했다.`},{type:"expressionChange",expressionId:reactionExpression},{type:"dialogue",speaker:reactionSpeaker,text:reactionText,expressionId:reactionExpression},...(result.mbtiAdjustment?.label?[{type:"narration",text:`${result.mbtiAdjustment.label}에 맞는 반응이 관계 수치에 추가로 반영됐다.`}]:[]),{type:"narration",text:"이 선택의 결과가 관계 수치와 다음 사건의 가능성에 남았다."},{type:"sceneEnd"}],resultPopup:{action:{id:`${event.id}-choice`,title:event.title},message:`${result.choice.label} · ${reactionText}`,effects:result.effects}};}:null,debugPreview});
  if(skipToChoice)setTimeout(()=>skipImmersiveScene(new Event("click")),0);
}

function openInvestment() {
  const portfolio=getPortfolioSummary(state);
  const lottery=getLotterySummary(state);
  const wealthyLeverage=state.player?.archetypeId==="wealthy"?`<p class="career-tip"><b>부자 캐릭터 특전:</b> 주가 상승과 하락이 모두 10배로 적용됩니다.</p>`:"";
  const valueClass=value=>value>0?"investment-gain":value<0?"investment-loss":"investment-neutral";
  const cards=state.investment.market.map(stock=>{const holding=state.investment.holdings[stock.id],positionProfit=holding?(stock.price-holding.averageCost)*holding.quantity:0;return `<div class="stock-card"><div><small class="${valueClass(stock.changeRate)}">${stock.risk.toUpperCase()} RISK · ${stock.changeRate>=0?'+':''}${stock.changeRate}%</small><b>${stock.name}</b><span class="stock-position-line">${money(stock.price)} · 보유 ${holding?.quantity??0}주${holding?` · 평균 ${money(holding.averageCost)}`:''}</span>${holding?`<em class="stock-profit ${valueClass(positionProfit)}">평가 손익 ${positionProfit>=0?'+':''}${money(positionProfit)}</em>`:""}</div><div class="stock-actions"><button data-stock-buy="${stock.id}">1주 매수</button><button data-stock-sell="${stock.id}" ${holding?'':'disabled'}>1주 매도</button></div></div>`;}).join("");
  $("#modalContent").innerHTML=`<span class="eyebrow">VIRTUAL MARKET</span><h2>오늘의 투자</h2>${wealthyLeverage}<p class="investment-summary-line">보유 자산 <b>${money(state.money)}</b> · 평가금액 <b>${money(portfolio.marketValue)}</b> · 손익 <strong class="${valueClass(portfolio.profitLoss)}">${portfolio.profitLoss>=0?'+':''}${money(portfolio.profitLoss)}</strong></p><div class="stock-list">${cards}</div><div class="lottery-card"><div><small>INSTANT LOTTERY · DAY ${state.day}</small><b>오늘의 행운 복권</b><span>1장 ${money(LOTTERY_TICKET_PRICE)} · 오늘 ${lottery.today}/${DAILY_TICKET_LIMIT}장 · 누적 손익 <strong class="${valueClass(lottery.net)}">${lottery.net>=0?'+':''}${money(lottery.net)}</strong></span></div><button id="lotteryBuyButton" ${lottery.today>=DAILY_TICKET_LIMIT||state.money<LOTTERY_TICKET_PRICE?'disabled':''}>한 장 긁기</button></div>`;
  openModal();
  document.querySelectorAll("[data-stock-buy]").forEach(button=>button.addEventListener("click",()=>{const result=buyStock(state,button.dataset.stockBuy);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openInvestment();}));
  document.querySelectorAll("[data-stock-sell]:not(:disabled)").forEach(button=>button.addEventListener("click",()=>{const result=sellStock(state,button.dataset.stockSell);if(!result.ok){toast(result.reason);return;}SaveManager.save(state);render();openInvestment();}));
  $("#lotteryBuyButton").addEventListener("click",()=>{const result=buyInstantLottery(state);if(!result.ok){toast(result.reason);return;}state.logs.push({time:`DAY ${state.day} · LOTTERY`,text:`즉석복권 ${result.label}${result.prize?` · ${money(result.prize)} 당첨`:''}`});SaveManager.save(state);render();showLotteryResult(result);});
}

function showLotteryResult(result) {
  const won=result.prize>0;
  $("#modalContent").innerHTML=`<article class="lottery-result ${won?'won':'miss'}"><span class="lottery-result-icon" aria-hidden="true">${won?'🎉':'🍀'}</span><small>INSTANT LOTTERY · DAY ${state.day}</small><h2>${won?escapeHtml(result.label):'꽝'}</h2><strong>${won?`${money(result.prize)} 당첨!`:'아쉽게도 당첨되지 않았어요.'}</strong><p>${won?'당첨금이 보유 자산에 바로 지급되었습니다.':'다음 행운을 기대해 보세요.'}</p><button id="lotteryResultConfirm" class="primary-button" type="button">확인</button></article>`;
  openModal();
  $("#lotteryResultConfirm").addEventListener("click",openInvestment);
}

function showEnding(){ state.ended=true; const [title, desc] = determineEnding(state); const analysis=analyzePlayHistory(state);
  sound.play("success");
  sound.playBgm("ending",Math.round(state.affection+state.trust),{loop:false});
  const presentation={...resolvePhasePresentation(state,"evening"),expressionId:state.affection+state.trust>=1200?"smile":"calm",animationId:"soft-sway"};
  const highlights=analysis.highlights.join(" ");
  startImmersiveScene({id:"day-30-ending",type:"ending",presentation,sequence:[
    {type:"transition",style:"flash",label:"DAY 30 · OUR ENDING"},
    {type:"narration",text:desc},
    {type:"dialogue",speaker:state.partner.name,text:title,expressionId:presentation.expressionId},
    {type:"narration",text:`30일 동안 ${analysis.totalChoices}번 선택했다. 가장 많이 택한 방향은 ${analysis.dominantChoice.tag}, 우리의 관계는 ${analysis.relationshipLabel}으로 남았다.`},
    {type:"narration",text:highlights||"서로의 선택이 하나의 이야기가 되었다."},
    {type:"choice",options:[{id:"restart",label:"새로운 30일 시작하기 →"}]}
  ],onChoice:choiceId=>{if(choiceId==="restart")location.reload();return null;}});
}
function toast(message){ const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200); }

function loadGame() { const loaded = SaveManager.load(); if (!loaded) { toast("불러올 수 있는 저장 데이터가 없어요."); return; } state = loaded; showGame(); if(state.breakup&&areGameplayEventsUnlocked())showBreakup(state.breakup);else if(state.day>30)showEnding();else if(state.pendingStoryId&&!state.eventRuntime?.activeEvent&&(areGameplayEventsUnlocked()||isCampaignPrologueStory(state.pendingStoryId)))openStoryScene(getStoryScene(state.pendingStoryId));else if(!state.eventRuntime?.activeEvent)toast(`DAY ${state.day} 저장 데이터를 불러왔어요.`); }
function saveGame() { if (!state) return; SaveManager.save(state); toast(`DAY ${state.day} 진행 상황을 저장했어요.`); }
function openContinuePreview(){const loaded=SaveManager.load();if(!loaded){toast("이어할 저장 데이터가 없어요.");return;}const story=loaded.scenario?.enabled===true,mode=getGameModeConfig(loaded.gameMode),updated=loaded.updatedAt?new Intl.DateTimeFormat("ko-KR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(loaded.updatedAt)):"저장 시각 없음";$("#modalContent").innerHTML=`<section class="continue-preview"><span>${story?"STORY MODE":"FREE MODE"}</span><h2>${story?"《결혼까지 30일!》":"나만의 30일"}</h2><div><strong>DAY ${loaded.day}</strong>${story?`<b>D-${Math.max(0,31-loaded.day)}</b>`:""}</div><p>${escapeHtml(mode.description)}</p><small>마지막 플레이 · ${escapeHtml(updated)}</small><button id="continueResumeButton" class="primary-button" type="button">이어하기 →</button></section>`;openModal();$("#continueResumeButton").addEventListener("click",()=>{closeModal();loadGame();});}

if (!SaveManager.hasSave()) $("#loadButton").classList.add("hidden");
renderSoundButton();
$("#soundButton").addEventListener("click",()=>{const enabled=sound.toggle();renderSoundButton();if(enabled){sound.play("success");if(state)sound.playScene(phases[state.phase].key,state.day);else sound.playBgm("title",new Date().getDate());}toast(enabled?"효과음과 BGM을 켰어요.":"모든 소리를 껐어요.");});
$("#debugButton").addEventListener("click",openDebug);
$("#tipToolsButton").addEventListener("click",()=>openGameTools());
$("#gameToolsClose").addEventListener("click",closeGameTools);
$("#gameToolsBackdrop").addEventListener("click",closeGameTools);
$(".mini-tip").addEventListener("click",()=>openGameTools());
$("#inventoryButton").addEventListener("click",openInventory);
$("#shopButton").addEventListener("click",openShop);
$("#financeButton").addEventListener("click",openFinance);
$("#careerButton").addEventListener("click",openCareer);
$("#peopleButton").addEventListener("click",openPeople);
$("#investmentButton").addEventListener("click",openInvestment);
$("#historyButton").addEventListener("click",openDialogueHistory);
$("#menuButton").addEventListener("click",openGameMenu);
$("#storyMenuButton").addEventListener("click",event=>{event.stopPropagation();openGameMenu();});
$("#storyHistoryButton").addEventListener("click",event=>{event.stopPropagation();openDialogueHistory();});
$("#nightHome").addEventListener("click",handleRoomAction);
$("#returnHomeButton").addEventListener("click",returnToNightHome);
$("#worldAtlasButton").addEventListener("click",()=>openWorldAtlas());
$("#worldTransportButton").addEventListener("click",()=>openTransportSelector(false));
$("#enterLocationButton").addEventListener("click",()=>openWorldLocation());
$("#worldMapCanvas").addEventListener("keydown",handleWorldMapKeydown);
$("#worldMapCanvas").addEventListener("pointerup",handleWorldMapPointer);
$(".world-dpad").addEventListener("click",handleWorldMoveClick);
$("#actionGrid").addEventListener("click",handleActionGridClick);
$("#girlfriendWardrobe").addEventListener("click",handleGirlfriendWardrobeClick);
$("#todayRecordButton").addEventListener("click",openTodayLog);
$("#relationshipDirectoryButton").addEventListener("click",openPeople);
$("#purchasedItemStorage").addEventListener("click",event=>{const button=event.target.closest("[data-stored-item]");if(button)openStoredItemDetail(button.dataset.storedItem);});
$("#visualNovelStage").addEventListener("click",handleDialogueAdvance);
$("#storyChoiceLayer").addEventListener("click",event=>{event.stopPropagation();const button=event.target.closest("[data-immersive-choice]");if(button)chooseImmersiveOption(button.dataset.immersiveChoice);});
$("#storyChoiceLayer").addEventListener("keydown",event=>{const button=event.target.closest("[data-immersive-choice]");if(!button||(event.key!=="Enter"&&event.key!==" "))return;event.preventDefault();event.stopPropagation();chooseImmersiveOption(button.dataset.immersiveChoice);});
$("#visualNovelStage").addEventListener("keydown",event=>{ if(event.target.closest?.("[data-immersive-choice]"))return;if(event.key==="Enter"||event.key===" "){event.preventDefault();handleDialogueAdvance();} });
$("#autoButton").addEventListener("click",toggleAutoMode);
$("#skipButton").addEventListener("click",skipImmersiveScene);
$("#fullscreenButton").addEventListener("click",toggleFullscreen);
$("#storyFullscreenButton").addEventListener("click",toggleFullscreen);
$("#startButton").addEventListener("click",startGame); $("#titleContinueButton")?.addEventListener("click",openContinuePreview); $("#titleSettingsButton")?.addEventListener("click",()=>{$("#modalContent").innerHTML=`<span class="eyebrow">SETTINGS</span><h2>환경설정</h2><p>타이틀 화면에서는 사운드 설정을 변경할 수 있습니다.</p><button id="titleSoundToggle" class="primary-button" type="button">${sound.enabled?"사운드 끄기":"사운드 켜기"}</button>`;openModal();$("#titleSoundToggle").addEventListener("click",()=>{$("#soundButton").click();closeModal();});}); $("#nextButton").addEventListener("click",applyAction); $("#chatButton").addEventListener("click",openChat); $("#saveButton").addEventListener("click",saveGame); $("#loadButton").addEventListener("click",loadGame); $("#closeModal").addEventListener("click",closeModal); $("#actionResultConfirm").addEventListener("click",confirmActionResult); $("#resetButton").addEventListener("click",()=>{ if(confirm("새 게임을 시작할까요? 현재 진행은 사라집니다.")) { SaveManager.clear(); location.reload(); } });
$("#introVideo").addEventListener("ended",playNextIntroVideo);
$("#skipIntroButton").addEventListener("click",()=>{$("#introVideo").pause();introVideoIndex=INTRO_VIDEO_PLAYLIST.length-1;unlockIntroStart("프롤로그 영상을 건너뛰었습니다. 게임을 시작할 수 있습니다.");});
$("#introGameStartButton").addEventListener("click",finishOnboarding);
document.addEventListener("keydown", handleModalKeydown);
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!$("#gameToolsLayer").classList.contains("hidden"))closeGameTools();});
document.addEventListener("fullscreenchange",renderFullscreenButtons);
window.addEventListener("beforeunload",()=>clearInterval(runtimeWatchdogTimer));
