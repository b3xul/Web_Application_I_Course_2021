'use strict';

//To write the README.md refer to the Standard Methods Google APIs slides!

const express = require('express');
const morgan = require('morgan');

const PORT = 3000;

const dao = require('./dao_commented'); // module for accessing the DB

const app = express();
app.use(morgan('dev'));
app.use(express.json()); // parse the body in JSON format => populate req.body attributes

//Read information without parameters
app.get('/api/courses', (req, res) => {
    //listCourses returns a promise that will resolve when the query has finished, so we process the result courses when it will be ready using then (or the error using catch)
    dao.listCourses()
        .then((courses) => { res.json(courses); })  //json converts courses into json and send that too!
        .catch((error) => { res.status(500).json(error); }); //error is the err rejected in the dao
});
//curl http://localhost:3000/api/courses -> make http request directly
//also in browser we receive raw json data (browser can put them nicely)
//RESTClient chrome extension allows to semplify POST calls (since GETs are easy to do using curl or browser, but POSTs are more difficult from command line) -> specify in header tab that the content-type of the body will be application/json (also BurpSuite would probably work fine)
//REST Client vscode extension is simple and effective: create a api.http text file, send request directly from there and see responses on the side

//Read information with parameters
app.get('/api/courses/:code', async (req, res) => { //declare this callback as asynch if we want to be able to use await inside it
    const code = req.params.code;
    try {
        // Add validation here! (length of string, only alphanumeric characters,..) -> see in github!
        let course = await dao.getCourse(code); //2 different sintax to handle promises
        res.json(course);
    } catch (error) {
        res.status(500).json(error);    //always catch the possibility of an error!
    }

});

//Write information with body
app.post('/api/exams', async (req, res) => {
    let code = req.body.code;   //For parsing the body in JSON format (populate req.body atributes) we need to register the middleware express.json()
    let score = req.body.score;
    let date = req.body.date;

    try {
        // Add another validation here! (in GET and POST we'll have different types of errors)
        await dao.createExam({ code: code, score: score, date: date });
        res.end();  //since there is await, this will be called only when the promise will be resolved in a positive way, and will return an empty message so that the client will know that he can close the connection
    } catch (error) {
        res.status(500).json(error); //N.B. .sends expects a string while .json expects an object which will be serialized in json format. Both also send the data
    }
});
//This already adds data to the database!! If we try to add more course with the same primary key we will get a SQLITE CONSTRAINT error.

app.listen(PORT, () => { console.log(`Server started at http://localhost:${PORT}/`); });
