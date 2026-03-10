# Entity-Relationship Diagram

The ERD visually represents the **collections and their relationships** in the system:

- **Users**, **Rooms**, **Bookings**, **Contacts**, and **Subscriptions** are the main collections.
- **Relationships**:
  - A **User** can have multiple **Bookings**.
  - A **Room** can be booked multiple times (**Bookings** reference Rooms).
  - Bookings reference **Users** and **Rooms** via ObjectId to establish logical relationships.

- The diagram helps evaluators understand how data flows between collections and how entities are linked for queries, reporting, and business rules enforcement.

---

# Database Dictionary

The Database Dictionary provides a **detailed description of each collection and its fields**, including data types, required constraints, and purpose:

- For example, the **Users** collection documents fields like `email`, `password`, and `role`.
- The **Bookings** collection documents `user` (reference to Users), `room` (reference to Rooms), `checkIn`, `checkOut`, and pricing information.
- This dictionary complements the ERD by giving **field-level details**, which helps evaluators quickly verify data structure, constraints, and relationships.

## 1. Users Collection

| Field     | Type     | Required | Unique | Description                     |
| --------- | -------- | -------- | ------ | ------------------------------- |
| \_id      | ObjectId | Yes      | PK     | Primary key                     |
| email     | String   | Yes      | Yes    | User email for login            |
| password  | String   | Yes      | No     | Hashed password (bcrypt)        |
| role      | String   | Yes      | No     | User role: `user` or `admin`    |
| createdAt | Date     | Yes      | No     | Timestamp when user was created |

---

## 2. Rooms Collection

| Field     | Type     | Required | Unique | Description                   |
| --------- | -------- | -------- | ------ | ----------------------------- |
| \_id      | ObjectId | Yes      | PK     | Primary key                   |
| name      | String   | Yes      | Yes    | Room name or type             |
| price     | Number   | Yes      | No     | Base price per night          |
| capacity  | Number   | Yes      | No     | Maximum number of guests      |
| amenities | Array    | No       | No     | List of room amenities        |
| createdAt | Date     | Yes      | No     | Timestamp when room was added |

---

## 3. Bookings Collection

| Field            | Type     | Required | Unique | Description                                 |
| ---------------- | -------- | -------- | ------ | ------------------------------------------- |
| \_id             | ObjectId | Yes      | PK     | Primary key                                 |
| user             | ObjectId | Yes      | No     | FK → Users `_id`                            |
| room             | ObjectId | Yes      | No     | FK → Rooms `_id`                            |
| checkInDate      | Date     | Yes      | No     | Booking start date                          |
| checkOutDate     | Date     | Yes      | No     | Booking end date                            |
| adults           | Number   | Yes      | No     | Number of adult guests                      |
| children         | Number   | No       | No     | Number of child guests                      |
| boardType        | String   | Yes      | No     | Board type: `Breakfast`, `Half-board`, etc. |
| totalCost        | Number   | Yes      | No     | Total booking cost                          |
| pricingBreakdown | Object   | No       | No     | Details of pricing calculation              |
| status           | String   | Yes      | No     | Booking status: `active`, `cancelled`       |
| createdAt        | Date     | Yes      | No     | Timestamp when booking was created          |

---

## 4. Contacts Collection

| Field     | Type     | Required | Unique | Description                          |
| --------- | -------- | -------- | ------ | ------------------------------------ |
| \_id      | ObjectId | Yes      | PK     | Primary key                          |
| name      | String   | Yes      | No     | Name of the contact                  |
| email     | String   | Yes      | No     | Email of the contact                 |
| message   | String   | Yes      | No     | Message content                      |
| createdAt | Date     | Yes      | No     | Timestamp when message was submitted |

---

## 5. Subscriptions Collection

| Field     | Type     | Required | Unique | Description                           |
| --------- | -------- | -------- | ------ | ------------------------------------- |
| \_id      | ObjectId | Yes      | PK     | Primary key                           |
| email     | String   | Yes      | Yes    | Email of subscriber                   |
| createdAt | Date     | Yes      | No     | Timestamp when subscription was added |
