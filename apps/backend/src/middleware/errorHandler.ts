import { ErrorRequestHandler } from 'express';
import multer from 'multer';
import { AppError, ErrorResponse } from '../types/errors';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Handle custom AppError instances
  if (err instanceof AppError) {
    console.log('=============== AppError ============')
    console.log(err)
    const errorResponse: ErrorResponse = {
      error: err.name,
      message: err.message,
      statusCode: err.statusCode,
      details: err.details
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = err.stack;
    }

    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle other unexpected errors
  console.error('Unexpected error:', err);
  
  const errorResponse: ErrorResponse = {
    error: 'InternalServerError',
    message: 'Internal server error',
    statusCode: 500
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err?.stack;
  }

  res.status(500).json(errorResponse);
};
