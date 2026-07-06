export type Language = "ru" | "en";
export type LocalizedText = Record<Language, string>;
export type LevelCode = "A2" | "B1" | "B2" | "B2+" | "C1";

export type CoachCategory = "everyday" | "business";

export type CoachPhrase = {
  en: string;
  ru: string;
  usageNote: LocalizedText;
  example: string;
};

export type Topic = {
  id: string;
  level: LevelCode;
  unit: number;
  category: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  setting: string;
  settingRu: string;
  role: string;
  roleRu: string;
  roleProfile: LocalizedText;
  color: string;
  vocabulary: string[];
  vocabularyRu: string[];
  grammar: string;
  pronunciation: string;
  writingSkill: string;
  everydayEnglish: string;
  everydayEnglishRu: string;
  canDo: LocalizedText;
  focus: string;
  coachTopicId: string;
  coachCategory: CoachCategory;
  functionalFocus: LocalizedText;
  phraseBank: CoachPhrase[];
  sampleDialogue: Array<{ role: string; text: string }>;
};

export type DialogueExchange = {
  number: number;
  question: string;
  answer: string;
  questionTranslation: LocalizedText;
  teacherNote: LocalizedText;
  phraseNotes: PhraseNote[];
  answerVariants: AnswerVariant[];
  tip: LocalizedText;
};

export type PhraseNote = {
  phrase: string;
  translation: LocalizedText;
  explanation: LocalizedText;
  example: string;
  exampleTranslation: LocalizedText;
};

export type AnswerVariant = {
  label: string;
  text: string;
  translation: LocalizedText;
  explanation: LocalizedText;
};

export type TestQuestion = {
  id: string;
  prompt: LocalizedText;
  options: string[];
  correctIndex: number;
  explanation: LocalizedText;
};

type CoachTopicSeed = {
  id: string;
  level: LevelCode;
  category: CoachCategory;
  title: LocalizedText;
  setting: string;
  settingRu: string;
  role: string;
  roleRu: string;
  learnerRole: LocalizedText;
  functionalFocus: LocalizedText;
  vocabulary: string[];
  vocabularyRu: string[];
  phrases: CoachPhrase[];
  sampleDialogue: Array<{ role: string; text: string }>;
};

type SessionAngle = {
  title: LocalizedText;
  focus: LocalizedText;
  pressure: LocalizedText;
};

export const alexCoachRuntimeContract = {
  role: "Alex",
  outputShape: {
    tutor_reply: "natural spoken-English reply",
    corrections: "short delayed corrections",
    phrases_used: "target phrases used correctly",
    wrap_up: "filled only at the end"
  },
  principles: [
    "speaking first",
    "real language, not textbook language",
    "do not interrupt the flow",
    "confidence over perfection",
    "short corrections at natural pauses"
  ]
};

const colors = [
  "#11B5E4",
  "#13C58B",
  "#FE9F1C",
  "#8F6BFF",
  "#FE5AA8",
  "#2563EB",
  "#14B8A6",
  "#F43F5E",
  "#7C3AED",
  "#0EA5E9"
];

const sessionAngles: SessionAngle[] = [
  {
    title: { ru: "разогрев и уверенный старт", en: "warm-up and confident start" },
    focus: { ru: "говорить больше одного предложения и не ждать идеальной грамматики", en: "say more than one sentence without waiting for perfect grammar" },
    pressure: { ru: "мягкий старт", en: "low pressure" }
  },
  {
    title: { ru: "живые уточняющие вопросы", en: "natural follow-up questions" },
    focus: { ru: "держать разговор открытым с помощью коротких вопросов", en: "keep the conversation open with short follow-ups" },
    pressure: { ru: "обычный темп", en: "normal pace" }
  },
  {
    title: { ru: "мнение, причина и пример", en: "opinion, reason, example" },
    focus: { ru: "строить ответ: мысль, причина, пример", en: "build a point, reason, and example" },
    pressure: { ru: "чуть больше деталей", en: "more detail" }
  },
  {
    title: { ru: "роль и реакция собеседника", en: "roleplay and reaction" },
    focus: { ru: "реагировать на собеседника, а не читать заготовку", en: "react to the other person, not a script" },
    pressure: { ru: "диалоговый режим", en: "roleplay mode" }
  },
  {
    title: { ru: "неудобный момент", en: "a slightly tricky moment" },
    focus: { ru: "переспросить, смягчить или уточнить без паники", en: "clarify, soften, or ask again without freezing" },
    pressure: { ru: "умеренный вызов", en: "moderate challenge" }
  },
  {
    title: { ru: "естественная фраза дня", en: "phrase spotlight" },
    focus: { ru: "встроить 3-5 фраз так, чтобы они звучали живо", en: "weave in 3-5 phrases naturally" },
    pressure: { ru: "фокус на фразах", en: "phrase focus" }
  },
  {
    title: { ru: "более быстрый темп", en: "slightly faster pace" },
    focus: { ru: "отвечать быстрее, но не терять ясность", en: "answer faster without losing clarity" },
    pressure: { ru: "темп выше", en: "faster pace" }
  },
  {
    title: { ru: "короткий убедительный ответ", en: "concise persuasive answer" },
    focus: { ru: "убрать лишнее и звучать убедительнее", en: "cut filler and sound more convincing" },
    pressure: { ru: "точность мысли", en: "precision" }
  },
  {
    title: { ru: "повторение слабых фраз", en: "spaced phrase review" },
    focus: { ru: "вернуть старые фразы в новый разговор", en: "bring older phrases into a new conversation" },
    pressure: { ru: "мягкое повторение", en: "light review" }
  },
  {
    title: { ru: "мини-сессия с итогом", en: "full mini-session with wrap-up" },
    focus: { ru: "пройти warm-up, scenario, phrases и короткий wrap-up", en: "complete warm-up, scenario, phrases, and a short wrap-up" },
    pressure: { ru: "полная сессия", en: "full session" }
  }
];

