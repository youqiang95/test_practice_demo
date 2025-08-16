import fs from 'fs';
import { getTestRequest, TEST_CSV_PATH } from '../utils/test-utils';

describe('ROI API', () => {
  beforeAll(async () => {
    const request = getTestRequest();
    await request
      .post('/api/v1/import_csv')
      .attach('file', fs.readFileSync(TEST_CSV_PATH), 'test.csv');
  });

  it('should return ROI data with valid parameters', async () => {
    const request = getTestRequest();
    const response = await request
      .get('/api/v1/roi')
      .query({ app: 'App-1', country: '美国' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('app');
    expect(response.body[0]).toHaveProperty('country');
  });

  it('should return data with partial parameters', async () => {
    const request = getTestRequest();
    const response = await request
      .get('/api/v1/roi')
      .query({ app: 'App-1' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should return all data without parameters', async () => {
    const request = getTestRequest();
    const response = await request.get('/api/v1/roi');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should validate parameters', async () => {
    const request = getTestRequest();
    const response = await request
      .get('/api/v1/roi')
      .query({ app: 'Invalid-App', country: 'Invalid-Country' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
