/* Project Standarts:
- Logging standarts
- Naming standarts
    function, method, variable => Camel case
    class => PASCAL (first letter in cap)
    folder => KEBAB
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