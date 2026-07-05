export type Language = "ru" | "en";
export type LocalizedText = Record<Language, string>;
export type LevelCode = "A2" | "B1" | "B2" | "B2+" | "C1";

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

type Unit = {
  slug: string;
  domain: LocalizedText;
  title: LocalizedText;
  setting: string;
  settingRu: string;
  role: string;
  roleRu: string;
  vocabulary: string[];
  vocabularyRu: string[];
  everydayEnglish: string;
  everydayEnglishRu: string;
  scenario: LocalizedText;
};

type Level = {
  code: LevelCode;
  label: LocalizedText;
  roleProfile: LocalizedText;
  canDoPrefix: LocalizedText;
  focus: LocalizedText;
  grammar: string[];
  pronunciation: string[];
  writing: string[];
};

const colors = ["#11B5E4", "#FE5AA8", "#13C58B", "#8F6BFF", "#FE9F1C", "#2563EB", "#14B8A6", "#F43F5E", "#7C3AED", "#0EA5E9", "#1C8F62", "#DFA72F"];

const units: Unit[] = [
  ["people", "Люди", "People", "Люди и первое впечатление", "People and first impressions", "a first meeting at a language club", "первая встреча в языковом клубе", "new member", "новичок", ["background", "personality", "first impression", "interests", "strength", "habit"], ["опыт и происхождение", "характер", "первое впечатление", "интересы", "сильная сторона", "привычка"], "Nice to meet you. How do you know everyone here?", "Приятно познакомиться. Откуда ты всех здесь знаешь?", "знакомство, характер и личные привычки", "introductions, personality, and personal habits"],
  ["work-study", "Учёба и работа", "Work and study", "Учёба, работа и цели", "Work, study, and goals", "a study planning meeting", "встреча по учебному плану", "course partner", "партнёр по курсу", ["schedule", "deadline", "qualification", "task", "progress", "feedback"], ["расписание", "срок сдачи", "сертификат или квалификация", "задача", "прогресс", "обратная связь"], "Could we look at the plan together?", "Можем вместе посмотреть план?", "расписание, цели, сроки и обратная связь", "schedules, goals, deadlines, and feedback"],
  ["daily-life", "Быт", "Daily life", "Повседневная жизнь", "Daily life", "a conversation with a flatmate", "разговор с соседом по квартире", "flatmate", "сосед по квартире", ["routine", "chores", "errands", "appointment", "delay", "priority"], ["распорядок дня", "домашние дела", "поручения", "запись или встреча", "задержка", "приоритет"], "Would you mind helping me with this?", "Ты не мог бы помочь мне с этим?", "домашние дела, привычки и просьбы", "home tasks, habits, and requests"],
  ["food", "Еда", "Food", "Еда и выбор", "Food and choices", "a small cafe with a friend", "небольшое кафе, разговор с другом", "customer", "посетитель кафе", ["ingredient", "portion", "flavour", "diet", "recipe", "allergy"], ["ингредиент", "порция", "вкус", "рацион", "рецепт", "аллергия"], "Could I have something without nuts?", "Можно мне что-нибудь без орехов?", "заказ еды, предпочтения и ограничения", "ordering food, preferences, and restrictions"],
  ["places", "Город", "Places", "Места и городская среда", "Places and the city", "a city information desk", "городская справочная", "visitor", "гость города", ["neighbourhood", "landmark", "entrance", "queue", "facilities", "directions"], ["район", "достопримечательность", "вход", "очередь", "удобства", "как пройти"], "Excuse me, could you show me how to get there?", "Извините, вы могли бы показать, как туда пройти?", "город, ориентиры и просьба о помощи", "city places, landmarks, and asking for help"],
  ["family", "Семья", "Family", "Семья и отношения", "Family and relationships", "a relaxed conversation with a classmate", "спокойный разговор с однокурсником", "classmate", "однокурсник", ["relative", "generation", "childhood", "celebration", "support", "memory"], ["родственник", "поколение", "детство", "праздник", "поддержка", "воспоминание"], "That reminds me of my family.", "Это напоминает мне мою семью.", "семья, воспоминания и поддержка", "family, memories, and support"],
  ["journeys", "Дорога", "Journeys", "Поездки и транспорт", "Journeys and transport", "a station information desk", "справочная на вокзале", "traveller", "пассажир", ["platform", "connection", "fare", "route", "delay", "journey"], ["платформа", "пересадка", "стоимость проезда", "маршрут", "задержка", "поездка"], "How long does the journey take?", "Сколько длится поездка?", "маршруты, транспорт и проблемы в дороге", "routes, transport, and travel problems"],
  ["health", "Здоровье", "Health", "Здоровье и привычки", "Health and habits", "a short clinic consultation", "короткая консультация в клинике", "patient", "пациент", ["symptom", "appointment", "exercise", "sleep", "stress", "recovery"], ["симптом", "приём у врача", "физические упражнения", "сон", "стресс", "восстановление"], "I have not been feeling well recently.", "В последнее время я неважно себя чувствую.", "самочувствие, привычки и советы", "health, habits, and advice"],
  ["shopping", "Покупки", "Shopping", "Одежда и покупки", "Clothes and shopping", "a shop with a sales assistant", "магазин, разговор с продавцом", "customer", "покупатель", ["size", "receipt", "discount", "quality", "refund", "style"], ["размер", "чек", "скидка", "качество", "возврат денег", "стиль"], "Could I try this on?", "Можно это примерить?", "выбор одежды, покупка и возврат", "choosing, buying, and returning items"],
  ["communication", "Общение", "Communication", "Общение и технологии", "Communication and technology", "a chat about online communication", "разговор об онлайн-общении", "team member", "участник команды", ["message", "notification", "device", "privacy", "reply", "misunderstanding"], ["сообщение", "уведомление", "устройство", "личные данные", "ответ", "недопонимание"], "Let me check that I understood you correctly.", "Дай я проверю, правильно ли я тебя понял.", "сообщения, звонки и недопонимание", "messages, calls, and misunderstandings"],
  ["entertainment", "Досуг", "Entertainment", "Досуг и впечатления", "Entertainment and opinions", "a conversation after a film or event", "разговор после фильма или мероприятия", "friend", "друг", ["plot", "review", "performance", "scene", "recommendation", "audience"], ["сюжет", "отзыв или рецензия", "игра актёров или выступление", "сцена", "рекомендация", "зрители"], "What did you think of it?", "Что ты об этом подумал?", "фильмы, события, мнения и рекомендации", "films, events, opinions, and recommendations"],
  ["travel", "Путешествия", "Travel", "Путешествия и культура", "Travel and culture", "a hotel reception conversation", "разговор на стойке регистрации в отеле", "guest", "гость отеля", ["reservation", "luggage", "itinerary", "local custom", "check-in", "experience"], ["бронь", "багаж", "маршрут", "местная традиция", "заселение", "впечатление"], "Could you recommend something local?", "Вы могли бы порекомендовать что-нибудь местное?", "поездка, культура и полезные вопросы", "travel, culture, and practical questions"]
].map(([slug, domainRu, domainEn, titleRu, titleEn, setting, settingRu, role, roleRu, vocabulary, vocabularyRu, everydayEnglish, everydayEnglishRu, scenarioRu, scenarioEn]) => ({
  slug,
  domain: { ru: domainRu, en: domainEn },
  title: { ru: titleRu, en: titleEn },
  setting,
  settingRu,
  role,
  roleRu,
  vocabulary,
  vocabularyRu,
  everydayEnglish,
  everydayEnglishRu,
  scenario: { ru: scenarioRu, en: scenarioEn }
} as Unit));

