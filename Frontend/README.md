# Beacon Frontend

A modern, responsive recruitment management interface built with **React**, **Tailwind CSS**, and **Vite**. This application provides a seamless experience for students, recruiters, and administrators to manage the end-to-end placement cycle.

---

## Overview

Beacon Frontend is a role-based single-page application (SPA) that interfaces with the Beacon Backend API. It features distinct dashboards tailored to three primary user types:

* **Students**: Discover opportunities, manage professional profiles, and track application progress.
* **Recruiters**: Post job openings, manage candidate pipelines, and review student credentials.
* **Admins**: Oversee platform integrity by moderating job posts and verifying user identities.

The UI is designed for high performance, featuring optimistic state updates and a clean, data-driven aesthetic.

---

## Tech Stack

* **React.js (Vite)**: Core framework for UI components.
* **Tailwind CSS**: Utility-first styling for consistent, professional design.
* **React Router DOM**: Declarative routing and role-based access control.
* **Axios**: Promise-based HTTP client for API communication.
* **Lucide React**: Iconography for dashboard navigation.
* **React Context API**: Global state management for authentication and user sessions.
* **Framer Motion**: Smooth transitions and component animations.

---

## Features

### Role-Based Access Control (RBAC)
* Protected routes to ensure users only access authorized modules.
* Automatic redirection based on login status and account role.
* Persistent sessions via local storage and interceptors.

### Student Module
* **Job Board**: Filterable and searchable listings of verified job opportunities.
* **Application Tracking**: Real-time status updates (Applied, Shortlisted, Interviewing, Rejected).
* **Profile Management**: Comprehensive academic profile including CGPA, department, and skills.
* **Resume Integration**: Direct PDF uploads and replacement functionality.

### Recruiter Dashboard
* **Job Lifecycle**: Create, edit, and toggle status (Open/Closed) for job postings.
* **ATS (Applicant Tracking System)**: Dedicated queue to review applicants and move them through hiring stages.
* **Student Insight**: Deep-dive profile views including verified academic stats and resumes.
* **Job Moderation**: Visual indicators for jobs pending administrative approval.

### Administrative Portal
* **User Verification**: Approval workflow for new students and recruiters.
* **Job Moderation**: Detailed review of new job postings before they go live.
* **System Metrics**: High-level overview of platform activity and pending tasks.

---

## Project Structure

```text
src/
├── components/       # Common UI elements (Navbar, Sidebar, Modals, Buttons)
├── context/          # AuthContext for global session management
├── hooks/            # Custom React hooks for API calls and form handling
├── layouts/          # Parent layout components for different user roles
├── pages/            # View components
│   ├── auth/         # Login and Registration flows
│   ├── admin/        # Moderation and Verification dashboards
│   ├── recruiter/    # Job management and Applicant tracking
│   └── student/      # Job board and Application history
├── services/         # API abstraction layer (Axios instances and endpoints)
├── utils/            # Formatting helpers, date parsers, and constants
└── App.jsx           # Main routing logic and theme configuration
```

## Environment Variables

Create a `.env` file in the root directory to connect to the backend:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
NODE_ENV=development
```

## Installation

1. Clone the repository
2. Install dependencies
```bash
   npm install
```
3. Configure the environment variables in `.env`
4. Run the development server
```bash
   npm run dev
```

## UI Components & Design System

- **Responsive Grids:** Optimized for both mobile job-seekers and desktop recruiters.
- **Interactive Modals:** Confirmation dialogs for critical actions (e.g., deleting a job or rejecting a candidate).
- **Dynamic Badges:** Color-coded status indicators for immediate visual feedback.
- **Clean Forms:** Validated inputs for complex data types like CGPA and application deadlines.

## Error Handling & Feedback

- **Toast Notifications:** Real-time alerts for successful actions and error states.
- **Loading Skeletons:** Smooth perceived performance during data fetching.
- **Fallback UI:** Graceful handling of empty states and "404 Not Found" scenarios.

## Future Roadmap

- **Dark Mode:** System-wide theme toggle.
- **Analytics Charts:** Visual hiring trends for recruiters using Chart.js.
- **Direct Messaging:** Integrated chat between recruiters and shortlisted candidates.
- **Push Notifications:** Browser-based alerts for status updates.

## Author

Developed as part of the Beacon ecosystem, focusing on modern frontend architecture,
intuitive UX design, and secure role-based navigation.