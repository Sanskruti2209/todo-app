To-Do List App
A simple To-Do List application built with Node.js, Express, MongoDB, and EJS.
Features

Add new tasks
View all tasks
Edit task title and completion status
Delete tasks

Prerequisites

Node.js (v16 or later)
MongoDB (local or MongoDB Atlas)
Docker (optional, for containerization)

Setup

Clone the repository:git clone <repository-url>
cd todo-app


Install dependencies:npm install


Create a .env file in the root directory:MONGO_URI=mongodb://localhost:27017/todoapp
PORT=3000


Start MongoDB (if running locally).
Run the application:npm start


Open http://localhost:3000 in your browser.

Running with Docker

Build the Docker image:docker build -t todo-app .


Run the container:docker run -p 3000:3000 --env-file .env -d todo-app



Testing
Run tests with:
npm test

Project Structure

app.js: Main application file
config/db.js: MongoDB connection setup
models/Task.js: Task schema and model
routes/tasks.js: Task routes for CRUD operations
views/: EJS templates for UI
public/: Static files (CSS)
tests/: Test files
Dockerfile: Docker configuration

