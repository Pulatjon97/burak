//  TASK - Q

function hasProperty(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

console.log(hasProperty({ name: "BMW", model: "ii7" }, "year")); // false



/*
  Traditinal Api
  Rest Api
  GraphQL Api
  ...
*/


/*
  Traditional FD   =>   BSSR (Admin)   =>   EJS
  Modern FD        =>   SPA (Users' application)   =>   REACT
*/


// // TASK - P

// // P-TASK: object -> array of [key, value] pairs

// function objectToArray(obj: { [key: string]: any }): [string, any][] {
//   return Object.entries(obj);
// }

// console.log(objectToArray({ a: 10, b: 20 }));
// // [ [ 'a', 10 ], [ 'b', 20 ] ]



// // TASK - O
// function calculateSumOfNumbers(arr: unknown[]): number {
//   return arr.reduce((sum: number, item) => {
//     if (typeof item === "number") {
//       return sum + item;
//     }
//     return sum;
//   }, 0);
// }

// // Test
// console.log(calculateSumOfNumbers([10, "10", { son: 10 }, true, 35])); // 45


/* Project Standarts:
- Logging standarts
- Naming standarts
    function, method, variable => Camel case
    class => PASCAL (first letter in cap)
    folder, file => KEBAB
    css => SNAKE
- Error Handling
    
*/
/**
 * NAMING STANDARDS
 * -----------------
 * function, method, variable => camelCase
 *   e.g. let memberNick = "john_doe";
 *        function getMemberById(id: string) {}
 *
 * class / interface / enum => PascalCase
 *   e.g. class MemberService {}
 *        interface MemberDto {}
 *        enum MemberType {}
 *
 * folder => kebab-case
 *   e.g. src/member-service/, src/auth-middleware/
 *
 * css => snake_case
 *   e.g. .member_card {}, .profile_image {}
 */




// Task - N

// function palindromCheck(str: string): boolean {
//   const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
//   const reversed = cleaned.split('').reverse().join('');
//   return cleaned === reversed;
// }

// console.log(palindromCheck("aka"));  // true
// console.log(palindromCheck("uka"));  // false



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