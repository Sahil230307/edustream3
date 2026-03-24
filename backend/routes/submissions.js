import express from 'express';
import {
  submitAssignment,
  getSubmissionsByAssignment,
  getMySubmissions,
  gradeSubmission
} from '../controllers/submissionController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', verifyToken, submitAssignment);
router.get('/my-submissions', verifyToken, getMySubmissions);
router.get('/assignment/:assignmentId', verifyToken, verifyAdmin, getSubmissionsByAssignment);
router.put('/grade/:id', verifyToken, verifyAdmin, gradeSubmission);

export default router;
