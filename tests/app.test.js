const request = require('supertest');
const app = require('../app');

describe('To-Do App', () => {
  it('should load the homepage', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });

  it('should add a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test Task' });
    expect(res.statusCode).toEqual(302);
  });
});