const coachTopics: CoachTopicSeed[] = [
  {
    id: "everyday_weekend_plans",
    level: "B1",
    category: "everyday",
    title: { ru: "Планы на выходные", en: "Weekend plans" },
    setting: "a relaxed chat about weekend plans",
    settingRu: "спокойный разговор о планах на выходные",
    role: "friend",
    roleRu: "друг",
    learnerRole: { ru: "собеседник, который рассказывает о планах и мягко соглашается или отказывается", en: "a speaker sharing plans and casually agreeing or declining" },
    functionalFocus: { ru: "планы, согласие, отказ без резкости", en: "talking about plans, agreeing, and declining casually" },
    vocabulary: ["plans", "stay in", "catch up", "mood", "weather", "play it by ear"],
    vocabularyRu: ["планы", "остаться дома", "наверстать", "настроение", "погода", "решить по ситуации"],
    phrases: [
      phrase("I'm thinking of + verb-ing", "Я подумываю о том, чтобы...", "Use it for plans that are not 100% fixed.", "I'm thinking of going hiking this weekend."),
      phrase("I might just...", "Может, я просто...", "A soft way to describe a low-energy plan.", "I might just stay in and catch up on sleep."),
      phrase("That sounds like a plan", "Звучит как хороший план", "Use it to agree in a warm, casual way.", "Pizza and a movie? That sounds like a plan."),
      phrase("I'm not really in the mood for...", "Я не особо настроен на...", "A polite way to say no without sounding cold.", "I'm not really in the mood for a big night out."),
      phrase("Let's play it by ear", "Давай решим по ситуации", "Use it when the plan depends on weather, energy, or timing.", "We'll see how the weather is. Let's play it by ear.")
    ],
    sampleDialogue: [
      { role: "tutor", text: "Any plans for the weekend, or are you keeping it open?" },
      { role: "learner", text: "..." },
      { role: "tutor", text: "Nice. Sounds like a plan. Anyone joining you?" }
    ]
  },
  {
    id: "everyday_opinions_debate",
    level: "B2",
    category: "everyday",
    title: { ru: "Мнения и мягкий спор", en: "Opinions and debate" },
    setting: "a friendly debate about work, habits, or modern life",
    settingRu: "дружеский спор о работе, привычках или современной жизни",
    role: "conversation partner",
    roleRu: "собеседник",
    learnerRole: { ru: "человек, который выражает мнение и не спорит грубо", en: "a speaker giving opinions without sounding aggressive" },
    functionalFocus: { ru: "мнение, несогласие, осторожная позиция", en: "giving opinions, disagreeing politely, and hedging" },
    vocabulary: ["remote work", "priorities", "balance", "routine", "team energy", "trade-off"],
    vocabularyRu: ["удаленная работа", "приоритеты", "баланс", "распорядок", "энергия команды", "компромисс"],
    phrases: [
      phrase("I see where you're coming from, but...", "Я понимаю, к чему ты ведешь, но...", "Use before disagreeing so the tone stays friendly.", "I see where you're coming from, but I'd argue the opposite."),
      phrase("To be fair,...", "Справедливости ради...", "Use it to show balance before adding a point.", "To be fair, it's not that simple."),
      phrase("I'm on the fence about...", "Я пока не определился насчет...", "Use it when your opinion is mixed.", "I'm on the fence about remote work, honestly."),
      phrase("That's a fair point", "Это справедливое замечание", "Use it to accept a good argument without fully agreeing.", "That's a fair point. I hadn't thought of it that way."),
      phrase("At the end of the day,...", "В конечном счете...", "Use it to sum up the main idea.", "At the end of the day, it comes down to priorities.")
    ],
    sampleDialogue: [
      { role: "tutor", text: "Do you think remote work is better than office work?" },
      { role: "learner", text: "..." },
      { role: "tutor", text: "That's a fair point, but what about people who thrive on office energy?" }
    ]
  },
  {
    id: "everyday_travel_stories",
    level: "B1",
    category: "everyday",
    title: { ru: "Истории из путешествий", en: "Travel stories" },
    setting: "a casual story about a trip that did not go as planned",
    settingRu: "неформальный рассказ о поездке, которая пошла не по плану",
    role: "curious listener",
    roleRu: "любопытный слушатель",
    learnerRole: { ru: "рассказчик, который описывает события по порядку", en: "a storyteller describing events in a clear order" },
    functionalFocus: { ru: "рассказывать прошлый опыт и связывать события", en: "narrating past experiences and sequencing events" },
    vocabulary: ["missed train", "hotel", "upgrade", "delay", "route", "adventure"],
    vocabularyRu: ["пропущенный поезд", "отель", "повышение класса", "задержка", "маршрут", "приключение"],
    phrases: [
      phrase("What ended up happening was...", "В итоге произошло вот что...", "Use it before the main twist of the story.", "What ended up happening was we missed the train."),
      phrase("Long story short,...", "Короче говоря...", "Use it to shorten a longer story.", "Long story short, we got upgraded to first class."),
      phrase("It turned out that...", "Оказалось, что...", "Use it when new information changes the story.", "It turned out that the hotel had double-booked us."),
      phrase("Looking back,...", "Оглядываясь назад...", "Use it to reflect after the story.", "Looking back, it was actually the best part of the trip."),
      phrase("You wouldn't believe...", "Ты не поверишь...", "Use it before a surprising detail.", "You wouldn't believe what happened next.")
    ],
    sampleDialogue: [
      { role: "tutor", text: "Tell me about a trip that didn't go as planned." },
      { role: "learner", text: "..." },
      { role: "tutor", text: "Long story short, disaster turned into an adventure?" }
    ]
  },
  {
    id: "business_discovery_call",
    level: "B2",
    category: "business",
    title: { ru: "Discovery call с клиентом", en: "Client discovery call" },
    setting: "a discovery call with a client losing leads in the funnel",
    settingRu: "созвон с клиентом, который теряет заявки в воронке",
    role: "client",
    roleRu: "клиент",
    learnerRole: { ru: "фрилансер, который задает точные вопросы и выясняет потребность", en: "a freelancer asking precise questions to uncover the real need" },
    functionalFocus: { ru: "выявление потребности, уточнение, диагностика", en: "uncovering client needs and asking probing questions" },
    vocabulary: ["funnel", "leads", "bottleneck", "tracking", "response time", "conversion"],
    vocabularyRu: ["воронка", "заявки", "узкое место", "отслеживание", "время ответа", "конверсия"],
    phrases: [
      phrase("Walk me through...", "Проведите меня по шагам...", "Use it to invite the client to describe the process.", "Walk me through how you're currently handling this."),
      phrase("What does success look like for you here?", "Как для вас здесь выглядит успех?", "Use it to define the client's goal.", "What does success look like for you here?"),
      phrase("Just so I understand correctly,...", "Чтобы я правильно понял...", "Use before summarising the client's problem.", "Just so I understand correctly, the main bottleneck is response time?"),
      phrase("What's prompting you to look into this now?", "Что подтолкнуло вас заняться этим именно сейчас?", "Use it to uncover urgency.", "What's prompting you to look into this now?"),
      phrase("If we could solve X, would Y also go away?", "Если мы решим X, уйдет ли и Y?", "Use it to test the real business impact.", "If we could solve response time, would the lead drop-off also go away?")
    ],
    sampleDialogue: [
      { role: "tutor (as client)", text: "We're losing leads somewhere in our funnel, not sure where." },
      { role: "learner (as freelancer)", text: "..." },
      { role: "tutor", text: "Good question. Honestly, we've never tracked it that closely." }
    ]
  },
  {
    id: "business_price_objection",
    level: "B2",
    category: "business",
    title: { ru: "Возражение по цене", en: "Price objection" },
    setting: "a negotiation after a client says the price is too high",
    settingRu: "переговоры после фразы клиента, что цена слишком высокая",
    role: "client",
    roleRu: "клиент",
    learnerRole: { ru: "специалист, который защищает ценность без мгновенной скидки", en: "a specialist protecting value without discounting immediately" },
    functionalFocus: { ru: "обработка цены, ценность, переговоры", en: "handling price objections without discounting immediately" },
    vocabulary: ["budget", "value", "scope", "return", "timeline", "proposal"],
    vocabularyRu: ["бюджет", "ценность", "объем работ", "отдача", "сроки", "предложение"],
    phrases: [
      phrase("Help me understand what's behind that", "Помогите мне понять, что за этим стоит", "Use it to avoid becoming defensive.", "Help me understand what's behind that."),
      phrase("Compared to what?", "По сравнению с чем?", "Use it to find the client's reference point.", "When you say it's expensive, compared to what?"),
      phrase("Let's separate price from value for a second", "Давайте на секунду отделим цену от ценности", "Use it before reframing the offer.", "Let's separate price from value for a second."),
      phrase("What would need to be true for this to feel like a no-brainer?", "Что должно быть правдой, чтобы решение стало очевидным?", "Use it to reveal the client's buying conditions.", "What would need to be true for this to feel like a no-brainer?"),
      phrase("I hear you. Can I ask why that number specifically?", "Понимаю. Можно спросить, почему именно эта сумма?", "Use it to ask about budget without pressure.", "I hear you. Can I ask why that number specifically?")
    ],
    sampleDialogue: [
      { role: "tutor (as client)", text: "Honestly, that's more than we budgeted for." },
      { role: "learner (as freelancer)", text: "..." },
      { role: "tutor", text: "Fair. What did you have in mind?" }
    ]
  },
  {
    id: "business_cold_outreach_followup",
    level: "B1",
    category: "business",
    title: { ru: "Follow-up после холодного письма", en: "Cold outreach follow-up" },
    setting: "a follow-up message to a busy international prospect",
    settingRu: "повторное сообщение занятому международному потенциальному клиенту",
    role: "prospect",
    roleRu: "потенциальный клиент",
    learnerRole: { ru: "фрилансер, который напоминает о себе без давления", en: "a freelancer following up without sounding pushy" },
    functionalFocus: { ru: "мягкий follow-up, повторный контакт, уважение к времени", en: "following up without sounding pushy and re-engaging cold leads" },
    vocabulary: ["inbox", "proposal", "timing", "nudge", "follow-up", "busy"],
    vocabularyRu: ["почта", "предложение", "тайминг", "мягкое напоминание", "повторное сообщение", "занятой"],
    phrases: [
      phrase("Just floating this back to the top of your inbox", "Просто поднимаю это письмо наверх вашей почты", "Use it as a light, non-pushy follow-up.", "Just floating this back to the top of your inbox."),
      phrase("No worries if now's not the right time", "Ничего страшного, если сейчас не лучшее время", "Use it to lower pressure.", "No worries if now's not the right time."),
      phrase("Quick nudge on...", "Коротко напомню про...", "Use it for a short reminder.", "Quick nudge on the proposal I sent last week."),
      phrase("Happy to adjust if the timing's off", "Готов подстроиться, если сейчас неудачный момент", "Use it when timing may be the issue.", "Happy to adjust if the timing's off."),
      phrase("Should I check back in a month instead?", "Лучше вернуться к вам через месяц?", "Use it to give the prospect an easy next step.", "Should I check back in a month instead?")
    ],
    sampleDialogue: [
      { role: "tutor (as prospect)", text: "Sorry, been swamped, haven't had a chance to look yet." },
      { role: "learner (as freelancer)", text: "..." },
      { role: "tutor", text: "No worries. I'll take a look this week, promise." }
    ]
  }
];

