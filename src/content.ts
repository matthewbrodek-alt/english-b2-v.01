export type Language = "ru" | "en";

export type LocalizedText = Record<Language, string>;

export type Topic = {
  id: string;
  category: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  setting: string;
  role: string;
  color: string;
  vocabulary: string[];
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
};

export type AnswerVariant = {
  label: string;
  text: string;
  translation: LocalizedText;
  explanation: LocalizedText;
};

type PhraseTemplate = Omit<PhraseNote, "example">;

export type TestQuestion = {
  id: string;
  prompt: LocalizedText;
  options: string[];
  correctIndex: number;
  explanation: LocalizedText;
};

const colors = [
  "#11B5E4",
  "#FE5AA8",
  "#13C58B",
  "#8F6BFF",
  "#FE9F1C",
  "#2563EB",
  "#14B8A6",
  "#F43F5E",
  "#7C3AED",
  "#0EA5E9"
];

export const topics: Topic[] = [
  {
    id: "daily-life",
    category: { ru: "Быт", en: "Daily life" },
    title: { ru: "Бытовые дела", en: "Everyday routines" },
    description: {
      ru: "Разговор о домашних задачах, привычках, расписании и маленьких бытовых проблемах.",
      en: "Talk about home tasks, habits, schedules, and small everyday problems."
    },
    setting: "a shared apartment conversation",
    role: "flatmate",
    color: colors[0],
    vocabulary: ["chores", "errands", "routine", "deadline", "priority", "maintenance"],
    focus: "clear explanations and polite requests"
  },
  {
    id: "science",
    category: { ru: "Наука", en: "Science" },
    title: { ru: "Научные открытия", en: "Scientific discoveries" },
    description: {
      ru: "Объяснение исследований, гипотез и практической пользы научных идей.",
      en: "Explain research, hypotheses, and the practical value of scientific ideas."
    },
    setting: "a science club discussion",
    role: "research host",
    color: colors[1],
    vocabulary: ["evidence", "hypothesis", "experiment", "breakthrough", "peer review", "data"],
    focus: "structured reasoning and cautious claims"
  },
  {
    id: "sports",
    category: { ru: "Спорт", en: "Sports" },
    title: { ru: "Спорт и тренировки", en: "Sport and training" },
    description: {
      ru: "Обсуждение тренировок, командной работы, восстановления и спортивной мотивации.",
      en: "Discuss workouts, teamwork, recovery, and motivation in sport."
    },
    setting: "a post-training conversation",
    role: "coach",
    color: colors[2],
    vocabulary: ["stamina", "recovery", "strategy", "performance", "consistency", "teamwork"],
    focus: "giving reasons and describing progress"
  },
  {
    id: "cars",
    category: { ru: "Авто", en: "Cars" },
    title: { ru: "Автомобили", en: "Cars and driving" },
    description: {
      ru: "Диалоги о выборе машины, ремонте, безопасности и поездках.",
      en: "Dialogs about choosing a car, repairs, safety, and trips."
    },
    setting: "a car service appointment",
    role: "service advisor",
    color: colors[3],
    vocabulary: ["maintenance", "fuel efficiency", "warranty", "engine", "safety rating", "commute"],
    focus: "precise problem descriptions"
  },
  {
    id: "history",
    category: { ru: "История", en: "History" },
    title: { ru: "Исторические события", en: "Historical events" },
    description: {
      ru: "Как обсуждать причины, последствия и разные интерпретации исторических событий.",
      en: "Discuss causes, consequences, and different interpretations of historical events."
    },
    setting: "a museum audio tour planning meeting",
    role: "historian",
    color: colors[4],
    vocabulary: ["turning point", "legacy", "source", "empire", "reform", "consequence"],
    focus: "sequencing and nuance"
  },
  {
    id: "medicine",
    category: { ru: "Здоровье", en: "Health" },
    title: { ru: "Медицина и здоровье", en: "Medicine and health" },
    description: {
      ru: "Разговор с врачом, описание симптомов и обсуждение профилактики.",
      en: "Talk with a doctor, describe symptoms, and discuss prevention."
    },
    setting: "a clinic consultation",
    role: "doctor",
    color: colors[5],
    vocabulary: ["symptoms", "diagnosis", "prevention", "treatment", "fatigue", "appointment"],
    focus: "clear descriptions and safe uncertainty"
  },
  {
    id: "travel",
    category: { ru: "Путешествия", en: "Travel" },
    title: { ru: "Путешествия", en: "Travel planning" },
    description: {
      ru: "Бронирование, проблемы в дороге, маршруты и культурные ожидания.",
      en: "Booking, travel problems, itineraries, and cultural expectations."
    },
    setting: "a hotel reception desk",
    role: "receptionist",
    color: colors[6],
    vocabulary: ["reservation", "itinerary", "delay", "local customs", "refund", "connection"],
    focus: "polite problem solving"
  },
  {
    id: "ecology",
    category: { ru: "Экология", en: "Ecology" },
    title: { ru: "Экология", en: "Ecology and sustainability" },
    description: {
      ru: "Обсуждение устойчивых решений, переработки, климата и личного вклада.",
      en: "Discuss sustainable choices, recycling, climate, and personal impact."
    },
    setting: "a community sustainability meeting",
    role: "organizer",
    color: colors[7],
    vocabulary: ["sustainability", "emissions", "recycling", "habitat", "footprint", "policy"],
    focus: "balanced opinions"
  },
  {
    id: "finance",
    category: { ru: "Финансы", en: "Finance" },
    title: { ru: "Личные финансы", en: "Personal finance" },
    description: {
      ru: "Бюджет, инвестиции, риски, кредиты и финансовые привычки.",
      en: "Budgeting, investing, risks, loans, and financial habits."
    },
    setting: "a financial planning call",
    role: "advisor",
    color: colors[8],
    vocabulary: ["budget", "savings", "interest rate", "risk", "investment", "cash flow"],
    focus: "explaining trade-offs"
  },
  {
    id: "technology",
    category: { ru: "Технологии", en: "Technology" },
    title: { ru: "Технологии", en: "Technology trends" },
    description: {
      ru: "Обсуждение новых устройств, сервисов, удобства и приватности.",
      en: "Discuss new devices, services, convenience, and privacy."
    },
    setting: "a product demo conversation",
    role: "product specialist",
    color: colors[9],
    vocabulary: ["feature", "privacy", "automation", "usability", "integration", "update"],
    focus: "describing benefits and concerns"
  },
  {
    id: "culture",
    category: { ru: "Культура", en: "Culture" },
    title: { ru: "Культура и традиции", en: "Culture and traditions" },
    description: {
      ru: "Как говорить о традициях, ценностях и культурных различиях уважительно.",
      en: "Talk about traditions, values, and cultural differences respectfully."
    },
    setting: "an international dinner",
    role: "guest",
    color: colors[0],
    vocabulary: ["tradition", "custom", "identity", "heritage", "respect", "community"],
    focus: "curious and respectful questions"
  },
  {
    id: "psychology",
    category: { ru: "Психология", en: "Psychology" },
    title: { ru: "Психология общения", en: "Psychology of communication" },
    description: {
      ru: "Эмоции, мотивация, стресс, границы и навыки общения.",
      en: "Emotions, motivation, stress, boundaries, and communication skills."
    },
    setting: "a reflective coaching session",
    role: "coach",
    color: colors[1],
    vocabulary: ["motivation", "boundary", "stress", "habit", "confidence", "empathy"],
    focus: "expressing feelings precisely"
  },
  {
    id: "space",
    category: { ru: "Космос", en: "Space" },
    title: { ru: "Космос", en: "Space exploration" },
    description: {
      ru: "Миссии, планеты, исследования и аргументы за освоение космоса.",
      en: "Missions, planets, research, and arguments for space exploration."
    },
    setting: "a public lecture Q&A",
    role: "astronomer",
    color: colors[2],
    vocabulary: ["orbit", "mission", "telescope", "gravity", "planet", "launch"],
    focus: "explaining complex ideas simply"
  },
  {
    id: "law",
    category: { ru: "Право", en: "Law" },
    title: { ru: "Право и правила", en: "Law and rights" },
    description: {
      ru: "Права, обязанности, договоры, правила и спокойное уточнение условий.",
      en: "Rights, responsibilities, contracts, rules, and calm clarification."
    },
    setting: "a contract clarification call",
    role: "legal assistant",
    color: colors[3],
    vocabulary: ["contract", "clause", "rights", "obligation", "policy", "evidence"],
    focus: "formal clarification"
  },
  {
    id: "cooking",
    category: { ru: "Еда", en: "Food" },
    title: { ru: "Кулинария", en: "Cooking and recipes" },
    description: {
      ru: "Рецепты, вкусы, рестораны, диеты и объяснение процесса приготовления.",
      en: "Recipes, tastes, restaurants, diets, and explaining cooking steps."
    },
    setting: "a cooking class",
    role: "chef",
    color: colors[4],
    vocabulary: ["ingredient", "texture", "flavour", "seasoning", "recipe", "portion"],
    focus: "sequencing instructions"
  },
  {
    id: "fashion",
    category: { ru: "Стиль", en: "Style" },
    title: { ru: "Мода и стиль", en: "Fashion and style" },
    description: {
      ru: "Одежда, стиль, устойчивое потребление и уместность образа.",
      en: "Clothes, style, sustainable shopping, and dressing for context."
    },
    setting: "a clothing store consultation",
    role: "stylist",
    color: colors[5],
    vocabulary: ["fabric", "fit", "occasion", "trend", "sustainable", "wardrobe"],
    focus: "describing preferences"
  },
  {
    id: "music",
    category: { ru: "Музыка", en: "Music" },
    title: { ru: "Музыка", en: "Music taste" },
    description: {
      ru: "Жанры, концерты, эмоции от музыки и рекомендации.",
      en: "Genres, concerts, emotions in music, and recommendations."
    },
    setting: "a music festival chat",
    role: "festival visitor",
    color: colors[6],
    vocabulary: ["genre", "lyrics", "rhythm", "live performance", "playlist", "mood"],
    focus: "describing taste with nuance"
  },
  {
    id: "cinema",
    category: { ru: "Кино", en: "Cinema" },
    title: { ru: "Кино и сериалы", en: "Movies and series" },
    description: {
      ru: "Сюжеты, персонажи, отзывы, рекомендации и обсуждение без спойлеров.",
      en: "Plots, characters, reviews, recommendations, and spoiler-free discussion."
    },
    setting: "a movie club meeting",
    role: "host",
    color: colors[7],
    vocabulary: ["plot", "character arc", "scene", "review", "spoiler", "soundtrack"],
    focus: "summarizing and recommending"
  },
  {
    id: "literature",
    category: { ru: "Литература", en: "Literature" },
    title: { ru: "Книги и литература", en: "Books and literature" },
    description: {
      ru: "Авторы, жанры, аргументы, персонажи и глубокое обсуждение идей.",
      en: "Authors, genres, arguments, characters, and deep discussion of ideas."
    },
    setting: "a book club discussion",
    role: "reader",
    color: colors[8],
    vocabulary: ["theme", "narrator", "chapter", "metaphor", "conflict", "ending"],
    focus: "interpreting ideas"
  },
  {
    id: "politics",
    category: { ru: "Общество", en: "Society" },
    title: { ru: "Политика без конфликтов", en: "Politics without conflict" },
    description: {
      ru: "Осторожное обсуждение решений, гражданских вопросов и разных взглядов.",
      en: "Careful discussion of decisions, civic issues, and different views."
    },
    setting: "a moderated civic discussion",
    role: "moderator",
    color: colors[9],
    vocabulary: ["policy", "election", "public service", "compromise", "debate", "citizen"],
    focus: "diplomatic disagreement"
  },
  {
    id: "urban-planning",
    category: { ru: "Город", en: "City" },
    title: { ru: "Городская среда", en: "Urban planning" },
    description: {
      ru: "Транспорт, парки, жилье, безопасность и качество городской жизни.",
      en: "Transport, parks, housing, safety, and quality of urban life."
    },
    setting: "a city planning workshop",
    role: "planner",
    color: colors[0],
    vocabulary: ["infrastructure", "traffic", "housing", "public space", "zoning", "walkable"],
    focus: "proposing improvements"
  },
  {
    id: "education",
    category: { ru: "Образование", en: "Education" },
    title: { ru: "Образование", en: "Education and learning" },
    description: {
      ru: "Методы обучения, онлайн-курсы, мотивация и обратная связь.",
      en: "Learning methods, online courses, motivation, and feedback."
    },
    setting: "an education podcast interview",
    role: "teacher",
    color: colors[1],
    vocabulary: ["curriculum", "feedback", "assessment", "motivation", "skill", "progress"],
    focus: "explaining learning goals"
  },
  {
    id: "parenting",
    category: { ru: "Семья", en: "Family" },
    title: { ru: "Воспитание", en: "Parenting conversations" },
    description: {
      ru: "Разговор о правилах, поддержке, обучении и балансе в семье.",
      en: "Talk about rules, support, learning, and balance in family life."
    },
    setting: "a parent-teacher conversation",
    role: "teacher",
    color: colors[2],
    vocabulary: ["routine", "support", "discipline", "screen time", "confidence", "responsibility"],
    focus: "sensitive and balanced language"
  },
  {
    id: "cybersecurity",
    category: { ru: "Безопасность", en: "Security" },
    title: { ru: "Кибербезопасность", en: "Cybersecurity" },
    description: {
      ru: "Пароли, мошенничество, приватность, защита данных и цифровые привычки.",
      en: "Passwords, scams, privacy, data protection, and digital habits."
    },
    setting: "a security awareness training",
    role: "security trainer",
    color: colors[3],
    vocabulary: ["password", "phishing", "breach", "encryption", "privacy", "account"],
    focus: "warning and advising clearly"
  },
  {
    id: "artificial-intelligence",
    category: { ru: "AI", en: "AI" },
    title: { ru: "Искусственный интеллект", en: "Artificial intelligence" },
    description: {
      ru: "AI-инструменты, автоматизация, этика и практическое применение.",
      en: "AI tools, automation, ethics, and practical use cases."
    },
    setting: "an AI product strategy meeting",
    role: "AI consultant",
    color: colors[4],
    vocabulary: ["model", "prompt", "automation", "bias", "workflow", "accuracy"],
    focus: "explaining pros and risks"
  },
  {
    id: "climate",
    category: { ru: "Климат", en: "Climate" },
    title: { ru: "Изменение климата", en: "Climate change" },
    description: {
      ru: "Причины, последствия, адаптация и решения на уровне людей и компаний.",
      en: "Causes, impacts, adaptation, and solutions for people and companies."
    },
    setting: "a climate resilience briefing",
    role: "analyst",
    color: colors[5],
    vocabulary: ["adaptation", "resilience", "heatwave", "emissions", "risk", "mitigation"],
    focus: "evidence-based explanation"
  },
  {
    id: "geography",
    category: { ru: "География", en: "Geography" },
    title: { ru: "География мира", en: "World geography" },
    description: {
      ru: "Страны, регионы, ландшафты, ресурсы и культурные особенности мест.",
      en: "Countries, regions, landscapes, resources, and cultural features of places."
    },
    setting: "a travel geography quiz",
    role: "guide",
    color: colors[6],
    vocabulary: ["region", "border", "landscape", "resource", "population", "coast"],
    focus: "describing places accurately"
  },
  {
    id: "agriculture",
    category: { ru: "Агро", en: "Agriculture" },
    title: { ru: "Сельское хозяйство", en: "Agriculture" },
    description: {
      ru: "Фермерство, еда, технологии, урожай и устойчивые методы.",
      en: "Farming, food, technology, harvests, and sustainable methods."
    },
    setting: "a farm innovation visit",
    role: "farmer",
    color: colors[7],
    vocabulary: ["harvest", "soil", "crop", "irrigation", "yield", "sustainable"],
    focus: "explaining processes"
  },
  {
    id: "energy",
    category: { ru: "Энергия", en: "Energy" },
    title: { ru: "Энергетика", en: "Energy systems" },
    description: {
      ru: "Электричество, возобновляемые источники, цены и надежность сетей.",
      en: "Electricity, renewables, prices, and grid reliability."
    },
    setting: "an energy policy panel",
    role: "engineer",
    color: colors[8],
    vocabulary: ["grid", "renewable", "storage", "demand", "supply", "efficiency"],
    focus: "comparing options"
  },
  {
    id: "architecture",
    category: { ru: "Архитектура", en: "Architecture" },
    title: { ru: "Архитектура", en: "Architecture and buildings" },
    description: {
      ru: "Здания, материалы, пространство, комфорт и дизайн среды.",
      en: "Buildings, materials, space, comfort, and environmental design."
    },
    setting: "an architecture studio review",
    role: "architect",
    color: colors[9],
    vocabulary: ["layout", "material", "facade", "light", "space", "structure"],
    focus: "visual description"
  },
  {
    id: "visual-art",
    category: { ru: "Искусство", en: "Art" },
    title: { ru: "Изобразительное искусство", en: "Visual art" },
    description: {
      ru: "Картины, выставки, стиль, интерпретация и личное впечатление.",
      en: "Paintings, exhibitions, style, interpretation, and personal response."
    },
    setting: "a gallery visit",
    role: "curator",
    color: colors[0],
    vocabulary: ["composition", "contrast", "exhibition", "artist", "texture", "interpretation"],
    focus: "describing impressions"
  },
  {
    id: "photography",
    category: { ru: "Фото", en: "Photo" },
    title: { ru: "Фотография", en: "Photography" },
    description: {
      ru: "Съемка, композиция, свет, техника и рассказы через изображения.",
      en: "Shooting, composition, light, technique, and storytelling through images."
    },
    setting: "a photography workshop",
    role: "photographer",
    color: colors[1],
    vocabulary: ["exposure", "lens", "composition", "portrait", "lighting", "frame"],
    focus: "specific technical language"
  },
  {
    id: "gaming",
    category: { ru: "Игры", en: "Gaming" },
    title: { ru: "Видеоигры", en: "Video games" },
    description: {
      ru: "Геймплей, сюжет, командная игра, баланс и впечатления от игр.",
      en: "Gameplay, story, teamwork, balance, and impressions from games."
    },
    setting: "a gaming community voice chat",
    role: "teammate",
    color: colors[2],
    vocabulary: ["gameplay", "strategy", "quest", "balance", "team", "level"],
    focus: "quick reactions and explanations"
  },
  {
    id: "fitness",
    category: { ru: "Фитнес", en: "Fitness" },
    title: { ru: "Фитнес", en: "Fitness and wellbeing" },
    description: {
      ru: "Цели, упражнения, режим, восстановление и здоровые привычки.",
      en: "Goals, exercises, routines, recovery, and healthy habits."
    },
    setting: "a personal training consultation",
    role: "trainer",
    color: colors[3],
    vocabulary: ["workout", "mobility", "strength", "recovery", "goal", "routine"],
    focus: "goal setting"
  },
  {
    id: "nutrition",
    category: { ru: "Питание", en: "Nutrition" },
    title: { ru: "Питание", en: "Nutrition" },
    description: {
      ru: "Рацион, привычки, продукты, энергия и сбалансированный подход.",
      en: "Diet, habits, food choices, energy, and a balanced approach."
    },
    setting: "a nutrition consultation",
    role: "nutritionist",
    color: colors[4],
    vocabulary: ["protein", "fiber", "portion", "balanced", "craving", "meal"],
    focus: "explaining habits"
  },
  {
    id: "emergency",
    category: { ru: "Экстренно", en: "Emergency" },
    title: { ru: "Экстренные ситуации", en: "Emergency situations" },
    description: {
      ru: "Как сообщить о проблеме, попросить помощь и объяснить ситуацию быстро.",
      en: "Report a problem, ask for help, and explain a situation quickly."
    },
    setting: "an emergency phone call",
    role: "operator",
    color: colors[5],
    vocabulary: ["urgent", "injury", "location", "safe", "assistance", "calm"],
    focus: "clear urgent communication"
  },
  {
    id: "volunteering",
    category: { ru: "Волонтерство", en: "Volunteering" },
    title: { ru: "Волонтерство", en: "Volunteering" },
    description: {
      ru: "Помощь людям, организация событий, обязанности и мотивация.",
      en: "Helping people, organizing events, responsibilities, and motivation."
    },
    setting: "a volunteer onboarding meeting",
    role: "coordinator",
    color: colors[6],
    vocabulary: ["community", "shift", "donation", "responsibility", "support", "impact"],
    focus: "offering help"
  },
  {
    id: "negotiation",
    category: { ru: "Переговоры", en: "Negotiation" },
    title: { ru: "Переговоры", en: "Negotiation" },
    description: {
      ru: "Договоренности, условия, компромиссы и вежливая защита интересов.",
      en: "Agreements, terms, compromises, and polite self-advocacy."
    },
    setting: "a business negotiation",
    role: "partner",
    color: colors[7],
    vocabulary: ["proposal", "compromise", "terms", "deadline", "priority", "agreement"],
    focus: "firm but polite language"
  },
  {
    id: "startups",
    category: { ru: "Бизнес", en: "Business" },
    title: { ru: "Стартапы", en: "Startups" },
    description: {
      ru: "Идеи, продукт, клиенты, инвестиции и проверка гипотез.",
      en: "Ideas, products, customers, investment, and testing assumptions."
    },
    setting: "a startup pitch rehearsal",
    role: "investor",
    color: colors[8],
    vocabulary: ["pitch", "market", "customer", "traction", "revenue", "prototype"],
    focus: "concise persuasion"
  },
  {
    id: "marketing",
    category: { ru: "Маркетинг", en: "Marketing" },
    title: { ru: "Маркетинг", en: "Marketing strategy" },
    description: {
      ru: "Аудитория, бренд, кампании, результаты и позиционирование.",
      en: "Audience, brand, campaigns, results, and positioning."
    },
    setting: "a campaign review meeting",
    role: "marketer",
    color: colors[9],
    vocabulary: ["audience", "brand", "campaign", "conversion", "message", "insight"],
    focus: "presenting results"
  },
  {
    id: "design",
    category: { ru: "Дизайн", en: "Design" },
    title: { ru: "Дизайн продукта", en: "Product design" },
    description: {
      ru: "UX, интерфейсы, обратная связь, удобство и визуальные решения.",
      en: "UX, interfaces, feedback, usability, and visual decisions."
    },
    setting: "a product design critique",
    role: "designer",
    color: colors[0],
    vocabulary: ["layout", "usability", "feedback", "prototype", "flow", "accessibility"],
    focus: "explaining design choices"
  },
  {
    id: "logistics",
    category: { ru: "Логистика", en: "Logistics" },
    title: { ru: "Логистика", en: "Logistics" },
    description: {
      ru: "Доставка, склады, маршруты, сроки и решение задержек.",
      en: "Delivery, warehouses, routes, deadlines, and resolving delays."
    },
    setting: "a delivery coordination call",
    role: "logistics manager",
    color: colors[1],
    vocabulary: ["shipment", "warehouse", "route", "delay", "inventory", "tracking"],
    focus: "operational clarity"
  },
  {
    id: "aviation",
    category: { ru: "Авиация", en: "Aviation" },
    title: { ru: "Авиация", en: "Aviation" },
    description: {
      ru: "Перелеты, безопасность, аэропорты, задержки и работа экипажа.",
      en: "Flights, safety, airports, delays, and crew work."
    },
    setting: "an airport service desk",
    role: "airline agent",
    color: colors[2],
    vocabulary: ["boarding", "delay", "gate", "baggage", "safety", "connection"],
    focus: "airport problem solving"
  },
  {
    id: "maritime",
    category: { ru: "Море", en: "Maritime" },
    title: { ru: "Морские путешествия", en: "Maritime travel" },
    description: {
      ru: "Порты, корабли, маршруты, безопасность и морская торговля.",
      en: "Ports, ships, routes, safety, and maritime trade."
    },
    setting: "a ferry information desk",
    role: "port assistant",
    color: colors[3],
    vocabulary: ["harbour", "ferry", "route", "cargo", "safety", "schedule"],
    focus: "asking for practical details"
  },
  {
    id: "engineering",
    category: { ru: "Инженерия", en: "Engineering" },
    title: { ru: "Инженерия", en: "Engineering" },
    description: {
      ru: "Системы, материалы, тесты, ограничения и технические решения.",
      en: "Systems, materials, tests, constraints, and technical decisions."
    },
    setting: "an engineering design review",
    role: "engineer",
    color: colors[4],
    vocabulary: ["constraint", "prototype", "load", "failure", "material", "testing"],
    focus: "technical explanations"
  },
  {
    id: "philosophy",
    category: { ru: "Философия", en: "Philosophy" },
    title: { ru: "Философские идеи", en: "Philosophical ideas" },
    description: {
      ru: "Смысл, свобода, знание, мораль и аргументация сложных идей.",
      en: "Meaning, freedom, knowledge, morality, and arguing complex ideas."
    },
    setting: "a philosophy seminar",
    role: "seminar leader",
    color: colors[5],
    vocabulary: ["meaning", "freedom", "argument", "belief", "ethics", "truth"],
    focus: "abstract reasoning"
  },
  {
    id: "ethics",
    category: { ru: "Этика", en: "Ethics" },
    title: { ru: "Этические дилеммы", en: "Ethical dilemmas" },
    description: {
      ru: "Сложные решения, ответственность, справедливость и последствия.",
      en: "Difficult choices, responsibility, fairness, and consequences."
    },
    setting: "an ethics committee discussion",
    role: "committee member",
    color: colors[6],
    vocabulary: ["responsibility", "fairness", "harm", "benefit", "choice", "principle"],
    focus: "weighing arguments"
  },
  {
    id: "media-literacy",
    category: { ru: "Медиа", en: "Media" },
    title: { ru: "Медиаграмотность", en: "Media literacy" },
    description: {
      ru: "Новости, источники, факты, манипуляции и проверка информации.",
      en: "News, sources, facts, manipulation, and checking information."
    },
    setting: "a newsroom discussion",
    role: "editor",
    color: colors[7],
    vocabulary: ["source", "claim", "evidence", "bias", "headline", "verification"],
    focus: "questioning information"
  },
  {
    id: "archaeology",
    category: { ru: "Археология", en: "Archaeology" },
    title: { ru: "Археология", en: "Archaeology" },
    description: {
      ru: "Раскопки, артефакты, древние общества и интерпретация находок.",
      en: "Excavations, artifacts, ancient societies, and interpreting findings."
    },
    setting: "an excavation site briefing",
    role: "archaeologist",
    color: colors[8],
    vocabulary: ["artifact", "excavation", "site", "evidence", "ancient", "preservation"],
    focus: "careful interpretation"
  },
  {
    id: "career-growth",
    category: { ru: "Карьера", en: "Career" },
    title: { ru: "Карьерный рост", en: "Career growth" },
    description: {
      ru: "Собеседования, цели, обратная связь, повышение и профессиональное развитие.",
      en: "Interviews, goals, feedback, promotion, and professional development."
    },
    setting: "a career development meeting",
    role: "manager",
    color: colors[2],
    vocabulary: ["promotion", "feedback", "skill gap", "responsibility", "mentor", "growth"],
    focus: "confident professional speech"
  }
];

