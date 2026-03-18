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

## CONTACT

```sh

@Gracielleee
# Evidence link: https://drive.google.com/drive/folders/1MgHaiRGz78_qpZpfOBa2lo-7QGVNzv8T

 POST /api/contact — PublicSubmit a contact message through the contact form.
 GET /api/contact — AdminRetrieve all contact messages.
 PUT /api/contact/:id/read — AdminMark a contact message as read.

```

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