const grammar = {
  A2: ["be and have got", "present simple", "adverbs of frequency", "countable and uncountable nouns", "there is / there are", "past simple: be", "past simple verbs", "can, cannot, could", "comparatives", "going to for plans", "present continuous", "prepositions of time and place"],
  B1: ["present perfect for experience", "past continuous", "will and going to", "first conditional", "modals for advice", "relative clauses", "used to", "too and enough", "gerunds and infinitives", "present and past passive", "reported speech basics", "question tags"],
  B2: ["second conditional", "modal deduction", "present perfect continuous", "future forms", "articles for precise meaning", "narrative tenses", "passive reporting", "comparative structures", "discourse markers", "defining and non-defining clauses", "reported questions", "tense choice"],
  "B2+": ["mixed conditionals", "advanced modal meaning", "cleft sentences", "concession clauses", "nominalisation", "reporting verbs", "distancing language", "participle clauses", "emphatic structures", "complex noun phrases", "substitution and ellipsis", "advanced linking"],
  C1: ["subtle tense choice", "inversion for emphasis", "ellipsis and substitution", "advanced passives", "degrees of certainty", "complex time references", "impersonal structures", "advanced comparison", "stance markers", "dense noun phrases", "reported argument", "cohesive devices"]
} satisfies Record<LevelCode, string[]>;

const pronunciation = ["word stress", "sentence rhythm", "main stress", "linking words", "vowel clarity", "past endings", "question intonation", "polite tone", "contrastive stress", "checking tone", "expressive reactions", "presentation pacing"];
const writing = ["profile", "study plan", "short message", "instructions", "place description", "past story", "travel note", "advice note", "shopping message", "clarification email", "review", "travel plan"];

const levels: Level[] = [
  ["A2", "A2 - уверенная база", "A2 - confident foundation", "участник бытового разговора", "survival communicator", "Я могу простыми фразами общаться на тему", "I can use simple language to", "простые ясные фразы, понятные просьбы и короткие уточнения", "clear simple sentences and useful questions"],
  ["B1", "B1 - самостоятельное общение", "B1 - independent interaction", "собеседник в реальной ситуации", "active conversation partner", "Я могу объяснять и уточнять тему", "I can explain and clarify", "причины, примеры, уточнения и короткие истории", "reasons, examples, clarification, and short stories"],
  ["B2", "B2 - уверенная аргументация", "B2 - confident argument", "уверенный собеседник", "independent speaker", "Я могу уверенно обсуждать тему", "I can confidently discuss", "структурированные мнения и взвешенные аргументы", "structured opinions and balanced arguments"],
  ["B2+", "B2+ - беглая речь", "B2+ - fluent discussion", "человек, который ведёт обсуждение", "discussion leader", "Я могу гибко вести разговор на тему", "I can discuss flexibly and naturally", "нюансы, приоритеты и естественная смена реплик", "nuance, priorities, and natural turn-taking"],
  ["C1", "C1 - профессиональная точность", "C1 - professional precision", "собеседник профессионального уровня", "professional communicator", "Я могу точно и профессионально раскрывать тему", "I can communicate precisely and professionally about", "точность, уместный стиль, связность и стратегическая обратная связь", "precision, register, synthesis, and strategic feedback"]
].map(([code, labelRu, labelEn, roleRu, roleEn, canDoRu, canDoEn, focusRu, focusEn]) => ({
  code: code as LevelCode,
  label: { ru: labelRu, en: labelEn },
  roleProfile: { ru: roleRu, en: roleEn },
  canDoPrefix: { ru: canDoRu, en: canDoEn },
  focus: { ru: focusRu, en: focusEn },
  grammar: grammar[code as LevelCode],
  pronunciation,
  writing
}));

