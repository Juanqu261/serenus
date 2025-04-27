import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  lessons, 
  Lesson, 
  unlockLesson, 
  earnAchievement, 
  saveProgress, 
  getLessonProgress,
  getNextQuestion
} from './lessonData';

// Definir las imágenes de emociones disponibles
const mascotEmotions = [
  '/Alegre.png',
  '/Asombrado.png',
  '/Confiado.png',
  '/Triste.png'
];

// Función para obtener una imagen aleatoria
const getRandomEmotionImage = (): string => {
  const randomIndex = Math.floor(Math.random() * mascotEmotions.length);
  return mascotEmotions[randomIndex];
};

const LessonView: React.FC = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la carga
  const [currentEmotionImage, setCurrentEmotionImage] = useState<string>('');

  // Cargar la lección
  useEffect(() => {
    if (!lessonId) return;
    
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      // Cargar pregunta inicial
      setCurrentQuestion(lesson.initialQuestion);
      // Establecer una imagen de emoción aleatoria inicial
      setCurrentEmotionImage(getRandomEmotionImage());
      
      // Recuperar progreso guardado
      const allProgress = getLessonProgress();
      const savedProgress = allProgress[lessonId];
      
      if (savedProgress) {
        setCurrentQuestionIndex(savedProgress.questionIndex);
        setAnswers(savedProgress.answers);
        
        // Si ya hay respuestas, cargar la pregunta correspondiente
        if (savedProgress.questionIndex > 0 && savedProgress.answers.length > 0) {
          setIsLoading(true); // Activar carga
          const lastAnswer = savedProgress.answers[savedProgress.answers.length - 1];
          
          getNextQuestion(lessonId, savedProgress.questionIndex, lastAnswer)
            .then(nextQuestion => {
              setCurrentQuestion(nextQuestion);
              setCurrentEmotionImage(getRandomEmotionImage()); // Actualizar imagen de emoción
              setIsLoading(false); // Desactivar carga
            })
            .catch(error => {
              console.error('Error al cargar la pregunta guardada:', error);
              setCurrentQuestion('¿Qué te gustaría compartir hoy?');
              setCurrentEmotionImage(getRandomEmotionImage()); // Actualizar imagen de emoción
              setIsLoading(false);
            });
        }
      }
    } else {
      // Si no existe la lección, redirigir
      navigate('/estudiante');
    }
  }, [lessonId, navigate]);

  const handleAnswerSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentLesson || !lessonId || currentAnswer.trim() === '') return;

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    
    // Guardar el progreso
    saveProgress(lessonId, currentQuestionIndex + 1, newAnswers);
    
    if (currentQuestionIndex < 4) { // 0-4 = 5 preguntas
      // Avanzar a la siguiente pregunta
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Activar estado de carga
      setIsLoading(true);
      
      try {
        // Generar la siguiente pregunta basada en la respuesta actual
        const nextQuestion = await getNextQuestion(lessonId, nextIndex, currentAnswer);
        setCurrentQuestion(nextQuestion);
        setCurrentEmotionImage(getRandomEmotionImage()); // Actualizar imagen de emoción
      } catch (error) {
        console.error('Error al obtener la siguiente pregunta:', error);
        setCurrentQuestion('¿Podrías hablarme más sobre eso?');
        setCurrentEmotionImage(getRandomEmotionImage()); // Actualizar imagen de emoción
      } finally {
        setIsLoading(false); // Desactivar carga independientemente del resultado
        setCurrentAnswer(''); // Limpiar el input
      }
    } else {
      // Lección terminada (5 preguntas respondidas)
      setIsCompleted(true);
      
      // Desbloquear siguiente lección (si existe)
      const currentIndex = lessons.findIndex(l => l.id === lessonId);
      if (currentIndex !== -1 && currentIndex + 1 < lessons.length) {
        unlockLesson(lessons[currentIndex + 1].id);
      }
      
      // Otorgar logro
      if (currentLesson.achievement) {
        earnAchievement(currentLesson.achievement);
      }
    }
  };

  if (!currentLesson) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Cargando lección...</div>;
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 p-6 text-center text-white">
        <h1 className="text-3xl font-bold mb-4 text-green-300">¡Felicidades!</h1>
        <p className="text-xl mb-6 text-gray-300">Has completado la lección "{currentLesson.name}".</p>
        
        <div className="mb-6 p-6 bg-yellow-800 border border-yellow-500 rounded-lg shadow-md inline-block">
          <h3 className="text-lg font-semibold mb-3 text-yellow-300">¡Logro Desbloqueado!</h3>
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-3">{currentLesson.achievement.icon}</span>
            <span className="font-medium text-lg text-gray-200">{currentLesson.achievement.name}</span>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/estudiante')}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md"
        >
          Volver al Camino
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-2 text-blue-300">{currentLesson.name}</h2>
        <p className="text-sm text-gray-400 mb-6">Pregunta {currentQuestionIndex + 1} de 5</p>

        {isLoading ? (
          <div className="flex flex-col items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Generando siguiente pregunta...</p>
          </div>
        ) : (
          <>
            <div className="flex items-start mb-6">
              <div className="flex-grow">
                <p className="text-lg text-gray-300">{currentQuestion}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <img
                  src={currentEmotionImage}
                  alt="Mascota"
                  className="w-24 h-24 rounded-full shadow-md"
                />
              </div>
            </div>

            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              <textarea
                className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Escribe tu respuesta aquí..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                required
              />
              <button
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shadow-md"
                type="submit"
              >
                {currentQuestionIndex === 4 ? 'Finalizar' : 'Siguiente'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LessonView;