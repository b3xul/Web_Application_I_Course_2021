'use strict' ;

let a = [3, 4, 88, 12, 9, 17]

console.log(a) ;

a.sort( (x,y) => (x-y) ) ;

console.log(a) ;

function myFilter(arr, criteria) {
    let res = [] ;
    for(let element of arr) {
        if (criteria(element))
            res.push(element);
    }
    return res ; 
}

a.forEach( (value, index, arr)=>{
    console.log(value + " at position "+index);
    arr[index] = arr[index] + 1;
} );

let b = myFilter(a, (x)=> (x%2===0)) ;
console.log(b);