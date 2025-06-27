import { QuizQuestion, Quiz } from '../types';

export const quizzes: Quiz[] = [
  // Russian Language Quizzes
  {
    id: 'russian-grammar-quiz-1',
    title: 'Complex Sentences Quiz',
    subjectId: 'russian',
    topicId: 'russian-grammar',
    questions: [
      {
        id: 'russian-1',
        question: 'Какое предложение является сложносочинённым?',
        type: 'multiple-choice',
        options: [
          'Я знаю, что завтра будет контрольная.',
          'Я учусь в школе, и мой брат тоже учится.',
          'Когда я пришёл домой, мама готовила ужин.',
          'Книга, которую я читаю, очень интересная.'
        ],
        correctAnswer: 'Я учусь в школе, и мой брат тоже учится.',
        explanation: 'Сложносочинённые предложения состоят из равноправных частей, соединённых сочинительными союзами (и, а, но, или).',
        points: 10,
        difficulty: 'medium'
      },
      {
        id: 'russian-2',
        question: 'Определите вид придаточного предложения: "Место, где мы встретились, было красивым."',
        type: 'multiple-choice',
        options: ['Определительное', 'Изъяснительное', 'Обстоятельственное', 'Присоединительное'],
        correctAnswer: 'Определительное',
        explanation: 'Придаточное отвечает на вопрос "какое?" и относится к существительному "место".',
        points: 10,
        difficulty: 'medium'
      },
      {
        id: 'russian-3',
        question: 'Расставьте знаки препинания: "Я знаю что ты прав"',
        type: 'fill-blank',
        correctAnswer: 'Я знаю, что ты прав.',
        explanation: 'В сложноподчинённом предложении придаточная часть отделяется запятой.',
        points: 15,
        difficulty: 'easy'
      }
    ],
    passingScore: 25
  },

  // Mathematics Quizzes
  {
    id: 'math-algebra-quiz-1',
    title: 'Square Roots Quiz',
    subjectId: 'math',
    topicId: 'math-algebra',
    questions: [
      {
        id: 'math-1',
        question: 'Вычислите: √16',
        type: 'multiple-choice',
        options: ['2', '4', '8', '16'],
        correctAnswer: '4',
        explanation: '√16 = 4, так как 4² = 16',
        points: 10,
        difficulty: 'easy'
      },
      {
        id: 'math-2',
        question: 'Вычислите: √25',
        type: 'multiple-choice',
        options: ['3', '5', '7', '25'],
        correctAnswer: '5',
        explanation: '√25 = 5, так как 5² = 25',
        points: 10,
        difficulty: 'easy'
      },
      {
        id: 'math-3',
        question: 'Упростите: √8',
        type: 'multiple-choice',
        options: ['2√2', '2√4', '4√2', '8'],
        correctAnswer: '2√2',
        explanation: '√8 = √(4·2) = √4 · √2 = 2√2',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'math-4',
        question: 'Упростите: √18',
        type: 'multiple-choice',
        options: ['2√9', '3√2', '6√3', '18'],
        correctAnswer: '3√2',
        explanation: '√18 = √(9·2) = √9 · √2 = 3√2',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'math-5',
        question: 'Решите уравнение: √x = 7',
        type: 'problem-solving',
        correctAnswer: '49',
        explanation: '√x = 7 → x = 7² = 49',
        points: 15,
        difficulty: 'medium'
      }
    ],
    passingScore: 50
  },

  {
    id: 'math-algebra-quiz-2',
    title: 'Real Numbers Quiz',
    subjectId: 'math',
    topicId: 'math-algebra',
    questions: [
      {
        id: 'math-6',
        question: 'К какому множеству принадлежит число √4?',
        type: 'multiple-choice',
        options: ['Только натуральные', 'Только рациональные', 'Только иррациональные', 'Рациональные и натуральные'],
        correctAnswer: 'Рациональные и натуральные',
        explanation: '√4 = 2, что является и натуральным, и рациональным числом',
        points: 10,
        difficulty: 'medium'
      },
      {
        id: 'math-7',
        question: 'К какому множеству принадлежит число √5?',
        type: 'multiple-choice',
        options: ['Рациональные', 'Иррациональные', 'Целые', 'Натуральные'],
        correctAnswer: 'Иррациональные',
        explanation: '√5 ≈ 2,236... - бесконечная непериодическая дробь, поэтому иррациональное',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'math-8',
        question: 'К какому множеству принадлежит число 0,333...?',
        type: 'multiple-choice',
        options: ['Иррациональные', 'Рациональные', 'Целые', 'Натуральные'],
        correctAnswer: 'Рациональные',
        explanation: '0,333... = 1/3 - периодическая дробь, поэтому рациональное',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'math-9',
        question: 'Какое из чисел является иррациональным?',
        type: 'multiple-choice',
        options: ['√9', '0,5', '√3', '2'],
        correctAnswer: '√3',
        explanation: '√3 ≈ 1,732... - бесконечная непериодическая дробь',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'math-10',
        question: 'Решите уравнение: x² = 49',
        type: 'problem-solving',
        correctAnswer: 'x = ±7',
        explanation: 'x² = 49 → x = ±√49 = ±7',
        points: 15,
        difficulty: 'medium'
      }
    ],
    passingScore: 60
  },

  {
    id: 'math-geometry-quiz-1',
    title: 'Polygons Quiz',
    subjectId: 'math',
    topicId: 'math-geometry',
    questions: [
      {
        id: 'math-11',
        question: 'Сколько сторон у пятиугольника?',
        type: 'multiple-choice',
        options: ['3', '4', '5', '6'],
        correctAnswer: '5',
        explanation: 'Пятиугольник имеет 5 сторон',
        points: 10,
        difficulty: 'easy'
      },
      {
        id: 'math-12',
        question: 'Вычислите сумму углов пятиугольника',
        type: 'problem-solving',
        correctAnswer: '540°',
        explanation: 'Сумма углов n-угольника: (n-2) · 180° = (5-2) · 180° = 3 · 180° = 540°',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'math-13',
        question: 'Сколько диагоналей в четырёхугольнике?',
        type: 'problem-solving',
        correctAnswer: '2',
        explanation: 'Количество диагоналей: n(n-3)/2 = 4(4-3)/2 = 4·1/2 = 2',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'math-14',
        question: 'Вычислите сумму углов шестиугольника',
        type: 'problem-solving',
        correctAnswer: '720°',
        explanation: 'Сумма углов n-угольника: (n-2) · 180° = (6-2) · 180° = 4 · 180° = 720°',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'math-15',
        question: 'Какой многоугольник называется выпуклым?',
        type: 'multiple-choice',
        options: ['Все углы больше 180°', 'Все углы меньше 180°', 'Есть углы больше 180°', 'Все стороны равны'],
        correctAnswer: 'Все углы меньше 180°',
        explanation: 'Выпуклый многоугольник - это многоугольник, у которого все углы меньше 180°',
        points: 10,
        difficulty: 'easy'
      }
    ],
    passingScore: 55
  },

  {
    id: 'math-geometry-quiz-2',
    title: 'Parallelogram Quiz',
    subjectId: 'math',
    topicId: 'math-geometry',
    questions: [
      {
        id: 'math-16',
        question: 'В параллелограмме ABCD сторона AB = 5 см. Чему равна сторона CD?',
        type: 'problem-solving',
        correctAnswer: '5 см',
        explanation: 'В параллелограмме противоположные стороны равны: AB = CD',
        points: 10,
        difficulty: 'easy'
      },
      {
        id: 'math-17',
        question: 'В параллелограмме ABCD угол A = 60°. Чему равен угол C?',
        type: 'problem-solving',
        correctAnswer: '60°',
        explanation: 'В параллелограмме противоположные углы равны: ∠A = ∠C',
        points: 10,
        difficulty: 'easy'
      },
      {
        id: 'math-18',
        question: 'В параллелограмме сумма соседних углов равна:',
        type: 'multiple-choice',
        options: ['90°', '180°', '270°', '360°'],
        correctAnswer: '180°',
        explanation: 'В параллелограмме сумма соседних углов равна 180°',
        points: 10,
        difficulty: 'easy'
      },
      {
        id: 'math-19',
        question: 'Диагонали параллелограмма точкой пересечения:',
        type: 'multiple-choice',
        options: ['Не пересекаются', 'Делятся пополам', 'Перпендикулярны', 'Равны'],
        correctAnswer: 'Делятся пополам',
        explanation: 'Диагонали параллелограмма точкой пересечения делятся пополам',
        points: 10,
        difficulty: 'easy'
      },
      {
        id: 'math-20',
        question: 'Площадь параллелограмма вычисляется по формуле:',
        type: 'multiple-choice',
        options: ['S = a · b', 'S = a · h', 'S = (a + b) · h / 2', 'S = a²'],
        correctAnswer: 'S = a · h',
        explanation: 'Площадь параллелограмма: S = a · h, где a - сторона, h - высота',
        points: 10,
        difficulty: 'medium'
      },
      {
        id: 'math-21',
        question: 'Какой четырёхугольник является параллелограммом с равными сторонами?',
        type: 'multiple-choice',
        options: ['Прямоугольник', 'Ромб', 'Квадрат', 'Трапеция'],
        correctAnswer: 'Ромб',
        explanation: 'Ромб - это параллелограмм с равными сторонами',
        points: 10,
        difficulty: 'medium'
      }
    ],
    passingScore: 50
  },

  // English Language Quizzes
  {
    id: 'english-grammar-quiz-1',
    title: 'Present Perfect vs Past Simple Quiz',
    subjectId: 'english',
    topicId: 'english-grammar',
    questions: [
      {
        id: 'english-1',
        question: 'Choose the correct form: I _____ (never/visit) Paris.',
        type: 'fill-blank',
        correctAnswer: 'have never visited',
        explanation: 'Present Perfect is used for experiences that happened at an unspecified time.',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'english-2',
        question: 'Choose the correct form: I _____ (visit) Paris last summer.',
        type: 'fill-blank',
        correctAnswer: 'visited',
        explanation: 'Past Simple is used for actions that happened at a specific time in the past.',
        points: 15,
        difficulty: 'medium'
      },
      {
        id: 'english-3',
        question: 'Which tense is used for actions that started in the past and continue to the present?',
        type: 'multiple-choice',
        options: ['Past Simple', 'Present Perfect', 'Present Simple', 'Future Simple'],
        correctAnswer: 'Present Perfect',
        explanation: 'Present Perfect is used for actions that started in the past and continue to the present.',
        points: 10,
        difficulty: 'easy'
      }
    ],
    passingScore: 30
  },

  // Physics Quizzes
  {
    id: 'physics-mechanics-quiz-1',
    title: 'Kinematics Quiz',
    subjectId: 'physics',
    topicId: 'physics-mechanics',
    questions: [
      {
        id: 'physics-1',
        question: 'Автомобиль движется со скоростью 20 м/с. Какой путь он пройдёт за 5 секунд?',
        type: 'problem-solving',
        correctAnswer: '100 м',
        explanation: 's = vt = 20 м/с × 5 с = 100 м',
        points: 15,
        difficulty: 'easy'
      },
      {
        id: 'physics-2',
        question: 'Тело движется с ускорением 2 м/с². Какую скорость оно приобретёт за 3 секунды, если начальная скорость равна 5 м/с?',
        type: 'problem-solving',
        correctAnswer: '11 м/с',
        explanation: 'v = v₀ + at = 5 м/с + 2 м/с² × 3 с = 5 + 6 = 11 м/с',
        points: 20,
        difficulty: 'medium'
      },
      {
        id: 'physics-3',
        question: 'Какая формула описывает равномерное прямолинейное движение?',
        type: 'multiple-choice',
        options: ['s = vt', 's = v₀t + at²/2', 'v = v₀ + at', 'F = ma'],
        correctAnswer: 's = vt',
        explanation: 'Для равномерного движения путь равен произведению скорости на время.',
        points: 10,
        difficulty: 'easy'
      }
    ],
    passingScore: 35
  }
];

// Helper functions
export const getQuizzesByTopic = (topicId: string): Quiz[] => {
  return quizzes.filter(quiz => quiz.topicId === topicId);
};

export const getQuizById = (quizId: string): Quiz | undefined => {
  return quizzes.find(quiz => quiz.id === quizId);
};

export const calculateQuizScore = (quiz: Quiz, answers: Record<string, string>): number => {
  let totalScore = 0;
  
  quiz.questions.forEach((question: QuizQuestion) => {
    const userAnswer = answers[question.id];
    const correctAnswer = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer[0] 
      : question.correctAnswer;
    
    if (userAnswer && userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      totalScore += question.points;
    }
  });
  
  return totalScore;
};

export const getQuizResult = (quiz: Quiz, score: number): 'pass' | 'fail' => {
  return score >= quiz.passingScore ? 'pass' : 'fail';
}; 