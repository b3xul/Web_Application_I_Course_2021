'use strict' ;

// We are importing into our program the content of this module, and we have a variable that reference that library
const sqlite = require('sqlite3') ;

// We can create DB using SQL commands or GUIs like SQLite studio (create DB, tables, columns) or a vscode extension (SQLite explorer) for that
// Then we can copy that db to our project folder

// To access that we use the constructor function, but asynchronously (I wont't have the db available right after the invocation! )
// I must also provide a callback function that will handle the error (generating an exception)!
// I access the database function using the variable that represents the module
// The function takes a namefile as an argument and returns a reference to the created database
const db = new sqlite.Database('numbers.sqlite', (err)=>{
    if(err) throw err ;
}) ;

function processMyData(rows) {
    // ...
}

// We can use db.all because EITHER Database is a synchronous function (only in case of error it launches an asynchronous callback)
// OR the all function will internally wait until the db variable is ready to be used, before being executed!
// This adds another layer of complexity!
db.all('SELECT * FROM number', (err, rows) =>{
    if(err)
        throw(err);
    else {
        for(let row of rows) {
            // now we are sure that rows is not an error but the result:
            // rows is an array of objects rows
            // each row has a property for each column name and a value for each property
            console.log(row.num);
        }
        console.log("DoneA!");  // We are sure that DoneA will be printed AFTER ALL the row.num (procedural execution inside the callback!)
                                // We are also sure that nothing will be printed between the row.nums and DoneA because js is single thread,
                                // so, every time a callback begins its execution, it will keep being executed until it ends, before the flow goes in other parts!
                                // Exceptions are the only things that can stop execution of the whole program!
        processMyData() ;   // This function is executed when data is ready
    }
}) ;

console.log("DoneB!");  // We cannot know if DoneA is printed before or after DoneB!!!
db.close();