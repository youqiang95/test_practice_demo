import { Router } from 'express';
import { importCsv } from '../controllers/dataImportController';
import { upload } from '../middleware/multer';

const router = Router();

router.post('/', 
  (req, res, next) => {
    upload.single('file')(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  importCsv
);

export default router;