const dialogueAngles = [
  { en: "open the conversation naturally", ru: "естественно начать разговор" },
  { en: "ask for clarification without sounding lost", ru: "попросить уточнение и не звучать растерянно" },
  { en: "explain your main concern", ru: "объяснить главную проблему или опасение" },
  { en: "give a concrete example", ru: "привести конкретный пример" },
  { en: "compare two possible options", ru: "сравнить два возможных варианта" },
  { en: "disagree politely", ru: "вежливо не согласиться" },
  { en: "admit uncertainty", ru: "признать, что ты не уверен" },
  { en: "summarize what you understood", ru: "кратко пересказать, что ты понял" },
  { en: "ask a follow-up question", ru: "задать уточняющий вопрос" },
  { en: "describe a personal experience", ru: "описать личный опыт" },
  { en: "make a careful recommendation", ru: "дать осторожную рекомендацию" },
  { en: "respond to an objection", ru: "ответить на возражение" },
  { en: "explain the short-term consequence", ru: "объяснить краткосрочное последствие" },
  { en: "explain the long-term consequence", ru: "объяснить долгосрочное последствие" },
  { en: "use a more precise verb", ru: "использовать более точный глагол" },
  { en: "show empathy", ru: "проявить эмпатию" },
  { en: "set a boundary", ru: "обозначить границу" },
  { en: "suggest a compromise", ru: "предложить компромисс" },
  { en: "ask about priorities", ru: "спросить о приоритетах" },
  { en: "describe a risk", ru: "описать риск" },
  { en: "describe a benefit", ru: "описать пользу" },
  { en: "make the answer sound less direct", ru: "смягчить прямой ответ" },
  { en: "make the answer sound more confident", ru: "сделать ответ увереннее" },
  { en: "paraphrase a difficult idea", ru: "переформулировать сложную мысль" },
  { en: "ask for evidence", ru: "попросить доказательства" },
  { en: "mention a practical limitation", ru: "упомянуть практическое ограничение" },
  { en: "offer an alternative", ru: "предложить альтернативу" },
  { en: "connect the topic to daily life", ru: "связать тему с повседневной жизнью" },
  { en: "connect the topic to work", ru: "связать тему с работой" },
  { en: "explain why timing matters", ru: "объяснить, почему важны сроки" },
  { en: "ask for the next step", ru: "спросить о следующем шаге" },
  { en: "give feedback respectfully", ru: "дать обратную связь уважительно" },
  { en: "respond to feedback", ru: "ответить на обратную связь" },
  { en: "clarify responsibility", ru: "уточнить ответственность" },
  { en: "talk about cost or effort", ru: "обсудить цену или усилия" },
  { en: "talk about quality", ru: "поговорить о качестве" },
  { en: "use a conditional sentence", ru: "использовать условное предложение" },
  { en: "use a contrast phrase", ru: "использовать фразу для противопоставления" },
  { en: "use a cause-and-effect phrase", ru: "использовать причинно-следственную связку" },
  { en: "keep the conversation going", ru: "поддержать разговор" },
  { en: "repair a misunderstanding", ru: "исправить недопонимание" },
  { en: "sound more diplomatic", ru: "звучать дипломатичнее" },
  { en: "sound more analytical", ru: "звучать более аналитично" },
  { en: "sound more spontaneous", ru: "звучать более спонтанно" },
  { en: "invite the other person to contribute", ru: "пригласить собеседника высказаться" },
  { en: "check if your explanation was clear", ru: "проверить, было ли объяснение понятным" },
  { en: "describe a trend", ru: "описать тенденцию" },
  { en: "describe an exception", ru: "описать исключение" },
  { en: "make a prediction", ru: "сделать прогноз" },
  { en: "explain a decision", ru: "объяснить решение" },
  { en: "negotiate a small change", ru: "договориться о небольшом изменении" },
  { en: "ask for a recommendation", ru: "попросить рекомендацию" },
  { en: "give a concise conclusion", ru: "дать краткий вывод" },
  { en: "end the conversation politely", ru: "вежливо завершить разговор" },
  { en: "reflect on what you learned", ru: "осмыслить, чему ты научился" }
];

