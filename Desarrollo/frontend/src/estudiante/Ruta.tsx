import { Link } from 'react-router-dom';
import { lessons, getUnlockedLessons, Lesson } from './lessonData';
import AchievementDisplay from './AchievementDisplay';

function Ruta() {
  const unlockedLessons = getUnlockedLessons();

  return (
    <div className="p-6 bg-gray-900 text-white">
      <img src="/LogoSerenus.png" alt="logo" className="w-48 h-auto" />
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-300">Tu Camino de Bienestar</h1>
      <p className="text-center text-gray-400 mb-8">
        Completa las lecciones para desbloquear nuevas etapas y ganar logros en tu viaje de autoconocimiento.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson: Lesson, index: number) => {
          const isUnlocked = unlockedLessons.includes(lesson.id);
          const isCompleted = index + 1 < lessons.length 
            ? unlockedLessons.includes(lessons[index + 1].id) 
            : false;

          return (
            <div
              key={lesson.id}
              className={`p-6 rounded-lg shadow-md border transition-all ${
                isUnlocked 
                  ? 'bg-gray-800 hover:shadow-lg cursor-pointer' 
                  : 'bg-gray-700 opacity-70 cursor-not-allowed'
              } ${isCompleted ? 'border-green-500 border-2' : 'border-gray-600'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-200">
                  {lesson.name} {isCompleted && <span className="text-green-400 ml-1">✓</span>}
                </h2>
                <span className="text-3xl">{lesson.achievement.icon}</span>
              </div>
              
              <p className="text-gray-400 mb-4">{lesson.description}</p>
              
              {isUnlocked ? (
                <Link
                  to={`/estudiante/leccion/${lesson.id}`}
                  className={`inline-block font-bold py-2 px-4 rounded transition-colors ${
                    isCompleted 
                      ? 'bg-green-900 text-green-400 hover:bg-green-800 border border-green-500' 
                      : 'bg-blue-700 hover:bg-blue-800 text-white'
                  }`}
                >
                  {isCompleted ? 'Repasar Lección' : 'Comenzar Lección'}
                </Link>
              ) : (
                <div className="inline-block bg-gray-600 text-gray-400 font-bold py-2 px-4 rounded cursor-not-allowed">
                  Bloqueado 🔒
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mostrar los logros conseguidos */}
      <AchievementDisplay />
    </div>
  );
}

export default Ruta;