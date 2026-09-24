//  Task - M
// npm run train

function getSquareNumbers(arr) {
  return arr.map(number => ({
    number: number,
    square: number * number
  }));
}

// Test
console.log(getSquareNumbers([4, 8, 10]));