const phraseBank: PhraseTemplate[] = [
  {
    phrase: "What I find interesting is that",
    translation: { ru: "Что мне кажется интересным, так это то, что", en: "What I find interesting is that" },
    explanation: {
      ru: "Мягко вводит личное наблюдение и звучит естественнее, чем просто I think.",
      en: "It introduces a personal observation and sounds more natural than only saying I think."
    }
  },
  {
    phrase: "From my point of view",
    translation: { ru: "С моей точки зрения", en: "From my point of view" },
    explanation: {
      ru: "Подходит для мнения, особенно когда нужно звучать спокойно и аргументированно.",
      en: "Useful for giving an opinion in a calm and reasoned way."
    }
  },
  {
    phrase: "I would say it depends on",
    translation: { ru: "Я бы сказал, что это зависит от", en: "I would say it depends on" },
    explanation: {
      ru: "Хорошая B2+ структура, когда ответ не черно-белый и есть несколько условий.",
      en: "A good B2+ structure when the answer is not black-and-white."
    }
  },
  {
    phrase: "The main challenge is",
    translation: { ru: "Главная сложность заключается в том, что", en: "The main challenge is" },
    explanation: {
      ru: "Помогает быстро назвать проблему и перейти к объяснению.",
      en: "Helps name the problem quickly and move into an explanation."
    }
  },
  {
    phrase: "A practical way to handle it is",
    translation: { ru: "Практичный способ с этим справиться - это", en: "A practical way to handle it is" },
    explanation: {
      ru: "Звучит полезно в разговоре, потому что сразу ведет к решению.",
      en: "Sounds useful in conversation because it moves directly toward a solution."
    }
  },
  {
    phrase: "I see your point, although",
    translation: { ru: "Я понимаю твою мысль, хотя", en: "I see your point, although" },
    explanation: {
      ru: "Вежливая фраза для несогласия: сначала признаешь мысль собеседника, потом добавляешь свою.",
      en: "A polite disagreement phrase: you acknowledge the other person first, then add your view."
    }
  }
];

