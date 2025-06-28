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

// Shared type for blanks info
type BlankInfo = { wordIdx: number; partIdx: number; correctLetter: string; before: string; after: string; };

function EWordsFillBlank({
  currentExercise,
  inputs,
  onInputChange,
  onCheck,
  onReset,
  checked,
  firstTryCorrect,
  currentCorrectness,
  allFilled,
  score
}: {
  currentExercise: InteractiveExercise,
  inputs: string[],
  onInputChange: (idx: number, value: string) => void,
  onCheck: () => void,
  onReset: () => void,
  checked: boolean,
  firstTryCorrect: boolean[],
  currentCorrectness: boolean[],
  allFilled: boolean,
  score: number
}) {
  // Defensive checks to prevent runtime errors
  const blanksArr = currentExercise?.content?.blanks;
  const beforeStr = Array.isArray(blanksArr) && blanksArr[0]?.before ? blanksArr[0].before : '';
  const wordsWithBlanks: string[] = beforeStr.split(',').map((w: string) => w.trim());
  
  const correctAnswerArr = Array.isArray(currentExercise?.correctAnswer) ? currentExercise.correctAnswer : [];
  const correctWords: string[] = correctAnswerArr as string[];

  // Precompute a flat array of blanks for robust rendering
  let blanks: BlankInfo[] = [];
  wordsWithBlanks.forEach((blankWord: string, wordIdx: number) => {
    const correctWord = correctWords[wordIdx] || '';
    const parts = blankWord.split('..');
    if (parts.length === 1) return; // no blank
    let letterIndex = 0;
    for (let i = 0; i < parts.length - 1; i++) {
      letterIndex += parts[i].length;
      blanks.push({
        wordIdx,
        partIdx: i,
        correctLetter: correctWord[letterIndex] || '',
        before: parts[i],
        after: parts[i + 1],
      });
    }
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  let blankRenderIdx = 0;
  return (
    <>
      <div className="space-y-6">
        <div className="bg-blue-600 bg-opacity-30 p-6 rounded-lg border-2 border-blue-400">
          {/* Trophy score display above progress bar, inside card area */}
          <div className="w-full flex justify-center mb-2">
            <div className="text-3xl font-extrabold text-yellow-300 flex items-center gap-2 drop-shadow-lg" style={{textShadow: '0 0 16px #facc15, 0 0 8px #fff8'}}>
              <span role="img" aria-label="trophy">🏆</span> {score} баллов
            </div>
          </div>
          {/* Progress bar and capybara */}
          <div className="relative w-full bg-gradient-to-r from-green-400 via-yellow-300 to-pink-400 rounded-full h-4 md:h-5 mt-2 md:mt-4 shadow-lg" style={{overflow: 'visible'}}>
            {/* Capybara emoji avatar */}
            <div
              style={{
                position: 'absolute',
                top: '-2em',
                left: `calc(0% - 1.2em)`,
                transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '2em',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 2px 6px #2228)'
              }}
              aria-label="capybara"
            >
              🦫
            </div>
            <div className="bg-green-400 h-5 rounded-full transition-all duration-500" style={{ width: `0%`, boxShadow: '0 0 12px 4px #22c55e, 0 0 24px 8px #22c55e55' }}></div>
          </div>
          {/* Main exercise content (inputs, etc.) below the progress bar */}
          <div className="space-y-4 mt-6">
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
                        value={inputs[idx] || ''}
                        onChange={e => onInputChange(idx, e.target.value)}
                        data-blank-index={idx}
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-lg border font-medium text-center text-white bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-800 focus:outline-none transition-all duration-200 text-lg md:text-xl font-sans shadow
                          ${(inputs[idx] || '').length === 0 ? 'border-blue-400' : currentCorrectness[idx] ? 'border-green-400 bg-green-700' : 'border-red-400 bg-red-700'}
                          hover:scale-105 focus:scale-105`}
                        maxLength={1}
                        style={{ minWidth: 24, minHeight: 24, boxShadow: '0 1px 4px 0 #312e8133', marginRight: 4, padding: 0 }}
                        autoComplete="off"
                        inputMode="text"
                        pattern="[A-Za-zА-Яа-яЁёІіЎўЭэ]+"
                      />
                      {(inputs[idx] || '').length > 0 && (
                        currentCorrectness[idx] ? <span className="ml-1 text-green-600 font-bold">✔</span> : <span className="ml-1 text-red-600 font-bold">✗</span>
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
              onClick={onCheck}
              className="bg-green-500 text-white w-full sm:w-auto px-2 sm:px-4 py-1 sm:py-1.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl hover:bg-green-400 hover:scale-105 hover:shadow-2xl transition-all duration-200 border-2 border-green-300 mb-2 sm:mb-0 h-8 sm:h-9"
              disabled={!allFilled || checked}
              style={{textShadow: '0 2px 8px #fff8'}}>
              Проверить
            </button>
            <button
              onClick={onReset}
              className="bg-gray-400 text-white w-full sm:w-auto px-2 sm:px-4 py-1 sm:py-1.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl hover:bg-gray-300 hover:scale-105 hover:shadow-2xl transition-all duration-200 border-2 border-gray-300 h-8 sm:h-9"
              style={{textShadow: '0 2px 8px #fff8'}}>
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </>
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

  // For e-words fill-in-the-blanks, manage state at the top level
  const isEWordsTask = currentExercise && (currentExercise.id === 'belarusian-grammar-e-words-1' || currentExercise.id === 'belarusian-grammar-e-words-2');
  let blanks: BlankInfo[] = [];
  let correctWords: string[] = [];
  if (isEWordsTask && currentExercise) {
    // Defensive checks to prevent runtime errors
    const blanksArr = currentExercise?.content?.blanks;
    const beforeStr = Array.isArray(blanksArr) && blanksArr[0]?.before ? blanksArr[0].before : '';
    const wordsWithBlanks: string[] = beforeStr.split(',').map((w: string) => w.trim());
    const correctAnswerArr = Array.isArray(currentExercise?.correctAnswer) ? currentExercise.correctAnswer : [];
    correctWords = correctAnswerArr as string[];
    wordsWithBlanks.forEach((blankWord: string, wordIdx: number) => {
      const correctWord = correctWords[wordIdx] || '';
      const parts = blankWord.split('..');
      if (parts.length === 1) return;
      let blankIndex = 0;
      for (let i = 0; i < parts.length - 1; i++) {
        blankIndex += parts[i].length;
        blanks.push({
          wordIdx,
          partIdx: i,
          correctLetter: correctWord[blankIndex] || '',
          before: parts[i],
          after: parts[i + 1],
        });
        blankIndex += 1;
      }
    });
  }
  const [eInputs, setEInputs] = React.useState<string[]>([]);
  const [firstTryCorrect, setFirstTryCorrect] = React.useState<boolean[]>([]);
  const [attempted, setAttempted] = React.useState<boolean[]>([]);
  const [eWordsTotal, setEWordsTotal] = useState(0);
  const [eChecked, setEChecked] = React.useState(false); // Only for locking after check

  // Calculate current correctness for visual feedback (separate from first-try scoring)
  const currentCorrectness = React.useMemo(() => {
    return eInputs.map((input, idx) => {
      const blank = blanks[idx];
      const correctLetter = blank?.correctLetter || '';
      const userInput = input.trim().toLowerCase();
      const expected = correctLetter.trim().toLowerCase();
      return userInput === expected;
    });
  }, [eInputs, blanks]);

  // Input handler: always called, updates first-try correctness
  const handleEWordsInputChange = (idx: number, value: string) => {
    setEInputs((prev) => {
      const newArr = [...prev];
      newArr[idx] = value;
      return newArr;
    });
    setFirstTryCorrect((prev) => {
      const arr = [...prev];
      // Only set to true if not previously set and this is the first attempt
      if (arr[idx] === false && attempted[idx] === false) {
        const blank = blanks[idx];
        const correctLetter = blank?.correctLetter || '';
        const userInput = value.trim().toLowerCase();
        const expected = correctLetter.trim().toLowerCase();
        arr[idx] = userInput === expected;
      }
      // Note: We don't change firstTryCorrect[idx] to false if user corrects a mistake
      // This preserves the first-try scoring while allowing corrections
      return arr;
    });
    setAttempted((prev) => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });

    // Auto-advance to next blank if current answer is correct
    if (value.trim().length > 0) {
      const blank = blanks[idx];
      const correctLetter = blank?.correctLetter || '';
      const userInput = value.trim().toLowerCase();
      const expected = correctLetter.trim().toLowerCase();
      
      if (userInput === expected && idx < blanks.length - 1) {
        // Move cursor to next blank after a short delay
        setTimeout(() => {
          const nextInput = document.querySelector(`input[data-blank-index="${idx + 1}"]`) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        }, 100);
      }
    }
  };

  // Reset all state on exercise change
  React.useEffect(() => {
    if (isEWordsTask && blanks.length > 0) {
      setEInputs(Array(blanks.length).fill(''));
      setFirstTryCorrect(Array(blanks.length).fill(false));
      setAttempted(Array(blanks.length).fill(false));
      setEChecked(false);
    }
    // eslint-disable-next-line
  }, [currentExercise && currentExercise.id, blanks.length]);

  // Set eWordsTotal at the top level (not inside renderExercise)
  useEffect(() => {
    if (isEWordsTask && blanks.length > 0) {
      setEWordsTotal(blanks.length);
    }
  }, [isEWordsTask, blanks.length, currentExercise && currentExercise.id]);

  // Handler for check (finalize and transfer points)
  const handleEWordsCheck = () => {
    setEChecked(true);
    // Transfer points to profile/parent
    const score = firstTryCorrect.filter(Boolean).length;
    onComplete(score);
  };

  // Handler for reset
  const handleEWordsReset = () => {
    setEInputs(Array(blanks.length).fill(''));
    setFirstTryCorrect(Array(blanks.length).fill(false));
    setAttempted(Array(blanks.length).fill(false));
    setEChecked(false);
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
          alert('handleCheck called');
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
        if (isEWordsTask && blanks.length > 0) {
          const allFilled = eInputs.every(val => val.trim().length > 0);
          const score = firstTryCorrect.filter(Boolean).length;
          return (
            <EWordsFillBlank
              currentExercise={currentExercise}
              inputs={eInputs}
              onInputChange={handleEWordsInputChange}
              onCheck={handleEWordsCheck}
              onReset={handleEWordsReset}
              checked={eChecked}
              firstTryCorrect={firstTryCorrect}
              currentCorrectness={currentCorrectness}
              allFilled={allFilled}
              score={score}
            />
          );
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

  const [showMonster, setShowMonster] = useState(false);
  const [monsterSide, setMonsterSide] = useState<'left' | 'right'>('left');
  const monsterAudioRef = useRef<HTMLAudioElement>(null);

  // Play monster sound when showMonster becomes true
  useEffect(() => {
    if (showMonster && monsterAudioRef.current) {
      monsterAudioRef.current.currentTime = 0;
      monsterAudioRef.current.play();
    }
  }, [showMonster]);

  // Debug log for monster overlay rendering
  useEffect(() => {
    if (showMonster) {
      console.log('MONSTER OVERLAY RENDERED (parent)');
    }
  }, [showMonster]);

  // Monster overlay timeout logic in parent
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (showMonster) {
      timeout = setTimeout(() => {
        console.log('showMonster set to false (timeout, parent)');
        setShowMonster(false);
      }, 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [showMonster]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      <div className="bg-blue-950 bg-opacity-90 rounded-3xl p-2 sm:p-4 md:p-8 shadow-2xl border-4 border-yellow-400/60 mx-auto w-full max-w-[95vw] md:max-w-[70vw]" style={{boxShadow: '0 0 32px 8px #facc15aa, 0 8px 32px 0 #0008'}}>
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="text-white hover:text-blue-300 font-bold px-4 py-2 bg-blue-600 bg-opacity-80 rounded-full hover:bg-red-600 transition-all duration-200"
            aria-label="Назад"
          >
            ←
          </button>
          
          <div className="w-full text-center mb-2 sm:mb-4">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-2 font-mono tracking-wide text-center break-words" style={{letterSpacing: '0.04em'}}>
              {(currentExercise?.title || '').endsWith('э') ? (
                <>
                  {currentExercise?.title?.slice(0, -1)}
                  <span className="text-yellow-300">э</span>
                </>
              ) : (currentExercise?.title || '')}
            </h2>
            <p className="text-indigo-200 text-base md:text-lg font-semibold text-center">
              {currentExercise?.difficulty === 'easy' ? 'Легко' :
               currentExercise?.difficulty === 'medium' ? 'Средне' : 'Сложно'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-600 bg-opacity-30 rounded-lg p-2 sm:p-4 mb-4 sm:mb-6 border-2 border-blue-400 text-center">
          {(currentExercise?.id === 'belarusian-grammar-e-words-1' || currentExercise?.id === 'belarusian-grammar-e-words-2') ? (
            <p className="text-indigo-100 font-semibold text-center text-base md:text-lg">{firstTryCorrect.filter(Boolean).length} / {eWordsTotal} правільна</p>
          ) : (
            <p className="text-white font-semibold text-center text-base md:text-lg">{currentExercise?.instructions}</p>
          )}
        </div>

        {/* Exercise Content */}
        <div className="mb-8">
          {renderExercise()}
        </div>

        {/* Results */}
        {showExplanation && !(currentExercise?.id === 'belarusian-grammar-e-words-1' || currentExercise?.id === 'belarusian-grammar-e-words-2') && (
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
        <div className="flex justify-center items-center mt-8 mb-2 w-full">
          <button
            onClick={onBack}
            className="bg-red-500 text-white px-4 py-1.5 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl hover:bg-red-400 hover:scale-105 hover:shadow-2xl transition-all duration-200 border-2 border-red-300 h-8 sm:h-9"
            style={{textShadow: '0 2px 8px #fff8'}}
          >
            Отмена
          </button>
        </div>
      </div>
      {showMonster && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
          <span style={{fontSize: '8rem', filter: 'drop-shadow(0 0 32px #f00)'}} role="img" aria-label="monster">👹</span>
          <div style={{position: 'absolute', top: 20, left: 20, color: 'yellow', fontWeight: 'bold', fontSize: 32, zIndex: 10000, background: 'rgba(0,0,0,0.7)', padding: '12px 32px', borderRadius: 16, border: '2px solid #fff'}}>
            MONSTER DEBUG: Overlay is rendered
          </div>
        </div>
      )}
      <audio ref={monsterAudioRef} src="/monster.mp3" preload="auto" />
    </div>
  );
};

export default InteractiveExercises;