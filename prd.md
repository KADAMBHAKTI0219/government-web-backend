# Backend PRD (Product Requirements Document)
## Chhattisgarh State Creator & Influencer Awards Portal
**Version:** 1.0  
**Project Type:** Government Web Portal  
**Architecture:** MERN Stack (MongoDB, Express.js, Next.js, Node.js)  
**Frontend:** Next.js (JSX)  
**Backend:** Node.js + Express.js  
**Database:** MongoDB Atlas  
**Authentication:** JWT + Refresh Token  
**Storage:** Cloudinary (Images & Documents)  
**API Style:** REST API  
**Deployment:** AWS EC2 / Render + MongoDB Atlas

---

# 1. Product Overview

The Chhattisgarh State Creator & Influencer Awards Portal is an official Government platform designed to recognize and celebrate digital creators who showcase the culture, heritage, tourism, innovation, social impact, and artistic excellence of Chhattisgarh. The backend serves as the core service responsible for authentication, creator management, nomination processing, jury evaluation, voting, CMS management, analytics, and administrative operations. The platform requirements align with the award categories, nomination process, eligibility, and policies described in the project content document. :contentReference[oaicite:0]{index=0}

---

# 2. Product Objectives

- Build a secure REST API architecture.
- Support high concurrent traffic.
- Enable secure creator registration and login.
- Manage award nominations.
- Support multiple user roles.
- Manage dynamic CMS content.
- Enable jury evaluation.
- Support public voting.
- Generate reports and analytics.
- Maintain complete audit logs.
- Ensure Government-grade security.

---

# 3. User Roles

### Super Admin
- Full system access
- Manage administrators
- Configure platform
- View analytics
- Manage permissions

### Admin
- Manage creators
- Manage nominations
- Manage categories
- Manage jury members
- Manage news, gallery, CMS

### Jury
- Review assigned nominations
- Score submissions
- Approve / Reject applications
- Add remarks

### Creator
- Register account
- Submit nominations
- Upload portfolio
- Track application status
- Download certificates (after award)

### Public User
- Browse website
- View categories
- Vote (if enabled)
- Read news and announcements

---

# 4. Core Backend Modules

## Authentication Module
- Register
- Login
- Email Verification
- OTP Verification
- Forgot Password
- Reset Password
- Refresh Token
- Logout

---

## User Management
- Profile Management
- Social Links
- Portfolio Details
- District & State
- Account Verification
- Profile Completion

---

## Award Categories
- Dynamic CRUD
- Category Status
- Featured Categories
- Category Description
- Display Order

Supports all official award categories published for the initiative. :contentReference[oaicite:1]{index=1}

---

## Nomination Module

Creators can:

- Create Nomination
- Save Draft
- Submit Application
- Upload Documents
- Upload Portfolio
- Select Categories
- Track Status

Application States

- Draft
- Submitted
- Under Review
- Shortlisted
- Approved
- Rejected
- Winner

---

## Jury Module

Features

- Assigned Applications
- Review Dashboard
- Score Cards
- Remarks
- Recommendation
- Final Decision

---

## Voting Module

- Public Voting
- Vote Validation
- Duplicate Vote Prevention
- Voting Analytics
- Leaderboard

---

## Notification Module

- Email Notifications
- Dashboard Notifications
- Status Updates
- Announcement Broadcasts

---

## CMS Module

Dynamic management for:

- Homepage
- Hero Banner
- About Section
- Categories
- Timeline
- FAQ
- Gallery
- News
- Footer
- Government Messages
- Policies

---

## News Module

- CRUD
- Publish
- Draft
- Schedule
- Featured News

---

## Gallery Module

- Photos
- Videos
- Albums
- Featured Media

---

## Analytics Module

Dashboard Statistics

- Total Users
- Total Applications
- Category-wise Applications
- District-wise Applications
- Gender Analytics
- Age Analytics
- Voting Statistics

---

## Certificate Module

- Auto Generate Certificate
- QR Verification
- Download PDF

---

## Reports

Generate

- User Reports
- Nomination Reports
- Category Reports
- Jury Reports
- Voting Reports
- Analytics Reports

Export

- CSV
- Excel
- PDF

---

# 5. Database Collections

- users
- roles
- permissions
- categories
- nominations
- portfolios
- juryAssignments
- juryReviews
- votes
- notifications
- cms
- gallery
- news
- certificates
- winners
- activityLogs
- contactQueries
- settings

---

# 6. Security Requirements

- JWT Authentication
- Refresh Tokens
- Role-Based Access Control (RBAC)
- Password Hashing (bcrypt)
- Helmet Security
- CORS Protection
- Rate Limiting
- Input Validation
- MongoDB Injection Protection
- XSS Protection
- Audit Logging

---

# 7. Third-Party Services

- MongoDB Atlas
- Cloudinary
- Nodemailer
- JWT
- Google reCAPTCHA
- Google Analytics (optional)

---

# 8. API Architecture

```
/api/auth
/api/users
/api/categories
/api/nominations
/api/jury
/api/voting
/api/news
/api/gallery
/api/cms
/api/notifications
/api/reports
/api/dashboard
/api/settings
/api/contact
```

---

# 9. Non-Functional Requirements

- RESTful API Design
- Modular Architecture
- Scalable Codebase
- Secure Authentication
- Response Time < 300ms
- Mobile-friendly API
- Production-ready Logging
- High Availability
- Clean Error Handling
- API Versioning

---

# 10. Success Criteria

- Secure creator registration and authentication.
- Successful nomination workflow from submission to winner declaration.
- Dynamic CMS for non-technical administrators.
- Transparent jury review process.
- Reliable voting system (where applicable).
- Dashboard analytics for administrators.
- Compliance with the project's published nomination flow, eligibility rules, and policy content. :contentReference[oaicite:2]{index=2}