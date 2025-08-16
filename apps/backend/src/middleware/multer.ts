import multer from 'multer';
import path from 'path';
import { CSVFileTypeError } from '../types/errors';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../../temp/uploads/'));  // 修改上传目录到项目根目录下的temp/uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Check both extension and mimetype
    const isCsv = path.extname(file.originalname).toLowerCase() === '.csv' && 
                 file.mimetype === 'text/csv';
    
    if (isCsv) {
      cb(null, true);
    } else {
      cb(new CSVFileTypeError());
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export { upload };
