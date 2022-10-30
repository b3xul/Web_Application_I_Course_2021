"use strict";
//console.time('myScript');

const scores = [24, 26, 20, 20, 23, 30, 29, 25, 22, 18, 22, 22, 18, 21, 27, 18, 26, 23, 29, 19, 25];

let lowest = [];
let lowest_indexes = [];
const tot_lowest = 2;

let index = 0;
for (const i of scores) {
    //console.log(`-Analysing score: ${i}`);

    //console.log(`--Comparing with: ${lowest[0]}`);

    if (lowest[0] === undefined) {
        lowest[0] = i;
        lowest_indexes[0] = index;
    }
    else if (i < lowest[0]) {
        lowest[1] = lowest[0]; //shift previous lower
        lowest_indexes[1] = lowest_indexes[0];
        lowest[0] = i; // substitute the number which is not the lower anymore
        lowest_indexes[0] = index;
    }
    else if (lowest[1] === undefined || i < lowest[1]) {
        //console.log(`--Comparing with: ${lowest[1]}`);
        lowest[1] = i;
        lowest_indexes[1] = index;
    }
    //console.log(`---Lowest scores: ${lowest}`);

    index++;
}

let improved_scores = [...scores];    //Real copy, as Array.from(scores) or Array.of(...scores)
// remove an element from array
improved_scores.splice(lowest_indexes[0], 1);                    //Just to try 2 different techniques
improved_scores.splice(improved_scores.indexOf(lowest[1]), 1);
//console.log(`Improved scores: ${ improved_scores }`);

let sum = 0;
for (const i of improved_scores)
    sum += i;

//console.log(sum);
const avg = Math.round(sum / (improved_scores.length));
improved_scores.push(avg, avg);

console.log(`Real scores: \t ${scores}`);

console.log(`Improved scores: ${improved_scores}`);

//console.timeEnd('myScript');