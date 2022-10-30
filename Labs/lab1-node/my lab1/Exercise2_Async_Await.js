"use strict";
const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// unique numerical id:required, textual description: required, Bool urgent, Bool private, date with or without time deadline: optional)
function Task(id, description, isUrgent = false, isPrivate = true, deadline) {
    this.id = Number(id);
    this.description = String(description);
    this.isUrgent = Boolean(isUrgent);
    this.isPrivate = Boolean(isPrivate);
    this.deadline = (deadline) ? dayjs(deadline) : dayjs(null);
    //Day.js treats dayjs(undefined) as dayjs() due to that function parameters default to undefined when not passed in.
    //Day.js treats dayjs(null) as an invalid input.dayjs(deadline);

    //this.toString = () => { return `Id: ${this.id}, Description: ${this.description}, Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, Deadline: ${this.deadline}` };
    // since we have only 1 return value we can avoid using square brackets and return
    this.toString = () => (`Id: ${this.id}, Description: ${this.description}, Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, Deadline: ${(this.deadline.isValid()) ? this.deadline.format('MMMM D, YYYY hh:mm A') : "<not defined>"}`);

}

function TaskList() {

    const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

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

    this.addQueryResult = ((QueryResult) => {
        QueryResult.forEach((row) => {
            const task = new Task(row.id, row.description, row.urgent, row.private, row.deadline)
            this.add(task);
            console.log(task.toString());
        });
    });

    this.loadAll = async () => {
        return new Promise((resolve, reject) => {
            const query = "SELECT id, description, urgent, private, deadline FROM TASKS";
            db.all(query, (err, rows) => {
                console.log("****** All tasks: ******");
                if (err) reject(err);

                this.addQueryResult(rows);
                resolve(rows);
            });
            //console.log(this.toString()); This is synchronous! Empty result!
        });
    }
    this.loadAfter = async (afterDate) => {
        afterDate = dayjs(afterDate).format();
        return new Promise((resolve, reject) => {
            const query = "SELECT id, description, urgent, private, deadline FROM TASKS WHERE Deadline>?";
            db.all(query, [afterDate], (err, rows) => {
                console.log(`****** Tasks after ${afterDate}: ******`);
                if (err) reject(err);

                this.addQueryResult(rows);
                resolve(rows);
            });
        });
    }

    this.loadSearch = (word) => {
        /* Also without async, returning a promise is enough */
        return new Promise((resolve, reject) => {
            const query = "SELECT id, description, urgent, private, deadline FROM TASKS WHERE description LIKE  '%' || ? || '%' ";
            //https://www.techonthenet.com/sqlite/functions/concatenate.php
            db.all(query, [word], (err, rows) => {
                console.log(`****** Tasks containing ${word}: ******`);
                if (err) reject(err);

                this.addQueryResult(rows);
                resolve(rows);
            });
        });
    }

    this.toString = () => (this.tasks.map((task) => (task.toString())).join('\n'));

}

async function main() {
    try {
        const myTaskList = new TaskList();

        let queryResult = await myTaskList.loadAll().catch((err) => { console.log(err); throw err; });


        const longTermTasks = new TaskList();
        queryResult = await longTermTasks.loadAfter("2021-03-10").catch((err) => { console.log(err); throw err; });

        const searchTasks = new TaskList();
        queryResult = await searchTasks.loadSearch("lab").catch((err) => { console.log(err); throw err; });

        db.close(); /* Now we can finally do it since we are sure that we are not using the db anymore! */

        return;
    }
    catch (error) {
        return;
    }
}

main();
