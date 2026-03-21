# Manual API Testing Evidences

## AUTH

```sh

@rdashnox
# Evidence link: https://drive.google.com/drive/folders/1pMUoLG5Qp7QNGN5B9kDLp5Ej3Oh1yAeo?usp=sharing
# delete after completing the tasks

 POST /api/auth/register — PublicCreate a new user account.
 POST /api/auth/login — PublicAuthenticate a user and return a JWT token.
 GET /api/auth/google — PublicStart Google OAuth login process.
 GET /api/auth/google/callback — PublicGoogle OAuth callback that returns the authenticated user token.

```

---

## SUBSCRIPTION

```sh

@Gracielleee
# Evidence link: https://drive.google.com/drive/folders/1MgHaiRGz78_qpZpfOBa2lo-7QGVNzv8T

 POST /api/subscription/subscribe — PublicSubscribe an email to the newsletter.
 PATCH /api/subscription/unsubscribe — PublicUnsubscribe an email from the newsletter.
 GET /api/subscription — AdminRetrieve all newsletter subscriptions.
 POST /api/subscription/send-newsletter — AdminSend a newsletter message to all subscribers.

```

---

![Subscribe an email to the newsletter (Public) - POST /api/subscription/subscribe](https://img.shields.io/badge/Subscribe%20an%20email%20to%20the%20newsletter%20(Public)-POST%20%2Fapi%2Fsubscription%2Fsubscribe-green?style=flat-square&logoSize=auto&color=%23105710)
![subscribe an email to the newsletter](https://drive.google.com/uc?id=13nvzFK-xDg-AGfdXTE6wkVKy3W_Oi_Uo)

![Unsubscribe an email from the newsletter (Public) - PATCH /api/subscription/unsubscribe](https://img.shields.io/badge/Unsubscribe%20an%20email%20from%20the%20newsletter%20(Public)-PATCH%20%2Fapi%2Fsubscription%2Funsubscribe-green?style=flat-square&logoSize=auto&color=%23105710)
![unsubscribe an email from the newsletter](https://drive.google.com/uc?id=1xEhVx2DHh4oA9uyx78Td6tPaDHYDrW22)

![Retrieve all newsletter subscriptions (Admin) - GET /api/subscription](https://img.shields.io/badge/Retrieve%20all%20newsletter%20subscriptions%20(Admin)-GET%20%2Fapi%2Fsubscription-green?style=flat-square&logoSize=auto&color=%23105710)
![retrieve all newsletter subscriptions](https://drive.google.com/uc?id=1IEJ16vWKSM_3u31Eqz8bKB7Kd_eATNwy)

![Send a newsletter message to all subscribers (Admin) - POST /api/subscription/send-newsletter](https://img.shields.io/badge/Send%20a%20newsletter%20message%20to%20all%20subscribers%20(Admin)-POST%20%2Fapi%2Fsubscription%2Fsend--newsletter-green?style=flat-square&logoSize=auto&color=%23105710)
![send a newsletter message to all subscribers](https://drive.google.com/uc?id=1nnUUi9AvEJJiqU5nbLa-qijF2pfToDi6)

---

## CONTACT

```sh

@Gracielleee
# Evidence link: https://drive.google.com/drive/folders/1MgHaiRGz78_qpZpfOBa2lo-7QGVNzv8T

 POST /api/contact — PublicSubmit a contact message through the contact form.
 GET /api/contact — AdminRetrieve all contact messages.
 PUT /api/contact/:id/read — AdminMark a contact message as read.

```
![Submit a contact message through the contact form (Public) - POST /api/contact](https://img.shields.io/badge/Submit%20a%20contact%20message%20through%20the%20contact%20form%20(Public)-POST%20%2Fapi%2Fcontact-green?style=flat-square&logoSize=auto&color=%23105710)
![submit a contact message through the contact form](https://drive.google.com/uc?id=1QZHZxmxnz5lmEfSVmHWaKY2oOSFFHzVl)

![Retrieve all contact messages (Admin) - GET /api/contact](https://img.shields.io/badge/Retrieve%20all%20contact%20messages%20(Admin)-GET%20%2Fapi%2Fcontact-green?style=flat-square&logoSize=auto&color=%23105710)
![Retrieve all contact messages](https://drive.google.com/uc?id=1v1Hgyp98zhJT6iZK7WOclWnAUH6YCw4d)

![Mark a contact message as read (Admin) - PUT /api/contact/:id/read](https://img.shields.io/badge/Mark%20a%20contact%20message%20as%20read%20(Admin)-PUT%20%2Fapi%2Fcontact%2F:id%2Fread-green?style=flat-square&logoSize=auto&color=%23105710)
![mark a contact message as read](https://drive.google.com/uc?id=1tq2BI3plwowb_KWK_6lbWTOWuG29k4QD)

---

## USERS

```sh

@rdashnox
# Evidence link: https://drive.google.com/drive/folders/1pMUoLG5Qp7QNGN5B9kDLp5Ej3Oh1yAeo?usp=sharing
# delete after completing the tasks

 GET /api/users/profile — AuthenticatedRetrieve the currently logged-in user profile.
 GET /api/users — AdminRetrieve a list of all registered users.
 DELETE /api/users/:id — AdminDelete a specific user account.

```

---

## BOOKING

```sh

@rdashnox
# Evidence link: https://drive.google.com/drive/folders/1pMUoLG5Qp7QNGN5B9kDLp5Ej3Oh1yAeo?usp=sharing
# delete after completing the tasks
 POST /api/booking — AuthenticatedCreate a new room booking.
 GET /api/booking/my — AuthenticatedRetrieve bookings made by the currently logged-in user.GET /api/booking — AdminRetrieve all bookings in the system.
 PUT /api/booking/:id — User/AdminUpdate an existing booking.
 PATCH /api/booking/:id — User/AdminCancel a booking.

```

---

## ROOMS

```sh

@k358k
# Evidence link: https://drive.google.com/drive/folders/19X8eIzMjQu9N2BBdL3qe5JkOn-XI-iNV?usp=sharing
# delete after completing the tasks

 GET /api/rooms — PublicRetrieve a list of all available rooms.
 GET /api/rooms/:id — PublicRetrieve details of a specific room.
 GET /api/rooms/:id/price — PublicPreview the calculated price for a room.
 POST /api/rooms — AdminCreate a new room listing.
 PUT /api/rooms/:id — AdminUpdate room information.
 DELETE /api/rooms/:id — AdminDelete a room.

```

## UPLOAD

![Upload Image](https://img.shields.io/badge/Upload%20Image-POST%20%2Fapi%2Fupload%2Fimage-2ea44f?style=flat-square)
![Upload Image](https://drive.google.com/uc?id=1MKA798aFzIw6txhVJ7j_DN1_R67zrlaD)

![Cloudinary Storage](https://img.shields.io/badge/Image%20Storage-Cloudinary-blue?style=flat-square)
![Upload Image](https://drive.google.com/uc?id=1WTbTMRGdVA-3n96352X-mw_t1nDJQDVB)
