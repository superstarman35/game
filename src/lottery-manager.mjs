import { recordTransaction } from "./economy-manager.mjs";

export const LOTTERY_TICKET_PRICE = 5000;
export const DAILY_TICKET_LIMIT = 3;

export const LOTTERY_PRIZES = [
  { id:"first", label:"1등", threshold:0.0005, prize:10000000 },
  { id:"second", label:"2등", threshold:0.0055, prize:5000000 },
  { id:"third", label:"3등", threshold:0.0255, prize:500000 },
  { id:"fourth", label:"4등", threshold:0.1155, prize:50000 },
  { id:"fifth", label:"5등", threshold:0.3355, prize:5000 },
  { id:"miss", label:"꽝", threshold:1, prize:0 }
];

export function createLotteryState() {
  return { purchases:[], totalSpent:0, totalWon:0 };
}

export function validateLotteryState(lottery) {
  return Boolean(lottery) && Array.isArray(lottery.purchases) && Number.isFinite(lottery.totalSpent) && lottery.totalSpent >= 0 && Number.isFinite(lottery.totalWon) && lottery.totalWon >= 0 && lottery.purchases.every(entry => Number.isInteger(entry.day) && Number.isFinite(entry.cost) && Number.isFinite(entry.prize) && typeof entry.tierId === "string");
}

export function getDailyLotteryCount(state, day = state.day) {
  return (state.lottery?.purchases ?? []).filter(entry => entry.day === day).length;
}

export function getLotterySummary(state) {
  const lottery = state.lottery ?? createLotteryState();
  return { tickets:lottery.purchases.length, spent:lottery.totalSpent, won:lottery.totalWon, net:lottery.totalWon-lottery.totalSpent, today:getDailyLotteryCount(state) };
}

export function buyInstantLottery(state, random = Math.random) {
  state.lottery ??= createLotteryState();
  if (getDailyLotteryCount(state) >= DAILY_TICKET_LIMIT) return { ok:false, reason:`오늘은 최대 ${DAILY_TICKET_LIMIT}장까지 구매할 수 있습니다.` };
  if (state.money < LOTTERY_TICKET_PRICE) return { ok:false, reason:"복권을 살 자산이 부족합니다." };
  const roll = Math.max(0, Math.min(0.999999, Number(random()) || 0));
  const tier = LOTTERY_PRIZES.find(entry => roll < entry.threshold) ?? LOTTERY_PRIZES.at(-1);
  recordTransaction(state,{category:"lottery",label:"즉석복권 구매",amount:-LOTTERY_TICKET_PRICE});
  if (tier.prize > 0) recordTransaction(state,{category:"lottery",label:`즉석복권 ${tier.label}`,amount:tier.prize});
  const entry = { day:state.day, cost:LOTTERY_TICKET_PRICE, prize:tier.prize, tierId:tier.id, label:tier.label };
  state.lottery.purchases.push(entry);
  state.lottery.totalSpent += LOTTERY_TICKET_PRICE;
  state.lottery.totalWon += tier.prize;
  return { ok:true, ...entry };
}
