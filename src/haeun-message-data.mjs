import { GIRLFRIEND_LOAN_MIN_TRUST, getGirlfriendLoanAmount } from "./girlfriend-loan-manager.mjs?v=1";

const EMOTIONAL_FOLLOW_UPS = Object.freeze([
  "그래서 너는 어떻게 생각해?",
  "네 이야기도 조금 더 듣고 싶어.",
  "오늘은 서두르지 말고 천천히 이야기하자.",
  "내가 놓친 부분이 있으면 솔직하게 말해 줘.",
  "지금 네 기분은 어떤지 궁금해.",
  "다음 이야기도 부담 없이 해 줘.",
  "너라면 어떤 방향이 가장 편할 것 같아?",
  "나는 네 선택을 존중하면서 듣고 있을게.",
  "우리 둘이 맞출 수 있는 방법을 찾아보자.",
  "지금 가장 먼저 떠오르는 건 뭐야?",
  "길게 설명하지 않아도 괜찮아.",
  "지금 당장 결론을 내리지 않아도 돼.",
  "오늘 이야기한 내용은 가볍게 넘기지 않을게.",
  "네 속도에 맞춰서 대화를 이어 가자.",
  "궁금한 건 돌려 말하지 말고 물어봐도 돼.",
  "내가 먼저 물어봐 주길 바라는 게 있어?",
  "조금 더 구체적으로 들려줄래?",
  "지금 필요한 게 공감인지 조언인지 알려 줘.",
  "함께 정리하면 생각보다 단순해질 수도 있어.",
  "나는 계속 네 말을 듣고 있을게."
]);

const AFFECTION_FOLLOW_UPS = Object.freeze([
  "네가 같은 마음인지 솔직하게 들려줘.",
  "우리에게 오래 남을 말로 기억하고 싶어.",
  "다음에 만나면 눈을 보고 다시 이야기해 줘.",
  "표현이 서툰 날에도 마음을 숨기지는 말자.",
  "서로 당연하게 여기지 않는 사이였으면 좋겠어.",
  "오늘처럼 먼저 마음을 꺼내 줘서 좋아.",
  "나도 내 마음을 더 분명하게 표현할게.",
  "우리 둘이 편한 방식으로 자주 확인하자.",
  "말한 뒤의 행동까지 함께 이어졌으면 해.",
  "이런 대화를 나눌 수 있어서 마음이 놓여.",
  "작은 약속도 지키면서 천천히 가까워지자.",
  "네가 기억하고 싶은 순간도 하나 말해 줘.",
  "내가 해 주길 바라는 표현이 있다면 알려 줘.",
  "좋은 마음을 부담으로 만들지는 않았으면 해.",
  "우리 사이의 속도는 둘이 같이 정하자.",
  "나도 오늘 이 말을 오래 기억할 것 같아.",
  "앞으로도 어려운 마음까지 숨기지 말자.",
  "지금 네 표정을 직접 볼 수 있으면 좋겠다.",
  "다음 이야기는 만나서 천천히 이어 가자.",
  "네 마음을 들은 만큼 나도 솔직해질게."
]);

const PLANNING_FOLLOW_UPS = Object.freeze([
  "우선 오늘 할 수 있는 한 가지부터 정해 보자.",
  "가능한 선택지를 두세 개로 줄이면 결정하기 쉬울 거야.",
  "시간과 비용을 먼저 확인한 뒤 계획을 세우자.",
  "네가 가장 중요하게 보는 기준부터 말해 줘.",
  "무리해서 전부 해결하려고 하지는 말자.",
  "필요하면 순서를 같이 적어 보자.",
  "지금 미뤄도 되는 일은 과감하게 나눠 두자.",
  "네가 결정하면 내가 확인을 도와줄게.",
  "현실적으로 지킬 수 있는 방법을 골랐으면 해.",
  "결과보다 계속 유지할 수 있는지가 더 중요해.",
  "급한 일과 중요한 일을 먼저 구분해 보자.",
  "서로 맡을 부분이 있다면 분명하게 정하자.",
  "계획이 바뀌어도 미리 말해 주면 괜찮아.",
  "필요한 정보가 무엇인지부터 확인해 보자.",
  "한 번에 완벽하게 정하지 않아도 돼.",
  "네 일정에서 여유가 생기는 시간부터 찾아보자.",
  "선택한 이유까지 이야기하면 서로 이해하기 쉬울 거야.",
  "내 의견이 필요하면 현실적으로 말해 줄게.",
  "작게 시작한 뒤 상황을 보고 조정하자.",
  "결정하기 전에 놓친 조건이 없는지 같이 확인해 보자."
]);

const CASUAL_FOLLOW_UPS = Object.freeze([
  "오늘 있었던 일도 조금 더 들려줘.",
  "지금 네가 가장 하고 싶은 건 뭐야?",
  "사소한 이야기라도 네가 먼저 말해 주면 좋아.",
  "나도 내 이야기를 하나 더 해 줄게.",
  "이렇게 편하게 연락하는 시간이 나는 좋아.",
  "지금 기분을 한 단어로 말하면 뭐라고 할래?",
  "다음에는 사진도 한 장 보내 줘.",
  "잠깐이어도 서로의 하루를 나눠서 다행이야.",
  "그다음에는 무슨 일이 있었어?",
  "네 말투를 보니 오늘 분위기가 조금 느껴져.",
  "지금 옆에 있었다면 더 자세히 물어봤을 것 같아.",
  "편하게 생각나는 것부터 말해 줘.",
  "오늘의 작은 좋은 일도 하나 찾아보자.",
  "내가 궁금한 걸 하나 물어봐도 돼?",
  "다음에 만나면 이 이야기부터 이어서 하자.",
  "짧게라도 먼저 연락해 줘서 반가워.",
  "너와 이야기하니 내 하루도 정리되는 기분이야.",
  "오늘은 무거운 결론 없이 편하게 이야기하자.",
  "네가 웃을 만한 이야기도 하나 들려줘.",
  "나는 지금 네 답장을 기다리고 있을게."
]);