export const topics: Topic[] = sessionAngles.flatMap((angle, angleIndex) =>
  coachTopics.map((seed, seedIndex) => {
    const level = calibrateLevel(seed.level, angleIndex);
    const unit = angleIndex * coachTopics.length + seedIndex + 1;
    const phrase = seed.phrases[angleIndex % seed.phrases.length];

    return {
      id: `${seed.id}-${angleIndex + 1}`,
      level,
      unit,
      category: {
        ru: `${level} · ${seed.category === "business" ? "бизнес" : "быт"} · Alex`,
        en: `${level} · ${seed.category} · Alex`
      },
      title: {
        ru: `${seed.title.ru}: ${angle.title.ru}`,
        en: `${seed.title.en}: ${angle.title.en}`
      },
      description: {
        ru: `Alex ведет короткую разговорную сессию: ${seed.functionalFocus.ru}. Фокус раунда: ${angle.focus.ru}.`,
        en: `Alex runs a spoken coaching session: ${seed.functionalFocus.en}. Round focus: ${angle.focus.en}.`
      },
      setting: seed.setting,
      settingRu: seed.settingRu,
      role: seed.role,
      roleRu: seed.roleRu,
      roleProfile: seed.learnerRole,
      color: colors[(angleIndex + seedIndex) % colors.length],
      vocabulary: seed.vocabulary,
      vocabularyRu: seed.vocabularyRu,
      grammar: "spoken accuracy in context",
      pronunciation: "sentence rhythm and confident delivery",
      writingSkill: "short speaking notes",
      everydayEnglish: phrase.en,
      everydayEnglishRu: phrase.ru,
      canDo: {
        ru: `Я могу поддерживать разговор на тему "${seed.title.ru}" и использовать живые фразы без дословного перевода.`,
        en: `I can keep a conversation going about ${seed.title.en.toLowerCase()} using natural functional phrases.`
      },
      focus: `${seed.functionalFocus.en}; ${angle.focus.en}`,
      coachTopicId: seed.id,
      coachCategory: seed.category,
      functionalFocus: seed.functionalFocus,
      phraseBank: seed.phrases,
      sampleDialogue: seed.sampleDialogue
    };
  })
);

