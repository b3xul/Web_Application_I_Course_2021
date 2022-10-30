/**
 * All the API calls
 */

import dayjs from 'dayjs';

const BASEURL = '/api';

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

          // always return {} from server, never null or non json, otherwise it will fail
          response.json()
            .then(json => resolve(json))
            .catch(err => reject({ error: "Cannot parse server response" }));

        } else {
          // analyze the cause of error
          response.json()
            .then(obj => reject(obj)) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch(err => reject({ error: "Cannot communicate" })); // connection error
  });
}

const getTasks = async (filter) => {
  return getJson(
    filter
      ? fetch(BASEURL + '/tasks?filter=' + filter)
      : fetch(BASEURL + '/tasks')
  ).then(json => {
    return json.map((task) => Object.assign({}, task, { deadline: task.deadline && dayjs(task.deadline) }));
  });
};

function addTask(task) {
  return getJson(
    fetch(BASEURL + "/tasksw", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...task, completed: false, user: 1 })
    })
  );
}

function updateTask(task) {
  return getJson(
    fetch(BASEURL + "/tasks/" + task.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...task, user: 1 })
    })
  );
}

function deleteTask(task) {
  return getJson(
    fetch(BASEURL + "/tasks/" + task.id, {
      method: 'DELETE'
    })
  );
}

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
    return user;
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
    throw userInfo;  // an object with the error coming from the server, mostly unauthenticated user
  }
}

const API = { addTask, getTasks, updateTask, deleteTask, logIn, logOut, getUserInfo };
export default API;

