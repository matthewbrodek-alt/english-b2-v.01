import { DialogueExchange, Language, Topic } from "./content";

export type DialogueAnswerFeedback = {
  corrections: Record<Language, string>[];
  strength: Record<Language, string>;
  suggestion: Record<Language, string>;
  vocabulary: string[];
  wordCount: number;
};

export type DialogueAnswer = {
  audioUri?: string;
  feedback: DialogueAnswerFeedback;
  source: "typed" | "voice";
  sttSource?: "backend" | "demo";
  text: string;
};

type AnalyzeInput = {
  exchange: DialogueExchange;
  text: string;
  topic: Topic;
};

export function analyzeDialogueAnswer({ exchange, text, topic }: AnalyzeInput): DialogueAnswerFeedback {
  const normalized = normalize(text);
  const wordCount = tokenize(text).length;
  const usedPhrases = findUsedPhrases(exchange, normalized);
  const usedVocabulary = topic.vocabulary.filter((item) => normalized.includes(normalize(item)));
  const asksFollowUp =
    text.includes("?") || ["what about", "how about", "do you mean", "could you", "would you"].some((marker) => normalized.includes(marker));
  const hasReason = ["because", "since", "so", "that's why", "the reason is"].some((marker) => normalized.includes(marker));
  const hasReaction = ["i see", "fair", "honestly", "that makes sense", "i get it", "i hear you"].some((marker) => normalized.includes(marker));
  const corrections = findCommonIssues(text);

  const strength = buildStrength({
    asksFollowUp,
    hasReaction,
    hasReason,
    usedPhrases,
    usedVocabulary,
    wordCount
  });
  const suggestion = buildSuggestion({
    asksFollowUp,
    hasReason,
    topic,
    usedPhrases,
    wordCount
  });

  return {
    corrections,
    strength,
    suggestion,
    vocabulary: usedPhrases.length > 0 ? usedPhrases : usedVocabulary,
    wordCount
  };
}

function buildStrength({
  asksFollowUp,
  hasReaction,
  hasReason,
  usedPhrases,
  usedVocabulary,
  wordCount
}: {
  asksFollowUp: boolean;
  hasReaction: boolean;
  hasReason: boolean;
  usedPhrases: string[];
  usedVocabulary: string[];
  wordCount: number;
}): Record<Language, string> {
  if (wordCount >= 25 && usedPhrases.length > 0 && asksFollowUp) {
    return {
      ru: "Хорошо: ты не просто ответил, а поддержал разговор. Есть целевая фраза, нормальная длина и вопрос назад.",
      en: "Good: you didn't just answer, you kept the conversation alive. Target phrase, solid length, and a question back."
    };
  }

  if (wordCount >= 16 && (hasReason || hasReaction)) {
    return {
      ru: "Уже звучит по-человечески: есть мысль и реакция, а не набор отдельных слов.",
      en: "This already sounds human: there is a point and a reaction, not just loose words."
    };
  }

  if (wordCount >= 8 || usedVocabulary.length > 0) {
    return {
      ru: "Нормальный старт. Мысль понятна, теперь можно добавить деталь и сделать реплику живее.",
      en: "Solid start. The idea is clear; now add one detail and make it a bit more alive."
    };
  }

  return {
    ru: "Ответ сохранен. Смело: даже короткая попытка лучше молчания. Теперь добавь одну причину или пример.",
    en: "Saved. Good: even a short attempt beats silence. Now add one reason or example."
  };
}