const TOPIC_GROUPS = Object.freeze({
  apology:"emotional",fatigue:"emotional",sadness:"emotional",anger:"emotional",anxiety:"emotional",health:"emotional",conflict:"emotional",
  love:"affection",missing:"affection",gratitude:"affection",gift:"affection",memory:"affection",future:"affection",family:"affection",
  work:"planning",date:"planning",weekend:"planning",friends:"planning",money:"planning",encouragement:"planning",
  happiness:"casual",meal:"casual",sleep:"casual",daily:"casual",general:"casual"
});

const FOLLOW_UP_GROUPS = Object.freeze({emotional:EMOTIONAL_FOLLOW_UPS,affection:AFFECTION_FOLLOW_UPS,planning:PLANNING_FOLLOW_UPS,casual:CASUAL_FOLLOW_UPS});

const SHORT_TOPIC_PHRASES = Object.freeze({
  apology:"미안한 마음",love:"좋아한다는 말",missing:"보고 싶은 마음",gratitude:"고맙다는 말",fatigue:"피곤한 이야기",
  sadness:"속상한 마음",anger:"화난 일",anxiety:"걱정되는 일",happiness:"기쁜 일",work:"회사 이야기",
  meal:"밥 이야기",sleep:"잠 이야기",health:"몸 상태",date:"데이트 이야기",weekend:"주말 계획",
  gift:"선물 이야기",memory:"우리 기억",future:"우리 미래",family:"가족 이야기",friends:"친구 이야기",
  money:"돈 이야기",conflict:"서운했던 일",encouragement:"응원할 일",daily:"오늘 하루",general:"네 이야기"
});

const SHORT_OPENERS = Object.freeze([
  "응, {topic}은 들었어.","{topic} 때문이구나.","알겠어. {topic} 이야기네.","{topic}에 관한 말이지?", "그래, {topic}부터 보자.",
  "응. {topic} 더 말해 줘.","{topic}에 네 마음이 있구나.","네가 말한 {topic}, 기억할게.","{topic}라면 듣고 있어.","응, {topic}이 중요하구나."
]);

const SHORT_TAILS = Object.freeze([
  "조금만 더 말해 줘.","응.","그래.","알겠어.","계속 말해 줘.","천천히 해도 돼.","나는 듣고 있어.","그랬구나.","네 마음은 알겠어.","지금은 괜찮아.",
  "나도 생각해 볼게.","짧게 말해도 돼.","무슨 뜻인지 알겠어.","오늘은 여기부터 얘기하자.","그다음은?", "그래서 어떻게 됐어?", "네 생각은 어때?", "조금 궁금해.","나한테 말해 줘서 고마워.","만나서도 얘기하자."
]);

export const HAEUN_REFUSAL_REPLIES = Object.freeze([
  "무슨 말을 하려는지 잘 모르겠어. 지금은 대답하고 싶지 않아.",
  "그런 식으로 말하면 대화를 이어 가고 싶지 않아.",
  "장난인지 모르겠지만 조금 불편해. 지금은 답하지 않을게.",
  "말을 정리해서 다시 해 줘. 지금 메시지에는 대답하고 싶지 않아.",
  "무슨 뜻인지 설명해 주기 전에는 대답하지 않을래.",
  "나를 불편하게 만드는 말에는 굳이 답하고 싶지 않아.",
  "지금 말투는 이해하기도 어렵고 편하지도 않아. 잠깐 대화를 쉬자.",
  "그 요구에는 대답하지 않을게. 서로 존중하는 말로 다시 이야기해 줘.",
  "억지로 답을 요구하면 더 말하고 싶지 않아져.",
  "그런 이야기는 싫어. 지금은 다른 대화도 하고 싶지 않아.",
  "계속 그런 식으로 보내면 오늘 대화는 여기서 끝낼게.",
  "내가 싫다고 느끼는 말에는 분명하게 대답하지 않겠다고 말할게."
]);

const HAEUN_LOAN_APPROVAL_REPLIES = Object.freeze([
  "응. 이번 한 번만 {amount}원 빌려줄게. 꼭 필요한 데 써.",
  "지금 바로 {amount}원 보냈어. 한 번만 도와주는 거니까 계획해서 써 줘.",
  "네가 필요하다고 하니 {amount}원 빌려줄게. 다음에는 미리 이야기해 줘.",
  "알겠어. {amount}원은 내가 빌려줄 수 있어. 이번 한 번만이야.",
  "믿고 {amount}원 보냈어. 급한 일부터 해결하고 나중에 상황을 알려 줘.",
  "이번에는 내가 도와줄게. {amount}원이 보유 자산에 들어갔을 거야."
]);

const HAEUN_LOAN_LOW_TRUST_REPLIES = Object.freeze([
  "내가 왜 너한테 돈을 빌려줘야 해? 지금은 그 정도로 믿기 어려워.",
  "미안하지만 지금 우리 신뢰로는 돈을 빌려줄 수 없어.",
  "돈 문제는 믿음이 있어야 가능해. 지금은 빌려주지 않을게.",
  "아직은 선뜻 돈을 보낼 만큼 마음이 놓이지 않아.",
  "지금 관계에서는 돈을 빌려달라는 부탁이 부담스러워. 거절할게.",
  "신뢰가 더 쌓이기 전에는 돈을 빌려주는 일은 하지 않을래."
]);

const HAEUN_LOAN_REPEAT_REPLIES = Object.freeze([
  "전에 한 번 빌려줬잖아. 이번에는 더 빌려줄 수 없어.",
  "이미 도와준 돈이 있어서 추가로 빌려주는 건 어려워.",
  "이번 한 번만이라고 했어. 같은 부탁에는 더 답해 줄 수 없어.",
  "먼저 전에 빌린 돈부터 정리해 줘. 추가 대여는 하지 않을게.",
  "돈을 계속 빌려주는 관계가 되고 싶지는 않아. 이번에는 안 돼.",
  "이미 한 차례 도와줬으니 이번 부탁은 거절할게."
]);

const UNCOMFORTABLE_MESSAGE_PATTERNS = Object.freeze([
  /(?:벗어|야한|노출|몸매|가슴|잠자리)/,
  /(?:사진|영상).{0,8}(?:당장|빨리).{0,5}(?:보내|보여)/,
  /(?:시키는\s*대로|내\s*말만\s*들어|여자친구면\s*당연|말대꾸\s*하지)/,
  /(?:대답|답장).{0,8}(?:당장|빨리|명령)/,
  /(?:복종|명령).{0,8}(?:해|따라)/
]);

