const mongoose = require('mongoose');
const Venue = require('./models/Venue');
const dotenv = require('dotenv');

dotenv.config();

async function activateVenues() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');

        const result = await Venue.updateMany({}, { isActive: true });
        console.log(`Updated ${result.modifiedCount} venues to active.`);

        process.exit(0);
    } catch (error) {
        console.error('Error activating venues:', error);
        process.exit(1);
    }
}

activateVenues();
