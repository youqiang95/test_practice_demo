import { Router } from 'express';
import { getRoiData } from '../controllers/roi';
import { importCsv } from '../controllers/dataImportController';
import { validateRequest } from '../middleware/validation';
import { csvUploadValidation } from '../middleware/csvUploadValidation';

const router = Router();

router.get('/rois', validateRequest, getRoiData);
router.post('/data/import', validateRequest, csvUploadValidation, importCsv);

export default router;
