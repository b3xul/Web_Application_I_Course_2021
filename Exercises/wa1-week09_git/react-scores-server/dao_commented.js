'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('exams.sqlite', (err) => {
    if (err) throw err;
});

// Now let’s look at how to create our own module and export it for use elsewhere in our program.
// Start off by creating a user.js file and adding the following:
//   exports.getName = () => {
//     return 'Jim';
//   };;
//   Now create an index.js file in the same folder and add this:
//   const user = require('./user');
//   console.log(`User: ${user.getName()}`);

// get all courses
exports.listCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM course';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const courses = rows.map((e) => ({ code: e.code, name: e.name, CFU: e.CFU }));
            resolve(courses);
        });
    });
};

// get the course identified by {code}
exports.getCourse = (code) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM course WHERE code=?';
        db.get(sql, [code], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(row);
            if (row == undefined) {
                reject({ error: 'Course not found.' }); //With resolve, it won't enter in the catch of the app.get, because it would be seen as a correct exam
            } else {
                const course = { code: row.code, name: row.name, CFU: row.CFU };
                resolve(course);
            }
        });
    });
};

// get all exams
exports.listExams = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT coursecode, score, date FROM exam';

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const exams = rows.map((e) => (
                {
                    code: e.coursecode,
                    score: e.score,
                    date: e.date,
                }));

            resolve(exams);
        });
    });
};

// add a new exam
exports.createExam = (exam) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO exam(coursecode, date, score) VALUES(?, DATE(?), ?)';
        db.run(sql, [exam.code, exam.date, exam.score], function (err) {
            if (err) {
                reject(err);
                return;
            }
            console.log(this.lastID);
            resolve(this.lastID);
        });
    });
};

// update an existing exam
exports.updateExam = (exam) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE exam SET date=DATE(?), score=? WHERE coursecode = ?';
        db.run(sql, [exam.date, exam.score, exam.code], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// delete an existing exam
exports.deleteExam = (course_code) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM exam WHERE coursecode = ?';
        db.run(sql, [course_code], (err) => {
            if (err) {
                reject(err);
                return;
            } else
                resolve(null);
        });
    });
};