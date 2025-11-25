const mongoose = require('mongoose');
const Venue = require('./models/Venue');
const dotenv = require('dotenv');

dotenv.config();

async function checkVenues() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');

        const count = await Venue.countDocuments();
        console.log(`Total venues found: ${count}`);

        if (count > 0) {
            const activeCount = await Venue.countDocuments({ isActive: true });
            console.log(`Active venues found: ${activeCount}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking venues:', error);
        process.exit(1);
    }
}

checkVenues();
