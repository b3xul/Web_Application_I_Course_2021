'use strict';

const express = require('express')
const morgan = require('morgan')

const PORT = 3000;

const dao = require('./dao'); // module for accessing the DB

const app = express();
app.use(morgan('dev'));
app.use(express.json()); // parse the body in JSON format => populate req.body attributes

app.get('/api/courses', (req, res) => {
    dao.listCourses()
        .then((courses) => { res.json(courses); })
        .catch((error) => { res.status(500).json(error); });
});

app.get('/api/courses/:code', async (req, res) => {
    const code = req.params.code;
    try {
        let course = await dao.getCourse(code);
        res.json(course);
    } catch (error) {
        res.status(500).json(error);
    }

});

app.post('/api/exams', async (req, res) => {
    let code = req.body.code;
    let score = req.body.score;
    let date = req.body.date;

    try {
        await dao.createExam({ code: code, score: score, date: date });
        res.end();
    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(PORT, () => { console.log(`Server started at http://localhost:${PORT}/`) })
