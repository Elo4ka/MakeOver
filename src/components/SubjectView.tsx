import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjects } from '../data/educationalData';
import { belarusianInteractiveExercises, mathInteractiveExercises, englishInteractiveExercises } from '../data/interactiveExercises';
import { useState } from 'react';

const SubjectView: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  
  const subject = subjects.find(s => s.id === subjectId);
  
  const [showExercisesModal, setShowExercisesModal] = useState<false | 'exercises' | 'missions' | 'math-missions' | 'english-missions' | 'english-units'>('exercises');
  
  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Предмет не найден</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden px-2 sm:px-0">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 px-6 py-2 bg-blue-600 bg-opacity-80 text-white font-bold rounded-full shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-200"
          >
            ← Назад к предметам
          </button>
          
          <div className="text-center">
            <div className="text-6xl mb-4 text-white">{subject.icon}</div>
            <h1 className="text-4xl font-bold text-white mb-4">{subject.id === 'english' ? 'English' : subject.name}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 w-full max-w-6xl mx-auto">
          {subject.id === 'english' ? (
            <>
              {/* Units Card */}
              <div
                className="relative group bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl p-4 sm:p-6 cursor-pointer border-8 border-yellow-500 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-400 text-center transform hover:-translate-y-2 hover:scale-105 lootbox-card"
                style={{backdropFilter: 'blur(2px)', boxShadow: '0 0 48px 8px #38bdf8cc, 0 0 40px 10px #38bdf8', minHeight: '180px'}}
                onClick={() => setShowExercisesModal('english-units')}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-500 rounded-t-xl border-b-4 border-yellow-700 shadow-lg z-20 flex items-center justify-center">
                  <span className="text-lg animate-bounce">📘</span>
                </div>
                <span className="absolute top-2 right-4 text-yellow-100 text-base animate-pulse">✨</span>
                <div className="text-3xl mb-2 mt-2 drop-shadow-lg">📚</div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-1 tracking-wide break-words" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                  Units
                </h3>
                <div className="text-blue-700 font-bold text-base mb-1">{subject.topics.filter(t => t.id.startsWith('english-unit')).length} units</div>
                <div className="mt-1 text-xs text-blue-700 font-bold"></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-100 rounded-b-xl opacity-70 blur-sm z-10" />
              </div>
              {/* Grammar Card */}
              <div
                className="relative group bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl p-4 sm:p-6 cursor-pointer border-8 border-yellow-500 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-400 text-center transform hover:-translate-y-2 hover:scale-105 lootbox-card"
                style={{backdropFilter: 'blur(2px)', boxShadow: '0 0 48px 8px #38bdf8cc, 0 0 40px 10px #38bdf8', minHeight: '180px'}}
                onClick={() => navigate('/topic/english-grammar')}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-500 rounded-t-xl border-b-4 border-yellow-700 shadow-lg z-20 flex items-center justify-center">
                  <span className="text-lg animate-bounce">📖</span>
                </div>
                <span className="absolute top-2 right-4 text-yellow-100 text-base animate-pulse">✨</span>
                <div className="text-3xl mb-2 mt-2 drop-shadow-lg">📝</div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-1 tracking-wide break-words" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                  Grammar
                </h3>
                <div className="text-blue-700 font-bold text-base mb-1">1 lesson</div>
                <div className="mt-1 text-xs text-blue-700 font-bold"></div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-100 rounded-b-xl opacity-70 blur-sm z-10" />
              </div>
              {/* Missions Card (already present) */}
              {subject.id === 'english' && (
                <div
                  className="relative group bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl p-4 sm:p-6 cursor-pointer border-8 border-yellow-500 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-400 text-center transform hover:-translate-y-2 hover:scale-105 lootbox-card"
                  style={{backdropFilter: 'blur(2px)', boxShadow: '0 0 48px 8px #38bdf8cc, 0 0 40px 10px #38bdf8', minHeight: '180px'}}
                  onClick={() => setShowExercisesModal('english-missions')}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-500 rounded-t-xl border-b-4 border-yellow-700 shadow-lg z-20 flex items-center justify-center">
                    <span className="text-lg animate-bounce">🕹️</span>
                  </div>
                  <span className="absolute top-2 right-4 text-yellow-100 text-base animate-pulse">✨</span>
                  <div className="text-3xl mb-2 mt-2 drop-shadow-lg">🎮</div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-1 tracking-wide break-words" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                    {subject.id === 'english' ? 'Missions' : 'Миссии'}
                  </h3>
                  <div className="text-blue-700 font-bold text-base mb-1">{englishInteractiveExercises.length} миссий</div>
                  <div className="mt-1 text-xs text-blue-700 font-bold"></div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-100 rounded-b-xl opacity-70 blur-sm z-10" />
                </div>
              )}
            </>
          ) : (
            subject.topics.map((topic) => (
              <div
                key={topic.id}
                className="relative group bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl p-6 cursor-pointer border-8 border-yellow-500 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-400 text-center transform hover:-translate-y-2 hover:scale-105 lootbox-card"
                onClick={() => navigate(`/topic/${topic.id}`)}
                style={{
                  minHeight: '180px',
                  maxHeight: '234px',
                  position: 'relative',
                  overflow: 'visible',
                  boxShadow: '0 0 48px 8px #38bdf8cc, 0 0 40px 10px #38bdf8',
                }}
              >
                {/* Loot box lid (bouncing ball) */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-500 rounded-t-xl border-b-4 border-yellow-700 shadow-lg z-20 flex items-center justify-center"
                  style={{ background: 'none', backgroundColor: 'transparent' }}
                >
                  <span className="text-lg animate-bounce">🪙</span>
                </div>
                {/* Sparkle effect */}
                <span className="absolute top-2 right-4 text-yellow-100 text-base animate-pulse">✨</span>
                <div className="text-4xl mb-2 mt-4 drop-shadow-lg">{topic.icon}</div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-1 tracking-wide" style={{fontFamily: 'Calibri, Arial, sans-serif', letterSpacing: '0.04em'}}>
                  {topic.id === 'russian-grammar' ? 'Грамматика' : topic.name}
                </h3>
                <div className="flex justify-center items-center gap-2 mt-2">
                  <span className="text-blue-700 font-bold text-base">{topic.lessons.length} уроков</span>
                  <span className="text-blue-700 font-bold text-base">• Уровень {topic.level}</span>
                </div>
                {/* Loot box bottom shine */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-100 rounded-b-xl opacity-70 blur-sm z-10" />
              </div>
            ))
          )}
          {/* Third card for exercises or missions */}
          {subject.id === 'belarusian' && (
            <div
              className="relative group bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl p-4 sm:p-6 cursor-pointer border-8 border-yellow-500 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-400 text-center transform hover:-translate-y-2 hover:scale-105 lootbox-card"
              style={{
                backdropFilter: 'blur(2px)',
                boxShadow: '0 0 48px 8px #38bdf8cc, 0 0 40px 10px #38bdf8',
                minHeight: '180px'
              }}
              onClick={() => setShowExercisesModal('exercises')}
            >
              {/* Loot box lid */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-500 rounded-t-xl border-b-4 border-yellow-700 shadow-lg z-20 flex items-center justify-center">
                <span className="text-lg animate-bounce">🎮</span>
              </div>
              {/* Sparkle effect */}
              <span className="absolute top-2 right-4 text-yellow-100 text-base animate-pulse">✨</span>
              <div className="text-3xl mb-2 mt-2 drop-shadow-lg">🦫</div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1 tracking-wide break-words" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                Місіі
              </h3>
              <div className="text-blue-700 font-bold text-base mb-1">{belarusianInteractiveExercises.length} місіі</div>
              <div className="mt-1 text-xs text-blue-700 font-bold"></div>
              {/* Loot box bottom shine */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-100 rounded-b-xl opacity-70 blur-sm z-10" />
            </div>
          )}
          {subject.id === 'russian' && (
            <div
              className="relative group bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl p-4 sm:p-6 cursor-pointer border-8 border-yellow-500 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-400 text-center transform hover:-translate-y-2 hover:scale-105 lootbox-card"
              style={{
                backdropFilter: 'blur(2px)',
                boxShadow: '0 0 48px 8px #38bdf8cc, 0 0 40px 10px #38bdf8',
                minHeight: '180px'
              }}
              onClick={() => setShowExercisesModal('missions')}
            >
              {/* Loot box lid */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-500 rounded-t-xl border-b-4 border-yellow-700 shadow-lg z-20 flex items-center justify-center">
                <span className="text-lg animate-bounce">🗝️</span>
              </div>
              {/* Sparkle effect */}
              <span className="absolute top-2 right-4 text-yellow-100 text-base animate-pulse">✨</span>
              <div className="text-3xl mb-2 mt-2 drop-shadow-lg">🚀</div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1 tracking-wide break-words" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                Миссии
              </h3>
              <p className="text-gray-800 text-xs mb-1 font-semibold"></p>
              <div className="mt-1 text-xs text-blue-700 font-bold"></div>
              {/* Loot box bottom shine */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-100 rounded-b-xl opacity-70 blur-sm z-10" />
            </div>
          )}
          {subject.id === 'math' && (
            <div
              className="relative group bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl p-4 sm:p-6 cursor-pointer border-8 border-yellow-500 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-400 text-center transform hover:-translate-y-2 hover:scale-105 lootbox-card"
              style={{
                backdropFilter: 'blur(2px)',
                boxShadow: '0 0 48px 8px #38bdf8cc, 0 0 40px 10px #38bdf8',
                minHeight: '180px'
              }}
              onClick={() => setShowExercisesModal('math-missions')}
            >
              {/* Loot box lid */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-500 rounded-t-xl border-b-4 border-yellow-700 shadow-lg z-20 flex items-center justify-center">
                <span className="text-lg animate-bounce">🔢</span>
              </div>
              {/* Sparkle effect */}
              <span className="absolute top-2 right-4 text-yellow-100 text-base animate-pulse">✨</span>
              <div className="text-3xl mb-2 mt-2 drop-shadow-lg">🎮</div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1 tracking-wide break-words" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                Миссии
              </h3>
              <div className="text-blue-700 font-bold text-base mb-1">{mathInteractiveExercises.length} миссий</div>
              <div className="mt-1 text-xs text-blue-700 font-bold"></div>
              {/* Loot box bottom shine */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-100 rounded-b-xl opacity-70 blur-sm z-10" />
            </div>
          )}
        </div>
      </div>
      {/* Modal for exercises or missions */}
      {showExercisesModal === 'exercises' && subject.id === 'belarusian' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-2 sm:px-0">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 font-bold"
              onClick={() => setShowExercisesModal(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Місіі</h2>
            <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2">
              {belarusianInteractiveExercises.map(ex => (
                <button
                  key={ex.id}
                  className="w-full bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-left shadow hover:bg-yellow-200 transition-all duration-200 flex items-center gap-4"
                  onClick={() => {
                    setShowExercisesModal(false);
                    navigate(`/exercise/${ex.id}`);
                  }}
                >
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="font-bold text-gray-900">{ex.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{ex.type === 'fill-blank' ? 'Запоўніце пропускі' : ex.type === 'matching' ? 'Супастаўленне' : 'Іншы тып'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showExercisesModal === 'missions' && subject.id === 'russian' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-2 sm:px-0">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 font-bold"
              onClick={() => setShowExercisesModal(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Миссии</h2>
            <div className="flex items-center justify-center h-32 text-gray-500 text-lg font-semibold"></div>
          </div>
        </div>
      )}
      {showExercisesModal === 'math-missions' && subject.id === 'math' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-2 sm:px-0">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 font-bold"
              onClick={() => setShowExercisesModal(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Миссии</h2>
            <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2">
              {mathInteractiveExercises.map(ex => (
                <button
                  key={ex.id}
                  className="w-full bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-left shadow hover:bg-yellow-200 transition-all duration-200 flex items-center gap-4"
                  onClick={() => {
                    setShowExercisesModal(false);
                    navigate(`/exercise/${ex.id}`);
                  }}
                >
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="font-bold text-gray-900">{ex.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{ex.type === 'fill-blank' ? 'Заполните пропуски' : ex.type === 'matching' ? 'Сопоставление' : ex.type === 'drag-drop' ? 'Перетаскивание' : ex.type === 'ordering' ? 'Упорядочивание' : 'Другой тип'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showExercisesModal === 'english-missions' && subject.id === 'english' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-2 sm:px-0">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 font-bold"
              onClick={() => setShowExercisesModal(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Missions</h2>
            <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2">
              {englishInteractiveExercises.map(ex => (
                <button
                  key={ex.id}
                  className="w-full bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-left shadow hover:bg-yellow-200 transition-all duration-200 flex items-center gap-4"
                  onClick={() => {
                    setShowExercisesModal(false);
                    navigate(`/exercise/${ex.id}`);
                  }}
                >
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="font-bold text-gray-900">{ex.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{ex.type === 'fill-blank' ? 'Заполните пропуски' : ex.type === 'matching' ? 'Сопоставление' : ex.type === 'drag-drop' ? 'Перетаскивание' : ex.type === 'ordering' ? 'Упорядочивание' : 'Другой тип'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Modal for English Units */}
      {showExercisesModal === 'english-units' && subject.id === 'english' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-2 sm:px-0">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500 font-bold"
              onClick={() => setShowExercisesModal(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Units</h2>
            <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto pr-2">
              {subject.topics.filter(t => t.id.startsWith('english-unit')).map(unit => (
                <button
                  key={unit.id}
                  className="w-full bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-left shadow hover:bg-yellow-200 transition-all duration-200 flex items-center gap-4"
                  onClick={() => {
                    setShowExercisesModal(false);
                    navigate(`/topic/${unit.id}`);
                  }}
                >
                  <span className="text-2xl">📘</span>
                  <div>
                    <div className="font-bold text-gray-900">{unit.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{unit.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectView; 