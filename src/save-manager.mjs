import { validateState } from "./game-core.mjs?v=17";
import { migrateNpcRoster } from "./npc-manager.mjs?v=4";
import { migrateHeroineProfile } from "./girlfriend-manager.mjs?v=6";
import { migrateInvestmentState } from "./investment-manager.mjs?v=2";
import { createLotteryState } from "./lottery-manager.mjs";
import { createAdvancedEconomyState } from "./economy-manager.mjs";
import { migrateVisualState } from "./character-appearance.mjs";
import { createHiddenRouteState } from "./hidden-route-manager.mjs";
import { createDaySnapshot } from "./night-manager.mjs";
import { migrateStoryDirectorState } from "./dynamic-story-director.mjs";
import { migrateJob } from "./jobs-data.mjs?v=6";
import { migratePlayerProfile } from "./player-profile-data.mjs";
import { migrateWorldState } from "./world-map-manager.mjs";
import { migrateScenarioState, normalizeGameMode } from "./scenario-state.mjs";
import { migrateYujinSecretRouteState } from "./yujin-secret-route.mjs";
import { migrateWorldEncounterRoutes } from "./world-encounter-manager.mjs?v=5";
import { migrateGirlfriendLoanState } from "./girlfriend-loan-manager.mjs?v=1";

export class SaveManager {
  static key = "today-day-one.save.v1";

  static keyForMode(mode) {
    return `${this.key}.${normalizeGameMode(mode)==="marriage-in-30-days"?"story":"free"}`;
  }

  static hasSave(storage = localStorage, mode = null) {
    return storage.getItem(mode?this.keyForMode(mode):this.key) !== null;
  }

  static save(state, storage = localStorage) {
    const snapshot = structuredClone(state);
    snapshot.updatedAt = new Date().toISOString();
    storage.setItem(this.keyForMode(snapshot.gameMode), JSON.stringify(snapshot));
    storage.setItem(this.key, JSON.stringify(snapshot));
    return snapshot;
  }

  static load(storage = localStorage, mode = null) {
    const raw = storage.getItem(mode?this.keyForMode(mode):this.key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      parsed.gameMode = normalizeGameMode(parsed.gameMode);
      parsed.scenario = migrateScenarioState(parsed.gameMode, parsed.scenario);
      parsed.job = migrateJob(parsed.job);
      parsed.player = migratePlayerProfile(parsed.player);
      parsed.world = migrateWorldState(parsed.world,parsed.player);
      migrateHeroineProfile(parsed.partner);
      migrateVisualState(parsed);
      parsed.npcs=migrateNpcRoster(parsed.npcs);
      parsed.npcHistory ??= [];
      parsed.worldEncounterHistory ??= [];
      parsed.worldEncounterRoutes = migrateWorldEncounterRoutes(parsed.worldEncounterRoutes);
      parsed.temptationHistory ??= [];
      parsed.rivalHistory ??= [];
      parsed.breakup ??= null;
      parsed.memories ??= [];
      parsed.initiatedMessages ??= [];
      parsed.conversationHistory ??= [];
      parsed.storyHistory ??= [];
      parsed.storyFlags ??= {};
      parsed.futureScore ??= 0;
      parsed.pendingStoryId ??= null;
      parsed.cgCollection ??= [];
      parsed.videoCollection ??= [];
      parsed.conversationSafety ??= {hostileCount:0,lastHostileDay:null};
      parsed.girlfriendLoan = migrateGirlfriendLoanState(parsed.girlfriendLoan);
      parsed.yujinSecretRoute = migrateYujinSecretRouteState(parsed.yujinSecretRoute);
      parsed.situationEventStates ??= {};
      parsed.futureEventWeights ??= {};
      parsed.microEventHistory ??= [];
      parsed.eventRuntime ??= {activeEvent:null,scene:null,dialogueIndex:0,state:"IDLE",inputLock:{locked:false,owner:null,reason:null,lockedFor:0},eventQueue:[],microQueue:[],pendingEvent:null,triggerReason:[],assetStatus:"IDLE",checkpoint:null,lastError:null,logs:[]};
      const savedGuideCompleted=parsed.settings?.guideCompleted;
      parsed.settings={
        theaterMode:parsed.settings?.theaterMode!==false,
        guideEnabled:parsed.settings?.guideEnabled!==false,
        guideCompleted:{
          main:Boolean(savedGuideCompleted?.main),
          atlas:Boolean(savedGuideCompleted?.atlas),
          district:Boolean(savedGuideCompleted?.district),
          room:Boolean(savedGuideCompleted?.room),
          map:Boolean(savedGuideCompleted?.map)
        }
      };
      parsed.hiddenRoute ??= createHiddenRouteState(Math.random,false);
      parsed.investment = migrateInvestmentState(parsed.investment);
      parsed.lottery ??= createLotteryState();
      parsed.finance ??= createAdvancedEconomyState();
      parsed.finance.bonds ??= [];
      parsed.finance.bondInterestEarned ??= 0;
      parsed.dayStartSnapshot ??= createDaySnapshot(parsed);
      parsed.nightState ??= null;
      migrateStoryDirectorState(parsed);
      return validateState(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  static clear(storage = localStorage, mode = null) {
    if(mode){storage.removeItem(this.keyForMode(mode));return;}
    storage.removeItem(this.key);
    storage.removeItem(this.keyForMode("free-romance"));
    storage.removeItem(this.keyForMode("marriage-in-30-days"));
  }
}