export const topics: Topic[] = levels.flatMap((level, levelIndex) =>
  units.map((unit, unitIndex) => ({
    id: `${level.code.toLowerCase().replace("+", "plus")}-${unit.slug}`,
    level: level.code,
    unit: unitIndex + 1,
    category: { ru: `${level.label.ru} · ${unit.domain.ru}`, en: `${level.label.en} · ${unit.domain.en}` },
    title: { ru: `${level.code}: ${unit.title.ru}`, en: `${level.code}: ${unit.title.en}` },
    description: {
      ru: `${level.canDoPrefix.ru}: ${unit.scenario.ru}. Роль ученика: ${level.roleProfile.ru}. В фокусе: ${level.focus.ru}.`,
      en: `${level.canDoPrefix.en} ${unit.scenario.en}. Role: ${level.roleProfile.en}. Focus: ${level.focus.en}.`
    },
    setting: unit.setting,
    settingRu: unit.settingRu,
    role: unit.role,
    roleRu: unit.roleRu,
    roleProfile: level.roleProfile,
    color: colors[(levelIndex * 3 + unitIndex) % colors.length],
    vocabulary: unit.vocabulary,
    vocabularyRu: unit.vocabularyRu,
    grammar: level.grammar[unitIndex],
    pronunciation: level.pronunciation[unitIndex],
    writingSkill: level.writing[unitIndex],
    everydayEnglish: unit.everydayEnglish,
    everydayEnglishRu: unit.everydayEnglishRu,
    canDo: { ru: `${level.canDoPrefix.ru}: ${unit.scenario.ru}.`, en: `${level.canDoPrefix.en} ${unit.scenario.en}.` },
    focus: `${level.focus.en}; grammar: ${level.grammar[unitIndex]}; pronunciation: ${level.pronunciation[unitIndex]}`
  }))
);

const phases = [
  ["Engage with the topic", "Погрузиться в тему"],
  ["Notice useful vocabulary", "Разобрать полезную лексику"],
  ["Use grammar in context", "Применить грамматику в живом контексте"],
  ["Control pronunciation", "Отработать произношение"],
  ["Practise everyday English", "Отработать живую фразу"],
  ["Predict and listen actively", "Предсказать смысл и слушать активно"],
  ["Plan the role-play", "Спланировать ролевой диалог"],
  ["Build a longer answer", "Развернуть ответ"],
  ["Solve a communication problem", "Решить коммуникативную задачу"],
  ["Turn writing into speaking", "Превратить план в устную речь"],
  ["Review your progress", "Подвести итог"]
];

const turns = [
  ["What would you say first?", "С чего начать?", "open the conversation"],
  ["Which detail matters most?", "Какую деталь стоит добавить?", "add one clear detail"],
  ["How can you use the grammar point?", "Как применить грамматику?", "use the target grammar"],
  ["How can you keep the dialogue moving?", "Как продолжить диалог?", "ask a natural follow-up question"],
  ["How would you improve your answer?", "Что сделать сильнее?", "reflect and upgrade the answer"]
];

const levelPhrases: Record<LevelCode, Array<[string, string, string]>> = {
  A2: [["I usually...", "Я обычно...", "простая речь о привычках"], ["Could you help me with...?", "Вы могли бы помочь мне с...?", "мягкая вежливая просьба"], ["I think it is...", "Я думаю, что это...", "безопасное начало мнения"]],
  B1: [["The main reason is...", "Главная причина в том, что...", "добавить объяснение"], ["For example...", "Например...", "сделать ответ конкретным"], ["Could you explain what you mean?", "Можешь объяснить, что ты имеешь в виду?", "мягко уточнить мысль"]],
  B2: [["From my point of view...", "С моей точки зрения...", "уверенно обозначить мнение"], ["On the other hand...", "С другой стороны...", "показать баланс и альтернативу"], ["It depends on the situation.", "Это зависит от ситуации.", "избежать категоричности"]],
  "B2+": [["What I find interesting is...", "Что мне кажется интересным, так это...", "аккуратно ввести нюанс"], ["I see your point, although...", "Я понимаю твою мысль, хотя...", "не согласиться без резкости"], ["The priority should be...", "Приоритетом должно быть...", "удерживать ход обсуждения"]],
  C1: [["A more precise way to frame it is...", "Точнее будет сформулировать так...", "профессиональная точность"], ["There is a strong case for...", "Есть веские основания для...", "аргументированная позиция"], ["I would distinguish between...", "Я бы разграничил...", "развести близкие, но разные идеи"]]
};

