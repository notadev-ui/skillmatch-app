const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables here
dotenv.config();

const connectDB = async () => {
  // Use env uri if provided, otherwise fall back to localhost for development
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillmatch';

  if (!process.env.MONGODB_URI) {
    console.warn('Warning: MONGODB_URI not set in environment — using fallback:', uri);
  }

  try {
    const conn = await mongoose.connect(uri);
    const host = conn.connection.host;
    const name = conn.connection.name;
    console.log(`Database Connected Successfully: ${host}/${name}`);
  } catch (err) {
    // Provide a clearer, actionable error message for developers
    console.error('Database connection error:', err.message || err);
    console.error('Full error object:', err);
    console.error('Ensure MongoDB is running and the MONGODB_URI in your .env is correct.');
    // Do not exit the process automatically here so the server can still start and surface errors in logs.
    // If you prefer to stop startup on DB failure, uncomment the next line:
    // process.exit(1);
  }
};

module.exports = connectDB;
