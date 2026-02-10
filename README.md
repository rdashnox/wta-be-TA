# wta-be

This project is the **backend extension** of the Skye Suites static hotel website (HTML/CSS/JS). It provides **dynamic features** such as booking management, contact handling, and subscriptions using a Node.js/Express API connected to MongoDB. For the frontend part of the project, see the [wta-fe repository](https://github.com/imperionite/wta-fe).

For technical version of this document, see [README-TECHNICAL](https://github.com/imperionite/wta-be/blob/main/README-TECHNICAL.md)

---

## Overview

The API enhances the original static website by enabling:

- **User Authentication:** Secure guest accounts with JWT and role-based access control (user/admin)
- **Booking System:** Rooms are treated as infinitely available; availability is derived from bookings rather than a fixed inventory.
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

---

## API Documentation

This section documents the manual API tests performed during our initial coding sprint.  
Screenshots are provided for reference.

### Authentication Endpoint

![CREATE a User (Public) - POST /api/auth/register](<https://img.shields.io/badge/CREATE%20a%20User%20(Public)-POST%20%2Fapi%2Fauth%2Fregister-green?style=flat-square&logoSize=auto&color=%23105710>)
![create a user](https://drive.google.com/uc?id=1Ng5mWvRN8POkCNUWE_4AzwxaiH2eMCL4)

![User Login [Public] - POST /api/auth/login](<https://img.shields.io/badge/User%20Login%20(Public)-POST%20%2Fapi%2Fauth%2Flogin-green?style=flat-square&logoSize=auto&color=%23105710>)
![user login](https://drive.google.com/uc?id=1hZJHga8MStceag-PM-ozAZLfLz7x_t9O)

</br>

### Room Endpoint

![CREATE a Room (Auth: Admin) - POST /api/rooms](<https://img.shields.io/badge/CREATE%20a%20Room%20(Auth%3A%20Admin)-POST%20%2Fapi%2Frooms-green?style=flat-square&logoSize=auto&color=%23105710>)
![create a room](https://drive.google.com/uc?id=1mQYzTyIJTSwxw1RbidZFveIEqLMLsFA1)

![FETCH All Rooms (Public)-GET /api/rooms](<https://img.shields.io/badge/FETCH%20All%20Rooms%20(Public)-GET%20%2Fapi%2Frooms-green?style=flat-square&logoSize=auto&color=%23105710>)
![fetch all rooms](https://drive.google.com/uc?id=1C8WhtB-2ilxe6pICAgZ6j-XoWYd7fCsI)

![FETCH a Room by ID (Public) - GET /api/rooms/{room_id}](<https://img.shields.io/badge/FETCH%20a%20Room%20by%20ID%20(Public)-GET%20%2Fapi%2Frooms%2F%7Broom__id%7D-green?style=flat-square&logoSize=auto&color=%23105710>)
![fetch a room by id](https://drive.google.com/uc?id=1AamsCN9ad0qY3jhqKLbIwAdvBAg5U1X2)

![FETCH a Room by ID After Deletion - GET /api/rooms/{room_id}](https://img.shields.io/badge/FETCH%20a%20Room%20by%20ID%20After%20Deletion%20-%20GET%20%2Fapi%2Frooms%2F%7Broom__id%7D-red?style=flat-square&logoSize=auto&color=%238A3020)
![fetch a room by id after deletion](https://drive.google.com/uc?id=1xsJ2N56gFkJAJbdlrPbSu1hokN-b7a4U)

![Update a Room by ID (Auth: Admin) - PUT /api/rooms/{room_id}](<https://img.shields.io/badge/UPDATE%20a%20Room%20by%20ID%20(Auth%3A%20Admin)-PUT%20%2Fapi%2Frooms%2F%7Broom__id%7D-green?style=flat-square&logoSize=auto&color=%23105710>)
![update a room by id](https://drive.google.com/uc?id=1vnbb1-ITlwyxtfcR9qQMQvkPcmIjDIDK)

![DELETE a Room by ID (Auth: Admin)-DELETE /api/rooms/{room_id}](<https://img.shields.io/badge/DELETE%20a%20Room%20by%20ID%20(Auth%3A%20Admin)-DELETE%20%2Fapi%2Frooms%2F%7Broom__id%7D-green?style=flat-square&logoSize=auto&color=%23105710>)
![delete a room by id](https://drive.google.com/uc?id=1iS7JY1q7RqHRHQHNz_7TLICjGqkC7P7Z)

</br>

### Booking Endpoint

![CREATE a Booking (Auth)-POST /api/booking/](<https://img.shields.io/badge/CREATE%20a%20Booking%20(Auth)-POST%20%2Fapi%2Fbooking%2F-green?style=flat-square&logoSize=auto&color=%23105710>)
![create a booking](https://drive.google.com/uc?id=1EZ7D_QzkNk4RXBxkFzqrgnattH-_FuBq)

![CREATE a Booking for Already Occupied Dates (Auth)-POST /api/booking/](<https://img.shields.io/badge/CREATE%20a%20Booking%20for%20Already%20Occupied%20Dates%20(Auth)-POST%20%2Fapi%2Fbooking%2F-green?style=flat-square&logoSize=auto&color=%238A3020>)
![create a booking for already occupied dates](https://drive.google.com/uc?id=1Xt8TfSLj0TjUt9S2fYRa15xWIl3wKlG6)

![FETCH All Bookings (Auth: Admin)-GET /api/booking](<https://img.shields.io/badge/FETCH%20All%20Bookings%20(Auth%3A%20Admin)-GET%20%2Fapi%2Fbooking-green?style=flat-square&logoSize=auto&color=%23105710>)
![fetch all bookings](https://drive.google.com/uc?id=1ul5OPMn2kxXBopfCbFWhhxnxsrOGQp_k)

![DELETE a Booking (Auth)-DELETE /api/booking/{booking__id}](<https://img.shields.io/badge/DELETE%20a%20Booking%20(Auth)-DELETE%20%2Fapi%2Fbooking%2F%7Bbooking__id%7D-green?style=flat-square&logoSize=auto&color=%23105710>)
![delete a booking](https://drive.google.com/uc?id=1macSn86ocDHZrrN4WgU2ILYxl9Ezf-vU)

</br>

### Contact Endpoint

![CREATE a Contact Message (Public)-POST /api/contact](<https://img.shields.io/badge/CREATE%20a%20Contact%20Message%20(Public)-POST%20%2Fapi%2Fcontact-green?style=flat-square&logoSize=auto&color=%23105710>)
![create a contact message](https://drive.google.com/uc?id=1NyFW_-IXUz55eSMVqvRFA1xUzGqECQgL)

![FETCH All Contact Messages (Auth: Admin)-GET /api/contact](<https://img.shields.io/badge/FETCH%20All%20Contact%20Messages%20(Auth%3A%20Admin)-GET%20%2Fapi%2Fcontact-green?style=flat-square&logoSize=auto&color=%23105710>)
![fetch all contact messages](https://drive.google.com/uc?id=16zXb11JlztVOc5JxeEjMk-46O0vIM0iq)

![UPDATE a Contact Message as Read (Auth: Admin)-PUT /api/contact/{message__id}/read](<https://img.shields.io/badge/UPDATE%20a%20Contact%20Message%20as%20Read%20(Auth%3A%20Admin)-PUT%20%2Fapi%2Fcontact%2F%7Bmessage__id%7D%2Fread-green?style=flat-square&logoSize=auto&color=%23105710>)
![update a contact message as read](https://drive.google.com/uc?id=1fk81v7tNl7yNYDiEop3EE36my6MSMVuH)

### Subscription Endpoint

![Subscribe (Public)-POST /api/subscription/subscribe](<https://img.shields.io/badge/Subscribe%20(Public)-POST%20%2Fapi%2Fsubscription%2Fsubscribe-green?style=flat-square&logoSize=auto&color=%23105710>)
![subscribe](https://drive.google.com/uc?id=12bBGCuonRnWO5o3LdNrrG3s6dxg83HWn)

![SEND a Newsletter (Auth: Admin)-POST /api/subscription/send--newsletter](<https://img.shields.io/badge/SEND%20a%20Newsletter%20(Auth%3A%20Admin)-POST%20%2Fapi%2Fsubscription%2Fsend--newsletter-green?style=flat-square&logoSize=auto&color=%23105710>)
![send a newsletter](https://drive.google.com/uc?id=1cDYxFXl5e8fGFO8RgJEyz1eHCnqOfdk7)

![FETCH All Subscribers (Auth: Admin)-GET /api/subscription/](<https://img.shields.io/badge/FETCH%20All%20Subscribers%20(Auth%3A%20Admin)-GET%20%2Fapi%2Fsubscription%2F-green?style=flat-square&logoSize=auto&color=%23105710>)
![fetch all subscribers](https://drive.google.com/uc?id=11G-g4dF6-2N9CljUUUlu3ik4_tqWmUJ-)

![Unsubscribe (Auth: Admin)-PATCH /api/subscription/unsubscribe](<https://img.shields.io/badge/Unsubscribe%20(Auth%3A%20Admin)-PATCH%20%2Fapi%2Fsubscription%2Funsubscribe-green?style=flat-square&logoSize=auto&color=%23105710>)
![unsubscribe](https://drive.google.com/uc?id=1W-rcF6njGjawb_Zivc0YaZt1nG6gegIz)