const teacherConnectors: PhraseTemplate[] = [
  {
    phrase: "is closely connected to",
    translation: { ru: "тесно связано с", en: "is closely connected to" },
    explanation: {
      ru: "Связка помогает объяснять отношения между идеями, а не просто перечислять факты.",
      en: "This connector helps explain relationships between ideas instead of listing facts."
    }
  },
  {
    phrase: "For example",
    translation: { ru: "Например", en: "For example" },
    explanation: {
      ru: "После этой фразы лучше дать конкретную ситуацию, а не повторять общую мысль.",
      en: "After this phrase, give a concrete situation rather than repeating a general idea."
    }
  },
  {
    phrase: "What matters most",
    translation: { ru: "Что важнее всего", en: "What matters most" },
    explanation: {
      ru: "Хорошая фраза для уточняющего вопроса: она показывает интерес к приоритетам собеседника.",
      en: "A useful follow-up phrase because it shows interest in the other person's priorities."
    }
  }
];

export function buildDialogue(topic: Topic): DialogueExchange[] {
  return dialogueAngles.map((angle, index) => {
    const word = topic.vocabulary[index % topic.vocabulary.length];
    const nextWord = topic.vocabulary[(index + 2) % topic.vocabulary.length];
    const phrase = phraseBank[index % phraseBank.length];
    const question = `In ${topic.setting}, how would you ${angle.en} when discussing ${word}?`;
    const answerVariants = buildAnswerVariants(topic, word, nextWord, phrase.phrase);
    const answer = answerVariants[0].text;

    return {
      number: index + 1,
      question,
      answer,
      questionTranslation: {
        ru: `В ситуации "${topic.setting}" как бы ты ${angle.ru}, обсуждая "${word}"?`,
        en: question
      },
      teacherNote: {
        ru: `Задача ответа: не перевести фразу дословно, а показать мысль. Скажи позицию, добавь причину, пример и короткий вопрос собеседнику.`,
        en: `Teacher note: show your idea, add a reason, give an example, and finish with a short follow-up question.`
      },
      phraseNotes: [
        {
          ...phrase,
          example: `${phrase.phrase} ${word} can change the whole conversation.`
        },
        {
          ...teacherConnectors[index % teacherConnectors.length],
          example: `${word} is closely connected to ${nextWord}.`
        },
        {
          ...teacherConnectors[(index + 1) % teacherConnectors.length],
          example: `For example, I would ask the ${topic.role} what matters most.`
        }
      ],
      answerVariants,
      tip: {
        ru: `Фокус: ${topic.focus}. Используй связку "${phrase.phrase}" и добавь конкретный пример.`,
        en: `Focus: ${topic.focus}. Use "${phrase.phrase}" and add one concrete example.`
      }
    };
  });
}

