import { sendMessageToBackend, sendMessageToIA } from '../chat/chatbotService';

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

export const getNextQuestion = async (lessonId: string, questionIndex: number, previousAnswer: string): Promise<string> => {
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
    const prompt = `
      [CONTEXTO]: Estás actuando como un asistente psicológico que guía una lección sobre "${lesson.name}". 
      ${lesson.context}
      
      [INSTRUCCIONES]: 
      - Has recibido la respuesta de un estudiante a una pregunta anterior.
      - Genera UNA sola pregunta terapéutica relevante que ayude al estudiante a reflexionar más profundamente.
      - La pregunta debe ser clara, concisa y abierta (no de sí/no).
      - No agregues ningún texto adicional, solo la pregunta.
      - Esta es la pregunta número ${questionIndex+1} de un total de 5 en esta lección.
      
      [RESPUESTA PREVIA DEL ESTUDIANTE]: "${previousAnswer}"
      
      [TU PREGUNTA]:
    `;
    
    // Enviar al servicio de chatbot
    const nextQuestion = await sendMessageToIA(prompt);
    return nextQuestion.trim() || '¿Podrías contarme más sobre eso?';
  } catch (error) {
    console.error('Error al obtener la siguiente pregunta:', error);
    
    // Preguntas de respaldo en caso de error
    const fallbackQuestions = [
      '¿Puedes contarme más sobre cómo te sientes respecto a eso?',
      '¿Qué pensamientos surgen cuando reflexionas sobre este tema?',
      '¿Cómo crees que podrías aplicar lo que estamos discutiendo en tu día a día?',
      '¿Qué estrategias te han funcionado en situaciones similares?'
    ];
    
    return fallbackQuestions[Math.min(questionIndex - 1, fallbackQuestions.length - 1)];
  }
};