const coachStages = [
  { en: "Warm-up", ru: "Разогрев" },
  { en: "Main scenario", ru: "Основной сценарий" },
  { en: "Follow-up", ru: "Уточнение" },
  { en: "Phrase spotlight", ru: "Фраза в фокусе" },
  { en: "Wrap-up prep", ru: "Подготовка к итогу" }
];

const warmUpPrompts = [
  "Quick warm-up: what's your first honest reaction to this situation?",
  "Let's loosen up. What would you naturally say first?",
  "Before we roleplay, give me the simple version in your own words.",
  "Nice and easy: what matters most here?",
  "If this happened today, how would you start the conversation?"
];

const scenarioPrompts = [
  "Let's roleplay. I'll be the {role}. What do you say next?",
  "I push back a little: can you answer without sounding defensive?",
  "Give me a fuller answer: point, reason, example, then one question back.",
  "Now make it sound more real, less textbook. How would you actually say it?",
  "I pause and wait. Keep the conversation moving."
];

const followUpPrompts = [
  "Good. Now ask me one natural follow-up question.",
  "Clarify one thing before you continue. What do you ask?",
  "React to what I said, then add your next point.",
  "Do you mean X or Y? Ask that politely in English.",
  "Make your answer a little warmer and more specific."
];

const phrasePrompts = [
  "Try to use this phrase naturally: {phrase}. What would you say?",
  "Bring this phrase into the conversation: {phrase}. Keep it casual.",
  "Use {phrase}, but don't force it. Make it sound like you.",
  "I want a real-life sentence with {phrase}. Go.",
  "Use {phrase} and add one detail from the scenario."
];

const wrapUpPrompts = [
  "Last pass: say the same idea again, cleaner and more confident.",
  "Now give me your best version in two or three sentences.",
  "Wrap it up: what would you say if this were a real conversation?",
  "Final round. Keep the meaning, upgrade the phrasing.",
  "One more time, with better flow and one target phrase."
];

export function buildDialogue(topic: Topic): DialogueExchange[] {
  return Array.from({ length: 55 }, (_, index) => {
    const phrase = topic.phraseBank[index % topic.phraseBank.length];
    const reviewPhrase = topic.phraseBank[(index + 2) % topic.phraseBank.length];
    const vocabulary = topic.vocabulary[index % topic.vocabulary.length];
    const stage = getCoachStage(index);
    const prompt = buildPrompt(index, topic, phrase);
    const answerVariants = buildAnswerVariants(topic, phrase, vocabulary, index);

    return {
      number: index + 1,
      question: prompt.en,
      answer: answerVariants[0].text,
      questionTranslation: {
        ru: prompt.ru,
        en: prompt.en
      },
      teacherNote: {
        ru: `Alex: сначала говорим, потом коротко улучшаем. Твоя задача: ответить 2-4 предложениями, использовать живую фразу и задать один вопрос назад, если это уместно.`,
        en: `Alex: speak first, polish later. Aim for 2-4 sentences, one natural phrase, and one follow-up question if it fits.`
      },
      phraseNotes: buildPhraseNotes(topic, phrase, reviewPhrase),
      answerVariants,
      tip: {
        ru: `${stage.ru}: не читай образец сразу. Сначала дай свой ответ, потом сравни с тремя вариантами. Исправления будут короткими и только после твоей реплики.`,
        en: `${stage.en}: do not read the sample first. Answer in your own words, then compare with the three options. Corrections come after your turn, not during it.`
      }
    };
  });
}

function buildPhraseNotes(topic: Topic, phrase: CoachPhrase, reviewPhrase: CoachPhrase): PhraseNote[] {
  const phrases = [phrase, reviewPhrase, topic.phraseBank[(topic.unit + 1) % topic.phraseBank.length]];

  return phrases.map((item) => ({
    phrase: item.en,
    translation: { ru: item.ru, en: item.en },
    explanation: item.usageNote,
    example: item.example,
    exampleTranslation: {
      ru: translateExample(item.example, item.ru),
      en: item.example
    }
  }));
}