function buildAnswerVariants(topic: Topic, word: string, nextWord: string, starter: string): AnswerVariant[] {
  return [
    {
      label: "A",
      text: `${starter} ${word} is closely connected to ${nextWord}. I would explain it with one clear example, then ask the ${topic.role} what matters most in this situation.`,
      translation: {
        ru: `${starter} - "${word}" тесно связано с "${nextWord}". Я бы объяснил это на одном понятном примере, а затем спросил бы собеседника, что в этой ситуации важнее всего.`,
        en: `${starter} ${word} is closely connected to ${nextWord}.`
      },
      explanation: {
        ru: "Это универсальный правильный ответ: есть вводная фраза, связь двух идей, пример и вопрос. Он звучит уверенно, но не агрессивно.",
        en: "This is a balanced answer with an opener, a link between ideas, an example, and a follow-up question."
      }
    },
    {
      label: "B",
      text: `I would say it depends on the context. If ${word} affects ${nextWord}, I would give a specific example and check whether the ${topic.role} agrees with my reasoning.`,
      translation: {
        ru: `Я бы сказал, что это зависит от контекста. Если "${word}" влияет на "${nextWord}", я бы привел конкретный пример и уточнил, согласен ли собеседник с моей логикой.`,
        en: `I would say it depends on the context.`
      },
      explanation: {
        ru: "Этот вариант звучит более аналитично: ты показываешь условие через if, объясняешь причину и мягко проверяешь понимание.",
        en: "This version is more analytical because it uses a condition, a reason, and a comprehension check."
      }
    },
    {
      label: "C",
      text: `A practical way to answer is to start with the main point: ${word} matters because it changes how people think about ${nextWord}. For example, I would describe one real situation and ask what should happen next.`,
      translation: {
        ru: `Практичный ответ - начать с главной мысли: "${word}" важно, потому что меняет то, как люди думают о "${nextWord}". Например, я бы описал одну реальную ситуацию и спросил, что должно произойти дальше.`,
        en: `A practical way to answer is to start with the main point.`
      },
      explanation: {
        ru: "Этот вариант сильнее для разговорной практики: он дает структуру main point -> because -> for example -> next question.",
        en: "This version is strong for speaking practice because it follows main point -> because -> example -> next question."
      }
    }
  ];
}

