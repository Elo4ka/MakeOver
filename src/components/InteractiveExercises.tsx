import React, { useState, useEffect, useRef, useMemo } from 'react';
import { InteractiveExercise } from '../types';

interface InteractiveExercisesProps {
  exercise?: InteractiveExercise;
  onComplete: (score: number) => void;
  onBack: () => void;
}

// Shuffle utility (move to top-level)
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function EWordsFillBlank({ currentExercise, setIsCorrect, setShowExplanation, setScore, onPassed, onComplete }: { currentExercise: InteractiveExercise, setIsCorrect: (v: boolean) => void, setShowExplanation: (v: boolean) => void, setScore: (v: number) => void, onPassed?: () => void, onComplete?: (score: number) => void }) {
  // Split the sentence into words with blanks
  const wordsWithBlanks = currentExercise.content.blanks[0].before.split(',').map((w: string) => w.trim());
  const correctWords = (currentExercise.correctAnswer as string[]);

  // Precompute a flat array of blanks for robust rendering
  type BlankInfo = {
    wordIdx: number;
    partIdx: number;
    correctLetter: string;
    before: string;
    after: string;
  };
  let blanks: BlankInfo[] = [];
  wordsWithBlanks.forEach((blankWord: string, wordIdx: number) => {
    const correctWord = correctWords[wordIdx];
    const parts = blankWord.split('..');
    if (parts.length === 1) return; // no blank
    let cursor = 0;
    for (let i = 0; i < parts.length - 1; i++) {
      cursor += parts[i].length;
      blanks.push({
        wordIdx,
        partIdx: i,
        correctLetter: correctWord[cursor] || '',
        before: parts[i],
        after: parts[i + 1],
      });
      cursor += 1;
    }
  });

  // State for all blanks
  const [inputs, setInputs] = useState<string[]>(Array(blanks.length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [animations, setAnimations] = useState<string[]>(Array(blanks.length).fill(''));
  const [checked, setChecked] = useState(false);
  const allFilled = inputs.every(val => val.trim().length > 0);

  // Check correctness for each blank (case/trim insensitive)
  const correctness = inputs.map((input, idx) =>
    input.trim().toLowerCase() === (blanks[idx].correctLetter || '').trim().toLowerCase()
  );

  // Progress indicator
  const correctCount = correctness.filter(Boolean).length;
  const total = blanks.length;

  // Partial credit
  useEffect(() => {
    if (!checked) {
      const partialScore = Math.round((correctCount / total) * currentExercise.points);
      setScore(partialScore);
      setIsCorrect(false);
      setShowExplanation(false);
    }
  }, [inputs, checked, correctCount, currentExercise.points, setScore, setIsCorrect, setShowExplanation, total]);

  // Handle input change, auto-focus next blank, and animate
  const handleInputChange = (idx: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[idx] = value;
    setInputs(newInputs);
    // Animate feedback
    const isNowCorrect = value.trim().toLowerCase() === (blanks[idx].correctLetter || '').trim().toLowerCase();
    setAnimations(anims => {
      const newAnims = [...anims];
      newAnims[idx] = isNowCorrect ? 'animate-bounce' : value.length > 0 ? 'animate-shake' : '';
      return newAnims;
    });
    // Auto-focus next blank if correct
    if (isNowCorrect && idx < total - 1) {
      setTimeout(() => {
        inputRefs.current[idx + 1]?.focus();
      }, 200);
    }
  };

  // Reset
  const handleReset = () => {
    setInputs(Array(blanks.length).fill(''));
    setAnimations(Array(blanks.length).fill(''));
    setChecked(false);
    setShowExplanation(false);
    setIsCorrect(false);
  };

  // Check answers
  const handleCheck = () => {
    setChecked(true);
    const allCorrect = correctness.every(Boolean);
    setIsCorrect(allCorrect);
    setShowExplanation(true);
    const finalScore = allCorrect ? currentExercise.points : Math.round((correctCount / total) * currentExercise.points);
    setScore(finalScore);
    if (allCorrect && onPassed) onPassed();
    if (allCorrect && onComplete) onComplete(finalScore);
  };

  // Render the text with multiple blanks per word using the flat blanks array
  let blankRenderIdx = 0;
  return (
    <div className="space-y-6">
      <div className="bg-blue-600 bg-opacity-30 p-6 rounded-lg border-2 border-blue-400">
        {/* Progress Indicator */}
        <div className="mb-2 text-white font-semibold text-center">
          {correctCount} / {total} правільна
          <div className="relative w-full bg-gray-300 rounded-full h-2 mt-2" style={{overflow: 'visible'}}>
            {/* Capybara emoji avatar */}
            <div
              style={{
                position: 'absolute',
                top: '-1.7em',
                left: `calc(${(correctCount / total) * 100}% - 1em)`,
                transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '2em',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 2px 6px #2228)'
              }}
              aria-label="capybara"
            >
              🦫
            </div>
            <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(correctCount / total) * 100}%`, boxShadow: '0 0 8px 2px #22c55e, 0 0 16px 4px #22c55e55' }}></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {wordsWithBlanks.map((word: string, wordIdx: number) => {
              const parts = word.split('..');
              if (parts.length === 1) {
                return <span key={wordIdx}>{word}{wordIdx < wordsWithBlanks.length - 1 && <span className="text-white text-lg">,</span>}</span>;
              }
              const rendered = parts.map((part, i) => {
                if (i === parts.length - 1) return part;
                const idx = blankRenderIdx;
                blankRenderIdx++;
                return (
                  <React.Fragment key={i}>
                    {part}
                    <input
                      ref={el => inputRefs.current[idx] = el}
                      type="text"
                      value={inputs[idx]}
                      onChange={e => handleInputChange(idx, e.target.value)}
                      className={`w-7 md:w-8 px-0.5 py-0.5 rounded border-2 font-bold text-center text-gray-900 bg-yellow-100 focus:outline-none transition-all duration-200 text-xs md:text-sm
                        ${inputs[idx].length === 0 ? 'border-yellow-400' : correctness[idx] ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}
                        ${animations[idx]}`}
                      maxLength={1}
                      style={{ minWidth: 10, marginRight: 1 }}
                      autoComplete="off"
                    />
                    {inputs[idx].length > 0 && (
                      correctness[idx] ? <span className="ml-1 text-green-600 font-bold">✔</span> : <span className="ml-1 text-red-600 font-bold">✗</span>
                    )}
                  </React.Fragment>
                );
              });
              return <span key={wordIdx}>{rendered}{wordIdx < wordsWithBlanks.length - 1 && <span className="text-white text-lg">,</span>}</span>;
            })}
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleCheck}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-all duration-200"
            disabled={!allFilled || checked}
          >
            Проверить
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-400 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-500 transition-all duration-200"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}

const InteractiveExercises: React.FC<InteractiveExercisesProps> = ({ 
  exercise, 
  onComplete, 
  onBack 
}: InteractiveExercisesProps) => {
  const [currentExercise, setCurrentExercise] = useState<InteractiveExercise | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  // Matching state (for matching exercises only)
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<{ left: number; right: number }[]>([]);
  const [showCheck, setShowCheck] = useState(false);
  // Refs for left/right items
  const leftRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rightRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // SVG lines state
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  // Error state for incorrect match
  const [matchError, setMatchError] = React.useState<string | null>(null);

  // Random order for matching exercise
  const [leftOrder, setLeftOrder] = useState<number[]>([]);
  const [rightOrder, setRightOrder] = useState<number[]>([]);
  useEffect(() => {
    if (currentExercise?.type === 'matching' && currentExercise?.content?.pairs) {
      const indices = currentExercise.content.pairs.map((_: any, idx: number) => idx);
      setLeftOrder(shuffleArray(indices));
      setRightOrder(shuffleArray(indices));
    } else {
      setLeftOrder([]);
      setRightOrder([]);
    }
  }, [currentExercise]);

  // Default exercise if none provided
  const defaultExercise = useMemo<InteractiveExercise>(() => ({
    id: 'default-exercise',
    type: 'drag-drop',
    title: 'Интерактивные упражнения',
    instructions: 'Выберите тип упражнения для начала',
    content: {
      items: ['Математика', 'Русский язык', 'Английский язык', 'Физика'],
      target: 'Предметы'
    },
    correctAnswer: ['Математика', 'Русский язык', 'Английский язык', 'Физика'],
    points: 10,
    difficulty: 'easy'
  }), []);

  useEffect(() => {
    setCurrentExercise(exercise || defaultExercise);
  }, [exercise, defaultExercise]);

  // Calculate line positions after render (for matching)
  useEffect(() => {
    if (!currentExercise || currentExercise.type !== 'matching') return;
    const newLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    matchedPairs.forEach(pair => {
      const leftBtn = leftRefs.current[pair.left];
      const rightBtn = rightRefs.current[pair.right];
      if (leftBtn && rightBtn) {
        const leftRect = leftBtn.getBoundingClientRect();
        const rightRect = rightBtn.getBoundingClientRect();
        const containerRect = leftBtn.parentElement?.parentElement?.getBoundingClientRect();
        if (containerRect) {
          newLines.push({
            x1: leftRect.right - containerRect.left,
            y1: leftRect.top + leftRect.height / 2 - containerRect.top,
            x2: rightRect.left - containerRect.left,
            y2: rightRect.top + rightRect.height / 2 - containerRect.top,
          });
        }
      }
    });
    setLines(newLines);
  }, [matchedPairs, currentExercise]);

  const handleAnswer = (answer: any) => {
    let correct = false;
    if (currentExercise) {
      if (Array.isArray(currentExercise.correctAnswer)) {
        if (currentExercise.type === 'matching') {
          // Compare by value: all user pairs must exist in correctAnswer, regardless of order, normalize text
          const normalize = (s: unknown) => (typeof s === 'string' ? s.trim().toLowerCase() : '');
          const correctPairs = (currentExercise.correctAnswer as { left: string; right: string }[]).map(pair => ({
            left: normalize(pair.left),
            right: normalize(pair.right)
          }));
          const userPairs = (answer as { left: string; right: string }[]).map(pair => ({
            left: normalize(pair.left),
            right: normalize(pair.right)
          }));
          console.log('DEBUG: userPairs', userPairs);
          console.log('DEBUG: correctPairs', correctPairs);
          correct =
            userPairs.length === correctPairs.length &&
            userPairs.every(userPair =>
              correctPairs.some(
                correctPair =>
                  correctPair.left === userPair.left && correctPair.right === userPair.right
              )
            ) &&
            correctPairs.every(correctPair =>
              userPairs.some(
                userPair =>
                  correctPair.left === userPair.left && correctPair.right === userPair.right
              )
            );
        } else {
          correct = JSON.stringify(answer) === JSON.stringify(currentExercise.correctAnswer);
        }
      } else {
        correct = answer === currentExercise.correctAnswer;
      }
    }
    setIsCorrect(correct);
    setShowExplanation(true);
    if (correct) {
      setScore(currentExercise?.points || 0);
    }
  };

  const handleNext = () => {
    if (isCorrect) {
      // For matching exercises, always use the full points if all correct
      if (currentExercise && currentExercise.type === 'matching' && isCorrect) {
        console.log('Calling onComplete with points:', currentExercise.points || score);
        onComplete(currentExercise.points || score);
      } else {
        console.log('Calling onComplete with score:', score);
        onComplete(score);
      }
    } else {
      setShowExplanation(false);
      setIsCorrect(null);
    }
  };

  const renderExercise = () => {
    if (!currentExercise) return null;

    switch (currentExercise.type) {
      case 'drag-drop':
        return (
          <div className="space-y-6">
            <div className="bg-blue-600 bg-opacity-30 p-6 rounded-lg border-2 border-blue-400">
              <h3 className="font-semibold mb-4 text-white text-lg">Перетащите элементы в правильном порядке:</h3>
              <div className="grid grid-cols-2 gap-4">
                {currentExercise.content.items.map((item: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer([item])}
                    className="bg-yellow-500 bg-opacity-80 p-4 rounded-lg border-2 border-yellow-400 hover:bg-red-500 hover:border-red-400 transition-all duration-200 font-bold text-gray-900 hover:scale-105"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'matching': {
        // Color palette for pairs
        const pairColors = [
          'bg-pink-400',
          'bg-blue-400',
          'bg-green-400',
          'bg-yellow-400',
          'bg-purple-400',
          'bg-orange-400',
          'bg-teal-400',
          'bg-red-400',
          'bg-indigo-400',
          'bg-fuchsia-400',
        ];
        // Assign a color index to each matched pair
        const pairColorMap: Record<string, string> = {};
        matchedPairs.forEach((pair, idx) => {
          pairColorMap[`left-${pair.left}`] = pairColors[idx % pairColors.length];
          pairColorMap[`right-${pair.right}`] = pairColors[idx % pairColors.length];
        });
        const handleLeftClick = (index: number) => {
          setSelectedLeft(index);
        };
        const handleRightClick = (index: number) => {
          if (selectedLeft !== null) {
            // Prevent duplicate matches
            if (
              !matchedPairs.some(pair => pair.left === selectedLeft) &&
              !matchedPairs.some(pair => pair.right === index)
            ) {
              // Check if this is a correct match
              const correctPair = currentExercise.content.pairs[selectedLeft].right === currentExercise.content.pairs[index].right;
              if (correctPair) {
                const newPairs = [...matchedPairs, { left: selectedLeft, right: index }];
                setMatchedPairs(newPairs);
                setSelectedLeft(null);
                setMatchError(null);
                // Show check button if all pairs are matched
                if (newPairs.length === currentExercise.content.pairs.length) {
                  setShowCheck(true);
                }
              } else {
                setMatchError('❌ Неправильная пара. Попробуйте ещё раз!');
                setSelectedLeft(null);
              }
            }
          }
        };

        const isMatched = (side: 'left' | 'right', index: number) =>
          matchedPairs.some(pair => pair[side] === index);

        const isSelected = (side: 'left' | 'right', index: number) =>
          side === 'left' ? selectedLeft === index : false;

        const handleCheck = () => {
          // Build user answer as array of {left, right} values (use text, not objects)
          const userAnswer = matchedPairs.map(pair => ({
            left: currentExercise.content.pairs[pair.left].left,
            right: currentExercise.content.pairs[pair.right].right,
          }));
          handleAnswer(userAnswer);
        };

        const handleReset = () => {
          setMatchedPairs([]);
          setShowCheck(false);
          setSelectedLeft(null);
          setIsCorrect(false);
          setMatchError(null);
          setShowExplanation(false);
        };

        return (
          <div className="space-y-6">
            <div className="bg-blue-600 bg-opacity-30 p-6 rounded-lg border-2 border-blue-400 relative" style={{minHeight: 300}}>
              {/* SVG lines */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
                {lines.map((line, idx) => (
                  <line
                    key={idx}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#2563eb"
                    strokeWidth={4}
                    markerEnd="url(#arrowhead)"
                  />
                ))}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                  </marker>
                </defs>
              </svg>
              {/* Error message */}
              {matchError && (
                <div className="mb-4 text-red-600 font-bold text-center animate-pulse">{matchError}</div>
              )}
              <div className="grid grid-cols-2 gap-6 relative z-10">
                {/* Left column */}
                <div className="space-y-4">
                  {leftOrder.map((origIdx, index) => (
                    <button
                      key={origIdx}
                      ref={el => leftRefs.current[origIdx] = el}
                      onClick={() => handleLeftClick(origIdx)}
                      disabled={isMatched('left', origIdx)}
                      className={`w-full p-4 rounded-lg border-2 font-bold text-gray-900 text-left transition-all duration-200
                        ${isSelected('left', origIdx) ? 'border-blue-600 ring-2 ring-blue-400' : 'border-yellow-400'}
                        ${pairColorMap[`left-${origIdx}`] ? pairColorMap[`left-${origIdx}`] + ' bg-opacity-80 border-2 border-white' : 'bg-yellow-500 bg-opacity-80'}
                      `}
                    >
                      {currentExercise.content.pairs[origIdx].left}
                    </button>
                  ))}
                </div>
                {/* Right column */}
                <div className="space-y-4">
                  {rightOrder.map((origIdx, index) => (
                    <button
                      key={origIdx}
                      ref={el => rightRefs.current[origIdx] = el}
                      onClick={() => handleRightClick(origIdx)}
                      disabled={isMatched('right', origIdx) || selectedLeft === null}
                      className={`w-full p-4 rounded-lg border-2 font-bold text-gray-900 text-right transition-all duration-200
                        ${selectedLeft !== null && !isMatched('right', origIdx) ? 'hover:border-blue-600' : ''}
                        ${pairColorMap[`right-${origIdx}`] ? pairColorMap[`right-${origIdx}`] + ' bg-opacity-80 border-2 border-white' : 'bg-yellow-500 bg-opacity-80 border-yellow-400'}
                      `}
                    >
                      {currentExercise.content.pairs[origIdx].right}
                    </button>
                  ))}
                </div>
              </div>
              {/* Show matched pairs visually (optional) */}
              <div className="mt-4 flex flex-wrap gap-2">
                {matchedPairs.map((pair, idx) => (
                  <span key={idx} className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${pairColors[idx % pairColors.length]}`} style={{ textShadow: '1px 1px 4px #444' }}>
                    {currentExercise.content.pairs[pair.left].left} ↔ {currentExercise.content.pairs[pair.right].right}
                  </span>
                ))}
              </div>
              {/* Check and Reset buttons */}
              <div className="mt-6 flex gap-4">
                {showCheck && (
                  <button
                    onClick={handleCheck}
                    className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 transition-all duration-200"
                  >
                    Проверить
                  </button>
                )}
                {matchedPairs.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="bg-gray-400 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-500 transition-all duration-200"
                  >
                    Сбросить
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }

      case 'ordering':
        return (
          <div className="space-y-6">
            <div className="bg-blue-600 bg-opacity-30 p-6 rounded-lg border-2 border-blue-400">
              <h3 className="font-semibold mb-4 text-white text-lg">Расположите элементы в правильном порядке:</h3>
              <div className="space-y-3">
                {currentExercise.content.items.map((item: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer([item])}
                    className="w-full bg-yellow-500 bg-opacity-80 p-4 rounded-lg border-2 border-yellow-400 hover:bg-red-500 hover:border-red-400 transition-all duration-200 font-bold text-gray-900 hover:scale-105 text-left"
                  >
                    {index + 1}. {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'fill-blank': {
        const isEWordsTask = currentExercise.id === 'belarusian-grammar-e-words-1' || currentExercise.id === 'belarusian-grammar-e-words-2';
        if (isEWordsTask) {
          return <EWordsFillBlank currentExercise={currentExercise} setIsCorrect={setIsCorrect} setShowExplanation={setShowExplanation} setScore={setScore} onPassed={handleNext} onComplete={onComplete} />;
        }
        // fallback to default fill-blank logic
        return (
          <div className="space-y-6">
            <div className="bg-blue-600 bg-opacity-30 p-6 rounded-lg border-2 border-blue-400">
              <h3 className="font-semibold mb-4 text-white text-lg">Заполните пропуски:</h3>
              <div className="space-y-4">
                {currentExercise.content.blanks?.map((blank: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-white font-semibold">{blank.before}</span>
                    <input
                      type="text"
                      placeholder="Введите ответ"
                      className="border-2 border-yellow-400 rounded-lg px-4 py-2 flex-1 bg-yellow-500 bg-opacity-80 text-gray-900 font-bold placeholder-gray-700 focus:border-red-400 focus:outline-none"
                      onChange={(e) => handleAnswer(e.target.value)}
                    />
                    <span className="text-white font-semibold">{blank.after}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="text-center">
            <p className="text-white text-lg mb-6">Выберите тип упражнения</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentExercise({...defaultExercise, type: 'drag-drop'})}
                className="bg-blue-600 text-white p-6 rounded-lg border-2 border-blue-400 hover:bg-red-600 hover:border-red-400 transition-all duration-200 font-bold hover:scale-105"
              >
                Перетаскивание
              </button>
              <button
                onClick={() => setCurrentExercise({...defaultExercise, type: 'matching'})}
                className="bg-green-600 text-white p-6 rounded-lg border-2 border-green-400 hover:bg-red-600 hover:border-red-400 transition-all duration-200 font-bold hover:scale-105"
              >
                Сопоставление
              </button>
              <button
                onClick={() => setCurrentExercise({...defaultExercise, type: 'ordering'})}
                className="bg-purple-600 text-white p-6 rounded-lg border-2 border-purple-400 hover:bg-red-600 hover:border-red-400 transition-all duration-200 font-bold hover:scale-105"
              >
                Упорядочивание
              </button>
              <button
                onClick={() => setCurrentExercise({...defaultExercise, type: 'fill-blank'})}
                className="bg-orange-600 text-white p-6 rounded-lg border-2 border-orange-400 hover:bg-red-600 hover:border-red-400 transition-all duration-200 font-bold hover:scale-105"
              >
                Заполнение пропусков
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-transparent rounded-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="text-white hover:text-blue-300 font-bold px-4 py-2 bg-blue-600 bg-opacity-80 rounded-full hover:bg-red-600 transition-all duration-200"
          >
            ← Назад
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">{currentExercise?.title}</h2>
            <p className="text-gray-200">
              {currentExercise?.difficulty === 'easy' ? 'Легко' :
               currentExercise?.difficulty === 'medium' ? 'Средне' : 'Сложно'}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xl font-semibold text-yellow-400">
              {score} баллов
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-600 bg-opacity-30 rounded-lg p-4 mb-6 border-2 border-blue-400">
          <p className="text-white font-semibold">{currentExercise?.instructions}</p>
        </div>

        {/* Exercise Content */}
        <div className="mb-8">
          {renderExercise()}
        </div>

        {/* Results */}
        {showExplanation && (
          <div className={`rounded-lg p-4 mb-6 border-2 ${
            isCorrect ? 'bg-green-600 bg-opacity-30 border-green-400' : 'bg-red-600 bg-opacity-30 border-red-400'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">
                {isCorrect ? '🎉' : '❌'}
              </span>
              <h3 className="font-semibold text-white">
                {isCorrect ? 'Правильно!' : 'Неправильно'}
              </h3>
            </div>
            <p className="text-white">
              {isCorrect 
                ? `Отлично! Вы заработали ${score} баллов.`
                : 'Попробуйте ещё раз.'
              }
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-300 hover:text-white font-bold"
          >
            Отмена
          </button>

          {showExplanation && (
            <button
              onClick={() => { onComplete(score); }}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-all duration-200"
            >
              Завершить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveExercises;