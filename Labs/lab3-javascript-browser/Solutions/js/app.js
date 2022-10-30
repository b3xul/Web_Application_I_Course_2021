'use strict';

// --- Definining Task & Task List --- //

function Task(id, description, isImportant = false, isPrivate = true, deadline = '') {
    this.id = id;
    this.description = description;
    this.important = isImportant;
    this.private = isPrivate;
    // deadline is saved as day.js object
    this.deadline = deadline && dayjs(deadline);

    // Getters
    this.isImportant = () => { return this.important; }
    this.isPrivate   = () => { return this.private;   }

    /** 
     * Function to check if a date is today. Returns true if the date is today, false otherwise.
     * @param {*} date the javascript Date to be checked
     */
    this.isToday =  () => {
        const comparisonTemplate = 'YYYY-MM-DD';
        const now = dayjs();
        return this.deadline && (this.deadline.format(comparisonTemplate) === now.format(comparisonTemplate));
    }

    /** 
     * Function to check if a date is yesterday. Returns true if the date is yesterday, false otherwise.
     * @param {*} date the javascript Date to be checked
     */
     this.isYesterday = () => {
        const comparisonTemplate = 'YYYY-MM-DD';
        const yesterday = dayjs().subtract(1, 'day');
        return this.deadline && (this.deadline.format(comparisonTemplate) === yesterday.format(comparisonTemplate));
    }

    /** 
     * Function to check if a date is tomorrow. Returns true if the date is tomorrow, false otherwise.
     * @param {*} date the javascript Date to be checked
     */
    this.isTomorrow = () => {
        const comparisonTemplate = 'YYYY-MM-DD';
        const tomorrow = dayjs().add(1, 'day');
        return this.deadline && (this.deadline.format(comparisonTemplate) === tomorrow.format(comparisonTemplate));
    }

    /**
     * Function to check if a date is in the next week. Returns true if the date is in the next week, false otherwise.
     * @param {*} date the javascript Date to be checked
     */
     this.isNextWeek = () => {
         const tomorrow = dayjs().add(1, 'day');
         const nextWeek = dayjs().add(7, 'day');
         const ret = this.deadline && ( !this.deadline.isBefore(tomorrow,'day') && !this.deadline.isAfter(nextWeek,'day') );
         console.dir(this.deadline);
         console.log(ret);
         return ret;
     }

     this.formatDeadline = () => {
        if(!this.deadline) return '--o--';
        else if(this.isToday(this.deadline)) {
            return this.deadline.format('[Today at] HH:mm');
        } else if(this.isTomorrow(this.deadline)) {
            return this.deadline.format('[Tomorrow at] HH:mm');
        } else if(this.isYesterday(this.deadline)) {
            return this.deadline.format('[Yesterday at] HH:mm');
        } else {
            return this.deadline.format('dddd DD MMMM YYYY [at] HH:mm');
        }
    }
}

function TaskList() {
    this.list = [];

    this.add = (task) => {
        if (!this.list.some(t => t.id == task.id))
            this.list = [...this.list, task];
        else throw new Error('Duplicate id');
    };


    this.filterAll = () => {
        // With this approach we return a copy of the list, not the list itself.
        return this.list.filter( () => true);
    }

    this.filterByImportant = () => {
        return this.list.filter((task) => task.isImportant());
    }

    this.filterByToday = () => {
        return this.list.filter( (task) => task.isToday() );
    }

    this.filterByNextWeek = () => {
        return this.list.filter( (task) => task.isNextWeek() );
    }

    this.filterByPrivate = () => {
        return this.list.filter( (task) => task.isPrivate() );
    }

}


// --- Functions Definitions --- //

/**
 * Function to create a single task encolsed in a <li> tag.
 * @param {*} task the task object.
 */
function createTaskNode(task) {
    const li = document.createElement('li');
    li.id = "task" + task.id;
    li.className = 'list-group-item';

    // creating a <div> for the checkbox and the label
    const innerDiv = document.createElement('div');
    innerDiv.className = 'custom-control custom-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = "check-t" + task.id;
    checkbox.className = 'custom-control-input';
    innerDiv.appendChild(checkbox);

    const descriptionLabel = document.createElement('label');
    descriptionLabel.className = 'custom-control-label'; // + ' description'
    if(task.important) descriptionLabel.className += ' important ';
    descriptionLabel.innerText = task.description;
    descriptionLabel.htmlFor = "check-t" + task.id;
    innerDiv.appendChild(descriptionLabel);

    // creating a higher <div>
    const externalDiv = document.createElement('div');
    externalDiv.className = 'd-flex w-100 justify-content-between';
    externalDiv.appendChild(innerDiv);

    const dateText = document.createElement('small');
    // dateText.className = 'date';
    dateText.innerText = task.formatDeadline();
    externalDiv.appendChild(dateText);

    // adding the sharing picture
    if (!task.private) {
        innerDiv.insertAdjacentHTML("afterend", `<svg class="bi bi-person-square" width="1.2em" height="1.2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M14 1H2a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V2a1 1 0 00-1-1zM2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2z" clip-rule="evenodd"/>
        <path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/>
      </svg>`);
    }

    // adding the externalDiv to the <li> before returning it.
    li.appendChild(externalDiv);
    return li;
}

/**
 * Function to create the <ul></ul> list of tasks, withouth any filters.
 */
function createListTasks(tasks) {
    const listTasks = document.getElementById("list-tasks");
    for (const task of tasks) {
        const taskNode = createTaskNode(task);
        listTasks.appendChild(taskNode);
    }
}

/**
 * Function to destroy the <ul></ul> list of tasks.
 */
function clearListTasks() {
    const listTasks = document.getElementById("list-tasks");
    listTasks.innerHTML = '';
}

/**
 * Function to manage task filtering in the web page.
 * @param {string}   filterId  The filter node id.
 * @param {string}   titleText The text to put in the task list content h1 header.
 * @param {function} filterFn  The function that does the filtering and returns an array of tasks.
 */
function filterTasks( filterId, titleText, filterFn ) {
    document.querySelectorAll('#left-sidebar div a ').forEach( node => node.classList.remove('active'));
    document.getElementById("filter-title").innerText = titleText;
    document.getElementById(filterId).classList.add('active');
    clearListTasks();
    createListTasks(filterFn());
}



// ----- Main ----- //
const taskList = new TaskList();
// Spread operator (...) cannot be applied to objects.
TASKS.forEach(t => { taskList.add(new Task(...t)); });
createListTasks(taskList.filterAll());
// ---------------- //


// --- Creating Event Listeners for filters --- //
document.getElementById("filter-all").addEventListener( 'click', event => 
    filterTasks( 'filter-all', 'All', taskList.filterAll )
);

document.getElementById("filter-important").addEventListener( 'click', event => 
    filterTasks( 'filter-important', 'Important', taskList.filterByImportant )
);

document.getElementById("filter-today").addEventListener( 'click', event => 
    filterTasks( 'filter-today', 'Today', taskList.filterByToday )
);

document.getElementById("filter-week").addEventListener( 'click', event => 
    filterTasks( 'filter-week', 'Next 7 Days', taskList.filterByNextWeek )
);

document.getElementById("filter-private").addEventListener( 'click', event => 
    filterTasks( 'filter-private', 'Private', taskList.filterByPrivate )
);
