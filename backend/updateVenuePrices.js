const mongoose = require('mongoose');
const Venue = require('./models/Venue');
const dotenv = require('dotenv');

dotenv.config();

async function updateVenuePrices() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');

        // Update all venues to have a random price between 500 and 1500
        const venues = await Venue.find({});

        for (const venue of venues) {
            const randomPrice = Math.floor(Math.random() * (1500 - 500 + 1)) + 500;
            // Round to nearest 50
            const roundedPrice = Math.round(randomPrice / 50) * 50;

            venue.pricePerHour = roundedPrice;
            await venue.save();
            console.log(`Updated ${venue.name} price to ₹${roundedPrice}`);
        }

        console.log('All venue prices updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error updating venue prices:', error);
        process.exit(1);
    }
}

updateVenuePrices();
