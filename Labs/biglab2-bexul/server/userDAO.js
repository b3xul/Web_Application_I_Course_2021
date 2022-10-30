'use strict';

const bcrypt = require('bcrypt');

const db = require('./db');

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";
        db.get(query, [email], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = { id: row.id, username: row.email, name: row.name };
                // check if the password is valid with bcrypt
                bcrypt.compare(password, row.hash).then(result => {
                    if (result)
                        resolve(user);
                    else
                        resolve(false);
                });
            }
        });
    });
};

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE id = ?";
        db.get(query, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found' });
            else {
                const user = { id: row.id, username: row.email, name: row.name };
                resolve(user);
            }
        });
    });
};