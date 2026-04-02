# Beacon — Campus Recruitment Platform

> A full-stack, role-based recruitment management system designed to streamline the end-to-end placement cycle for students, recruiters, and administrators.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [File Uploads](#file-uploads)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Future Roadmap](#future-roadmap)
- [Author](#author)

---

## Overview

**Beacon** is a modern, production-oriented job portal built for campus placements. It features distinct dashboards tailored to three primary user roles:

| Role | Capabilities |
|------|-------------|
| **Student** | Discover jobs, manage profiles, track applications |
| **Recruiter** | Post jobs, manage pipelines, review candidates |
| **Admin** | Moderate job posts, verify users, monitor platform |

The platform is engineered for high performance with optimistic UI updates, secure role-based access control, and a clean, data-driven aesthetic.

---

## Architecture

```
+-----------------------------------------------------+
|                   CLIENT (Frontend)                  |
|         React + Vite + Tailwind CSS + Axios          |
+----------------------+------------------------------+
                       | HTTP / REST
+----------------------v------------------------------+
|                  SERVER (Backend)                    |
|            Node.js + Express.js + JWT                |
+----------+---------------+-------------+------------+
           |               |             |
      +----+-----+  +------+----+  +-----+------+
      |PostgreSQL |  |Cloudinary |  |   Redis    |
      |(Supabase) |  |(Files)    |  |(Rate Limit)|
      +----------+  +-----------+  +------------+
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React.js (Vite)** | Core UI framework |
| **Tailwind CSS** | Utility-first styling |
| **React Router DOM** | Declarative routing & RBAC |
| **Axios** | HTTP client for API calls |
| **Lucide React** | Dashboard iconography |
| **React Context API** | Global auth state management |
| **Framer Motion** | Animations & transitions |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express.js** | Server & REST API |
| **PostgreSQL (Supabase)** | Primary relational database |
| **Redis** | Rate limiting |
| **Cloudinary** | File/resume cloud storage |
| **Multer** | File upload handling |
| **JWT** | Access & refresh token auth |
| **bcrypt** | Secure password hashing |
| **Morgan** | HTTP request logging |

---

## Features

### Authentication & Authorization
- JWT-based auth with access + refresh tokens
- Role-based access control (`STUDENT`, `RECRUITER`, `ADMIN`)
- Protected routes with automatic redirection
- Persistent sessions via local storage and interceptors
- Admin approval workflow for new registrations

### Student Module
- **Job Board** — Filterable and searchable listings of verified opportunities
- **Application Tracking** — Real-time status updates (Applied, Shortlisted, Interviewing, Rejected)
- **Profile Management** — Academic info including CGPA, department, and skills
- **Resume Integration** — PDF upload, view, and replacement functionality

### Recruiter Dashboard
- **Job Lifecycle** — Create, edit, and toggle job status (Open / Closed)
- **ATS (Applicant Tracking System)** — Dedicated queue to review and advance candidates
- **Student Insight** — Deep-dive profile views with verified academic stats and resumes
- **Job Moderation Indicators** — Visual cues for jobs pending admin approval

### Administrative Portal
- **User Verification** — Approve or reject new student and recruiter accounts
- **Job Moderation** — Review and approve job postings before they go live
- **System Metrics** — High-level overview of platform activity and pending tasks

### Performance & Security
- Redis-based rate limiting to prevent abuse
- Structured API responses with custom `ApiError` and `ApiResponse` classes
- Centralized error handling middleware
- Input validation across all endpoints
- Secure password hashing with bcrypt

### UI/UX Highlights
- **Responsive Grids** — Optimized for both mobile job-seekers and desktop recruiters
- **Interactive Modals** — Confirmation dialogs for critical actions
- **Dynamic Badges** — Color-coded status indicators for instant feedback
- **Toast Notifications** — Real-time alerts for success and error states
- **Loading Skeletons** — Smooth perceived performance during data fetching
- **Fallback UI** — Graceful empty states and 404 handling

---

## Project Structure

### Frontend (`/client`)

```
src/
├── components/       # Shared UI elements (Navbar, Sidebar, Modals, Buttons)
├── context/          # AuthContext for global session management
├── hooks/            # Custom React hooks for API calls and form handling
├── layouts/          # Role-specific parent layout components
├── pages/
│   ├── auth/         # Login and Registration flows
│   ├── admin/        # Moderation and Verification dashboards
│   ├── recruiter/    # Job management and Applicant tracking
│   └── student/      # Job board and Application history
├── services/         # API abstraction layer (Axios instances & endpoints)
├── utils/            # Formatting helpers, date parsers, and constants
└── App.jsx           # Main routing logic and theme configuration
```

### Backend (`/server`)

```
src/
├── config/           # DB, Cloudinary, Redis configuration
├── controllers/      # Route handler logic
├── routes/           # API route definitions
├── middlewares/      # Auth, error handling, rate limiting
├── utils/            # ApiError, ApiResponse, helpers
├── app.js            # Express app setup
└── server.js         # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- PostgreSQL database (Supabase recommended)
- Redis instance
- Cloudinary account

---

### Frontend Setup

**1. Clone and install dependencies**
```bash
git clone https://github.com/your-org/beacon-frontend.git
cd beacon-frontend
npm install
```

**2. Configure environment variables**

Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
NODE_ENV=development
```

**3. Start the development server**
```bash
npm run dev
```

---

### Backend Setup

**1. Clone and install dependencies**
```bash
git clone https://github.com/your-org/beacon-backend.git
cd beacon-backend
npm install
```

**2. Configure environment variables**

Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL=

JWT_SECRET=
JWT_REFRESH_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

REDIS_URL=
NODE_ENV=development
```

**3. Start the development server**
```bash
npm run dev
```

---

## API Reference

| Prefix | Description |
|--------|-------------|
| `/api/v1/auth` | Registration, login, token refresh |
| `/api/v1/student` | Student profile management |
| `/api/v1/recruiter` | Recruiter profile management |
| `/api/v1/jobs` | Job CRUD, filtering, pagination |
| `/api/v1/applications` | Apply, track, update status |
| `/api/v1/admin` | User and job approval workflows |

---

## Database Schema

PostgreSQL is used as the primary database. Key tables:

| Table | Description |
|-------|-------------|
| `users` | Base user records with roles and status |
| `student_details` | Academic profile, CGPA, department |
| `recruiter_details` | Company info and recruiter metadata |
| `jobs` | Job postings with moderation flags |
| `applications` | Many-to-many student and job relationship |

Schema enforces relational integrity via foreign keys, unique constraints (no duplicate applications), and status/moderation flags.

---

## File Uploads

- Handled using **Multer** (memory storage)
- Uploaded securely to **Cloudinary**
- Only **PDF files** are accepted
- **Resume replacement** supported — old file is deleted before new upload

---

## Rate Limiting

- Implemented using **Redis**
- Restricts repeated requests (e.g., login brute-force attempts)
- Configurable limits per route
- Improves reliability and prevents abuse

---

## Error Handling

- Centralized error middleware across the Express app
- Custom `ApiError` class for structured error throwing
- Custom `ApiResponse` class for consistent response envelopes
- Uniform response shape: `{ success, message, data, error }`

---

## Future Roadmap

- [ ] **Dark Mode** — System-wide theme toggle
- [ ] **Analytics Charts** — Visual hiring trends using Chart.js
- [ ] **Direct Messaging** — Integrated chat between recruiters and shortlisted candidates
- [ ] **Push Notifications** — Browser-based alerts for status updates
- [ ] **Redis Caching** — Cache job listings for faster load times
- [ ] **Advanced Search** — Full-text search across jobs and profiles
- [ ] **Resume Parsing** — Auto-extract candidate details from uploaded PDFs
- [ ] **CI/CD Pipeline** — Automated testing and deployment workflows

---

## Author

Developed as part of the **Beacon** ecosystem — a full-stack campus recruitment platform focusing on clean modular architecture, intuitive and accessible UX design, secure role-based navigation, and production-ready backend practices.