const topic = (id, label, patterns, responses, continuations, effects={affection:3,trust:3}) => Object.freeze({
  id,label,patterns:Object.freeze(patterns),responses:Object.freeze(responses),continuations:Object.freeze(continuations),effects:Object.freeze(effects)
});

export const HAEUN_MESSAGE_TOPICS = Object.freeze([
  topic("apology","사과",[/미안|사과|잘못했|내 탓/],[
    "미안하다고 먼저 말해 줘서 고마워. 나는 그 말을 가볍게 듣지 않았어.",
    "무슨 일이 있었는지보다 책임을 피하지 않은 태도가 먼저 보여서 고마워.",
    "바로 괜찮다고 할 수는 없어도 솔직하게 사과해 준 건 고마워.",
    "변명보다 네 마음을 먼저 말해 줘서 고마워. 이제 차분히 풀어 보면 될 것 같아.",
    "내가 서운했던 부분을 인정해 줘서 고마워. 같은 일이 반복되지 않는 게 더 중요해."
  ],["사과한 이유와 앞으로 달라질 행동을 함께 말해 주면 더 믿을 수 있을 것 같아.","나는 감정적인 약속보다 지킬 수 있는 방법을 같이 정하고 싶어."],{affection:3,trust:5,conflict:-2,relationshipStress:-2}),
  topic("love","애정 표현",[/사랑|좋아해|소중|내 사람/],[
    "그 말을 들으면 아직도 조금 설레. 나도 {player}을 많이 좋아해.",
    "평범한 날에 좋아한다고 말해 주는 게 오히려 더 진심처럼 느껴져.",
    "나도 같은 마음이야. 말뿐 아니라 우리가 함께 만든 시간까지 소중해.",
    "좋아한다는 말을 당연하게 여기지 않을게. 오늘은 특히 더 따뜻하게 들려.",
    "나도 {player}이 내 편이라는 생각이 들 때 가장 마음이 놓여."
  ],["우리에게 애정 표현이 자연스러운 습관이 되면 좋겠어.","지금처럼 솔직하게 마음을 확인하면서 오래 만나고 싶어."],{affection:5,trust:3,excitement:3}),
  topic("missing","그리움",[/보고\s*싶|그리워|생각났|생각나/],[
    "나도 네 생각이 났어. 바쁜 중에도 메시지가 오면 먼저 확인하게 되더라.",
    "보고 싶다는 말은 짧은데 하루의 분위기를 바꿔 놓는 것 같아.",
    "나도 만나고 싶어. 무리해서 시간을 만들기보다 편한 시간을 제대로 잡자.",
    "오늘 유난히 네가 떠올랐는데 먼저 말해 줘서 조금 웃었어.",
    "떨어져 있어도 서로를 생각하고 있다는 걸 알면 마음이 안정돼."
  ],["언제 잠깐이라도 얼굴을 볼 수 있을지 일정을 맞춰 보자.","다음에 만나면 하고 싶었던 이야기부터 천천히 나누자."],{affection:5,trust:2,excitement:4}),
  topic("gratitude","고마움",[/고마|감사|덕분/],[
    "그렇게 말해 주니 내가 한 일이 부담이 아니었다는 걸 알겠어.",
    "고맙다는 말을 바로 전해 주는 네 태도가 나는 좋아.",
    "나도 네가 내 일상을 챙겨 줄 때 자주 고맙다고 느껴.",
    "당연한 일처럼 넘기지 않고 알아봐 줘서 마음이 따뜻해졌어.",
    "서로 고마운 일을 말로 남기는 게 관계를 오래 지켜 주는 것 같아."
  ],["다음에는 나도 네가 고마웠던 일을 하나 이야기해 줄게.","우리 사이에서는 작은 배려도 당연하게 여기지 않았으면 좋겠어."],{affection:4,trust:4}),
  topic("fatigue","피로",[/피곤|지쳤|지쳐|졸려|힘들|기운\s*없/],[
    "많이 지쳤구나. 지금은 더 잘하려고 애쓰기보다 제대로 쉬는 게 먼저야.",
    "오늘 버틴 것만으로도 충분해. 남은 일은 내일의 네가 해도 괜찮아.",
    "피곤할 때는 작은 일도 크게 느껴져. 물부터 마시고 잠깐 몸을 쉬게 해 줘.",
    "네 상태를 숨기지 않고 말해 줘서 다행이야. 무리하는 건 오래 갈 방법이 아니야.",
    "오늘은 해결책을 많이 세우지 말자. 씻고 편하게 누울 수 있는 것부터 하자."
  ],["내가 조용히 들어 주는 게 좋을지, 쉬라고 말해 주는 게 좋을지 알려 줘.","내일 일정 중 미뤄도 되는 일을 하나만 골라 보는 것도 좋겠어."],{affection:4,trust:4,stress:-3}),
  topic("sadness","슬픔",[/속상|우울|슬퍼|외로|눈물|마음이\s*아/],[
    "속상했겠다. 괜찮은 척 정리해서 말하지 않아도 돼.",
    "그 마음을 혼자 오래 들고 있었던 건 아니지? 지금은 내가 같이 들어 줄게.",
    "당장 기분을 바꾸려고 하지 않아도 돼. 슬픈 이유부터 천천히 말해 줘.",
    "네가 약해진 게 아니라 그만큼 중요한 일이었다는 뜻일 수 있어.",
    "외롭다고 느낀 순간에 내가 곁에 없었던 것 같아 마음이 쓰여."
  ],["내가 판단하지 않고 듣는 것부터 시작할게.","오늘은 네 감정을 해결해야 할 문제처럼 다루지 않을게."],{affection:4,trust:5,relationshipStress:-2}),
  topic("anger","분노",[/화나|화가|짜증|열받|억울/],[
    "그 상황이라면 화날 만해. 먼저 무슨 일이었는지 순서대로 들어 볼게.",
    "감정을 억지로 누르지는 말자. 다만 네가 다치지 않는 방식으로 풀었으면 해.",
    "억울한 부분과 단순히 짜증 난 부분을 나누면 대응하기 조금 쉬워질 거야.",
    "지금 바로 상대에게 답하면 후회할 수 있어. 메시지는 잠깐 저장해 두는 게 어때?",
    "네 편을 들어 주고 싶지만 사실관계도 같이 확인하면 더 제대로 도울 수 있어."
  ],["마음이 조금 가라앉으면 원하는 결과가 무엇인지부터 정리해 보자.","지금은 같이 화내 주는 게 필요한지 현실적인 방법이 필요한지 말해 줘."],{affection:3,trust:4,stress:-2}),
  topic("anxiety","걱정과 불안",[/걱정|불안|무서|긴장|초조/],[
    "아직 일어나지 않은 일까지 한꺼번에 생각하고 있구나. 확인된 사실부터 나눠 보자.",
    "불안할 때는 가능성과 확정된 일을 구분하는 게 도움이 돼. 내가 같이 정리해 줄게.",
    "걱정된다는 말만으로도 충분해. 이유를 완벽하게 설명할 필요는 없어.",
    "혼자 결론을 최악으로 만들지 않았으면 해. 확인할 수 있는 것부터 하나씩 보자.",
    "긴장한 상태에서는 몸도 쉽게 지쳐. 숨을 고르고 지금 할 수 있는 한 가지만 정하자."
  ],["내가 확인을 도울 수 있는 부분이 있으면 구체적으로 말해 줘.","오늘 해결할 일과 내일 생각할 일을 따로 나누면 좋겠어."],{affection:3,trust:5,stress:-3}),
  topic("happiness","기쁜 일",[/행복|기뻐|신나|재밌|좋은\s*일|잘됐/],[
    "좋은 일이 있었구나. 네가 신난 게 메시지에서도 느껴져서 나도 기분이 좋아.",
    "그 기쁨을 제일 먼저 나와 나눠 줬다는 게 더 반가워.",
    "잘됐다. 네가 그동안 애쓴 걸 아니까 결과가 더 값지게 느껴져.",
    "오늘 같은 날은 이유를 분석하기보다 충분히 기뻐해도 돼.",
    "네가 웃을 만한 일이 생기면 나도 하루가 조금 밝아지는 것 같아."
  ],["어떤 순간이 제일 좋았는지 자세히 들려줘.","다음에 만나면 그 일을 같이 축하하자."],{affection:4,trust:3,excitement:4}),
  topic("work","직장과 업무",[/회사|직장|업무|야근|상사|회의|프로젝트|출근|퇴근/],[
    "오늘 일 때문에 마음이 많이 쓰였구나. 결과와 네 가치를 같은 것으로 보지는 않았으면 해.",
    "업무가 꼬이면 전부 급해 보이지만 우선순위를 다시 정하면 숨통이 조금 트일 거야.",
    "상대의 요구와 네 책임 범위를 분리해서 생각해 보자. 모든 문제를 네가 떠안을 필요는 없어.",
    "야근이 반복되면 성실함보다 회복이 먼저 무너져. 이번 주 일정은 현실적으로 조정해야 해.",
    "회의에서 있었던 일과 네가 느낀 감정은 둘 다 중요해. 하나씩 이야기해 줘."
  ],["원하면 해야 할 일과 거절해도 될 일을 같이 구분해 보자.","오늘은 업무 평가보다 네가 어떻게 버텼는지를 먼저 듣고 싶어."],{affection:3,trust:4,stress:-2}),
  topic("meal","식사",[/밥|먹었|먹을|점심|저녁|아침|배고|메뉴|야식/],[
    "아직 못 먹었다면 너무 늦기 전에 간단한 것이라도 챙겨 먹어. 빈속으로 버티지는 말고.",
    "오늘 먹은 것만 들어도 하루가 어땠는지 조금 보이는 것 같아. 제대로 챙겼어?",
    "메뉴를 고르는 중이면 지금 몸이 원하는 게 따뜻한 음식인지 가벼운 음식인지부터 생각해 봐.",
    "혼자 먹기 싫은 날도 있지. 다음에는 시간을 맞춰서 같이 먹자.",
    "맛있는 걸 먹었다니 다행이야. 다음에 나도 데려가 줘."
  ],["오늘 식사 중 가장 괜찮았던 건 뭐였어?","다음에 같이 먹을 메뉴도 하나 정해 둘까?"],{affection:3,trust:2,health:1}),
  topic("sleep","수면",[/잘\s*자|자러|잠이|잠들|꿈|불면|밤새/],[
    "오늘은 휴대폰을 조금 일찍 내려놓고 푹 잤으면 좋겠어.",
    "잠이 안 오면 억지로 버티지 말고 조명을 낮춘 뒤 몸부터 쉬게 해 줘.",
    "잘 자라는 말을 하기 전에 오늘 마음에 남은 일을 하나만 내려놓자.",
    "밤새 생각한다고 답이 선명해지는 건 아니니까 내일의 너에게 조금 맡겨도 돼.",
    "좋은 꿈을 꾸라는 말보다 편하게 깊이 잤으면 좋겠다는 말이 더 맞는 것 같아."
  ],["내일 일어나면 짧게라도 잘 잤다고 알려 줘.","잠들기 전에 마지막으로 하고 싶은 말이 있으면 들어 줄게."],{affection:4,trust:3,stress:-2}),
  topic("health","건강",[/아파|병원|감기|두통|건강|약\s|열이|다쳤/],[
    "아픈 걸 참는 건 성실한 게 아니야. 증상이 계속되면 꼭 진료를 받아.",
    "지금은 일정보다 몸 상태가 먼저야. 물과 약, 식사를 제대로 챙겼는지 확인해 줘.",
    "괜찮다고 단정하지 말고 통증이 언제부터 어떻게 이어졌는지 살펴보자.",
    "내가 걱정하지 않게 하려고 숨기지는 않았으면 해. 정확히 말해 주는 게 더 안심돼.",
    "회복할 때까지 무리한 운동이나 술은 미뤄. 쉬는 것도 해야 할 일이야."
  ],["필요하면 병원이나 약국에 갈 시간을 같이 확인해 보자.","오늘 상태가 더 나빠지면 바로 알려 주기로 약속해 줘."],{affection:4,trust:5,health:1}),
  topic("date","데이트와 만남",[/데이트|만나|어디\s*갈|약속|산책|영화\s*볼/],[
    "나도 만나고 싶어. 유명한 곳보다 둘이 편하게 이야기할 수 있는 곳이면 좋겠어.",
    "이번 데이트는 한 사람이 전부 정하기보다 하고 싶은 걸 하나씩 고르자.",
    "일정부터 확인하면 여유 있게 만날 수 있을 것 같아. 급하게 끼워 넣고 싶지는 않아.",
    "산책하고 조용히 밥 먹는 정도도 좋아. 중요한 건 시간을 제대로 함께 쓰는 거니까.",
    "새로운 곳도 좋지만 우리 둘 다 지치지 않는 동선으로 계획했으면 해."
  ],["가능한 날짜와 시간을 두 개씩 골라서 맞춰 보자.","이번에는 네가 가장 하고 싶은 일을 먼저 말해 줘."],{affection:5,trust:3,excitement:5}),
  topic("weekend","주말과 휴일",[/주말|휴일|쉬는\s*날|토요일|일요일/],[
    "주말을 전부 약속으로 채우지는 말자. 같이 보내는 시간과 각자 쉬는 시간이 둘 다 필요해.",
    "이번 휴일에는 늦잠도 자고 가까운 곳에서 천천히 시간을 보내고 싶어.",
    "해야 할 일이 있다면 먼저 끝내고 만나자. 서로 마음이 급한 데이트는 아쉬우니까.",
    "주말 계획이 비어 있다면 장을 보고 같이 식사하는 평범한 시간도 좋을 것 같아.",
    "멀리 가지 않아도 괜찮아. 둘 다 회복할 수 있는 일정이면 충분해."
  ],["쉬고 싶은 시간과 만나고 싶은 시간을 솔직하게 맞춰 보자.","이번 주에 꼭 하고 싶은 게 하나 있다면 먼저 말해 줘."],{affection:4,trust:4,excitement:3}),
  topic("gift","선물",[/선물|사\s*줄|갖고\s*싶|기념품/],[
    "가격이 큰 것보다 내가 전에 한 말을 기억해서 고른 선물이 더 좋아.",
    "선물을 꼭 준비해야 한다는 부담은 갖지 않았으면 해. 함께 고르는 것도 괜찮아.",
    "실제로 자주 쓸 수 있는 물건이면 볼 때마다 네 생각이 날 것 같아.",
    "깜짝 선물도 좋지만 취향이 중요한 물건은 먼저 물어봐 주는 게 더 고마워.",
    "무언가를 사 주려는 마음보다 왜 그걸 골랐는지 듣는 순간이 더 기억에 남아."
  ],["내 취향이 헷갈리면 후보를 보여 주고 같이 고르자.","너도 받고 싶은 게 있다면 숨기지 말고 말해 줘."],{affection:5,trust:3}),
  topic("memory","함께한 기억",[/기억|전에|아까|그때|지난번|추억/],[
    "나도 기억해. 사소한 장면인데 이상하게 오래 마음에 남아 있어.",
    "그때는 제대로 말하지 못했지만 네가 배려해 준 걸 알고 있었어.",
    "같은 일을 서로 다르게 기억할 수도 있으니 네가 기억하는 장면도 듣고 싶어.",
    "지난 일을 다시 꺼낸 데에는 이유가 있을 것 같아. 지금 마음과 연결돼 있어?",
    "좋았던 기억은 자주 말할수록 더 선명해지고, 서운했던 기억은 제대로 풀수록 가벼워지는 것 같아."
  ],["그때 네가 가장 기억하는 감정은 무엇이었어?","이번에는 그 기억에서 놓친 말을 서로 해 보면 좋겠어."],{affection:4,trust:5,attachment:3}),
  topic("future","미래와 결혼",[/미래|결혼|나중에|앞으로|같이\s*살|우리\s*집/],[
    "나도 우리의 미래를 생각해. 막연한 약속보다 생활을 어떻게 맞출지가 궁금해.",
    "결혼이라는 말이 부담스럽지는 않지만 감정만으로 서두르고 싶지도 않아.",
    "함께 산다면 돈과 집안일, 각자 시간을 어떻게 나눌지 솔직히 이야기해야 할 것 같아.",
    "앞으로도 만나고 싶다는 마음과 준비해야 할 현실을 같이 보는 게 우리다운 방식 같아.",
    "큰 계획보다 내년의 우리 모습부터 구체적으로 상상해 보면 좋겠어."
  ],["네가 생각하는 안정적인 미래가 어떤 모습인지 듣고 싶어.","서로 포기할 수 없는 기준부터 하나씩 말해 보자."],{affection:4,trust:5,attachment:5}),
  topic("family","가족",[/가족|부모|엄마|아빠|형제|동생|언니|오빠/],[
    "가족 이야기는 가까운 사이여도 조심스러울 수 있어. 네가 편한 만큼만 말해 줘.",
    "부모님의 기대와 네가 원하는 삶이 다르면 마음이 복잡할 것 같아.",
    "가족을 생각하는 마음과 네 경계를 지키는 일은 동시에 가능해.",
    "내가 함부로 판단하고 싶지는 않아. 네가 겪어 온 관계부터 듣고 싶어.",
    "언젠가 서로의 가족을 만나게 된다면 미리 걱정보다 필요한 준비를 같이 하자."
  ],["내가 알아야 할 중요한 기준이나 예의가 있다면 알려 줘.","네 가족 이야기에서 내가 어떤 역할을 해 주길 바라는지도 궁금해."],{affection:3,trust:5,attachment:3}),
  topic("friends","친구와 동료",[/친구|동료|선배|후배|모임|회식/],[
    "네가 소중하게 생각하는 사람들과 잘 지내는 건 나도 존중하고 싶어.",
    "친구 문제는 한쪽 이야기만 듣고 판단하기 어려우니 상황을 조금 더 알려 줘.",
    "동료와의 거리가 애매해서 걱정된다면 서로 불편하지 않은 선을 먼저 정해 보자.",
    "모임에 가는 것 자체보다 연락 없이 오래 비는 상황이 나는 더 신경 쓰여.",
    "내가 질투하거나 불편해할까 봐 숨기기보다 먼저 설명해 주는 편이 좋아."
  ],["내가 오해할 만한 부분이 있다면 미리 솔직하게 말해 줘.","서로의 인간관계를 존중할 수 있는 기준을 같이 정하고 싶어."],{affection:3,trust:5}),
  topic("money","돈과 소비",[/돈|월급|지출|저축|투자|비싸|카드|대출/],[
    "돈 이야기를 피하면 나중에 더 크게 부딪힐 수 있어. 지금부터 솔직한 게 좋아.",
    "사고 싶은 마음과 감당할 수 있는 금액을 나누어 생각하면 결정이 쉬워져.",
    "한 번의 지출보다 반복되는 습관이 더 중요해. 이번 달 흐름부터 같이 보자.",
    "저축 목표가 있다면 생활을 전부 포기하지 않는 선에서 현실적으로 정해야 오래 가.",
    "투자는 기대 수익보다 잃어도 생활에 문제가 없는 금액인지 먼저 확인했으면 해."
  ],["원하면 필요한 지출과 미뤄도 되는 지출을 같이 구분해 보자.","우리 둘의 계획과 연결되는 돈이라면 더 투명하게 이야기하자."],{affection:2,trust:5,confidence:1}),
  topic("conflict","서운함과 갈등",[/서운|싸웠|다퉜|갈등|연락.*왜|왜.*연락|무시|오해/],[
    "서운했다면 참다가 멀어지기 전에 말해 줬으면 해. 나도 방어적으로 듣지 않을게.",
    "누가 맞는지부터 따지면 감정만 더 멀어질 것 같아. 서로 다르게 느낀 지점을 보자.",
    "연락이 늦었던 이유를 설명할 수는 있지만 네가 기다린 마음까지 없던 일로 만들지는 않을게.",
    "오해가 생겼다면 추측을 계속하기보다 확인할 질문을 하나씩 해 보자.",
    "나도 화가 나면 말을 줄이는 편이지만 침묵으로 벌을 주지는 않도록 노력할게."
  ],["네가 가장 상처받은 말이나 행동이 무엇이었는지 먼저 알려 줘.","오늘은 이기려는 대화가 아니라 다시 이해하기 위한 대화를 했으면 해."],{affection:2,trust:4,conflict:-3,relationshipStress:-3}),
  topic("encouragement","응원과 도전",[/응원|힘내|할\s*수|도전|시험|면접|발표|합격/],[
    "지금까지 준비한 시간을 아니까 무조건 잘될 거라는 말보다 네가 해낼 만큼 준비했다고 말해 주고 싶어.",
    "긴장되는 건 중요하게 생각하고 있다는 뜻이야. 준비한 순서대로만 해도 충분해.",
    "결과 하나가 네 능력 전부를 정하지는 않아. 그래도 원하는 결과가 오도록 진심으로 응원할게.",
    "막막하면 가장 작은 단계부터 시작하자. 시작한 뒤에야 보이는 다음 단계도 있으니까.",
    "내가 대신 해 줄 수는 없지만 끝날 때까지 네 편에서 현실적으로 도울게."
  ],["지금 내가 도울 수 있는 준비가 있으면 구체적으로 알려 줘.","끝나고 나면 결과와 상관없이 수고했다고 꼭 말해 줄게."],{affection:4,trust:4,confidence:2}),
  topic("daily","인사와 하루",[/안녕|뭐\s*해|뭐해|오늘|하루|잘\s*지냈|아침|퇴근했|일어났/],[
    "나는 오늘 해야 할 일을 정리하다가 잠깐 네 생각이 났어. 너는 잘 지냈어?",
    "별일 없는 하루였는데 네 메시지가 오니까 이제야 하루가 조금 또렷해지는 기분이야.",
    "지금은 잠깐 쉬고 있었어. 네 하루에는 어떤 일이 있었는지 궁금해.",
    "오늘은 계획대로 된 일도 있고 아닌 일도 있었어. 그래도 이렇게 이야기할 여유는 있어서 다행이야.",
    "반가워. 짧은 인사라도 먼저 해 주면 서로의 하루가 이어지는 느낌이 들어."
  ],["좋았던 일 하나와 힘들었던 일 하나씩 나눠 볼까?","사소한 이야기여도 좋으니 오늘 가장 기억나는 순간을 말해 줘."],{affection:3,trust:3}),
  topic("general","일상 대화",[],[
    "응, 네가 무슨 말을 하려는지 차분히 듣고 있어.",
    "그 이야기를 꺼낸 이유가 있을 것 같아. 내가 함부로 짐작하지는 않을게.",
    "네 생각을 바로 판단하기보다 왜 그렇게 느꼈는지 먼저 알고 싶어.",
    "말로 정리하는 동안 생각이 바뀌어도 괜찮아. 있는 그대로 이야기해 줘.",
    "짧은 말 속에도 네가 전하고 싶은 마음이 있는 것 같아서 조금 더 듣고 싶어."
  ],["내 의견이 필요하면 솔직하게 말하고, 먼저 듣기를 원하면 그렇게 할게.","우리 대화가 정답을 고르는 시간이 아니라 서로를 이해하는 시간이었으면 해."],{affection:3,trust:3})
]);

