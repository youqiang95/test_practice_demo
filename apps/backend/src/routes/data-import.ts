import { Router } from 'express';
import { importCsv } from '../controllers/dataImportController';
import { upload } from '../middleware/multer';

const router = Router();

router.post('/', upload.single('file'), importCsv);

export default router;
