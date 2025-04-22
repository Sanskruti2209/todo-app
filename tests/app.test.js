// // const request = require('supertest');
// // const app = require('../app');

// // describe('To-Do App', () => {
// //   it('should load the homepage', async () => {
// //     const res = await request(app).get('/');
// //     expect(res.statusCode).toEqual(200);
// //   });

// //   it('should add a new task', async () => {
// //     const res = await request(app)
// //       .post('/tasks')
// //       .send({ title: 'Test Task' });
// //     expect(res.statusCode).toEqual(302);
// //   });
// // });
// const request = require('supertest');
// const mongoose = require('mongoose');
// const app = require('../app'); // Import the Express app

// describe('To-Do App', () => {
//   let server;

//   // Before all tests, start the server
//   beforeAll(async () => {
//     server = app.listen(0); // Use port 0 to let the OS assign a free port
//     await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/testdb', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   });

//   // After all tests, close the server and MongoDB connection
//   afterAll(async () => {
//     await mongoose.connection.close();
//     server.close();
//   });

//   it('should load the homepage', async () => {
//     const res = await request(app).get('/');
//     expect(res.statusCode).toEqual(200);
//     expect(res.text).toContain('To-Do List'); // Adjust based on your homepage content
//   });

//   it('should add a new task', async () => {
//     const res = await request(app)
//       .post('/tasks')
//       .send({ title: 'Test Task' });
//     expect(res.statusCode).toEqual(302); // Redirect after task creation
//   });

//   it('should handle empty task title', async () => {
//     const res = await request(app)
//       .post('/tasks')
//       .send({ title: '' });
//     expect(res.statusCode).toEqual(302); // Matches current behavior
//   });

// });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Task = require('../models/Task'); // Import Task model

describe('To-Do App', () => {
  let server;

  // Before all tests, start server and connect to MongoDB
  beforeAll(async () => {
    server = app.listen(0); // Dynamic port
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Clear database before each test
  beforeEach(async () => {
    await Task.deleteMany({});
  });

  // After all tests, close server and MongoDB connection
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  // Helper function to create a task
  async function createTask(title = 'Test Task') {
    const res = await request(app)
      .post('/tasks')
      .send({ title });
    return res;
  }

  it('should load the homepage', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('To-Do List');
  });

  it('should add a new task', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test Task' });
    expect(res.statusCode).toEqual(302);
    const tasks = await Task.find();
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Test Task');
  });

  it('should handle empty task title', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: '' });
    expect(res.statusCode).toEqual(302); // Adjust if app validates empty titles
    const tasks = await Task.find();
    expect(tasks.length).toBe(0); // Assuming empty titles are rejected
  });

  it('should edit an existing task', async () => {
    const createRes = await createTask('Old Task');
    const task = await Task.findOne({ title: 'Old Task' });
    const res = await request(app)
      .post(`/tasks/${task._id}/edit`)
      .send({ title: 'Updated Task' });
    expect(res.statusCode).toEqual(302);
    const updatedTask = await Task.findById(task._id);
    expect(updatedTask.title).toBe('Updated Task');
  });

  it('should delete a task', async () => {
    const createRes = await createTask('Task to Delete');
    const task = await Task.findOne({ title: 'Task to Delete' });
    const res = await request(app)
      .post(`/tasks/${task._id}/delete`);
    expect(res.statusCode).toEqual(302);
    const tasks = await Task.find();
    expect(tasks.length).toBe(0);
  });

  it('should handle invalid task ID for edit', async () => {
    const res = await request(app)
      .get('/tasks/123456789012/edit'); // Invalid ObjectId
    expect(res.statusCode).toEqual(404); // Adjust based on app behavior
  });

  it('should retrieve edit page for a task', async () => {
    const createRes = await createTask('Task for Edit');
    const task = await Task.findOne({ title: 'Task for Edit' });
    const res = await request(app)
      .get(`/tasks/${task._id}/edit`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Task for Edit');
  });

  it('should render tasks on homepage', async () => {
    await createTask('Task 1');
    await createTask('Task 2');
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Task 1');
    expect(res.text).toContain('Task 2');
  });

  it('should handle multiple task additions', async () => {
    await createTask('Task A');
    await createTask('Task B');
    await createTask('Task C');
    const tasks = await Task.find();
    expect(tasks.length).toBe(3);
    expect(tasks.map(t => t.title)).toContain('Task A');
    expect(tasks.map(t => t.title)).toContain('Task B');
    expect(tasks.map(t => t.title)).toContain('Task C');
  });
});