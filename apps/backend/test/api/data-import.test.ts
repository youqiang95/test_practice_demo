import fs from 'fs';
import path from 'path';
import { getTestRequest, TEST_CSV_PATH } from '../utils/test-utils';

describe('Data Import API', () => {

  it('should successfully import CSV file', async () => {
    const request = getTestRequest();
    const response = await request
      .post('/api/v1/data/import')
      .attach('file', fs.readFileSync(TEST_CSV_PATH), 'test.csv');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      count: expect.any(Number)
    });
  });

  it('should reject non-CSV files', async () => {
    const request = getTestRequest();
    const response = await request
      .post('/api/v1/data/import')
      .attach('file', Buffer.from('test'), 'test.txt');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'CSVFileTypeError',
      message: 'Only CSV files are allowed',
      statusCode: 400
    });
  });

  it('should handle empty files', async () => {
    const request = getTestRequest();
    const response = await request
      .post('/api/v1/data/import')
      .attach('file', Buffer.from(''), 'empty.csv');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'DataImportError',
      message: 'File is empty',
      statusCode: 400
    });
  });

  it('should validate CSV format', async () => {
    const invalidCsv = path.join(__dirname, '../data/invalid.csv');
    fs.writeFileSync(invalidCsv, 'invalid,header\n1,2');

    const request = getTestRequest();
    const response = await request
      .post('/api/v1/data/import')
      .attach('file', fs.readFileSync(invalidCsv), 'invalid.csv');

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'CSVFieldValidationError',
      statusCode: 400
    });
  });

  it('should handle no file uploaded', async () => {
    const request = getTestRequest();
    const response = await request.post('/api/v1/data/import');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'DataImportError',
      message: 'No file uploaded',
      statusCode: 400
    });
  });
});
