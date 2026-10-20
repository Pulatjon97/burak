// TASK - W

function chunkArray(arr, size) {
  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3));
// [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]




// TASK - V

// function countChars(str: string): { [key: string]: number } {
//   const result: { [key: string]: number } = {};

//   for (let i = 0; i < str.length; i++) {
//     const char = str[i];

//     if (result[char]) result[char]++;
//     else result[char] = 1;
//   }

//   return result;
// }

// console.log(countChars("hello")); // { h: 1, e: 1, l: 2, o: 1 }



// U-TASK

// function sumOdds(number: number): number {
//   let count = 0;

//   for (let i = 0; i < number; i++) {
//     if (i % 2 !== 0) count++;
//   }

//   return count;
// }

// console.log(sumOdds(23));  // 11
// console.log(sumOdds(33)); // 16




/* Project Standarts:
- Logging standarts
- Naming standart:
    function, method, variable => CAMEL
    class => PASCAL
    folder file => KEBAB
    css => SNAKE
- Error handling

*/

/* Request Types
Traditional API
Rest API
GraphQL API
...
*/

/* Frontend Development
Traditional Frontend => SSR => EJS
Modern Frontend => SPA => React, Vue, Angular
*/

/* Coocies
    reques join
    self destroy

*/

/** Validation
  frontend validation
  backend validation
 database validation
 */



// T-TASK

//  function mergeSortedArrays(
//   firstArray: readonly number[],
//   secondArray: readonly number[]
// ): number[] {
//   const mergedArray: number[] = [];

//   let firstIndex = 0;
//   let secondIndex = 0;

//   while (
//     firstIndex < firstArray.length &&
//     secondIndex < secondArray.length
//   ) {
//     if (firstArray[firstIndex] <= secondArray[secondIndex]) {
//       mergedArray.push(firstArray[firstIndex]);
//       firstIndex++;
//     } else {
//       mergedArray.push(secondArray[secondIndex]);
//       secondIndex++;
//     }
//   }

//   return [
//     ...mergedArray,
//     ...firstArray.slice(firstIndex),
//     ...secondArray.slice(secondIndex),
//   ];
// }

// const result = mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]);

// console.log(result);

// S-TASK

// function missingNumber(nums: number[]): number {
//   const n: number = nums.length;
//   const expectedSum: number = (n * (n + 1)) / 2;

//   const actualSum: number = nums.reduce((sum: number, num: number) => sum + num, 0);

//   return expectedSum - actualSum;
// }

// console.log(missingNumber([3, 0, 1])); // 2

// R-TASK

// function calculate(str: string): number {
//     return str
//         .split('+')
//         .reduce((sum, num) => sum + Number(num.trim()), 0);
// }

// console.log(calculate("1+3"));      // 4
// console.log(calculate("10+20"));    // 30
// console.log(calculate("1+2+3+4"));  // 10

// Q-TASK

// interface Car {
//     name: string;
//     model: string;
// }

// const car: Car = { name: "BMW", model: "M3" };

// console.log(hasProperty(car, "model"));
// console.log(hasProperty(car, "year"));

// const propertyName = "model";

// if (hasProperty(car, propertyName)) {
//     console.log(car[propertyName]); //
// }

// function hasProperty(car: Car, arg1: string): boolean {
//     return arg1 in car;
// }

// function hasProperty(obj, str) {
//     return str in obj;
// }

// console.log(hasProperty({name: "BMW", model: "M3"}, "model")); // true
// console.log(hasProperty({name: "BMW", model: "M3"}, "year"));  // false

// // P-Task

// function obyektBorArrayga<T>(obj: Record<string, T>): [string, T][] {
//   return Object.entries(obj);
// }
// const result = obyektBorArrayga({ c: 17, v: 43 });
// console.log(result);

//  O-TASK

// function calculateSumOfNumbers(arr: unknown[]): number {
//   return arr.reduce<number>((sum, item) => {
//     if (typeof item === "number" && !Number.isNaN(item)) {
//       return sum + item;
//     }
//     return sum;
//   }, 0);
// }

// const result: number = calculateSumOfNumbers([10, "10", { son: 10 }, true, 35]);
// console.log(result); // Natija: 45

// N-task

// function palindromCheck(input: string): boolean {
//     const reverseInput = input.toLowerCase().split("").reverse().join("");
//     if (input.toLowerCase() === reverseInput) {
//         return true;
//     }
//     return false;

// }

// console.log(palindromCheck("non"))

// M-Task

// interface SquareResult {
//   number: number;
//   square: number;
// }

// function getSquareNumbers(numbers: number[]): SquareResult[] {
//   return numbers.map((num: number): SquareResult => ({
//     number: num,
//     square: num * num
//   }));
// }

// console.log(getSquareNumbers([1, 2, 3]));