function buildCorpus(){
  const records=[];
  for(const definition of HAEUN_MESSAGE_TOPICS){
    const followUps=FOLLOW_UP_GROUPS[TOPIC_GROUPS[definition.id]]??CASUAL_FOLLOW_UPS;
    definition.responses.forEach((response,responseIndex)=>definition.continuations.forEach((continuation,continuationIndex)=>followUps.forEach((followUp,followUpIndex)=>{
      records.push(Object.freeze({
        id:`haeun-${definition.id}-${responseIndex+1}-${continuationIndex+1}-${followUpIndex+1}`,
        topicId:definition.id,
        text:`${response} ${continuation} ${followUp}`,
        style:"full",
        effects:definition.effects
      }));
    })));
    const shortTopic=SHORT_TOPIC_PHRASES[definition.id]??definition.label;
    SHORT_OPENERS.forEach((opener,openerIndex)=>SHORT_TAILS.forEach((tail,tailIndex)=>{
      records.push(Object.freeze({
        id:`haeun-${definition.id}-short-${openerIndex+1}-${tailIndex+1}`,
        topicId:definition.id,
        text:`${opener.replace("{topic}",shortTopic)} ${tail}`,
        style:"short",
        effects:definition.effects
      }));
    }));
  }
  return Object.freeze(records);
}

