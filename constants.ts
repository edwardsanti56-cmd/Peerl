
import { Subject, ClassLevel, Topic } from './types';

export const APP_NAME = "Pearl Notes";

export const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', iconName: 'Calculator', imageSeed: 'mathematics', description: 'Numbers, Algebra, Geometry & Statistics' },
  { id: 'english', name: 'English Language', iconName: 'BookOpen', imageSeed: 'library', description: 'Grammar, Comprehension & Literature' },
  { id: 'biology', name: 'Biology', iconName: 'Dna', imageSeed: 'biology', description: 'Life, Cells, Plants & Animals' },
  { id: 'chemistry', name: 'Chemistry', iconName: 'FlaskConical', imageSeed: 'chemistry', description: 'Matter, Reactions & Elements' },
  { id: 'physics', name: 'Physics', iconName: 'Atom', imageSeed: 'physics', description: 'Energy, Motion & Forces' },
  { id: 'geography', name: 'Geography', iconName: 'Globe', imageSeed: 'geography', description: 'Maps, Physical & Human Geography' },
  { id: 'history', name: 'History', iconName: 'Scroll', imageSeed: 'history', description: 'East Africa, Politics & Government' },
  { id: 're', name: 'Religious Education', iconName: 'Cross', imageSeed: 'religion', description: 'CRE & IRE Curriculum' },
  { id: 'ent', name: 'Entrepreneurship', iconName: 'Briefcase', imageSeed: 'business', description: 'Business Skills & Innovation' },
  { id: 'ict', name: 'ICT', iconName: 'Monitor', imageSeed: 'computer', description: 'Computer Studies & Digital Literacy' },
  { id: 'pe', name: 'Physical Education', iconName: 'Activity', imageSeed: 'sports', description: 'Health, Fitness & Sports' },
  { id: 'kiswahili', name: 'Kiswahili', iconName: 'Languages', imageSeed: 'language', description: 'Fasihi & Grammar' },
];

export const CLASSES = [ClassLevel.S1, ClassLevel.S2, ClassLevel.S3, ClassLevel.S4];

