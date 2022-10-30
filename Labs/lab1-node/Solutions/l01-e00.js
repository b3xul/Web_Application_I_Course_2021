'use strict';

const words = ["spring","summer","autumn", "winter"];

for(let i=0; i< words.length; i ++) {
    if(words[i].length < 2)
        words[i] = "";
    else 
        words[i] =  words[i].substring(0,2) +  words[i].substring(words[i].length -2,  words[i].length);
}

// ALTERNATIVES
/*
for(const [i, w] of words.entries()) {
    if(w.length < 2)
        words[i] = "";
    else 
        words[i] =  w.substring(0,2) +  w.substring(w.length -2,  w.length);
}*/
/*
words.forEach((item,index) => {
    if(item.length < 2)
        words[index] = "";
    else 
        words[index] = item.substring(0,2) + item.substring(item.length -2, item.length);
});
*/

console.log(words);