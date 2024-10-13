// Функция для измерения времени выполнения
function measurePerformance(fn, iterations = 100000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return end - start;
}

// Мегаморфная функция
function processDataMegamorphic(data) {
  return data.map(item => item.value * 2);
}

// Более оптимальные варианты
function processNumbersMonomomorphic(numbers) {
  return numbers.map(n => n * 2);
}

function processObjectsMonomomorphic(objects) {
  return objects.map(obj => obj.value * 2);
}

// Подготовка данных для тестов
const objectsArray = Array.from({ length: 1000 }, (_, i) => ({ value: i }));
const numbersArray = Array.from({ length: 1000 }, (_, i) => i);
const stringsArray = Array.from({ length: 1000 }, (_, i) => i.toString());
const mixedArray = Array.from({ length: 1000 }, (_, i) => i % 2 === 0 ? { value: i } : i);

// Добавление геттеров для числового и строкового массивов
Object.defineProperty(Number.prototype, 'value', { get() { return this; } });
Object.defineProperty(String.prototype, 'value', { get() { return parseInt(this); } });

// Проведение тестов
console.log("Мегаморфная функция (объекты):", measurePerformance(() => processDataMegamorphic(objectsArray)));
console.log("Мегаморфная функция (числа):", measurePerformance(() => processDataMegamorphic(numbersArray)));
console.log("Мегаморфная функция (строки):", measurePerformance(() => processDataMegamorphic(stringsArray)));
console.log("Мегаморфная функция (смешанные):", measurePerformance(() => processDataMegamorphic(mixedArray)));

console.log("Мономорфная функция (объекты):", measurePerformance(() => processObjectsMonomomorphic(objectsArray)));
console.log("Мономорфная функция (числа):", measurePerformance(() => processNumbersMonomomorphic(numbersArray)));

// Дополнительный тест: использование мегаморфной функции с разными типами данных
console.log("Мегаморфная функция (чередование типов):", measurePerformance(() => {
  processDataMegamorphic(objectsArray);
  processDataMegamorphic(numbersArray);
  processDataMegamorphic(stringsArray);
  processDataMegamorphic(mixedArray);
}));

// Очистка прототипов после тестов
delete Number.prototype.value;
delete String.prototype.value;
