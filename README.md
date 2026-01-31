# wta-backend

This project is the **backend extension** of the Skye Suites static hotel website (HTML/CSS/JS). It provides **dynamic features** such as booking management, contact handling, and subscriptions using a Node.js/Express API connected to MongoDB.

For technical version of this document, see [README-TECHNICAL](https://github.com/imperionite/wta-be/blob/main/README-TECHNICAL.md)

---

## Overview

The API enhances the original static website by enabling:

- **User Authentication:** Secure guest accounts with JWT and role-based access control (user/admin)
- **Booking System:** Real-time room availability and reservation management
- **Contact & Subscription Management:** Store inquiries and newsletter subscriptions
- **Admin Dashboard:** Oversight of reservations, messages, and subscribers

This backend is **decoupled from the frontend** to allow focused learning in Node.js and REST API development while maintaining a static frontend.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT, Passport.js
- **Security & Middleware:** Helmet, CORS, Morgan, Cookie-Parser
- **Testing:** Postman & Jest (unit tests)

---

## Highlights

- RESTful API endpoints with proper HTTP status codes
- CRUD operations across multiple resources
- Role-based access control (RBAC)
- Password hashing and JWT-based authentication
- Decoupled architecture for clear separation of concerns
- Designed for **academic learning** but following industry-like best practices

---

## Project Goals

- Extend the existing static frontend with dynamic backend integration
- Teach backend development to all group members
- Provide **portfolio-ready exposure** to API design, authentication, and data management

## API Docs

This section documents the manual API tests performed during our initial coding sprint.  
Screenshots are provided for reference.

### Create user - Public

**POST /api/auth/register**

![create user](https://drive.google.com/uc?id=1Ng5mWvRN8POkCNUWE_4AzwxaiH2eMCL4)
