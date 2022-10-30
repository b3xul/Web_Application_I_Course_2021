// NO: const dayjs = require('dayjs') ; DOES NOT WORK IN THE BROWSER

// let today = dayjs() ;
// console.log('hello '+today.format() );

let articleTitle1 = document.getElementsByTagName('h1')[1] ;
let articleTitle2 = document.querySelector('main h1');
let articleTitle3 = document.getElementsByTagName('main')[0].getElementsByTagName('h1')[0];
let articleTitle4 = document.getElementById('maintitle');

console.log(articleTitle1);
console.log(articleTitle2);
console.log(articleTitle3);

for(let i = 0; i<10; i++) {
    let newP = document.createElement('p') ;
    let text = document.createTextNode(''+i);
    newP.appendChild(text);
    document.querySelector('main').appendChild(newP);
}

for(let i = 0; i<10; i++) {
    document.querySelector('main').innerHTML += '<p>'+i+'</p>' ;
}

let pageHeader = document.querySelector('header h1');

function changeBlue(event) {
    pageHeader.classList.toggle('bg-primary');
}

document.querySelector('main h1').addEventListener('click', changeBlue) ;

// document.querySelector('main h1').addEventListener('click', (event)=>{
//     console.log(event) ;
//     pageHeader.classList.toggle('bg-primary');
// })