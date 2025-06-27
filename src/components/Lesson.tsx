import React from 'react';
import { Lesson as LessonType } from '../types';

interface LessonProps {
  lesson: LessonType | null;
  onComplete: (lessonId: string) => void;
  onBack: () => void;
}

const Lesson: React.FC<LessonProps> = ({ lesson, onComplete, onBack }: LessonProps) => {
  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">No lesson selected</p>
          <button 
            onClick={onBack}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        </div>
        
        <div className="prose max-w-none mb-8">
          <div className="text-gray-700 leading-relaxed">
            {lesson.content}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onComplete(lesson.id)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Mark as Complete ✅
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lesson; 