import express from 'express';
import { 
  registerForWebinar, 
  getMyRegistrations, 
  unregister, 
  getWebinarRegistrations,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../controllers/registrationController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', verifyToken, registerForWebinar);
router.get('/my-registrations', verifyToken, getMyRegistrations);
router.delete('/unregister/:webinarId', verifyToken, unregister);
router.get('/webinar/:webinarId', verifyToken, verifyAdmin, getWebinarRegistrations);

router.post('/wishlist', verifyToken, addToWishlist);
router.delete('/wishlist/:webinarId', verifyToken, removeFromWishlist);
router.get('/wishlist/my-wishlist', verifyToken, getWishlist);

export default router;
