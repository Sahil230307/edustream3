import express from 'express';
import {
  createAssignment,
  getAssignmentsByWebinar,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, createAssignment);
router.get('/webinar/:webinarId', getAssignmentsByWebinar);
router.put('/:id', verifyToken, verifyAdmin, updateAssignment);
router.delete('/:id', verifyToken, verifyAdmin, deleteAssignment);

export default router;
