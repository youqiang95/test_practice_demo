import { Router } from 'express';
import { getRoiData } from '../controllers/roi';
import { validateRoiQuery } from '../middleware/validation';

const router = Router();

router.get('/', validateRoiQuery, getRoiData);

export default router;
