const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth & RBAC Integration Tests', () => {
  let userToken;
  let adminToken;

  test('POST /api/auth/register - Should register a new customer', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Intern',
      email: 'intern@test.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toEqual('customer');
    userToken = res.body.token;
  });

  test('POST /api/auth/login - Should login customer successfully', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'intern@test.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  test('RBAC Middleware - Customer should be DENIED access to Admin Product Creation', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Forbidden Item',
        price: 100,
        categoryId: 1,
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toContain('Forbidden');
  });
});
