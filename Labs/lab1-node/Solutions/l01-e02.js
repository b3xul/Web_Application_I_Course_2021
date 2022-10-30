'use strict';

/*
DB STRUCTURE
CREATE TABLE tasks (
    id          INTEGER  PRIMARY KEY,
    description TEXT     NOT NULL,
    urgent      BOOLEAN  DEFAULT (0) NOT NULL,
    private     BOOLEAN  DEFAULT (1) NOT NULL,
    deadline    DATETIME
);
DATETIME FORMAT IS AS ISO 8601: 2018-04-04T16:00:00.000Z
*/

const sqlite = require("sqlite3");
const dayjs = require("dayjs");


// i18n and locale
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat); // use shortcuts 'LLL' for date and time format
/*
const locale_it = require('dayjs/locale/it');
dayjs.locale('it');
*/

function Task(id, description, isUrgent = false, isPrivate = true, deadline = '') {
  this.id = id;
  this.description = description;
  this.urgent = isUrgent;
  this.private = isPrivate;
  // saved as dayjs object
  this.deadline = deadline && dayjs(deadline);

  // dayjs().toString() prints GMT
  // LLL	stands for MMMM D, YYYY h:mm A see https://day.js.org/docs/en/display/format

  this.toString = () => {
    return `Id: ${this.id}, ` +
    `Description: ${this.description}, Urgent: ${this.urgent}, Private: ${this.private}, ` +
    `Deadline: ${this._formatDeadline('LLL')}`;
  }

  this._formatDeadline = (format) => {
    return this.deadline ? this.deadline.format(format) : '<not defined>';
  }
}

function TaskList() {

  const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

  this.getAll = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks' ;
      db.all(sql, [], (err, rows) => {
        if(err)
          reject(err);
        else {
          const tasks = rows.map(record => new Task(record.id, record.description, record.important == 1, record.private == 1, record.deadline));
          resolve(tasks);
        }
      });
    });
  };

  this.getAfterDeadline = (deadline) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE deadline > ?';
      db.all(sql, [deadline.format()], (err, rows) => {
        if(err)
          reject(err);
        else {
          const tasks = rows.map(record => new Task(record.id, record.description, record.important == 1, record.private == 1, record.deadline));
          resolve(tasks);
        }
      });
    });
  };

  this.getWithWord = (word) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM tasks WHERE description LIKE ?";
      db.all(sql, ["%" + word + "%"], (err, rows) => {
        if(err)
          reject(err);
        else {
          const tasks = rows.map(record => new Task(record.id, record.description, record.important == 1, record.private == 1, record.deadline));
          resolve(tasks);
        }
      });
    });
  };
}


async function main(data) {

  try {

    const taskList = new TaskList();
    // get all the tasks
    console.log("****** All the tasks in the database: ******");
    const tasks = await taskList.getAll();
    tasks.forEach( (task) => console.log(task.toString()) );

    //get tasks after a given deadline
    const deadline = dayjs('2021-03-13T09:00:00.000Z');
    console.log("****** Tasks after " + deadline.format() + ": ******");
    const futureTasks = await taskList.getAfterDeadline(deadline);
    futureTasks.forEach( (task) => console.log(task.toString()) );

    //get tasks with a given word in the description
    const word = "phone";
    console.log("****** Tasks containing '" + word + "' in the description: ******");
    const filteredTasks = await taskList.getWithWord(word);
    filteredTasks.forEach( (task) => console.log(task.toString()) );

    debugger;

  } catch (error) {
    console.error(error);
    return;
  }

}

main()
