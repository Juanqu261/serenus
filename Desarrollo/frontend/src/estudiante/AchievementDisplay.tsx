import React from 'react';
import { getEarnedAchievements, Achievement } from './lessonData';

const AchievementDisplay: React.FC = () => {
  const achievements = getEarnedAchievements();

  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-4  border border-gray-700 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3 text-yellow-300">Mis Logros</h3>
      <div className="flex flex-wrap gap-4">
        {achievements.map((achievement: Achievement) => (
          <div
            key={achievement.id}
            className="flex flex-col items-center p-3 bg-gray-50 rounded-lg shadow-sm border hover:bg-purple-50 transition duration-200"
          >
            <span className="text-4xl mb-1" title={achievement.name}>{achievement.icon}</span>
            <span className="text-sm font-medium text-gray-700">{achievement.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementDisplay;