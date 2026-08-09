# Task Manager API

A RESTful Task Management API built using **Node.js, Express.js, MongoDB, and Mongoose**. This project extends the Task Management backend from Practical 4 by replacing the in-memory task storage with a persistent MongoDB database and enforcing data validation using Mongoose schemas.

## Student Information

- **Student Name:** Priyanshi Gajiwala
- **Enrollment No.:** 24IT019
- **Course:** Advanced Web Development Frameworks
- **Course Code:** ITUE301
- **Practical:** 5 - MongoDB Integration and Schema Design with Mongoose

---

## Objective

The objective of this practical is to:

- Connect a MongoDB database to an Express.js server using Mongoose.
- Design a Mongoose schema for Task documents.
- Apply schema-level validation.
- Perform CRUD operations using Mongoose model methods.
- Handle validation errors using structured JSON responses.
- Persist task data in MongoDB instead of an in-memory array.

---

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- Postman
- MongoDB Compass

---

## Project Structure

```text
task-manager-api/
│
├── models/
│   └── Task.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js