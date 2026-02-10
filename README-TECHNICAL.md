# Project Technical Documentation

This document provides **all technical and operational guidance** for running, developing, and extending the Skye Suites Dynamic Hotel Facility backend API.

---

## Project Overview

This project converts a static hotel facility website into a **full-stack academic project** with Node.js/Express backend connected to MongoDB.

## Prerequisites

- **Node.js** version **18.x or later** (LTS recommended) must be installed on your machine.
- **npm** is included with Node.js and will be used to manage dependencies.

You can verify your Node.js version by running:

```bash
node -v
```

If Node.js is not installed or your version is below 18, please install the latest LTS version before proceeding.

---

### Core Resources

| Resource     | Description                               | Access Control                 |
| ------------ | ----------------------------------------- | ------------------------------ |
| Users        | Register, login, manage profiles          | Users / Admin                  |
| Bookings     | Manage reservations and room availability | Protected (Users/Admin)        |
| Contact      | Submit messages                           | Public POST / Admin GET        |
| Subscription | Newsletter sign-ups                       | Public POST / Admin GET/DELETE |
| Rooms        | CRUD for hotel rooms                      | Admin only                     |

---

## Folder Structure

```

project/
│
├─ models/          # Mongo schemas (User, Booking, Contact, Subscription, Room)
├─ controllers/     # Business logic for each resource
├─ routes/          # Express routes per resource
├─ config/          # DB, environment, and Passport configuration
├─ seeders/         # Seed/delete scripts for development
├─ public/          # Static assets
├─ app.js           # Express app setup
└─ server.js        # Server entrypoint

```

**Note:** Scaffold layers/files are **locked**. Group members add features in new files only.

---

## Environment Variables

🌱 Create `.env` (Important):

```bash
NODE_ENV=development
PORT=3000 # you can change this locally
MONGO_URI=connection string from your Mongo Atlas or the provided one
JWT_SECRET=your_jwt_secret_here_create_your_own # generate your own secret
FRONTEND_URL=http://localhost:4123 # real frontend URL to be used
```

- `NODE_ENV`: `development`, `production`, `test`
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret
- `FRONTEND_URL`: Frontend URL for CORS

---

## Installation & Running

```bash
git clone https://github.com/imperionite/wta-be.git
cd wta-be
npm install
```

Start development:

```bash
npm run dev   # run for daily development use
npm start     # should be run when deployed in the cloud only as a start script; never run this locally
npm run seed:users # seed initial users (dev only; read seeder/usersSeeder.js)
npm run seed:clear # delete all users (dev only; read seeder/deleteAllUsers.js)
npm run test # on progress; no test environment yet

```

---

## **Locked Scaffold Files**

❌ DO NOT EDIT THESE FILES WITHOUT PERMISSION

### **A. Models**

- `models/User.js` → User schema with password hashing, comparePassword method, JWT-ready.
- `models/Room.js` → Room schema with full CRUD-ready API (already working).

---

### **B. Controllers**

- `controllers/auth.controller.js` → register & login functions, JWT creation.
- `controllers/user.controller.js` → getProfile function.

---

### **C. Routes**

- `routes/auth.js` → `/register` and `/login`.
- `routes/user.js` → `/profile` (JWT-protected).

---

### **D. Seeder Scripts**

- `seeder/usersSeeder.js` → seed default users.
- `seeder/deleteAllUsers.js` → delete all users in dev.

---

### **E. Config & DB**

- `config/config.js` → all environment variables and defaults.
- `config/db.js` → MongoDB connection with in-memory option for testing.
- `.env.example` → **to be provided for group members** (see below).

---

### **F. Middleware & Auth**

- `config/passport.js` → JWT strategy (Google OAuth commented out).

---

### **G. App Entry**

- `app.js` → Express app with middleware, routes, 404 & error handlers.

📌 These files define how the system fits together. Changing them affects everyone.

---

## Authentication & JWT

- JWT payload uses `id` (not `_id`) to simplify frontend usage.
- All API responses expose `id` instead of `_id`.
- Passport JWT strategy uses `payload.id`.

**Example JWT Payload:**

```json
{
  "id": "65a9e3b8c4f1e23456789abc",
  "email": "user1@example.com",
  "role": "user"
}
```

---

## Role-Based Access Control (RBAC)

- **User:** Own bookings, profile
- **Admin:** Manage all bookings, rooms, messages, subscriptions
- **Public:** Submit contact or subscription messages

Example check:

```js
if (req.user.role !== "admin") {
  return res.status(403).json({ message: "Forbidden" });
}
```

---

## API Conventions

- Standard REST endpoints
- `id` replaces `_id` in responses
- Passwords never returned
- Consistent error handling:

```json
{ "message": "Detailed error message" }
```

- Status codes: 200, 201, 400, 401, 403, 404, 500

---

## Frontend Integration

- Use `user.id`, `booking.id`, `contact.id`, `subscription.id`
- JWT in `Authorization: Bearer <token>`
- Example fetch:

```js
const token = localStorage.getItem("accessToken");
const res = await fetch("http://localhost:3000/api/users/profile", {
  headers: { Authorization: `Bearer ${token}` },
});
const data = await res.json();
console.log(data.id, data.email, data.role);
```

