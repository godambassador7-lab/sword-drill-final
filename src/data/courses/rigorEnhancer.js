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

const buildAssessmentTasks = (unit = {}, courseData = {}) => {
  const subtitle = String(courseData?.subtitle || '').toLowerCase();
  if (subtitle.includes('language course')) {
    const title = unit.title || 'this language unit';
    return [
      `Parsing worksheet: Identify morphology/syntax for 10 forms from ${title} and justify each decision.`,
      `Translation brief: Translate one short passage tied to ${title} and annotate key lexical choices in 180-250 words.`,
      'Reflection memo: Explain one recurrent grammar pattern from this unit and where it changes interpretation.'
    ];
  }

  const title = unit.title || 'this unit';
  return [
    `Exegetical worksheet: Record at least 12 text observations for ${title} and group them by literary function.`,
    `Context brief: Write a 250-350 word historical-literary analysis using unit headings and key terms.`,
    'Argument map: Present the passage flow with claims, evidence, and one peer-review question for revision.'
  ];
};

const ensureLessonSections = (unit = {}) => {
  const sections = Array.isArray(unit.content) ? unit.content.filter((section) => section && typeof section === 'object') : [];
  if (sections.length > 0) return sections;
  return [
    {
      heading: unit.title || 'Unit Lesson Material',
      text: `Core lesson material for ${unit.title || 'this unit'}: identify the central claims, trace the argument flow, and document supporting textual evidence before moving to assessment.`
    }
  ];
};

const enrichSectionText = (section = {}, unit = {}) => {
  const base = String(section?.text || '').trim();
  if (!base) return base;
  if (base.length >= 260) return base;
  const keyTerms = (unit.keyTerms || []).map((item) => item?.term).filter(Boolean).slice(0, 3).join(', ');
  const heading = section?.heading || unit?.title || 'this section';
  return `${base}\n\nAssociate-level analysis checkpoint: explain how "${heading}" contributes to the unit argument, cite at least two textual observations, and integrate key terms (${keyTerms || 'unit terminology'}) with a defendable conclusion.`;
};

const ensureAssociateLevelSections = (unit = {}) => {
  const sections = Array.isArray(unit.content) ? unit.content : [];
  const enriched = sections.map((section) => ({
    ...section,
    text: enrichSectionText(section, unit)
  }));

  if (enriched.length >= 3) return enriched;
  const sectionTitles = enriched.map((s) => s?.heading).filter(Boolean).join(', ');
  return [
    ...enriched,
    {
      heading: 'Associate-Level Synthesis Workshop',
      text: `Integrate the unit sections (${sectionTitles || unit.title || 'core lesson sections'}) into one coherent argument. Distinguish observation, interpretation, and synthesis, then defend your final claim with textual evidence and precise terminology.`
    }
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
  if (merged.length >= 5) return merged;
  if (existingQuiz.length >= 5) return existingQuiz;

  const fallbackSection = unit.content?.[0]?.heading || unit.title || 'the unit lesson';
  const fallbackTerm = unit.keyTerms?.[0]?.term || 'key terminology';
  const fallbackDef = firstSentence(unit.keyTerms?.[0]?.definition || 'a central term for interpreting this unit');

  const fallback = [
    {
      question: `Which area is the main focus of this unit?`,
      options: [fallbackSection, 'Unrelated background details', 'Random historical trivia', 'A topic outside the course'],
      correct: 0,
      explanation: 'The quiz should test direct lesson content from this unit.'
    },
    {
      question: `What should come first before attempting written assessment tasks?`,
      options: ['Review lesson material and pass the quiz', 'Skip directly to final exam', 'Ignore unit objectives', 'Use only memory without text'],
      correct: 0,
      explanation: 'Unit flow requires lesson engagement and quiz performance before written assessment.'
    },
    {
      question: `In this unit, which term should be defined with precision?`,
      options: [fallbackTerm, 'Undefined speculation', 'Irrelevant vocabulary', 'Any random phrase'],
      correct: 0,
      explanation: 'Key terms anchor accurate analysis and interpretation.'
    },
    {
      question: `What best reflects associate-level work in this unit?`,
      options: ['Evidence-based claims with textual support', 'Unsupported assertions', 'Only personal preference', 'No use of source material'],
      correct: 0,
      explanation: 'Associate-level rigor requires evidence-grounded argumentation.'
    },
    {
      question: `Which definition best matches the key term emphasized in this unit?`,
      options: [fallbackDef, 'A contradictory definition', 'An unrelated concept', 'No definition needed'],
      correct: 0,
      explanation: `The lesson defines ${fallbackTerm} with this meaning.`
    }
  ];

  return uniqueByQuestion([...existingQuiz, ...generated, ...fallback]).slice(0, 12);
};

const shouldEnhance = (courseData = {}) => {
  if (CORE_BIBLICAL_STUDIES_IDS.has(courseData.id)) return true;
  const subtitle = String(courseData.subtitle || '').toLowerCase();
  return subtitle.includes('associate-level') && !subtitle.includes('language course');
};

export const applyAssociateProgramRigor = (courseData = {}) => {
  if (!courseData) return courseData;

  const isAssociateTrack = shouldEnhance(courseData);

  const units = Array.isArray(courseData.units) ? courseData.units : [];
  const enhancedUnits = units.map((unit) => {
    const normalizedUnit = {
      ...unit,
      content: ensureLessonSections(unit)
    };

    const learningObjectives = Array.isArray(unit.learningObjectives) && unit.learningObjectives.length >= 3
      ? unit.learningObjectives
      : buildObjectiveDefaults(normalizedUnit);

    const requiredWork = Array.isArray(unit.requiredWork) && unit.requiredWork.length >= 2
      ? unit.requiredWork
      : buildAssessmentTasks(normalizedUnit, courseData);

    return {
      ...normalizedUnit,
      content: ensureAssociateLevelSections(normalizedUnit),
      quiz: buildRigorQuiz(normalizedUnit),
      learningObjectives,
      requiredWork
    };
  });

  if (!isAssociateTrack) {
    return {
      ...courseData,
      units: enhancedUnits
    };
  }

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
