-- SQLite
SELECT course.code, course.name, course.CFU, score.score, score.laude, score.datepassed
FROM course LEFT JOIN score ON course.code=score.coursecode
