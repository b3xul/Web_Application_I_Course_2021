/**
 * All the API calls
 */
 import Course from './models/Course';
 import Exam from './models/Exam';
 
 const BASEURL = '/api';
 
 async function getAllCourses() {
   // call: GET /api/courses
   const response = await fetch(BASEURL + '/courses');
   const coursesJson = await response.json();
   if (response.ok) {
     return coursesJson.map((co) => Course.from(co));
   } else {
     throw coursesJson;  // an object with the error coming from the server
   }
 }
 
 async function getAllExams() {
   // call: GET /api/exams
   const response = await fetch(BASEURL + '/exams');
   const examsJson = await response.json();
   if (response.ok) {
     return examsJson.map((ex) => Exam.from(ex));
   } else {
     throw examsJson;  // an object with the error coming from the server
   }
 }
 
 async function logIn(credentials) {
   let response = await fetch('/api/sessions', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(credentials),
   });
   if(response.ok) {
     const user = await response.json();
     return user.name;
   }
   else {
     try {
       const errDetail = await response.json();
       throw errDetail.message;
     }
     catch(err) {
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
 
 const API = {getAllCourses, getAllExams, logIn, logOut, getUserInfo};
 export default API;