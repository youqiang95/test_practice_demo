import supertest from 'supertest';

const BASE_URL = 'http://localhost:3001';

export const getTestRequest = () => {
  return supertest(BASE_URL);
};

export const TEST_CSV_PATH = './test/data/test.csv';
