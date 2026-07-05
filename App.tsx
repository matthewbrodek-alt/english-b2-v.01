import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from "expo-audio";
import * as Speech from "expo-speech";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Languages,
  ListChecks,
  LogOut,
  MessageCircle,
  Mic,
  Repeat2,
  RotateCcw,
  Search,
  Trophy,
  User,
  Volume2,
  XCircle
} from "lucide-react-native";
import { buildDialogue, buildTest, copy, getVocabularyRu, topics } from "./src/content";
import type { AnswerVariant, DialogueExchange, Language, PhraseNote, TestQuestion, Topic } from "./src/content";
import { analyzeDialogueAnswer } from "./src/dialogueFeedback";
import type { DialogueAnswer } from "./src/dialogueFeedback";
import {
  getCurrentUser,
  getUserProgress,
  getWeakPhrases,
  loadLearningState,
  markWeakPhraseMastered,
  saveTestCompletion,
  signInLocalUser,
  signOutLocalUser
} from "./src/learningStore";
import type { LearningState, TopicProgress, UserProfile, WeakPhrase } from "./src/learningStore";
import { matchTranscriptToOption, transcribeDialogueAnswer, transcribeVoiceAnswer } from "./src/speechToText";
import { palette, shadow } from "./src/theme";

const scholarCat = require("./assets/icon.png");

type Screen =
  | "auth"
  | "dashboard"
  | "topics"
  | "course"
  | "dictionary"
  | "homework"
  | "trainer"
  | "speaking"
  | "lesson"
  | "test"
  | "results"
  | "profile"
  | "review";
type CopyKey = keyof typeof copy.ru;

type TestResult = {
  topicId: string;
  correct: number;
  score: number;
  answers: number[];
};

type VoiceAnswer = {
  audioUri?: string;
  confidence: number;
  matchedOptionIndex: number;
  source: "backend" | "demo";
  transcript: string;
};

type GrammarTask = {
  correctIndex: number;
  explanation: Record<Language, string>;
  options: string[];
  prompt: Record<Language, string>;
};

type LessonPanelKey = "question" | "answer" | "phrases" | "examples" | "tip";

const lessonPanelButtons: Array<{ key: LessonPanelKey; label: CopyKey }> = [
  { key: "question", label: "questionSection" },
  { key: "answer", label: "answerSection" },
  { key: "phrases", label: "phrasesSection" },
  { key: "examples", label: "examplesSection" },
  { key: "tip", label: "tipSection" }
];

