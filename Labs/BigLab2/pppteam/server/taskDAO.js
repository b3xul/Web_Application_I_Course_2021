'use strict';
/* Data Access Object (DAO) module for accessing tasks */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = require('./db');

const errorNotFoundObject = { error: 'Task not found.' };

function task(ID, description, urgent = false, priv = true, deadline = undefined) {
    this.ID = ID,
        this.description = description;
    this.important = important;
    this.priv = priv;
    this.deadline = deadline;
    this.completed = false;
    this.user = null;
    return;
}

function TaskList() {
    this.list = [];

    this.add = (task) => { this.list.push(task); };

    this.print = () => { this.list.forEach((a) => { console.log(`${a.ID}, ${a.description}, ${a.urgent}, ${a.priv}, ${a.deadline}`); }); };
}

exports.listAllTasks = (userid) => {
    return new Promise((resolve, reject) => {
        db.all('select * from tasks where user = ?', [userid], function (err, rows) {
            if (err)
                reject(err);
            else {
                const tasks = rows.map((elem) => ({
                    ID: elem.id, description: elem.description, important: elem.important, private: elem.private,
                    deadline: dayjs(elem.deadline), completed: elem.completed, user: elem.user
                }));
                resolve(tasks);
            }
        });
    });
};

const filters = {
    "All": filterAll,
    "Today": filterToday,
    "Next 7 Days": filterNext7Days,
    "Important": filterImportant,
    "Private": filterPrivate,
};

exports.filters = filters;

function filterAll(row) {
    return true;
}

function filterToday(row) {
    if (row.deadline !== null && dayjs(row.deadline).isSame(dayjs(), 'day'))
        return true;
    else
        return false;
}

function filterNext7Days(row) {
    const tomorrow = dayjs().add(1, 'day');
    const nextWeek = dayjs().add(7, 'day');
    if (row.deadline !== null && !dayjs(row.deadline).isAfter(nextWeek, 'day') && !dayjs(row.deadline).isBefore(tomorrow, 'day'))
        return true;
    else
        return false;
}

function filterImportant(row) {
    return row.important;
}

function filterPrivate(row) {
    return row.private;
}

function filterCompleted(row) {
    return row.completed;
}

function selectFilter(filter) {
    switch (filter) {
        case "All":
            return filters["All"];
        case "Important":
            return filters["Important"];
        case "Today":
            return filters["Today"];
        case "Next 7 Days":
            return filters["Next 7 Days"];
        case "Private":
            return filters["Private"];
        default:    //should not go there
            return filters["All"];
    };

}

exports.listFiltered = (f, userid) => {
    return new Promise((resolve, reject) => {
        db.all('select * from tasks where user = ?', [userid], function (err, rows) {
            if (err)
                reject(err);
            else {
                const tasks = rows.filter(selectFilter(f)).map((elem) => ({
                    ID: elem.id, description: elem.description, important: elem.important, private: elem.private,
                    deadline: dayjs(elem.deadline), completed: elem.completed, user: elem.user
                }));
                resolve(tasks);
            }
        });
    });
};

exports.getTaskById = (id, userid) => {
    return new Promise((resolve, reject) => {
        db.get(`select * from tasks where id = ? and user = ?`, [id], function (err, row) {
            if (err)
                reject(err);
            else {
                if (row == undefined) {
                    reject(errorNotFoundObject); //With resolve, it won't enter in the catch of the app.get, because it would be seen as a correct exam
                }
                else {
                    const task = {
                        ID: row.id, description: row.description, important: row.important, private: row.private,
                        deadline: dayjs(row.deadline), completed: row.completed, user: row.user
                    };
                    resolve(task);
                }
            }
        });
    });
};

exports.createTask = (task) => {
    return new Promise((resolve, reject) => {
        let query = `insert into tasks(description, important, private, deadline, completed, user)
                        values(?, ?, ?, DATETIME(?), ?, ?)`;
        db.run(query, [task.description, task.important, task.private, task.deadline, task.completed, task.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            else {
                task.id = this.lastID;
                resolve(task);
            }
        });
    });
};

exports.updateTask = (task) => {
    return new Promise((resolve, reject) => {
        let query = `update tasks set description=?, important=?, private=?, deadline=DATETIME(?), completed=?, user=? where id=?`;
        db.run(query, [task.description, task.important, task.private, task.deadline, task.completed, task.user, task.id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            else {
                if (this.changes === 1)
                    resolve(task);
                else
                    reject(errorNotFoundObject); //With resolve, it won't enter in the catch of the app.get, because it would be seen as a correct exam
            }
        });
    });
};

exports.markTask = (task) => {
    return new Promise((resolve, reject) => {
        let query = `update tasks set completed=? where id=? and user = ?`;
        db.run(query, [task.completed, task.id, task.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            else {
                if (this.changes === 1) {
                    if (task.completed)
                        resolve({ completed: task.id });
                    else
                        resolve({ uncompleted: task.id });
                }
                else
                    reject(errorNotFoundObject); //With resolve, it won't enter in the catch of the app.get, because it would be seen as a correct exam

            }
        });
    });
};

exports.deleteTask = (task) => {
    return new Promise((resolve, reject) => {
        let query = `delete from tasks where id=? and user = ?`;
        db.run(query, [task.id, task.user], function (err) {
            if (err) {
                reject(err);
                return;
            }
            else {
                if (this.changes === 1)
                    resolve({ deleted: task.id });
                else
                    reject(errorNotFoundObject);
            }
        });
    });
};

/*{
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
} */
