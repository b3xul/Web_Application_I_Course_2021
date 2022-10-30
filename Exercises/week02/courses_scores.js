'use strict' ;

function Exam(code, name, cfu, score, honors, datePassed) {
    this.code = code ;
    this.name = name ;
    this.cfu = cfu ;
    this.score = score ;
    this.honors = honors ;
    this.datePassed = datePassed ;

    this.toString = () => (`${this.code} - ${this.name} = ${this.score} (${this.datePassed})`) ;
}

function ExamList() {

    this.exams = [] ;
    
    this.add = (exam) => {
        this.exams.push(exam);
    };

    this.find = (courseCode) => {

        const result = this.exams.filter(ex => ex.code===courseCode) ;
        if (result.length===1)
            return result[0];
        else 
            return undefined ;
        return result && result[0] ; // []

    }

    this.afterDate = (givenDate) => {
        let result = new ExamList() ;
        this.exams.filter((exam)=> (exam.datePassed>=givenDate)).forEach((exam)=>{result.add(exam)}) ;
        return result;
    }

    this.listByDate = () => {
        let sortedList = [...this.exams] ;
        sortedList.sort(); // dates in ISO format are sorted as strings
        return sortedList ;
    }

    this.listByScore = () => {
        let sortedList = [...this.exams] ;
        sortedList.sort((a, b) => (b.score-a.score));
        return sortedList ;
    } ;

    this.average = () => ( this.exams.map((e)=>(e.score)).reduce((sum, val)=>(sum+val)) / this.exams.length  ) ;

    this.toString = () => ( this.exams.map((exam)=>(exam.toString())).join('\n') );
}


const wa1 = new Exam('01FXY', 'Web Applications I', 6, 28, false, '2021-02-10') ;
const db = new Exam('01ANC', 'Data Science and Stuff', 8, 25, false, '2021-03-11') ;

console.log(`${wa1}`) ;
console.log(`${db}`) ;

const myExams = new ExamList() ;
myExams.add(wa1);
myExams.add(db);

console.log('*** EXAM LIST ***');
console.log(myExams.toString());
// myExams.exams.push(wa1); // possible, but not recommended

console.log('*** EXAMS AFTER A DATE ***');
let recentExams = myExams.afterDate('2021-03-01');
console.log(recentExams.toString());

console.log('*** EXAMS SORTED BY DATE ***');
console.log(myExams.listByDate());

console.log('*** EXAMS SORTED BY SCORE ***');
console.log(myExams.listByScore());

console.log('*** AVERAGE ***');
console.log(myExams.average());


debugger ;