export function buildDialogue(topic: Topic): DialogueExchange[] {
  return Array.from({ length: 55 }, (_, index) => {
    const [phaseEn, phaseRu] = phases[Math.floor(index / 5)];
    const [turnEn, turnRu, task] = turns[index % 5];
    const word = topic.vocabulary[index % topic.vocabulary.length];
    const wordRu = getVocabularyRu(topic, word);
    const question = `${phaseEn}. As the ${topic.role}, ${turnEn.toLowerCase()} Try to ${task} about ${word} in ${topic.setting}.`;
    const answerVariants = buildAnswerVariants(topic, word, phaseEn, task);

    return {
      number: index + 1,
      question,
      answer: answerVariants[0].text,
      questionTranslation: {
        ru: `${phaseRu}. Ты говоришь как ${topic.roleProfile.ru}; собеседник - ${topic.roleRu}. ${turnRu} Вплети слово «${wordRu}» (${word}) в ситуацию: ${topic.settingRu}.`,
        en: question
      },
      teacherNote: {
        ru: `Цель шага: ${topic.canDo.ru} В фокусе - ${getRussianGrammarFocus(topic.grammar)}; произношение - ${getRussianPronunciationFocus(topic.pronunciation)}. Отвечай живой репликой: не переводом по словам, а своей мыслью.`,
        en: `Step goal: ${topic.canDo.en} Lesson focus: ${topic.grammar}; pronunciation: ${topic.pronunciation}. Answer naturally, not word by word.`
      },
      phraseNotes: buildPhraseNotes(topic, word, index),
      answerVariants,
      tip: {
        ru: "Мини-план: мысль, причина, пример и вопрос собеседнику. Такая структура учит говорить самостоятельно, а не угадывать готовую фразу.",
        en: "Mini-plan: point, reason, example, and follow-up question. This replaces old one-type tasks with a complete learning cycle."
      }
    };
  });
}

function buildPhraseNotes(topic: Topic, word: string, index: number): PhraseNote[] {
  const base = levelPhrases[topic.level];
  const selected = [base[index % base.length], base[(index + 1) % base.length]];
  const wordRu = getVocabularyRu(topic, word);
  const notes = selected.map(([phrase, ru, explanation]) => ({
    phrase,
    translation: { ru, en: phrase },
    explanation: { ru: `Зачем она нужна: ${explanation}.`, en: "Use this phrase to make the answer clearer and easier to continue." },
    example: `${phrase} ${word} is important here because it changes the situation.`,
    exampleTranslation: { ru: `Смысл примера: «${wordRu}» здесь важно, потому что это меняет ход разговора.`, en: `${phrase} ${word} is important here because it changes the situation.` }
  }));

  return [
    ...notes,
    {
      phrase: topic.everydayEnglish,
      translation: { ru: topic.everydayEnglishRu, en: topic.everydayEnglish },
      explanation: { ru: "Это фраза для живого разговора: с ней просьба или уточнение звучит естественно, а не учебниково.", en: "This is the functional phrase of the lesson for real interaction." },
      example: `${topic.everydayEnglish} I want to make sure I understand the situation.`,
      exampleTranslation: { ru: `${topic.everydayEnglishRu} Я хочу убедиться, что правильно понимаю ситуацию.`, en: `${topic.everydayEnglish} I want to make sure I understand the situation.` }
    }
  ];
}

function buildAnswerVariants(topic: Topic, word: string, phase: string, task: string): AnswerVariant[] {
  const wordRu = getVocabularyRu(topic, word);
  return [
    {
      label: "A",
      text: `I would start simply: ${word} matters in this situation, so I would explain one reason and ask the ${topic.role} a clear follow-up question.`,
      translation: { ru: `Я бы начал спокойно: «${wordRu}» здесь важно. Я назвал бы одну причину и задал собеседнику понятный уточняющий вопрос.`, en: `I would start simply: ${word} matters in this situation, so I would explain one reason and ask the ${topic.role} a clear follow-up question.` },
      explanation: { ru: "Опорный вариант: подходит для первого ответа и помогает не потерять структуру.", en: "Controlled version: good for a first answer and clear structure." }
    },
    {
      label: "B",
      text: `In the ${phase.toLowerCase()} stage, I would ${task}, then connect ${word} to the real context. That makes the answer sound practical rather than memorised.`,
      translation: { ru: `На этапе «${getPhaseRu(phase)}» я бы сделал так: ${getTaskRu(task)}. Затем связал бы «${wordRu}» с реальной ситуацией, чтобы ответ звучал не заученно, а по-человечески.`, en: `In the ${phase.toLowerCase()} stage, I would ${task}, then connect ${word} to the real context. That makes the answer sound practical rather than memorised.` },
      explanation: { ru: "Естественный вариант: связывает этап урока, контекст и настоящую задачу общения.", en: "Natural version: it shows the stage, context, and communication task." }
    },
    {
      label: "C",
      text: `A stronger answer would be: I can see why ${word} is important here. My main point is that we need a clear example, a polite question, and one next step.`,
      translation: { ru: `Более сильный вариант: я понимаю, почему «${wordRu}» здесь важно. Главная мысль такая: нужен ясный пример, вежливый вопрос и следующий шаг.`, en: `A stronger answer would be: I can see why ${word} is important here. My main point is that we need a clear example, a polite question, and one next step.` },
      explanation: { ru: "Расширенный вариант: развивает беглость, связность и умение довести мысль до конца.", en: "Extended version: trains fluency, linking, and completion." }
    }
  ];
}