// Comprehensive NCDC Syllabus Data Map
// Structure: SubjectID -> ClassLevel -> Array of Topics
const SYLLABUS_DATA: Record<string, Record<string, string[]>> = {
  math: {
    [ClassLevel.S1]: [
      'Operations on Numbers', 'Bases and Place Values', 'Sets and Set Operations', 
      'Patterns and Sequences', 'Fractions, Decimals and Percentages', 
      'Integers', 'Rectangular Cartesian Coordinates', 'Reflection', 
      'Lines, Angles and Polygons', 'Bearings', 'Data Collection and Presentation',
      'Time and Transport Schedules', 'Length, Mass and Capacity'
    ],
    [ClassLevel.S2]: [
      'Mappings and Relations', 'Linear Equations and Inequalities', 'Indices and Logarithms',
      'Approximation and Estimation', 'Circumference and Area', 'Volume and Surface Area',
      'Similarity and Enlargement', 'Rotation', 'Business Arithmetic (Interest, Discount)',
      'Construction of Geometric Figures', 'Probability (Intro)'
    ],
    [ClassLevel.S3]: [
      'Matrices', 'Vectors', 'Composite Functions', 'Quadratic Equations',
      'Surds', 'Circle Properties', 'Trigonometry (SOHCAHTOA)', 'Compound Interest',
      'Matrices and Transformations', 'Linear Programming (Intro)', 'Income Tax'
    ],
    [ClassLevel.S4]: [
      'Probability', 'Statistics (Mean, Mode, Median, Pie Charts)', 
      'Linear Programming (Optimization)', 'Three Dimensional Geometry',
      'Latitude and Longitude', 'Matrices (Transformation)', 'Differentiation (Intro)',
      'Integration (Intro)', 'Revision and Past Papers', 'Examination Techniques'
    ]
  },
  biology: {
    [ClassLevel.S1]: [
      'Introduction to Biology', 'Diversity of Living Things (Classification)', 
      'The Cell (Structure and Function)', 'Levels of Organization', 
      'Insects and Vectors', 'Flowering Plants (Structure)',
      'Tools used in Biology', 'Safety in the Laboratory'
    ],
    [ClassLevel.S2]: [
      'Soil Composition and Properties', 'Nutrition in Plants (Photosynthesis)',
      'Nutrition in Animals (Digestion)', 'Transport in Plants', 'Transport in Animals (Circulatory System)',
      'Gaseous Exchange (Respiration)', 'Food Tests'
    ],
    [ClassLevel.S3]: [
      'Respiration (Aerobic/Anaerobic)', 'Excretion and Homeostasis', 
      'Coordination and Control (Nervous/Hormonal)', 'Locomotion and Support',
      'Growth and Development', 'The Human Eye and Ear'
    ],
    [ClassLevel.S4]: [
      'Reproduction in Plants', 'Reproduction in Animals', 'Genetics and Inheritance', 
      'Evolution and Variation', 'Interrelationships (Ecology)', 
      'Population Dynamics', 'Applied Biology', 'Mitosis and Meiosis'
    ]
  },
  chemistry: {
    [ClassLevel.S1]: [
      'Introduction to Chemistry', 'States of Matter', 'Mixtures and Methods of Separation',
      'Air and Combustion', 'Water and Hydrogen', 'Simple Acid-Base Indicators',
      'Laboratory Apparatus and Safety'
    ],
    [ClassLevel.S2]: [
      'Atomic Structure', 'The Periodic Table', 'Chemical Bonding',
      'Chemical Families and Patterns', 'Structure and Properties of Matter',
      'Acids, Bases and Salts', 'Preparation of Salts'
    ],
    [ClassLevel.S3]: [
      'The Mole Concept', 'Chemical Equations and Stoichiometry', 
      'Carbon and its Compounds', 'Nitrogen and its Compounds', 
      'Sulphur and its Compounds', 'Chlorine and its Compounds',
      'Quantitative Analysis (Titration)'
    ],
    [ClassLevel.S4]: [
      'Electrochemistry (Electrolysis)', 'Energy Changes in Chemical Reactions',
      'Rates of Reaction', 'Chemical Equilibria', 'Organic Chemistry (Intro)',
      'Applied Chemistry (Polymers, Soaps)', 'Metals and Extraction'
    ]
  },
  physics: {
    [ClassLevel.S1]: [
      'Introduction to Physics', 'Measurements (Length, Area, Volume)', 
      'States of Matter', 'Effects of Force (Stretching, Friction)', 
      'Density and Pressure', 'Temperature and Thermometers',
      'Simple Kinetic Theory'
    ],
    [ClassLevel.S2]: [
      'Turning Effect of Forces (Moments)', 'Center of Gravity',
      'Work, Energy and Power', 'Machines', 'Light (Reflection at Plane Surfaces)',
      'Structure of Matter', 'Heat Transfer', 'Linear Expansivity'
    ],
    [ClassLevel.S3]: [
      'Linear Motion', 'Newton’s Laws of Motion', 'Refraction of Light', 
      'Lenses and Optical Instruments', 'Waves', 'Sound', 
      'Electrostatics (Static Electricity)', 'Electric Circuits'
    ],
    [ClassLevel.S4]: [
      'Current Electricity', 'Magnetism', 'Electromagnetism', 
      'Electronics', 'Radioactivity (Nuclear Physics)', 
      'X-Rays', 'Modern Physics', 'Earthquakes and Gravity'
    ]
  },
  geography: {
    [ClassLevel.S1]: [
      'Introduction to Geography', 'Map Reading and Interpretation', 
      'The Earth and the Solar System', 'Weather and Climate', 
      'Rocks and Landforms', 'Mining in East Africa'
    ],
    [ClassLevel.S2]: [
      'East Africa: Location and Size', 'East Africa: Physical Features',
      'East Africa: Climate and Vegetation', 'East Africa: Population',
      'East Africa: Agriculture and Mining', 'East Africa: Transport and Trade',
      'East Africa: Industry and Tourism'
    ],
    [ClassLevel.S3]: [
      'North America: British Columbia', 'North America: New York', 
      'North America: The South', 'Development Studies', 
      'Map Reading (Photography)', 'Fieldwork Techniques',
      'Glaciation'
    ],
    [ClassLevel.S4]: [
      'The Rhinelands', 'Switzerland', 'Belgium', 'China (Communes)', 
      'Photography and Map Analysis', 'Population Studies (Global)',
      'Urbanization and Settlement'
    ]
  },
  history: {
    [ClassLevel.S1]: [
      'The Concept of History', 'Sources of African History', 
      'Origin of Man in East Africa', 'Migration and Settlement in East Africa', 
      'Social, Political and Economic Organization of E. African Societies',
      'Long Distance Trade'
    ],
    [ClassLevel.S2]: [
      'Inter-Regional Trade (Long Distance Trade)', 'Scramble and Partition of East Africa',
      'Response to Colonial Rule (Resistance)', 'Establishment of Colonial Rule',
      'Colonial Administrative Systems', 'The Uganda Railway'
    ],
    [ClassLevel.S3]: [
      'Social and Economic Developments in Colonial East Africa', 
      'Rise of Nationalism in East Africa', 'Formation of Political Parties',
      'Road to Independence in Uganda, Kenya, Tanzania',
      'The Kabaka Crisis'
    ],
    [ClassLevel.S4]: [
      'Post-Independence Developments', 'Challenges of Independence', 
      'World Wars and their Effects on East Africa', 
      'International Organizations (UN, AU, EAC)', 'Nation Building',
      'The Cold War Effects on Africa'
    ]
  },
  english: {
    [ClassLevel.S1]: [
      'Parts of Speech', 'Tenses (Present and Past)', 'Punctuation',
      'Sentence Construction', 'Reading Comprehension Skills', 
      'Oral Literature: Riddles and Proverbs', 'Informal Letter Writing',
      'Descriptive Writing'
    ],
    [ClassLevel.S2]: [
      'Direct and Indirect Speech', 'Active and Passive Voice', 
      'Adjectives and Adverbs', 'Vocabulary Building', 
      'Summary Writing (Intro)', 'Formal Letter Writing', 'Oral Literature: Myths',
      'Notice and Poster Writing'
    ],
    [ClassLevel.S3]: [
      'Conditionals (If clauses)', 'Relative Clauses', 'Report Writing',
      'Speech Writing', 'Poetry Analysis', 'Novel/Play Study', 
      'Creative Writing (Narrative)', 'Debates and Arguments'
    ],
    [ClassLevel.S4]: [
      'Complex Sentence Structures', 'Argumentative Essay Writing', 
      'Minute Writing', 'Advanced Comprehension', 'Literary Analysis', 
      'Examination Techniques', 'Memorandum Writing'
    ]
  },
  ict: {
    [ClassLevel.S1]: ['Introduction to ICT', 'Computer Hardware', 'Computer Software', 'Keyboard Skills', 'Introduction to Windows', 'Care and Safety of Computers'],
    [ClassLevel.S2]: ['File Management', 'Word Processing (Basic)', 'Internet and Email', 'Computer Security', 'Health and Safety', 'Impact of ICT on Society'],
    [ClassLevel.S3]: ['Spreadsheets (Excel)', 'Presentations (PowerPoint)', 'Data Communication', 'Ethical Issues in ICT', 'Networking Basics'],
    [ClassLevel.S4]: ['Database Management', 'Web Design (HTML Basic)', 'Desktop Publishing', 'Future Trends in ICT', 'System Analysis (Intro)']
  },
  ent: {
    [ClassLevel.S1]: ['Meaning of Entrepreneurship', 'Personal Branding', 'Creativity and Innovation', 'Savings and Investment', 'The Market'],
    [ClassLevel.S2]: ['Business Planning', 'Market Research', 'Types of Business Organizations', 'Bookkeeping Basics', 'Business Ethics'],
    [ClassLevel.S3]: ['Marketing Strategies', 'Financial Management', 'Business Ethics', 'Taxes in Uganda', 'Insurance in Business'],
    [ClassLevel.S4]: ['Writing a Business Plan', 'Risk Management', 'Capital Markets', 'Starting a Business Project', 'Production Management']
  },
  pe: {
    [ClassLevel.S1]: [
      'Introduction to Physical Education', 'Physical Fitness and Health', 
      'Gymnastics (Basic Floor Exercises)', 'Athletics (Sprints and Relays)', 
      'Football (Basic Skills)', 'Netball (Footwork and Passing)'
    ],
    [ClassLevel.S2]: [
      'Human Anatomy in Sports', 'First Aid and Safety',
      'Athletics (Long Jump and High Jump)', 'Volleyball (Service and Digging)',
      'Basketball (Dribbling and Shooting)', 'Traditional Games'
    ],
    [ClassLevel.S3]: [
      'Physiology of Exercise', 'Athletics (Throws: Shot Put, Discus)',
      'Rugby (Tag and Contact)', 'Handball',
      'Swimming (Safety and Strokes)', 'Racket Games (Badminton/Table Tennis)'
    ],
    [ClassLevel.S4]: [
      'Sports Management and Administration', 'Training Methods and Principles',
      'Rules and Officiating', 'Contemporary Issues in Sports',
      'Biomechanics (Levers and Motion)', 'Career Opportunities in Sports'
    ]
  },
  re: {
    [ClassLevel.S1]: [
      'Worship and Prayer', 'The Holy Scriptures', 'Creation and Fall', 
      'African Traditional Heritage', 'Family and Community',
      'Respect for Life'
    ],
    [ClassLevel.S2]: [
      'The Old Testament History', 'Prophets and Prophecies',
      'The Early Church/Islamic History', 'Rituals and Festivals',
      'Moral Values in Society', 'Loyalty'
    ],
    [ClassLevel.S3]: [
      'Happiness and Success', 'Freedom and Responsibility',
      'Search for Meaning', 'Marriage and Family Life',
      'Human Rights and Dignity', 'Authority and Service'
    ],
    [ClassLevel.S4]: [
      'Man in Changing Society', 'Work, Leisure and Money',
      'Law, Order and Justice', 'Peace and Conflict Resolution',
      'Religion and Science', 'Sex and Gender'
    ]
  },
  kiswahili: {
    [ClassLevel.S1]: [
      'Introduction to Kiswahili (Salamu)', 'Nouns (Nomino) and Classes', 
      'Verbs (Vitenzi)', 'Tenses (Nyakati)', 'Common Vocabulary',
      'Pronouns (Viwakilishi)'
    ],
    [ClassLevel.S2]: [
      'Sentence Construction', 'Adjectives and Adverbs',
      'Comprehension (Ufahamu)', 'Composition Writing (Insha)',
      'Proverbs and Idioms (Methali na Nahau)', 'Direct Speech'
    ],
    [ClassLevel.S3]: [
      'Introduction to Literature (Fasihi)', 'Oral Literature (Fasihi Simulizi)',
      'Translation (Tafsiri)', 'Summary Writing (Ufupisho)',
      'Dialogue and Plays', 'Poetry Analysis (Intro)'
    ],
    [ClassLevel.S4]: [
      'Advanced Grammar (Sarufi)', 'Poetry (Ushairi)',
      'Novel Analysis (Riwaya)', 'Social Issues in Literature',
      'Revision and Examination Techniques', 'Creative Writing'
    ]
  }
};

export const getTopicsForSubject = (subjectId: string, classLevel: ClassLevel): Topic[] => {
  const subjectTopics = SYLLABUS_DATA[subjectId]?.[classLevel];
  
  if (subjectTopics) {
    return subjectTopics.map((name, index) => ({
      id: `${subjectId}-${classLevel}-${index}`,
      name: name,
      subjectId,
      classLevel
    }));
  }

  // Fallback for subjects not fully mapped yet
  return Array.from({ length: 8 }).map((_, index) => ({
    id: `${subjectId}-${classLevel}-${index}`,
    name: `Topic ${index + 1} (${classLevel})`,
    subjectId,
    classLevel
  }));
};
