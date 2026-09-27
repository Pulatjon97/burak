// Task - N

function palindromCheck(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const reversed = cleaned.split('').reverse().join('');
  return cleaned === reversed;
}

console.log(palindromCheck("aka"));  // true
console.log(palindromCheck("uka"));  // false



// //  Task - M
// // npm run train

// function getSquareNumbers(arr) {
//   return arr.map(number => ({
//     number: number,
//     square: number * number
//   }));
// }

// // Test
// console.log(getSquareNumbers([4, 8, 10]));