export const HAEUN_MESSAGE_CORPUS = buildCorpus();

function normalize(value){return String(value??"").normalize("NFKC").toLowerCase().replace(/\s+/g," ").trim();}
function hash(value){let result=2166136261;for(const character of String(value)){result^=character.codePointAt(0);result=Math.imul(result,16777619);}return result>>>0;}
function render(text,context){
  const phaseNames=["아침","낮","저녁","밤"],player=context?.player?.name??"자기",partner=context?.girlfriend?.name??"하은";
  return String(text).replaceAll("{player}",player).replaceAll("{partner}",partner).replaceAll("{job}",context?.player?.job??"일").replaceAll("{time}",phaseNames[context?.phase]??"오늘");
}

export function isHaeunLoanRequest(message){
  const value=normalize(message);
  return /(?:돈|현금|생활비|급전|10만|십만|20만|이십만|30만|삼십만).{0,14}(?:빌려|빌릴|빌려줄|빌려\s*줄)|(?:빌려|빌릴).{0,14}(?:돈|현금|생활비|급전)/.test(value);
}

export function isHaeunBoundaryMessage(message){
  const raw=String(message??"").normalize("NFKC").trim(),value=normalize(raw),compact=raw.replace(/\s+/g,"");
  if(!raw)return false;
  if(UNCOMFORTABLE_MESSAGE_PATTERNS.some(pattern=>pattern.test(value)))return true;
  if(compact.length>=5&&/^[!?.,~ㅋㅎㅠㅜ]+$/u.test(compact))return true;
  if(compact.length>=6&&/^[ㄱ-ㅎㅏ-ㅣ\u1100-\u11ff]+$/u.test(compact)&&new Set(compact).size<=6)return true;
  if(compact.length>=7&&/^[a-z]+$/i.test(compact)&&!/(love|sorry|hello|thanks|thankyou|goodnight|missyou)/i.test(compact))return true;
  if(/(.)\1{7,}/u.test(compact))return true;
  return false;
}

