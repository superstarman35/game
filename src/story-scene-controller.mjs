const POSITIVE_PATTERN = /고마|좋아|충분|기억|믿|함께|안심|재밌|행복/;
const NEGATIVE_PATTERN = /화나|무서|부담|서운|의심|답답|거짓말|미안/;

export function resolveInitialScenePresentation(presentation={},sequence=[]){
  const characterStep=sequence.find(step=>step?.characterId);
  const backgroundStep=sequence.find(step=>step?.backgroundId);
  return {
    ...presentation,
    characterId:characterStep?.characterId??presentation.characterId,
    expressionId:characterStep?.expressionId??presentation.expressionId,
    poseId:characterStep?.poseId??presentation.poseId,
    outfitId:characterStep?.outfitId??presentation.outfitId,
    backgroundId:backgroundStep?.backgroundId??presentation.backgroundId,
    weather:backgroundStep?.weather??presentation.weather,
    timeOfDay:backgroundStep?.timeOfDay??presentation.timeOfDay
  };
}

export function inferReactionExpression(text = "") {
  if (NEGATIVE_PATTERN.test(text)) return "tense";
  if (/걱정|아쉬|시간|침묵|천천히/.test(text)) return "worried";
  if (POSITIVE_PATTERN.test(text)) return "smile";
  return "calm";
}

export function createStorySceneSequence(scene, presentation, choices = scene.choices) {
  const dialogue = scene.dialogueTurns?.length
    ? scene.dialogueTurns.map(turn=>({...turn,characterId:presentation.characterId,backgroundId:presentation.backgroundId}))
    : [{ type:"dialogue", speaker:scene.speaker, text:scene.question ?? scene.prompt ?? scene.title, expressionId:presentation.expressionId }];
  return [
    { type:"transition", style:"fade", label:`DAY ${scene.window?.[0] ?? ""} · ${scene.arc}` },
    { type:"narration", text:scene.message },
    { type:"characterEnter", characterId:presentation.characterId, animationId:presentation.animationId },
    ...dialogue,
    { type:"choice", options:choices.map(choice => ({ id:choice.id, label:choice.label })) }
  ];
}

export function createStoryReactionSequence(result) {
  const expressionId = inferReactionExpression(result.response);
  return [
    { type:"narration", text:`나는 “${result.choice.label}”라고 답했다.` },
    { type:"expressionChange", expressionId },
    { type:"dialogue", speaker:result.scene.speaker, text:result.response, expressionId },
    ...(result.mbtiAdjustment?.label?[{type:"narration",text:`${result.mbtiAdjustment.label}에 맞는 반응이 관계 수치에 추가로 반영됐다.`}]:[]),
    { type:"transition", style:"fade", label:"시간은 다시 일상으로 흐른다." },
    { type:"sceneEnd" }
  ];
}

export function createEventSceneSequence(event) {
  if(event.scenes?.length){
    if(event.category==="temptation"){
      const scene=event.scenes[0];
      const heroineLine=scene.dialogueTurns.find(turn=>turn.type==="dialogue"&&turn.speaker!=="플레이어")?.text??event.hook??event.message;
      return [
        {type:"transition",style:scene.transition,label:event.title,backgroundId:scene.backgroundId,characterId:scene.characterIds[0],expressionId:scene.expression,poseId:scene.pose,outfitId:scene.outfit,bgmId:scene.bgmId,sfxId:scene.sfxId,weather:scene.weather,timeOfDay:scene.timeOfDay},
        {type:"narration",text:event.hook??event.message,backgroundId:scene.backgroundId,characterId:scene.characterIds[0]},
        {type:"characterEnter",characterId:scene.characterIds[0],expressionId:scene.expression,animationId:scene.animation},
        {type:"dialogue",speaker:event.npcName??"유진",text:`${heroineLine}\n\n${event.question}`,expressionId:scene.expression,backgroundId:scene.backgroundId,characterId:scene.characterIds[0]},
        {type:"choice",options:event.choices.map(choice=>({id:choice.id,label:choice.label}))}
      ];
    }
    const sequence=[];
    for(const scene of event.scenes){
      if(scene.transition!=="none")sequence.push({type:"transition",style:scene.transition,label:scene.title,backgroundId:scene.backgroundId,characterId:scene.characterIds[0],expressionId:scene.expression,poseId:scene.pose,outfitId:scene.outfit,bgmId:scene.bgmId,sfxId:scene.sfxId,weather:scene.weather,timeOfDay:scene.timeOfDay});
      sequence.push(...scene.dialogueTurns.map(turn=>({...turn,backgroundId:scene.backgroundId,characterId:scene.characterIds[0],poseId:scene.pose,outfitId:scene.outfit,bgmId:scene.bgmId,sfxId:scene.sfxId,weather:scene.weather,timeOfDay:scene.timeOfDay})));
    }
    if(event.question)sequence.push({type:"narration",text:event.question});
    sequence.push({type:"choice",options:event.choices.map(choice=>({id:choice.id,label:choice.label}))});
    return sequence;
  }
  return [
    { type:"transition", style:"blur", label:event.title },
    { type:"narration", text:event.message },
    { type:"sceneEnd" }
  ];
}

export function createTemptationSceneSequence(encounter, message) {
  return [
    { type:"transition", style:"slide", label:`${encounter.npc.role} · ${encounter.npc.name}` },
    { type:"narration", text:message },
    { type:"characterEnter", characterId:encounter.npc.id, animationId:"soft-sway" },
    { type:"dialogue", speaker:encounter.npc.name, text:"잠깐, 이야기 좀 할래?", expressionId:"calm" },
    { type:"choice", options:encounter.choices }
  ];
}

export function createTemptationReactionSequence(npc, choiceId) {
  const responses = {
    reject:"알겠어. 확실하게 말해 줘서 고마워.",
    friend:"그래, 부담 주지 않을게. 편한 동료로 지내자.",
    secret:"좋아. 이 이야기는 우리 둘만 아는 거야."
  };
  const expressionId = choiceId === "secret" ? "smile" : choiceId === "reject" ? "worried" : "calm";
  return [
    { type:"expressionChange", expressionId },
    { type:"dialogue", speaker:npc.name, text:responses[choiceId] ?? "알겠어.", expressionId },
    { type:"narration", text:"선택의 의미는 숫자가 아니라 앞으로의 관계에 남을 것이다." },
    { type:"sceneEnd" }
  ];
}

export function validateSceneSequence(sequence) {
  const allowed = new Set(["transition","narration","characterEnter","dialogue","expressionChange","animation","sfx","itemShow","choice","cgShow","sceneEnd"]);
  return Array.isArray(sequence) && sequence.length > 0 && sequence.every(step => step && allowed.has(step.type));
}
