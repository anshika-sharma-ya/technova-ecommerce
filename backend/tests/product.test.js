const request = require('supertest');
const app = require('../src/app');
const { sequelize, Category } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Category.create({ name: 'Gadgets', description: 'Tech items' });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product API Integration Tests', () => {
  test('GET /api/products - Should return product list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
