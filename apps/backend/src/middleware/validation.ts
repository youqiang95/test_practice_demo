import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../types/errors';

const ALLOWED_APPS = ['App-1', 'App-2', 'App-3', 'App-4', 'App-5'] as const;
const ALLOWED_COUNTRIES = ['美国', '英国'] as const;

const RoiQuerySchema = z.object({
  app: z.enum(ALLOWED_APPS).optional(),
  country: z.enum(ALLOWED_COUNTRIES).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export type RoiQueryParams = z.infer<typeof RoiQuerySchema>;

export const validateRoiQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = RoiQuerySchema.safeParse(req.query);
  if (!result.success) {
    throw new ValidationError(
      'Invalid query parameters',
      result.error.format()
    );
  }
  next();
};
