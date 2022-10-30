'use strict';

const score = [25, 30, 18, 27, 28, 27, 30, 26];
const betterScore = [...score];

// find the min, twice
let minScore = Math.min(...betterScore);
let index = betterScore.indexOf(minScore);
betterScore.splice(index, 1);

minScore = Math.min(...betterScore);
index = betterScore.indexOf(minScore);
betterScore.splice(index, 1);

/*
// ALTERNATIVE
betterScore.sort((a,b) => (a-b));
betterScore.shift();
betterScore.shift();
*/

// compute the average
let avg = 0;
for (const s of betterScore)
  avg += s;
avg /= betterScore.length;

// round the average
avg = Math.round(avg);

// add it twice
betterScore.push(avg, avg);

// print everything
console.log(score);
console.log(betterScore);