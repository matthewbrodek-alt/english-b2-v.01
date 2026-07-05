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
  const vocabulary = topic.vocabulary.filter((item) => normalized.includes(normalize(item)));
  const hasReason = ["because", "since", "as a result", "therefore", "so"].some((marker) =>
    normalized.includes(marker)
  );
  const hasExample = ["for example", "for instance", "such as", "in my experience"].some((marker) =>
    normalized.includes(marker)
  );
  const asksFollowUp =
    text.includes("?") || ["what", "how", "why", "could you", "would you"].some((marker) => normalized.includes(marker));
  const promptOverlap = overlapScore(text, exchange.question);
  const corrections = findCommonIssues(text);

  const strength =
    wordCount >= 18 && vocabulary.length > 0 && (hasReason || hasExample)
      ? {
          ru: "Хороший B2+ ответ: есть развернутая мысль, тематическая лексика и связка причины или примера.",
          en: "Strong B2+ answer: it has a developed idea, topic vocabulary, and a reason or example."
        }
      : wordCount >= 10 || promptOverlap > 0.08
        ? {
            ru: "Ответ понятен и связан с вопросом. Его уже можно использовать как основу для устной практики.",
            en: "The answer is clear and connected to the question. It is a useful base for speaking practice."
          }
        : {
            ru: "Ответ сохранен, но пока звучит слишком коротко для уровня B2+.",
            en: "The answer is saved, but it is still too short for B2+ speaking practice."
          };

  let suggestion: Record<Language, string>;

  if (wordCount < 12) {
    suggestion = {
      ru: "Добавь 1-2 детали: позицию, причину и конкретный пример из ситуации.",
      en: "Add 1-2 details: your position, a reason, and a concrete example from the situation."
    };
  } else if (vocabulary.length === 0) {
    suggestion = {
      ru: `Добавь лексику темы, например: ${topic.vocabulary.slice(0, 3).join(", ")}.`,
      en: `Add topic vocabulary, for example: ${topic.vocabulary.slice(0, 3).join(", ")}.`
    };
  } else if (!hasReason) {
    suggestion = {
      ru: "Усиль ответ причинной связкой: because, since, therefore или as a result.",
      en: "Strengthen the answer with a reason connector: because, since, therefore, or as a result."
    };
  } else if (!hasExample) {
    suggestion = {
      ru: "Добавь пример через for example или in my experience, чтобы речь звучала естественнее.",
      en: "Add an example with for example or in my experience to make the speech sound more natural."
    };
  } else if (!asksFollowUp) {
    suggestion = {
      ru: "В конце можно задать уточняющий вопрос собеседнику, чтобы поддержать диалог.",
      en: "You can end with a follow-up question to keep the dialogue moving."
    };
  } else {
    suggestion = {
      ru: "Теперь произнеси ответ еще раз чуть медленнее и сравни с примером ниже.",
      en: "Now say the answer again a bit more slowly and compare it with the sample below."
    };
  }

  return {
    corrections,
    strength,
    suggestion,
    vocabulary,
    wordCount
  };
}

function findCommonIssues(text: string): Record<Language, string>[] {
  const issues: Record<Language, string>[] = [];
  const normalized = normalize(text);
  const trimmed = text.trim();

  if (/(^|\s)i(\s|[,.!?]|$)/.test(text)) {
    issues.push({
      ru: "Пиши местоимение I с заглавной буквы: I think, I would say, I agree.",
      en: "Capitalize the pronoun I: I think, I would say, I agree."
    });
  }

  if (normalized.includes("i am agree")) {
    issues.push({
      ru: "В английском говорят I agree, без am. Фраза I am agree звучит как ошибка.",
      en: "Say I agree, not I am agree."
    });
  }

  if (normalized.includes("people is")) {
    issues.push({
      ru: "People обычно требует are: people are worried, people are more likely to notice it.",
      en: "People usually takes are: people are worried, people are more likely to notice it."
    });
  }

  if (/\b(he|she|it)\s+don'?t\b/.test(normalized)) {
    issues.push({
      ru: "С he/she/it используй doesn't: he doesn't, she doesn't, it doesn't.",
      en: "With he/she/it, use doesn't: he doesn't, she doesn't, it doesn't."
    });
  }

  if (normalized.includes("more better")) {
    issues.push({
      ru: "Better уже означает «лучше», поэтому more better не нужно. Скажи better или much better.",
      en: "Better already means more good, so avoid more better. Say better or much better."
    });
  }

  if (trimmed.length > 12 && !/[.!?]$/.test(trimmed)) {
    issues.push({
      ru: "В конце ответа поставь точку или вопросительный знак: это помогает видеть границы мысли.",
      en: "Add a final full stop or question mark so the thought feels complete."
    });
  }

  return issues.slice(0, 3);
}

function overlapScore(source: string, target: string) {
  const sourceTokens = new Set(tokenize(source));
  const targetTokens = tokenize(target);

  if (targetTokens.length === 0) {
    return 0;
  }

  const overlap = targetTokens.filter((token) => sourceTokens.has(token)).length;
  return overlap / targetTokens.length;
}

function tokenize(value: string) {
  return normalize(value)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 2);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
