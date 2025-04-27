export interface Achievement {
  id: string;
  lessonId: string;
  name: string;
  icon: string; // Emoji o clase de icono
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  initialQuestion: string;
  achievement: Achievement;
}

export const lessons: Lesson[] = [
  {
    id: 'bosque-calma',
    name: 'Bosque de la Calma',
    description: 'Encuentra la tranquilidad y aprende a manejar el estrés.',
    initialQuestion: 'Hola, ¿cómo estás?',
    achievement: { id: 'ach-bosque', lessonId: 'bosque-calma', name: 'Guardián de la Calma', icon: '🌳' }
  },
  {
    id: 'montana-resiliencia',
    name: 'Montaña de la Resiliencia',
    description: 'Descubre tu fortaleza interior y cómo superar obstáculos.',
    initialQuestion: 'Hola, ¿cómo estás?',
    achievement: { id: 'ach-montana', lessonId: 'montana-resiliencia', name: 'Escalador Resiliente', icon: '⛰️' }
  },
  {
    id: 'rio-emociones',
    name: 'Río de las Emociones',
    description: 'Aprende a navegar tus sentimientos y emociones.',
    initialQuestion: 'Hola, ¿cómo estás?',
    achievement: { id: 'ach-rio', lessonId: 'rio-emociones', name: 'Navegante Emocional', icon: '💧' }
  },
  {
    id: 'jardin-autoestima',
    name: 'Jardín de la Autoestima',
    description: 'Cultiva tu amor propio y confianza personal.',
    initialQuestion: 'Hola, ¿cómo estás?',
    achievement: { id: 'ach-jardin', lessonId: 'jardin-autoestima', name: 'Jardinero de la Confianza', icon: '🌻' }
  }
];

// --- Gestión de Progreso ---
const UNLOCKED_LESSONS_KEY = 'unlockedLessons';
const EARNED_ACHIEVEMENTS_KEY = 'earnedAchievements';
const LESSON_PROGRESS_KEY = 'lessonProgress';

export const getUnlockedLessons = (): string[] => {
  const stored = localStorage.getItem(UNLOCKED_LESSONS_KEY);
  // Comienza con la primera lección desbloqueada
  const initialUnlocked = [lessons[0]?.id].filter(Boolean) as string[];
  return stored ? JSON.parse(stored) : initialUnlocked;
};

export const unlockLesson = (lessonId: string): void => {
  const unlocked = getUnlockedLessons();
  if (!unlocked.includes(lessonId)) {
    unlocked.push(lessonId);
    localStorage.setItem(UNLOCKED_LESSONS_KEY, JSON.stringify(unlocked));
  }
};

export const getEarnedAchievements = (): Achievement[] => {
  const stored = localStorage.getItem(EARNED_ACHIEVEMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const earnAchievement = (achievement: Achievement): void => {
  const earned = getEarnedAchievements();
  // Evita duplicados
  if (!earned.some(a => a.id === achievement.id)) {
    earned.push(achievement);
    localStorage.setItem(EARNED_ACHIEVEMENTS_KEY, JSON.stringify(earned));
  }
};

// Para guardar progreso de cada lección (qué pregunta va)
export const saveProgress = (lessonId: string, questionIndex: number, answers: string[]): void => {
  const progressData = {
    questionIndex,
    answers,
    lastUpdated: new Date().toISOString()
  };
  
  const allProgress = getLessonProgress();
  allProgress[lessonId] = progressData;
  
  localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(allProgress));
};

export const getLessonProgress = () => {
  const stored = localStorage.getItem(LESSON_PROGRESS_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getNextQuestion = (lessonId: string, questionIndex: number, previousAnswer: string): string => {
  // Preguntas dinámicas basadas en respuestas anteriores
  
  // Bosque de la Calma
  if (lessonId === 'bosque-calma') {
    const questions = [
      'Hola, ¿cómo estás?',
      previousAnswer.toLowerCase().includes('mal') || previousAnswer.toLowerCase().includes('estres') ? 
        '¿Qué situaciones te causan más estrés últimamente?' : 
        '¿Qué actividades te ayudan a sentirte tranquilo?',
      '¿Has probado técnicas de respiración o meditación? ¿Cómo fue tu experiencia?',
      'Imagina que estás en un bosque tranquilo. ¿Qué ves, oyes y sientes?',
      '¿Qué pequeña acción podrías tomar hoy para sentirte más en calma?'
    ];
    return questions[questionIndex] || '';
  }
  
  // Montaña de la Resiliencia
  else if (lessonId === 'montana-resiliencia') {
    const questions = [
      'Hola, ¿cómo estás?',
      previousAnswer.toLowerCase().includes('bien') ? 
        '¿Recuerdas un momento difícil que hayas superado? ¿Qué te ayudó?' : 
        '¿Qué te ayuda a seguir adelante cuando enfrentas dificultades?',
      '¿Qué fortalezas personales has descubierto en momentos difíciles?',
      'Si pudieras dar un consejo a alguien que está pasando por un momento difícil, ¿qué le dirías?',
      '¿Qué pequeño paso podrías dar hoy para fortalecer tu resiliencia?'
    ];
    return questions[questionIndex] || '';
  }
  
  // Río de las Emociones
  else if (lessonId === 'rio-emociones') {
    const questions = [
      'Hola, ¿cómo estás?',
      '¿Qué emoción has sentido con más frecuencia últimamente?',
      previousAnswer.toLowerCase().includes('triste') || previousAnswer.toLowerCase().includes('enojo') ?
        '¿Cómo expresas estas emociones difíciles?' : 
        '¿Cómo celebras y compartes tus emociones positivas?',
      '¿Hay alguna emoción que te resulte difícil de manejar? ¿Cuál y por qué?',
      '¿Qué estrategia podrías practicar para gestionar mejor tus emociones?'
    ];
    return questions[questionIndex] || '';
  }
  
  // Jardín de la Autoestima
  else if (lessonId === 'jardin-autoestima') {
    const questions = [
      'Hola, ¿cómo estás?',
      '¿Qué es lo que más valoras de ti mismo/a?',
      previousAnswer.toLowerCase().includes('no') || previousAnswer.toLowerCase().includes('poco') ?
        '¿Recuerdas algún logro del que te sientas orgulloso/a?' : 
        '¿Cómo alimentas tu confianza en ti mismo/a?',
      '¿Qué mensaje positivo te gustaría recordar en momentos de duda?',
      '¿Qué acción podrías realizar hoy para cuidar tu autoestima?'
    ];
    return questions[questionIndex] || '';
  }
  
  return 'Hola, ¿cómo estás?'; // Pregunta por defecto
};