---

## Limitations & Flexibility

- Beginner-friendly backend scope; some features may be simplified
- Time constraints may limit third-party API integrations
- Free cloud storage may limit scalability
- Testing coverage may vary

---

## Testing

- `NODE_ENV=test` + MongoMemoryServer for automated tests
- Seeders optional in tests
- Postman + Jest recommended

---

## Notes for Contributors

- Scaffold files are **locked**
- New resources/features should follow REST + RBAC conventions
- Use `id` for all frontend communication
- Contact & subscription forms **do not need real email sending**, mock is acceptable
- Booking system is protected; advanced endpoints can be assigned to two members if needed

### **Booking Rules & Business Assumptions**

#### **Booking Creation**

- **Required fields**: first name, last name, phone, email, check-in/check-out dates, room, adults, and board type.
- **Validation**:
  - Check-in date cannot be in the past.
  - Check-out date must be after the check-in date.
  - At least one adult is required for a booking.

- **Pricing**: Pricing is calculated **server-side** based on the room price at the time of booking, number of guests, and selected board type.
- **Room availability**: Rooms are checked for availability based on the booking’s check-in and check-out dates. If the room is unavailable for the selected dates, the booking cannot be created.

---

#### **Booking Updates**

- **Allowed updates**:
  - Check-out date
  - Number of adults/children
  - Board type (e.g., Breakfast, Half-board)
  - Booking notes

- **Limitations**:
  - **Check-in date cannot be modified** once the booking is created.
  - Bookings cannot be modified after the check-in date has passed.

- **Pricing**: Updates that change the number of guests or dates trigger a full recalculation of pricing.
- **Availability**: When modifying a booking, the system will re-check room availability for the new dates. If the room is unavailable, an error will be returned.

---

#### **Booking Cancellation (Soft-Delete)**

- Bookings are **soft-deleted** by updating their status rather than being removed from the database.
- **Status field**:
  - `"active"`: The booking is valid and confirmed.
  - `"cancelled"`: The booking has been cancelled but remains in the database for historical reference.
  - `"completed"`: The booking has been completed (though not yet implemented in this POC).

- **Cancellation Process**:
  - A user can cancel their own booking, and an admin can cancel any booking.
  - When a booking is cancelled, its status is updated to `"cancelled"`, and it is retained in the database for record-keeping.

---

### **Room Availability & Race Condition**

Room availability is determined based on overlapping bookings for the selected check-in and check-out dates.

**Known Issue:**

- Since availability is checked separately from booking creation, there is a possibility of a race condition where two users could book the same room for the same dates at the same time. This issue is not addressed in the current implementation but is acknowledged as a limitation for the proof-of-concept.

**Future Considerations**:

- In a production system, this race condition would be addressed using **MongoDB transactions** or **inventory locking** to make room availability checks and bookings atomic operations.

---

### **Known Limitations**

- **Concurrency issues**: No protection against concurrent bookings for the same room/date range (race condition).
- **No room inventory**: The system does not track an actual inventory of rooms, treating them as infinitely available.
- **Booking status lifecycle**: Currently, bookings are either active or cancelled. A full lifecycle (e.g., confirmed, completed, refunded) would be implemented in a real-world system.
- **Refunds and payments**: The current system does not handle payments, refunds, or payment statuses.
- **Booking history**: There is no history of changes made to a booking (e.g., date changes, price updates).

These limitations are **intentional** and part of the project’s scope as a proof-of-concept.

---

### **Seeder Behavior**

- The current **seeder** script performs a **hard delete** on all resources (users, bookings, rooms, subscriptions) for resetting the development database.
- **Important Note**: The seeder bypasses any business rules, including the soft-delete logic for bookings. This is acceptable for development purposes but is not reflective of the application’s real-world behavior.
- For the production environment, bookings would be **soft-deleted** by updating their `status` to `"cancelled"`, preserving historical data.

### Example seeder modification for soft-deleting bookings:

```js
// Instead of hard-deleting bookings, update the status to 'cancelled'
await Booking.updateMany({}, { status: "cancelled" });
```

---

### **Room Availability & Booking Race Condition: Future Considerations**

In this proof-of-concept, **room availability** is checked by querying overlapping bookings at the time of booking creation. However, since availability checks and bookings are not wrapped in a single atomic transaction, there exists a potential **race condition** where two users could book the same room at the same time.

**Possible improvements**:

- **MongoDB Transactions**: Implementing MongoDB transactions would ensure atomicity between availability checks and booking creation, preventing race conditions.
- **Pessimistic Locking**: Locking the room’s availability during the booking process could ensure that only one user can book a room for a specific date range.
- **Inventory Model**: Implementing an inventory model that tracks available rooms per date could be used to prevent double bookings.

## Additional Notes

- **Seeders**: The current seeders clear out all resources, including bookings, by performing hard deletes. This does not reflect the production-level behavior, where bookings would be soft-deleted (status updated to "cancelled").
- **Change Requests**: In future iterations, the following could be added:
  - Full inventory management for rooms
  - Transactional safety for concurrent bookings
  - A complete booking lifecycle (confirmed, completed, cancelled)
  - Payment integration and refund logic
