// const request = require('supertest');
// const app = require('../app');

// describe('To-Do App', () => {
//   it('should load the homepage', async () => {
//     const res = await request(app).get('/');
//     expect(res.statusCode).toEqual(200);
//   });

//   it('should add a new task', async () => {
//     const res = await request(app)
//       .post('/tasks')
//       .send({ title: 'Test Task' });
//     expect(res.statusCode).toEqual(302);
//   });
// });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Import the Express app

describe('To-Do App', () => {
  let server;

  // Before all tests, start the server
  beforeAll(async () => {
    server = app.listen(0); // Use port 0 to let the OS assign a free port
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // After all tests, close the server and MongoDB connection
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should load the homepage', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('To-Do List'); // Adjust based on your homepage content
  });

  it('should add a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test Task' });
    expect(res.statusCode).toEqual(302); // Redirect after task creation
  });
});