function buildAnswerVariants(topic: Topic, phrase: CoachPhrase, vocabulary: string, index: number): AnswerVariant[] {
  const role = topic.coachCategory === "business" ? "client" : topic.role;
  const simple = buildSimpleAnswer(topic, phrase, vocabulary);
  const natural = buildNaturalAnswer(topic, phrase, vocabulary, role);
  const stronger = buildStrongerAnswer(topic, phrase, vocabulary, index);

  return [
    {
      label: "A",
      text: simple,
      translation: {
        ru: `Короткий рабочий вариант: мысль понятна, фраза "${phrase.ru}" использована без перегруза.`,
        en: simple
      },
      explanation: {
        ru: "Подходит, если нужно ответить уверенно, но без длинной речи.",
        en: "Good when you need a clear answer without over-talking."
      }
    },
    {
      label: "B",
      text: natural,
      translation: {
        ru: `Естественный вариант: звучит как настоящая реплика в разговоре, а не как перевод из учебника.`,
        en: natural
      },
      explanation: {
        ru: "Здесь есть реакция на собеседника, деталь и мягкий ход дальше.",
        en: "It reacts, adds detail, and keeps the conversation moving."
      }
    },
    {
      label: "C",
      text: stronger,
      translation: {
        ru: `Сильный вариант: больше нюанса, ясная позиция и следующий вопрос.`,
        en: stronger
      },
      explanation: {
        ru: "Тренирует B1-B2 беглость: не идеально, а живо, связно и убедительно.",
        en: "It trains B1-B2 fluency: natural, connected, and convincing."
      }
    }
  ];
}

export function buildTest(topic: Topic): TestQuestion[] {
  const phraseA = topic.phraseBank[0];
  const phraseB = topic.phraseBank[1];
  const phraseC = topic.phraseBank[2];
  const q = (
    id: string,
    promptRu: string,
    promptEn: string,
    options: string[],
    correctIndex: number,
    expRu: string,
    expEn: string
  ): TestQuestion => ({
    id: `${topic.id}-${id}`,
    prompt: { ru: promptRu, en: promptEn },
    options,
    correctIndex,
    explanation: { ru: expRu, en: expEn }
  });

  return [
    q("natural-reply", "Какая реплика звучит естественно в живом разговоре?", "Which reply sounds natural in conversation?", [phraseA.example, "I am very agree with this question.", "Please give me the speaking now."], 0, "Естественная реплика звучит как ответ человеку, а не как дословный перевод.", "A natural reply sounds like a response to a person, not a translation."),
    q("follow-up", "Что лучше помогает продолжить диалог?", "What keeps the conversation going?", ["Ask one short follow-up question.", "Correct every small mistake immediately.", "Stop after one word."], 0, "Alex не перебивает: сначала разговор, потом короткое улучшение.", "Alex keeps the flow first, then gives short feedback."),
    q("phrase-use", `Когда уместна фраза "${phraseB.en}"?`, `When is "${phraseB.en}" useful?`, [phraseB.usageNote.en, "Only in grammar tests.", "Only as a written title."], 0, phraseB.usageNote.ru, phraseB.usageNote.en),
    q("clarify", "Если смысл непонятен, что лучше сделать?", "If the meaning is unclear, what should you do?", ["Ask a clarifying question.", "Pretend you understood.", "Give a grammar lecture."], 0, "Если смысл блокируется, лучше уточнить: Do you mean X or Y?", "When meaning is blocked, clarify: Do you mean X or Y?"),
    q("confidence", "Что важнее в этой методике?", "What matters most in this method?", ["Speak first, polish later.", "Stay silent until perfect.", "Memorise one answer."], 0, "Сначала речь и уверенность, затем короткая точная правка.", "Speaking and confidence come before polishing."),
    q("business-everyday", "Какой баланс тем заложен в курс?", "What topic mix does the course use?", ["Everyday life plus freelance/business English.", "Only travel phrases.", "Only grammar rules."], 0, "Курс смешивает бытовые разговоры и рабочие сценарии фриланса.", "The course mixes everyday speaking with freelance/business scenarios."),
    q("short-correction", "Как должна выглядеть правка?", "What should a correction look like?", ["wrong -> right -> short reason", "a long grammar lecture", "no examples ever"], 0, "Правка должна быть короткой, чтобы не ломать разговорный поток.", "Corrections stay short so the flow survives."),
    q("target-phrase", `Выбери живую фразу по теме "${topic.title.en}".`, `Choose a target phrase for "${topic.title.en}".`, [phraseC.en, "How do you do, esteemed person?", "I has many opinion."], 0, "Целевая фраза должна быть реальной и пригодной в ситуации.", "A target phrase must be real and situation-ready."),
    q("response-shape", "Что делает ответ сильнее?", "What makes an answer stronger?", ["Point, reason, example, follow-up.", "One isolated word.", "Russian word order."], 0, "Такая структура помогает говорить больше и звучать связно.", "This shape helps you speak more and sound connected."),
    q("review-queue", "Как повторять слабую фразу?", "How should a weak phrase be reviewed?", ["Use it naturally in a new answer.", "Announce a grammar drill.", "Ignore it for a month."], 0, "Повторение должно входить в разговор незаметно и естественно.", "Review works best when it appears naturally in conversation."),
    q("roleplay", "Что делает ролевую игру полезной?", "What makes a roleplay useful?", [`You react to the ${topic.role}.`, "You read only the sample.", "You avoid answering."], 0, `В этой теме собеседник - ${topic.roleRu}; важно реагировать на него.`, `In this topic, the other person is the ${topic.role}. React to them.`),
    q("tone", "Какой тон нужен Alex?", "What is Alex's tone?", ["Warm, direct, a little playful.", "Formal examiner voice.", "Cold error list."], 0, "Alex похож на внимательного разговорного коуча, а не экзаменатора.", "Alex is a spoken coach, not an examiner."),
    q("translation", "Как пользоваться переводом?", "How should translation be used?", ["To understand meaning, then answer in your own English.", "To copy word by word.", "To avoid speaking."], 0, "Перевод помогает понять смысл, но ответ должен звучать по-английски естественно.", "Translation supports meaning; your answer should still sound natural."),
    q("wrap-up", "Что должно быть в wrap-up?", "What belongs in a wrap-up?", ["2-3 corrections, 2-3 phrases, one thing done well.", "A full lecture.", "Only a score."], 0, "Итог короткий: правки, полезные фразы и то, что получилось хорошо.", "Wrap-up is short: corrections, phrases, and one strength."),
    q("final-speaking", "Лучший финальный шаг после теста?", "Best final step after the check?", ["Say your best answer aloud once more.", "Close the app immediately.", "Only read the Russian notes."], 0, "Последнее повторение вслух закрепляет фразы в речи.", "A final spoken repeat locks phrases into active speech.")
  ];
}

