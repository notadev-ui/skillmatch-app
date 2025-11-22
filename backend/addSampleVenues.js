const mongoose = require('mongoose');
const Venue = require('./models/Venue');

async function addSampleVenues() {
  try {
    await mongoose.connect('mongodb+srv://noteadeveloper:Niti%402722@niitsh.lqsfzmh.mongodb.net/skillmatch', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const sampleVenues = [
      {
        name: 'Madison Square Garden',
        description: 'World-famous arena in New York City',
        type: 'Stadium',
        location: {
          address: '4 Pennsylvania Plaza',
          city: 'New York',
          state: 'NY',
          coordinates: {
            type: 'Point',
            coordinates: [-73.9934, 40.7505]
          }
        },
        contactEmail: 'info@msg.com',
        contactPhone: '+1-212-465-6741',
        manager: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Staples Center',
        description: 'Multi-purpose arena in downtown Los Angeles',
        type: 'Stadium',
        location: {
          address: '1111 S Figueroa St',
          city: 'Los Angeles',
          state: 'CA',
          coordinates: {
            type: 'Point',
            coordinates: [-118.2673, 34.0430]
          }
        },
        contactEmail: 'info@staplescenter.com',
        contactPhone: '+1-213-742-7100',
        manager: '507f1f77bcf86cd799439011'
      },
      {
        name: 'United Center',
        description: 'Home of the Chicago Bulls and Blackhawks',
        type: 'Stadium',
        location: {
          address: '1901 W Madison St',
          city: 'Chicago',
          state: 'IL',
          coordinates: {
            type: 'Point',
            coordinates: [-87.6742, 41.8807]
          }
        },
        contactEmail: 'info@unitedcenter.com',
        contactPhone: '+1-312-455-4500',
        manager: '507f1f77bcf86cd799439011'
      },
      {
        name: 'American Airlines Arena',
        description: 'Home of the Miami Heat',
        type: 'Stadium',
        location: {
          address: '601 Biscayne Blvd',
          city: 'Miami',
          state: 'FL',
          coordinates: {
            type: 'Point',
            coordinates: [-80.1883, 25.7814]
          }
        },
        contactEmail: 'info@aaarena.com',
        contactPhone: '+1-786-777-1000',
        manager: '507f1f77bcf86cd799439011'
      },
      {
        name: 'TD Garden',
        description: 'Home of the Boston Celtics and Bruins',
        type: 'Stadium',
        location: {
          address: '100 Legends Way',
          city: 'Boston',
          state: 'MA',
          coordinates: {
            type: 'Point',
            coordinates: [-71.0621, 42.3662]
          }
        },
        contactEmail: 'info@tdgarden.com',
        contactPhone: '+1-617-624-1000',
        manager: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Chase Field',
        description: 'Home of the Arizona Diamondbacks',
        type: 'Stadium',
        location: {
          address: '401 E Jefferson St',
          city: 'Phoenix',
          state: 'AZ',
          coordinates: {
            type: 'Point',
            coordinates: [-112.0667, 33.4455]
          }
        },
        contactEmail: 'info@chasefield.com',
        contactPhone: '+1-602-462-6500',
        manager: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Climate Pledge Arena',
        description: 'Home of the Seattle Kraken',
        type: 'Stadium',
        location: {
          address: '334 1st Ave N',
          city: 'Seattle',
          state: 'WA',
          coordinates: {
            type: 'Point',
            coordinates: [-122.3540, 47.6221]
          }
        },
        contactEmail: 'info@climatepledgearena.com',
        contactPhone: '+1-206-428-8000',
        manager: '507f1f77bcf86cd799439011'
      },
      {
        name: 'Ball Arena',
        description: 'Home of the Denver Nuggets and Avalanche',
        type: 'Stadium',
        location: {
          address: '1000 Chopper Cir',
          city: 'Denver',
          state: 'CO',
          coordinates: {
            type: 'Point',
            coordinates: [-105.0075, 39.7487]
          }
        },
        contactEmail: 'info@ballarena.com',
        contactPhone: '+1-303-405-1100',
        manager: '507f1f77bcf86cd799439011'
      }
    ];

    const createdVenues = [];
    for (const venueData of sampleVenues) {
      const venue = new Venue(venueData);
      await venue.save();
      createdVenues.push(venue);
      console.log('Added venue:', venue.name);
    }

    console.log('All sample venues added successfully!');
    console.log('Venue IDs:', createdVenues.map(v => v._id));
    process.exit(0);
  } catch (error) {
    console.error('Error adding venues:', error);
    process.exit(1);
  }
}

addSampleVenues();
