// --- DATABASE REQUIREMENTS ---
// You need a 'classes' table with at least these columns:
// id (INT, PRIMARY KEY, AUTO_INCREMENT)
// name (VARCHAR)
// grade (VARCHAR)
// teacher_id (INT, FOREIGN KEY to users.id)
// year (VARCHAR)
// created_at (DATETIME)
//
// --- SQL TO CREATE TABLE ---
// CREATE TABLE classes (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   name VARCHAR(255) NOT NULL,
//   grade VARCHAR(50) NOT NULL,
//   teacher_id INT,
//   year VARCHAR(20),
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (teacher_id) REFERENCES users(id)
// );

import db from '../config/database.js';

export const getAllClasses = (cb) => {
  db.query('SELECT * FROM classes', cb);
};

export const getClassById = (id, cb) => {
  db.query('SELECT * FROM classes WHERE id = ?', [id], cb);
};

export const createClass = (name, grade, teacher_id, year, cb) => {
  db.query('INSERT INTO classes (name, grade, teacher_id, year) VALUES (?, ?, ?, ?)', [name, grade, teacher_id, year], cb);
};

export const updateClass = (id, name, grade, teacher_id, year, cb) => {
  db.query('UPDATE classes SET name = ?, grade = ?, teacher_id = ?, year = ? WHERE id = ?', [name, grade, teacher_id, year, id], cb);
};

export const deleteClass = (id, cb) => {
  db.query('DELETE FROM classes WHERE id = ?', [id], cb);
};
