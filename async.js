// Асинхронный вариант
async function asyncSum(n) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += await Promise.resolve(i);
  }
  return sum;
}

// Синхронный вариант
function syncSum(n) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += i;
  }
  return sum;
}

// Измерение времени выполнения
console.time('async');
asyncSum(1000000).then(() => console.timeEnd('async'));

console.time('sync');
syncSum(1000000);
console.timeEnd('sync');
