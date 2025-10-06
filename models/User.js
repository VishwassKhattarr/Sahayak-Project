// User model helper functions for MySQL
// --- DATABASE REQUIREMENTS ---
// Table: users
// Columns: id, username, email, password, google_id, created_at

import db from '../config/database.js';

export const findUserByEmail = (email, cb) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return cb(err);
    cb(null, results[0]);
  });
};

export const findUserById = (id, cb) => {
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return cb(err);
    cb(null, results[0]);
  });
};

export const createUser = (username, email, password, cb) => {
  db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, result) => {
    if (err) return cb(err);
    cb(null, result.insertId);
  });
};
