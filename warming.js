/*
Выбросы (или выбросные значения, англ. outliers) — это термин из статистики, который относится к наблюдениям, значительно отличающимся от других значений в выборке. В контексте измерения производительности кода выбросы — это аномально высокие или низкие значения времени выполнения, которые могут искажать общую картину производительности.


Причины появления выбросов при измерении производительности:
- Сборка мусора (garbage collection) во время выполнения измеряемого кода
- Другие процессы, занимающие процессорное время
- Кэширование данных или инструкций
- Внезапная деоптимизация кода JIT-компилятором
- Переключение контекста операционной системой

Почему выбросы важно учитывать:
- Они могут значительно искажать средние значения
- Могут привести к неверным выводам о производительности кода
- Иногда выбросы сами по себе являются важной информацией о поведении системы

Методы работы с выбросами:
- Исключение: удаление экстремальных значений перед анализом
- Использование медианы вместо среднего значения
- Применение робастных статистических методов
- Анализ выбросов для выявления системных проблем


*/

function measurePerformance(fn, input, iterations = 1000000, measurements = 100) {
    const times = [];
    
    function singleMeasurement() {
      const start = performance.now();
      fn(input);
      const end = performance.now();
      return end - start;
    }
  
    // Измерение холодного запуска
    const coldTime = singleMeasurement();
  
    // Разогрев функции
    for (let i = 0; i < iterations; i++) {
      fn(input);
    }
  
    // Множественные измерения горячего запуска
    for (let i = 0; i < measurements; i++) {
      times.push(singleMeasurement());
    }
  
    // Сортировка времени для определения медианы и выбросов
    times.sort((a, b) => a - b);
  
    const median = times[Math.floor(times.length / 2)];
    const q1 = times[Math.floor(times.length / 4)];
    const q3 = times[Math.floor(3 * times.length / 4)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
  
    const filteredTimes = times.filter(t => t >= lowerBound && t <= upperBound);
    const average = filteredTimes.reduce((sum, t) => sum + t, 0) / filteredTimes.length;
  
    return {
      coldTime,
      median,
      average,
      min: filteredTimes[0],
      max: filteredTimes[filteredTimes.length - 1],
      outliers: times.length - filteredTimes.length
    };
  }
  
  // Тестируемая функция
  function sumArray(arr) {
    return arr.reduce((sum, num) => sum + num, 0);
  }
  
  const testData = Array.from({ length: 10000 }, (_, i) => i);
  
  const results = measurePerformance(sumArray, testData);
  
  console.log("Холодный запуск:", results.coldTime.toFixed(3), "мс");
  console.log("Горячие запуски:");
  console.log("  Медиана:", results.median.toFixed(3), "мс");
  console.log("  Среднее (без выбросов):", results.average.toFixed(3), "мс");
  console.log("  Мин:", results.min.toFixed(3), "мс");
  console.log("  Макс:", results.max.toFixed(3), "мс");
  console.log("Количество выбросов:", results.outliers);
  console.log("Ускорение после разогрева (по медиане):", (results.coldTime / results.median).toFixed(2), "раз");