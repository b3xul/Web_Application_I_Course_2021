'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('data.sqlite',
    (err) => { if (err) throw err; });

function countRows() {
    return new Promise((resolve, reject) => {
        db.all('select count(*) as tot from numbers',
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0].tot);
                }
            }
        );
    });
}

async function insertNumber() {
    return new Promise((resolve, reject) => {
        db.run('insert into numbers(number) values(1)',
            (err) => {
                if (err) { reject(err); }
                else resolve(true);
            });
    });
}

async function stupid() {
    return 3 ;
}

async function main() {

    let st = await stupid() ;

    for (let i = 0; i < 100; i++) {
        await insertNumber();
        let tot = await countRows();
        // let tot = await insertNumber().then(_ => {return countRows();});

        console.log(tot);
    }
    db.close() ;
    return 3 ; // will be converted to a Promise
}

main() ;
// db.close() ; // NOOO