export function classifyHaeunMessage(message,session={}){
  const value=normalize(message),lastQuestion=session?.lastQuestionId;
  if(isHaeunLoanRequest(message))return "loan";
  if(isHaeunBoundaryMessage(message))return "boundary";
  if(/^(응|어|그래|맞아|좋아|웅|그럼|당연)([.!~ㅋㅎ]*)$/.test(value)||/^(아니|싫어|별로|됐어|안돼)([.!~ㅋㅎ]*)$/.test(value)){
    const questionTopics={"date-plan":"date",meal:"meal",work:"work",future:"future",wellbeing:"fatigue"};
    return questionTopics[lastQuestion]??session?.topic??"general";
  }
  return HAEUN_MESSAGE_TOPICS.find(definition=>definition.patterns.some(pattern=>pattern.test(value)))?.id??"general";
}

export function deriveHaeunDialogueState(context,message=""){
  const relationship=context?.relationship??{},player=context?.player??{};
  const affection=Number(relationship.affection)||0,trust=Number(relationship.trust)||0,conflict=Number(relationship.conflict)||0,relationshipStress=Number(relationship.stress)||0;
  const fatigue=Number(player.fatigue)||0,stress=Number(player.stress)||0,text=normalize(message);
  if(conflict>=45||trust<350)return {emotion:/미안|사과|잘못/.test(text)?"softening":"guarded",willingness:"low",relationshipTone:"distant"};
  if(fatigue>=75||stress>=75||relationshipStress>=65)return {emotion:"tired",willingness:"medium",relationshipTone:trust>=550?"caring":"careful"};
  if(affection>=700&&trust>=600)return {emotion:"warm",willingness:"high",relationshipTone:"close"};
  if(/사랑|좋아해|고마|보고\s*싶/.test(text))return {emotion:"touched",willingness:"high",relationshipTone:"affectionate"};
  return {emotion:"calm",willingness:"medium",relationshipTone:"steady"};
}

