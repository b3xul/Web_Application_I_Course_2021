const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = new sqlite.Database('exams.sqlite', (err) => { if(err) throw err; });

function Exam(code, name, cfu, score, honors, datePassed) {
    this.code = code;
    this.name = name;
    this.cfu = cfu;
    this.score = score;
    this.honors = honors;
    this.datePassed = datePassed;

    this.toString = () => (`${this.code} - ${this.name} = ${this.score} (${this.datePassed.format('DD/MM/YYYY')})`);
}

function ExamList() {

    this.exams = [] ;
    
    this.add = (exam) => {
        this.exams.push(exam);
    };
    
    this.toString = () => ( this.exams.map((exam)=>(exam.toString())).join('\n') );
}


function getAll() {
    /*
     * Try query on db explorer first! (or vscode extension)
     * LEFT join shows all the tuples of the first, with second table's fields filled with null if there is not any tuple with the join condition satisfied
     *
     */
    const sql = `SELECT course.code, course.name, course.CFU, 
    score.score, score.laude, score.datepassed
    FROM course LEFT JOIN score ON course.code=score.coursecode` ;
    // backtick to write string on multiple lines

    return new Promise( (resolve, reject) => {
        db.all(sql, (err, rows) => {
            if(err)
                reject(err);
            else {
                let list = new ExamList() ;

                for( row of rows ) {
                    let exam = new Exam(
                        row.code, row.name, row.cfu, row.score, row.laude, dayjs(row.datepassed)
                    ) ;
                    list.add(exam) ;
                }

                resolve(list); //return ExamList Object
            }
        }) ;
    });
}

async function main() {
    let list = await getAll() ;
    console.log(list.toString());
}

main() ;