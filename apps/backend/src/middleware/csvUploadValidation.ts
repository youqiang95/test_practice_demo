import multer from 'multer';
import path from 'path';
import { CSVFileTypeError, DataImportError } from '../types/errors';
import { Request, Response, NextFunction } from 'express';

export const csvUploadValidation = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(new DataImportError('No file uploaded'));
    }
    
    const isCsv = path.extname(file.originalname).toLowerCase() === '.csv' && 
                 file.mimetype === 'text/csv';
    
    if (!isCsv) {
      return cb(new CSVFileTypeError());
    }

    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('file');
