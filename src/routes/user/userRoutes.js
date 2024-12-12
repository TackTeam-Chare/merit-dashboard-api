import express from 'express';
import TouristEntityController from '../../controllers/user/PlacesController.js';

const router = express.Router();

router.post('/api/user', TouristEntityController.saveReview);
router.get('/api/specialfeatures', TouristEntityController.specialfeatures);
export default router;