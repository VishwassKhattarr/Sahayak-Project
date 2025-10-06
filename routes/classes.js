import express from 'express';
import {
  getClasses,
  getClass,
  addClass,
  editClass,
  removeClass
} from '../controllers/classController.js';

const router = express.Router();

// Get all classes
router.get('/', getClasses);

// Get a class by ID
router.get('/:id', getClass);

// Create a new class
router.post('/', addClass);

// Update a class
router.put('/:id', editClass);

// Delete a class
router.delete('/:id', removeClass);

export default router;
