import { Router } from 'express';
import roiRouter from './roi';
import dataImportRouter from './data-import';

const router = Router();

router.use('/roi', roiRouter);
router.use('/import_csv', dataImportRouter);

export default router;
