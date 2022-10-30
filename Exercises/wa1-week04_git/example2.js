'use strict' ;
document.addEventListener('DOMContentLoaded', (event)=>{
    const pageTitle = document.querySelector('header h1');
    const articleTitle = document.querySelector('main h1');
    const userForm = document.getElementById('userinfo') ;

    articleTitle.addEventListener('click', (event)=>{
        pageTitle.classList.toggle('bg-primary');
    });

    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let username = userForm.elements['username'].value ;
        let username2 = userForm.username.value ; // shortcut: input NAME is injected as a property of the form

        console.log(username, username2);
    });

}) ;