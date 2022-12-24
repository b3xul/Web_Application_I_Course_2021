# BigLab 2 - Class: 2021 WA1 - AW1 A-L - AW1 M-Z

## Team name: Web Applicaction Teaching Assistants team®

Team members:

* s123456 Antonio Servetti
* s123456 Luca Mannella
* s123456 Alberto Monge Roffarello
* s123456 Juan Pablo Sáenz

## Users Registered

| email | password | name |
|-------|----------|------|
| john.doe@polito.it | password | John |
| johnny.cage@polito.it | password | Johnny |

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

### Task Management

#### Get all tasks

* HTTP method: `GET`  URL: `/api/tasks`
* Description: Get the full list of tasks or the tasks that match the query filter parameter, and belong to the logged user
* Request body: _None_
* Request query parameter: _filter_ name of the filter to apply
* Response: `200 OK` (success)
* Response body: Array of objects, each describing one task:

``` JSON
[{
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
}]
```

* Error responses:  `500 Internal Server Error` (generic error)

#### Get task by id

* HTTP method: `GET`  URL: `/api/tasks/:id`
* Description: Get the task corresponding to the id (if it belongs to the current logged user)
* Request body: _None_
* Response: `200 OK` (success)
* Response body: One object describing the required task:

``` JSON
[{
    "id": 2,
    "description": "Go for a walk",
    "important": 1,
    "private": 1,
    "deadline": "2021-04-14 08:30",
    "completed": 1,
    "user": 1
}]
```

* Error responses:  `500 Internal Server Error` (generic error), `404 Not Found` (not present or unavailable)


### Add a new task

* HTTP method: `POST`  URL: `/api/tasks`
* Description: Add a new task to the tasks of the logged user
* Request body: description of the object to add (user propery is ignored and substituted with the id of the logged user, task id value is not required and is ignored)

``` JSON
{
    "description": "Play hockey",
    "important": 1,
    "private": 0,
    "deadline": "2021-05-10 08:30",
    "completed": 0,
    "user": 1
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses:  `422 Unprocessable Entity` (values do not satisfy validators), `503 Service Unavailable` (database error)

### Update an existing task

* HTTP method: `PUT`  URL: `/api/tasks/:id`
* Description: Update values of an existing task (except the id) of the logged user
* Request body: description of the object to update

``` JSON
{
    "id": 20,
    "description": "Play hockey",
    "important": 1,
    "private": 0,
    "deadline": "2021-05-10 08:30",
    "completed": 0,
    "user": 1
}
```

* Response: `200 OK` (success)
* Response body: the object as represented in the database

* Error responses:  `422 Unprocessable Entity` (values do not satisfy validators), `503 Service Unavailable` (database error)


### Delete an existing task

* HTTP method: `DELETE`  URL: `/api/tasks/:id`
* Description: Delete an existing task of the logged user
* Request body: _None_

* Response: `200 OK` (success)
* Response body: an empty object

* Error responses:  `500 Internal Server Error` (generic error)


### User management

#### Login

* HTTP method: `POST`  URL: `/api/sessions`
* Description: authenticate the user who is trying to login
* Request body: credentials of the user who is trying to login

``` JSON
{
    "username": "username",
    "password": "password"
}
```

* Response: `200 OK` (success)
* Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
}
```
* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)


#### Check if user is logged in

* HTTP method: `GET`  URL: `/api/sessions/current`
* Description: check if current user is logged in and get her data
* Request body: _None_
* Response: `200 OK` (success)

* Response body: authenticated user

``` JSON
{
    "id": 1,
    "username": "john.doe@polito.it", 
    "name": "John"
}
```

* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)


#### Logout

* HTTP method: `DELETE`  URL: `/api/sessions/current`
* Description: logout current user
* Request body: _None_
* Response: `200 OK` (success)

* Response body: _None_

* Error responses:  `500 Internal Server Error` (generic error), `401 Unauthorized User` (user is not logged in)
