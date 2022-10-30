'use strict' ;
const sqlite = require('sqlite3') ;

const db = new sqlite.Database('numbers.sqlite', (err)=>{
    if(err) throw err ;
}) ;

function processMyData(rows) {
    // ...
}

db.all('SELECT * FROM number', (err, rows) =>{
    if(err)
        throw(err);
    else {
        for(let row of rows) {
            console.log(row.num);
        }
        console.log("Done!")
        processMyData() ;
    }
}) ;

db.close();