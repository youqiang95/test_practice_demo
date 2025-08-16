import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../types/errors';
import { RoiQuerySchema } from '../types/api/roi';

export const validateRequest = (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  try {
    // 根据路由路径选择对应的schema
    if (req.path.includes('/roi')) {
      const result = RoiQuerySchema.safeParse(req.query);
      if (!result.success) {
        throw new ValidationError(
          'Invalid ROI query parameters',
          result.error.format()
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