function historicalTopic(turn){
  if(turn?.topic&&HAEUN_MESSAGE_TOPICS.some(item=>item.id===turn.topic))return turn.topic;
  const value=normalize(turn?.user);
  return HAEUN_MESSAGE_TOPICS.find(definition=>definition.patterns.some(pattern=>pattern.test(value)))?.id??"general";
}

const MEMORY_KEYWORD_GROUPS=Object.freeze([
  /회사|직장|업무|발표|회의|상사|프로젝트|출근|퇴근/,
  /데이트|만나|약속|산책|영화/,
  /가족|부모|엄마|아빠|형제|동생/,
  /친구|동료|선배|후배|모임|회식/,
  /돈|월급|지출|저축|투자|카드|대출/,
  /병원|감기|두통|건강|약|통증|아파/,
  /잠|수면|꿈|불면|밤새/,
  /밥|식사|점심|저녁|아침|메뉴|야식/
]);

function sharesMemoryKeyword(previous,current){return MEMORY_KEYWORD_GROUPS.some(pattern=>pattern.test(previous)&&pattern.test(current));}

export function findHaeunRelevantMemory(context,topicId,message=""){
  const current=normalize(message),history=[...(context?.recentConversation??[])].reverse();
  for(let index=0;index<history.length;index+=1){
    const turn=history[index],user=String(turn?.user??"").replace(/\s+/g," ").trim();
    const previous=normalize(user),related=historicalTopic(turn)===topicId||sharesMemoryKeyword(previous,current);
    if(user.length<4||previous===current||!related)continue;
    return {id:`conversation-${turn.day??0}-${index}`,source:"conversation",summary:user.slice(0,36)};
  }
  return null;
}

function chooseContextualFollowUp(context,topicId,seed){
  const group=TOPIC_GROUPS[topicId]??"casual",items=FOLLOW_UP_GROUPS[group]??CASUAL_FOLLOW_UPS;
  const recentIds=new Set(context?.sessionState?.recentFollowUpIds??[]),recentText=(context?.recentConversation??[]).map(turn=>String(turn?.assistant??""));
  const candidates=items.map((text,index)=>({id:`haeun-followup-${group}-${index+1}`,text}));
  const available=candidates.filter(item=>!recentIds.has(item.id)&&!recentText.some(text=>text.includes(item.text)));
  const pool=available.length?available:candidates;
  return pool[seed%pool.length];
}