export function buildTest(topic: Topic): TestQuestion[] {
  const v = topic.vocabulary;

  return [
    {
      id: `${topic.id}-q1`,
      prompt: {
        ru: `Как лучше начать разговор на тему "${topic.title.ru}"?`,
        en: `What is the best way to open a conversation about "${topic.title.en}"?`
      },
      options: [
        `I am not sure how to explain ${v[0]}, but let me try.`,
        `Let me start with the key point: ${v[0]} affects the whole situation.`,
        `This topic is too difficult, so I will skip it.`,
        `You already know everything about ${v[0]}, right?`
      ],
      correctIndex: 1,
      explanation: {
        ru: "Хороший старт сразу задает главный смысл и звучит уверенно.",
        en: "A strong opening gives the main idea immediately and sounds confident."
      }
    },
    {
      id: `${topic.id}-q2`,
      prompt: {
        ru: "Какая фраза звучит наиболее дипломатично при несогласии?",
        en: "Which phrase sounds most diplomatic when disagreeing?"
      },
      options: [
        "You are completely wrong.",
        "That makes no sense.",
        "I see your point, although I would look at it differently.",
        "I disagree and that is final."
      ],
      correctIndex: 2,
      explanation: {
        ru: "B2-C1 речь часто смягчает несогласие частичным признанием позиции собеседника.",
        en: "B2-C1 speech often softens disagreement by acknowledging the other view first."
      }
    },
    {
      id: `${topic.id}-q3`,
      prompt: {
        ru: `Какая пара слов лучше подходит к теме "${topic.title.ru}"?`,
        en: `Which word pair best fits the topic "${topic.title.en}"?`
      },
      options: [`${v[0]} and ${v[1]}`, "fork and pillow", "thunder and receipt", "mirror and umbrella"],
      correctIndex: 0,
      explanation: {
        ru: "Вариант использует тематическую лексику урока.",
        en: "The option uses vocabulary from the lesson topic."
      }
    },
    {
      id: `${topic.id}-q4`,
      prompt: {
        ru: "Как попросить уточнение естественно?",
        en: "How can you ask for clarification naturally?"
      },
      options: [
        "Repeat.",
        "Could you clarify what you mean by that?",
        "I do not listen.",
        "Why are you talking?"
      ],
      correctIndex: 1,
      explanation: {
        ru: "Could you clarify... звучит вежливо и профессионально.",
        en: "Could you clarify... sounds polite and professional."
      }
    },
    {
      id: `${topic.id}-q5`,
      prompt: {
        ru: `Как связать "${v[2]}" с практическим примером?`,
        en: `How do you connect "${v[2]}" to a practical example?`
      },
      options: [
        `${v[2]} is a word and nothing else.`,
        `A practical example of ${v[2]} would be a situation where people need to make a clear decision.`,
        `I cannot use examples in English.`,
        `${v[2]} is always impossible.`
      ],
      correctIndex: 1,
      explanation: {
        ru: "Ответ добавляет пример и не звучит слишком категорично.",
        en: "The answer adds an example and avoids sounding too absolute."
      }
    },
    {
      id: `${topic.id}-q6`,
      prompt: {
        ru: "Какая фраза лучше показывает неуверенность без слабости?",
        en: "Which phrase shows uncertainty without sounding weak?"
      },
      options: [
        "I have no idea at all.",
        "I may be wrong, but my impression is that...",
        "Nobody can know anything.",
        "This is not my problem."
      ],
      correctIndex: 1,
      explanation: {
        ru: "Фраза звучит осторожно, но сохраняет позицию говорящего.",
        en: "The phrase is cautious but still keeps the speaker's position."
      }
    },
    {
      id: `${topic.id}-q7`,
      prompt: {
        ru: `Как лучше описать риск, связанный с "${v[3]}"?`,
        en: `How should you describe a risk connected with "${v[3]}"?`
      },
      options: [
        `The risk is that ${v[3]} could create delays or confusion if we ignore it.`,
        `${v[3]} is risk because yes.`,
        `Risk no problem always.`,
        `I will not explain ${v[3]}.`
      ],
      correctIndex: 0,
      explanation: {
        ru: "Хороший ответ объясняет причину риска и возможный результат.",
        en: "A good answer explains the reason for the risk and its possible result."
      }
    },
    {
      id: `${topic.id}-q8`,
      prompt: {
        ru: "Как звучит естественный переход к другому аргументу?",
        en: "What is a natural transition to another argument?"
      },
      options: [
        "Other thing.",
        "Another point worth considering is...",
        "Now I talk different.",
        "Stop this topic."
      ],
      correctIndex: 1,
      explanation: {
        ru: "Another point worth considering is... помогает строить связную речь.",
        en: "Another point worth considering is... helps create coherent speech."
      }
    },
    {
      id: `${topic.id}-q9`,
      prompt: {
        ru: "Какая фраза лучше завершает ответ?",
        en: "Which phrase best closes an answer?"
      },
      options: [
        "That is my conclusion for now.",
        "Finish.",
        "I do not want answer.",
        "Words are over."
      ],
      correctIndex: 0,
      explanation: {
        ru: "Фраза кратко завершает мысль и звучит естественно.",
        en: "The phrase closes the idea briefly and naturally."
      }
    },
    {
      id: `${topic.id}-q10`,
      prompt: {
        ru: `Выбери лучший follow-up вопрос по теме "${topic.title.ru}".`,
        en: `Choose the best follow-up question for "${topic.title.en}".`
      },
      options: [
        `How does ${v[4]} affect the final decision?`,
        "What color is Tuesday?",
        "Can I ignore the topic?",
        "Why English exists?"
      ],
      correctIndex: 0,
      explanation: {
        ru: "Follow-up вопрос должен продолжать тему и продвигать диалог.",
        en: "A follow-up question should continue the topic and move the dialogue forward."
      }
    },
    {
      id: `${topic.id}-q11`,
      prompt: {
        ru: "Какая конструкция лучше для сравнения?",
        en: "Which structure works best for comparison?"
      },
      options: [
        "Both options have advantages, but the second one seems more practical.",
        "Two things same no difference.",
        "This is better because better.",
        "I compare nothing."
      ],
      correctIndex: 0,
      explanation: {
        ru: "Ответ сравнивает варианты и добавляет оценку.",
        en: "The answer compares options and adds evaluation."
      }
    },
    {
      id: `${topic.id}-q12`,
      prompt: {
        ru: `Как лучше использовать слово "${v[5]}"?`,
        en: `How should you use the word "${v[5]}"?`
      },
      options: [
        `${v[5]} can influence how people respond to the situation.`,
        `${v[5]} are going yesterday.`,
        `I very ${v[5]} this.`,
        `${v[5]} is eat quickly.`
      ],
      correctIndex: 0,
      explanation: {
        ru: "Вариант грамматически устойчивый и подходит для B2+ речи.",
        en: "The option is grammatically stable and suitable for B2+ speech."
      }
    },
    {
      id: `${topic.id}-q13`,
      prompt: {
        ru: "Какая фраза лучше показывает эмпатию?",
        en: "Which phrase best shows empathy?"
      },
      options: [
        "That sounds frustrating, and I can see why it matters to you.",
        "Your feelings are irrelevant.",
        "I do not care.",
        "Emotion is not allowed."
      ],
      correctIndex: 0,
      explanation: {
        ru: "Эмпатия признает эмоцию собеседника и не спорит с ней.",
        en: "Empathy acknowledges the other person's feeling without arguing against it."
      }
    },
    {
      id: `${topic.id}-q14`,
      prompt: {
        ru: "Как лучше попросить следующий шаг?",
        en: "How can you ask for the next step?"
      },
      options: [
        "What would be the most useful next step?",
        "Next.",
        "Do something.",
        "I stop now."
      ],
      correctIndex: 0,
      explanation: {
        ru: "Вопрос звучит ясно и оставляет пространство для предложения.",
        en: "The question is clear and leaves room for a suggestion."
      }
    },
    {
      id: `${topic.id}-q15`,
      prompt: {
        ru: "Какая фраза лучше звучит как B2-C1 вывод?",
        en: "Which phrase sounds like a B2-C1 conclusion?"
      },
      options: [
        `Overall, ${topic.title.en.toLowerCase()} is not just about ${v[0]}, but also about how people make informed decisions.`,
        "This topic is good.",
        "I finished answer.",
        "Everything is all things."
      ],
      correctIndex: 0,
      explanation: {
        ru: "Вывод обобщает тему и использует более зрелую структуру.",
        en: "The conclusion generalizes the topic and uses a more mature structure."
      }
    }
  ];
}

