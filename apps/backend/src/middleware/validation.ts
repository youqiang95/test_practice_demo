import { Request, Response, NextFunction } from 'express';
import { RoiQueryParams } from '../types/roi';

export const validateRoiQuery = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const query = req.query as unknown as RoiQueryParams;
  
  if (query.startDate && isNaN(Date.parse(query.startDate))) {
    return res.status(400).json({ error: 'Invalid startDate format' });
  }

  if (query.endDate && isNaN(Date.parse(query.endDate))) {
    return res.status(400).json({ error: 'Invalid endDate format' });
  }

  next();
};
