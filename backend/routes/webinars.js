import express from 'express';
import { 
  getAllWebinars, 
  getWebinarById, 
  createWebinar, 
  updateWebinar, 
  deleteWebinar, 
  searchWebinars 
} from '../controllers/webinarController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllWebinars);
router.get('/search', searchWebinars);
router.get('/:id', getWebinarById);
router.post('/', verifyToken, verifyAdmin, createWebinar);
router.put('/:id', verifyToken, verifyAdmin, updateWebinar);
router.delete('/:id', verifyToken, verifyAdmin, deleteWebinar);

export default router;
