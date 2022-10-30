# `react-score-server`

The `react-score-server` is the server-side app companion of [`react-scores`](https://github.com/polito-wa1-aw1-2021/react-scores). It presents some APIs to perform CRUD operations on a student's university exams.

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### List Courses

URL: `/api/courses`

HTTP Method: GET

Description: Retrieve the list of all the course

Request body: EMPTY

Response: 

Response body:
```
[ {code, name, CFU}, {code, name, CFU} ]
```

### Get a Course

URL: `/api/courses/:code`

HTTP Method: GET

Description: Retrieve the attributes of the course with the specified code

Request body: EMPTY

Response: 

Response body:
```
{code, name, CFU}
```

### List Exams

### Get an Exams

### Add a new exam

URL: `/api/exams`

HTTP Method: POST

Description: 

Request body: `{ code, score, date }`

Response: EMPTY

Response body:
