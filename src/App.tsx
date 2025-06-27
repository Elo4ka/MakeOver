import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SubjectView from './components/SubjectView';
import TopicView from './components/TopicView';
import LessonView from './components/LessonView';
import EnhancedQuiz from './components/EnhancedQuiz';
import InteractiveExercises from './components/InteractiveExercises';
import Profile from './components/Profile';
import Shop from './components/Shop';
import { GameState, User, Lesson as LessonType, Quiz as QuizType } from './types';
import { getQuizzesByTopic } from './data/quizzes';
import { getRandomExercise, getExerciseById } from './data/interactiveExercises';
import Auth from './components/Auth';
import { saveProgress } from './firebaseHelpers';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';

const initialUser: User = {
  id: '1',
  name: 'Георгий Гришаков',
  level: 8,
  experience: 1250,
  points: 0,
  streak: 5,
  achievements: [],
  completedLessons: [],
  avatar: '🦫'
};

const initialGameState: GameState = {
  user: initialUser,
  currentLesson: null,
  isQuizMode: false,
  isExerciseMode: false,
  notifications: []
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [currentQuiz, setCurrentQuiz] = useState<QuizType | null>(null);
  const navigate = useNavigate();
  const [activityPassed, setActivityPassed] = useState(false);
  const [showDance, setShowDance] = useState(false);
  const lastExerciseMaxPoints = useRef<number | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  // Load game state from localStorage on app start
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setGameState(parsedState);
      } catch (error) {
        console.error('Error loading game state:', error);
      }
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  // Listen for auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        setGameState((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            name: user.displayName || user.email || "Пользователь",
            email: user.email || undefined,
            avatar: user.photoURL || prev.user.avatar,
          },
        }));
      } else {
        // User signed out: set to guest/default user
        setGameState((prev) => ({
          ...prev,
          user: {
            ...initialUser,
            name: "Гость",
            email: undefined,
            avatar: "👤",
          },
        }));
      }
    });
    return () => unsub();
  }, []);

  // Save progress to Firestore
  useEffect(() => {
    if (firebaseUser) {
      try {
        saveProgress(firebaseUser.uid, gameState);
      } catch (error) {
        console.warn('Failed to save progress to Firebase:', error);
      }
    }
  }, [gameState, firebaseUser]);

  const addPoints = (points: number) => {
    setGameState((prev: GameState) => ({
      ...prev,
      user: {
        ...prev.user,
        points: prev.user.points + points,
        experience: prev.user.experience + points * 2
      }
    }));
  };

  const completeLesson = (lessonId: string) => {
    if (!gameState.user.completedLessons.includes(lessonId)) {
      setGameState((prev: GameState) => ({
        ...prev,
        user: {
          ...prev.user,
          completedLessons: [...prev.user.completedLessons, lessonId],
          experience: prev.user.experience + 50,
          points: prev.user.points + 25
        }
      }));
    }
  };

  const handleLessonSelect = (lesson: LessonType) => {
    setGameState((prev: GameState) => ({ ...prev, currentLesson: lesson }));
  };

  const handleLessonComplete = () => {
    if (gameState.currentLesson) {
      completeLesson(gameState.currentLesson.id);
    }
    setGameState((prev: GameState) => ({ ...prev, currentLesson: null }));
    setActivityPassed(true);
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (passed) {
      addPoints(100);
      setActivityPassed(true);
      if (score >= (currentQuiz?.questions.reduce((acc: number, q: any) => acc + (typeof q.points === 'number' ? q.points : 0), 0) || 0)) {
        setShowDance(true);
        setTimeout(() => setShowDance(false), 1200);
      }
    }
    setGameState((prev: GameState) => ({
      ...prev,
      isQuizMode: false,
      currentLesson: null
    }));
    setCurrentQuiz(null);
  };

  const handleExerciseComplete = (score: number) => {
    addPoints(score);
    setGameState((prev: GameState) => ({
      ...prev,
      isExerciseMode: false,
      currentLesson: null
    }));
    setActivityPassed(true);
    if (lastExerciseMaxPoints.current !== null && score === lastExerciseMaxPoints.current) {
      setShowDance(true);
      setTimeout(() => setShowDance(false), 1200);
    }
  };

  const handleStartQuiz = (topicId: string) => {
    const quizzes = getQuizzesByTopic(topicId);
    if (quizzes.length > 0) {
      setCurrentQuiz(quizzes[0]);
      setGameState((prev: GameState) => ({
        ...prev,
        isQuizMode: true,
        currentLesson: null
      }));
    }
  };

  const handleStartExercise = (topicId: string) => {
    setGameState((prev: GameState) => ({
      ...prev,
      isExerciseMode: true,
      currentLesson: null
    }));
    navigate(`/exercises/${topicId}`);
  };

  // Reset activityPassed after animation
  useEffect(() => {
    if (activityPassed) {
      const timeout = setTimeout(() => setActivityPassed(false), 900);
      return () => clearTimeout(timeout);
    }
  }, [activityPassed]);

  // Create a wrapper component for exercises to access URL params
  const ExerciseWrapper: React.FC<{
    onComplete: (score: number) => void;
    onBack: () => void;
  }> = ({ onComplete, onBack }) => {
    const { topicId } = useParams<{ topicId: string }>();
    const selectedExercise = topicId ? getRandomExercise(topicId) : null;

    if (!selectedExercise) {
      return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Упражнения не найдены</h1>
            <button
              onClick={onBack}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Назад
            </button>
          </div>
        </div>
      );
    }

    return (
      <InteractiveExercises 
        exercise={selectedExercise}
        onComplete={(score) => {
          lastExerciseMaxPoints.current = selectedExercise?.points;
          handleExerciseComplete(score);
        }}
        onBack={onBack}
      />
    );
  };

  // Add a wrapper for /exercise/:exerciseId
  const SingleExerciseWrapper: React.FC<{ onComplete: (score: number) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
    const { exerciseId } = useParams<{ exerciseId: string }>();
    const exercise = exerciseId ? getExerciseById(exerciseId) : null;
    if (!exercise) {
      return (
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Упражнение не найдено</h1>
            <button
              onClick={onBack}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Назад
            </button>
          </div>
        </div>
      );
    }
    return (
      <InteractiveExercises
        exercise={exercise}
        onComplete={(score) => {
          lastExerciseMaxPoints.current = exercise?.points;
          handleExerciseComplete(score);
        }}
        onBack={onBack}
      />
    );
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      // handle success (e.g., redirect, update state)
    } catch (error) {
      // handle error (e.g., show message)
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute top-4 right-4 z-50">
        <Auth user={firebaseUser} />
      </div>
      <Header user={gameState.user} activityPassed={activityPassed} dance={showDance} />
      <div className="pt-0">
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/" 
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            } 
          />
          
          <Route 
            path="/subject/:subjectId" 
            element={
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative min-h-screen w-full overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    poster="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
                  >
                    <source src="/videos/minecraft-parkour.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
                  <div className="relative z-20 min-h-screen bg-transparent font-extrabold text-white rounded-2xl p-4" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                    <SubjectView />
                  </div>
                </div>
              </motion.div>
            } 
          />
          
          <Route 
            path="/topic/:topicId" 
            element={
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative min-h-screen w-full overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    poster="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
                  >
                    <source src="/videos/minecraft-parkour.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
                  <div className="relative z-20 min-h-screen bg-transparent font-extrabold text-white rounded-2xl p-4" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                    <TopicView 
                      onLessonSelect={handleLessonSelect}
                      onStartQuiz={handleStartQuiz}
                      onStartExercise={handleStartExercise}
                    />
                  </div>
                </div>
              </motion.div>
            } 
          />
          
          <Route 
            path="/lesson/:lessonId" 
            element={
              gameState.currentLesson ? (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative min-h-screen w-full overflow-hidden">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0"
                      poster="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
                    >
                      <source src="/videos/minecraft-parkour.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
                    <div className="relative z-20 min-h-screen bg-transparent font-extrabold text-white rounded-2xl p-4" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                      <LessonView 
                        lesson={gameState.currentLesson}
                        onComplete={handleLessonComplete}
                        onBack={() => setGameState((prev: GameState) => ({ ...prev, currentLesson: null }))}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/quiz/:quizId" 
            element={
              gameState.isQuizMode && currentQuiz ? (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative min-h-screen w-full overflow-hidden">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0"
                      poster="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
                    >
                      <source src="/videos/minecraft-parkour.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
                    <div className="relative z-20 min-h-screen bg-transparent font-extrabold text-white rounded-2xl p-4" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                      <EnhancedQuiz 
                        quiz={currentQuiz}
                        onComplete={handleQuizComplete}
                        onBack={() => setGameState((prev: GameState) => ({ ...prev, isQuizMode: false, currentLesson: null }))}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/exercises/:topicId" 
            element={
              gameState.isExerciseMode ? (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative min-h-screen w-full overflow-hidden">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0"
                      poster="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
                    >
                      <source src="/videos/minecraft-parkour.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
                    <div className="relative z-20 min-h-screen bg-transparent font-extrabold text-white rounded-2xl p-4" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                      <ExerciseWrapper 
                        onComplete={handleExerciseComplete}
                        onBack={() => setGameState((prev: GameState) => ({ ...prev, isExerciseMode: false, currentLesson: null }))}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          <Route 
            path="/exercise/:exerciseId" 
            element={
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative min-h-screen w-full overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    poster="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
                  >
                    <source src="/videos/minecraft-parkour.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
                  <div className="relative z-20 min-h-screen bg-transparent font-extrabold text-white rounded-2xl p-4" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                    <SingleExerciseWrapper
                      onComplete={handleExerciseComplete}
                      onBack={() => navigate(-1)}
                    />
                  </div>
                </div>
              </motion.div>
            }
          />
          
          <Route 
            path="/profile" 
            element={
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative min-h-screen w-full overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    poster="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
                  >
                    <source src="/videos/minecraft-parkour.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
                  <div className="relative z-20 min-h-screen bg-transparent font-extrabold text-white rounded-2xl p-4" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                    <Profile user={gameState.user} />
                  </div>
                </div>
              </motion.div>
            } 
          />
          
          <Route
            path="/shop"
            element={
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative min-h-screen w-full overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    poster="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
                  >
                    <source src="/videos/minecraft-parkour.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />
                  <div className="relative z-20 min-h-screen bg-transparent font-extrabold text-white rounded-2xl p-4" style={{fontFamily: 'Montserrat, Fredoka One, Arial, sans-serif'}}>
                    <Shop
                      userPoints={gameState.user.points}
                      onBuy={(item) => setGameState((prev: GameState) => ({
                        ...prev,
                        user: {
                          ...prev.user,
                          points: prev.user.points - item.price
                        }
                      }))}
                    />
                  </div>
                </div>
              </motion.div>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      </div>
    </div>
  );
};

export default App; 