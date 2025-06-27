import React, { useState, useEffect, useCallback } from 'react';
import { Quiz, QuizQuestion } from '../types';
import { calculateQuizScore, getQuizResult } from '../data/quizzes';

interface EnhancedQuizProps {
  quiz: Quiz;
  onComplete: (score: number, passed: boolean) => void;
  onBack: () => void;
}

const EnhancedQuiz: React.FC<EnhancedQuizProps> = ({ quiz, onComplete, onBack }: EnhancedQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);

  const handleComplete = useCallback(() => {
    const score = calculateQuizScore(quiz, answers);
    const passed = getQuizResult(quiz, score) === 'pass';
    setShowResults(true);
    onComplete(score, passed);
  }, [quiz, answers, onComplete]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleComplete]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: QuizQuestion) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full text-left p-4 border rounded-lg transition-colors ${
                  answers[question.id] === option
                    ? 'bg-blue-100 border-blue-300'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Введите ваш ответ..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'problem-solving':
        return (
          <div className="space-y-3">
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Введите решение задачи..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-3">
            {['True', 'False'].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full text-left p-4 border rounded-lg transition-colors ${
                  answers[question.id] === option
                    ? 'bg-blue-100 border-blue-300'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (showResults) {
    const score = calculateQuizScore(quiz, answers);
    const passed = getQuizResult(quiz, score) === 'pass';
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-2 sm:px-0">
        <div className="max-w-3xl mx-auto px-2 sm:px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {passed ? '🎉 Поздравляем!' : '📚 Попробуйте ещё раз'}
              </h2>
              <div className={`text-2xl font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {score} из {totalPoints} баллов
              </div>
              <p className="text-gray-600 mt-2">
                {passed ? 'Вы успешно прошли тест!' : `Для прохождения нужно набрать ${quiz.passingScore} баллов`}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Детальный разбор:</h3>
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const correctAnswer = Array.isArray(question.correctAnswer) 
                  ? question.correctAnswer[0] 
                  : question.correctAnswer;
                const isCorrect = userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase();
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Вопрос {index + 1}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? '✓ Правильно' : '✗ Неправильно'}
                      </span>
                    </div>
                    
                    <p className="mb-3">{question.question}</p>
                    
                    <div className="space-y-2">
                      <p><strong>Ваш ответ:</strong> {userAnswer || 'Не отвечено'}</p>
                      <p><strong>Правильный ответ:</strong> {correctAnswer}</p>
                      <p><strong>Объяснение:</strong> {question.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={onBack}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Назад к урокам
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-2 sm:px-0">
      <div className="max-w-3xl mx-auto px-2 sm:px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={onBack}
              className="text-blue-500 hover:text-blue-700"
            >
              ← Назад
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold">{quiz.title}</h2>
              <p className="text-gray-600">
                Вопрос {currentQuestion + 1} из {quiz.questions.length}
              </p>
            </div>

            {timeLeft !== null && (
              <div className="text-right">
                <div className="text-lg font-semibold text-red-600">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-500">Осталось времени</div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{question.question}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty === 'easy' ? 'Легко' :
                 question.difficulty === 'medium' ? 'Средне' : 'Сложно'}
              </span>
            </div>

            {renderQuestion(question)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 text-blue-500 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              ← Предыдущий
            </button>

            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {currentQuestion + 1 === quiz.questions.length ? 'Завершить' : 'Следующий →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedQuiz; 