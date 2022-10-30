'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('data.sqlite',
    (err) => { if (err) throw err; });

function countRows() {  // async is not necessary because they already return promises
    /*  This will execute asynchronous code 
        the only synchronous operation is the return */
    return new Promise((resolve, reject) => {
        // this will be executed sooner or later AFTER the creation of the promise (and the "then", if present, since synchronous code can't be interrupted )
        db.all('select count(*) as tot from numbers',   (err, rows) => {// this will be executed when the query has completed
                                                                            if (err) {
                                                                                reject(err);    // Promise failed!
                                                                            } else {
                                                                                resolve(rows[0].tot);   // Return value is the content of the rows (like queries.js)
                                                                            }
                                                                        }
        );
        // DB.CLOSE() (Open and close connection for every query that I want to do)
    });
}

//console.log("before");
//countRows().then( (val) => { console.log(val); });    This is way cleaner than nesting it inside the callback!
// val is rows[0].tot
//console.log("after"); THIS IS A DANGEROUS ZONE TO WRITE CODE! Since it is synchronous code, we could have also write that BEFORE the asynchronous call, so there is no need to write anything after an asynchronous code!!!
// THIS PRINTS BEFORE, AFTER, RESULT, because we are saying "print before", "schedule the promise callback to run sooner or later", "print after", "start of all scheduled asynchronous functions", "return values of asynchronous functions in unpredictable order"
// N.B. DB.ALL CAN ONLY POSSIBILY START FROM HERE (END OF SYNCHRONOUS CODE!) (if there are other promises, I don't know who will start first)
// I CAN'T CLOSE THE DB HERE because I may not have yet opened it! db.close is internally asynchronous, so I don't know who will execute first (db.all or db.close)!

// Where should I close the db? It depends on the program! I could close it after the final query's then() -> then(..).finally( () => {db.close();} );
// For us it is not a big problem because often the kind of programs that we are coding are infinite loops (eg. Web Server)
// So we won't ever need to close the connection to the db! (Only before shutting down the program!)
// In other synchronous programs we could put it in a callback of a terminate function.

async function insertNumber() { // async is not necessary because they already return promises
    return new Promise((resolve, reject) => {
        db.run('insert into numbers(number) values(1)', (err) => {
                                                                    if (err) { reject(err); }
                                                                    else resolve(true); //Always return a value even if we don't need to! 
                                                                 }
        );
    });
}
//insertNumber(); We could also not having anything to do after!
// for (let i = 0; i < 100; i++) { insertNumber().then( () => {countRows().then(val) => {console.log(val);}})};
// This makes so that each countRows is executed AFTER the insert, but since countRows is itself a callback, we do not know if it will be executed before the next insertNumber or not!
// In this case the scheduler decides to execute all the insertNumber FIRST, and then all the countRows, so we get always the same number as a result!
// We only have a partial ordering! (It will work if we only did 1 iteration)
// Some functions are intrinsecally asynchronous because the resources on which they operate are asynchronous (timers, user events, file system, db access, network access..)

async function stupid() {
    return 3 ;  // Immediate Promise: immediately resolves to 3
}

async function main() { // await can only be used inside asynchronous function,
                        // so that awaits does not block the execution of the whole program!
                        // While main is await, it attends insertNumber or countRows, other async function can execute! No performance lost!

    // (for debugging no step by step but I can use breakpoints)

    let st = await stupid() ;

    for (let i = 0; i < 100; i++) {
        try {

        await insertNumber();   //await will "convert"(make that happen) "resolve" to the return value and "reject" into an exception
                                //async will "convert" the return value to "resolve" and exception into a "reject"
                                // Work is all Promise based, but hidden using those keywords!
        }
        catch(err){
            //handle error
        }
        let tot = await countRows();    // slower program! (needs to wait! But now it is correct!)
        
        //OPPURE let tot = await insertNumber().then(_ => {return countRows();});
        // blocks next iteration until countRows is completed!

        console.log(tot);
        // THIS FINALLY SOLVES THE PROBLEM!
    }
    db.close() ;
    return 3 ; // will be converted to a Promise (because inside asynch function)
}

main() ;    // The only synchronous operation is this!

// db.close() ; // could be executed before main