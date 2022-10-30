const dayjs = require("dayjs");

function Exam(courseCode, name, CFU, date, score, laude) {
    this.courseCode = courseCode;
    this.name = name;
    this.CFU = CFU;
    this.score = score;
    this.laude = laude;
    this.date = date;

    this.toString = () => (`${this.courseCode} - ${this.name} = ${this.score} (${this.date})`);
}

function ExamList() {
    this.exams = [];
    this.add = (exam) => { this.exams.push(exam); };
    this.find = (courseCode) => { return this.exams.find(exam => exam.courseCode === courseCode); };
    this.afterDate = (targetDate) => { return this.exams.filter(exam => exam.date.isAfter(targetDate)); };
    this.listByDate = () => { return this.exams.sort((a, b) => a.date.diff(b.date)); };
    this.listByScore = () => { return this.exams.sort((a, b) => b.score - a.score); };
    this.average = () => { return (this.exams.reduce((sum, exam) => (sum + exam.score), 0) / this.exams.length); };
}

const sdp = new Exam('02XXX', 'System and Device Programming', 10, dayjs('2021-07-01'), 21);

const wa1 = new Exam('01KTF', 'Web Applications I', 6, dayjs('2021-06-01'), 30, true);

const exams = new ExamList();
exams.add(wa1);
exams.add(sdp);

console.log("FIND");
console.log(`${exams.find('01KTF')}`);
console.log(`${exams.find('031KTF')}`);

console.log("AFTER DATE");
console.log(exams.afterDate(dayjs('2021-06-15')).toString());
console.log("BY DATE");
console.log(exams.listByDate().toString());
console.log("BY SCORE");
console.log(exams.listByScore().toString());
console.log("AVERAGE");
console.log(exams.average());