export function buildTest(topic: Topic): TestQuestion[] {
  const grammarOptions = grammarCorrectOption(topic);
  const q = (id: string, promptRu: string, promptEn: string, options: string[], correctIndex: number, expRu: string, expEn: string): TestQuestion => ({
    id: `${topic.id}-${id}`,
    prompt: { ru: promptRu, en: promptEn },
    options,
    correctIndex,
    explanation: { ru: expRu, en: expEn }
  });

  return [
    q("grammar-1", `Выбери предложение, где правильно работает грамматика: ${getRussianGrammarFocus(topic.grammar)}.`, `Choose the sentence for: ${topic.grammar}.`, grammarOptions, 0, `Проверяем ${getRussianGrammarFocus(topic.grammar)} в живой ситуации, а не в оторванном от речи правиле.`, `This checks ${topic.grammar} in a real situation.`),
    q("vocab-1", `Какое английское слово передаёт значение «${topic.vocabularyRu[0]}»?`, `Which word means ${topic.vocabularyRu[0]}?`, [topic.vocabulary[0], topic.vocabulary[1], topic.vocabulary[2]], 0, `Правильно: ${topic.vocabulary[0]}. Сразу попробуй произнести это слово в короткой фразе.`, `Correct: ${topic.vocabulary[0]}.`),
    q("function-1", "Выбери реплику, которая звучит естественно в разговоре.", "Choose the natural functional line.", [topic.everydayEnglish, "I am not know this.", "Give me answer now."], 0, "Хорошая реплика звучит вежливо и помогает диалогу двигаться дальше.", "The line should be polite and usable."),
    q("pronunciation-1", "Что отрабатываем в произношении?", "What do we practise in pronunciation?", [topic.pronunciation, "silent reading only", "Russian word order"], 0, `Здесь важно проговорить вслух: ${getRussianPronunciationFocus(topic.pronunciation)}.`, "Pronunciation is trained aloud."),
    q("role-1", "Какую роль тренирует ученик?", "What learner role is practised?", [topic.roleProfile.en, "silent translator", "grammar checker only"], 0, `Роль ученика: ${topic.roleProfile.ru}; собеседник в сцене - ${topic.roleRu}.`, `Role: ${topic.roleProfile.en}.`),
    q("can-do-1", "Что значит цель Can Do?", "What is a Can Do goal?", ["It says what you can communicate after the lesson.", "It is a list to copy.", "It replaces speaking."], 0, "Это не список слов, а понятное умение: что ты сможешь сказать после урока.", "It is a real communicative ability."),
    q("writing-1", "Как письменный план помогает устной речи?", "How does writing support speaking?", [`${topic.writingSkill} helps plan a clearer spoken answer.`, "Writing is ignored.", "Writing means copying."], 0, `Письменный набросок (${getRussianWritingSkill(topic.writingSkill)}) помогает сначала собрать мысль, а потом сказать её свободнее.`, "A written plan helps speaking."),
    q("connector-1", "Какая связка помогает привести пример?", "Which connector adds an example?", ["For example", "Because yes", "Never mind"], 0, "For example переводит общую мысль в конкретный пример.", "For example makes it concrete."),
    q("method-1", "Как построен урок?", "Which new method is used?", ["Engage, notice, practise, speak, review.", "Repeat one answer forever.", "Only choose A, B, C."], 0, "Урок идёт циклом: понять ситуацию, заметить язык, потренироваться, сказать самому и подвести итог.", "The lesson is now a learning cycle."),
    q("natural-1", "Какая реплика звучит по-человечески?", "Which line sounds natural?", ["I see your point. Could you give me one example?", "Example now. Speak.", "I not understand nothing."], 0, "Она признаёт мысль собеседника и мягко просит пример.", "It acknowledges and asks politely."),
    q("vocab-2", `Как лучше использовать слово ${topic.vocabulary[2]}?`, `How should you use ${topic.vocabulary[2]}?`, ["In a full sentence with context.", "As one translated word only.", "Only in the dictionary."], 0, "Слово оживает только в контексте: дай ему ситуацию и смысл.", "Use the word in context."),
    q("speaking-1", "Что делает устный ответ сильным?", "What is in a strong spoken answer?", ["A point, a reason, an example, and a question.", "One isolated word.", "A memorised translation."], 0, "Мысль, причина, пример и вопрос помогают говорить связно, а не отдельными словами.", "This structure supports fluency."),
    q("assessment-1", "Когда статистика действительно полезна?", "When are statistics useful?", ["After a task, to show progress and weak points.", "Before practice, to create pressure.", "Never."], 0, "Оценка нужна после задания: она показывает прогресс и слабые места, а не давит заранее.", "Assessment should support learning."),
    q("review-1", "Что делать со слабой фразой?", "What should you do with a weak phrase?", ["Review it in a new sentence and mark it mastered later.", "Delete it immediately.", "Ignore it."], 0, "Ошибка - не провал, а материал для следующего точного повторения.", "A mistake becomes review material."),
    q("final-1", "Что лучше сделать в финале урока?", "Best final step?", ["Say the answer aloud again and improve one detail.", "Stop before speaking.", "Only read Russian."], 0, "В финале стоит ещё раз произнести ответ вслух и улучшить одну деталь.", "Say it aloud again and improve one detail.")
  ];
}