export const copy = {
  ru: {
    appName: "English Cat Coach",
    appCaption: "ученый кот для B2+ speaking",
    topics: "Темы",
    lesson: "Диалог",
    test: "Тест",
    results: "Результат",
    auth: "Вход",
    profile: "Профиль",
    review: "Повторение",
    heroTitle: "Тренируй английский с ученым котом.",
    heroText:
      "Выбирай тему, проходи 55 Q/A обменов, разбирай фразы с котом-учителем, затем решай тест из 15 заданий. Статистика появляется только после завершения теста.",
    start: "Начать урок",
    continue: "Продолжить",
    nextExchange: "Следующий обмен",
    startTest: "Перейти к тесту",
    backToTopics: "К темам",
    question: "Вопрос",
    answer: "Пример ответа",
    listen: "Прослушать",
    topicCount: "50 разных тем",
    exchangeCount: "55 Q/A обменов",
    testCount: "15 заданий",
    searchPlaceholder: "Поиск темы",
    noStats: "Статистика откроется после теста",
    chooseAnswer: "Выбери лучший ответ",
    nextTask: "Следующее задание",
    finishTest: "Завершить тест",
    score: "Оценка",
    correct: "Правильных ответов",
    tenPoint: "по 10-балльной системе",
    reset: "Пройти заново",
    completed: "Диалог завершен",
    menuLanguage: "Меню",
    listenTask: "Прослушать задание",
    voiceAnswer: "Ответить голосом",
    stopRecording: "Остановить запись",
    recording: "Идет запись...",
    transcribing: "Распознаю ответ...",
    spokenAnswer: "Распознанный ответ",
    voiceSelected: "Выбран вариант по голосу",
    voiceDemo: "Демо-распознавание. Для реального STT подключи backend endpoint.",
    microphoneDenied: "Нет доступа к микрофону",
    voiceError: "Не удалось распознать голос",
    myAnswer: "Мой ответ",
    typeYourAnswer: "Напиши свой ответ на английском или запиши его голосом",
    saveAnswer: "Сохранить ответ",
    recordDialogueAnswer: "Ответить на вопрос голосом",
    savedAnswer: "Сохраненный ответ",
    feedback: "Разбор ответа",
    wordCount: "Слов",
    usedVocabulary: "Лексика темы",
    phraseCoach: "Разбор фраз",
    translation: "Перевод",
    threeCorrectAnswers: "3 правильных варианта ответа",
    answerTranslation: "Перевод ответа",
    teacherExplanation: "Объяснение учителя",
    catTeacher: "Кот-учитель",
    catTeacherIntro: "Разбирает фразы, предлагает 3 сильных ответа и помогает звучать естественно, а не как учебник.",
    catLessonHint: "Сначала ответь сам. Потом сравни с тремя вариантами кота-учителя: уверенный, аналитичный и разговорный.",
    authTitle: "Создай учебный профиль",
    authText: "Так кот-учитель сможет сохранять прогресс, ошибки и слабые фразы на этом устройстве.",
    namePlaceholder: "Имя",
    emailPlaceholder: "Email",
    authEmailError: "Введите корректный email",
    signIn: "Войти / создать профиль",
    signOut: "Выйти",
    saving: "Сохраняю...",
    localProfile: "Локальный профиль",
    hello: "Привет",
    completedTopics: "Пройдено тем",
    bestScore: "Лучший балл",
    weakPhrases: "Слабые фразы",
    weakPhraseReview: "Повторение слабых фраз",
    markMastered: "Выучено",
    noWeakPhrases: "Пока нет слабых фраз. Пройди тест, и кот-учитель соберет материал для повторения.",
    noProgressYet: "Пока нет прогресса. Заверши первый тест, чтобы появилась статистика.",
    attempts: "Попыток",
    lastScore: "Последний балл"
  },
  en: {
    appName: "English Cat Coach",
    appCaption: "scholarly cat for B2+ speaking",
    topics: "Topics",
    lesson: "Dialogue",
    test: "Test",
    results: "Result",
    auth: "Sign in",
    profile: "Profile",
    review: "Review",
    heroTitle: "Train English with a scholarly cat.",
    heroText:
      "Choose a topic, complete 55 Q/A exchanges, study phrases with the cat teacher, then solve a 15-task test. Statistics appear only after the test is finished.",
    start: "Start lesson",
    continue: "Continue",
    nextExchange: "Next exchange",
    startTest: "Go to test",
    backToTopics: "Topics",
    question: "Question",
    answer: "Sample answer",
    listen: "Listen",
    topicCount: "50 unique topics",
    exchangeCount: "55 Q/A exchanges",
    testCount: "15 tasks",
    searchPlaceholder: "Search topic",
    noStats: "Stats unlock after the test",
    chooseAnswer: "Choose the best answer",
    nextTask: "Next task",
    finishTest: "Finish test",
    score: "Score",
    correct: "Correct answers",
    tenPoint: "on a 10-point scale",
    reset: "Restart",
    completed: "Dialogue completed",
    menuLanguage: "Menu",
    listenTask: "Listen to task",
    voiceAnswer: "Answer by voice",
    stopRecording: "Stop recording",
    recording: "Recording...",
    transcribing: "Recognizing answer...",
    spokenAnswer: "Recognized answer",
    voiceSelected: "Selected by voice",
    voiceDemo: "Demo recognition. Connect a backend endpoint for real STT.",
    microphoneDenied: "Microphone access denied",
    voiceError: "Could not recognize voice",
    myAnswer: "My answer",
    typeYourAnswer: "Write your answer in English or record it by voice",
    saveAnswer: "Save answer",
    recordDialogueAnswer: "Answer by voice",
    savedAnswer: "Saved answer",
    feedback: "Answer feedback",
    wordCount: "Words",
    usedVocabulary: "Topic vocabulary",
    phraseCoach: "Phrase coaching",
    translation: "Translation",
    threeCorrectAnswers: "3 correct answer options",
    answerTranslation: "Answer translation",
    teacherExplanation: "Teacher explanation",
    catTeacher: "Cat teacher",
    catTeacherIntro: "Explains phrases, gives 3 strong answers, and helps you sound natural instead of textbook-like.",
    catLessonHint: "Answer first. Then compare yourself with the cat teacher's three versions: confident, analytical, and conversational.",
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
    completedTopics: "Completed topics",
    bestScore: "Best score",
    weakPhrases: "Weak phrases",
    weakPhraseReview: "Weak phrase review",
    markMastered: "Mastered",
    noWeakPhrases: "No weak phrases yet. Finish a test, and the cat teacher will collect review material.",
    noProgressYet: "No progress yet. Finish your first test to unlock statistics.",
    attempts: "Attempts",
    lastScore: "Last score"
  }
} satisfies Record<Language, Record<string, string>>;
