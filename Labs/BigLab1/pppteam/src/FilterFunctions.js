function filterBy(activeFilter, taskList) {
    let filteredTasks = [];

    switch (activeFilter) {
        case "All":
            filteredTasks = filterAll(taskList);
            break;
        case "Important":
            filteredTasks = filterByImportant(taskList);
            break;
        case "Today":
            filteredTasks = filterByToday(taskList);
            break;
        case "Next 7 Days":
            filteredTasks = filterByNextWeek(taskList);
            break;
        case "Private":
            filteredTasks = filterByPrivate(taskList);
            break;
        default:
            break;

    };
    return filteredTasks;
};

function filterAll(taskList) {
    // With this approach we return a copy of the list, not the list itself.
    return taskList.filter(() => true);
};

function filterByImportant(taskList) {
    return taskList.filter((task) => task.isImportant());
};

function filterByToday(taskList) {
    return taskList.filter((task) => task.isToday());
};

function filterByNextWeek(taskList) {
    return taskList.filter((task) => task.isNextWeek());
};

function filterByPrivate(taskList) {
    return taskList.filter((task) => task.isPrivate());
};

export { filterBy };