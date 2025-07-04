import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subjects } from '../data/educationalData';
import { getQuizzesByTopic } from '../data/quizzes';
import { Topic, Subject, Lesson } from '../types';

interface TopicViewProps {
  onLessonSelect: (lesson: Lesson) => void;
  onStartQuiz: (topicId: string) => void;
  onStartExercise: (topicId: string) => void;
  setShowExercisesModal: React.Dispatch<React.SetStateAction<false | 'exercises' | 'missions'>>;
}

const TopicView: React.FC<TopicViewProps> = ({ 
  onLessonSelect, 
  onStartQuiz, 
  onStartExercise,
  setShowExercisesModal
}: TopicViewProps) => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  
  // Find the topic by searching through all subjects
  let topic: Topic | null = null;
  let subject: Subject | null = null;
  
  for (const s of subjects) {
    const foundTopic = s.topics.find(t => t.id === topicId);
    if (foundTopic) {
      topic = foundTopic;
      subject = s;
      break;
    }
  }
  
  if (!topic || !subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Тема не найдена</h1>
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

  const lessons = topic.lessons;
  const quizzes = getQuizzesByTopic(topic.id);
  const hasQuizzes = quizzes.length > 0;

  const handleLessonClick = (lesson: Lesson) => {
    onLessonSelect(lesson);
    navigate(`/lesson/${lesson.id}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden px-2 sm:px-0">
      <div className="relative z-20 min-h-screen bg-transparent font-extrabold text-white rounded-2xl p-2 sm:p-4" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/subject/${subject!.id}`)}
              className="mb-4 px-6 py-2 bg-blue-600 bg-opacity-80 text-white font-bold rounded-full shadow-lg hover:bg-red-600 hover:scale-105 transition-all duration-200"
            >
              ← Назад к предмету
            </button>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 text-white">{topic.icon}</div>
              <h1 className="text-4xl font-bold text-white mb-4">{topic.id === 'english-grammar' ? 'Grammar' : topic.id === 'russian-grammar' ? 'Грамматика' : topic.name}</h1>
              {topic.id !== 'english-grammar' && topic.id !== 'russian-grammar' && (
                <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-4">
                  {topic.description}
                </p>
              )}
              <div className="flex justify-center space-x-4 text-sm text-blue-200">
                <span>Уровень {topic.level}</span>
                <span>{lessons.length} уроков</span>
                {hasQuizzes && <span>Тесты доступны</span>}
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            {hasQuizzes && (
              <button
                onClick={() => onStartQuiz(topic!.id)}
                className="bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>📝</span>
                <span>Пройти тест</span>
              </button>
            )}
            {subject && subject.id === 'russian' ? (
              <button
                onClick={() => {
                  // Open missions modal/section for Russian
                  window.location.href = `/subject/${subject!.id}`;
                }}
                className="bg-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-purple-600 hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>🚀</span>
                <span>Миссии</span>
              </button>
            ) : subject && subject.id === 'belarusian' ? (
              <button
                onClick={() => setShowExercisesModal('exercises')}
                className="bg-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-purple-600 hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>🦫</span>
                <span>Місіі</span>
              </button>
            ) : (
              <button
                onClick={() => onStartExercise(topic!.id)}
                className="bg-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-purple-600 hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <span>🎮</span>
                <span>Интерактивные упражнения</span>
              </button>
            )}
          </div>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className="relative group bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl p-6 cursor-pointer border-8 border-yellow-500 hover:border-blue-400 transition-all duration-300 hover:shadow-blue-400 text-center transform hover:-translate-y-2 hover:scale-105 lootbox-card"
                style={{backdropFilter: 'blur(2px)', boxShadow: '0 8px 32px 0 rgba(255, 215, 0, 0.5), 0 0 40px 10px #38bdf8', minHeight: '140px', maxHeight: '180px'}}
              >
                {/* Loot box lid */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-3 shadow-lg z-20 flex items-center justify-center"
                  style={{ background: 'none', backgroundColor: 'transparent' }}
                >
                  <span className="text-base animate-bounce">🪙</span>
                </div>
                {/* Sparkle effect */}
                <span className="absolute top-2 right-4 text-yellow-100 text-base animate-pulse">✨</span>
                <div className="text-xl mb-2 mt-2 drop-shadow-lg text-gray-900 font-extrabold">{topic!.id === 'english-grammar' ? `Lesson ${index + 1}` : `Урок ${index + 1}`}</div>
                <h3 className="text-base font-bold text-gray-900 mb-1 tracking-wide" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                  {lesson.title}
                </h3>
                <p className="text-gray-800 text-xs mb-1 font-semibold">
                  Нажмите, чтобы начать изучение
                </p>
                {/* Loot box bottom shine */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-yellow-100 rounded-b-xl opacity-70 blur-sm z-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicView; 