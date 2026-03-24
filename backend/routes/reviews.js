import express from 'express';
import {
  addReview,
  getReviewsByWebinar,
  getWebinarRating,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, addReview);
router.get('/webinar/:webinarId', getReviewsByWebinar);
router.get('/rating/:webinarId', getWebinarRating);
router.put('/:id', verifyToken, updateReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;