function grammarCorrectOption(topic: Topic) {
  const map: Record<LevelCode, string[]> = {
    A2: [`I usually talk about ${topic.vocabulary[0]} in simple words.`, `I usually talking about ${topic.vocabulary[0]}.`, `I am usually talk about ${topic.vocabulary[0]}.`],
    B1: [`I have already explained why ${topic.vocabulary[0]} matters.`, `I have explain why ${topic.vocabulary[0]} matters.`, `I already explain why ${topic.vocabulary[0]} yesterday.`],
    B2: [`If I had more context, I would give a more balanced answer about ${topic.vocabulary[0]}.`, "If I have more context, I would gave an answer.", "If I had more context, I will gave an answer."],
    "B2+": [`What matters most is how ${topic.vocabulary[0]} affects the next decision.`, `What matters most it is how ${topic.vocabulary[0]} affect the next decision.`, "Most matter is how decision affects."],
    C1: [`There is a strong case for treating ${topic.vocabulary[0]} as a strategic priority.`, `There is strong case to treating ${topic.vocabulary[0]} like priority.`, "Strong case is for treat priority."]
  };
  return map[topic.level];
}

export function getVocabularyRu(topic: Topic, word: string) {
  const index = topic.vocabulary.indexOf(word);
  return topic.vocabularyRu[index] ?? word;
}

const grammarFocusRu: Record<string, string> = {
  "be and have got": "be и have got для описания людей и вещей",
  "present simple": "present simple для привычек и фактов",
  "adverbs of frequency": "наречия частотности: always, usually, sometimes",
  "countable and uncountable nouns": "исчисляемые и неисчисляемые существительные",
  "there is / there are": "there is / there are для описания места",
  "past simple: be": "past simple с глаголом be",
  "past simple verbs": "past simple для событий в прошлом",
  "can, cannot, could": "can, cannot и could для возможностей и просьб",
  comparatives: "сравнительные формы",
  "going to for plans": "going to для планов",
  "present continuous": "present continuous для действий сейчас",
  "prepositions of time and place": "предлоги времени и места",
  "present perfect for experience": "present perfect для опыта",
  "past continuous": "past continuous для фона в прошлом",
  "will and going to": "will и going to для будущего",
  "first conditional": "first conditional для реального условия",
  "modals for advice": "модальные глаголы для совета",
  "relative clauses": "относительные придаточные предложения",
  "used to": "used to для прошлых привычек",
  "too and enough": "too и enough для оценки меры",
  "gerunds and infinitives": "герундий и инфинитив после глаголов",
  "present and past passive": "пассивный залог в настоящем и прошлом",
  "reported speech basics": "основы косвенной речи",
  "question tags": "разделительные вопросы",
  "second conditional": "second conditional для воображаемых ситуаций",
  "modal deduction": "модальные глаголы для предположений",
  "present perfect continuous": "present perfect continuous для длительного действия",
  "future forms": "формы будущего времени",
  "articles for precise meaning": "артикли для точного смысла",
  "narrative tenses": "времена для рассказа",
  "passive reporting": "пассивные конструкции для передачи информации",
  "comparative structures": "сравнительные конструкции",
  "discourse markers": "связки для логики высказывания",
  "defining and non-defining clauses": "уточняющие и добавочные придаточные",
  "reported questions": "косвенные вопросы",
  "tense choice": "выбор времени по смыслу",
  "mixed conditionals": "смешанные условные предложения",
  "advanced modal meaning": "тонкие значения модальных глаголов",
  "cleft sentences": "cleft sentences для выделения главной мысли",
  "concession clauses": "придаточные уступки: although, even though",
  nominalisation: "номинализацию - превращение действия в понятие",
  "reporting verbs": "глаголы передачи речи и позиции",
  "distancing language": "дистанцирующие формулировки",
  "participle clauses": "причастные обороты",
  "emphatic structures": "усилительные конструкции",
  "complex noun phrases": "сложные именные группы",
  "substitution and ellipsis": "замещение и опущение слов без потери смысла",
  "advanced linking": "сложные логические связки",
  "subtle tense choice": "тонкий выбор времени",
  "inversion for emphasis": "инверсию для акцента",
  "ellipsis and substitution": "эллипсис и замену повторяющихся слов",
  "advanced passives": "сложные формы пассивного залога",
  "degrees of certainty": "степени уверенности",
  "complex time references": "сложные временные связи",
  "impersonal structures": "безличные конструкции",
  "advanced comparison": "точное сравнение",
  "stance markers": "маркеры позиции автора",
  "dense noun phrases": "плотные именные группы",
  "reported argument": "передачу чужой аргументации",
  "cohesive devices": "средства связности текста"
};

const pronunciationFocusRu: Record<string, string> = {
  "word stress": "ударение в слове",
  "sentence rhythm": "ритм фразы",
  "main stress": "главное ударение в предложении",
  "linking words": "связное произнесение слов",
  "vowel clarity": "чистые гласные звуки",
  "past endings": "окончания прошедшего времени",
  "question intonation": "интонацию вопроса",
  "polite tone": "вежливую интонацию",
  "contrastive stress": "контрастное ударение",
  "checking tone": "интонацию уточнения",
  "expressive reactions": "живые реакции голосом",
  "presentation pacing": "темп речи в мини-презентации"
};

