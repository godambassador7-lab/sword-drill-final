const EXAM_TOTAL_QUESTIONS = 125;
const EXAM_NOVEL_RATIO = 0.4;
const EXAM_PASS_PERCENT = 80;

const shuffleArray = (items) => {
  const arr = Array.isArray(items) ? [...items] : [];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const trimText = (value, max = 120) => {
  if (!value) return '';
  const clean = String(value).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}...`;
};

const uniqueByQuestion = (questions) => {
  const seen = new Set();
  const out = [];
  questions.forEach((q) => {
    const key = `${q.question}||${(q.options || []).join('||')}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(q);
    }
  });
  return out;
};

const getCorrectIndex = (question) => {
  if (typeof question.correct === 'number') return question.correct;
  if (typeof question.answer === 'string' && Array.isArray(question.options)) {
    const idx = question.options.indexOf(question.answer);
    if (idx >= 0) return idx;
  }
  return 0;
};

const toIndexedQuestion = (question, explanationPrefix) => {
  if (!question || !Array.isArray(question.options) || question.options.length < 2 || !question.question) {
    return null;
  }
  const options = [...question.options];
  const correct = getCorrectIndex(question);
  if (correct < 0 || correct >= options.length) return null;
  return {
    question: question.question,
    options,
    correct,
    explanation: question.explanation || `${explanationPrefix} ${options[correct]}`
  };
};

const reshuffleQuestionOptions = (question) => {
  if (!question || !Array.isArray(question.options) || question.options.length < 2) return question;
  const correctAnswer = question.options[question.correct];
  const options = shuffleArray(question.options);
  return {
    ...question,
    options,
    correct: options.indexOf(correctAnswer)
  };
};

const fillToSize = (pool, size) => {
  if (size <= 0) return [];
  if (!Array.isArray(pool) || pool.length === 0) return [];
  const out = [];
  while (out.length < size) {
    const batch = shuffleArray(pool).map(reshuffleQuestionOptions);
    for (let i = 0; i < batch.length && out.length < size; i += 1) {
      out.push(batch[i]);
    }
  }
  return out;
};

const uniqueDistractors = (source, answer, count = 3) => {
  const pool = Array.from(new Set((source || []).filter(Boolean).filter((item) => item !== answer)));
  const chosen = shuffleArray(pool).slice(0, count);
  if (chosen.length < count) {
    while (chosen.length < count) chosen.push(`Not ${answer}`);
  }
  return chosen;
};

const extractSentences = (text) => {
  if (!text) return [];
  return String(text)
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => trimText(s, 110))
    .filter((s) => s.length > 25);
};

const buildNovelQuestionsFromUnits = (units) => {
  const allTerms = [];
  const allDefinitions = [];
  const allUnitTitles = units.map((u) => u.title).filter(Boolean);
  const allHeadings = [];
  const allSentences = [];
  const novel = [];

  units.forEach((unit) => {
    const keyTerms = Array.isArray(unit.keyTerms) ? unit.keyTerms : [];
    keyTerms.forEach((kt) => {
      if (kt?.term && kt?.definition) {
        allTerms.push(kt.term);
        allDefinitions.push(trimText(kt.definition, 100));
      }
    });

    const sections = Array.isArray(unit.content) ? unit.content : [];
    sections.forEach((section) => {
      if (section?.heading) allHeadings.push(section.heading);
      if (section?.text) allSentences.push(...extractSentences(section.text));
    });
  });

  units.forEach((unit) => {
    const unitTitle = unit.title || `Unit ${unit.id || ''}`.trim();
    const keyTerms = Array.isArray(unit.keyTerms) ? unit.keyTerms : [];
    keyTerms.forEach((kt) => {
      if (!kt?.term || !kt?.definition) return;
      const definition = trimText(kt.definition, 100);
      const termDistractors = uniqueDistractors(allTerms, kt.term, 3);
      const termOptions = shuffleArray([kt.term, ...termDistractors]);
      novel.push({
        question: `In "${unitTitle}", which term matches this definition: "${definition}"?`,
        options: termOptions,
        correct: termOptions.indexOf(kt.term),
        explanation: `"${kt.term}" is the matching term from this unit.`
      });

      const defDistractors = uniqueDistractors(allDefinitions, definition, 3);
      const defOptions = shuffleArray([definition, ...defDistractors]);
      novel.push({
        question: `What best defines "${kt.term}" in "${unitTitle}"?`,
        options: defOptions,
        correct: defOptions.indexOf(definition),
        explanation: `This is the definition used in the unit key terms.`
      });
    });

    const sections = Array.isArray(unit.content) ? unit.content : [];
    sections.forEach((section) => {
      if (section?.heading) {
        const unitDistractors = uniqueDistractors(allUnitTitles, unitTitle, 3);
        const headingOptions = shuffleArray([unitTitle, ...unitDistractors]);
        novel.push({
          question: `Which unit includes the section "${section.heading}"?`,
          options: headingOptions,
          correct: headingOptions.indexOf(unitTitle),
          explanation: `That section appears in "${unitTitle}".`
        });
      }

      const sectionSentences = extractSentences(section?.text);
      sectionSentences.slice(0, 2).forEach((sentence) => {
        const sentenceDistractors = uniqueDistractors(allSentences, sentence, 3);
        const sentenceOptions = shuffleArray([sentence, ...sentenceDistractors]);
        novel.push({
          question: `Which statement is taught in "${unitTitle}"?`,
          options: sentenceOptions,
          correct: sentenceOptions.indexOf(sentence),
          explanation: `That statement is from the lesson content in "${unitTitle}".`
        });
      });
    });
  });

  return uniqueByQuestion(novel);
};

