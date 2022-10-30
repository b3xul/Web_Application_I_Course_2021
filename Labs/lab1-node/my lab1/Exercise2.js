"use strict";

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

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

// unique numerical id:required, textual description: required, Bool urgent, Bool private, date with or without time deadline: optional)
function Task(id, description, isUrgent = false, isPrivate = true, deadline) {
    this.id = Number(id);
    this.description = String(description);
    this.isUrgent = Boolean(isUrgent);
    this.isPrivate = Boolean(isPrivate);
    this.deadline = dayjs(deadline);

    //this.toString = () => { return `Id: ${this.id}, Description: ${this.description}, Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, Deadline: ${this.deadline}` };
    // since we have only 1 return value we can avoid using square brackets and return
    this.toString = () => (`Id: ${this.id}, Description: ${this.description}, Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, Deadline: ${(this.deadline.isValid()) ? this.deadline.format('MMMM D, YYYY hh:mm A') : "<not defined>"}`);

}

function TaskList() {
    this.tasks = [];

    this.add = (task) => { this.tasks.push(task); };

    this.sortAndPrint = (task) => {
        // If taskA is undefined, the result of the comparison will be 1 (taskA will end up later)
        // If taskB is undefined, the result of the comparison will be -1 (taskB will end up later)
        const sortFunction = (taskA, taskB) => ((taskA.deadline.isValid()) ? ((taskB.deadline.isValid()) ? taskA.deadline.diff(taskB.deadline) : -1) : 1);
        this.tasks.sort(sortFunction);
        console.log(this.toString());
    };

    this.filterAndPrint = () => {
        const filterFunction = (task) => task.isUrgent === true;
        this.tasks = this.tasks.filter(filterFunction);
        console.log(this.toString());
    };

    this.loadAll = () => {
        const query = "SELECT id, description, urgent, private, deadline FROM tasks";
        db.all(query, (err, rows) => {
            console.log("****** All tasks: ******");
            if (err) throw err;
            rows.forEach((row) => {
                const task = new Task(row.id, row.description, row.urgent, row.private, row.deadline);
                this.add(task);
                console.log(task.toString());
                //console.log(this.toString());
            });
        });
        //console.log(this.toString()); This is synchronous! Empty result!

        return;
    };
    this.loadAfter = (afterDate) => {
        const query = "SELECT id, description, urgent, private, deadline FROM tasks WHERE Deadline>?";
        db.all(query, [afterDate], (err, rows) => {
            console.log(`****** Tasks after ${afterDate}: ******`);
            if (err) throw err;
            rows.forEach((row) => {
                const task = new Task(row.id, row.description, row.urgent, row.private, row.deadline);
                this.add(task);
                console.log(task.toString());
                //console.log(this.toString());
            });
        });

        return;
    };

    this.loadSearch = (word) => {
        const query = "SELECT id, description, urgent, private, deadline FROM tasks WHERE description LIKE  '%' || ? || '%' ";
        //https://www.techonthenet.com/sqlite/functions/concatenate.php
        db.all(query, [word], (err, rows) => {
            console.log(`****** Tasks containing ${word}: ******`);
            //console.log(query);
            if (err) throw err;
            rows.forEach((row) => {
                const task = new Task(row.id, row.description, row.urgent, row.private, row.deadline);
                this.add(task);
                console.log(task.toString());
                //console.log(this.toString());
            });
        });

        return;
    };

    this.toString = () => (this.tasks.map((task) => (task.toString())).join('\n'));

}

const myTaskList = new TaskList();
myTaskList.loadAll();

const longTermTasks = new TaskList();
longTermTasks.loadAfter("2021-03-10");

const searchTasks = new TaskList();
searchTasks.loadSearch("lab");