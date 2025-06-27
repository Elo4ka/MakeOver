export interface User {
  id: string;
  name: string;
  level: number;
  experience: number;
  points: number;
  streak: number;
  achievements: Achievement[];
  completedLessons: string[];
  avatar: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  topicId: string;
  order: number;
}

export interface Topic {
  id: string;
  name: string;
  subjectId: string;
  order: number;
  locked: boolean;
  icon: string;
  description: string;
  level: number;
  lessons: Lesson[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  topics: Topic[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string;
  unlocked: boolean;
}

export interface GameState {
  user: User;
  currentLesson: Lesson | null;
  isQuizMode: boolean;
  isExerciseMode: boolean;
  notifications: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-blank' | 'problem-solving' | 'true-false';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  topicId: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number;
}

export interface InteractiveExercise {
  id: string;
  type: 'drag-drop' | 'matching' | 'ordering' | 'fill-blank';
  title: string;
  instructions: string;
  content: any;
  correctAnswer: any;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Shop item type for the shop page
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string; // emoji or image url
} 