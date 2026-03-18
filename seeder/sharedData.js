module.exports = {
  USERS: [
    { email: "user1.wta@maildrop.cc", password: "password123", role: "user" },
    { email: "user2.wta@maildrop.cc", password: "password123", role: "user" },
    { email: "user3.wta@maildrop.cc", password: "password123", role: "user" },
    { email: "admin.wta@maildrop.cc", password: "admin123", role: "admin" },
  ],

  ROOMS: [
    {
      type: "Silene Junior Suite",
      price: 60000,
      maxGuests: 2,
      images: [
        "https://images.pexels.com/photos/16436963/pexels-photo-16436963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
    },
    {
      type: "Lupine Junior Suite",
      price: 85000,
      maxGuests: 4,
      images: [
        "https://images.pexels.com/photos/31817153/pexels-photo-31817153.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
    },
    {
      type: "Silene Suite",
      price: 100000,
      maxGuests: 6,
      images: [
        "https://images.pexels.com/photos/28054852/pexels-photo-28054852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
    },
    {
      type: "Lupine Suite",
      price: 155000,
      maxGuests: 8,
      images: [
        "https://images.pexels.com/photos/31817155/pexels-photo-31817155.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      ],
    },
  ],

  BOOKINGS: [
    {
      email: "user1.wta@maildrop.cc",
      firstName: "John",
      lastName: "Smith",
      phone: "+639171234567",
      checkInDate: "2026-04-15",
      checkOutDate: "2026-04-18",
      adults: 1,
      children: 0,
      boardType: "Breakfast",
      note: "Business conference attendee",
    },
    {
      email: "user2.wta@maildrop.cc",
      firstName: "Anna",
      lastName: "Perez",
      phone: "+639282345678",
      checkInDate: "2026-03-09",
      checkOutDate: "2026-03-16",
      adults: 2,
      children: 4,
      boardType: "Half-board",
      note: "Family vacation with kids",
    },
    {
      email: "user3.wta@maildrop.cc",
      firstName: "Juan",
      lastName: "Dela Cruz",
      phone: "+639393456789",
      checkInDate: "2026-03-22",
      checkOutDate: "2026-03-29",
      adults: 2,
      children: 0,
      boardType: "Half-board",
      note: "Romantic honeymoon getaway",
    },
  ],
};
