import fs from 'fs';
import { getTestRequest, TEST_CSV_PATH } from '../utils/test-utils';

describe('ROI API', () => {
  beforeAll(async () => {
    const request = getTestRequest();
    await request
      .post('/api/v1/data/import')
      .attach('file', fs.readFileSync(TEST_CSV_PATH), 'test.csv');
  });

  it('should return ROI data with valid parameters', async () => {
    const request = getTestRequest();
    const response = await request
      .get('/api/v1/rois')
      .query({ app: 'App-1', country: '美国' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toHaveProperty('app');
    expect(response.body[0]).toHaveProperty('country');
    expect(response.body[0].roi.daily).toBeCloseTo(0.0679);
    expect(response.body[0].roi.day1).toBeCloseTo(0.1424);
    expect(response.body[0].roi.day3).toBeCloseTo(0.273);
    expect(response.body[0].roi.day7).toBeCloseTo(0.6444);
  });

  it('should verify ROI values for App-2 in US', async () => {
    const request = getTestRequest();
    const response = await request
      .get('/api/v1/rois')
      .query({ app: 'App-2', country: '美国' });

    expect(response.status).toBe(200);
    expect(response.body[0].roi.daily).toBeCloseTo(0.0419);
    expect(response.body[0].roi.day1).toBeCloseTo(0.1474);
    expect(response.body[0].roi.day3).toBeCloseTo(0.1954);
  });

  it('should verify ROI values for App-3 in UK', async () => {
    const request = getTestRequest();
    const response = await request
      .get('/api/v1/rois')
      .query({ app: 'App-3', country: '英国' });

    expect(response.status).toBe(200);
    expect(response.body[0].roi.daily).toBeCloseTo(0.1192);
    expect(response.body[0].roi.day1).toBeCloseTo(0.2058);
    expect(response.body[0].roi.day3).toBeCloseTo(0.2728);
  });

  it('should return data with partial parameters', async () => {
    const request = getTestRequest();
    const response = await request
      .get('/api/v1/rois')
      .query({ app: 'App-1' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should return all data without parameters', async () => {
    const request = getTestRequest();
    const response = await request.get('/api/v1/rois');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should validate parameters', async () => {
    const request = getTestRequest();
    const response = await request
      .get('/api/v1/rois')
      .query({ app: 'Invalid-App', country: 'Invalid-Country' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
