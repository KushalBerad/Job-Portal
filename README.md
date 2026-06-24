# Job Portal – Full Stack MERN Recruitment Platform

A full stack job portal platform built using the MERN stack that enables users to search jobs, apply to opportunities, manage profiles, and allows recruiters/admins to manage companies, job listings, and applicants.

Designed with scalable backend architecture, authentication security, Redux state management, and modular frontend component structure.

---

## Features

### Candidate Features

* User Registration and Login Authentication
* JWT Protected Authentication
* Browse available jobs
* Search jobs using keyword filters
* Apply directly to job postings
* Profile management
* Resume/Profile update system
* Applied jobs tracking

### Recruiter/Admin Features

* Recruiter authentication
* Create and manage companies
* Post new job openings
* Manage posted jobs
* View applicants for jobs
* Protected admin routes

---

## Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* Tailwind CSS
* Shadcn UI
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary

---

## Architecture

Project follows modular MERN architecture.

Backend Structure:

backend/

* controllers → request handling logic
* models → MongoDB schemas
* routes → API routing
* middlewares → authentication and file middleware
* utils → database, cloudinary, helper utilities

Frontend Structure:

frontend/

* components → UI modules
* redux → global state management
* hooks → reusable business logic
* utils → helper functions

---

## Security Implementation

Implemented multiple security practices:

* JWT based authentication
* Protected API routes
* Password hashing
* Environment variable protection using .env
* Sensitive credentials excluded from GitHub using .gitignore
* Cloudinary secure image upload pipeline

---

## Local Installation

Clone repository

```bash
git clone <repo_url>
```

Backend setup

```bash
cd backend
npm install
npm run dev
```

Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create .env inside backend

```env
MONGO_URI="your_mongodb_connection_string"

PORT=8000

JWT_SECRET_KEY="your_jwt_secret_key"
```

---

## Future Improvements

* Better UI/UX redesign
* Resume parser integration
* Email notification system
* AI based job recommendation engine
* Advanced search filtering
* Admin analytics dashboard

---

## Author

Kushal Berad