export function getVocabularyRu(topic: Topic, word: string) {
  const index = topic.vocabulary.indexOf(word);
  return topic.vocabularyRu[index] ?? word;
}

function phrase(en: string, ru: string, usageNoteEn: string, example: string): CoachPhrase {
  return {
    en,
    ru,
    usageNote: {
      ru: usageNoteToRu(usageNoteEn),
      en: usageNoteEn
    },
    example
  };
}

function usageNoteToRu(note: string) {
  const map: Record<string, string> = {
    "Use it for plans that are not 100% fixed.": "Используй, когда план еще не окончательный.",
    "A soft way to describe a low-energy plan.": "Мягкий способ сказать, что хочется спокойного варианта.",
    "Use it to agree in a warm, casual way.": "Теплая разговорная фраза для согласия.",
    "A polite way to say no without sounding cold.": "Вежливый отказ без холодного тона.",
    "Use it when the plan depends on weather, energy, or timing.": "Подходит, когда решение зависит от погоды, сил или времени.",
    "Use before disagreeing so the tone stays friendly.": "Ставь перед несогласием, чтобы тон оставался дружелюбным.",
    "Use it to show balance before adding a point.": "Помогает показать, что ты видишь обе стороны.",
    "Use it when your opinion is mixed.": "Для ситуации, когда ты пока не выбрал сторону.",
    "Use it to accept a good argument without fully agreeing.": "Позволяет признать аргумент, не сдавая свою позицию.",
    "Use it to sum up the main idea.": "Подходит для короткого вывода.",
    "Use it before the main twist of the story.": "Вводит главный поворот истории.",
    "Use it to shorten a longer story.": "Помогает быстро сократить длинный рассказ.",
    "Use it when new information changes the story.": "Используй, когда новая деталь меняет смысл истории.",
    "Use it to reflect after the story.": "Для вывода после рассказа.",
    "Use it before a surprising detail.": "Вводит неожиданную деталь.",
    "Use it to invite the client to describe the process.": "Просит клиента описать процесс шаг за шагом.",
    "Use it to define the client's goal.": "Помогает понять, как клиент измеряет успех.",
    "Use before summarising the client's problem.": "Смягчает пересказ проблемы клиента.",
    "Use it to uncover urgency.": "Помогает выяснить, почему задача стала срочной.",
    "Use it to test the real business impact.": "Проверяет, что именно изменится для бизнеса.",
    "Use it to avoid becoming defensive.": "Помогает не защищаться, а разобраться.",
    "Use it to find the client's reference point.": "Выясняет, с чем клиент сравнивает цену.",
    "Use it before reframing the offer.": "Подводит к разговору о ценности, а не только цене.",
    "Use it to reveal the client's buying conditions.": "Помогает понять условия, при которых клиент готов купить.",
    "Use it to ask about budget without pressure.": "Позволяет спросить о бюджете без давления.",
    "Use it as a light, non-pushy follow-up.": "Легкое напоминание без навязчивости.",
    "Use it to lower pressure.": "Снижает давление на собеседника.",
    "Use it for a short reminder.": "Короткая фраза для мягкого напоминания.",
    "Use it when timing may be the issue.": "Подходит, если проблема во времени.",
    "Use it to give the prospect an easy next step.": "Дает собеседнику простой следующий шаг."
  };

  return map[note] ?? "Используй фразу, когда она естественно подходит к ситуации.";
}

function translateExample(example: string, phraseRu: string) {
  return `Пример с фразой "${phraseRu}": ${example}`;
}

function calibrateLevel(level: LevelCode, angleIndex: number): LevelCode {
  if (level === "B1" && angleIndex >= 6) {
    return "B2";
  }

  return level;
}

function getCoachStage(index: number) {
  if (index < 5) return coachStages[0];
  if (index < 35) return coachStages[1];
  if (index < 43) return coachStages[2];
  if (index < 51) return coachStages[3];
  return coachStages[4];
}

function buildPrompt(index: number, topic: Topic, phrase: CoachPhrase): LocalizedText {
  const localIndex = index % 5;
  const template =
    index < 5
      ? warmUpPrompts[localIndex]
      : index < 35
        ? scenarioPrompts[localIndex]
        : index < 43
          ? followUpPrompts[localIndex]
          : index < 51
            ? phrasePrompts[localIndex]
            : wrapUpPrompts[localIndex];
  const en = template
    .replace("{role}", topic.role)
    .replace("{phrase}", phrase.en);

  return {
    en,
    ru: buildPromptRu(index, topic, phrase)
  };
}