const writingSkillRu: Record<string, string> = {
  profile: "краткий профиль",
  "study plan": "учебный план",
  "short message": "короткое сообщение",
  instructions: "инструкция",
  "place description": "описание места",
  "past story": "история о прошлом",
  "travel note": "заметка о поездке",
  "advice note": "короткий совет",
  "shopping message": "сообщение о покупке",
  "clarification email": "письмо с уточнением",
  review: "отзыв",
  "travel plan": "план поездки"
};

function getRussianGrammarFocus(value: string) {
  return grammarFocusRu[value] ?? value;
}

function getRussianPronunciationFocus(value: string) {
  return pronunciationFocusRu[value] ?? value;
}

function getRussianWritingSkill(value: string) {
  return writingSkillRu[value] ?? value;
}

function getPhaseRu(value: string) {
  const match = phases.find(([en]) => en === value);
  return match?.[1] ?? value;
}

function getTaskRu(value: string) {
  const map: Record<string, string> = {
    "open the conversation": "начать разговор",
    "add one clear detail": "добавить одну ясную деталь",
    "use the target grammar": "использовать грамматику урока",
    "ask a natural follow-up question": "задать естественный уточняющий вопрос",
    "reflect and upgrade the answer": "осмыслить ответ и сделать его сильнее"
  };
  return map[value] ?? value;
}

