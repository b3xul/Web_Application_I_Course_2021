'use strict' ;

const express = require('express') ;
const morgan = require('morgan') ;

const app = express() ;
const PORT = 3000 ;

app.use(morgan('dev')) ;

app.get('/', (req, res) => {
    res.send('Hello World, from you server');
}) ;

app.listen(PORT, ()=> {console.log(`Server started at http://localhost:${PORT}/`)})