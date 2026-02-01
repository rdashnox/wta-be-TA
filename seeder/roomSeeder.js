require("dotenv").config();
const Room = require("../models/Room");
const connectDB = require("../config/db");

if (process.env.NODE_ENV !== "development") {
  console.error("Seeder can only run in development!");
  process.exit(1);
}

const sampleRooms = [
  {
    roomNumber: "SJ-101",
    type: "Silene Junior Suite",
    price: 60000,
    images: [
      "https://images.pexels.com/photos/16436963/pexels-photo-16436963.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    available: true,
  },
  {
    roomNumber: "LJ-201",
    type: "Lupine Junior Suite",
    price: 85000,
    images: [
      "https://images.pexels.com/photos/31817153/pexels-photo-31817153.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    available: true,
  },
  {
    roomNumber: "S-301",
    type: "Silene Suite",
    price: 100000,
    images: [
      "https://images.pexels.com/photos/28054852/pexels-photo-28054852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    available: true,
  },
  {
    roomNumber: "L-401",
    type: "Lupine Suite",
    price: 155000,
    images: [
      "https://images.pexels.com/photos/31817155/pexels-photo-31817155.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ],
    available: true,
  },
];

const seedRooms = async () => {
  try {
    await connectDB();
    await Room.deleteMany({});
    await Room.insertMany(sampleRooms);

    console.log("Rooms seeded!");
    process.exit(0);
  } catch (error) {
    console.error("Room seeding failed:", error.message);
    process.exit(1);
  }
};

seedRooms();