export const buildBalancedExamQuestions = ({ quizPool, novelPool, fallbackPool = [] }) => {
  const novelTarget = Math.round(EXAM_TOTAL_QUESTIONS * EXAM_NOVEL_RATIO);
  const quizTarget = EXAM_TOTAL_QUESTIONS - novelTarget;

  const uniqueQuiz = uniqueByQuestion(quizPool || []);
  const uniqueNovel = uniqueByQuestion(novelPool || []);
  const uniqueFallback = uniqueByQuestion(fallbackPool || []);

  const quizBase = uniqueQuiz.length > 0 ? uniqueQuiz : uniqueFallback;
  const novelBase = uniqueNovel.length > 0 ? uniqueNovel : uniqueFallback;

  const selectedQuiz = fillToSize(quizBase, quizTarget);
  const selectedNovel = fillToSize(novelBase, novelTarget);
  const combined = shuffleArray([...selectedQuiz, ...selectedNovel]);

  if (combined.length === EXAM_TOTAL_QUESTIONS) return combined;
  return fillToSize(combined.length > 0 ? combined : uniqueFallback, EXAM_TOTAL_QUESTIONS);
};

export const buildFinalExamFromCourse = (courseData) => {
  const units = Array.isArray(courseData?.units) ? courseData.units : [];
  const staticFinal = Array.isArray(courseData?.finalExam) ? courseData.finalExam : [];

  const quizPool = [];
  units.forEach((unit) => {
    const quiz = Array.isArray(unit.quiz) ? unit.quiz : [];
    quiz.forEach((q) => {
      const normalized = toIndexedQuestion(q, 'Review question. Correct answer:');
      if (normalized) quizPool.push(normalized);
    });
  });

  const fallbackPool = [];
  staticFinal.forEach((q) => {
    const normalized = toIndexedQuestion(q, 'Final exam item. Correct answer:');
    if (normalized) fallbackPool.push(normalized);
  });

  const quizPrompts = new Set(quizPool.map((q) => q.question));
  const novelPool = buildNovelQuestionsFromUnits(units).filter((q) => !quizPrompts.has(q.question));

  return buildBalancedExamQuestions({ quizPool, novelPool, fallbackPool });
};

export const buildFinalExamFromUnitsAndFinal = (units, staticFinal = []) => {
  return buildFinalExamFromCourse({ units, finalExam: staticFinal });
};

export const FINAL_EXAM_TOTAL_QUESTIONS = EXAM_TOTAL_QUESTIONS;
export const FINAL_EXAM_NOVEL_RATIO = EXAM_NOVEL_RATIO;
export const FINAL_EXAM_PASS_PERCENT = EXAM_PASS_PERCENT;
