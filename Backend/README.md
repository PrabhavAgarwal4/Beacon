# Beacon Backend

A scalable backend system for a job portal application built with Node.js, Express, and PostgreSQL. This service handles authentication, role-based access control, job management, applications, file uploads, and system-level optimizations such as rate limiting.

---

## Overview

This backend powers a multi-role job portal where:

* Students can create profiles, upload resumes, browse jobs, and apply.
* Recruiters can create, manage, and review job postings and applicants.
* Admins can approve users and jobs to ensure platform moderation.

The system is designed with clean architecture, modularity, and production-oriented practices.

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL (Supabase)
* Redis (rate limiting)
* Cloudinary (file storage)
* Multer (file handling)
* JWT (authentication)
* Morgan (logging)

---

## Features

### Authentication & Authorization

* JWT-based authentication (access + refresh tokens)
* Role-based access control (STUDENT, RECRUITER, ADMIN)
* Protected routes via middleware

### User Management

* User registration with admin approval flow
* Login with hashed passwords (bcrypt)
* Active/inactive user control

### Profile Management

* Student profile creation and retrieval
* Recruiter profile creation and retrieval
* Resume upload with Cloudinary integration
* Resume replacement (old file deletion + new upload)

### Job Management

* Create job (recruiter only)
* Update job (owner only)
* Delete job (owner only)
* Toggle job status (OPEN / CLOSED)
* Admin approval for jobs
* Fetch jobs with filtering, search, sorting, and pagination

### Application System

* Students can apply to jobs
* Duplicate application prevention
* Recruiters can view applicants
* Recruiters can update application status (SHORTLISTED / REJECTED)

### Admin Controls

* Approve users
* Approve jobs
* View pending users and jobs

### Performance & Security

* Redis-based rate limiting
* Structured API responses
* Error handling middleware
* Input validation
* Secure password hashing

---

## API Structure

```
/api/v1/auth
/api/v1/student
/api/v1/recruiter
/api/v1/jobs
/api/v1/applications
/api/v1/admin
```

---

## Environment Variables

Create a `.env` file in the root directory with the following:

```
PORT=
DATABASE_URL=

JWT_SECRET=
JWT_REFRESH_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

REDIS_URL=
NODE_ENV=
```

---

## Installation

1. Clone the repository
2. Install dependencies

```
npm install
```

3. Add environment variables in `.env`

4. Run the server

```
npm run dev
```

---

## Database

PostgreSQL is used as the primary database.

Key tables:

* users
* student_details
* recruiter_details
* jobs
* applications

Schema includes:

* relational integrity (foreign keys)
* unique constraints (prevent duplicate applications)
* role-based fields
* status and moderation flags

---

## File Uploads

* Handled using Multer (memory storage)
* Uploaded to Cloudinary
* Only PDF files allowed
* Resume replacement supported (old file deletion)

---

## Rate Limiting

* Implemented using Redis
* Limits repeated requests (e.g., login attempts)
* Prevents abuse and improves system reliability

---

## Project Structure

```
src/
│
├── config/
├── controllers/
├── routes/
├── middlewares/
├── utils/
└── app.js
└── server.js
```

---

## Error Handling

* Centralized error handling middleware
* Custom ApiError and ApiResponse classes
* Consistent response structure across APIs

---

## Future Improvements

* Redis caching for job listings
* Advanced search (full-text search)
* Resume parsing
* Notification system
* WebSocket-based chat
* Deployment and CI/CD

---

## Author

Developed as a full-stack job portal backend system focusing on scalability, clean architecture, and real-world design practices.