function buildSuggestion({
  asksFollowUp,
  hasReason,
  topic,
  usedPhrases,
  wordCount
}: {
  asksFollowUp: boolean;
  hasReason: boolean;
  topic: Topic;
  usedPhrases: string[];
  wordCount: number;
}): Record<Language, string> {
  if (wordCount < 12) {
    return {
      ru: "Следующий шаг: скажи еще 1-2 предложения. Формула простая: мнение -> причина -> короткий пример.",
      en: "Next step: add 1-2 sentences. Simple shape: point -> reason -> quick example."
    };
  }

  if (usedPhrases.length === 0) {
    return {
      ru: `Попробуй встроить одну фразу Alex: "${topic.phraseBank[0].en}". Не идеально, просто естественно.`,
      en: `Try to use one Alex phrase: "${topic.phraseBank[0].en}". Not perfectly, just naturally.`
    };
  }

  if (!hasReason) {
    return {
      ru: "Добавь короткое because/since/that's why. Сразу станет понятнее, почему ты так говоришь.",
      en: "Add a short because/since/that's why. It makes your point easier to follow."
    };
  }

  if (!asksFollowUp) {
    return {
      ru: "В конце задай вопрос назад. Так ты звучишь как собеседник, а не как человек, который сдал ответ.",
      en: "End with a question back. Then you sound like a conversation partner, not someone submitting an answer."
    };
  }

  return {
    ru: "Теперь произнеси ответ еще раз чуть медленнее и увереннее. Полировка идет после речи, не вместо нее.",
    en: "Now say it again a bit slower and more confidently. Polish after speaking, not instead of speaking."
  };
}

function findUsedPhrases(exchange: DialogueExchange, normalizedAnswer: string) {
  return exchange.phraseNotes
    .filter((note) => phraseMatches(note.phrase, normalizedAnswer))
    .map((note) => note.phrase);
}

function phraseMatches(phrase: string, normalizedAnswer: string) {
  const normalizedPhrase = normalize(phrase)
    .replace("verb ing", "")
    .replace("x", "")
    .replace("y", "")
    .trim();

  if (!normalizedPhrase) {
    return false;
  }

  if (normalizedAnswer.includes(normalizedPhrase)) {
    return true;
  }

  const phraseTokens = normalizedPhrase.split(" ").filter((token) => token.length > 2);
  if (phraseTokens.length === 0) {
    return false;
  }

  const matched = phraseTokens.filter((token) => normalizedAnswer.includes(token)).length;
  return matched / phraseTokens.length >= 0.65;
}

function findCommonIssues(text: string): Record<Language, string>[] {
  const issues: Record<Language, string>[] = [];
  const normalized = normalize(text);
  const trimmed = text.trim();

  if (/(^|\s)i(\s|[,.!?]|$)/.test(text)) {
    issues.push(shortCorrection("i", "I", "capital I", "заглавная I"));
  }

  if (normalized.includes("i am agree")) {
    issues.push(shortCorrection("I am agree", "I agree", "no am", "без am"));
  }

  if (normalized.includes("i very like")) {
    issues.push(shortCorrection("I very like it", "I really like it", "natural adverb", "естественное наречие"));
  }

  if (normalized.includes("people is")) {
    issues.push(shortCorrection("people is", "people are", "plural noun", "множественное число"));
  }

  if (/\b(he|she|it)\s+don'?t\b/.test(normalized)) {
    issues.push(shortCorrection("he/she/it don't", "he/she/it doesn't", "third person", "3-е лицо"));
  }

  if (normalized.includes("more better")) {
    issues.push(shortCorrection("more better", "better / much better", "better is comparative", "better уже сравнительное"));
  }

  if (normalized.includes("discuss about")) {
    issues.push(shortCorrection("discuss about it", "discuss it", "no about", "без about"));
  }

  if (normalized.includes("depend of")) {
    issues.push(shortCorrection("depend of", "depend on", "fixed phrase", "устойчивая связка"));
  }

  if (trimmed.length > 12 && !/[.!?]$/.test(trimmed)) {
    issues.push({
      ru: "no final punctuation -> add . or ? -> finished thought",
      en: "no final punctuation -> add . or ? -> finished thought"
    });
  }

  return issues.slice(0, 3);
}

function shortCorrection(original: string, improved: string, noteEn: string, noteRu: string): Record<Language, string> {
  return {
    ru: `${original} -> ${improved} -> ${noteRu}`,
    en: `${original} -> ${improved} -> ${noteEn}`
  };
}

function tokenize(value: string) {
  return normalize(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
