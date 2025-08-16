export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, true, details);
    this.name = 'ValidationError';
  }
}

export class DataImportError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, true, details);
    this.name = 'DataImportError';
  }
}

export class CSVMissingRequiredFieldError extends DataImportError {
  field: string;
  
  constructor(field: string) {
    super(`Missing required field: ${field}`);
    this.field = field;
    this.name = 'CSVMissingRequiredFieldError';
  }
}

export class CSVFileTypeError extends DataImportError {
  constructor() {
    super('Only CSV files are allowed', { 
      allowedTypes: ['text/csv'],
      allowedExtensions: ['.csv']
    });
    this.name = 'CSVFileTypeError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 500, false, details);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 404, true, details);
    this.name = 'NotFoundError';
  }
}

export type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
  stack?: string;
};
