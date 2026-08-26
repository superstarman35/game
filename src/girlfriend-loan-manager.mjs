import { recordTransaction } from "./economy-manager.mjs";

export const GIRLFRIEND_LOAN_MIN_TRUST = 500;
export const GIRLFRIEND_LOAN_MIN_AMOUNT = 100000;
export const GIRLFRIEND_LOAN_MAX_AMOUNT = 300000;
export const GIRLFRIEND_LOAN_STEP = 10000;

export function createGirlfriendLoanState(){
  return {borrowed:false,amount:0,day:null};
}

export function migrateGirlfriendLoanState(value){
  if(!value||typeof value!=="object")return createGirlfriendLoanState();
  const borrowed=value.borrowed===true,amount=borrowed&&Number.isFinite(value.amount)?Math.round(value.amount):0,day=borrowed&&Number.isInteger(value.day)?value.day:null;
  return {borrowed,amount,day};
}

export function validateGirlfriendLoanState(value){
  return Boolean(value)&&typeof value.borrowed==="boolean"&&Number.isFinite(value.amount)&&value.amount>=0&&(value.day===null||Number.isInteger(value.day));
}

export function getGirlfriendLoanAmount(seed=0){
  const slots=((GIRLFRIEND_LOAN_MAX_AMOUNT-GIRLFRIEND_LOAN_MIN_AMOUNT)/GIRLFRIEND_LOAN_STEP)+1,index=Math.abs(Math.trunc(Number(seed)||0))%slots;
  return GIRLFRIEND_LOAN_MIN_AMOUNT+index*GIRLFRIEND_LOAN_STEP;
}

export function applyGirlfriendLoan(state,amount){
  state.girlfriendLoan=migrateGirlfriendLoanState(state.girlfriendLoan);
  if(state.girlfriendLoan.borrowed)return {ok:false,reason:"already-borrowed",amount:0};
  if(Number(state.trust)<GIRLFRIEND_LOAN_MIN_TRUST)return {ok:false,reason:"low-trust",amount:0};
  const normalized=Math.max(GIRLFRIEND_LOAN_MIN_AMOUNT,Math.min(GIRLFRIEND_LOAN_MAX_AMOUNT,Math.round((Number(amount)||GIRLFRIEND_LOAN_MIN_AMOUNT)/GIRLFRIEND_LOAN_STEP)*GIRLFRIEND_LOAN_STEP));
  const partnerName=state.partner?.name??"여자친구";
  const transaction=recordTransaction(state,{day:state.day,category:"girlfriend-loan",label:`${partnerName}에게 빌린 돈`,amount:normalized});
  state.girlfriendLoan={borrowed:true,amount:normalized,day:state.day};
  state.logs??=[];
  state.logs.push({time:`DAY ${state.day} · LOAN`,text:`${partnerName}에게 ${normalized.toLocaleString("ko-KR")}원을 빌렸다. 보유 자산에 즉시 반영됐다.`});
  return {ok:true,reason:null,amount:normalized,transaction,balance:state.money};
}