function buildPromptRu(index: number, topic: Topic, phrase: CoachPhrase) {
  const stage = getCoachStage(index);

  if (index < 5) {
    return `${stage.ru}. Быстрый старт: что бы ты сказал по теме "${topic.title.ru}" без долгой подготовки?`;
  }

  if (index < 35) {
    return `${stage.ru}. Ролевая игра: Alex играет роль "${topic.roleRu}". Ответь 2-4 предложениями и продолжи разговор.`;
  }

  if (index < 43) {
    return `${stage.ru}. Задай один естественный уточняющий вопрос или мягко отреагируй на собеседника.`;
  }

  if (index < 51) {
    return `${stage.ru}. Попробуй естественно встроить фразу "${phrase.ru}" (${phrase.en}) в свой ответ.`;
  }

  return `${stage.ru}. Дай лучшую версию ответа: короче, увереннее и с одной живой фразой.`;
}

function buildSimpleAnswer(topic: Topic, phrase: CoachPhrase, vocabulary: string) {
  if (topic.coachCategory === "business") {
    return `${phrase.en}. I want to understand the ${vocabulary} first, then I can suggest the next step.`;
  }

  return `${phrase.en}. For me, the main thing is ${vocabulary}, so I'd keep it simple and see how it goes.`;
}

function buildNaturalAnswer(topic: Topic, phrase: CoachPhrase, vocabulary: string, role: string) {
  if (topic.coachCategory === "business") {
    return `${phrase.en}. Before I suggest anything, I'd like to understand the ${vocabulary} and what matters most to you here.`;
  }

  return `${phrase.en}. Honestly, it depends on my ${vocabulary}, but I'm open to it. What were you thinking?`;
}

function buildStrongerAnswer(topic: Topic, phrase: CoachPhrase, vocabulary: string, index: number) {
  const followUp = topic.coachCategory === "business"
    ? "Would that solve the main problem, or is there another bottleneck?"
    : "How does that sound to you?";

  return `${phrase.en}. The key point for me is ${vocabulary}. I'd rather be clear about that now than pretend everything is fixed. ${followUp}`;
}

