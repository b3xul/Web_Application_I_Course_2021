"use strict";

/* 1st way: classic declaration
 * function shorten(ArrayOfStrings) {...}
 *
 * 2nd way: (named) function expression
 * const shorten2 = shorten;
 * const shorten2 = function(ArrayOfStrings){...};
 * const shorten2 = function sh(ArrayOfStrings){...};
 *
 * 3rd way: arrow function (implicit return if there is only one)
 * const shorten3 = (ArrayOfStrings) => { return ...};
 * const shorten3 = (ArrayOfStrings) => (...);
 * 
 * 4th way: Immediately-invoked Function Expressions
 * (function shorten4() {...})();
 * (() => {...})();
 * 
 */

// Returning new array:
// function shorten(ArrayOfStrings) {
//     let newArrayOfStrings=[];
//     let toPush;

//  USING forEach
//     ArrayOfStrings.forEach( (str) => {
//                                         if(str.length<2)
//                                             toPush='';
//                                         else
//                                             toPush=str.slice(0,2)+str.slice(-2);

//                                         newArrayOfStrings.push(toPush);
//                                     } );

//  USING map
// const newArrayOfStrings=ArrayOfStrings.map( (str) => {
//     if(str.length<2)
//         return '';
//     else
//         return str.slice(0,2)+str.slice(-2);
//      } );
//  
//  return newArrayOfStrings;
// }

/* Modifying existing array:*/
function shorten(ArrayOfStrings) {
    let modifiedString;

    ArrayOfStrings.forEach((str, index, arr) => {
        if (str.length < 2)
            modifiedString = '';
        else
            modifiedString = str.slice(0, 2) + str.slice(-2);

        arr[index] = modifiedString;
        // or ArrayOfStrings[index] = modifiedString;
    });
}

const ArrayOfStrings = ["spring", "spng", "paolo", "tre", "du", "u", ""];

console.log(ArrayOfStrings);
shorten(ArrayOfStrings);
console.log(ArrayOfStrings);
