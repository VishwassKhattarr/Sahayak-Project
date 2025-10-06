import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass
} from '../models/Class.js';

// Get all classes
export const getClasses = (req, res) => {
  getAllClasses((err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
};

// Get class by ID
export const getClass = (req, res) => {
  getClassById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!results.length) return res.status(404).json({ message: 'Class not found' });
    res.json(results[0]);
  });
};

// Create a new class
export const addClass = (req, res) => {
  const { name, grade, teacher_id, year } = req.body;
  if (!name || !grade || !teacher_id) {
    return res.status(400).json({ message: 'Name, grade, and teacher_id are required' });
  }
  createClass(name, grade, teacher_id, year, (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(201).json({ message: 'Class created', classId: result.insertId });
  });
};

// Update a class
export const editClass = (req, res) => {
  const { name, grade, teacher_id, year } = req.body;
  updateClass(req.params.id, name, grade, teacher_id, year, (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Class updated' });
  });
};

// Delete a class
export const removeClass = (req, res) => {
  deleteClass(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'Class deleted' });
  });
};