const grammarTasks: GrammarTask[] = [
  {
    correctIndex: 1,
    explanation: {
      en: "Use the present perfect when the result is connected to now: 'has improved'.",
      ru: "Нужен present perfect, потому что результат важен сейчас: 'has improved'."
    },
    options: ["improved", "has improved", "had improved"],
    prompt: {
      en: "My pronunciation ___ a lot since I started shadowing native speakers.",
      ru: "Выбери естественный вариант: My pronunciation ___ a lot since I started shadowing native speakers."
    }
  },
  {
    correctIndex: 2,
    explanation: {
      en: "'Would rather' is followed by the base verb: 'would rather discuss'.",
      ru: "После 'would rather' ставим глагол без to: 'would rather discuss'."
    },
    options: ["would rather to discuss", "would rather discussing", "would rather discuss"],
    prompt: {
      en: "I ___ the details after we see the first results.",
      ru: "Как сказать: 'Я бы предпочёл обсудить детали после первых результатов'?"
    }
  },
  {
    correctIndex: 0,
    explanation: {
      en: "'Even though' introduces contrast and sounds natural in a B2+ argument.",
      ru: "'Even though' вводит уступку: мысль становится живее и точнее, чем с прямым 'but'."
    },
    options: ["Even though", "Because", "In order to"],
    prompt: {
      en: "___ the plan is risky, it could save us time.",
      ru: "Выбери связку для смысла: 'Хотя план рискованный, он может сэкономить время'."
    }
  },
  {
    correctIndex: 1,
    explanation: {
      en: "For a polite suggestion, 'you might want to' is softer than 'you must'.",
      ru: "'You might want to' звучит как мягкий совет, а не приказ."
    },
    options: ["you must", "you might want to", "you are forced to"],
    prompt: {
      en: "If your answer sounds too direct, ___ add a short reason.",
      ru: "Как мягко посоветовать добавить короткое объяснение?"
    }
  },
  {
    correctIndex: 2,
    explanation: {
      en: "'The more..., the more...' is the natural comparative structure.",
      ru: "Конструкция 'the more..., the more...' передаёт зависимость: чем больше одно, тем больше другое."
    },
    options: ["More I practice, more confident I feel", "The more I practice, more confident I feel", "The more I practice, the more confident I feel"],
    prompt: {
      en: "Choose the natural sentence.",
      ru: "Выбери естественное предложение."
    }
  }
];

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const [language, setLanguage] = useState<Language>("ru");
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic>(topics[0]);
  const [exchangeIndex, setExchangeIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [voiceAnswers, setVoiceAnswers] = useState<Record<number, VoiceAnswer>>({});
  const [dialogueDrafts, setDialogueDrafts] = useState<Record<number, string>>({});
  const [dialogueAnswers, setDialogueAnswers] = useState<Record<number, DialogueAnswer>>({});
  const [result, setResult] = useState<TestResult | null>(null);
  const [learningState, setLearningState] = useState<LearningState>({
    progressByUser: {},
    users: []
  });
  const [learningStateLoaded, setLearningStateLoaded] = useState(false);

  const t = (key: CopyKey) => copy[language][key];
  const otherLanguage: Language = language === "ru" ? "en" : "ru";
  const currentUser = useMemo(() => getCurrentUser(learningState), [learningState]);
  const userProgress = useMemo(() => getUserProgress(learningState, currentUser), [currentUser, learningState]);
  const weakPhrases = useMemo(() => getWeakPhrases(userProgress), [userProgress]);
  const nextTopic = useMemo(
    () => topics.find((topic) => !userProgress[topic.id]?.testAttempts) ?? topics[0],
    [userProgress]
  );

  const dialogue = useMemo(() => buildDialogue(selectedTopic), [selectedTopic]);
  const testQuestions = useMemo(() => buildTest(selectedTopic), [selectedTopic]);
  const currentExchange = dialogue[exchangeIndex];
  const currentQuestion = testQuestions[questionIndex];
  const selectedAnswer = answers[questionIndex];

  useEffect(() => {
    let mounted = true;

    loadLearningState().then((state) => {
      if (!mounted) {
        return;
      }

      setLearningState(state);
      setLearningStateLoaded(true);

      if (!getCurrentUser(state)) {
        setScreen("auth");
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredTopics = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return topics;
    }

    return topics.filter((topic) => {
      const haystack = [
        topic.title.ru,
        topic.title.en,
        topic.category.ru,
        topic.category.en,
        topic.description.ru,
        topic.description.en
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [search]);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: "en-US",
      pitch: 1,
      rate: Platform.OS === "ios" ? 0.86 : 0.9
    });
  };

  const startLesson = (topic: Topic) => {
    setSelectedTopic(topic);
    setExchangeIndex(0);
    setQuestionIndex(0);
    setAnswers([]);
    setVoiceAnswers({});
    setDialogueDrafts({});
    setDialogueAnswers({});
    setResult(null);
    setScreen("lesson");
  };

  const startTest = () => {
    setQuestionIndex(0);
    setAnswers([]);
    setVoiceAnswers({});
    setResult(null);
    setScreen("test");
  };

  const startTopicTest = (topic: Topic) => {
    setSelectedTopic(topic);
    setQuestionIndex(0);
    setAnswers([]);
    setVoiceAnswers({});
    setResult(null);
    setScreen("test");
  };

  const signIn = async (name: string, email: string) => {
    const nextState = await signInLocalUser(name, email);
    setLearningState(nextState);
    setScreen("dashboard");
  };

  const signOut = async () => {
    const nextState = await signOutLocalUser();
    setLearningState(nextState);
    setScreen("auth");
  };

  const chooseAnswer = (optionIndex: number) => {
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = optionIndex;
    setAnswers(nextAnswers);
  };

  const finishTest = (finalAnswers = answers) => {
    const correct = testQuestions.reduce((sum, question, index) => {
      return sum + (finalAnswers[index] === question.correctIndex ? 1 : 0);
    }, 0);
    const score = Number(((correct / testQuestions.length) * 10).toFixed(1));
    setResult({
      topicId: selectedTopic.id,
      correct,
      score,
      answers: finalAnswers
    });
    setScreen("results");

    if (currentUser) {
      void saveTestCompletion(learningState, currentUser, {
        answers: finalAnswers,
        dialogueLength: dialogue.length,
        language,
        questions: testQuestions,
        score,
        topic: selectedTopic
      }).then(setLearningState);
    }
  };

  const goNextQuestion = () => {
    if (questionIndex === testQuestions.length - 1) {
      finishTest();
      return;
    }
    setQuestionIndex((value) => value + 1);
  };

  const saveVoiceAnswer = (index: number, voiceAnswer: VoiceAnswer) => {
    setVoiceAnswers((current) => ({
      ...current,
      [index]: voiceAnswer
    }));
  };

  const updateDialogueDraft = (index: number, text: string) => {
    setDialogueDrafts((current) => ({
      ...current,
      [index]: text
    }));
  };

  const saveDialogueAnswer = (index: number, dialogueAnswer: DialogueAnswer) => {
    setDialogueAnswers((current) => ({
      ...current,
      [index]: dialogueAnswer
    }));
  };

  const markPhraseMastered = async (phrase: WeakPhrase) => {
    if (!currentUser) {
      return;
    }

    const nextState = await markWeakPhraseMastered(learningState, currentUser, phrase.phrase, phrase.topicId);
    setLearningState(nextState);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appShell}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Header
            language={language}
            screen={screen}
            t={t}
            onBack={() => setScreen("dashboard")}
            onToggleLanguage={() => setLanguage(otherLanguage)}
          />

          {screen === "auth" && (
            <AuthScreen
              language={language}
              loaded={learningStateLoaded}
              t={t}
              onSignIn={signIn}
            />
          )}

          {screen === "dashboard" && (
            <DashboardScreen
              currentUser={currentUser}
              language={language}
              nextTopic={nextTopic}
              progress={userProgress}
              t={t}
              weakPhrasesCount={weakPhrases.length}
              onOpenCourse={() => setScreen("course")}
              onOpenDictionary={() => setScreen("dictionary")}
              onOpenHomework={() => setScreen("homework")}
              onOpenProfile={() => setScreen("profile")}
              onOpenReview={() => setScreen("review")}
              onOpenSpeaking={() => setScreen("speaking")}
              onOpenTopics={() => setScreen("topics")}
              onOpenTrainer={() => setScreen("trainer")}
              onStartLesson={() => startLesson(nextTopic)}
            />
          )}

          {screen === "course" && (
            <CourseScreen
              isWide={isWide}
              language={language}
              progress={userProgress}
              t={t}
              onSelectTopic={startLesson}
            />
          )}

          {screen === "dictionary" && (
            <DictionaryScreen
              language={language}
              onSelectTopic={startLesson}
              onSpeak={speak}
              t={t}
            />
          )}

          {screen === "homework" && (
            <HomeworkScreen
              language={language}
              nextTopic={nextTopic}
              t={t}
              weakPhrasesCount={weakPhrases.length}
              onOpenReview={() => setScreen("review")}
              onStartLesson={startLesson}
              onStartTest={() => startTopicTest(nextTopic)}
            />
          )}

          {screen === "trainer" && (
            <GrammarTrainerScreen
              language={language}
              onSpeak={speak}
              t={t}
            />
          )}

          {screen === "speaking" && (
            <SpeakingScreen
              language={language}
              onSelectTopic={startLesson}
              onSpeak={speak}
              t={t}
              topic={selectedTopic}
            />
          )}

          {screen === "topics" && (
            <TopicsScreen
              currentUser={currentUser}
              filteredTopics={filteredTopics}
              isWide={isWide}
              language={language}
              progress={userProgress}
              search={search}
              t={t}
              weakPhrasesCount={weakPhrases.length}
              onOpenProfile={() => setScreen("profile")}
              onOpenReview={() => setScreen("review")}
              onSearch={setSearch}
              onSelectTopic={startLesson}
            />
          )}

          {screen === "profile" && currentUser && (
            <ProfileScreen
              language={language}
              progress={userProgress}
              t={t}
              user={currentUser}
              weakPhrasesCount={weakPhrases.length}
              onReview={() => setScreen("review")}
              onSignOut={signOut}
              onTopics={() => setScreen("topics")}
            />
          )}

          {screen === "review" && currentUser && (
            <ReviewScreen
              phrases={weakPhrases}
              t={t}
              user={currentUser}
              onMarkMastered={markPhraseMastered}
              onTopics={() => setScreen("topics")}
            />
          )}

          {screen === "lesson" && (
            <LessonScreen
              answerDraft={dialogueDrafts[exchangeIndex] ?? ""}
              dialogueAnswer={dialogueAnswers[exchangeIndex]}
              dialogueLength={dialogue.length}
              exchange={currentExchange}
              exchangeIndex={exchangeIndex}
              isWide={isWide}
              language={language}
              t={t}
              topic={selectedTopic}
              onBack={() => setScreen("topics")}
              onDraftChange={(text) => updateDialogueDraft(exchangeIndex, text)}
              onNext={() => setExchangeIndex((value) => Math.min(value + 1, dialogue.length - 1))}
              onSaveDialogueAnswer={(answer) => saveDialogueAnswer(exchangeIndex, answer)}
              onSpeak={speak}
              onStartTest={startTest}
            />
          )}

          {screen === "test" && (
            <TestScreen
              answers={answers}
              language={language}
              question={currentQuestion}
              questionIndex={questionIndex}
              selectedAnswer={selectedAnswer}
              t={t}
              total={testQuestions.length}
              voiceAnswer={voiceAnswers[questionIndex]}
              onBack={() => setScreen("lesson")}
              onChooseAnswer={chooseAnswer}
              onSaveVoiceAnswer={saveVoiceAnswer}
              onNext={goNextQuestion}
              onSpeak={speak}
            />
          )}

          {screen === "results" && result && (
            <ResultsScreen
              language={language}
              result={result}
              t={t}
              testQuestions={testQuestions}
              topic={selectedTopic}
              onRestart={() => startLesson(selectedTopic)}
              onTopics={() => setScreen("topics")}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function DashboardScreen({
  currentUser,
  language,
  nextTopic,
  onOpenCourse,
  onOpenDictionary,
  onOpenHomework,
  onOpenProfile,
  onOpenReview,
  onOpenSpeaking,
  onOpenTopics,
  onOpenTrainer,
  onStartLesson,
  progress,
  t,
  weakPhrasesCount
}: {
  currentUser?: UserProfile;
  language: Language;
  nextTopic: Topic;
  onOpenCourse: () => void;
  onOpenDictionary: () => void;
  onOpenHomework: () => void;
  onOpenProfile: () => void;
  onOpenReview: () => void;
  onOpenSpeaking: () => void;
  onOpenTopics: () => void;
  onOpenTrainer: () => void;
  onStartLesson: () => void;
  progress: Record<string, TopicProgress>;
  t: (key: CopyKey) => string;
  weakPhrasesCount: number;
}) {
  const progressItems = Object.values(progress);
  const completedTopics = progressItems.filter((item) => item.testAttempts > 0).length;
  const bestScore = progressItems.reduce((best, item) => Math.max(best, item.bestScore), 0);
  const coursePercent = Math.round((completedTopics / topics.length) * 100);
  const displayName = currentUser?.name || t("localProfile");

  return (
    <View style={styles.screenGap}>
      <LinearGradient colors={["#EAF8FF", "#FFFFFF"]} style={styles.heroPanel}>
        <View style={styles.heroMetaRow}>
          <MetricPill icon={<BookOpen color={palette.skyDark} size={17} />} text={t("virtualClass")} />
          <MetricPill icon={<Brain color={palette.skyDark} size={17} />} text={t("grammarDrill")} />
          <MetricPill icon={<Mic color={palette.skyDark} size={17} />} text={t("speakingPractice")} />
        </View>
        <View style={styles.dashboardHeroLayout}>
          <View style={styles.dashboardHeroText}>
            <Text style={styles.heroTitle}>
              {language === "ru" ? `Привет, ${displayName}.` : `Hello, ${displayName}.`}
            </Text>
            <Text style={styles.heroCopy}>
              {language === "ru"
                ? "Это учебный кабинет: уроки, словарь, домашние задания, повторение ошибок и разговорная практика собраны в одном месте."
                : "This is your study room: lessons, dictionary, homework, mistake review, and speaking practice are collected in one place."}
            </Text>
          </View>
          <Image resizeMode="cover" source={scholarCat} style={styles.dashboardCatImage} />
        </View>

        <View style={styles.resultGrid}>
          <View style={styles.resultCard}>
            <Text style={styles.resultValue}>{coursePercent}%</Text>
            <Text style={styles.resultLabel}>{t("courseProgress")}</Text>
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.resultValue}>{bestScore || "-"}</Text>
            <Text style={styles.resultLabel}>{t("bestScore")}</Text>
          </View>
          <View style={styles.resultCard}>
            <Text style={styles.resultValue}>{weakPhrasesCount}</Text>
            <Text style={styles.resultLabel}>{t("weakPhrases")}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.learningPanel}>
        <View style={styles.panelHeaderRow}>
          <View>
            <Text style={styles.kicker}>{t("todayPlan")}</Text>
            <Text style={styles.panelTitle}>{t("nextLesson")}: {nextTopic.title[language]}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={onStartLesson} style={styles.primaryButton}>
            <MessageCircle color="#FFFFFF" size={19} />
            <Text style={styles.primaryButtonText}>{t("start")}</Text>
          </Pressable>
        </View>
        <Text style={styles.panelText}>{nextTopic.description[language]}</Text>
      </View>

      <View style={styles.learningPanel}>
        <Text style={styles.panelTitle}>{t("allSections")}</Text>
        <View style={styles.sectionShortcutGrid}>
          <SectionShortcut icon={<BookOpen color={palette.skyDark} size={22} />} title={t("courseMap")} text={language === "ru" ? "Пошаговая программа из 50 тем." : "A 50-topic step-by-step course."} onPress={onOpenCourse} t={t} />
          <SectionShortcut icon={<Search color={palette.skyDark} size={22} />} title={t("topics")} text={language === "ru" ? "Каталог всех бытовых, научных и рабочих тем." : "Catalog of everyday, science, and work topics."} onPress={onOpenTopics} t={t} />
          <SectionShortcut icon={<BookOpen color={palette.green} size={22} />} title={t("dictionary")} text={language === "ru" ? "Слова с переводом и озвучкой." : "Words with translation and audio."} onPress={onOpenDictionary} t={t} />
          <SectionShortcut icon={<ListChecks color={palette.orange} size={22} />} title={t("homework")} text={language === "ru" ? "Задания после урока и повторение." : "After-lesson assignments and review."} onPress={onOpenHomework} t={t} />
          <SectionShortcut icon={<Brain color={palette.purple} size={22} />} title={t("trainer")} text={language === "ru" ? "Грамматика и связки для B2+ речи." : "Grammar and connectors for B2+ speaking."} onPress={onOpenTrainer} t={t} />
          <SectionShortcut icon={<Mic color={palette.pink} size={22} />} title={t("speakingRoom")} text={language === "ru" ? "Короткие голосовые разогревы." : "Short voice warm-ups."} onPress={onOpenSpeaking} t={t} />
          <SectionShortcut icon={<Repeat2 color={palette.skyDark} size={22} />} title={t("review")} text={language === "ru" ? "Слабые фразы из ошибок." : "Weak phrases from mistakes."} onPress={onOpenReview} t={t} />
          <SectionShortcut icon={<User color={palette.skyDark} size={22} />} title={t("profile")} text={language === "ru" ? "Прогресс, попытки и выход." : "Progress, attempts, and sign out."} onPress={onOpenProfile} t={t} />
        </View>
      </View>
    </View>
  );
}

function SectionShortcut({
  icon,
  onPress,
  t,
  text,
  title
}: {
  icon: React.ReactNode;
  onPress: () => void;
  t: (key: CopyKey) => string;
  text: string;
  title: string;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.sectionShortcut}>
      <View style={styles.sectionShortcutTop}>
        {icon}
        <ChevronRight color={palette.muted} size={18} />
      </View>
      <Text style={styles.sectionShortcutTitle}>{title}</Text>
      <Text style={styles.sectionShortcutText}>{text}</Text>
      <Text style={styles.sectionShortcutAction}>{t("openSection")}</Text>
    </Pressable>
  );
}

function CourseScreen({
  isWide,
  language,
  onSelectTopic,
  progress,
  t
}: {
  isWide: boolean;
  language: Language;
  onSelectTopic: (topic: Topic) => void;
  progress: Record<string, TopicProgress>;
  t: (key: CopyKey) => string;
}) {
  const completedTopics = Object.values(progress).filter((item) => item.testAttempts > 0).length;

  return (
    <View style={styles.screenGap}>
      <View style={styles.learningPanel}>
        <View style={styles.panelHeaderRow}>
          <View>
            <Text style={styles.kicker}>{t("courseMap")}</Text>
            <Text style={styles.panelTitle}>
              {language === "ru" ? "Путь ученика B2+" : "B2+ learner path"}
            </Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>{completedTopics}/{topics.length}</Text>
          </View>
        </View>
        <Text style={styles.panelText}>
          {language === "ru"
            ? "Каждая тема открывает 55 реплик, самостоятельный ответ, голосовую практику и тест из 15 заданий."
            : "Each topic opens 55 dialogue turns, free answer practice, voice work, and a 15-task test."}
        </Text>
      </View>

      <View style={[styles.topicGrid, isWide && styles.topicGridWide]}>
        {topics.map((topic, index) => (
          <CourseCard
            index={index}
            key={topic.id}
            language={language}
            progress={progress[topic.id]}
            topic={topic}
            onPress={() => onSelectTopic(topic)}
          />
        ))}
      </View>
    </View>
  );
}

function CourseCard({
  index,
  language,
  onPress,
  progress,
  topic
}: {
  index: number;
  language: Language;
  onPress: () => void;
  progress?: TopicProgress;
  topic: Topic;
}) {
  const completed = Boolean(progress?.testAttempts);
  const label = completed
    ? language === "ru"
      ? `Сдано: ${progress?.bestScore}/10`
      : `Passed: ${progress?.bestScore}/10`
    : language === "ru"
      ? "Новый урок"
      : "New lesson";

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.topicCard}>
      <View style={[styles.topicStripe, { backgroundColor: topic.color }]} />
      <View style={styles.topicCardTop}>
        <Text style={styles.topicNumber}>{String(index + 1).padStart(2, "0")}</Text>
        <View style={[styles.topicCategory, completed && styles.topicCategoryDone]}>
          <Text style={styles.topicCategoryText}>{label}</Text>
        </View>
      </View>
      <Text style={styles.topicTitle}>{topic.title[language]}</Text>
      <Text style={styles.topicText}>{topic.description[language]}</Text>
      <View style={styles.topicFooter}>
        <Text style={styles.topicFooterText}>{topic.category[language]}</Text>
        <ChevronRight color={palette.skyDark} size={18} />
      </View>
    </Pressable>
  );
}

function DictionaryScreen({
  language,
  onSelectTopic,
  onSpeak,
  t
}: {
  language: Language;
  onSelectTopic: (topic: Topic) => void;
  onSpeak: (text: string) => void;
  t: (key: CopyKey) => string;
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const words = topics.flatMap((topic) =>
    topic.vocabulary.map((word) => ({
      id: `${topic.id}-${word}`,
      topic,
      translation: getVocabularyRu(topic, word),
      word
    }))
  );
  const filtered = words
    .filter((item) => {
      if (!normalized) {
        return true;
      }
      return `${item.word} ${item.translation} ${item.topic.title.ru} ${item.topic.title.en}`.toLowerCase().includes(normalized);
    })
    .slice(0, 90);

  return (
    <View style={styles.screenGap}>
      <View style={styles.learningPanel}>
        <Text style={styles.kicker}>{t("personalDictionary")}</Text>
        <Text style={styles.panelTitle}>
          {language === "ru" ? "Слова по всем урокам" : "Words across all lessons"}
        </Text>
        <Text style={styles.panelText}>
          {language === "ru"
            ? "Здесь собрана лексика из тем: можно искать, слушать произношение и сразу открыть урок."
            : "Vocabulary from the topics: search, listen to pronunciation, and open the lesson."}
        </Text>
      </View>

      <View style={styles.searchBox}>
        <Search color={palette.muted} size={19} />
        <TextInput
          onChangeText={setQuery}
          placeholder={language === "ru" ? "Найти слово или перевод" : "Find a word or translation"}
          placeholderTextColor={palette.muted}
          style={styles.searchInput}
          value={query}
        />
      </View>

      <View style={styles.dictionaryGrid}>
        {filtered.map((item) => (
          <View key={item.id} style={styles.dictionaryCard}>
            <View style={styles.dialogueBlockTop}>
              <Text style={styles.dictionaryWord}>{item.word}</Text>
              <Pressable accessibilityRole="button" onPress={() => onSpeak(item.word)} style={styles.listenButton}>
                <Volume2 color={palette.skyDark} size={17} />
              </Pressable>
            </View>
            <Text style={styles.translationText}>{item.translation}</Text>
            <Text style={styles.voiceHint}>{item.topic.title[language]}</Text>
            <Pressable accessibilityRole="button" onPress={() => onSelectTopic(item.topic)} style={styles.secondaryButton}>
              <BookOpen color={palette.skyDark} size={18} />
              <Text style={styles.secondaryButtonText}>{t("lesson")}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

function HomeworkScreen({
  language,
  nextTopic,
  onOpenReview,
  onStartLesson,
  onStartTest,
  t,
  weakPhrasesCount
}: {
  language: Language;
  nextTopic: Topic;
  onOpenReview: () => void;
  onStartLesson: (topic: Topic) => void;
  onStartTest: () => void;
  t: (key: CopyKey) => string;
  weakPhrasesCount: number;
}) {
  return (
    <View style={styles.screenGap}>
      <View style={styles.learningPanel}>
        <Text style={styles.kicker}>{t("homeworkCenter")}</Text>
        <Text style={styles.panelTitle}>
          {language === "ru" ? "Задания после уроков" : "After-lesson assignments"}
        </Text>
        <Text style={styles.panelText}>
          {language === "ru"
            ? "Домашка собирает то, что обычно нужно ученику между занятиями: продолжить урок, закрыть слабые фразы и пройти контроль."
            : "Homework collects what a learner usually needs between lessons: continue, review weak phrases, and check knowledge."}
        </Text>
      </View>

      <View style={styles.homeworkGrid}>
        <HomeworkCard
          icon={<MessageCircle color={palette.skyDark} size={22} />}
          title={language === "ru" ? "Продолжить диалог" : "Continue dialogue"}
          text={language === "ru" ? `Следующая тема: ${nextTopic.title.ru}. Ответь на вопросы письменно или голосом.` : `Next topic: ${nextTopic.title.en}. Answer by typing or voice.`}
          button={t("start")}
          onPress={() => onStartLesson(nextTopic)}
        />
        <HomeworkCard
          icon={<Repeat2 color={palette.green} size={22} />}
          title={language === "ru" ? "Повторить слабые фразы" : "Review weak phrases"}
          text={language === "ru" ? `К повторению сейчас: ${weakPhrasesCount}. Разбери их до следующего теста.` : `Current review queue: ${weakPhrasesCount}. Study them before the next test.`}
          button={t("review")}
          onPress={onOpenReview}
        />
        <HomeworkCard
          icon={<ListChecks color={palette.orange} size={22} />}
          title={language === "ru" ? "Контрольная проверка" : "Knowledge check"}
          text={language === "ru" ? "15 заданий с голосовым ответом и десятибалльной оценкой." : "15 tasks with voice answer support and a ten-point score."}
          button={t("test")}
          onPress={onStartTest}
        />
      </View>
    </View>
  );
}

function HomeworkCard({
  button,
  icon,
  onPress,
  text,
  title
}: {
  button: string;
  icon: React.ReactNode;
  onPress: () => void;
  text: string;
  title: string;
}) {
  return (
    <View style={styles.homeworkCard}>
      <View style={styles.sectionShortcutTop}>
        {icon}
        <ChevronRight color={palette.muted} size={18} />
      </View>
      <Text style={styles.sectionShortcutTitle}>{title}</Text>
      <Text style={styles.sectionShortcutText}>{text}</Text>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>{button}</Text>
      </Pressable>
    </View>
  );
}

function GrammarTrainerScreen({
  language,
  onSpeak,
  t
}: {
  language: Language;
  onSpeak: (text: string) => void;
  t: (key: CopyKey) => string;
}) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const task = grammarTasks[taskIndex];
  const isAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === task.correctIndex;

  const goNext = () => {
    setTaskIndex((value) => (value + 1) % grammarTasks.length);
    setSelectedIndex(null);
  };

  return (
    <View style={styles.testPanel}>
      <View style={styles.lessonTop}>
        <View>
          <Text style={styles.kicker}>{t("grammarDrill")}</Text>
          <Text style={styles.lessonTitle}>{taskIndex + 1}/{grammarTasks.length}</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={() => onSpeak(task.prompt.en)} style={styles.secondaryButton}>
          <Volume2 color={palette.skyDark} size={19} />
          <Text style={styles.secondaryButtonText}>{t("listenTask")}</Text>
        </Pressable>
      </View>

      <Text style={styles.testPrompt}>{task.prompt[language]}</Text>

      <View style={styles.optionList}>
        {task.options.map((option, index) => {
          const selected = selectedIndex === index;
          const correct = isAnswered && index === task.correctIndex;
          const wrong = isAnswered && selected && index !== task.correctIndex;
          return (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => setSelectedIndex(index)}
              style={[
                styles.optionButton,
                selected && styles.optionButtonSelected,
                correct && styles.trainerOptionCorrect,
                wrong && styles.trainerOptionWrong
              ]}
            >
              <View style={[styles.optionLetter, selected && styles.optionLetterSelected]}>
                <Text style={[styles.optionLetterText, selected && styles.optionLetterTextSelected]}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      {isAnswered ? (
        <View style={styles.feedbackPanel}>
          <Text style={styles.feedbackTitle}>
            {isCorrect
              ? language === "ru"
                ? "Верно"
                : "Correct"
              : language === "ru"
                ? "Почти. Смотри объяснение"
                : "Almost. Check the explanation"}
          </Text>
          <Text style={styles.feedbackText}>{task.explanation[language]}</Text>
        </View>
      ) : null}

      <Pressable accessibilityRole="button" disabled={!isAnswered} onPress={goNext} style={[styles.primaryButton, !isAnswered && styles.disabledButton]}>
        <CheckCircle2 color="#FFFFFF" size={20} />
        <Text style={styles.primaryButtonText}>{t("nextTask")}</Text>
      </Pressable>
    </View>
  );
}

function SpeakingScreen({
  language,
  onSelectTopic,
  onSpeak,
  t,
  topic
}: {
  language: Language;
  onSelectTopic: (topic: Topic) => void;
  onSpeak: (text: string) => void;
  t: (key: CopyKey) => string;
  topic: Topic;
}) {
  const prompts = buildDialogue(topic).slice(0, 8);

  return (
    <View style={styles.screenGap}>
      <View style={styles.learningPanel}>
        <Text style={styles.kicker}>{t("speakingRoom")}</Text>
        <Text style={styles.panelTitle}>{topic.title[language]}</Text>
        <Text style={styles.panelText}>
          {language === "ru"
            ? "Короткая разговорная разминка: слушай вопрос, отвечай вслух, затем открывай полный диалог для разбора."
            : "A short speaking warm-up: listen to a question, answer aloud, then open the full dialogue for coaching."}
        </Text>
        <View style={styles.actionRow}>
          {topics.slice(0, 5).map((item) => (
            <Pressable accessibilityRole="button" key={item.id} onPress={() => onSelectTopic(item)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{item.title[language]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.reviewList}>
        {prompts.map((prompt) => (
          <View key={prompt.number} style={styles.phraseReviewCard}>
              <View style={styles.dialogueBlockTop}>
              <Text style={styles.phraseText}>{prompt.question}</Text>
              <Pressable accessibilityRole="button" onPress={() => onSpeak(prompt.question)} style={styles.listenButton}>
                <Volume2 color={palette.skyDark} size={17} />
              </Pressable>
            </View>
            <Text style={styles.translationText}>{prompt.questionTranslation[language]}</Text>
            <Text style={styles.teacherNoteText}>{prompt.teacherNote[language]}</Text>
          </View>
        ))}
      </View>

      <Pressable accessibilityRole="button" onPress={() => onSelectTopic(topic)} style={styles.primaryButton}>
        <MessageCircle color="#FFFFFF" size={19} />
        <Text style={styles.primaryButtonText}>{t("start")}</Text>
      </Pressable>
    </View>
  );
}

function AuthScreen({
  language,
  loaded,
  onSignIn,
  t
}: {
  language: Language;
  loaded: boolean;
  onSignIn: (name: string, email: string) => Promise<void>;
  t: (key: CopyKey) => string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setError("");

    if (!email.includes("@")) {
      setError(t("authEmailError"));
      return;
    }

    setSubmitting(true);
    try {
      await onSignIn(name, email);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.authPanel}>
      <Image resizeMode="cover" source={scholarCat} style={styles.authImage} />
      <View style={styles.authContent}>
        <Text style={styles.resultsTitle}>{t("authTitle")}</Text>
        <Text style={styles.resultsCaption}>{t("authText")}</Text>
        <TextInput
          onChangeText={setName}
          placeholder={t("namePlaceholder")}
          placeholderTextColor={palette.muted}
          style={styles.authInput}
          value={name}
        />
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder={t("emailPlaceholder")}
          placeholderTextColor={palette.muted}
          style={styles.authInput}
          value={email}
        />
        {error ? <Text style={styles.voiceErrorText}>{error}</Text> : null}
        <Pressable
          accessibilityRole="button"
          disabled={!loaded || submitting}
          onPress={submit}
          style={[styles.primaryButton, (!loaded || submitting) && styles.disabledButton]}
        >
          <User color="#FFFFFF" size={19} />
          <Text style={styles.primaryButtonText}>{submitting ? t("saving") : t("signIn")}</Text>
        </Pressable>
        <Text style={styles.voiceHint}>
          {language === "ru"
            ? "Пока это локальный профиль: данные хранятся на устройстве. Серверную авторизацию можно подключить позже."
            : "This is a local profile for now: data is stored on this device. Server auth can be connected later."}
        </Text>
      </View>
    </View>
  );
}

function ProfileScreen({
  language,
  onReview,
  onSignOut,
  onTopics,
  progress,
  t,
  user,
  weakPhrasesCount
}: {
  language: Language;
  onReview: () => void;
  onSignOut: () => void;
  onTopics: () => void;
  progress: Record<string, TopicProgress>;
  t: (key: CopyKey) => string;
  user: UserProfile;
  weakPhrasesCount: number;
}) {
  const progressItems = Object.values(progress);
  const attempts = progressItems.reduce((sum, item) => sum + item.testAttempts, 0);
  const completedTopics = progressItems.filter((item) => item.testAttempts > 0).length;
  const bestScore = progressItems.reduce((best, item) => Math.max(best, item.bestScore), 0);

  return (
    <View style={styles.resultsPanel}>
      <User color={palette.skyDark} size={36} />
      <Text style={styles.resultsTitle}>{user.name}</Text>
      <Text style={styles.resultsCaption}>{user.email}</Text>

      <View style={styles.resultGrid}>
        <View style={styles.resultCard}>
          <Text style={styles.resultValue}>{completedTopics}</Text>
          <Text style={styles.resultLabel}>{t("completedTopics")}</Text>
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultValue}>{bestScore || "-"}</Text>
          <Text style={styles.resultLabel}>{t("bestScore")}</Text>
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultValue}>{weakPhrasesCount}</Text>
          <Text style={styles.resultLabel}>{t("weakPhrases")}</Text>
        </View>
      </View>

      <View style={styles.reviewList}>
        {progressItems.length === 0 ? (
          <Text style={styles.emptyStateText}>{t("noProgressYet")}</Text>
        ) : (
          progressItems.map((item) => (
            <View key={item.topicId} style={styles.reviewRow}>
              <BarChart3 color={palette.skyDark} size={20} />
              <View style={styles.reviewRowText}>
                <Text style={styles.reviewQuestion}>{item.topicTitle}</Text>
                <Text style={styles.reviewExplanation}>
                  {t("attempts")}: {item.testAttempts} · {t("lastScore")}: {item.lastScore} · {t("bestScore")}: {item.bestScore}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.actionRow}>
        <Pressable accessibilityRole="button" onPress={onTopics} style={styles.secondaryButton}>
          <ArrowLeft color={palette.skyDark} size={19} />
          <Text style={styles.secondaryButtonText}>{t("backToTopics")}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onReview} style={styles.primaryButton}>
          <Repeat2 color="#FFFFFF" size={19} />
          <Text style={styles.primaryButtonText}>{t("review")}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onSignOut} style={styles.secondaryButton}>
          <LogOut color={palette.skyDark} size={19} />
          <Text style={styles.secondaryButtonText}>{t("signOut")}</Text>
        </Pressable>
      </View>
      <Text style={styles.voiceHint}>
        {language === "ru"
          ? "Прогресс сохраняется после завершения теста. Диалоговые ответы не начисляют баллы."
          : "Progress is saved after finishing a test. Dialogue answers do not add scores."}
      </Text>
    </View>
  );
}

function ReviewScreen({
  onMarkMastered,
  onTopics,
  phrases,
  t,
  user
}: {
  onMarkMastered: (phrase: WeakPhrase) => void;
  onTopics: () => void;
  phrases: WeakPhrase[];
  t: (key: CopyKey) => string;
  user: UserProfile;
}) {
  return (
    <View style={styles.resultsPanel}>
      <Brain color={palette.green} size={38} />
      <Text style={styles.resultsTitle}>{t("weakPhraseReview")}</Text>
      <Text style={styles.resultsCaption}>
        {user.name} · {t("weakPhrases")}: {phrases.length}
      </Text>

      <View style={styles.reviewList}>
        {phrases.length === 0 ? (
          <Text style={styles.emptyStateText}>{t("noWeakPhrases")}</Text>
        ) : (
          phrases.map((phrase) => (
            <View key={`${phrase.topicId}-${phrase.phrase}`} style={styles.phraseReviewCard}>
              <View style={styles.dialogueBlockTop}>
                <Text style={styles.phraseText}>{phrase.phrase}</Text>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressBadgeText}>x{phrase.timesMissed}</Text>
                </View>
              </View>
              <Text style={styles.teacherNoteText}>{phrase.reason}</Text>
              <Text style={styles.voiceHint}>{phrase.topicTitle}</Text>
              <Pressable accessibilityRole="button" onPress={() => onMarkMastered(phrase)} style={styles.secondaryButton}>
                <CheckCircle2 color={palette.green} size={18} />
                <Text style={styles.secondaryButtonText}>{t("markMastered")}</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      <Pressable accessibilityRole="button" onPress={onTopics} style={styles.primaryButton}>
        <ArrowLeft color="#FFFFFF" size={19} />
        <Text style={styles.primaryButtonText}>{t("backToTopics")}</Text>
      </Pressable>
    </View>
  );
}

function Header({
  language,
  onBack,
  onToggleLanguage,
  screen,
  t
}: {
  language: Language;
  onBack: () => void;
  onToggleLanguage: () => void;
  screen: Screen;
  t: (key: CopyKey) => string;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.logoBlock}>
        {screen !== "dashboard" && screen !== "auth" && (
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <ArrowLeft color={palette.ink} size={20} />
          </Pressable>
        )}
        <View style={styles.logoMark}>
          <Image resizeMode="cover" source={scholarCat} style={styles.logoImage} />
        </View>
        <View>
          <Text style={styles.appName}>{t("appName")}</Text>
          <Text style={styles.appCaption}>{t("appCaption")}</Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        <View style={styles.screenBadge}>
          <Text style={styles.screenBadgeText}>
            {screen === "topics"
              ? t("topics")
              : screen === "dashboard"
                ? t("dashboard")
                : screen === "course"
                  ? t("courseMap")
                  : screen === "dictionary"
                    ? t("dictionary")
                    : screen === "homework"
                      ? t("homework")
                      : screen === "trainer"
                        ? t("trainer")
                        : screen === "speaking"
                          ? t("speakingRoom")
                          : screen === "lesson"
                            ? t("lesson")
                            : screen === "test"
                              ? t("test")
                              : screen === "auth"
                                ? t("auth")
                                : screen === "profile"
                                  ? t("profile")
                                  : screen === "review"
                                    ? t("review")
                                    : t("results")}
          </Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onToggleLanguage} style={styles.languageButton}>
          <Languages color={palette.skyDark} size={18} />
          <Text style={styles.languageText}>{language.toUpperCase()}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TopicsScreen({
  currentUser,
  filteredTopics,
  isWide,
  language,
  onOpenProfile,
  onOpenReview,
  onSearch,
  onSelectTopic,
  progress,
  search,
  t,
  weakPhrasesCount
}: {
  currentUser?: UserProfile;
  filteredTopics: Topic[];
  isWide: boolean;
  language: Language;
  onOpenProfile: () => void;
  onOpenReview: () => void;
  onSearch: (value: string) => void;
  onSelectTopic: (topic: Topic) => void;
  progress: Record<string, TopicProgress>;
  search: string;
  t: (key: CopyKey) => string;
  weakPhrasesCount: number;
}) {
  const completedTopics = Object.values(progress).filter((item) => item.testAttempts > 0).length;
  const bestScore = Object.values(progress).reduce((best, item) => Math.max(best, item.bestScore), 0);

  return (
    <View style={styles.screenGap}>
      <LinearGradient colors={["#EAF8FF", "#FFFFFF"]} style={styles.heroPanel}>
        <View style={styles.heroMetaRow}>
          <MetricPill icon={<BookOpen color={palette.skyDark} size={17} />} text={t("topicCount")} />
          <MetricPill icon={<MessageCircle color={palette.skyDark} size={17} />} text={t("exchangeCount")} />
          <MetricPill icon={<ListChecks color={palette.skyDark} size={17} />} text={t("testCount")} />
        </View>
        <Text style={styles.heroTitle}>{t("heroTitle")}</Text>
        <Text style={styles.heroCopy}>{t("heroText")}</Text>
        <View style={styles.catHeroPanel}>
          <Image resizeMode="cover" source={scholarCat} style={styles.catHeroImage} />
          <View style={styles.catHeroTextBlock}>
            <Text style={styles.catHeroTitle}>{t("catTeacher")}</Text>
            <Text style={styles.catHeroText}>{t("catTeacherIntro")}</Text>
          </View>
        </View>
        <View style={styles.profileQuickPanel}>
          <View style={styles.profileQuickText}>
            <Text style={styles.profileQuickTitle}>
              {currentUser ? `${t("hello")}, ${currentUser.name}` : t("localProfile")}
            </Text>
            <Text style={styles.profileQuickMeta}>
              {t("completedTopics")}: {completedTopics} · {t("bestScore")}: {bestScore || "-"} · {t("weakPhrases")}: {weakPhrasesCount}
            </Text>
          </View>
          <View style={styles.profileQuickActions}>
            <Pressable accessibilityRole="button" onPress={onOpenProfile} style={styles.secondaryButton}>
              <User color={palette.skyDark} size={18} />
              <Text style={styles.secondaryButtonText}>{t("profile")}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onOpenReview} style={styles.primaryButton}>
              <Repeat2 color="#FFFFFF" size={18} />
              <Text style={styles.primaryButtonText}>{t("review")}</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchBox}>
        <Search color={palette.muted} size={19} />
        <TextInput
          onChangeText={onSearch}
          placeholder={t("searchPlaceholder")}
          placeholderTextColor={palette.muted}
          style={styles.searchInput}
          value={search}
        />
      </View>

      <View style={[styles.topicGrid, isWide && styles.topicGridWide]}>
        {filteredTopics.map((topic, index) => (
          <TopicCard
            index={index}
            key={topic.id}
            language={language}
            topic={topic}
            onPress={() => onSelectTopic(topic)}
          />
        ))}
      </View>

      <View style={styles.noStatsPanel}>
        <Trophy color={palette.orange} size={20} />
        <Text style={styles.noStatsText}>{t("noStats")}</Text>
      </View>
    </View>
  );
}

function LessonScreen({
  answerDraft,
  dialogueAnswer,
  dialogueLength,
  exchange,
  exchangeIndex,
  isWide,
  language,
  onBack,
  onDraftChange,
  onNext,
  onSaveDialogueAnswer,
  onSpeak,
  onStartTest,
  t,
  topic
}: {
  answerDraft: string;
  dialogueAnswer?: DialogueAnswer;
  dialogueLength: number;
  exchange: DialogueExchange;
  exchangeIndex: number;
  isWide: boolean;
  language: Language;
  onBack: () => void;
  onDraftChange: (text: string) => void;
  onNext: () => void;
  onSaveDialogueAnswer: (answer: DialogueAnswer) => void;
  onSpeak: (text: string) => void;
  onStartTest: () => void;
  t: (key: CopyKey) => string;
  topic: Topic;
}) {
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "recording" | "transcribing">("idle");
  const [voiceError, setVoiceError] = useState("");
  const [openPanels, setOpenPanels] = useState<Record<LessonPanelKey, boolean>>({
    answer: true,
    examples: false,
    phrases: false,
    question: true,
    tip: false
  });
  const complete = exchangeIndex === dialogueLength - 1;
  const progress = ((exchangeIndex + 1) / dialogueLength) * 100;
  const isRecording = recorderState.isRecording || voiceStatus === "recording";
  const canSaveAnswer = answerDraft.trim().length > 0;

  useEffect(() => {
    setOpenPanels({
      answer: true,
      examples: false,
      phrases: false,
      question: true,
      tip: false
    });
  }, [exchange.number]);

  const togglePanel = (panel: LessonPanelKey) => {
    setOpenPanels((current) => ({
      ...current,
      [panel]: !current[panel]
    }));
  };

  const buildDialogueAnswer = (
    text: string,
    source: DialogueAnswer["source"],
    audioUri?: string,
    sttSource?: DialogueAnswer["sttSource"]
  ): DialogueAnswer => ({
    audioUri,
    feedback: analyzeDialogueAnswer({
      exchange,
      text,
      topic
    }),
    source,
    sttSource,
    text
  });

  const saveTypedAnswer = () => {
    const text = answerDraft.trim();

    if (!text) {
      return;
    }

    onSaveDialogueAnswer(buildDialogueAnswer(text, "typed"));
  };

  const startVoiceRecording = async () => {
    setVoiceError("");
    const permission = await requestRecordingPermissionsAsync();

    if (!permission.granted) {
      setVoiceError(t("microphoneDenied"));
      return;
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true
    });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setVoiceStatus("recording");
  };

  const stopVoiceRecording = async () => {
    setVoiceError("");
    setVoiceStatus("transcribing");

    try {
      await recorder.stop();
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true
      });

      const transcription = await transcribeDialogueAnswer({
        audioUri: recorder.uri,
        exchange
      });

      onDraftChange(transcription.text);
      onSaveDialogueAnswer(
        buildDialogueAnswer(
          transcription.text,
          "voice",
          recorder.uri ?? undefined,
          transcription.source
        )
      );
    } catch {
      setVoiceError(t("voiceError"));
    } finally {
      setVoiceStatus("idle");
    }
  };

  const handleVoicePress = () => {
    if (isRecording) {
      void stopVoiceRecording();
      return;
    }

    void startVoiceRecording();
  };

  return (
    <View style={[styles.screenGrid, isWide && styles.screenGridWide]}>
      <View style={styles.primaryColumn}>
        <View style={styles.lessonPanel}>
          <View style={styles.lessonTop}>
            <View>
              <Text style={styles.kicker}>{topic.category[language]}</Text>
              <Text style={styles.lessonTitle}>{topic.title[language]}</Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressBadgeText}>
                {exchange.number}/{dialogueLength}
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.topicDescription}>{topic.description[language]}</Text>

          <View style={styles.catLessonPanel}>
            <Image resizeMode="cover" source={scholarCat} style={styles.catLessonImage} />
            <View style={styles.catLessonTextBlock}>
              <Text style={styles.catHeroTitle}>{t("catTeacher")}</Text>
              <Text style={styles.catHeroText}>{t("catLessonHint")}</Text>
            </View>
          </View>

          <LessonQuickMenu openPanels={openPanels} t={t} onToggle={togglePanel} />

          <CollapsibleSection
            open={openPanels.question}
            summary={exchange.questionTranslation[language]}
            title={t("questionSection")}
            t={t}
            onToggle={() => togglePanel("question")}
          >
            <DialogueBlock
              label={t("question")}
              text={exchange.question}
              translationLabel={t("translation")}
              translation={exchange.questionTranslation[language]}
              teacherNote={exchange.teacherNote[language]}
              tone="question"
              onSpeak={() => onSpeak(exchange.question)}
            />
          </CollapsibleSection>

          <CollapsibleSection
            open={openPanels.answer}
            summary={dialogueAnswer ? dialogueAnswer.text : t("typeYourAnswer")}
            title={t("answerSection")}
            t={t}
            onToggle={() => togglePanel("answer")}
          >
            <View style={styles.answerComposer}>
              <View style={styles.answerComposerTop}>
                <Text style={styles.dialogueLabel}>{t("myAnswer")}</Text>
                <Pressable
                  accessibilityRole="button"
                  disabled={voiceStatus === "transcribing"}
                  onPress={handleVoicePress}
                  style={[
                    styles.voiceButton,
                    isRecording && styles.voiceButtonRecording,
                    voiceStatus === "transcribing" && styles.disabledButton
                  ]}
                >
                  <Mic color="#FFFFFF" size={18} />
                  <Text style={styles.voiceButtonText}>
                    {voiceStatus === "transcribing"
                      ? t("transcribing")
                      : isRecording
                        ? t("stopRecording")
                        : t("recordDialogueAnswer")}
                  </Text>
                </Pressable>
              </View>

              <TextInput
                multiline
                onChangeText={onDraftChange}
                placeholder={t("typeYourAnswer")}
                placeholderTextColor={palette.muted}
                style={styles.answerInput}
                textAlignVertical="top"
                value={answerDraft}
              />

              <View style={styles.answerComposerTop}>
                <Pressable
                  accessibilityRole="button"
                  disabled={!canSaveAnswer}
                  onPress={saveTypedAnswer}
                  style={[styles.primaryButton, !canSaveAnswer && styles.disabledButton]}
                >
                  <CheckCircle2 color="#FFFFFF" size={19} />
                  <Text style={styles.primaryButtonText}>{t("saveAnswer")}</Text>
                </Pressable>
                {isRecording && <Text style={styles.voiceStatusText}>{t("recording")}</Text>}
              </View>

              {dialogueAnswer && (
                <View style={styles.feedbackPanel}>
                  <Text style={styles.transcriptLabel}>
                    {dialogueAnswer.source === "voice" ? t("spokenAnswer") : t("savedAnswer")}
                  </Text>
                  <Text style={styles.transcriptText}>{dialogueAnswer.text}</Text>
                  <View style={styles.feedbackDivider} />
                  <Text style={styles.feedbackTitle}>{t("feedback")}</Text>
                  <Text style={styles.feedbackText}>{dialogueAnswer.feedback.strength[language]}</Text>
                  <Text style={styles.feedbackText}>{dialogueAnswer.feedback.suggestion[language]}</Text>
                  {dialogueAnswer.feedback.corrections.length > 0 && (
                    <View style={styles.explanationBox}>
                      <Text style={styles.translationLabel}>{t("spellingNotes")}</Text>
                      {dialogueAnswer.feedback.corrections.map((correction) => (
                        <Text key={correction.en} style={styles.feedbackText}>{correction[language]}</Text>
                      ))}
                    </View>
                  )}
                  <Text style={styles.voiceHint}>
                    {t("wordCount")}: {dialogueAnswer.feedback.wordCount}
                    {dialogueAnswer.feedback.vocabulary.length > 0
                      ? ` · ${t("usedVocabulary")}: ${dialogueAnswer.feedback.vocabulary.join(", ")}`
                      : ""}
                  </Text>
                  {dialogueAnswer.sttSource === "demo" && <Text style={styles.voiceHint}>{t("voiceDemo")}</Text>}
                </View>
              )}
              {voiceError ? <Text style={styles.voiceErrorText}>{voiceError}</Text> : null}
            </View>
          </CollapsibleSection>

          <CollapsibleSection
            open={openPanels.phrases}
            summary={exchange.phraseNotes.map((note) => note.phrase).join(" · ")}
            title={t("phrasesSection")}
            t={t}
            onToggle={() => togglePanel("phrases")}
          >
            <PhraseCoachPanel language={language} phraseNotes={exchange.phraseNotes} t={t} />
          </CollapsibleSection>

          <CollapsibleSection
            open={openPanels.examples}
            summary={t("threeCorrectAnswers")}
            title={t("examplesSection")}
            t={t}
            onToggle={() => togglePanel("examples")}
          >
            <AnswerVariantsPanel
              language={language}
              onSpeak={onSpeak}
              t={t}
              variants={exchange.answerVariants}
            />
          </CollapsibleSection>

          <CollapsibleSection
            open={openPanels.tip}
            summary={exchange.tip[language]}
            title={t("tipSection")}
            t={t}
            onToggle={() => togglePanel("tip")}
          >
            <View style={styles.tipBox}>
              <Mic color={palette.skyDark} size={18} />
              <Text style={styles.tipText}>{exchange.tip[language]}</Text>
            </View>
          </CollapsibleSection>

          <View style={styles.actionRow}>
            <Pressable accessibilityRole="button" onPress={onBack} style={styles.secondaryButton}>
              <ArrowLeft color={palette.skyDark} size={19} />
              <Text style={styles.secondaryButtonText}>{t("backToTopics")}</Text>
            </Pressable>
            {complete ? (
              <Pressable accessibilityRole="button" onPress={onStartTest} style={styles.primaryButton}>
                <ListChecks color="#FFFFFF" size={20} />
                <Text style={styles.primaryButtonText}>{t("startTest")}</Text>
              </Pressable>
            ) : (
              <Pressable accessibilityRole="button" onPress={onNext} style={styles.primaryButton}>
                <ChevronRight color="#FFFFFF" size={20} />
                <Text style={styles.primaryButtonText}>{t("nextExchange")}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
        <SideFact icon={<MessageCircle color={palette.skyDark} size={20} />} title={t("exchangeCount")} text={t("sideDialogueText")} />
        <SideFact icon={<ListChecks color={palette.skyDark} size={20} />} title={t("testCount")} text={t("sideTestText")} />
        <SideFact icon={<Trophy color={palette.skyDark} size={20} />} title={t("noStats")} text={t("sideStatsText")} />
      </View>
    </View>
  );
}

function TestScreen({
  answers,
  language,
  onBack,
  onChooseAnswer,
  onNext,
  onSaveVoiceAnswer,
  onSpeak,
  question,
  questionIndex,
  selectedAnswer,
  t,
  total,
  voiceAnswer
}: {
  answers: number[];
  language: Language;
  onBack: () => void;
  onChooseAnswer: (optionIndex: number) => void;
  onSaveVoiceAnswer: (index: number, voiceAnswer: VoiceAnswer) => void;
  onSpeak: (text: string) => void;
  onNext: () => void;
  question: TestQuestion;
  questionIndex: number;
  selectedAnswer?: number;
  t: (key: CopyKey) => string;
  total: number;
  voiceAnswer?: VoiceAnswer;
}) {
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "recording" | "transcribing">("idle");
  const [voiceError, setVoiceError] = useState("");
  const canContinue = typeof selectedAnswer === "number";
  const isRecording = recorderState.isRecording || voiceStatus === "recording";

  const startVoiceRecording = async () => {
    setVoiceError("");
    const permission = await requestRecordingPermissionsAsync();

    if (!permission.granted) {
      setVoiceError(t("microphoneDenied"));
      return;
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true
    });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setVoiceStatus("recording");
  };

  const stopVoiceRecording = async () => {
    setVoiceError("");
    setVoiceStatus("transcribing");

    try {
      await recorder.stop();
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true
      });

      const transcription = await transcribeVoiceAnswer({
        audioUri: recorder.uri,
        question
      });
      const match = matchTranscriptToOption(transcription.text, question.options);

      onSaveVoiceAnswer(questionIndex, {
        audioUri: recorder.uri ?? undefined,
        confidence: match.confidence,
        matchedOptionIndex: match.optionIndex,
        source: transcription.source,
        transcript: transcription.text
      });
      onChooseAnswer(match.optionIndex);
    } catch (error) {
      setVoiceError(t("voiceError"));
    } finally {
      setVoiceStatus("idle");
    }
  };

  const handleVoicePress = () => {
    if (isRecording) {
      void stopVoiceRecording();
      return;
    }

    void startVoiceRecording();
  };

  return (
    <View style={styles.testPanel}>
      <View style={styles.lessonTop}>
        <View>
          <Text style={styles.kicker}>{t("chooseAnswer")}</Text>
          <Text style={styles.lessonTitle}>
            {questionIndex + 1}/{total}
          </Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressBadgeText}>{t("test")}</Text>
        </View>
      </View>

      <Text style={styles.testPrompt}>{question.prompt[language]}</Text>

      <View style={styles.voiceTestPanel}>
        <View style={styles.voiceTestTop}>
          <Pressable
            accessibilityRole="button"
            onPress={() => onSpeak(question.prompt.en)}
            style={styles.secondaryButton}
          >
            <Volume2 color={palette.skyDark} size={19} />
            <Text style={styles.secondaryButtonText}>{t("listenTask")}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={voiceStatus === "transcribing"}
            onPress={handleVoicePress}
            style={[
              styles.voiceButton,
              isRecording && styles.voiceButtonRecording,
              voiceStatus === "transcribing" && styles.disabledButton
            ]}
          >
            <Mic color="#FFFFFF" size={19} />
            <Text style={styles.voiceButtonText}>
              {voiceStatus === "transcribing"
                ? t("transcribing")
                : isRecording
                  ? t("stopRecording")
                  : t("voiceAnswer")}
            </Text>
          </Pressable>
        </View>

        {isRecording && <Text style={styles.voiceStatusText}>{t("recording")}</Text>}
        {voiceAnswer && (
          <View style={styles.transcriptBox}>
            <Text style={styles.transcriptLabel}>
              {t("spokenAnswer")} · {t("voiceSelected")} {String.fromCharCode(65 + voiceAnswer.matchedOptionIndex)}
            </Text>
            <Text style={styles.transcriptText}>{voiceAnswer.transcript}</Text>
            {voiceAnswer.source === "demo" && <Text style={styles.voiceHint}>{t("voiceDemo")}</Text>}
          </View>
        )}
        {voiceError ? <Text style={styles.voiceErrorText}>{voiceError}</Text> : null}
      </View>

      <View style={styles.optionList}>
        {question.options.map((option, index) => {
          const selected = selectedAnswer === index;
          return (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => onChooseAnswer(index)}
              style={[styles.optionButton, selected && styles.optionButtonSelected]}
            >
              <View style={[styles.optionLetter, selected && styles.optionLetterSelected]}>
                <Text style={[styles.optionLetterText, selected && styles.optionLetterTextSelected]}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.actionRow}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.secondaryButton}>
          <ArrowLeft color={palette.skyDark} size={19} />
          <Text style={styles.secondaryButtonText}>{t("lesson")}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={!canContinue}
          onPress={onNext}
          style={[styles.primaryButton, !canContinue && styles.disabledButton]}
        >
          <CheckCircle2 color="#FFFFFF" size={20} />
          <Text style={styles.primaryButtonText}>
            {questionIndex === total - 1 ? t("finishTest") : t("nextTask")}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.hiddenStatsNote}>
        {answers.length}/{total} · {t("noStats")}
      </Text>
    </View>
  );
}

function ResultsScreen({
  language,
  onRestart,
  onTopics,
  result,
  t,
  testQuestions,
  topic
}: {
  language: Language;
  onRestart: () => void;
  onTopics: () => void;
  result: TestResult;
  t: (key: CopyKey) => string;
  testQuestions: TestQuestion[];
  topic: Topic;
}) {
  return (
    <View style={styles.resultsPanel}>
      <Trophy color={palette.orange} size={38} />
      <Text style={styles.resultsTitle}>{topic.title[language]}</Text>
      <Text style={styles.resultsCaption}>{t("tenPoint")}</Text>

      <View style={styles.resultGrid}>
        <View style={styles.resultCard}>
          <Text style={styles.resultValue}>{result.score}</Text>
          <Text style={styles.resultLabel}>{t("score")}</Text>
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultValue}>
            {result.correct}/{testQuestions.length}
          </Text>
          <Text style={styles.resultLabel}>{t("correct")}</Text>
        </View>
      </View>

      <View style={styles.reviewList}>
        {testQuestions.map((question, index) => {
          const correct = result.answers[index] === question.correctIndex;
          return (
            <View key={question.id} style={styles.reviewRow}>
              {correct ? <CheckCircle2 color={palette.green} size={20} /> : <XCircle color="#F43F5E" size={20} />}
              <View style={styles.reviewRowText}>
                <Text style={styles.reviewQuestion}>{index + 1}. {question.prompt[language]}</Text>
                <Text style={styles.reviewExplanation}>{question.explanation[language]}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.actionRow}>
        <Pressable accessibilityRole="button" onPress={onTopics} style={styles.secondaryButton}>
          <ArrowLeft color={palette.skyDark} size={19} />
          <Text style={styles.secondaryButtonText}>{t("backToTopics")}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onRestart} style={styles.primaryButton}>
          <RotateCcw color="#FFFFFF" size={20} />
          <Text style={styles.primaryButtonText}>{t("reset")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MetricPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.metricPill}>
      {icon}
      <Text style={styles.metricPillText}>{text}</Text>
    </View>
  );
}

function TopicCard({
  index,
  language,
  onPress,
  topic
}: {
  index: number;
  language: Language;
  onPress: () => void;
  topic: Topic;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.topicCard}>
      <View style={[styles.topicStripe, { backgroundColor: topic.color }]} />
      <View style={styles.topicCardTop}>
        <Text style={styles.topicNumber}>{String(index + 1).padStart(2, "0")}</Text>
        <View style={styles.topicCategory}>
          <Text style={styles.topicCategoryText}>{topic.category[language]}</Text>
        </View>
      </View>
      <Text style={styles.topicTitle}>{topic.title[language]}</Text>
      <Text style={styles.topicText}>{topic.description[language]}</Text>
      <View style={styles.topicFooter}>
        <Text style={styles.topicFooterText}>{language === "ru" ? "55 реплик · 15 заданий" : "55 turns · 15 tasks"}</Text>
        <ChevronRight color={palette.skyDark} size={18} />
      </View>
    </Pressable>
  );
}

function LessonQuickMenu({
  openPanels,
  onToggle,
  t
}: {
  openPanels: Record<LessonPanelKey, boolean>;
  onToggle: (panel: LessonPanelKey) => void;
  t: (key: CopyKey) => string;
}) {
  return (
    <View style={styles.lessonMenuPanel}>
      <Text style={styles.lessonMenuTitle}>{t("lessonMenu")}</Text>
      <View style={styles.lessonMenuGrid}>
        {lessonPanelButtons.map((item) => {
          const active = openPanels[item.key];
          return (
            <Pressable
              accessibilityRole="button"
              key={item.key}
              onPress={() => onToggle(item.key)}
              style={[styles.lessonMenuButton, active && styles.lessonMenuButtonActive]}
            >
              <Text style={[styles.lessonMenuButtonText, active && styles.lessonMenuButtonTextActive]}>
                {t(item.label)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function CollapsibleSection({
  children,
  open,
  onToggle,
  summary,
  t,
  title
}: {
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  summary?: string;
  t: (key: CopyKey) => string;
  title: string;
}) {
  return (
    <View style={styles.collapsiblePanel}>
      <Pressable accessibilityRole="button" onPress={onToggle} style={styles.collapsibleHeader}>
        <View style={styles.collapsibleTitleBlock}>
          <Text style={styles.collapsibleTitle}>{title}</Text>
          {!open && summary ? <Text numberOfLines={2} style={styles.collapsibleSummary}>{summary}</Text> : null}
        </View>
        <View style={styles.collapseBadge}>
          {open ? <ChevronUp color={palette.skyDark} size={18} /> : <ChevronDown color={palette.skyDark} size={18} />}
          <Text style={styles.collapseBadgeText}>{open ? t("collapse") : t("expand")}</Text>
        </View>
      </Pressable>
      {open ? <View style={styles.collapsibleBody}>{children}</View> : null}
    </View>
  );
}

function DialogueBlock({
  label,
  onSpeak,
  text,
  tone,
  teacherNote,
  translation,
  translationLabel
}: {
  label: string;
  onSpeak: () => void;
  teacherNote?: string;
  text: string;
  tone: "question" | "answer";
  translation?: string;
  translationLabel?: string;
}) {
  return (
    <View style={[styles.dialogueBlock, tone === "answer" && styles.answerBlock]}>
      <View style={styles.dialogueBlockTop}>
        <Text style={styles.dialogueLabel}>{label}</Text>
        <Pressable accessibilityRole="button" onPress={onSpeak} style={styles.listenButton}>
          <Volume2 color={palette.skyDark} size={17} />
        </Pressable>
      </View>
      <Text style={styles.dialogueText}>{text}</Text>
      {translation ? (
        <View style={styles.translationBox}>
          <Text style={styles.translationLabel}>{translationLabel}</Text>
          <Text style={styles.translationText}>{translation}</Text>
        </View>
      ) : null}
      {teacherNote ? <Text style={styles.teacherNoteText}>{teacherNote}</Text> : null}
    </View>
  );
}

function PhraseCoachPanel({
  language,
  phraseNotes,
  t
}: {
  language: Language;
  phraseNotes: PhraseNote[];
  t: (key: CopyKey) => string;
}) {
  return (
    <View style={styles.teacherPanel}>
      <Text style={styles.teacherPanelTitle}>{t("phraseCoach")}</Text>
      <View style={styles.phraseList}>
        {phraseNotes.map((note) => (
          <View key={`${note.phrase}-${note.example}`} style={styles.phraseCard}>
            <Text style={styles.phraseText}>{note.phrase}</Text>
            <Text style={styles.translationText}>{note.translation[language]}</Text>
            <Text style={styles.teacherNoteText}>{note.explanation[language]}</Text>
            <Text style={styles.voiceHint}>{note.example}</Text>
            <Text style={styles.teacherNoteText}>{note.exampleTranslation[language]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function AnswerVariantsPanel({
  language,
  onSpeak,
  t,
  variants
}: {
  language: Language;
  onSpeak: (text: string) => void;
  t: (key: CopyKey) => string;
  variants: AnswerVariant[];
}) {
  const [openVariant, setOpenVariant] = useState(variants[0]?.label ?? "A");

  useEffect(() => {
    setOpenVariant(variants[0]?.label ?? "A");
  }, [variants]);

  return (
    <View style={styles.teacherPanel}>
      <Text style={styles.teacherPanelTitle}>{t("threeCorrectAnswers")}</Text>
      <View style={styles.variantList}>
        {variants.map((variant) => (
          <View key={variant.label} style={styles.variantCard}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpenVariant(openVariant === variant.label ? "" : variant.label)}
              style={styles.variantHeader}
            >
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>{variant.label}</Text>
              </View>
              <Text numberOfLines={2} style={styles.variantHeaderText}>{variant.text}</Text>
              {openVariant === variant.label ? (
                <ChevronUp color={palette.skyDark} size={18} />
              ) : (
                <ChevronDown color={palette.skyDark} size={18} />
              )}
            </Pressable>
            {openVariant === variant.label ? (
              <View style={styles.variantBody}>
              <Pressable accessibilityRole="button" onPress={() => onSpeak(variant.text)} style={styles.listenButton}>
                <Volume2 color={palette.skyDark} size={17} />
              </Pressable>
                <Text style={styles.dialogueText}>{variant.text}</Text>
                <View style={styles.translationBox}>
                  <Text style={styles.translationLabel}>{t("answerTranslation")}</Text>
                  <Text style={styles.translationText}>{variant.translation[language]}</Text>
                </View>
                <View style={styles.explanationBox}>
                  <Text style={styles.translationLabel}>{t("teacherExplanation")}</Text>
                  <Text style={styles.feedbackText}>{variant.explanation[language]}</Text>
                </View>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

function SideFact({ icon, text, title }: { icon: React.ReactNode; text: string; title: string }) {
  return (
    <View style={styles.sideFact}>
      <View style={styles.sideFactTop}>
        {icon}
        <Text style={styles.sideFactTitle}>{title}</Text>
      </View>
      <Text style={styles.sideFactText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.page
  },
  appShell: {
    alignSelf: "center",
    backgroundColor: palette.page,
    flex: 1,
    maxWidth: 1180,
    width: "100%"
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 18,
    paddingTop: 18
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 18
  },
  logoBlock: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  backButton: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  logoMark: {
    alignItems: "center",
    backgroundColor: palette.cream,
    borderRadius: 8,
    borderColor: "#F2D99B",
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    overflow: "hidden",
    width: 42
  },
  logoImage: {
    height: 42,
    width: 42
  },
  appName: {
    color: palette.ink,
    fontSize: 19,
    fontWeight: "900"
  },
  appCaption: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 1
  },
  headerRight: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginLeft: "auto"
  },
  screenBadge: {
    alignItems: "center",
    backgroundColor: palette.ink,
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 13
  },
  screenBadgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900"
  },
  languageButton: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  languageText: {
    color: palette.skyDark,
    fontSize: 13,
    fontWeight: "900"
  },
  screenGap: {
    gap: 16
  },
  dashboardHeroLayout: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    justifyContent: "space-between"
  },
  dashboardHeroText: {
    flex: 1,
    minWidth: 260
  },
  dashboardCatImage: {
    borderColor: "#F2D99B",
    borderRadius: 8,
    borderWidth: 1,
    height: 150,
    width: 150
  },
  learningPanel: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    ...shadow
  },
  panelHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between"
  },
  panelTitle: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28
  },
  panelText: {
    color: palette.muted,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22
  },
  sectionShortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  sectionShortcut: {
    backgroundColor: "#F7FBFE",
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    gap: 8,
    minHeight: 154,
    minWidth: 230,
    padding: 14,
    width: "23%"
  },
  sectionShortcutTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionShortcutTitle: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 21
  },
  sectionShortcutText: {
    color: palette.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  },
  sectionShortcutAction: {
    color: palette.skyDark,
    fontSize: 13,
    fontWeight: "900"
  },
  heroPanel: {
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    padding: 20,
    ...shadow
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18
  },
  metricPill: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  metricPillText: {
    color: palette.skyDark,
    fontSize: 12,
    fontWeight: "900"
  },
  heroTitle: {
    color: palette.ink,
    fontSize: 33,
    fontWeight: "900",
    lineHeight: 38,
    maxWidth: 720
  },
  heroCopy: {
    color: palette.muted,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 760
  },
  catHeroPanel: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    borderColor: "#F2D99B",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 18,
    padding: 12
  },
  catHeroImage: {
    borderRadius: 8,
    height: 86,
    width: 86
  },
  catHeroTextBlock: {
    flex: 1,
    minWidth: 220
  },
  catHeroTitle: {
    color: palette.navy,
    fontSize: 16,
    fontWeight: "900"
  },
  catHeroText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 4
  },
  profileQuickPanel: {
    alignItems: "center",
    backgroundColor: palette.cream,
    borderColor: "#F2D99B",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 14,
    padding: 12
  },
  profileQuickText: {
    flex: 1,
    minWidth: 220
  },
  profileQuickTitle: {
    color: palette.navy,
    fontSize: 16,
    fontWeight: "900"
  },
  profileQuickMeta: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
    marginTop: 3
  },
  profileQuickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    minHeight: 48,
    paddingHorizontal: 14
  },
  searchInput: {
    color: palette.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    minWidth: 0
  },
  topicGrid: {
    gap: 12
  },
  topicGridWide: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  topicCard: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    gap: 10,
    minWidth: 250,
    overflow: "hidden",
    padding: 16,
    width: "31%",
    ...shadow
  },
  topicStripe: {
    height: 5,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0
  },
  topicCardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2
  },
  topicNumber: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "900"
  },
  topicCategory: {
    backgroundColor: palette.softBlue,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  topicCategoryDone: {
    backgroundColor: "#EAFBF5"
  },
  topicCategoryText: {
    color: palette.skyDark,
    fontSize: 12,
    fontWeight: "900"
  },
  topicTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23
  },
  topicText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20
  },
  topicFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2
  },
  topicFooterText: {
    color: palette.skyDark,
    fontSize: 13,
    fontWeight: "900"
  },
  noStatsPanel: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    padding: 14
  },
  noStatsText: {
    color: palette.muted,
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20
  },
  dictionaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  dictionaryCard: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    gap: 8,
    minWidth: 230,
    padding: 14,
    width: "31%"
  },
  dictionaryWord: {
    color: palette.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23
  },
  homeworkGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  homeworkCard: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    gap: 10,
    minWidth: 250,
    padding: 16,
    width: "31%",
    ...shadow
  },
  trainerOptionCorrect: {
    backgroundColor: "#EAFBF5",
    borderColor: "#8BE0BE"
  },
  trainerOptionWrong: {
    backgroundColor: "#FFF1F3",
    borderColor: "#FDA4AF"
  },
  screenGrid: {
    gap: 18
  },
  screenGridWide: {
    alignItems: "flex-start",
    flexDirection: "row"
  },
  primaryColumn: {
    flex: 1,
    gap: 18,
    minWidth: 0
  },
  sideColumn: {
    gap: 12,
    width: "100%"
  },
  sideColumnWide: {
    flexShrink: 0,
    width: 330
  },
  lessonPanel: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 18,
    ...shadow
  },
  lessonTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between"
  },
  kicker: {
    color: palette.skyDark,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  lessonTitle: {
    color: palette.ink,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 33,
    marginTop: 3
  },
  progressBadge: {
    backgroundColor: palette.softBlue,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 8
  },
  progressBadgeText: {
    color: palette.skyDark,
    fontSize: 13,
    fontWeight: "900"
  },
  progressTrack: {
    backgroundColor: "#E6F3FA",
    borderRadius: 8,
    height: 9,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: palette.green,
    borderRadius: 8,
    height: 9
  },
  topicDescription: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22
  },
  catLessonPanel: {
    alignItems: "center",
    backgroundColor: palette.cream,
    borderColor: "#F2D99B",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 12
  },
  catLessonImage: {
    borderRadius: 8,
    height: 64,
    width: 64
  },
  catLessonTextBlock: {
    flex: 1,
    minWidth: 0
  },
  lessonMenuPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 12
  },
  lessonMenuTitle: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  lessonMenuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  lessonMenuButton: {
    backgroundColor: "#F7FBFE",
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    minHeight: 40,
    minWidth: 120,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  lessonMenuButtonActive: {
    backgroundColor: palette.softBlue,
    borderColor: palette.sky
  },
  lessonMenuButtonText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center"
  },
  lessonMenuButtonTextActive: {
    color: palette.skyDark
  },
  collapsiblePanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden"
  },
  collapsibleHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    padding: 12
  },
  collapsibleTitleBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0
  },
  collapsibleTitle: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  collapsibleSummary: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18
  },
  collapseBadge: {
    alignItems: "center",
    backgroundColor: palette.softBlue,
    borderRadius: 8,
    flexDirection: "row",
    gap: 5,
    minHeight: 34,
    paddingHorizontal: 9
  },
  collapseBadgeText: {
    color: palette.skyDark,
    fontSize: 12,
    fontWeight: "900"
  },
  collapsibleBody: {
    borderTopColor: "#E6F3FA",
    borderTopWidth: 1,
    gap: 10,
    padding: 12
  },
  dialogueBlock: {
    backgroundColor: "#F0F7FB",
    borderRadius: 8,
    gap: 8,
    padding: 14
  },
  answerBlock: {
    backgroundColor: "#EAFBF5"
  },
  dialogueBlockTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dialogueLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  listenButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  dialogueText: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 25
  },
  answerComposer: {
    backgroundColor: "#F7FBFE",
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 11,
    padding: 12
  },
  answerComposerTop: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between"
  },
  answerInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    color: palette.ink,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
    minHeight: 108,
    padding: 12
  },
  feedbackPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    gap: 7,
    padding: 12
  },
  feedbackDivider: {
    backgroundColor: palette.line,
    height: 1,
    marginVertical: 2
  },
  feedbackTitle: {
    color: palette.ink,
    fontSize: 15,
    fontWeight: "900"
  },
  feedbackText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  teacherPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    gap: 11,
    padding: 12
  },
  teacherPanelTitle: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: "900"
  },
  phraseList: {
    gap: 9
  },
  phraseCard: {
    backgroundColor: "#F7FBFE",
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
    padding: 11
  },
  phraseText: {
    color: palette.skyDark,
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21
  },
  translationBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E6F3FA",
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
    padding: 10
  },
  translationLabel: {
    color: palette.skyDark,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  translationText: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  explanationBox: {
    backgroundColor: "#F0F7FB",
    borderRadius: 8,
    gap: 5,
    padding: 10
  },
  teacherNoteText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19
  },
  variantList: {
    gap: 10
  },
  variantCard: {
    backgroundColor: "#EAFBF5",
    borderColor: "#BDEEDC",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden"
  },
  variantHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    padding: 11
  },
  variantHeaderText: {
    color: palette.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20
  },
  variantBody: {
    borderTopColor: "#BDEEDC",
    borderTopWidth: 1,
    gap: 9,
    padding: 12
  },
  tipBox: {
    backgroundColor: palette.softBlue,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    padding: 12
  },
  tipText: {
    color: palette.ink,
    flex: 1,
    fontSize: 14,
    lineHeight: 20
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between"
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: palette.sky,
    borderRadius: 8,
    flexShrink: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900"
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    flexShrink: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16
  },
  secondaryButtonText: {
    color: palette.skyDark,
    fontSize: 15,
    fontWeight: "900"
  },
  disabledButton: {
    opacity: 0.45
  },
  sideFact: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 15,
    ...shadow
  },
  sideFactTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  sideFactTitle: {
    color: palette.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: "900"
  },
  sideFactText: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20
  },
  testPanel: {
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 18,
    ...shadow
  },
  testPrompt: {
    color: palette.ink,
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 28
  },
  authPanel: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 18,
    ...shadow
  },
  authImage: {
    borderRadius: 8,
    height: 128,
    width: 128
  },
  authContent: {
    alignItems: "stretch",
    gap: 12,
    maxWidth: 520,
    width: "100%"
  },
  authInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    color: palette.ink,
    fontSize: 15,
    fontWeight: "800",
    minHeight: 48,
    paddingHorizontal: 13
  },
  voiceTestPanel: {
    backgroundColor: palette.softBlue,
    borderRadius: 8,
    gap: 10,
    padding: 12
  },
  voiceTestTop: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between"
  },
  voiceButton: {
    alignItems: "center",
    backgroundColor: palette.sky,
    borderRadius: 8,
    flexShrink: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    maxWidth: "100%",
    minHeight: 48,
    paddingHorizontal: 16
  },
  voiceButtonRecording: {
    backgroundColor: "#F43F5E"
  },
  voiceButtonText: {
    color: "#FFFFFF",
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center"
  },
  voiceStatusText: {
    color: palette.skyDark,
    fontSize: 13,
    fontWeight: "900"
  },
  transcriptBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9F2FF",
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 12
  },
  transcriptLabel: {
    color: palette.skyDark,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  transcriptText: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  },
  voiceHint: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17
  },
  voiceErrorText: {
    color: "#F43F5E",
    fontSize: 13,
    fontWeight: "900"
  },
  optionList: {
    gap: 10
  },
  optionButton: {
    alignItems: "center",
    backgroundColor: "#F7FBFE",
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 12
  },
  optionButtonSelected: {
    backgroundColor: palette.softBlue,
    borderColor: palette.sky
  },
  optionLetter: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34
  },
  optionLetterSelected: {
    backgroundColor: palette.sky,
    borderColor: palette.sky
  },
  optionLetterText: {
    color: palette.ink,
    fontSize: 13,
    fontWeight: "900"
  },
  optionLetterTextSelected: {
    color: "#FFFFFF"
  },
  optionText: {
    color: palette.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 21
  },
  optionTextSelected: {
    color: palette.skyDark
  },
  hiddenStatsNote: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center"
  },
  resultsPanel: {
    alignItems: "center",
    backgroundColor: palette.surface,
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 18,
    ...shadow
  },
  resultsTitle: {
    color: palette.ink,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    textAlign: "center"
  },
  resultsCaption: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center"
  },
  resultGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    width: "100%"
  },
  resultCard: {
    alignItems: "center",
    backgroundColor: palette.softBlue,
    borderRadius: 8,
    flexGrow: 1,
    minWidth: 190,
    padding: 16
  },
  resultValue: {
    color: palette.skyDark,
    fontSize: 38,
    fontWeight: "900"
  },
  resultLabel: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 3
  },
  reviewList: {
    gap: 10,
    width: "100%"
  },
  reviewRow: {
    alignItems: "flex-start",
    backgroundColor: "#F7FBFE",
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    padding: 12
  },
  phraseReviewCard: {
    backgroundColor: "#F7FBFE",
    borderColor: palette.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 9,
    padding: 12
  },
  emptyStateText: {
    color: palette.muted,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 22,
    padding: 12,
    textAlign: "center"
  },
  reviewRowText: {
    flex: 1
  },
  reviewQuestion: {
    color: palette.ink,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20
  },
  reviewExplanation: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3
  }
});
