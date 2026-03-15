const CORE_BIBLICAL_STUDIES_IDS = new Set([
  'biblicalHermeneutics',
  'biblicalExegeticalMethods',
  'biblicalCanon',
  'biblicalArchaeology',
  'biblicalEthics',
  'oldTestamentSurvey',
  'newTestamentSurvey',
  'mosaicLaw',
  'textualCriticism',
  'textualTransmission',
  'christology',
  'pneumatology',
  'capstone',
  'diplomaCapstone'
]);

const toSentence = (value = '') => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  return /[.!?]$/.test(text) ? text : `${text}.`;
};

const firstSentence = (value = '') => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  const match = text.match(/^(.{25,180}?[.!?])(?:\s|$)/);
  return match ? match[1].trim() : toSentence(text.slice(0, 160));
};

const uniqueByQuestion = (questions = []) => {
  const seen = new Set();
  return questions.filter((q) => {
    const key = `${q?.question || ''}::${(q?.options || []).join('||')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const buildObjectiveDefaults = (unit = {}) => {
  const headings = (unit.content || [])
    .map((section) => section?.heading)
    .filter(Boolean);
  const firstHeading = headings[0] || unit.title || 'the unit';
  const secondHeading = headings[1] || 'its historical and literary context';
  const firstTerm = unit?.keyTerms?.[0]?.term || 'core terminology';
  const secondTerm = unit?.keyTerms?.[1]?.term || 'supporting evidence';

  return [
    `Summarize the unit argument in 120-180 words with explicit reference to "${firstHeading}".`,
    `Analyze how "${secondHeading}" shapes interpretation, citing at least two textual observations.`,
    `Differentiate ${firstTerm} from ${secondTerm} using precise definitions and one supporting passage.`,
    'Construct a concise, evidence-based interpretation that moves from observation to theological synthesis.'
  ];
};

const buildAssessmentTasks = (unit = {}) => {
  const title = unit.title || 'this unit';
  return [
    `Exegetical worksheet: Record at least 12 text observations for ${title} and group them by literary function.`,
    `Context brief: Write a 250-350 word historical-literary analysis using unit headings and key terms.`,
    'Argument map: Present the passage flow with claims, evidence, and one peer-review question for revision.'
  ];
};

const buildTermQuestions = (unit = {}) => {
  const terms = Array.isArray(unit.keyTerms) ? unit.keyTerms.filter((kt) => kt?.term && kt?.definition) : [];
  if (terms.length < 2) return [];

  const termNames = terms.map((kt) => kt.term);
  const defMap = new Map(terms.map((kt) => [kt.term, firstSentence(kt.definition)]));
  const questions = [];

  terms.forEach((kt, idx) => {
    const distractors = termNames.filter((name) => name !== kt.term).slice(0, 3);
    const options = [kt.term, ...distractors];
    questions.push({
      question: `Which term best matches this definition: "${defMap.get(kt.term)}"?`,
      options,
      correct: 0,
      explanation: `${kt.term} is the term defined this way in the unit key terms.`
    });

    const otherDefinitions = terms
      .filter((item) => item.term !== kt.term)
      .map((item) => firstSentence(item.definition))
      .slice(0, 3);
    const defOptions = [defMap.get(kt.term), ...otherDefinitions];
    questions.push({
      question: `In this unit, what is the best definition of "${kt.term}"?`,
      options: defOptions,
      correct: 0,
      explanation: `This matches the unit's definition for ${kt.term}.`
    });

    if (idx >= 2) return;
    const section = unit.content?.[idx];
    if (!section?.heading) return;
    const sectionOptions = [
      section.heading,
      ...(unit.content || []).map((item) => item?.heading).filter(Boolean).filter((h) => h !== section.heading).slice(0, 3)
    ];
    questions.push({
      question: `Which section heading is most directly tied to "${kt.term}" in this unit's flow?`,
      options: sectionOptions,
      correct: 0,
      explanation: `The unit presents this term within the "${section.heading}" section.`
    });
  });

  return uniqueByQuestion(questions);
};

