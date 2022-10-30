"use strict";
document.addEventListener('DOMContentLoaded', (event) => {

    //const dayjs = require('dayjs');;

    dayjs.extend(window.dayjs_plugin_calendar);
    dayjs.extend(window.dayjs_plugin_isBetween);
    dayjs.extend(window.dayjs_plugin_customParseFormat);
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

        this.timeofday = (dayjs(deadline, 'YYYY-MM-DDTHH:mm').isValid()) ? true : false;    //avoid printing 00:00 if time not specified during creation phase
        this.deadline = (deadline) ? dayjs(deadline, ["YYYY-MM-DD", "YYYY-MM-DDTHH:mm"]) : dayjs(null);

        if (this.deadline.isValid()) {
            this.html_deadline = (this.timeofday) ?
                `<div class="col-4">` +
                (this.deadline.calendar(dayjs(), {
                    sameDay: '[Today at] HH:mm', // The same day ( Today at 14:30  )
                    nextDay: '[Tomorrow at] HH:mm', // The next day ( Tomorrow at 14:30  )
                    nextWeek: 'dddd [at] HH:mm', // The next week ( Sunday at 14:30  )
                    lastDay: '[Yesterday at] HH:mm', // The day before ( Yesterday at 14:30  )
                    lastWeek: '[Last] dddd [at] HH:mm', // Last week ( Last Monday at 14:30  )
                    sameElse: 'dddd D MMMM YYYY [at] HH:mm' // Everything else ( 17/10/2011 )
                })
                ) + `</div>`
                :
                `<div class="col-4">` +
                (this.deadline.calendar(dayjs(), {
                    sameDay: '[Today]', // The same day ( Today at 14:30  )
                    nextDay: '[Tomorrow]', // The next day ( Tomorrow at 14:30  )
                    nextWeek: 'dddd', // The next week ( Sunday at 14:30  )
                    lastDay: '[Yesterday] ', // The day before ( Yesterday at 14:30  )
                    lastWeek: '[Last] dddd', // Last week ( Last Monday at 14:30  )
                    sameElse: 'dddd D MMMM YYYY' // Everything else ( 17/10/2011 )
                })
                ) + `</div>`;
        }
        else
            this.html_deadline = ``;

        //Day.js treats dayjs(undefined) as dayjs() due to that function parameters default to undefined when not passed in.
        //Day.js treats dayjs(null) as an invalid input.dayjs(deadline);

        if (typeof isUrgent != "boolean") throw new Error('urgent must be a Boolean');
        else
            this.isUrgent = Boolean(isUrgent);

        if (typeof isPrivate != "boolean") throw new Error('private must be a Boolean');
        else {
            this.isPrivate = Boolean(isPrivate);
            this.html_private = (this.isPrivate ? `` : `
            <div class="col-1">
                <svg width="16" height="16">
                    <use href="#Share_icon"></use>
                </svg>
            </div>`);
        }

        if (typeof description != "string") throw new Error('description must be a String');
        else {
            this.description = description;
            this.descriptionSize = 12 - (!this.isPrivate) - 4 * (this.deadline.isValid());
            // description size can occupy 7, 8, 11, or 12 cols depending on the data present
            this.html_description = `<div class="col-` + this.descriptionSize + ` custom-control custom-checkbox">
            <input type="checkbox" class="custom-control-input" id="check-t`+ this.id + `">
            <label class="custom-control-label `+ (this.isUrgent ? `important` : ``) + `" for="check-t` + this.id + `">
            `+ this.description + `
            </label>
            </div>`;
        }

        this.html_fragment = `
        <li class="list-group-item" id="task-item-`+ this.id + `">
            <div class="row d-flex justify-content-between">`+
            this.html_description +
            this.html_private +
            this.html_deadline +
            `</div>
        </li >
        `;

        //console.log(html_fragment););
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

        this.displayOnPage = (listSection) => {
            listSection.innerHTML += this.html_fragment;
            //console.log(listSection);
        };
    }

    function TaskList() {
        this.tasks = [];
        const filterNameHeaderSection = document.getElementById('list_header');
        filterNameHeaderSection.insertAdjacentHTML("afterend", ` <!-- List of tasks -->
    <ul class="list-group list-group-flush row" id="tasks">
    </ul>`);
        this.listSection = document.getElementById('tasks');
        //console.log(listSection);

        this.add = (task) => {
            try {
                // Check sui duplicati prima dell'inserimento!
                if (this.tasks.some((present_task) => present_task.id === task.id) === false) {
                    this.tasks.push(task);
                    task.displayOnPage(this.listSection);
                }
                else throw new Error('Duplicate task id');
            }
            catch (error) {
                console.log(error);
            }
        };

        this.sortByDeadline = (taskA, taskB) => ((taskA.deadline.isValid()) ? ((taskB.deadline.isValid()) ? taskA.deadline.diff(taskB.deadline) : -1) : 1);

        this.sortAndPrint = (task) => {
            //console.log("****** Tasks sorted by deadline (most recent first): ******");
            // If taskA is undefined, the result of the comparison will be 1 (taskA will end up later)
            // If taskB is undefined, the result of the comparison will be -1 (taskB will end up later)

            this.tasks.sort(this.sortByDeadline);
            //console.log(this.toString());
        };

        this.filterAndPrint = (filterFunction) => {
            //console.log("****** Tasks filtered, only (urgent == true): ******");
            //this.tasks = this.tasks.filter(this.filterByUrgent); In this case we don't modify the internal data structure, but just the external view!

            //const task_elements = document.querySelectorAll(".task-item");
            //task_elements.forEach((elem) => { if (elem.querySelector(".custom-control-label").classList.contains("important") === false) elem.classList.add("d-none"); });

            this.tasks.forEach((task) => {
                const task_element = document.getElementById(`task-item-` + task.id);
                if (filterFunction(task) === false) {
                    //filter out
                    task.html_fragment = `
                    <li class="list-group-item d-none" id="task-item-`+ this.id + `">
                        <div class="row d-flex justify-content-between">`+
                        task.html_description +
                        task.html_private +
                        task.html_deadline +
                        `</div>
                    </li >
                    `;
                    task_element.classList.add("d-none");
                }
                else if (task_element.classList.contains("d-none")) {
                    //make element visible again
                    task_element.classList.remove("d-none");
                }
            });

            //console.log(this.toString());   //prints all the tasks present inside the internal data structure
        };

        this.toString = () => (this.tasks.map((task) => (task.toString())).join('\n'));
        /* OTHER SOL this.tasks.forEach((task) => console.log(task.toString()));*/

    }

    function AllFilter(task) { return true; };    //select all tasks
    function isUrgentFilter(task) { return task.isUrgent === true; };   //select urgent tasks
    function TodayFilter(task) { return task.deadline.isSame(dayjs(), 'day') === true; };
    function PrivateFilter(task) { return task.isPrivate === true; };
    function NextDaysFilter(n) {
        const ending_date = dayjs().add(n, 'day');
        //closure!
        return (task) => { return task.deadline.isBetween(dayjs(), ending_date) === true; }; //from tomorrow included
    };
    //this function returns a filter function

    function main() {
        $(".collapse").on('show.bs.collapse', function () {
            document.querySelector("main").classList.add('closer_main');
        });
        $(".collapse").on('hide.bs.collapse', function () {
            document.querySelector("main").classList.remove('closer_main');
        });

        const myTaskList = new TaskList();
        const TASKS = [
            //Task(id, description, isUrgent = false, isPrivate = true, deadline)
            [1, "Eat lunch", false],
            [2, "laundry", true, false], //text+public icon
            [3, "Follow lab", false, true, '2021-03-22T14:30'],    //text+date
            [4, "Follow PdS lecture", true, false, '2021-04-02T14:30'],   //text+public icon+date
            [5, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", false, false, '2021-03-15T13:20:00.000Z'],    //long text+public icon+date
            [6, "domani", false, true, '2021-04-03'],    //text+date
            [7, "3 giorni", false, true, '2021-04-05T14:30'],    //text+date
            [8, "7 giorni", false, true, '2021-04-09'],    //text+date
            [9, "8 giorni", false, true, '2021-04-10'],    //text+date
            [10, "Complete Lab 3", false, true, "2021-03-29T14:30:00"],
            [11, "Buy some groceries", false, false, "2021-03-30T14:00:00"],
            [12, "Read a good book!", true, true],
            [13, "Watch Mr. Robot", false, true, "2021-03-25T21:30:00"],
        ];

        TASKS.forEach(t => { myTaskList.add(new Task(...t)); });

        console.log(`${myTaskList}`);

        let activeElement = document.querySelector(".active");

        document.querySelector(".list-group").addEventListener('click', (event) => {
            document.getElementById("filter_name_h1").innerText = event.target.text;
            activeElement.classList.remove("active");
            event.target.classList.add("active");
            activeElement = event.target;
            switch (event.target.text) {
                case "All":
                    myTaskList.filterAndPrint(AllFilter);
                    break;
                case "Important":
                    myTaskList.filterAndPrint(isUrgentFilter);
                    break;
                case "Today":
                    myTaskList.filterAndPrint(TodayFilter);
                    break;
                case "Next 7 Days":
                    myTaskList.filterAndPrint(NextDaysFilter(7));
                    break;
                case "Private":
                    myTaskList.filterAndPrint(PrivateFilter);
                    break;
                default:
                    break;
            }
        });

        //myTaskList.sortAndPrint();

        //myTaskList.toString();

        //debugger;
    }

    main();
});