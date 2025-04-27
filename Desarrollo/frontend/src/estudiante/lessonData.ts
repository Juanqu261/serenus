import { sendMessageToIA, resetIAMemory } from '../chat/chatbotService';

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
  // Contexto para que la IA entienda de qué trata la lección
  context: string;
}

export const lessons: Lesson[] = [
  {
    id: 'bosque-calma',
    name: 'Bosque de la Calma',
    description: 'Encuentra la tranquilidad y aprende a manejar el estrés.',
    initialQuestion: 'Hola, ¿cómo estás?',
    achievement: { id: 'ach-bosque', lessonId: 'bosque-calma', name: 'Guardián de la Calma', icon: '🌳' },
    context: 'Esta lección se enfoca en técnicas de manejo del estrés, mindfulness y respiración. El objetivo es ayudar al estudiante a encontrar calma interior.'
  },
  {
    id: 'montana-resiliencia',
    name: 'Montaña de la Resiliencia',
    description: 'Descubre tu fortaleza interior y cómo superar obstáculos.',
    initialQuestion: 'Hola, ¿cómo estás?',
    achievement: { id: 'ach-montana', lessonId: 'montana-resiliencia', name: 'Escalador Resiliente', icon: '⛰️' },
    context: 'Esta lección se enfoca en desarrollar resiliencia, superar obstáculos y encontrar fortaleza interior ante situaciones adversas.'
  },
  {
    id: 'rio-emociones',
    name: 'Río de las Emociones',
    description: 'Aprende a navegar tus sentimientos y emociones.',
    initialQuestion: 'Hola, ¿cómo estás?',
    achievement: { id: 'ach-rio', lessonId: 'rio-emociones', name: 'Navegante Emocional', icon: '💧' },
    context: 'Esta lección se enfoca en la inteligencia emocional, reconocimiento y gestión de emociones para un mejor bienestar psicológico.'
  },
  {
    id: 'jardin-autoestima',
    name: 'Jardín de la Autoestima',
    description: 'Cultiva tu amor propio y confianza personal.',
    initialQuestion: 'Hola, ¿cómo estás?',
    achievement: { id: 'ach-jardin', lessonId: 'jardin-autoestima', name: 'Jardinero de la Confianza', icon: '🌻' },
    context: 'Esta lección se enfoca en construir autoestima, amor propio y confianza personal a través de prácticas y reflexiones positivas.'
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

export const getNextQuestion = async (
  lessonId: string, 
  questionIndex: number, 
  previousAnswer: string, 
  resetMemory: boolean = false,
  isFinalRecommendation: boolean = false
): Promise<string> => {
  const lesson = lessons.find(l => l.id === lessonId);
  
  // Si es la primera pregunta, siempre es "Hola, ¿cómo estás?"
  if (questionIndex === 0) {
    return 'Hola, ¿cómo estás?';
  }
  
  // Si no encontramos la lección o no tiene contexto
  if (!lesson) {
    return 'Hola, ¿cómo puedo ayudarte hoy?';
  }
  
  try {
    // Construir el mensaje para el chatbot
    let prompt;
    
    if (isFinalRecommendation) {
      prompt = `
        [INSTRUCCIONES]: 
        - Has mantenido una conversación con un estudiante sobre bienestar emocional.
        - Basándote en sus respuestas anteriores, proporciona una recomendación final personalizada.
        - Esta es la RECOMENDACIÓN FINAL, por lo que debe ser útil y concisa.
        - Incluye consejos prácticos que el estudiante pueda implementar para mejorar su bienestar.
        - Debes ser empático y positivo, usando un tono motivador.
        - NO use sintaxis de markdown, solo texto plano.
        
        [RESPUESTA PREVIA DEL ESTUDIANTE]: "${previousAnswer}"
        
        [TU RECOMENDACIÓN FINAL]:
      `;
    } else {
      prompt = `
        - Esta es la pregunta número ${questionIndex+1} de un total de 4 en esta lección.

        [RESPUESTA PREVIA DEL ESTUDIANTE]: "${previousAnswer}"

        [TU PREGUNTA]:
      `;
    }
    
    // Enviar al servicio de chatbot, indicando si se debe resetear la memoria
    const nextQuestion = await sendMessageToIA(prompt, resetMemory);
    return nextQuestion.trim() || (isFinalRecommendation ? 
      'Basándome en nuestra conversación, te recomiendo dedicar tiempo a actividades que te hagan sentir bien y que permitan expresar tus emociones de manera saludable. Recuerda que el autocuidado es fundamental para tu bienestar.' : 
      '¿Podrías contarme más sobre eso?');
  } catch (error) {
    console.error('Error al obtener la siguiente pregunta:', error);
    
    if (isFinalRecommendation) {
      return 'Basándome en nuestra conversación, te recomiendo tomar un tiempo para reflexionar sobre tus emociones y practicar técnicas de autocuidado. Recuerda que cuidar de tu bienestar mental es tan importante como cuidar tu salud física.';
    }
    
    // Preguntas de respaldo en caso de error
    const fallbackQuestions = [
      '¿Puedes contarme más sobre cómo te sientes respecto a eso?',
      '¿Qué pensamientos surgen cuando reflexionas sobre este tema?',
      '¿Cómo crees que podrías aplicar lo que estamos discutiendo en tu día a día?'
    ];
    
    return fallbackQuestions[Math.min(questionIndex - 1, fallbackQuestions.length - 1)];
  }
};

// Re-export the resetIAMemory function from chatbotService
export { resetIAMemory };