import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lesson } from '../types';
import { subjects } from '../data/educationalData';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: () => void;
  onBack: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, onComplete, onBack }: LessonViewProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  // Simple markdown-like rendering for the content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Handle headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">{line.slice(2, -2)}</h3>;
      }
      
      // Handle bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="mb-3 text-gray-700">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\)/.test(line)) {
        return <p key={index} className="mb-2 text-gray-700 pl-4">{line}</p>;
      }
      
      // Handle bullet points
      if (line.startsWith('- ')) {
        return <p key={index} className="mb-2 text-gray-700 pl-4">• {line.slice(2)}</p>;
      }
      
      // Handle examples
      if (line.startsWith('Пример:') || line.startsWith('Example:')) {
        return <p key={index} className="mb-3 text-blue-600 font-medium">{line}</p>;
      }
      
      // Handle tasks/assignments
      if (line.startsWith('**Задание:**') || line.startsWith('**Task:**')) {
        return <h4 key={index} className="text-lg font-semibold text-green-700 mt-6 mb-3">{line.slice(3, -3)}</h4>;
      }
      
      // Handle formulas
      if (line.includes('²') || line.includes('=') || line.includes('+') || line.includes('×')) {
        return <p key={index} className="mb-3 text-gray-700 font-mono bg-gray-100 p-2 rounded">{line}</p>;
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      
      // Regular text
      return <p key={index} className="mb-3 text-gray-700">{line}</p>;
    });
  };

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => {
              if (lesson.topicId === 'belarusian-grammar') {
                navigate('/topic/belarusian-grammar');
              } else {
                onBack();
              }
            }}
            className="text-white hover:text-white mb-4 flex items-center"
          >
            ← Назад к урокам
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1
                className="text-3xl font-bold text-gray-800 mb-4"
                style={{
                  background: 'linear-gradient(90deg, #fde047 0%, #facc15 100%)',
                  borderRadius: '1rem',
                  padding: '0.5em 1.5em',
                  boxShadow: '0 0 16px 4px #38bdf8aa, 0 2px 16px #6366f155',
                  display: 'inline-block',
                  color: '#222',
                  fontFamily: 'Calibri, Arial, sans-serif',
                  textShadow: '0 2px 8px #fff8, 0 1px 8px #38bdf8',
                }}
              >
                {lesson.title}
              </h1>
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
                <span>📚 Урок</span>
                <span>⏱️ ~15 минут</span>
                <span>🎯 {lesson.order} из серии</span>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: isCompleted ? '100%' : '0%' }}
              ></div>
            </div>

            {/* Lesson Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Змест урока:</h3>
                {renderContent(lesson.content)}
              </div>
            </div>

            {/* Interactive Elements */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                {(() => {
                  // Find the subject for this lesson
                  const subj = subjects.find(s => s.id === lesson.subjectId);
                  if (subj && subj.id === 'belarusian') {
                    return 'Што важна запомніць:';
                  }
                  return '💡 Ключевые моменты:';
                })()}
              </h3>
              <ul className="space-y-2 text-blue-700">
                {(() => {
                  // First Belarusian lesson: special bullet
                  if (lesson.id === 'belarusian-grammar-0') {
                    return [
                      <li key="special">• Выключэнні: філе, сальта-мартале, піке, камюніке</li>,
                      <li key="2">• У запазычаных словах напісанне э і а не пад націскам пасля іншых зычных рэгулюецца слоўнікам: <br/>панэль, тунэль, але: шынель, сектанцкі<br/>Зэльва, але: Зеўс і да т. п.</li>,
                      <li key="3">• Ваўласных імёнах неславянскага паходжання захоўваюцца -эль, -эр: Ландэр, Юпітэр, Одэр, Пітэр.</li>
                    ];
                  }
                  // Default bullets
                  return [
                    <li key="1">• РАДЫЁ- — РАДЫЕ- (РАДЫЯ-)<br/>Радыё- — першая частка складаных слоў у значэнні' які мае адносіны да радыё': <br/>радыёвузел, радыётэхніка, радыёсувязь, радыёстанцыя.<br/>Радые- — першая частка складаных слоў у значэнні 'які адносіццада радыю, радыяцыі': <br/>радыеізатопы, радыеактыўнасць, радыетэрапія.<br/>У першым складзе перад націскам у гэтым выпадку пішаццая: радыялогія, радыяхімія, радыяграфія</li>
                  ];
                })()}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {isCompleted ? '✅ Урок завершён!' : 'Готов к изучению'}
              </div>
              
              <button
                onClick={handleComplete}
                disabled={isCompleted}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                }`}
              >
                {isCompleted 
                  ? 'Завершено!' 
                  : (subjects.find(s => s.id === lesson.subjectId && s.id === 'belarusian') ? 'Скончыць урок' : 'Завершить урок')}
              </button>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {isCompleted && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🎉 Отлично! Что дальше?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="text-2xl mb-2">📝</div>
                <div className="font-medium">Пройти тест</div>
                <div className="text-sm text-gray-600">Проверить знания</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors">
                <div className="text-2xl mb-2">🎮</div>
                <div className="font-medium">Упражнения</div>
                <div className="text-sm text-gray-600">Интерактивная практика</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors">
                <div className="text-2xl mb-2">📚</div>
                <div className="font-medium">Следующий урок</div>
                <div className="text-sm text-gray-600">Продолжить обучение</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonView; 