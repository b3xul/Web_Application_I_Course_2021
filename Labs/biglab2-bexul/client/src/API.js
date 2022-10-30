import { Task } from "./Task";

const url = 'http://localhost:3000';
const BASEURL = '/api';

async function loadAllTasks() {
    const response = await fetch(url + '/api/tasks');
    const tasks = await response.json();
    return tasks.map((task) => (new Task(task.id, task.description, task.important, task.private, task.deadline, task.completed, task.user)));
    // ERROR HANDLING
}

async function loadFilteredTasks(activeFilter) {
    const response = await fetch(url + `/api/tasks:filter/${activeFilter}`);
    const tasks = await response.json();
    console.log(tasks);
    if (tasks.errno)
        return tasks;
    return tasks.map((task) => (new Task(task.id, task.description, task.important, task.private, task.deadline, task.completed, task.user)));
    // ERROR HANDLING
}

async function addNewTask(task) {
    const response = await fetch(url + '/api/tasks', {  //initialization object for the request
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, deadline: (task.deadline) ? ((task.containsTime) ? task.deadline.format('YYYY-MM-DD HH:mm') : task.deadline.format('YYYY-MM-DD')) : null })
    });
    if (response.ok) {
        return (task);
    } else return ({ 'err': 'POST error' });

}

// async function addNewTaskSlow(task) {
//     return new Promise((resolve, reject) => {
//         setTimeout(async () => {

//             const response = await fetch(url + '/api/tasks', {  //initialization object for the request
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ ...task, deadline: (task.deadline) ? ((task.containsTime) ? task.deadline.format('YYYY-MM-DD HH:mm') : task.deadline.format('YYYY-MM-DD')) : null })
//             });
//             if (response.ok) {
//                 resolve(task);
//             } else resolve({ 'err': 'POST error' });

//         }, 3000);
//     });
// }

async function deleteTask(id) {
    const response = await fetch(url + `/api/tasks/${id}`, {  //initialization object for the request
        method: 'DELETE'
    });
    if (response.ok) {
        return (response);
    } else return ({ 'err': 'DELETE error' });

}


async function updateTask(task) {

    const response = await fetch(url + `/api/tasks/${task.id}`, {  //initialization object for the request
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, deadline: (task.deadline) ? ((task.containsTime) ? task.deadline.format('YYYY-MM-DD HH:mm') : task.deadline.format('YYYY-MM-DD')) : null })
    });
    if (response.ok) {
        return (task);
    } else return ({ 'err': 'POST error' });

}

// async function updateTaskSlow(task) {
//     return new Promise((resolve, reject) => {
//         setTimeout(async () => {
//             const response = await fetch(url + `/api/tasks/${task.id}`, {  //initialization object for the request
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ ...task, deadline: (task.deadline) ? ((task.containsTime) ? task.deadline.format('YYYY-MM-DD HH:mm') : task.deadline.format('YYYY-MM-DD')) : null })
//             });
//             if (response.ok) {
//                 resolve(task);
//             } else resolve({ 'err': 'POST error' });
//         }, 3000);
//     });
// }

async function setCompletedTask(id, completed) {

    const response = await fetch(url + `/api/tasks/${id}`, {  //initialization object for the request
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });
    if (response.ok) {
        return (response);
    } else return ({ 'err': 'POST error' });

}

// async function setCompletedTaskSlow(id, completed) {
//     return new Promise((resolve, reject) => {
//         setTimeout(async () => {
//             const response = await fetch(url + `/api/tasks/${id}`, {  //initialization object for the request
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ completed })
//             });
//             if (response.ok) {
//                 resolve(response);
//             } else resolve({ 'err': 'POST error' });
//         }, 3000);
//     });
// }

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user.name;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}


const API = { loadAllTasks, loadFilteredTasks, addNewTask, deleteTask, updateTask, setCompletedTask, logIn, logOut, getUserInfo };
export default API; // more convenient, reminds us that this function is calling the server!