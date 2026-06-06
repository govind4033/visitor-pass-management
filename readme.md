# Visitor Pass Management System

Developed a Role-Based Visitor Management System with separate access for Admin, Visitor, Security, and Employee roles. Visitors can book appointments with employees, which are verified by security personnel before a digital QR-based visitor pass is generated. The system supports visitor check-in, meeting tracking, completion status updates by employees, and secure QR-based visitor check-out, ensuring an efficient and streamlined visitor management process.

## Features

* Role-Based Access Control (Admin, Employee, Security, Visitor)
* JWT Authentication and Authorization
* Visitor Appointment Booking System
* Appointment Approval and Rejection Workflow
* QR Code-Based Visitor Pass Generation
* Secure Visitor Check-In and Check-Out
* Real-Time Visitor Tracking
* Employee Visitor Management Dashboard
* Security Monitoring Dashboard
* Visitor Entry and Exit Logs
* Daily Visitor Analytics and Reports
* Peak Hour Visitor Analysis
* CSV Report Export Functionality
* User Profile Management
* Responsive and User-Friendly Interface

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* React Hook Form
* React Hot Toast
* HTML5 QR Code

### Backend

* Node.js
* Express.js
* MongoDB & Mongoose
* JWT Authentication
* bcryptjs
* Nodemailer
* QRCode
* PDFKit
* Multer
* Express Validator
* Morgan
* Validator

## System Architecture

The Visitor Pass Management System follows a role-based client-server architecture built using the MERN stack.

```text
┌─────────────────────────────────────────────┐
│                  Users                       │
├─────────────────────────────────────────────┤
│ Admin │ Employee │ Security │ Visitor       │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│               React Frontend                 │
│---------------------------------------------│
│ Authentication & Authorization              │
│ Appointment Management                      │
│ Visitor Dashboard                           │
│ Security Dashboard                          │
│ Admin Dashboard                             │
│ QR Code Scanner                             │
│ Reports & Analytics                         │
└─────────────────────────────────────────────┘
                      │
               Axios REST APIs
                      │
                      ▼
┌─────────────────────────────────────────────┐
│            Express.js Backend                │
│---------------------------------------------│
│ JWT Authentication                           │
│ Role-Based Access Control                    │
│ User Management                              │
│ Appointment Management                       │
│ Visitor Pass Generation                      │
│ Check-In / Check-Out Processing              │
│ Reporting & Analytics                        │
└─────────────────────────────────────────────┘
            │                     │
            │                     │
            ▼                     ▼
┌─────────────────┐    ┌──────────────────┐
│    MongoDB      │    │ External Services│
│-----------------│    │------------------│
│ Users           │    │ Nodemailer       │
│ Appointments    │    │ QRCode Generator │
│ Visitor Passes  │    │ PDFKit           │
│ Check Logs      │    │ CSV Export       │
└─────────────────┘    └──────────────────┘
```

---

## Visitor Workflow

```text
Visitor
   │
   │ Book Appointment
   ▼
Appointment Request
   │
   │ Approval / Rejection
   ▼
Employee/Admin
   │
   │ Approved
   ▼
Visitor Pass Generated
   │
   │ QR Code Issued
   ▼
Security Verification
   │
   │ Check-In
   ▼
Meeting In Progress
   │
   │ Meeting Completed
   ▼
Employee
   │
   │ Check-Out
   ▼
Visitor Exit Logged
   │
   ▼
Reports & Analytics
```

---

## Backend Architecture

```text
Routes
  │
  ▼
Controllers
  │
  ▼
Services / Business Logic
  │
  ▼
Mongoose Models
  │
  ▼
MongoDB Database
```

### Core Modules

- Authentication Module
- User Management Module
- Appointment Management Module
- Visitor Pass Module
- QR Verification Module
- Check-In / Check-Out Module
- Reporting & Analytics Module## Database Schema

### User

| Field | Type | Description |
|---------|---------|---------|
| name | String | User full name |
| email | String | Unique email address |
| password | String | Hashed password |
| role | Enum | admin, security, employee, visitor |
| phone | String | Contact number |
| department | String | Department name |
| isActive | Boolean | Account status |
| photo | String | Profile photo URL |
| createdAt | Date | Record creation time |
| updatedAt | Date | Record update time |

---

### Appointment

| Field | Type | Description |
|---------|---------|---------|
| visitor | ObjectId (User) | Visitor requesting appointment |
| host | ObjectId (User) | Employee being visited |
| scheduledAt | Date | Meeting date and time |
| purpose | String | Reason for visit |
| status | Enum | pending, approved, rejected, completed, cancelled |
| approvedBy | ObjectId (User) | Employee/Admin who approved |
| approvedAt | Date | Approval timestamp |
| notes | String | Additional remarks |
| notified | Boolean | Email notification status |
| createdAt | Date | Record creation time |
| updatedAt | Date | Record update time |

---

### Visitor Pass

| Field | Type | Description |
|---------|---------|---------|
| visitor | ObjectId (User) | Pass owner |
| appointment | ObjectId (Appointment) | Linked appointment |
| passCode | String | Unique visitor pass code |
| qrCodeUrl | String | QR code image URL |
| pdfFile | String | Generated PDF filename |
| pdfUrl | String | PDF access URL |
| issuedBy | ObjectId (User) | Admin/Security who issued pass |
| issuedAt | Date | Pass generation time |
| expiresAt | Date | Pass expiry time |
| status | Enum | active, checked-in, used |
| createdAt | Date | Record creation time |
| updatedAt | Date | Record update time |

