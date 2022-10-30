'use strict';

let a = [3, 4, 88, 12, 10, 17];

console.log(a);
a.sort();   // this sorts the array using the default sorting criteria: converts array to strings and then orders it alphabetically!
console.log(a); //[ 12, 17, 3, 4, 88, 9 ]

/*@param compareFn Function used to determine the order of the elements. It is expected to return
* a negative value if first argument is less than second argument, zero if they're equal and a positive
* value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
* ```ts
* [11,2,22,1].sort((a, b) => a - b)
* ```
*
*sort(compareFn?: (a: T, b: T) => number): this;a.sort(function)
*/
a.sort((x, y) => (x - y));  // the provided function is a callback that modifies the sort behaviour to customize it as we need!
// since - is only defined for Numbers, the array elements will be treated as Numbers!
// In C we would use a pointer to a comparison function, in Java a Comparator Class, in Python a Lambda, here just a function
//a.sort( (x,y) => (x-y) ) ; Decreasing order!
console.log(a);

function myFilter(arr, criteria) {  //Nothing magical in the filtering function!!! Filtering function that takes a callback function!
    let res = [];
    for (let element of arr) {
        if (criteria(element))
            res.push(element);
    }
    return res;
}
/**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     
     * forEach(callbackfn: (value of the element: T, index of the element: number, array that contains all the elements: T[]) => void, thisArg?: any): void;
*/
a.forEach((value, index, arr) => {
    console.log(value + " at position " + index);
    // value = value+1 WON'T change the original array! (assignment!)
    arr[index] = arr[index] + 1; //THIS changes the original array! Can also access other parts of the array!
});

console.log(a);
let b = myFilter(a, (x) => (x % 2 === 0));  //Filters only even numbers (executed once for every element)

console.log(b);