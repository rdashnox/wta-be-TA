# wta-be

This document provides detailed technical documentation for the **Skye Suites Hotel API backend**.

It explains the **system architecture, database design, authentication flow, and business rules** implemented in the backend system. For the frontend part of the project, please check the [wta-fe repository](https://github.com/imperionite/wta-fe).

# Table of Contents

- [Database Design](#database-design)

- [System Architecture](#system-architecture)
  - [Layer Responsibilities](#layer-responsibilities)
  - [Routes](#routes)
  - [Controllers](#controllers)
  - [Services](#services)
  - [Models](#models)
  - [Middleware](#middleware)

- [Authentication System](#authentication-system)
  - [Login Flow](#login-flow)
  - [JWT Payload Structure](#jwt-payload-structure)

- [Role-Based Access Control](#role-based-access-control)

- [Booking System Design](#booking-system-design)
  - [Booking Creation Rules](#booking-creation-rules)
  - [Room Availability Validation](#room-availability-validation)
  - [Concurrency Protection](#concurrency-protection)

- [Pricing System](#pricing-system)

- [Database Design](#database-design)
  - [Relationships](#relationships)
  - [Indexing Strategy](#indexing-strategy)

- [Security Architecture](#security-architecture)
  - [Security Middleware](#security-middleware)
  - [Password Security](#password-security)

- [Error Handling](#error-handling)
- [Logging](#logging)
- [Development Tools](#development-tools)
- [Known Limitations](#known-limitations)

- [Evaluator Testing Guide](#evaluator-testing-guide)
  - [Running the Application](#running-the-application)
  - [Seeding Test Data](#seeding-test-data)
  - [Test User Credentials](#test-user-credentials)
  - [Authentication Example](#authentication-example)
  - [Google OAuth Testing](#google-oauth-testing)
  - [API Documentation](#api-documentation)
  - [Recommended Testing Flow](#recommended-testing-flow)
  - [Seeder Security Restriction](#seeder-security-restriction)

---

# Database Design

Database documentation is available in [this ink](https://github.com/imperionite/wta-be/blob/main/ERD_AND_DATA_DICTIONARY.md).

# System Architecture

The backend follows a **layered architecture** that separates responsibilities between routing, request handling, business logic, and persistence.

```
Client
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

## Layer Responsibilities

### Routes

Routes define API endpoints and attach middleware for authentication and validation.

Example:

```
POST /api/booking
GET /api/rooms
```

Routes are located in:

```
routes/
```

---

### Controllers

Controllers process incoming requests and return responses.

Responsibilities:

- Extract request data
- Call business logic from services
- Return formatted responses

Controllers are located in:

```
controllers/
```

Example controller flow:

```
req → controller → service → database → response
```

---

### Services

Services contain **core business logic**.

This layer ensures that controllers remain lightweight and that complex operations are reusable.

Example responsibilities:

- booking creation
- pricing calculations
- availability checks
- transactional operations

Services are located in:

```
services/
```

Example service:

```
services/bookingService.js
```

---

### Models

Models define MongoDB schemas using **Mongoose**.

They enforce:

- data structure
- validation rules
- indexes

Models are located in:

```
models/
```

Example models:

```
User
Room
Booking
Contact
Subscription
```

---

### Middleware

Middleware handles **cross-cutting concerns** such as authentication, validation, and error handling.

Examples:

- JWT authentication
- role-based access control
- request validation
- error handling

Middleware is located in:

```
middleware/
```

---

# Authentication System

Authentication is implemented using **JWT (JSON Web Tokens)** with **Passport.js**.

## Login Flow

```
User → Login Request
      ↓
Password validation
      ↓
JWT Token issued
      ↓
Token stored on client
      ↓
Protected requests include token
```

Example authorization header:

```
Authorization: Bearer <token>
```

---

## JWT Payload Structure

```
{
  id: "user_id",
  email: "user@example.com",
  role: "user"
}
```

---

# Role-Based Access Control

The system uses **RBAC** to control access to resources.

| Role   | Permissions                    |
| ------ | ------------------------------ |
| User   | Manage own bookings            |
| Admin  | Manage rooms, bookings, users  |
| Public | Contact and subscription forms |

Middleware enforces role permissions.

Example:

```
requireRole(["admin"])
```

---

# Booking System Design

The booking system enforces multiple business rules to maintain data integrity.

## Booking Creation Rules

A booking requires:

- first name
- last name
- email
- phone
- room
- check-in date
- check-out date
- number of guests

Validation rules:

- Check-in date must be today or later
- Check-out must be after check-in
- Guest count must meet room capacity

---

## Room Availability Validation

When a booking is created, the system checks for **date overlaps**.

Overlap detection logic:

```
existing.checkIn < newCheckOut
AND
existing.checkOut > newCheckIn
```

If an overlap exists, the booking request is rejected.

---

## Concurrency Protection

To prevent race conditions during booking creation, the system uses **MongoDB transactions**.

Transaction flow:

```
Start transaction
↓
Check room availability
↓
Create booking
↓
Commit transaction
```

This ensures atomic booking operations.

---

# Pricing System

Pricing is calculated server-side.

Pricing factors:

- room base price
- number of guests
- board type
- number of nights

The booking stores a **pricing snapshot**:

```
roomPrice
totalCost
pricingBreakdown
```

This ensures historical bookings remain accurate even if room prices change.

---

# Database Design

The system uses **MongoDB with Mongoose schemas**.

Collections:

```
users
rooms
bookings
contacts
subscriptions
```

---

## Relationships

Although MongoDB is a document database, logical relationships are maintained using **ObjectId references**.

```
User (1) → (Many) Bookings
Room (1) → (Many) Bookings
```

Example booking reference:

```
booking.user → ObjectId(User)
booking.room → ObjectId(Room)
```

---

## Indexing Strategy

Indexes are used to optimize queries.

Example indexes:

```
Booking: room + checkInDate + checkOutDate
Booking: user
Booking: createdAt
```

These indexes improve performance for:

- availability checks
- user booking history
- admin reporting

---

# Security Architecture

The system implements multiple security layers.

## Security Middleware

| Middleware     | Purpose                      |
| -------------- | ---------------------------- |
| Helmet         | Security headers             |
| Mongo Sanitize | Prevent NoSQL injection      |
| XSS Clean      | Prevent cross-site scripting |
| DOMPurify      | Sanitize HTML input          |
| Rate Limiter   | Prevent brute-force attacks  |

---

## Password Security

Passwords are hashed using **bcrypt**.

Hashing occurs during user registration.

Passwords are **never returned in API responses**.

---

# Error Handling

Centralized error handling is implemented through middleware.

Error responses follow a consistent structure:

```
{
  "message": "Error description"
}
```

Production environments hide internal error details.

---

# Logging

The application uses:

- **Morgan** for HTTP request logging
- **Winston** for application logging

Logs are used for:

- debugging
- monitoring
- auditing

---

# Development Tools

| Tool              | Purpose                   |
| ----------------- | ------------------------- |
| Swagger           | API documentation         |
| Postman           | API testing               |
| MongoMemoryServer | Isolated testing database |

---

# Known Limitations

This project is an academic proof-of-concept.

The system does not include:

- payment processing
- refund systems
- distributed caching
- microservices architecture

These features would typically be implemented in production environments.

---

# Evaluator Testing Guide

To simplify testing and evaluation of the API, this repository includes **seed scripts** that populate the database with sample users, rooms, and bookings.

These scripts allow evaluators to quickly authenticate and interact with the API without creating test data manually.

---

# Running the Application

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Configure Environment Variables

Create a `.env` file in the root directory.

Example configuration:

```
NODE_ENV=development
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
FRONTEND_URL=http://localhost:5173
```

If testing Google OAuth, also add:

```
GOOGLE_CLIENT_ID=provided_in_project_link
GOOGLE_CLIENT_SECRET=provided_in_project_link
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

Google OAuth credentials for testing are provided in the project documentation.

---

## 3. Start the Development Server

```bash
npm run dev
```

This runs the server using **nodemon** for automatic reloads during development.

The API will be available at:

```
http://localhost:3000
```

---

# Seeding Test Data

The project provides seed scripts to populate the database.

Run the following command:

```bash
npm run seed:all
```

This will create:

- default users
- sample rooms
- sample bookings

---

## Reset and Reseed the Database

To clear existing data and reseed everything:

```bash
npm run seed:clean
```

This will:

1. Remove existing development data
2. Recreate seed users
3. Recreate sample rooms
4. Recreate sample bookings

Seeders are **restricted to development mode only** to prevent accidental production execution.

---

# Test User Credentials

After running the seed scripts, the following users are available for authentication.

## Regular Users

| Email                 | Password | Role |
| --------------------- | -------- | ---- |
| user1.wta@maildrop.cc | 123456   | user |
| user2.wta@maildrop.cc | 123456   | user |
| user3.wta@maildrop.cc | 123456   | user |

---

## Administrator

| Email                 | Password | Role  |
| --------------------- | -------- | ----- |
| admin.wta@maildrop.cc | admin123 | admin |

---

# Authentication Example

Login endpoint:

```
POST /api/auth/login
```

Request body:

```json
{
  "email": "user1.wta@maildrop.cc",
  "password": "123456"
}
```

Response:

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "...",
    "email": "user1.wta@maildrop.cc",
    "role": "user"
  }
}
```

Use the returned token for authenticated requests:

```
Authorization: Bearer <token>
```

---

# Google OAuth Testing

The API supports **Google OAuth authentication**.

The OAuth test credentials are provided in the project documentation.

OAuth login endpoint:

```
GET /api/auth/google
```

Successful authentication redirects to the configured frontend URL with a generated JWT token.

---

# API Documentation

Interactive API documentation is available via **Swagger UI**.

After starting the server, visit:

```
http://localhost:3000/api-docs
```

Swagger allows evaluators to:

- explore endpoints
- test requests directly
- view request/response schemas

---

# Recommended Testing Flow

1. Start the server

```
npm run dev
```

2. Seed the database

```
npm run seed:all
```

3. Login using a seeded user

```
POST /api/auth/login
```

4. Copy the JWT token

5. Use the token to test protected endpoints such as:

```
GET /api/users/profile
POST /api/booking
GET /api/booking
```

---

# Seeder Security Restriction

Seed scripts are intentionally restricted to development mode:

```js
if (process.env.NODE_ENV !== "development") {
  console.error("Seeder can only run in development!");
  process.exit(1);
}
```

This prevents accidental execution in production environments.
