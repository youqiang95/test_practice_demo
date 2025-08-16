import { Router } from 'express';
import { getRoiData } from '../controllers/roi';
import { importCsv } from '../controllers/dataImportController';
import { validateRequest } from '../middleware/validation';
import { csvUploadValidation } from '../middleware/csvUploadValidation';

const router = Router();

router.get('/roi', validateRequest, getRoiData);
router.post('/import_csv', validateRequest, csvUploadValidation, importCsv);

export default router;
