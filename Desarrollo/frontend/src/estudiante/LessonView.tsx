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

const LessonView: React.FC = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Cargar la lección
  useEffect(() => {
    if (!lessonId) return;
    
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson) {
      setCurrentLesson(lesson);
      // Cargar pregunta inicial
      setCurrentQuestion(lesson.initialQuestion);
      
      // Recuperar progreso guardado
      const allProgress = getLessonProgress();
      const savedProgress = allProgress[lessonId];
      
      if (savedProgress) {
        setCurrentQuestionIndex(savedProgress.questionIndex);
        setAnswers(savedProgress.answers);
        
        // Si ya hay respuestas, cargar la pregunta correspondiente
        if (savedProgress.questionIndex > 0 && savedProgress.answers.length > 0) {
          const lastAnswer = savedProgress.answers[savedProgress.answers.length - 1];
          setCurrentQuestion(getNextQuestion(lessonId, savedProgress.questionIndex, lastAnswer));
        }
      }
    } else {
      // Si no existe la lección, redirigir
      navigate('/estudiante');
    }
  }, [lessonId, navigate]);

  const handleAnswerSubmit = (event: React.FormEvent) => {
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
      
      // Generar la siguiente pregunta basada en la respuesta actual
      const nextQuestion = getNextQuestion(lessonId, nextIndex, currentAnswer);
      setCurrentQuestion(nextQuestion);
      
      setCurrentAnswer(''); // Limpiar el input
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6 text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-700">¡Felicidades!</h1>
        <p className="text-xl mb-6 text-gray-800">Has completado la lección "{currentLesson.name}".</p>
        
        <div className="mb-6 p-6 bg-yellow-50 border border-yellow-300 rounded-lg shadow-md inline-block">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800">¡Logro Desbloqueado!</h3>
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-3">{currentLesson.achievement.icon}</span>
            <span className="font-medium text-lg text-gray-700">{currentLesson.achievement.name}</span>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/estudiante')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-md"
        >
          Volver al Camino
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-2 text-blue-800">{currentLesson.name}</h2>
        <p className="text-sm text-gray-500 mb-6">Pregunta {currentQuestionIndex + 1} de 5</p>

        <p className="text-lg mb-6 text-gray-700">{currentQuestion}</p>

        <form onSubmit={handleAnswerSubmit} className="space-y-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Escribe tu respuesta aquí..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            required
          />
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shadow-md"
            type="submit"
          >
            {currentQuestionIndex === 4 ? 'Finalizar' : 'Siguiente'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LessonView;