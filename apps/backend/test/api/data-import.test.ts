import fs from 'fs';
import path from 'path';
import { getTestRequest, TEST_CSV_PATH } from '../utils/test-utils';
import { transformRow } from '../../src/controllers/dataImportController';

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

describe('transformRow function', () => {
  it('should handle normal ROI values', () => {
    const row = {
      date: '2025-04-13(日)',
      app: 'App-1',
      bidType: 'CPI',
      country: '美国',
      installs: '4849',
      dailyRoi: '6.79%',
      roi1d: '14.24%',
      roi3d: '27.30%',
      roi7d: '64.44%',
      roi14d: '120.89%',
      roi30d: '214.65%',
      roi60d: '368.42%',
      roi90d: '413.81%'
    };

    const result = transformRow(row, 1);
    expect(result.dailyRoi).toBeCloseTo(0.0679);
    expect(result.roi1d).toBeCloseTo(0.1424);
    expect(result.roi90d).toBeCloseTo(4.1381);
  });

  it('should keep dailyRoi as 0', () => {
    const row = {
      date: '2025-04-13(日)',
      app: 'App-1',
      bidType: 'CPI',
      country: '美国',
      installs: '4849',
      dailyRoi: '0%',
      roi1d: '14.24%',
      roi3d: '27.30%',
      roi7d: '64.44%',
      roi14d: '120.89%',
      roi30d: '214.65%',
      roi60d: '368.42%',
      roi90d: '413.81%'
    };

    const result = transformRow(row, 1);
    expect(result.dailyRoi).toBe(0);
    expect(result.roi1d).toBeCloseTo(0.1424);
  });

  it('should set ROI to null when previous ROI is positive', () => {
    const row = {
      date: '2025-04-13(日)',
      app: 'App-1',
      bidType: 'CPI',
      country: '美国',
      installs: '4849',
      dailyRoi: '6.79%',
      roi1d: '14.24%',
      roi3d: '0%',  // Should be set to null
      roi7d: '64.44%',
      roi14d: '120.89%',
      roi30d: '0%',  // Should be set to null
      roi60d: '368.42%',
      roi90d: '413.81%'
    };

    const result = transformRow(row, 1);
    expect(result.roi3d).toBeNull();
    expect(result.roi30d).toBeNull();
    expect(result.roi60d).toBeCloseTo(3.6842);
  });

  it('should keep consecutive zeros as zeros', () => {
    const row = {
      date: '2025-04-13(日)',
      app: 'App-1',
      bidType: 'CPI',
      country: '美国',
      installs: '4849',
      dailyRoi: '0%',
      roi1d: '0%',
      roi3d: '0%',
      roi7d: '0%',
      roi14d: '0%',
      roi30d: '0%',
      roi60d: '0%',
      roi90d: '0%'
    };

    const result = transformRow(row, 1);
    expect(result.dailyRoi).toBe(0);
    expect(result.roi1d).toBe(0);
    expect(result.roi90d).toBe(0);
  });

  it('should handle partial zeros from certain ROI onward', () => {
    const row = {
      date: '2025-04-13(日)',
      app: 'App-1',
      bidType: 'CPI',
      country: '美国',
      installs: '4849',
      dailyRoi: '6.79%',
      roi1d: '14.24%',
      roi3d: '27.30%',
      roi7d: '0%',  // 从这里开始后面全部为0
      roi14d: '0%',
      roi30d: '0%',
      roi60d: '0%',
      roi90d: '0%'
    };

    const result = transformRow(row, 1);
    expect(result.roi7d).toBeNull();  // 因为前一个(roi3d)为正数
    expect(result.roi14d).toBeNull(); // 因为前一个(roi7d)为null
    expect(result.roi30d).toBeNull(); // 因为前一个(roi14d)为null
    expect(result.roi60d).toBeNull(); // 因为前一个(roi30d)为null
    expect(result.roi90d).toBeNull(); // 因为前一个(roi60d)为null
  });
});