const REPEATED_MESSAGE_REPLIES=Object.freeze([
  "응, 그 말은 들었어. 같은 말을 다시 한 이유가 있으면 조금 다르게 설명해 줄래?",
  "아까도 같은 이야기를 했지. 내가 놓친 마음이 있다면 이번에는 그 부분을 말해 줘.",
  "그 말이 계속 마음에 남아 있나 봐. 같은 문장보다 지금 원하는 반응을 알려 줬으면 해."
]);

function buildContextualHaeunReply(context,message,definition,seed){
  const dialogueState=deriveHaeunDialogueState(context,message),memory=findHaeunRelevantMemory(context,definition.id,message),followUp=chooseContextualFollowUp(context,definition.id,seed);
  const response=render(definition.responses[seed%definition.responses.length],context),continuation=render(definition.continuations[Math.floor(seed/definition.responses.length)%definition.continuations.length],context);
  const stateLine=dialogueState.emotion==="guarded"?"솔직히 지금은 마음을 다 열고 답하기는 어려워.":dialogueState.emotion==="tired"?"오늘은 조금 지쳐 있어서 천천히 이야기하고 싶어.":dialogueState.emotion==="softening"?"아직 서운함은 남아 있지만 네 말을 들어 볼게.":"";
  const memoryLine=memory?`전에 네가 “${memory.summary}”라고 했던 것도 기억하고 있어.`:"";
  const includeContinuation=normalize(message).length>=12||seed%2===0;
  const text=[stateLine,response,memoryLine,includeContinuation?continuation:"",followUp.text].filter(Boolean).join(" ");
  return {text,effects:{...definition.effects},source:"haeun-contextual",style:"full",emotion:dialogueState.emotion,willingness:dialogueState.willingness,followUpId:followUp.id,memoryUsed:Boolean(memory),memoryId:memory?.id??null};
}

export function getHaeunMessageReply(context,message){
  const relationshipSeed=Math.round((Number(context?.relationship?.affection)||0)+(Number(context?.relationship?.trust)||0));
  const seed=hash(`${normalize(message)}|${context?.day??0}|${context?.phase??0}|${context?.sessionState?.turn??0}|${context?.sessionState?.variantSeed??0}|${relationshipSeed}`),topicId=classifyHaeunMessage(message,context?.sessionState);
  if(topicId==="loan"){
    const borrowed=context?.girlfriendLoan?.borrowed===true,trust=Number(context?.relationship?.trust)||0,loanState=borrowed?"repeat":trust<GIRLFRIEND_LOAN_MIN_TRUST?"low-trust":"approved",amount=getGirlfriendLoanAmount(seed);
    const templates=loanState==="repeat"?HAEUN_LOAN_REPEAT_REPLIES:loanState==="low-trust"?HAEUN_LOAN_LOW_TRUST_REPLIES:HAEUN_LOAN_APPROVAL_REPLIES,template=templates[seed%templates.length],text=template.replace("{amount}",amount.toLocaleString("ko-KR"));
    return {id:`haeun-loan-${loanState}-${seed%templates.length+1}`,replyId:`haeun-loan-${loanState}-${seed%templates.length+1}`,topic:"loan",text,effects:{},source:`haeun-loan-${loanState}`,style:"short",transaction:loanState==="approved"?{type:"girlfriend-loan",amount}:null};
  }
  if(topicId==="boundary"){
    const recent=new Set(context?.sessionState?.recentReplyIds??[]),items=HAEUN_REFUSAL_REPLIES.map((text,index)=>({id:`haeun-boundary-${index+1}`,text})),available=items.filter(item=>!recent.has(item.id)),pool=available.length?available:items,record=pool[seed%pool.length];
    return {id:record.id,replyId:record.id,topic:"boundary",text:record.text,effects:{affection:-1,trust:-2,conflict:1,relationshipStress:2},source:"haeun-boundary",style:"short"};
  }
  if(context?.sessionState?.lastUserMessage&&normalize(context.sessionState.lastUserMessage)===normalize(message)){
    const recent=new Set(context?.sessionState?.recentReplyIds??[]),items=REPEATED_MESSAGE_REPLIES.map((text,index)=>({id:`haeun-repeat-${index+1}`,text})),available=items.filter(item=>!recent.has(item.id)),pool=available.length?available:items,record=pool[seed%pool.length],dialogueState=deriveHaeunDialogueState(context,message);
    return {id:record.id,replyId:record.id,topic:topicId,text:record.text,effects:{trust:1},source:"haeun-context-repeat",style:"short",emotion:dialogueState.emotion,willingness:dialogueState.willingness,followUpId:null,memoryUsed:false};
  }
  const definition=HAEUN_MESSAGE_TOPICS.find(item=>item.id===topicId)??HAEUN_MESSAGE_TOPICS.at(-1),all=HAEUN_MESSAGE_CORPUS.filter(item=>item.topicId===definition.id),recent=new Set(context?.sessionState?.recentReplyIds??[]);
  if(normalize(message).length<=3){
    const styled=all.filter(item=>item.style==="short"),available=styled.filter(item=>!recent.has(item.id)),pool=available.length?available:styled,record=pool[seed%pool.length],dialogueState=deriveHaeunDialogueState(context,message);
    return {id:record.id,replyId:record.id,topic:definition.id,text:render(record.text,context),effects:{...record.effects},source:"haeun-contextual",style:"short",emotion:dialogueState.emotion,willingness:dialogueState.willingness,followUpId:null,memoryUsed:false};
  }
  const contextualSeed=(seed+recent.size*104729)>>>0,contextual=buildContextualHaeunReply(context,message,definition,contextualSeed),id=`haeun-context-${definition.id}-${contextualSeed}`;
  return {id,replyId:id,topic:definition.id,...contextual};
}

export function validateHaeunMessageCorpus(corpus=HAEUN_MESSAGE_CORPUS){
  return Array.isArray(corpus)&&corpus.length===10000&&new Set(corpus.map(item=>item.id)).size===10000&&new Set(corpus.map(item=>item.text)).size===10000&&corpus.filter(item=>item.style==="short").length===5000&&corpus.filter(item=>item.style==="full").length===5000&&corpus.every(item=>typeof item.topicId==="string"&&typeof item.text==="string"&&item.text.length>=10&&["short","full"].includes(item.style)&&Object.values(item.effects).every(Number.isFinite));
}
