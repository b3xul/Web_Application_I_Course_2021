import { Task } from './Task'
import dayjs from 'dayjs';

async function loadTaskList(filter) {
    let response = undefined;
    if (filter === 'All')
        response = await fetch('/api/tasks');
    else
        response = await fetch(`/api/tasks:filter/${filter}`);
    if (response.ok) {
        const list = await response.json();
        //setTaskList(list.map((t) => new Task(t.ID, t.description, t.important, t.private, t.deadline, t.completed)));
        return list.map((t) => new Task(t.ID, t.description, t.important, t.private, t.deadline, t.completed));
    }
    else {
        console.log("Error in loading the tasklist");
        return undefined;
    }
}

async function deleteTask(task) {
    fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: task.id })
    }).then((res) => {
        if (res.ok)
            console.log("Task deleted");
        //props.addTask(new Task(id, description, important, !shared, deadline));
    }).catch((err) => console.log(err));
}

async function updateTask(task) {
    fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: task.id, description: task.description, important: task.important === true ? 1 : 0, private: task.private === true ? 1 : 0,
            deadline: task.deadline === undefined ? null : dayjs(task.deadline).format('YYYY-MM-DD HH:mm'), completed: task.completed, user: 1
        })
    }).then((res) => {
        if (res.ok)
            console.log("Task updated");
        //props.addTask(new Task(id, description, important, !shared, deadline));
    }).catch((err) => console.log(err));
}

async function addTask(task) {
    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: task.id, description: task.description, important: task.important === true ? 1 : 0, private: task.private === true ? 1 : 0,
            deadline: task.deadline === undefined ? null : dayjs(task.deadline).format('YYYY-MM-DD HH:mm'), completed: task.completed, user: 1
        })
    }).then((res) => {
        if (res.ok)
            console.log("Task added");
        //props.addTask(new Task(id, description, important, !shared, deadline));
    }).catch((err) => console.log(err));
}

async function setCompleted(id, value) {
    fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, v: value })
    }).then((res) => {
        if (res.ok)
            console.log("Task changed");
    }).catch((err) => console.log(err));
}

async function logIn(credentials) {
    let response = await fetch('/api/login', {
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
    await fetch('/api/logout/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch('/api/login/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

const API = { loadTaskList, deleteTask, updateTask, addTask, setCompleted, logIn, logOut, getUserInfo };

export { API }