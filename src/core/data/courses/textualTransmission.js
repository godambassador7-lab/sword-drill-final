const textualTransmissionCourse = {
  id: 'textualTransmission',
  title: 'Textual Transmission & Manuscripts',
  subtitle: 'Associate-Level Course | 7 Units + Final Exam',
  quizPassScore: 4,
  examPassPercentage: 70,
  units: [
    {
      id: '01',
      title: 'Transmission Basics',
      icon: '📜',
      duration: '25 min',
      content: [
        {
          heading: 'What Transmission Is',
          text: 'Transmission refers to how biblical texts were copied and preserved through manuscripts over centuries.'
        },
        {
          heading: 'Manuscript Culture',
          text: 'Before printing, copying was manual. Manuscripts vary in material, script, and quality.'
        }
      ],
      keyTerms: [
        { term: 'Transmission', definition: 'Copying and preservation of texts' },
        { term: 'Manuscript', definition: 'Handwritten copy of a text' },
        { term: 'Scribe', definition: 'Person who copied texts' }
      ],
      quiz: [
        { question: 'Textual transmission refers to:', options: ['Copying and preservation', 'Only translation', 'Only interpretation', 'Only preaching'], correct: 0, explanation: 'Transmission is copying and preservation.' },
        { question: 'A manuscript is:', options: ['A handwritten text', 'A printed book', 'A modern edition', 'An audio recording'], correct: 0, explanation: 'Manuscripts are handwritten texts.' },
        { question: 'Before printing, copying was:', options: ['Manual', 'Digital', 'Mechanical', 'Instant'], correct: 0, explanation: 'Copying was manual.' },
        { question: 'Scribes were:', options: ['Copyists of texts', 'Only translators', 'Only editors', 'Only preachers'], correct: 0, explanation: 'Scribes copied texts.' },
        { question: 'Manuscripts can vary in:', options: ['Material and script', 'Only size', 'Only color', 'Only age'], correct: 0, explanation: 'They vary in material and script.' }
      ]
    },
    {
      id: '02',
      title: 'Materials and Scripts',
      icon: '🧾',
      duration: '20 min',
      content: [
        {
          heading: 'Materials',
          text: 'Common materials include papyrus, parchment, and paper. Material choice affects preservation.'
        },
        {
          heading: 'Scripts',
          text: 'Scripts include uncial (majuscule) and minuscule styles, reflecting historical periods.'
        }
      ],
      keyTerms: [
        { term: 'Papyrus', definition: 'Early writing material made from papyrus plant' },
        { term: 'Parchment', definition: 'Writing material made from animal skin' },
        { term: 'Uncial', definition: 'Majuscule script style' }
      ],
      quiz: [
        { question: 'Papyrus is:', options: ['A writing material', 'A modern font', 'A bookbinding method', 'A translation'], correct: 0, explanation: 'Papyrus is a writing material.' },
        { question: 'Parchment is made from:', options: ['Animal skin', 'Papyrus plant', 'Clay', 'Metal'], correct: 0, explanation: 'Parchment is made from animal skin.' },
        { question: 'Uncial refers to:', options: ['Majuscule script', 'Minuscule script', 'Only cursive', 'Only modern type'], correct: 0, explanation: 'Uncial is majuscule script.' },
        { question: 'Script styles can indicate:', options: ['Historical period', 'Only translation', 'Only doctrine', 'Only genre'], correct: 0, explanation: 'Scripts can indicate period.' },
        { question: 'Material choice affects:', options: ['Preservation', 'Only meaning', 'Only syntax', 'Only theology'], correct: 0, explanation: 'Material affects preservation.' }
      ]
    },
    {
      id: '03',
      title: 'Textual Variants',
      icon: '🔎',
      duration: '25 min',
      content: [
        {
          heading: 'Types of Variants',
          text: 'Variants include spelling differences, word order changes, and occasional additions or omissions.'
        },
        {
          heading: 'Causes',
          text: 'Variants can arise from copying errors, intentional clarifications, or harmonization.'
        }
      ],
      keyTerms: [
        { term: 'Variant', definition: 'Difference among manuscripts' },
        { term: 'Harmonization', definition: 'Making texts align with each other' },
        { term: 'Omission', definition: 'A missing word or phrase' }
      ],
      quiz: [
        { question: 'Variants are:', options: ['Differences among manuscripts', 'Translation errors only', 'Only punctuation', 'Only pronunciation'], correct: 0, explanation: 'Variants are manuscript differences.' },
        { question: 'Common variants include:', options: ['Spelling and word order', 'Only theology', 'Only genre', 'Only history'], correct: 0, explanation: 'Spelling and word order are common.' },
        { question: 'Harmonization is:', options: ['Aligning texts', 'Removing evidence', 'Only copying', 'Only translation'], correct: 0, explanation: 'It is aligning texts.' },
        { question: 'Omission refers to:', options: ['Missing material', 'Only added material', 'Only spelling', 'Only punctuation'], correct: 0, explanation: 'Omission is missing material.' },
        { question: 'Variants can arise from:', options: ['Copying errors', 'Only printing', 'Only translation', 'Only prophecy'], correct: 0, explanation: 'Copying errors can cause variants.' }
      ]
    },
    {
      id: '04',
      title: 'Families and Text Types',
      icon: '🧬',
      duration: '20 min',
      content: [
        {
          heading: 'Textual Families',
          text: 'Manuscripts can be grouped by shared readings, forming textual families or types.'
        },
        {
          heading: 'Purpose',
          text: 'Text types help scholars evaluate patterns of transmission and regional influences.'
        }
      ],
      keyTerms: [
        { term: 'Text Type', definition: 'Group of manuscripts with shared readings' },
        { term: 'Family', definition: 'Manuscripts with common ancestry' },
        { term: 'Shared Readings', definition: 'Common textual features' }
      ],
      quiz: [
        { question: 'Text types are:', options: ['Groups of manuscripts with shared readings', 'Only translations', 'Only doctrines', 'Only genres'], correct: 0, explanation: 'They are manuscript groups with shared readings.' },
        { question: 'Families indicate:', options: ['Common ancestry', 'Random variation', 'Only errors', 'Only geography'], correct: 0, explanation: 'Families indicate common ancestry.' },
        { question: 'Text types help evaluate:', options: ['Transmission patterns', 'Only theology', 'Only grammar', 'Only pronunciation'], correct: 0, explanation: 'They help evaluate transmission patterns.' },
        { question: 'Shared readings are:', options: ['Common features', 'Only unique errors', 'Only punctuation', 'Only translations'], correct: 0, explanation: 'Shared readings are common features.' },
        { question: 'Text types can reflect:', options: ['Regional influences', 'Only modern editions', 'Only speculation', 'Only theology'], correct: 0, explanation: 'They can reflect regional influences.' }
      ]
    },
    {
      id: '05',
      title: 'Transmission of the Hebrew Bible',
      icon: '🕎',
      duration: '25 min',
      content: [
        {
          heading: 'Masoretic Tradition',
          text: 'The Masoretic Text is the primary Hebrew tradition, with vowel points added by Masoretes.'
        },
        {
          heading: 'Other Witnesses',
          text: 'Other witnesses include the Dead Sea Scrolls and ancient translations.'
        }
      ],
      keyTerms: [
        { term: 'Masoretic Text', definition: 'Primary Hebrew manuscript tradition' },
        { term: 'Dead Sea Scrolls', definition: 'Second Temple manuscripts' },
        { term: 'Ancient Translation', definition: 'Early versions such as the Septuagint' }
      ],
      quiz: [
        { question: 'The Masoretic Text is:', options: ['Primary Hebrew tradition', 'A Greek translation', 'A Latin edition', 'A modern paraphrase'], correct: 0, explanation: 'It is the primary Hebrew tradition.' },
        { question: 'Dead Sea Scrolls are:', options: ['Second Temple manuscripts', 'Modern printed texts', 'Only NT copies', 'Only medieval manuscripts'], correct: 0, explanation: 'They are Second Temple manuscripts.' },
        { question: 'Ancient translations include:', options: ['Septuagint', 'Only modern versions', 'Only paraphrases', 'Only commentary'], correct: 0, explanation: 'The Septuagint is an ancient translation.' },
        { question: 'Masoretes are known for:', options: ['Vowel pointing', 'Only copying NT', 'Only archaeology', 'Only translation'], correct: 0, explanation: 'They standardized vowel pointing.' },
        { question: 'Multiple witnesses help:', options: ['Compare readings', 'Eliminate evidence', 'Avoid context', 'Replace texts'], correct: 0, explanation: 'They help compare readings.' }
      ]
    },
    {
      id: '06',
      title: 'Transmission of the New Testament',
      icon: '✝️',
      duration: '25 min',
      content: [
        {
          heading: 'Manuscript Abundance',
          text: 'The New Testament is preserved in numerous manuscripts across several centuries.'
        },
        {
          heading: 'Textual Variants',
          text: 'Variants exist, but most are minor. Critical editions document these differences.'
        }
      ],
      keyTerms: [
        { term: 'Critical Edition', definition: 'Scholarly text with variant apparatus' },
        { term: 'Manuscript', definition: 'Handwritten copy' },
        { term: 'Variant', definition: 'Difference among witnesses' }
      ],
      quiz: [
        { question: 'NT manuscripts are:', options: ['Numerous', 'Scarce', 'Only modern', 'Only in Latin'], correct: 0, explanation: 'They are numerous.' },
        { question: 'Critical editions provide:', options: ['Variant apparatus', 'Only translation', 'Only commentary', 'Only sermons'], correct: 0, explanation: 'They provide variant apparatus.' },
        { question: 'Most NT variants are:', options: ['Minor', 'Major and disruptive', 'Unknown', 'Only doctrinal'], correct: 0, explanation: 'Most variants are minor.' },
        { question: 'Manuscripts are:', options: ['Handwritten', 'Printed', 'Digital only', 'Audio'], correct: 0, explanation: 'They are handwritten.' },
        { question: 'Variant apparatus shows:', options: ['Differences among witnesses', 'Only translations', 'Only doctrine', 'Only grammar'], correct: 0, explanation: 'It shows differences among witnesses.' }
      ]
    },
    {
      id: '07',
      title: 'Synthesis',
      icon: '📚',
      duration: '20 min',
      content: [
        {
          heading: 'Summary',
          text: 'Textual transmission is a historical process preserved in manuscripts. Understanding this process supports responsible reading.'
        },
        {
          heading: 'Balanced View',
          text: 'A balanced view recognizes textual variation while affirming the overall stability of the text.'
        }
      ],
      keyTerms: [
        { term: 'Stability', definition: 'Overall consistency of textual transmission' },
        { term: 'Variation', definition: 'Differences among manuscripts' },
        { term: 'Process', definition: 'Historical development over time' }
      ],
      quiz: [
        { question: 'Transmission is:', options: ['A historical process', 'Instant and uniform', 'Only modern', 'Only speculative'], correct: 0, explanation: 'It is a historical process.' },
        { question: 'A balanced view recognizes:', options: ['Variation and stability', 'Only variation', 'Only stability', 'Neither'], correct: 0, explanation: 'It recognizes variation and stability.' },
        { question: 'Manuscripts provide:', options: ['Evidence for transmission', 'Only doctrine', 'Only grammar', 'Only translation'], correct: 0, explanation: 'They provide evidence.' },
        { question: 'Variation refers to:', options: ['Differences among manuscripts', 'Only punctuation', 'Only pronunciation', 'Only grammar'], correct: 0, explanation: 'Variation is differences among manuscripts.' },
        { question: 'Stability means:', options: ['Overall consistency', 'No differences at all', 'Only modern agreement', 'Only doctrine'], correct: 0, explanation: 'Stability is overall consistency.' }
      ]
    }
  ],
  finalExam: [
    { question: 'Transmission refers to:', options: ['Copying and preservation', 'Only translation', 'Only interpretation', 'Only preaching'], correct: 0, explanation: 'It refers to copying and preservation.' },
    { question: 'Papyrus is:', options: ['A writing material', 'A modern font', 'A translation', 'A sermon'], correct: 0, explanation: 'Papyrus is a writing material.' },
    { question: 'Variants are:', options: ['Differences among manuscripts', 'Only translation errors', 'Only punctuation', 'Only pronunciation'], correct: 0, explanation: 'Variants are manuscript differences.' },
    { question: 'Text types are:', options: ['Groups of manuscripts with shared readings', 'Only translations', 'Only doctrines', 'Only genres'], correct: 0, explanation: 'They are groups of manuscripts.' },
    { question: 'The Masoretic Text is:', options: ['Primary Hebrew tradition', 'A Greek translation', 'A Latin edition', 'A modern paraphrase'], correct: 0, explanation: 'It is the primary Hebrew tradition.' },
    { question: 'Dead Sea Scrolls are:', options: ['Second Temple manuscripts', 'Modern printed texts', 'Only NT copies', 'Only medieval manuscripts'], correct: 0, explanation: 'They are Second Temple manuscripts.' },
    { question: 'Critical editions provide:', options: ['Variant apparatus', 'Only translation', 'Only commentary', 'Only sermons'], correct: 0, explanation: 'They provide variant apparatus.' },
    { question: 'Most NT variants are:', options: ['Minor', 'Major and disruptive', 'Unknown', 'Only doctrinal'], correct: 0, explanation: 'Most variants are minor.' },
    { question: 'Stability refers to:', options: ['Overall consistency', 'No differences at all', 'Only modern agreement', 'Only doctrine'], correct: 0, explanation: 'Stability is overall consistency.' },
    { question: 'A balanced view recognizes:', options: ['Variation and stability', 'Only variation', 'Only stability', 'Neither'], correct: 0, explanation: 'It recognizes variation and stability.' }
  ],
  about: {
    level: 'Associate-Level Course',
    description: 'A historical, text-driven study of how biblical manuscripts were copied and preserved, focusing on evidence without denominational bias.',
    credits: '3 credits',
    prerequisites: 'Old Testament and New Testament Survey recommended'
  }
};

export default textualTransmissionCourse;
