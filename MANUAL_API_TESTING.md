# Manual API Testing Evidences

## AUTH

![Create a new user account (Public) - POST /api/auth/register](<https://img.shields.io/badge/Create%20a%20new%20user%20account%20(Public)-POST%20%2Fapi%2Fauth%2Fregister-green?style=flat-square&logoSize=auto&color=%23105710>)
![Create a new user account](https://drive.google.com/uc?id=1_Qp2aHnSmqdnyuMQDTlZzSiNjID0z1Mg)

![Authenticate a user and return a JWT token (Public) - POST /api/auth/login](<https://img.shields.io/badge/Authenticate%20a%20user%20and%20return%20a%20JWT%20token%20(Public)-POST%20%2Fapi%2Fauth%2Flogin-green?style=flat-square&logoSize=auto&color=%23105710>)
![Authenticate a user and return a JWT token](https://drive.google.com/uc?id=16sDdHAUsIdlXi4r-x4n7jbtxyl_50D58)

![Start Google OAuth login process (Public) - GET /api/auth/google](<https://img.shields.io/badge/Start%20Google%20OAuth%20login%20process%20(Public)-GET%20%2Fapi%2Fauth%2Fgoogle-green?style=flat-square&logoSize=auto&color=%23105710>)
![Start Google OAuth login process](https://drive.google.com/uc?id=1x7ftRRepLJEmi49AoD9otQiiMA9P2vHn)

![Google OAuth callback that returns the authenticated user token (Public) - GET /api/auth/google/callback](<https://img.shields.io/badge/Google%20OAuth%20callback%20that%20returns%20the%20authenticated%20user%20token%20(Public)-GET%20%2Fapi%2Fauth%2Fgoogle%2Fcallback-green?style=flat-square&logoSize=auto&color=%23105710>)
![Google OAuth callback that returns the authenticated user token](https://drive.google.com/uc?id=1CmFrlotAaXaJCouQd11TIVASJHVEZu6F)

---

## SUBSCRIPTION

![Subscribe an email to the newsletter (Public) - POST /api/subscription/subscribe](<https://img.shields.io/badge/Subscribe%20an%20email%20to%20the%20newsletter%20(Public)-POST%20%2Fapi%2Fsubscription%2Fsubscribe-green?style=flat-square&logoSize=auto&color=%23105710>)
![subscribe an email to the newsletter](https://drive.google.com/uc?id=13nvzFK-xDg-AGfdXTE6wkVKy3W_Oi_Uo)

![Unsubscribe an email from the newsletter (Public) - PATCH /api/subscription/unsubscribe](<https://img.shields.io/badge/Unsubscribe%20an%20email%20from%20the%20newsletter%20(Public)-PATCH%20%2Fapi%2Fsubscription%2Funsubscribe-green?style=flat-square&logoSize=auto&color=%23105710>)
![unsubscribe an email from the newsletter](https://drive.google.com/uc?id=1xEhVx2DHh4oA9uyx78Td6tPaDHYDrW22)

![Retrieve all newsletter subscriptions (Admin) - GET /api/subscription](<https://img.shields.io/badge/Retrieve%20all%20newsletter%20subscriptions%20(Admin)-GET%20%2Fapi%2Fsubscription-green?style=flat-square&logoSize=auto&color=%23105710>)
![retrieve all newsletter subscriptions](https://drive.google.com/uc?id=1IEJ16vWKSM_3u31Eqz8bKB7Kd_eATNwy)

![Send a newsletter message to all subscribers (Admin) - POST /api/subscription/send-newsletter](<https://img.shields.io/badge/Send%20a%20newsletter%20message%20to%20all%20subscribers%20(Admin)-POST%20%2Fapi%2Fsubscription%2Fsend--newsletter-green?style=flat-square&logoSize=auto&color=%23105710>)
![send a newsletter message to all subscribers](https://drive.google.com/uc?id=1nnUUi9AvEJJiqU5nbLa-qijF2pfToDi6)

---

## CONTACT

![Submit a contact message through the contact form (Public) - POST /api/contact](<https://img.shields.io/badge/Submit%20a%20contact%20message%20through%20the%20contact%20form%20(Public)-POST%20%2Fapi%2Fcontact-green?style=flat-square&logoSize=auto&color=%23105710>)
![submit a contact message through the contact form](https://drive.google.com/uc?id=1QZHZxmxnz5lmEfSVmHWaKY2oOSFFHzVl)

![Retrieve all contact messages (Admin) - GET /api/contact](<https://img.shields.io/badge/Retrieve%20all%20contact%20messages%20(Admin)-GET%20%2Fapi%2Fcontact-green?style=flat-square&logoSize=auto&color=%23105710>)
![Retrieve all contact messages](https://drive.google.com/uc?id=1v1Hgyp98zhJT6iZK7WOclWnAUH6YCw4d)

![Mark a contact message as read (Admin) - PUT /api/contact/:id/read](<https://img.shields.io/badge/Mark%20a%20contact%20message%20as%20read%20(Admin)-PUT%20%2Fapi%2Fcontact%2F:id%2Fread-green?style=flat-square&logoSize=auto&color=%23105710>)
![mark a contact message as read](https://drive.google.com/uc?id=1tq2BI3plwowb_KWK_6lbWTOWuG29k4QD)

---

## USERS

![Retrieve the currently logged-in user profile (Authenticated) - GET /api/users/profile](<https://img.shields.io/badge/Retrieve%20the%20currently%20logged--in%20user%20profile%20(Authenticated)-GET%20%2Fapi%2Fusers%2Fprofile-green?style=flat-square&logoSize=auto&color=%23105710>)
![Retrieve the currently logged-in user profile](https://drive.google.com/uc?id=1Efg55s9z7Jbn-NuDuJh7W4gZeivBK_zy)

![Retrieve a list of all registered users (Admin) - GET /api/users](<https://img.shields.io/badge/Retrieve%20a%20list%20of%20all%20registered%20users%20(Admin)-GET%20%2Fapi%2Fusers-green?style=flat-square&logoSize=auto&color=%23105710>)
![Retrieve a list of all registered users](https://drive.google.com/uc?id=1a6TZ--EvyBtsxKTdiMoK9YQgab7YjL5p)

![Delete a specific user account (Admin) - DELETE /api/users/:id](<https://img.shields.io/badge/Delete%20a%20specific%20user%20account%20(Admin)-DELETE%20%2Fapi%2Fusers%2F%3Aid-green?style=flat-square&logoSize=auto&color=%23105710>)
![Delete a specific user account](https://drive.google.com/uc?id=1Dj5ZVG--lC9Yef63xmGa465-qyY5vv-z)

---

## BOOKING

![Create a new room booking (Authenticated) - POST /api/booking](<https://img.shields.io/badge/Create%20a%20new%20room%20booking%20(Authenticated)-POST%20%2Fapi%2Fbooking-green?style=flat-square&logoSize=auto&color=%23105710>)
![Create a new room booking](https://drive.google.com/uc?id=126dEiCbkw4IbZWSPS6NeRRMrie1Bm6aK)

![Retrieve bookings made by the currently logged-in user (Authenticated) - GET /api/booking/my](<https://img.shields.io/badge/Retrieve%20bookings%20made%20by%20the%20currently%20logged--in%20user%20(Authenticated)-GET%20%2Fapi%2Fbooking%2Fmy-green?style=flat-square&logoSize=auto&color=%23105710>)
![Retrieve bookings made by the currently logged-in user](https://drive.google.com/uc?id=1P8QWjlLyUnW4V5_u76hEGmS7jX4XaMx7)

![Retrieve all bookings in the system (Admin) - GET /api/booking](<https://img.shields.io/badge/Retrieve%20all%20bookings%20in%20the%20system%20(Admin)-GET%20%2Fapi%2Fbooking-green?style=flat-square&logoSize=auto&color=%23105710>)
![Retrieve all bookings in the system](https://drive.google.com/uc?id=1eYTazWgL9_8fm4hebaTpDZGC-EpITmGR)

![Update an existing booking (Authenticated) - PUT /api/booking/:id](<https://img.shields.io/badge/Update%20an%20existing%20booking%20(Authenticated)-PUT%20%2Fapi%2Fbooking%2F%3Aid-green?style=flat-square&logoSize=auto&color=%23105710>)
![Update an existing booking](https://drive.google.com/uc?id=10eSOslf9A_1Ucf47ji4h--6KQG8R8fMZ)

![Cancel a booking (Authenticated) - PATCH /api/booking/:id](<https://img.shields.io/badge/Cancel%20a%20booking%20(Authenticated)-PATCH%20%2Fapi%2Fbooking%2F%3Aid-green?style=flat-square&logoSize=auto&color=%23105710>)
![Cancel a booking](https://drive.google.com/uc?id=19xHdnBdydgnUBPDbqsWE7TgvXNcn_W8P)

---

## ROOMS

```sh

@k358k

 GET /api/rooms — PublicRetrieve a list of all available rooms.
 GET /api/rooms/:id — PublicRetrieve details of a specific room.
 GET /api/rooms/:id/price — PublicPreview the calculated price for a room.
 POST /api/rooms — AdminCreate a new room listing.
 PUT /api/rooms/:id — AdminUpdate room information.
 DELETE /api/rooms/:id — AdminDelete a room.

```
---
![Retrieve a list of all available rooms (Public) - GET /api/rooms](https://img.shields.io/badge/Retrieve%20all%20available%20rooms%20(Public)-GET%20%2Fapi%2Frooms-green?style=flat-square&logoSize=auto&color=%23105710)
![Get All Rooms](https://drive.google.com/uc?id=1Y9bT9BxeQBqC8uMP2Pp6KsyuXxqGbdbl)

![Retrieve details of a specific room (Public) - GET /api/rooms/:id](https://img.shields.io/badge/Retrieve%20room%20details%20(Public)-GET%20%2Fapi%2Frooms%2F:id-green?style=flat-square&logoSize=auto&color=%23105710)
![Get Room Details](https://drive.google.com/uc?id=1eS6ivPGYuA5FPBqjHMDxdbSYTr2fbgzh)

![Preview the calculated price for a room (Public) - GET /api/rooms/:id/price](https://img.shields.io/badge/Preview%20price%20calculation%20(Public)-GET%20%2Fapi%2Frooms%2F:id%2Fprice-green?style=flat-square&logoSize=auto&color=%23105710)
![Price Calculation](https://drive.google.com/uc?id=1ec3XemHuVJ6YQiBznwVytUeSaEvZbbYh)

![Create a new room listing (Admin) - POST /api/rooms](https://img.shields.io/badge/Create%20a%20new%20room%20listing%20(Admin)-POST%20%2Fapi%2Frooms-green?style=flat-square&logoSize=auto&color=%23105710)
![Create Room](https://drive.google.com/uc?id=1a1_vLgruWwNo_hnSC6fvZTfFaPVr1IPZ)

![Update room information (Admin) - PUT /api/rooms/:id](https://img.shields.io/badge/Update%20room%20information%20(Admin)-PUT%20%2Fapi%2Frooms%2F:id-green?style=flat-square&logoSize=auto&color=%23105710)
![Update Room](https://drive.google.com/uc?id=1PyU2DIS7g6dVbQUtfr4Ts82TI7n6D-K4)

![Delete a room (Admin) - DELETE /api/rooms/:id](https://img.shields.io/badge/Delete%20a%20room%20(Admin)-DELETE%20%2Fapi%2Frooms%2F:id-green?style=flat-square&logoSize=auto&color=%23105710)
![Delete Room](https://drive.google.com/uc?id=1NRdrm9yQ3daz_BMTVgrp3pLipFHUSoje)

---

---

## UPLOAD

![Upload Image](https://img.shields.io/badge/Upload%20Image-POST%20%2Fapi%2Fupload%2Fimage-2ea44f?style=flat-square)
![Upload Image](https://drive.google.com/uc?id=1MKA798aFzIw6txhVJ7j_DN1_R67zrlaD)

![Cloudinary Storage](https://img.shields.io/badge/Image%20Storage-Cloudinary-blue?style=flat-square)
![Upload Image](https://drive.google.com/uc?id=1WTbTMRGdVA-3n96352X-mw_t1nDJQDVB)
