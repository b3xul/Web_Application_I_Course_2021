"use strict";

const ArrayOfStrings=["spring", "spng", "paolo", "tre", "du", "u", ""];

console.log(ArrayOfStrings);

for(let i=0; i<ArrayOfStrings.length; i++){
  ArrayOfStrings[i]=(ArrayOfStrings[i].length>=2) ?
    ArrayOfStrings[i].substr(0,2)+
    ArrayOfStrings[i].substr(ArrayOfStrings[i].length-2,2) : '';
}
console.log(ArrayOfStrings);