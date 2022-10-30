# BigLab 2 - Class: 2021 WA1

## Team name: PPPTeam

Team members:
* s292507 Perugini Leonardo
* s290158 Sattolo Francesco
* s282241 Pintaldi Lorenzo
* s281759 Piccirillo Angelo Oscar

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]

### List Tasks

- GET `/api/tasks`

- Retrieve the list of all the available tasks

- Request: `GET http://localhost:3001/api/tasks`

- Response head: `HTTP/1.1 200 OK`
- Response body: `[ {id, description, important, private, deadline, completed, user }, {id, description, important, private, deadline, completed, user },.. ]` or `[]`

- Error response: 

### List Filtered Tasks 

- GET `/api/tasks/filter/:filter`

- Retrieve the list of all the tasks that fulfill a given filter

- Request: `GET http://localhost:3001/api/tasks:filter/Important`

- Response head: `HTTP/1.1 200 OK`
- Response body: `[ { id, description, important(:1), private, deadline, completed, user }, {id, description, important(:1), private, deadline, completed, user },.. ]` or `[]`

- Error request:  `GET /api/tasks:filter`
- Error head: `HTTP/1.1 404 Not Found`
- Error body: `Not Found`

### Get a Task

- GET `/api/tasks/:id`

- Retrieve a task, given its "id"

- Request: `GET http://localhost:3001/api/tasks/4`

- Response head: `HTTP/1.1 200 OK`
- Response body: `{ id, description, important, private, deadline, completed, user }`

- Error request:  `GET /api/tasks/99`
- Error head: `HTTP/1.1 500 Internal Server Error` 
- Error body: `{"Error": "Task not found."}`

### Create a Task

- POST `/api/tasks`

- Create a new Task providing all information except the id

- Request: `POST http://localhost:3001/api/tasks/`
- Request body: ` {"description": "fare una torta", "important":true, "private":false, "deadline":"", "completed":false, "user":1} `

- Response head: `HTTP/1.1 200 OK`
- Response body: `{ id, description, important, private, deadline, completed, user }`

- Error request:  `POST /api/tasks`
- Error request body: Malformed task
- Error head: `HTTP/1.1 500 Internal Server Error` 
- Error body: `{"Error": "Wrong parameters!"}`

### Update a Task

- PUT `/api/tasks/:id`

- Update a task, given its "id"

- Request: `PUT http://localhost:3001/api/tasks/5`
- Request body: ` {"description": "Watch the new lecture", "important":true, "private":false, "deadline":"", "completed":false, "user":1} `

- Response head: `HTTP/1.1 200 OK`
- Response body: `{ id, description, important, private, deadline, completed, user }`

- Error request:  `PUT /api/tasks/`
- Error head: `HTTP/1.1 404 Not Found`
- Error body: `Not Found`

- Error request:  `PUT /api/tasks/99`
- Error head: `HTTP/1.1 500 Internal Server Error` 
- Error body: `{"Error": "Task not found."}`

- Error request:  `PUT /api/tasks/5`
- Error request body: Malformed task
- Error head: `HTTP/1.1 500 Internal Server Error` 
- Error body: `{"Error": "Wrong parameters!"}`

### Mark a Task as completed/uncompleted

- PATCH `/api/tasks/:id`

- Mark a task as completed/uncompleted, given its "id"

- Request: `PATCH http://localhost:3001/api/tasks/5`
- Request body: `{completed:true}` or `{completed:false}`

- Response head: `HTTP/1.1 200 OK`
- Response body: `{ completed:5 }` or `{ uncompleted:5 }`

- Error request:  `PATCH /api/tasks/`
- Error head: `HTTP/1.1 404 Not Found`
- Error body: `Not Found`

- Error request:  `PATCH /api/tasks/99`
- Error head: `HTTP/1.1 500 Internal Server Error` 
- Error body: `{"Error": "Task not found."}`

- Error request:  `PATCH /api/tasks/5`
- Error request body: Malformed json request body
- Error head: `HTTP/1.1 500 Internal Server Error` 
- Error body: `{"Error": "Wrong parameters!"}`

### Delete a Task

- DELETE `/api/tasks/:id`

- Delete a task, given its "id"

- Request: `DELETE http://localhost:3001/api/tasks/5`

- Response head: `HTTP/1.1 200 OK`

- Response body: `{ deleted: 5 }`

- Error request:  `DELETE /api/tasks`
- Error head: `HTTP/1.1 404 Not Found`
- Error body: `Not Found`

- Error request:  `DELETE /api/tasks/99`
- Error head: `HTTP/1.1 500 Internal Server Error` 
- Error body: `{"Error": "Task not found."}`

### Test Users
#### User 1
- Username: example@polito.it
- Password: provaprovap
#### User 2
- Username: lorenzo@polito.it
- Password: lorenzo99

