'use strict';
/* Data Access Object (DAO) module for accessing tasks */

const db = require('./db');

const errorNotFoundObject = { error: 'Task not found.' };

const filters = new Map([
    ["All", ";"],
    ["Today", "and date(deadline) = date('now');"],
    ["Next 7 Days", "and date(deadline) BETWEEN date('now') AND date('now', '+7 days');"],
    ["Important", "and important = true;"],
    ["Private", "and private = true; "],
]);
exports.filters = filters;

exports.listAllTasks = (userId) => {
    return new Promise((resolve, reject) => {
        db.all('select * from tasks where user=?', [userId], function (err, rows) {
            if (err)
                reject(err);
            else {
                const tasks = rows.map((elem) => ({
                    id: elem.id, description: elem.description, important: elem.important, private: elem.private,
                    deadline: elem.deadline ? elem.deadline.replace(" ", "T") : elem.deadline, completed: elem.completed, user: elem.user
                }));
                // Replace is only used to convert from sqlite data format YYYY-MM-DD HH:MM to iso format YYYY-MM-DDTHH:MM
                resolve(tasks);
            }
        });
    });
};

exports.listFiltered = (selectedFilter, userId) => {
    return new Promise((resolve, reject) => {
        const selectedFilterQueryString = filters.get(selectedFilter);
        const getFilteredTasks = "select * from tasks where user=?" + selectedFilterQueryString;
        console.log(getFilteredTasks);
        db.all(getFilteredTasks, [userId], function (err, rows) {
            if (err)
                reject(err);
            else {
                const tasks = rows.map((elem) => ({
                    id: elem.id, description: elem.description, important: elem.important, private: elem.private,
                    deadline: elem.deadline ? elem.deadline.replace(" ", "T") : elem.deadline, completed: elem.completed, user: elem.user
                }));
                resolve(tasks);
            }
        });
    });
};

exports.getTaskById = (id, userId) => {
    return new Promise((resolve, reject) => {
        db.get(`select * from tasks where id = ? and user = ?`, [id, userId], function (err, row) {
            if (err)
                reject(err);
            else {
                if (row == undefined) {
                    reject(errorNotFoundObject); //With resolve, it won't enter in the catch of the app.get, because it would be seen as a correct exam
                }
                else {
                    const task = {
                        id: row.id, description: row.description, important: row.important, private: row.private,
                        deadline: row.deadline ? row.deadline.replace(" ", "T") : row.deadline, completed: row.completed, user: row.user
                    };
                    resolve(task);
                }
            }
        });
    });
};

exports.createTask = (task, userId) => {
    return new Promise((resolve, reject) => {
        console.log(task);
        let query = `insert into tasks(description, important, private, deadline, completed, user)
                        values(?, ?, ?, ?, ?, ?)`;
        db.run(query, [task.description, task.important, task.private, task.deadline, task.completed, userId], function (err) {
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

exports.updateTask = (task, userId) => {
    return new Promise((resolve, reject) => {
        let query = `update tasks set description=?, important=?, private=?, deadline=?, completed=?, user=? where id=? and user = ?`;
        db.run(query, [task.description, task.important, task.private, task.deadline, task.completed, userId, task.id, userId], function (err) {
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

exports.setCompleted = (task, userId) => {
    return new Promise((resolve, reject) => {
        let query = `update tasks set completed=? where id=? and user=?`;
        db.run(query, [task.completed, task.id, userId], function (err) {
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

exports.deleteTask = (task, userId) => {
    return new Promise((resolve, reject) => {
        let query = `delete from tasks where id=? and user=?`;
        db.run(query, [task.id, userId], function (err) {
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