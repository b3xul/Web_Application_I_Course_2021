'use strict';

/* Data Access Object (DAO) module for accessing tasks */

const db = require('./db');

const dayjs = require("dayjs");
const isToday = require('dayjs/plugin/isToday');
dayjs.extend(isToday);

// ** FILTER DEFINITIONS AND HELPER FUNCTIONS **
const filters = {
  'all': { label: 'All', id: 'filter-all', filterFn: () => true },
  'important': { label: 'Important', id: 'filter-important', filterFn: t => t.important },
  'today': { label: 'Today', id: 'filter-today', filterFn: t => t.deadline && t.deadline.isToday() },
  'nextweek': { label: 'Next 7 Days', id: 'filter-nextweek', filterFn: t => isNextWeek(t.deadline) },
  'private': { label: 'Private', id: 'filter-private', filterFn: t => t.private },
};

const isNextWeek = (d) => {
  const tomorrow = dayjs().add(1, 'day');
  const nextWeek = dayjs().add(7, 'day');
  const ret = d && (!d.isBefore(tomorrow, 'day') && !d.isAfter(nextWeek, 'day'));
  return ret;
}

// WARNING: all DB operations must check that the tasks belong to the loggedIn user, thus include a WHERE user=? check !!!

// get all courses
exports.listTasks = (user, filter) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks WHERE user=?';
    db.all(sql, [user], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const tasks = rows.map((e) => {
        return Object.assign({}, e, { deadline: e.deadline && dayjs(e.deadline) })
      });
      if (filter && filters[filter])
        resolve(tasks.filter(filters[filter].filterFn));
      else resolve(tasks);
    });
  });
};

// get the course identified by {code}
exports.getTask = (user, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM tasks WHERE id=? and user=?';
    db.get(sql, [id, user], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Task not found.' });
      } else {
        const task = { ...row }; 
        resolve(task);
      }
    });
  });
};


// add a new task
// the task id is added automatically by the DB, and it is returned as result
exports.createTask = (task) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO tasks (description, important, private, deadline, completed, user) VALUES(?, ?, ?, ?, ?, ?)';
    db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, task.user], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(exports.getTask(this.lastID));
    });
  });
};

// update an existing task
exports.updateTask = (user, id, task) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE tasks SET description = ?, important = ?, private = ?, deadline = ?, completed = ? WHERE id = ? and user = ?';
    db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, id, user], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(exports.getTask(id)); // changed from resolve(exports.getTask(this.lastID) because of error "not found" (wrong lastID)
    });
  });
};

// delete an existing task
exports.deleteTask = (user, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM tasks WHERE id = ? and user = ?';
    db.run(sql, [id, user], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

