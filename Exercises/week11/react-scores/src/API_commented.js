const url = 'http://localhost:3000';

async function loadAllCourses() {
    const response = await fetch(url + '/api/courses');
    const courses = await response.json();
    return courses.map((c) => ({ ...c, coursecode: c.code }));  // needed because in the db the field is called code while in the client it is called coursecode 
    // ERROR HANDLING
}

async function loadAllExams() {
    const response = await fetch(url + '/api/exams');
    const exams = await response.json();
    return exams.map((e) => ({ ...e, coursecode: e.code }));
    // ERROR HANDLING
}

/**
 * Send a POST /api/exams
 * returns and error object if something is wrong
 * return null if everything is ok
 * @param {*} exam 
 */
async function addNewExam(exam) {
    const response = await fetch(url + '/api/exams', {  //initialization object for the request
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...exam, code: exam.coursecode }) // from object containing coursecode property to object containing code property (conversion at server level, if this api is ok with someone passing extra object that it doesn't need (exam))
    });
    if (response.ok) {
        return null;
    } else return { 'err': 'POST error' };
}

async function addNewExamSlow(exam) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            let result = await addNewExam(exam);
            resolve(result);
        }, 1000);
    });
}

const API = { loadAllCourses, loadAllExams, addNewExam, addNewExamSlow };
export default API; // more convenient, reminds us that this function is calling the server!