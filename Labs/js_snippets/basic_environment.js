"use strict";

let a = "abc";

console.log(a);

/*
    run via terminal: node basic_environment.js
    run via interpreter (output in debug console): run menu->start debugging (F5) or run without debuggin(CTRL+F5)-> choose execution engine (Chrome/Node.js)
    N.B. Interpreter includes debugging functionalities!!! Terminal can only show output!
    
    Lateral run menu-> create launch configuration for Node.js/Chrome -> default configuration
    Config must be in the same folder as the file
*/

a = 5;

console.log(a);

let myObj = { data: "10:30", agenti: ["agente1", "agente2"] };
console.log(myObj);

myObj.agenti.push("agente3");
myObj["agenti"].push("agente4");
console.log(myObj);