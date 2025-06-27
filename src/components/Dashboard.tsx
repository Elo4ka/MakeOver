import React from 'react';
import { useNavigate } from 'react-router-dom';
import { subjects } from '../data/educationalData';
import './Dashboard.css';
import { User } from '../types';

const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-8 mt-10">
          <h1
            className="text-6xl md:text-7xl font-extrabold mb-4 tracking-tight"
            style={{
              color: '#111',
              fontFamily: 'Luckiest Guy, Fredoka One, Montserrat, Comic Sans MS, Arial, sans-serif',
              opacity: 0.95,
              textShadow: '0 0 32px #38bdf8, 0 0 64px #38bdf8, 0 0 8px #fff, 0 4px 32px #38bdf8, 0 0 16px #38bdf8',
            }}
          >
            One platform.<br />Millions of ways to engage.
          </h1>
          <p className="text-base md:text-lg text-white font-normal drop-shadow mb-8 mt-10" style={{fontFamily: 'Rubik Mono One, Montserrat, Arial, sans-serif', textShadow: '0 1px 6px #2228'}}>
            Добро пожаловать, {user.name || 'Гость'}! 🎓<br/>Готов к новым знаниям? Выбери предмет для изучения
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl mb-20">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => navigate(`/subject/${subject.id}`)}
              className="relative group bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-xl shadow-2xl p-6 cursor-pointer border-2 border-yellow-400 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-400 text-center transform hover:-translate-y-2 hover:scale-105 lootbox-card"
              style={{
                backdropFilter: 'blur(2px)',
                boxShadow: '0 0 48px 8px #38bdf8cc, 0 0 40px 10px #38bdf8',
                minHeight: '180px',
                maxHeight: '234px',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {/* Pixel grid pattern overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '12px 12px',
                borderRadius: 'inherit',
              }} />
              {/* Inner shadow for depth */}
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
                pointerEvents: 'none',
                borderRadius: 'inherit',
                boxShadow: 'inset 0 0 24px 4px #0002',
              }} />
              {/* Loot box lid (bouncing ball) - ensure always visible and above overlays */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-5 z-50 flex items-center justify-center pointer-events-none" style={{ background: 'none', backgroundColor: 'transparent' }}>
                <span className="text-xl animate-bounce">🪙</span>
              </div>
              {/* Sparkle effect */}
              <span className="absolute top-2 right-4 text-yellow-100 text-lg animate-pulse">✨</span>
              <div className="text-4xl mb-2 mt-4 drop-shadow-lg" style={{zIndex: 3, position: 'relative'}}>{subject.icon}</div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1 tracking-wide" style={{fontFamily: 'Calibri, Arial, sans-serif', letterSpacing: '0.04em', zIndex: 3, position: 'relative'}}>
                {subject.name}
              </h3>
              <div className="mt-1 text-xs text-blue-700 font-bold">
                {(subject.id === 'chemistry' || (subject.topics && subject.topics.length > 0)) && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (subject.topics && subject.topics.length > 0 && subject.topics[0]) {
                        navigate(`/topic/${subject.topics[0].id}`);
                      } else if (subject.id === 'chemistry') {
                        alert('Миссии по химии появятся скоро!');
                      } else {
                        console.log('No topics for this subject');
                      }
                    }}
                    className="mission-btn inline-flex items-center gap-2 px-6 py-2 rounded-full font-extrabold text-base shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                    style={{
                      fontFamily: 'Calibri, Arial, sans-serif',
                      background: 'linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)',
                      color: '#fff',
                      border: '4px solid #38bdf8',
                      boxShadow: '0 0 16px 4px #38bdf8aa, 0 2px 16px #6366f155',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <span role="img" aria-label="missions" style={{ fontSize: '1.5em', marginRight: 4, filter: 'drop-shadow(0 0 4px #6366f1)' }}>🎮</span>
                    Миссии
                    <span className="mission-btn-glow" />
                  </button>
                )}
              </div>
              {/* Loot box bottom shine */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-yellow-100 rounded-b-xl opacity-70 blur-sm z-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 