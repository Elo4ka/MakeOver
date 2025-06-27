import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: User;
  activityPassed: boolean;
  dance?: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, activityPassed, dance }) => {
  const navigate = useNavigate();
  const [reacting, setReacting] = useState(false);

  useEffect(() => {
    if (activityPassed) {
      setReacting(true);
      const timeout = setTimeout(() => setReacting(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [activityPassed]);

  return (
    <header className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">MakeOver Learning</h1>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200"
            onClick={() => navigate('/profile')}
            title="Профиль"
          >
            {user.avatar && user.avatar.startsWith('http') ? (
              <img
                src={user.avatar}
                alt="avatar"
                className={`w-12 h-12 rounded-full ${dance ? 'avatar-dance' : (reacting ? 'avatar-react' : '')}`}
                style={{display: 'inline-block', transition: 'transform 0.3s cubic-bezier(0.4,2,0.6,1)'}}
              />
            ) : (
              <span className={`text-5xl ${dance ? 'avatar-dance' : (reacting ? 'avatar-react' : '')}`} style={{display: 'inline-block', transition: 'transform 0.3s cubic-bezier(0.4,2,0.6,1)'}}>{user.avatar}</span>
            )}
            <div>
              <p
                className="text-lg font-extrabold text-white mb-0"
                style={{
                  fontFamily: 'Luckiest Guy, Rubik Mono One, Press Start 2P, Fredoka One, Montserrat, Comic Sans MS, Arial, sans-serif',
                  letterSpacing: '0.5px',
                  textShadow: '0 2px 12px #38bdf8, 0 1px 8px #2228',
                  color: '#fff',
                  lineHeight: 1.1,
                }}
              >
                Привет, {user.name}!
              </p>
              <p
                className="text-base font-bold mt-1"
                style={{
                  fontFamily: 'Rubik Mono One, Press Start 2P, Fredoka One, Montserrat, Comic Sans MS, Arial, sans-serif',
                  color: '#ffe066',
                  textShadow: '0 1px 6px #2228, 0 0px 8px #38bdf8',
                  letterSpacing: '0.5px',
                }}
              >
                {user.name !== "Гость"
                  ? `Уровень ${user.level} • ${user.points} ⭐`
                  : 'Уровень: —'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 