const buildSectionQuestions = (unit = {}) => {
  const sections = Array.isArray(unit.content) ? unit.content.filter((section) => section?.heading && section?.text) : [];
  if (sections.length < 2) return [];
  const headings = sections.map((section) => section.heading);

  return uniqueByQuestion(
    sections.flatMap((section) => {
      const sentence = firstSentence(section.text);
      if (!sentence) return [];
      const headingDistractors = headings.filter((h) => h !== section.heading).slice(0, 3);
      const headingOptions = [section.heading, ...headingDistractors];
      return [
        {
          question: `Which section of this unit teaches the following claim: "${sentence}"?`,
          options: headingOptions,
          correct: 0,
          explanation: `This statement is drawn from the "${section.heading}" section.`
        },
        {
          question: `What is the strongest summary of the "${section.heading}" section?`,
          options: [
            sentence,
            ...sections
              .filter((candidate) => candidate.heading !== section.heading)
              .map((candidate) => firstSentence(candidate.text))
              .filter(Boolean)
              .slice(0, 3)
          ],
          correct: 0,
          explanation: `This sentence summarizes the central claim of "${section.heading}".`
        }
      ];
    })
  );
};

const buildRigorQuiz = (unit = {}) => {
  const existingQuiz = Array.isArray(unit.quiz) ? unit.quiz : [];
  const generated = [...buildTermQuestions(unit), ...buildSectionQuestions(unit)];
  const merged = uniqueByQuestion([...existingQuiz, ...generated]).slice(0, 12);
  return merged.length >= 8 ? merged : existingQuiz;
};

const shouldEnhance = (courseData = {}) => {
  if (CORE_BIBLICAL_STUDIES_IDS.has(courseData.id)) return true;
  const subtitle = String(courseData.subtitle || '').toLowerCase();
  return subtitle.includes('associate-level') && !subtitle.includes('language course');
};

export const applyAssociateProgramRigor = (courseData = {}) => {
  if (!courseData || !shouldEnhance(courseData)) return courseData;

  const units = Array.isArray(courseData.units) ? courseData.units : [];
  const enhancedUnits = units.map((unit) => {
    const learningObjectives = Array.isArray(unit.learningObjectives) && unit.learningObjectives.length >= 3
      ? unit.learningObjectives
      : buildObjectiveDefaults(unit);

    const requiredWork = Array.isArray(unit.requiredWork) && unit.requiredWork.length >= 2
      ? unit.requiredWork
      : buildAssessmentTasks(unit);

    return {
      ...unit,
      quiz: buildRigorQuiz(unit),
      learningObjectives,
      requiredWork
    };
  });

  const existingProfile = courseData.rigorProfile || {};
  const rigorProfile = {
    contactHours: existingProfile.contactHours || '45+ instructional hours',
    studyHours: existingProfile.studyHours || '90-120 independent study hours',
    writingLoad: existingProfile.writingLoad || 'Short-form analytical writing in every unit',
    standards: Array.isArray(existingProfile.standards) && existingProfile.standards.length > 0
      ? existingProfile.standards
      : [
          'Context-first interpretation (historical, literary, canonical)',
          'Evidence-based arguments with explicit textual grounding',
          'Terminology precision and documented reasoning'
        ]
  };

  return {
    ...courseData,
    quizPassPercentage: Math.max(Number(courseData.quizPassPercentage || 0), 80),
    examPassPercentage: Math.max(Number(courseData.examPassPercentage || 0), 80),
    units: enhancedUnits,
    rigorProfile,
    about: {
      ...(courseData.about || {}),
      level: 'Associate-Level Biblical Studies',
      description: `${toSentence(courseData.about?.description || '')} Program alignment: sustained exegesis, contextual analysis, and accountable theological reasoning.`.trim()
    }
  };
};

export default applyAssociateProgramRigor;
