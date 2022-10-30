"use strict";
const dayjs = require('dayjs');

/* OTHER SOL
i18n (internationalization and localization) and locale
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat); // use shortcuts 'LLL' for date and time format

const locale_it = require('dayjs/locale/it');
dayjs.locale('it');
*/

// unique numerical id:required, textual description: required, Bool urgent, Bool private, date with or without time deadline: optional)
function Task(id, description, isUrgent = false, isPrivate = true, deadline) {

    if (typeof id != "number") throw new Error('id must be a Number');
    else
        this.id = id;
    if (typeof description != "string") throw new Error('description must be a String');
    else
        this.description = description;
    if (typeof isUrgent != "boolean") throw new Error('urgent must be a Boolean');
    else
        this.isUrgent = Boolean(isUrgent);
    if (typeof isPrivate != "boolean") throw new Error('private must be a Boolean');
    else
        this.isPrivate = Boolean(isPrivate);

    this.deadline = (deadline) ? dayjs(deadline) : dayjs(null);
    //Day.js treats dayjs(undefined) as dayjs() due to that function parameters default to undefined when not passed in.
    //Day.js treats dayjs(null) as an invalid input.dayjs(deadline);

    /* Alternative to try to validate
    try {}
    catch (error) {
        console.log(error);
        this.id = null;
        return;
    }*/

    //this.toString = () => { return `Id: ${this.id}, Description: ${this.description}, Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, Deadline: ${this.deadline}` };
    // since we have only 1 return value we can avoid using square brackets and return
    this.toString = () => (`Id: ${this.id}, Description: ${this.description}, ` +
        `Urgent: ${this.isUrgent}, Private: ${this.isPrivate}, ` +
        `Deadline: ${(this.deadline.isValid()) ? this.deadline.format('MMMM D, YYYY hh:mm A') : "<not defined>"}`);
    /* OTHER SOL (LLL=	MMMM D, YYYY h:mm A	August 16, 2018 8:02 PM)
    `Deadline: ${this._formatDeadline('LLL')}`;
    this._formatDeadline = (format) => {
        return this.deadline ? this.deadline.format(format) : '<not defined>';
    }*/
}

function TaskList() {
    this.tasks = [];

    this.add = (task) => {
        try {
            // Check sui duplicati prima dell'inserimento!
            if (this.tasks.some((present_task) => present_task.id === task.id) === false)
                this.tasks.push(task);
            else throw new Error('Duplicate task id');
        }
        catch (error) {
            console.log(error);
        }
    };

    this.sortByDeadline = (taskA, taskB) => ((taskA.deadline.isValid()) ? ((taskB.deadline.isValid()) ? taskA.deadline.diff(taskB.deadline) : -1) : 1);

    this.sortAndPrint = (task) => {
        console.log("****** Tasks sorted by deadline (most recent first): ******");
        // If taskA is undefined, the result of the comparison will be 1 (taskA will end up later)
        // If taskB is undefined, the result of the comparison will be -1 (taskB will end up later)

        this.tasks.sort(this.sortByDeadline);
        console.log(this.toString());
    };

    this.filterByUrgent = (task) => task.isUrgent === true;

    this.filterAndPrint = () => {
        console.log("****** Tasks filtered, only (urgent == true): ******");
        this.tasks = this.tasks.filter(this.filterByUrgent);
        console.log(this.toString());
    };

    this.toString = () => (this.tasks.map((task) => (task.toString())).join('\n'));
    /* OTHER SOL this.tasks.forEach((task) => console.log(task.toString()));*/

}

function main() {
    const task1 = new Task(1, "Eat lunch", true);

    const task2 = new Task(2, "Follow lab", true, false, dayjs('2021-03-15T13:00'));
    /* alternative to try to validate
    const task2 = null;
    try {
        task2 = new Task("a", "Follow lab", true, false, dayjs('2021-03-15T13:00'));
    } catch (error) {
        console.log(error);
    }*/
    const task3 = new Task(3, "Follow PdS lecture", false, false, dayjs('2021-03-15T14:30'));
    const task4 = new Task(4, "phone call", true, false, dayjs('2021-03-15T13:20:00.000Z'));
    const task5 = new Task(5, "laundry", false, true);
    //console.log(task1);
    //console.log(`${task1}`);

    const myTaskList = new TaskList();
    myTaskList.add(task1);
    myTaskList.add(task2);
    myTaskList.add(task3);
    myTaskList.add(task4);
    myTaskList.add(task5);
    //console.log(myTaskList);
    console.log(`${myTaskList}`);


    myTaskList.sortAndPrint();

    myTaskList.toString();
    myTaskList.filterAndPrint();

    debugger;
}

main();