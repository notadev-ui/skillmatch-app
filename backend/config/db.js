// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGODB_URI;
//     // console.log(uri)
//     await mongoose.connect(uri);
//     console.log("Database Connected Successfully");
//   } catch (err) {
//     console.error("Database connection error:", err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
  try {
    // console.log("MONGO_URI from ENV:", process.env.MONGODB_URI); // Debug check

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = connectDB;
