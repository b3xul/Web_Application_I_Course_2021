'use strict';

const express = require('express');
const morgan = require('morgan');
const PORT = 3001;

const flip = require('flip-text');

const app = express();
app.use(morgan("dev"));

// GET /api/flip?text=ABC
// return JSON { text: '***' }
// {"text":"Ɔ𐐒∀"}

app.get('/api/flip', (req, res) => {
    const text = req.query.text;
    const flipped = flip(text);
    res.json({ text: flipped });
});

app.listen(PORT, () => { console.log(`Server started at http://localhost:${PORT}/`); });