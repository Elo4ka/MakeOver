import React from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }: ProfileProps) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 rounded-full p-2 shadow transition-all duration-200"
          title="Закрыть профиль"
        >
          <span className="text-xl font-bold">✕</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-4xl">{user.avatar}</span>
                <div>
                  <p className="text-lg font-medium">{user.name}</p>
                  <p className="text-gray-500">Student</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Level</p>
                    <p className="text-lg font-semibold">{user.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-lg font-semibold">{user.experience} XP</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Points</p>
                    <p className="text-lg font-semibold">{user.points} ⭐</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Streak</p>
                    <p className="text-lg font-semibold">{user.streak} days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Lessons Completed</p>
                <p className="text-2xl font-bold text-blue-700">{user.completedLessons.length}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Achievements</p>
                <p className="text-2xl font-bold text-green-700">{user.achievements.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {user.achievements.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.achievements.map((achievement) => (
                <div key={achievement.id} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{achievement.name}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-yellow-600 font-medium">+{achievement.points} points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 