---

### Check Log

| Field | Type | Description |
|---------|---------|---------|
| pass | ObjectId (Pass) | Associated visitor pass |
| visitor | ObjectId (User) | Visitor reference |
| type | Enum | check-in, check-out |
| timestamp | Date | Scan timestamp |
| scannedBy | ObjectId (User) | Security personnel who scanned |
| notes | String | Additional remarks |

---

## Entity Relationships

```text
User (Visitor)
    │
    ├── books
    ▼
Appointment
    │
    ├── approved by
    ▼
User (Employee/Admin)
    │
    ├── generates
    ▼
Visitor Pass
    │
    ├── scanned by
    ▼
User (Security)
    │
    ├── creates
    ▼
Check Log (Check-In / Check-Out)
```
# API Reference

**Base URL:** `http://localhost:4004`

---

## Authentication APIs

| Method | Endpoint             | Description                              |
| ------ | -------------------- | ---------------------------------------- |
| POST   | `/api/auth/register` | Register a new user                      |
| POST   | `/api/auth/login`    | Authenticate user and generate JWT token |
| GET    | `/api/auth/me`       | Get currently logged-in user details     |

---

## User APIs

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/users`         | Create a new user           |
| GET    | `/api/users`         | Get all users               |
| GET    | `/api/users/:id`     | Get user by ID              |
| GET    | `/api/users/profile` | Get current user profile    |
| PUT    | `/api/users/profile` | Update current user profile |
| PUT    | `/api/users/:id`     | Update user details         |
| DELETE | `/api/users/:id`     | Delete user                 |

---

## Appointment APIs

| Method | Endpoint                         | Description                          |
| ------ | -------------------------------- | ------------------------------------ |
| GET    | `/api/appointments`              | Get all appointments                 |
| POST   | `/api/appointments`              | Create a new appointment request     |
| GET    | `/api/appointments/my`           | Get visitor's own appointments       |
| GET    | `/api/appointments/my-visitors`  | Get visitors assigned to an employee |
| PUT    | `/api/appointments/:id/approve`  | Approve appointment request          |
| PUT    | `/api/appointments/:id/reject`   | Reject appointment request           |
| PUT    | `/api/appointments/:id/cancel`   | Cancel appointment                   |
| PUT    | `/api/appointments/:id/complete` | Mark appointment as completed        |

---

## Visitor Pass APIs

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/api/passes`          | Get all generated passes             |
| GET    | `/api/passes/my`       | Get visitor's own passes             |
| GET    | `/api/passes/:id`      | Get pass details by ID               |
| POST   | `/api/passes/generate` | Generate visitor pass after approval |

---

## Check-In / Check-Out APIs

| Method | Endpoint                     | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| POST   | `/api/check/checkin`         | Visitor check-in using QR pass    |
| POST   | `/api/check/checkout`        | Visitor check-out using QR pass   |
| GET    | `/api/check/logs`            | Get visitor entry/exit logs       |
| GET    | `/api/check/dashboard-stats` | Get security dashboard statistics |

---

## Report APIs

| Method | Endpoint                   | Description                            |
| ------ | -------------------------- | -------------------------------------- |
| GET    | `/api/reports/summary`     | Get overall visitor management summary |
| GET    | `/api/reports/daily-stats` | Get daily visitor statistics           |
| GET    | `/api/reports/peak-hours`  | Get peak visitor traffic hours         |
| GET    | `/api/reports/export-csv`  | Export report data as CSV file         |

---

## User Roles

| Role     | Permissions                                                                     |
| -------- | ------------------------------------------------------------------------------- |
| Admin    | Manage users, reports, appointments, passes, and system monitoring              |
| Visitor  | Book appointments, view appointments, access visitor passes, check-in/check-out |
| Employee | Approve/reject appointments, manage visitors, complete meetings                 |
| Security | Verify appointments, monitor visitors, manage check-in/check-out operations     |

---

## Authentication

All protected routes require a JWT token.

Header Format:

Authorization: Bearer <JWT_TOKEN>
## Deployment

To run this project locally:

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start the development server
npm run dev
```

The application will be available at:

```bash
http://localhost:4004
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Backend runs on:

```bash
http://localhost:4004
```

Frontend runs on:

```bash
http://localhost:3000
```

## Demo

https://drive.google.com/file/d/1d9dqyEX8J9SCSHQn0X_-uBRsPL5l8NWk/view?usp=sharing 

## Screenshots

![App Screenshot](https://dummyimage.com/468x300?text=App+Screenshot+Here)

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd visitor-management-system
```

### Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file and configure the required environment variables.

Start the backend server:

```bash
npm run dev
```

### Setup Frontend

```bash
cd frontend
npm install
```

Start the frontend application:

```bash
npm run dev
```

### Access the Application

```bash
Frontend: http://localhost:5173
Backend:  http://localhost:4004
```

## 🚀 About Me

I'm a Computer Science student passionate about Full-Stack Development and Problem Solving. I have solved 700+ LeetCode problems and built projects using the MERN stack. Currently focused on strengthening DSA, backend development, and software engineering skills while pursuing internship opportunities.



## 🔗 Links
[gethub](https://github.com/govind4033)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/govind-lodhi-19757b2a7/)
