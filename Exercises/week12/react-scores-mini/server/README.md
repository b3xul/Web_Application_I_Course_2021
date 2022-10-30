# `react-score-server-mini`

The `react-scores-server-mini` is the server-side app companion of `react-scores-mini` (contained in the `client` folder). It presents two APIs to get the student's university exams.

## APIs
Hereafter, we report the designed (courses|exams) HTTP APIs, also implemented in the project.

### __List Courses__

URL: `/api/courses`

Method: GET

Description: Get all the courses that the student needs to pass.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a course.
```
[{
    "code": "01TYMOV",
    "name": " Information systems security ",
    "CFU": 6
}, {
    "code": "02LSEOV",
    "name": " Computer architectures ",
    "CFU": 10
},
...
]
```

### __List Exams__

URL: `/api/exams`

Method: GET

Description: Get all the exams that the student already passed.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing an exam.
```
[{
    "code": "02LSEOV",
    "score": 25,
    "date": "2021-02-01"
},
...
]
```