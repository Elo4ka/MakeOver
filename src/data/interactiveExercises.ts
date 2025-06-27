import { InteractiveExercise } from '../types';

export const mathInteractiveExercises: InteractiveExercise[] = [
  // Square Roots Exercises
  {
    id: 'math-sqrt-calc-1',
    type: 'drag-drop',
    title: 'Вычисление квадратных корней',
    instructions: 'Перетащите числа в правильном порядке для вычисления квадратных корней',
    content: {
      items: ['√16 = 4', '√25 = 5', '√36 = 6', '√49 = 7', '√64 = 8', '√81 = 9', '√100 = 10'],
      target: 'Правильные вычисления'
    },
    correctAnswer: ['√16 = 4', '√25 = 5', '√36 = 6', '√49 = 7', '√64 = 8', '√81 = 9', '√100 = 10'],
    points: 15,
    difficulty: 'easy'
  },
  {
    id: 'math-sqrt-simplify-1',
    type: 'matching',
    title: 'Упрощение выражений с квадратными корнями',
    instructions: 'Соедините выражения с их упрощёнными формами',
    content: {
      pairs: [
        { left: '√8', right: '2√2' },
        { left: '√12', right: '2√3' },
        { left: '√18', right: '3√2' },
        { left: '√20', right: '2√5' },
        { left: '√32', right: '4√2' },
        { left: '√50', right: '5√2' }
      ]
    },
    correctAnswer: [
      { left: '√8', right: '2√2' },
      { left: '√12', right: '2√3' },
      { left: '√18', right: '3√2' },
      { left: '√20', right: '2√5' },
      { left: '√32', right: '4√2' },
      { left: '√50', right: '5√2' }
    ],
    points: 20,
    difficulty: 'medium'
  },
  {
    id: 'math-sqrt-equations-1',
    type: 'fill-blank',
    title: 'Решение уравнений с квадратными корнями',
    instructions: 'Решите уравнения, введя правильные ответы',
    content: {
      blanks: [
        { before: '√x = 5, тогда x =', after: '' },
        { before: '√x = 7, тогда x =', after: '' },
        { before: 'x² = 16, тогда x =', after: '' },
        { before: 'x² = 25, тогда x =', after: '' }
      ]
    },
    correctAnswer: ['25', '49', '±4', '±5'],
    points: 20,
    difficulty: 'medium'
  },

  // Real Numbers Exercises
  {
    id: 'math-number-sets-1',
    type: 'ordering',
    title: 'Числовые множества',
    instructions: 'Расположите числовые множества в порядке расширения (от меньшего к большему)',
    content: {
      items: [
        'Натуральные числа (N)',
        'Целые числа (Z)', 
        'Рациональные числа (Q)',
        'Действительные числа (R)'
      ]
    },
    correctAnswer: [
      'Натуральные числа (N)',
      'Целые числа (Z)', 
      'Рациональные числа (Q)',
      'Действительные числа (R)'
    ],
    points: 15,
    difficulty: 'easy'
  },
  {
    id: 'math-number-classification-1',
    type: 'matching',
    title: 'Классификация чисел',
    instructions: 'Соедините числа с их типами',
    content: {
      pairs: [
        { left: '√4', right: 'Рациональное' },
        { left: '√5', right: 'Иррациональное' },
        { left: '0,333...', right: 'Рациональное' },
        { left: 'π', right: 'Иррациональное' },
        { left: '2', right: 'Рациональное' },
        { left: '√3', right: 'Иррациональное' }
      ]
    },
    correctAnswer: [
      { left: '√4', right: 'Рациональное' },
      { left: '√5', right: 'Иррациональное' },
      { left: '0,333...', right: 'Рациональное' },
      { left: 'π', right: 'Иррациональное' },
      { left: '2', right: 'Рациональное' },
      { left: '√3', right: 'Иррациональное' }
    ],
    points: 20,
    difficulty: 'medium'
  },

  // Polygons Exercises
  {
    id: 'math-polygons-angles-1',
    type: 'fill-blank',
    title: 'Сумма углов многоугольников',
    instructions: 'Вычислите сумму углов многоугольников',
    content: {
      blanks: [
        { before: 'Сумма углов треугольника:', after: '°' },
        { before: 'Сумма углов четырёхугольника:', after: '°' },
        { before: 'Сумма углов пятиугольника:', after: '°' },
        { before: 'Сумма углов шестиугольника:', after: '°' }
      ]
    },
    correctAnswer: ['180', '360', '540', '720'],
    points: 20,
    difficulty: 'medium'
  },
  {
    id: 'math-polygons-diagonals-1',
    type: 'matching',
    title: 'Количество диагоналей в многоугольниках',
    instructions: 'Соедините многоугольники с количеством их диагоналей',
    content: {
      pairs: [
        { left: 'Треугольник', right: '0 диагоналей' },
        { left: 'Четырёхугольник', right: '2 диагонали' },
        { left: 'Пятиугольник', right: '5 диагоналей' },
        { left: 'Шестиугольник', right: '9 диагоналей' },
        { left: 'Семиугольник', right: '14 диагоналей' }
      ]
    },
    correctAnswer: [
      { left: 'Треугольник', right: '0 диагоналей' },
      { left: 'Четырёхугольник', right: '2 диагонали' },
      { left: 'Пятиугольник', right: '5 диагоналей' },
      { left: 'Шестиугольник', right: '9 диагоналей' },
      { left: 'Семиугольник', right: '14 диагоналей' }
    ],
    points: 20,
    difficulty: 'medium'
  },

  // Parallelogram Exercises
  {
    id: 'math-parallelogram-properties-1',
    type: 'drag-drop',
    title: 'Свойства параллелограмма',
    instructions: 'Перетащите свойства в правильном порядке',
    content: {
      items: [
        'Противоположные стороны равны',
        'Противоположные углы равны',
        'Диагонали делятся пополам',
        'Сумма соседних углов 180°'
      ],
      target: 'Основные свойства'
    },
    correctAnswer: [
      'Противоположные стороны равны',
      'Противоположные углы равны',
      'Диагонали делятся пополам',
      'Сумма соседних углов 180°'
    ],
    points: 15,
    difficulty: 'easy'
  },
  {
    id: 'math-parallelogram-calc-1',
    type: 'fill-blank',
    title: 'Вычисления в параллелограмме',
    instructions: 'Решите задачи с параллелограммом',
    content: {
      blanks: [
        { before: 'Если AB = 6 см, то CD =', after: 'см' },
        { before: 'Если ∠A = 70°, то ∠C =', after: '°' },
        { before: 'Если ∠A = 60°, то ∠B =', after: '°' },
        { before: 'Если диагональ AC = 10 см, то AO =', after: 'см' }
      ]
    },
    correctAnswer: ['6', '70', '120', '5'],
    points: 20,
    difficulty: 'medium'
  },
  {
    id: 'math-parallelogram-types-1',
    type: 'matching',
    title: 'Виды параллелограммов',
    instructions: 'Соедините определения с названиями фигур',
    content: {
      pairs: [
        { left: 'Параллелограмм с равными сторонами', right: 'Ромб' },
        { left: 'Параллелограмм с прямыми углами', right: 'Прямоугольник' },
        { left: 'Параллелограмм с равными сторонами и прямыми углами', right: 'Квадрат' },
        { left: 'Четырёхугольник с одной парой параллельных сторон', right: 'Трапеция' }
      ]
    },
    correctAnswer: [
      { left: 'Параллелограмм с равными сторонами', right: 'Ромб' },
      { left: 'Параллелограмм с прямыми углами', right: 'Прямоугольник' },
      { left: 'Параллелограмм с равными сторонами и прямыми углами', right: 'Квадрат' },
      { left: 'Четырёхугольник с одной парой параллельных сторон', right: 'Трапеция' }
    ],
    points: 15,
    difficulty: 'easy'
  },

  // --- Lesson 2: Square Root Extraction (from image) ---
  {
    id: 'math-algebra-2-sqrt-extract',
    type: 'fill-blank',
    title: 'Извлечение квадратного корня',
    instructions: 'Выполните извлечение квадратного корня:',
    content: {
      blanks: [
        { before: 'а) √1/16 =', after: '' },
        { before: 'б) √4/25 =', after: '' },
        { before: 'в) √49/9 =', after: '' },
        { before: 'г) √289/16 =', after: '' },
        { before: 'д) √2 1/4 =', after: '' },
        { before: 'е) √5 4/9 =', after: '' },
        { before: 'ж) √1 24/25 =', after: '' },
        { before: 'з) √4 21/25 =', after: '' }
      ]
    },
    correctAnswer: ['1/4', '2/5', '7/3', '17/4', '3/2', '7/3', '7/5', '11/5'],
    points: 20,
    difficulty: 'medium'
  },
  {
    id: 'math-algebra-2-expr-eval',
    type: 'fill-blank',
    title: 'Вычисление выражений при x=48, y=49',
    instructions: 'Вычислите при x = 48, y = 49 значение выражения:',
    content: {
      blanks: [
        { before: '√(y - x) =', after: '' },
        { before: 'x · √y =', after: '' },
        { before: '√((x - y)^2) =', after: '' },
        { before: '-√((x + 1) · y) =', after: '' }
      ]
    },
    correctAnswer: ['1', '336', '1', '-49'],
    points: 20,
    difficulty: 'medium'
  },
  {
    id: 'math-algebra-2-compare',
    type: 'matching',
    title: 'Сравнение чисел',
    instructions: 'Сравните числа (выберите знак сравнения):',
    content: {
      pairs: [
        { left: '√169', right: '√144' },
        { left: '√25', right: '6' },
        { left: '1', right: '√(1 19/81)' },
        { left: '1/2', right: '√(49/64)' },
        { left: '√2,25', right: '√(1 15/49)' }
      ]
    },
    correctAnswer: [
      { left: '√169', right: '√144', sign: '>' },
      { left: '√25', right: '6', sign: '<' },
      { left: '1', right: '√(1 19/81)', sign: '<' },
      { left: '1/2', right: '√(49/64)', sign: '=' },
      { left: '√2,25', right: '√(1 15/49)', sign: '>' }
    ],
    points: 20,
    difficulty: 'medium'
  },
  {
    id: 'math-algebra-2-expr-value',
    type: 'fill-blank',
    title: 'Найдите значение выражения',
    instructions: 'Вычислите значение выражения:',
    content: {
      blanks: [
        { before: '√25 + √16 =', after: '' },
        { before: '√324 - √289 =', after: '' },
        { before: '√0,81 + √0,64 =', after: '' },
        { before: '√1,44 - √1,69 =', after: '' },
        { before: '-√81 - √(1/25) =', after: '' },
        { before: '-√625 · √(19/25) =', after: '' }
      ]
    },
    correctAnswer: ['9', '5', '1.7', '-0.1', '-10.2', '-38'],
    points: 20,
    difficulty: 'medium'
  },
  {
    id: 'math-algebra-2-expr-value-formatted',
    type: 'fill-blank',
    title: 'Найдите значение выражения (с форматированием)',
    instructions: 'Найдите значение выражения (введите ответ):',
    content: {
      blanks: [
        { before: 'а) √25 + √16 =', after: '' },
        { before: 'б) √324 - √289 =', after: '' },
        { before: 'в) √0,81 + √0,64 =', after: '' },
        { before: 'г) √1,44 - √1,69 =', after: '' },
        { before: 'д) -√81 - √1/25 =', after: '' },
        { before: 'е) -√625 · √19/25 =', after: '' },
        { before: 'ж) √0,01 =', after: '' }
      ]
    },
    correctAnswer: ['9', '5', '1.7', '-0.1', '-10.2', '-38', '0.1'],
    points: 20,
    difficulty: 'medium'
  }
];

export const belarusianInteractiveExercises: InteractiveExercise[] = [
  {
    id: 'belarusian-grammar-e-words-1',
    type: 'fill-blank',
    title: 'Выпішыце словы з літарай э',
    instructions: 'Запоўніце пропускі',
    content: {
      blanks: [
        { before: "Т..рапеўт, гр..йпфрут, ч..р..паха, д..лікатэсны, бр..зент, адр..с, ст..лаж, уп..ўнены, выстр..л, д..талёвы, уц..лець, кар..спандэнт, пр..м'ера, ш..пялявы, стр..ляць, д..сантнік, ч..мадан, майст..р, канц..лярыя, ш..ры, ш..раваты, ш..сцёра", after: '' }
      ]
    },
    correctAnswer: [
      'тэрапеўт', 'грэйпфрут', 'чарапаха', 'далікатэсны', 'брызент', 'адрас', 'стэлаж', 'упэўнены', 'выстрал', 'дэталёвы', 'уцалець', 'карэспандэнт', "прэм'ера", 'шапялявы', 'страляць', 'дэсантнік', 'чамадан', 'майстар', 'канцылярыя', 'шэры', 'шараваты', 'шасцёра'
    ],
    points: 20,
    difficulty: 'easy'
  },
  {
    id: 'belarusian-grammar-vowels-1',
    type: 'matching',
    title: 'Правапіс галосных о, э, а',
    instructions: 'Злучыце правіла з правільным прыкладам напісання.',
    content: {
      pairs: [
        { left: 'Літара о пішацца толькі пад націскам', right: 'мора, кіно, опера, Орша, Токіа' },
        { left: 'Літара э пішацца ў пачатку выклічнікаў', right: 'э, эге, э-ге-ге, эх, эй' },
        { left: 'Літара э пішацца пасляпрыстаўной літары г у слове гэты і вытворныx', right: 'дагэтуль, гэтулькі' },
        { left: 'Літара э пішацца пасля зацвярдзелых, [д] і [т]', right: 'жэрдка, чэрствы, тэатр, ветэран, рэдактар' },
        { left: 'Літара а пішацца не пад націскам незалежна ад паходжання слова', right: 'балота, холад, маразы, рамонт, адрас' }
      ]
    },
    correctAnswer: [
      { left: 'Літара о пішацца толькі пад націскам', right: 'мора, кіно, опера, Орша, Токіа' },
      { left: 'Літара э пішацца ў пачатку выклічнікаў', right: 'э, эге, э-ге-ге, эх, эй' },
      { left: 'Літара э пішацца пасляпрыстаўной літары г у слове гэты і вытворныx', right: 'дагэтуль, гэтулькі' },
      { left: 'Літара э пішацца пасля зацвярдзелых, [д] і [т]', right: 'жэрдка, чэрствы, тэатр, ветэран, рэдактар' },
      { left: 'Літара а пішацца не пад націскам незалежна ад паходжання слова', right: 'балота, холад, маразы, рамонт, адрас' }
    ],
    points: 40,
    difficulty: 'easy'
  },
  {
    id: 'belarusian-grammar-e-words-2',
    type: 'fill-blank',
    title: 'Выпішыце словы з літарай э/а/я/о/і',
    instructions: 'Запоўніце пропускі',
    content: {
      blanks: [
        { before: "Зак..ранелы, с..кратар, ш..рсцяны, ст..млены, пагр..за, тры.., ж..леза, пч..ляр, р..партаж, М..л..дзечна, ч..рга, кр..ва-вы, п..ндзаль, р..монт, шч..дры, кат..т, ш..рань, ш..снаццаць, бесц..р..монны, ст..лаж, ш..дэўр, бухгалт..р, чар..ўнік, д..када, угн..енне, т..хнічны, др..вотня, ч..рствы, сч..рсцвелы, ш..ра-вокі, пагр..жаць.", after: '' }
      ]
    },
    correctAnswer: [
      "закаранелы", "сакратар", "шарсцяны", "стомлены", "пагроза", "трыо", "жалеза", "пчаляр", "рэпартаж", "маладзечна", "чарга", "крывавы", "пэндзаль", "рамонт", "шчодры", "катэт", "шэрань", "шаснаццаць", "бесцырымонны", "стэлаж", "шэдэўр", "бухгалтар", "чараўнік", "дэкада", "угнаенне", "тэхнічны", "дрывотня", "чэрствы", "счарсцвелы", "шэравокі", "пагражаць"
    ],
    points: 30,
    difficulty: 'medium'
  }
];

// Helper functions
export const getExercisesByTopic = (topicId: string): InteractiveExercise[] => {
  if (topicId === 'math-algebra') {
    return mathInteractiveExercises.filter(exercise => exercise.id.includes('sqrt') || exercise.id.includes('number'));
  } else if (topicId === 'math-geometry') {
    return mathInteractiveExercises.filter(exercise => exercise.id.includes('polygon') || exercise.id.includes('parallelogram'));
  } else if (topicId === 'belarusian-grammar') {
    return belarusianInteractiveExercises;
  }
  return [];
};

export const getExerciseById = (exerciseId: string): InteractiveExercise | undefined => {
  return (
    mathInteractiveExercises.find(exercise => exercise.id === exerciseId) ||
    belarusianInteractiveExercises.find(exercise => exercise.id === exerciseId)
  );
};

export const getRandomExercise = (topicId?: string): InteractiveExercise => {
  const exercises = topicId 
    ? getExercisesByTopic(topicId)
    : mathInteractiveExercises;
  
  if (exercises.length === 0) {
    return mathInteractiveExercises[0]; // fallback
  }
  
  const randomIndex = Math.floor(Math.random() * exercises.length);
  return exercises[randomIndex];
}; 