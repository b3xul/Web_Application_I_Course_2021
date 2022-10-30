"use strict";

const courses_string="Web Applications I, Architetture dei Calcolatori , Data Science e Tecnologie per le Basi di Dati, Tecnologie e Servizi di Rete, Information systems security, Software engineering, Programmazione di sistema";
//console.log(courses_string);

const courses_array=courses_string.split(", ");
//console.log(courses_array);
for (let i = 0; i < courses_array.length; i++)
  courses_array[i] = courses_array[i].trim();
/*
N.B. I can scan an array using a map
for(let [i, c]  of courses.entries())
  courses[i] = c.trim() ;
*/

//console.log(courses_array);
courses_array.sort();

const acronym_array=[];
let words=[];
for(const i of courses_array){

    acronym_array.push(''); //Doesn't modify the array reference (const is ok)
    
    words=i.split(" "); //Assignment modifies the array reference (const can't be used)
    //console.log(words);
    for( const j of words){
        //console.log(`--adding: ${j[0]}`);
        //Variant: only add words longer than 2 letters
        if(j.length>=3)
            acronym_array[acronym_array.length-1]=acronym_array[acronym_array.length-1].concat(j[0].toUpperCase());
    }
    //console.log(acronym_array);    //Initial letter is the start of the acronym
}

for(let i=0; i<acronym_array.length; i++){
    console.log(`${acronym_array[i]} - ${courses_array[i]}`);
}