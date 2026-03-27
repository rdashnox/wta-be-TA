## Data Flow Description

This [Level 1 DFD](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&target=blank&highlight=0000ff&edit=_blank&layers=1&nav=1&title=TA.drawio&dark=0#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1q13TvgdWZNgIBC3jsFgPecsFpzZM2Zq1%26export%3Ddownload) decomposes the hotel facility system into five core processes, showing how external entities (User and Admin) interact with the system and how data flows between processes and data stores.

### External Entities

- **User (Guest/Customer)**: Registers, views rooms, books accommodations, sends messages, and subscribes to updates.
- **Admin**: Manages users, rooms, bookings, messages, and subscriptions.

### Processes

| No. | Process Name            | Description                                                         |
| --- | ----------------------- | ------------------------------------------------------------------- |
| 1.0 | User Authentication     | Handles user registration, login, and token generation.             |
| 2.0 | Room Management         | Enables room creation, updates, deletion, and listing retrieval.    |
| 3.0 | Booking Management      | Validates booking details, checks availability, calculates pricing. |
| 4.0 | Contact Management      | Stores and manages user messages and admin responses.               |
| 5.0 | Subscription Management | Manages email subscriptions and newsletter simulation.              |

### Data Stores

| Code | Name                | Contents                          |
| ---- | ------------------- | --------------------------------- |
| D1   | Users Collection    | User profiles and credentials     |
| D2   | Rooms Collection    | Room details and availability     |
| D3   | Bookings Collection | Booking records and confirmations |
| D4   | Contacts Collection | User messages and admin replies   |
| D5   | Subscriptions       | Email subscription data           |

---

### Diagram

![DFD](https://drive.google.com/uc?id=1kK8ZJctFS_jekJzi73-gYKu7rLhJVjnG)