export const copy = {
  ru: {
    appName: "English Cat Coach",
    appCaption: "учёный кот для живого английского A2-C1",
    topics: "Уроки",
    lesson: "Урок",
    test: "Проверка",
    results: "Итоги",
    auth: "Вход",
    profile: "Профиль",
    review: "Повторение",
    dashboard: "Главная",
    courseMap: "Карта курса",
    dictionary: "Словарь",
    homework: "Практика",
    trainer: "Тренажёр",
    speakingRoom: "Говорение",
    allSections: "Все разделы",
    todayPlan: "План на сегодня",
    virtualClass: "Учебный кабинет",
    personalDictionary: "Личный словарь",
    grammarDrill: "Грамматика",
    speakingPractice: "Практика речи",
    openSection: "Открыть",
    courseProgress: "Прогресс курса",
    nextLesson: "Следующий урок",
    homeworkCenter: "Практика после урока",
    checkAnswer: "Проверить ответ",
    heroTitle: "Учись говорить по-английски осмысленно.",
    heroText: "Каждый урок ведёт от понятной цели и живой ситуации к собственной реплике: сначала разбираем язык, затем говорим, слушаем себя и закрепляем слабые места.",
    start: "Начать урок",
    continue: "Продолжить",
    nextExchange: "Следующий шаг",
    startTest: "Перейти к проверке",
    backToTopics: "К урокам",
    question: "Задание",
    answer: "Пример ответа",
    listen: "Прослушать",
    topicCount: "60 уроков A2-C1",
    exchangeCount: "55 шагов урока",
    testCount: "15 проверочных заданий",
    lessonMenu: "Меню урока",
    questionSection: "Контекст и цель",
    answerSection: "Мой ответ",
    phrasesSection: "Фразы и роль",
    examplesSection: "3 образца ответа",
    tipSection: "Совет учителя",
    expand: "Открыть",
    collapse: "Свернуть",
    sideDialogueText: "В каждом уроке 55 шагов: вход в ситуацию, лексика, грамматика, произношение, речь и мягкое повторение.",
    sideTestText: "Проверка из 15 заданий показывает, как ты применяешь грамматику, лексику, роль, произношение и живую речь.",
    sideStatsText: "Статистика появляется после проверки и показывает прогресс, а не отвлекает во время урока.",
    searchPlaceholder: "Поиск урока, уровня или темы",
    noStats: "Статистика появится после проверки",
    chooseAnswer: "Выбери самый точный ответ",
    nextTask: "Следующее задание",
    finishTest: "Завершить проверку",
    score: "Оценка",
    correct: "Правильных ответов",
    tenPoint: "по 10-балльной системе",
    reset: "Пройти заново",
    completed: "Урок завершён",
    menuLanguage: "Меню",
    listenTask: "Прослушать задание",
    voiceAnswer: "Ответить голосом",
    stopRecording: "Остановить запись",
    recording: "Идёт запись...",
    transcribing: "Распознаю ответ...",
    spokenAnswer: "Распознанный ответ",
    voiceSelected: "Ответ выбран по голосу",
    voiceDemo: "Сейчас включено демо-распознавание. Для настоящей проверки речи подключи сервер распознавания.",
    microphoneDenied: "Нет доступа к микрофону",
    voiceError: "Не удалось распознать голос",
    myAnswer: "Мой ответ",
    typeYourAnswer: "Напиши свой ответ на английском или запиши его голосом",
    saveAnswer: "Сохранить ответ",
    recordDialogueAnswer: "Ответить на вопрос голосом",
    savedAnswer: "Сохранённый ответ",
    feedback: "Разбор ответа",
    spellingNotes: "Правописание и грамматика",
    wordCount: "Слов",
    usedVocabulary: "Лексика урока",
    phraseCoach: "Разбор фраз",
    translation: "Перевод",
    threeCorrectAnswers: "3 хороших варианта ответа",
    answerTranslation: "Перевод ответа",
    teacherExplanation: "Объяснение учителя",
    catTeacher: "Учёный кот",
    catTeacherIntro: "Ведёт по этапам урока, объясняет роль, даёт три образца ответа и помогает звучать естественно.",
    catLessonHint: "Сначала ответь сам. Потом сравни свой ответ с тремя образцами: опорным, естественным и расширенным.",
    authTitle: "Создай учебный профиль",
    authText: "Так учёный кот сможет сохранять прогресс, ошибки и слабые фразы на этом устройстве.",
    namePlaceholder: "Имя",
    emailPlaceholder: "Электронная почта",
    authEmailError: "Введите корректный адрес электронной почты",
    signIn: "Войти / создать профиль",
    signOut: "Выйти",
    saving: "Сохраняю...",
    localProfile: "Локальный профиль",
    hello: "Привет",
    completedTopics: "Пройдено уроков",
    bestScore: "Лучший балл",
    weakPhrases: "Слабые фразы",
    weakPhraseReview: "Повторение слабых фраз",
    markMastered: "Выучено",
    noWeakPhrases: "Пока нет слабых фраз. Пройди проверку, и учёный кот соберёт материал для повторения.",
    noProgressYet: "Пока нет прогресса. Заверши первую проверку, чтобы появилась статистика.",
    attempts: "Попыток",
    lastScore: "Последний балл"
  },
  en: {
    appName: "English Cat Coach",
    appCaption: "scholarly cat for A2-C1 speaking",
    topics: "Lessons",
    lesson: "Lesson",
    test: "Check",
    results: "Result",
    auth: "Sign in",
    profile: "Profile",
    review: "Review",
    dashboard: "Home",
    courseMap: "Course map",
    dictionary: "Dictionary",
    homework: "Homework",
    trainer: "Trainer",
    speakingRoom: "Speaking",
    allSections: "All sections",
    todayPlan: "Today plan",
    virtualClass: "Study room",
    personalDictionary: "Personal dictionary",
    grammarDrill: "Grammar",
    speakingPractice: "Speaking practice",
    openSection: "Open",
    courseProgress: "Course progress",
    nextLesson: "Next lesson",
    homeworkCenter: "Homework center",
    checkAnswer: "Check answer",
    heroTitle: "Study with a level-based A2-C1 method.",
    heroText: "The new programme works as a learning cycle: Can Do goal, context, grammar, vocabulary, pronunciation, role-play, written planning, spoken answer, and progress check.",
    start: "Start lesson",
    continue: "Continue",
    nextExchange: "Next step",
    startTest: "Go to check",
    backToTopics: "Lessons",
    question: "Task",
    answer: "Sample answer",
    listen: "Listen",
    topicCount: "60 A2-C1 lessons",
    exchangeCount: "55 lesson steps",
    testCount: "15 check tasks",
    lessonMenu: "Lesson menu",
    questionSection: "Context and goal",
    answerSection: "My answer",
    phrasesSection: "Phrases and role",
    examplesSection: "3 answer options",
    tipSection: "Teacher tip",
    expand: "Open",
    collapse: "Collapse",
    sideDialogueText: "Each lesson has 55 steps: engagement, language, practice, speaking, and review.",
    sideTestText: "The 15-task check covers grammar, vocabulary, role, pronunciation, and productive speaking.",
    sideStatsText: "Statistics appear after the check and support progress instead of distracting during practice.",
    searchPlaceholder: "Search lesson, level, or topic",
    noStats: "Stats unlock after the check",
    chooseAnswer: "Choose the best answer",
    nextTask: "Next task",
    finishTest: "Finish check",
    score: "Score",
    correct: "Correct answers",
    tenPoint: "on a 10-point scale",
    reset: "Restart",
    completed: "Lesson completed",
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
    typeYourAnswer: "Write your answer in English or record it by voice",
    saveAnswer: "Save answer",
    recordDialogueAnswer: "Answer by voice",
    savedAnswer: "Saved answer",
    feedback: "Answer feedback",
    spellingNotes: "Spelling and grammar",
    wordCount: "Words",
    usedVocabulary: "Lesson vocabulary",
    phraseCoach: "Phrase coaching",
    translation: "Translation",
    threeCorrectAnswers: "3 correct answer options",
    answerTranslation: "Answer translation",
    teacherExplanation: "Teacher explanation",
    catTeacher: "Cat teacher",
    catTeacherIntro: "Guides the lesson stages, explains the role, gives 3 answers, and helps you sound natural.",
    catLessonHint: "Answer first. Then compare yourself with three versions: controlled, natural, and extended.",
    authTitle: "Create your learning profile",
    authText: "The cat teacher can save progress, mistakes, and weak phrases on this device.",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    authEmailError: "Enter a valid email",
    signIn: "Sign in / create profile",
    signOut: "Sign out",
    saving: "Saving...",
    localProfile: "Local profile",
    hello: "Hello",
    completedTopics: "Completed lessons",
    bestScore: "Best score",
    weakPhrases: "Weak phrases",
    weakPhraseReview: "Weak phrase review",
    markMastered: "Mastered",
    noWeakPhrases: "No weak phrases yet. Finish a check, and the cat teacher will collect review material.",
    noProgressYet: "No progress yet. Finish your first check to unlock statistics.",
    attempts: "Attempts",
    lastScore: "Last score"
  }
} satisfies Record<Language, Record<string, string>>;
