'use strict';

function Exam(code, name, cfu, score, honors, datePassed) {
    this.code = code;
    this.name = name;
    this.cfu = cfu;
    this.score = score;
    this.honors = honors;  //We could already do additional checks, like honors can be true only if score===30
    this.datePassed = datePassed;

    this.toString = () => (`${this.code} - ${this.name} = ${this.score} (${this.datePassed})`);
}

function ExamList() {

    //Property of the "this" object
    this.exams = [];
    //let exams = [];

    //Functional property of the this object
    this.add = (exam) => {
        this.exams.push(exam);
        // exams.push(exam);    In this cas this will work using the closure feature, but this way is more general!
        //(But we want be able to access the exams property directly from outside the constructor,
        //because it will be private to the add function (neither by debugging). could be useful it we want to hide it)
    };

    this.find = (courseCode) => {

        const result = this.exams.filter(ex => ex.code === courseCode); //ex is the iterator of the this.exams array object of type Exam
        //result will be an empty array or an array which contains all exams with the courseCode passed as a parameter
        if (result.length === 1)
            return result[0];
        //return only the first element of the array if I found 1 (if more than 1 I could generate an exception)
        else
            return undefined;
        // or generate an exception: course not find

        /** If we want to return [] when nothing is found then we can also use: 
        *return result && result[0] ; returns [] if nothing was found, otherways return the first element of the array
        *   but since our function find expects exactly one result, we want it to return undefined, returning [] won't be equivalent
        */
    };

    this.afterDate = (givenDate) => {
        let result = new ExamList();
        this.exams.filter((exam) => (exam.datePassed >= givenDate)).forEach((exam) => { result.add(exam); });
        return result;
    };

    this.listByDate = () => {
        let sortedList = [...this.exams];
        sortedList.sort(); // dates in ISO format are sorted as strings
        return sortedList;
    };

    this.listByScore = () => {
        let sortedList = [...this.exams];
        sortedList.sort((a, b) => (b.score - a.score));
        return sortedList;
    };

    this.average = () => (this.exams.map((e) => (e.score)).reduce((sum, val) => (sum + val)) / this.exams.length);

    this.toString = () => (this.exams.map((exam) => (exam.toString())).join('\n'));
}


const wa1 = new Exam('01FXY', 'Web Applications I', 6, 28, false, '2021-02-10'); //wa1 is just an object created by the function Exam
//for now Date is still a string
//N.B. wa1 is an Object of Type Exam, which derives (inherits its properties) from Object (in fact __proto__=Object) 
// The prototype of the object also remembers that the constructor for that object was the function Exam
// THE Exam function itself also inherits its properties from Object but in this case it was constructed by the main Object constructor function

const db = new Exam('01ANC', 'Data Science and Stuff', 8, 25, false, '2021-03-11');

console.log(wa1);  //This returns the Type of the object (Exam) because the object remembers how it was created using an internal mechanism
//for representing objects, called prototypes + its representation(its properties)
//console.log hides many properties of the object which are not considered interesting to show!
console.log(`${wa1}`);
console.log(`${db}`);

const myExams = new ExamList();
myExams.add(wa1);
myExams.add(db);
//myExams now contains A FUNCTION CALLED ADD and an ARRAY of 2 objects of type Exam

console.log('*** EXAM LIST ***');
console.log(myExams.toString());
// myExams.exams.push(wa1); // possible, but not recommended (we don't have oop!)

console.log('*** EXAMS AFTER A DATE ***');
let recentExams = myExams.afterDate('2021-03-01');
console.log(recentExams.toString());

console.log('*** EXAMS SORTED BY DATE ***');
console.log(myExams.listByDate());

console.log('*** EXAMS SORTED BY SCORE ***');
console.log(myExams.listByScore());

console.log('*** AVERAGE ***');
console.log(myExams.average());

debugger;  // Special statement only interpreted in a debugging environment (ignored otherways)
            // that stops the code without closing the program, to give time to the compiler to reach the final part,
            // when program executes too fast and we can't see the result in the terminal due to a VS bug