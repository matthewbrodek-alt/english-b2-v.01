import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, TestQuestion, Topic } from "./content";

const STORE_KEY = "english-cat-coach.learning-state.v1";

export type UserProfile = {
  createdAt: string;
  email: string;
  id: string;
  lastLoginAt: string;
  name: string;
};

export type MistakeRecord = {
  correctAnswer: string;
  createdAt: string;
  explanation: string;
  prompt: string;
  questionId: string;
  selectedAnswer: string;
};

export type WeakPhrase = {
  mastered: boolean;
  phrase: string;
  reason: string;
  reviewedAt?: string;
  timesMissed: number;
  topicId: string;
  topicTitle: string;
};

export type TopicProgress = {
  bestScore: number;
  completedDialogues: number;
  lastCompletedAt?: string;
  lastCorrect: number;
  lastScore: number;
  mistakes: MistakeRecord[];
  testAttempts: number;
  topicId: string;
  topicTitle: string;
  totalDialogues: number;
  weakPhrases: WeakPhrase[];
};

export type LearningState = {
  currentUserId?: string;
  progressByUser: Record<string, Record<string, TopicProgress>>;
  users: UserProfile[];
};

export type TestCompletionInput = {
  answers: number[];
  dialogueLength: number;
  language: Language;
  questions: TestQuestion[];
  score: number;
  topic: Topic;
};

const emptyState: LearningState = {
  progressByUser: {},
  users: []
};

export async function loadLearningState(): Promise<LearningState> {
  const raw = await AsyncStorage.getItem(STORE_KEY);

  if (!raw) {
    return emptyState;
  }

  try {
    return {
      ...emptyState,
      ...(JSON.parse(raw) as LearningState)
    };
  } catch {
    return emptyState;
  }
}

export async function saveLearningState(state: LearningState) {
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export async function signInLocalUser(name: string, email: string): Promise<LearningState> {
  const state = await loadLearningState();
  const normalizedEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();
  const existing = state.users.find((user) => user.email === normalizedEmail);
  const user: UserProfile = existing
    ? {
        ...existing,
        lastLoginAt: now,
        name: name.trim() || existing.name
      }
    : {
        createdAt: now,
        email: normalizedEmail,
        id: `user-${Date.now()}`,
        lastLoginAt: now,
        name: name.trim() || normalizedEmail.split("@")[0] || "Learner"
      };

  const users = existing ? state.users.map((item) => (item.id === user.id ? user : item)) : [...state.users, user];
  const nextState: LearningState = {
    ...state,
    currentUserId: user.id,
    progressByUser: {
      ...state.progressByUser,
      [user.id]: state.progressByUser[user.id] ?? {}
    },
    users
  };

  await saveLearningState(nextState);
  return nextState;
}

export async function signOutLocalUser(): Promise<LearningState> {
  const state = await loadLearningState();
  const nextState = {
    ...state,
    currentUserId: undefined
  };

  await saveLearningState(nextState);
  return nextState;
}

export async function saveTestCompletion(
  state: LearningState,
  user: UserProfile,
  input: TestCompletionInput
): Promise<LearningState> {
  const userProgress = state.progressByUser[user.id] ?? {};
  const previous = userProgress[input.topic.id];
  const mistakes = buildMistakes(input);
  const weakPhrases = mergeWeakPhrases(previous?.weakPhrases ?? [], buildWeakPhrases(input, mistakes));
  const nextProgress: TopicProgress = {
    bestScore: Math.max(previous?.bestScore ?? 0, input.score),
    completedDialogues: input.dialogueLength,
    lastCompletedAt: new Date().toISOString(),
    lastCorrect: input.questions.length - mistakes.length,
    lastScore: input.score,
    mistakes: [...mistakes, ...(previous?.mistakes ?? [])].slice(0, 60),
    testAttempts: (previous?.testAttempts ?? 0) + 1,
    topicId: input.topic.id,
    topicTitle: input.topic.title[input.language],
    totalDialogues: input.dialogueLength,
    weakPhrases
  };
  const nextState: LearningState = {
    ...state,
    progressByUser: {
      ...state.progressByUser,
      [user.id]: {
        ...userProgress,
        [input.topic.id]: nextProgress
      }
    }
  };

  await saveLearningState(nextState);
  return nextState;
}

export async function markWeakPhraseMastered(
  state: LearningState,
  user: UserProfile,
  phrase: string,
  topicId: string
): Promise<LearningState> {
  const userProgress = state.progressByUser[user.id] ?? {};
  const topicProgress = userProgress[topicId];

  if (!topicProgress) {
    return state;
  }

  const nextTopicProgress: TopicProgress = {
    ...topicProgress,
    weakPhrases: topicProgress.weakPhrases.map((item) =>
      item.phrase === phrase
        ? {
            ...item,
            mastered: true,
            reviewedAt: new Date().toISOString()
          }
        : item
    )
  };
  const nextState: LearningState = {
    ...state,
    progressByUser: {
      ...state.progressByUser,
      [user.id]: {
        ...userProgress,
        [topicId]: nextTopicProgress
      }
    }
  };

  await saveLearningState(nextState);
  return nextState;
}

export function getCurrentUser(state: LearningState) {
  return state.users.find((user) => user.id === state.currentUserId);
}

export function getUserProgress(state: LearningState, user?: UserProfile) {
  if (!user) {
    return {};
  }

  return state.progressByUser[user.id] ?? {};
}

export function getWeakPhrases(progress: Record<string, TopicProgress>) {
  return Object.values(progress)
    .flatMap((topic) => topic.weakPhrases)
    .filter((phrase) => !phrase.mastered)
    .sort((a, b) => b.timesMissed - a.timesMissed);
}

function buildMistakes(input: TestCompletionInput): MistakeRecord[] {
  return input.questions
    .map((question, index) => {
      const selectedIndex = input.answers[index];

      if (selectedIndex === question.correctIndex) {
        return null;
      }

      return {
        correctAnswer: question.options[question.correctIndex],
        createdAt: new Date().toISOString(),
        explanation: question.explanation.ru,
        prompt: question.prompt[input.language],
        questionId: question.id,
        selectedAnswer: typeof selectedIndex === "number" ? question.options[selectedIndex] : "No answer"
      };
    })
    .filter((item): item is MistakeRecord => Boolean(item));
}

function buildWeakPhrases(input: TestCompletionInput, mistakes: MistakeRecord[]): WeakPhrase[] {
  if (mistakes.length === 0) {
    return [];
  }

  return input.topic.vocabulary.slice(0, Math.min(mistakes.length + 2, input.topic.vocabulary.length)).map((phrase) => ({
    mastered: false,
    phrase,
    reason: `Вернись к фразе "${phrase}": она связана с ошибками в уроке "${input.topic.title.ru}" и поможет сказать мысль точнее.`,
    timesMissed: 1,
    topicId: input.topic.id,
    topicTitle: input.topic.title.ru
  }));
}

function mergeWeakPhrases(current: WeakPhrase[], next: WeakPhrase[]) {
  const map = new Map<string, WeakPhrase>();

  for (const phrase of current) {
    map.set(`${phrase.topicId}:${phrase.phrase}`, phrase);
  }

  for (const phrase of next) {
    const key = `${phrase.topicId}:${phrase.phrase}`;
    const existing = map.get(key);
    map.set(
      key,
      existing
        ? {
            ...existing,
            mastered: false,
            timesMissed: existing.timesMissed + 1
          }
        : phrase
    );
  }

  return Array.from(map.values()).slice(0, 80);
}