export const copy = {
  ru: {
    appName: "English Cat Coach",
    appCaption: "Alex, разговорный коуч B1-B2",
    topics: "Сессии",
    lesson: "Сессия",
    test: "Проверка",
    results: "Итоги",
    auth: "Вход",
    profile: "Профиль",
    review: "Повторение",
    dashboard: "Главная",
    courseMap: "Карта курса",
    dictionary: "Фразы",
    homework: "Практика",
    trainer: "Тренажер",
    speakingRoom: "Говорение",
    allSections: "Все разделы",
    todayPlan: "План на сегодня",
    virtualClass: "Разговорная комната",
    personalDictionary: "Банк фраз",
    grammarDrill: "Точность",
    speakingPractice: "Голосовая практика",
    openSection: "Открыть",
    courseProgress: "Прогресс курса",
    nextLesson: "Следующая сессия",
    homeworkCenter: "Практика после сессии",
    checkAnswer: "Проверить ответ",
    heroTitle: "Говори больше. Исправляй меньше, но точнее.",
    heroText: "Теперь уроки ведет Alex: разговорный коуч B1-B2. Сначала warm-up, потом реальный сценарий, живые фразы, голосовой ответ и короткая обратная связь без длинных лекций.",
    start: "Начать сессию",
    continue: "Продолжить",
    nextExchange: "Следующая реплика",
    startTest: "Перейти к проверке",
    backToTopics: "К сессиям",
    question: "Реплика Alex",
    answer: "Пример ответа",
    listen: "Прослушать",
    topicCount: "60 разговорных сессий",
    exchangeCount: "55 реплик в сессии",
    testCount: "15 заданий после сессии",
    lessonMenu: "Меню сессии",
    questionSection: "Ситуация и вопрос",
    answerSection: "Мой ответ",
    phrasesSection: "Фразы Alex",
    examplesSection: "3 сильных ответа",
    tipSection: "Совет Alex",
    expand: "Открыть",
    collapse: "Свернуть",
    sideDialogueText: "Каждая сессия идет как разговор: warm-up, roleplay, follow-up, phrase spotlight и wrap-up.",
    sideTestText: "Проверка смотрит не сухую грамматику, а естественность, фразы, уточнения и умение продолжать разговор.",
    sideStatsText: "Статистика появляется после заданий и показывает прогресс без давления во время речи.",
    searchPlaceholder: "Поиск темы, фразы или бизнес-сценария",
    noStats: "Статистика появится после проверки",
    chooseAnswer: "Выбери самый живой ответ",
    nextTask: "Следующее задание",
    finishTest: "Завершить проверку",
    score: "Оценка",
    correct: "Правильных ответов",
    tenPoint: "по 10-балльной системе",
    reset: "Пройти заново",
    completed: "Сессия завершена",
    menuLanguage: "Меню",
    listenTask: "Прослушать задание",
    voiceAnswer: "Ответить голосом",
    stopRecording: "Остановить запись",
    recording: "Идет запись...",
    transcribing: "Распознаю ответ...",
    spokenAnswer: "Распознанный ответ",
    voiceSelected: "Ответ выбран по голосу",
    voiceDemo: "Сейчас включено демо-распознавание. Для настоящей проверки речи подключи сервер распознавания.",
    microphoneDenied: "Нет доступа к микрофону",
    voiceError: "Не удалось распознать голос",
    myAnswer: "Мой ответ",
    typeYourAnswer: "Напиши ответ по-английски или запиши голосом. 2-4 предложения достаточно.",
    saveAnswer: "Сохранить ответ",
    recordDialogueAnswer: "Ответить голосом",
    savedAnswer: "Сохраненный ответ",
    feedback: "Короткий разбор Alex",
    spellingNotes: "Короткие исправления",
    wordCount: "Слов",
    usedVocabulary: "Фразы использованы",
    phraseCoach: "Phrase spotlight",
    translation: "Перевод",
    threeCorrectAnswers: "3 правильных варианта",
    answerTranslation: "Смысл ответа",
    teacherExplanation: "Почему это звучит хорошо",
    catTeacher: "Alex и ученый кот",
    catTeacherIntro: "Alex задает живые вопросы, кот хранит фразы, прогресс и повторение.",
    catLessonHint: "Сначала ответь сам. Потом сравни с вариантами: короткий, естественный, сильный.",
    authTitle: "Создай учебный профиль",
    authText: "Приложение сохранит прогресс, слабые фразы и историю ответов на этом устройстве.",
    namePlaceholder: "Имя",
    emailPlaceholder: "Электронная почта",
    authEmailError: "Введите корректный адрес электронной почты",
    signIn: "Войти / создать профиль",
    signOut: "Выйти",
    saving: "Сохраняю...",
    localProfile: "Локальный профиль",
    hello: "Привет",
    completedTopics: "Пройдено сессий",
    bestScore: "Лучший балл",
    weakPhrases: "Слабые фразы",
    weakPhraseReview: "Повторение слабых фраз",
    markMastered: "Выучено",
    noWeakPhrases: "Пока нет слабых фраз. Заверши проверку, и приложение соберет материал для повторения.",
    noProgressYet: "Пока нет прогресса. Заверши первую проверку, чтобы появилась статистика.",
    attempts: "Попыток",
    lastScore: "Последний балл"
  },
  en: {
    appName: "English Cat Coach",
    appCaption: "Alex, B1-B2 spoken coach",
    topics: "Sessions",
    lesson: "Session",
    test: "Check",
    results: "Result",
    auth: "Sign in",
    profile: "Profile",
    review: "Review",
    dashboard: "Home",
    courseMap: "Course map",
    dictionary: "Phrases",
    homework: "Practice",
    trainer: "Trainer",
    speakingRoom: "Speaking",
    allSections: "All sections",
    todayPlan: "Today plan",
    virtualClass: "Speaking room",
    personalDictionary: "Phrase bank",
    grammarDrill: "Accuracy",
    speakingPractice: "Voice practice",
    openSection: "Open",
    courseProgress: "Course progress",
    nextLesson: "Next session",
    homeworkCenter: "After-session practice",
    checkAnswer: "Check answer",
    heroTitle: "Speak more. Correct less, but better.",
    heroText: "Alex now runs the lessons as B1-B2 spoken coaching: warm-up, real scenario, useful phrases, voice answer, and short feedback without long lectures.",
    start: "Start session",
    continue: "Continue",
    nextExchange: "Next turn",
    startTest: "Go to check",
    backToTopics: "Sessions",
    question: "Alex's turn",
    answer: "Sample answer",
    listen: "Listen",
    topicCount: "60 speaking sessions",
    exchangeCount: "55 turns per session",
    testCount: "15 after-session tasks",
    lessonMenu: "Session menu",
    questionSection: "Situation and question",
    answerSection: "My answer",
    phrasesSection: "Alex phrases",
    examplesSection: "3 strong answers",
    tipSection: "Alex tip",
    expand: "Open",
    collapse: "Collapse",
    sideDialogueText: "Each session feels like a conversation: warm-up, roleplay, follow-up, phrase spotlight, and wrap-up.",
    sideTestText: "The check tests natural replies, useful phrases, clarification, and keeping the conversation alive.",
    sideStatsText: "Stats appear after tasks and support progress without pressuring the speaking flow.",
    searchPlaceholder: "Search topic, phrase, or business scenario",
    noStats: "Stats unlock after the check",
    chooseAnswer: "Choose the most natural answer",
    nextTask: "Next task",
    finishTest: "Finish check",
    score: "Score",
    correct: "Correct answers",
    tenPoint: "on a 10-point scale",
    reset: "Restart",
    completed: "Session completed",
    menuLanguage: "Menu",
    listenTask: "Listen to task",
    voiceAnswer: "Answer by voice",
    stopRecording: "Stop recording",
    recording: "Recording...",
    transcribing: "Recognizing answer...",
    spokenAnswer: "Recognized answer",
    voiceSelected: "Selected by voice",
    voiceDemo: "Demo recognition. Connect the speech recognition server for real STT.",
    microphoneDenied: "Microphone access denied",
    voiceError: "Could not recognize voice",
    myAnswer: "My answer",
    typeYourAnswer: "Write your answer in English or record it by voice. 2-4 sentences is enough.",
    saveAnswer: "Save answer",
    recordDialogueAnswer: "Answer by voice",
    savedAnswer: "Saved answer",
    feedback: "Short Alex feedback",
    spellingNotes: "Short corrections",
    wordCount: "Words",
    usedVocabulary: "Phrases used",
    phraseCoach: "Phrase spotlight",
    translation: "Translation",
    threeCorrectAnswers: "3 correct answer options",
    answerTranslation: "Answer meaning",
    teacherExplanation: "Why it works",
    catTeacher: "Alex and the scholar cat",
    catTeacherIntro: "Alex asks real questions; the cat keeps phrases, progress, and review.",
    catLessonHint: "Answer first. Then compare with three versions: short, natural, strong.",
    authTitle: "Create your learning profile",
    authText: "The app saves progress, weak phrases, and answer history on this device.",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    authEmailError: "Enter a valid email",
    signIn: "Sign in / create profile",
    signOut: "Sign out",
    saving: "Saving...",
    localProfile: "Local profile",
    hello: "Hello",
    completedTopics: "Completed sessions",
    bestScore: "Best score",
    weakPhrases: "Weak phrases",
    weakPhraseReview: "Weak phrase review",
    markMastered: "Mastered",
    noWeakPhrases: "No weak phrases yet. Finish a check, and the app will collect review material.",
    noProgressYet: "No progress yet. Finish your first check to unlock statistics.",
    attempts: "Attempts",
    lastScore: "Last score"
  }
} satisfies Record<Language, Record<string, string>>;
