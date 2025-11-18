# SkillMatch Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### 1. Clone or Access Project
```bash
cd skillmatch-app
```

### 2. Start MongoDB
```bash
mongod
# or
brew services start mongodb-community  # macOS
```

### 3. Terminal 1 - Start Backend
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5000
```

### 4. Terminal 2 - Start Frontend
```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

### 5. Test the App
- Visit http://localhost:3000
- Register a new account
- Explore features

---

## 📱 Main Features Access

| Feature | URL | Description |
|---------|-----|-------------|
| Home | `/` | Landing page |
| Register | `/register` | Create account |
| Login | `/login` | Sign in |
| Find Games | `/games` | Browse games/events |
| Find Players | `/players` | Search by skills |
| Find Venues | `/venues` | Browse venues |
| Jobs | `/jobs` | Job opportunities |
| Chat | `/chat` | Messages |
| Profile | `/profile` | User profile |

---

## 🔑 Default Test Credentials

Create accounts via registration page. No default accounts provided.

**Test User Flow:**
1. Register → Receive JWT token
2. Login → Redirected to home
3. Create game/venue → Stored in DB
4. Search and filter → Results from DB
5. Join game → Added to registered players

---

## 📡 Key API Endpoints

### Authentication
```bash
POST   /api/auth/register          # Create account
POST   /api/auth/login             # Get JWT token
GET    /api/auth/me                # Get current user (Protected)
```

### Users
```bash
GET    /api/users/:userId          # Get profile
PUT    /api/users/profile          # Update profile (Protected)
GET    /api/users/search           # Find by skills
GET    /api/users/nearby           # Find nearby users
POST   /api/users/skill            # Add skill (Protected)
```

### Games
```bash
GET    /api/games                  # List all games
POST   /api/games                  # Create game (Protected)
GET    /api/games/:gameId          # Get game details
POST   /api/games/:gameId/register # Join game (Protected)
```

### Venues
```bash
GET    /api/venues                 # List all venues
POST   /api/venues                 # Create venue (Protected)
GET    /api/venues/:venueId        # Get venue details
GET    /api/venues/nearby          # Find nearby venues
```

### Jobs
```bash
GET    /api/jobs                   # List all jobs
POST   /api/jobs                   # Post job (Protected)
GET    /api/jobs/:jobId            # Get job details
POST   /api/jobs/:jobId/apply      # Apply for job (Protected)
```

### Chat
```bash
POST   /api/chat/room              # Create/get chat room (Protected)
GET    /api/chat/room/:roomId      # Get messages (Protected)
POST   /api/chat/message           # Send message (Protected)
GET    /api/chat/user/rooms        # List chat rooms (Protected)
```

### Reviews
```bash
POST   /api/reviews                # Create review (Protected)
GET    /api/reviews/user/:userId   # Get user reviews
GET    /api/reviews                # List all reviews
PUT    /api/reviews/:reviewId      # Update review (Protected)
```

---

## 🗂️ File Structure Quick Map

```
skillmatch-app/
├── backend/
│   ├── models/                 ← Database schemas
│   ├── controllers/            ← Business logic
│   ├── routes/                 ← API endpoints
│   ├── middleware/             ← JWT verification
│   └── server.js              ← Main server
│
├── frontend/
│   ├── src/
│   │   ├── pages/             ← React pages (Home, Games, etc.)
│   │   ├── components/        ← Reusable UI components
│   │   ├── services/api.js    ← API client
│   │   ├── store/store.js     ← State management
│   │   └── App.jsx            ← Main app component
│   └── public/index.html      ← HTML template
│
└── Documentation files (README, SETUP, API_DOCUMENTATION, etc.)
```

---

## 🔧 Common Tasks

### Create a New Game
```bash
POST /api/games (Protected)
{
  "title": "Cricket Match",
  "sportType": "Cricket",
  "skillLevel": "Advanced",
  "venueId": "507f1f77bcf86cd799439012",
  "date": "2024-02-15",
  "startTime": "18:00",
  "endTime": "20:00",
  "maxPlayers": 22
}
```

### Search Games
```bash
GET /api/games?sportType=Cricket&skillLevel=Advanced&status=Upcoming
```

### Join a Game
```bash
POST /api/games/:gameId/register (Protected)
```

### Create a Venue
```bash
POST /api/venues (Protected)
{
  "name": "Central Park Courts",
  "type": "Court",
  "location": {
    "address": "123 Park Ave",
    "city": "New York",
    "coordinates": [-74.0060, 40.7128]
  },
  "pricePerHour": 50
}
```

### Post a Job
```bash
POST /api/jobs (Protected)
{
  "title": "Cricket Coach",
  "jobType": "Coach",
  "requiredSkills": [{"skillName": "Cricket"}],
  "location": "New York",
  "salary": {"min": 50, "max": 100}
}
```

### Send a Message
```bash
POST /api/chat/message (Protected)
{
  "roomId": "room_id_here",
  "message": "Hello!"
}
```

### Leave a Review
```bash
POST /api/reviews (Protected)
{
  "revieweeId": "507f1f77bcf86cd799439013",
  "rating": 5,
  "comment": "Great player!"
}
```

---

## 🐛 Debugging Tips

### Backend Issues
```bash
# Check if MongoDB is running
mongosh

# View backend logs
tail -f server.js  # (if using PM2: pm2 logs)

# Test API directly
curl http://localhost:5000/api/games

# Check environment variables
cat backend/.env
```

### Frontend Issues
```bash
# Check browser console (F12)
# Look for error messages

# Check network tab for API calls
# Verify API_URL in environment variables

# Clear localStorage if auth issues
localStorage.clear()
```

### Database Issues
```bash
# Connect to MongoDB
mongosh
use skillmatch
db.users.find()
db.games.find()
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000                                          # Server port
MONGODB_URI=mongodb://localhost:27017/skillmatch  # DB connection
JWT_SECRET=your_secret_key                        # Auth secret
JWT_EXPIRE=7d                                      # Token expiry
NODE_ENV=development                              # Environment
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api      # Backend URL
```

---

## 📊 Database Collections

### Collections in skillmatch database
```bash
# View all collections
show collections

# Count documents
db.users.countDocuments()
db.games.countDocuments()
db.venues.countDocuments()
db.jobs.countDocuments()
db.chats.countDocuments()
db.reviews.countDocuments()
db.teams.countDocuments()
```

---

## 🧪 Testing Workflow

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@test.com",
    "password": "password123",
    "phone": "1234567890",
    "userType": "Player",
    "city": "New York"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'
```

### 3. Use Token in Requests
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Common Commands

### Backend
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm start               # Start production server
npm test                # Run tests (if configured)
```

### Frontend
```bash
npm install             # Install dependencies
npm start               # Start dev server
npm run build           # Build for production
npm test                # Run tests
npm run eject           # Eject config (not recommended)
```

### Database
```bash
mongod                  # Start MongoDB
mongosh                 # Connect to MongoDB
show dbs               # List databases
use skillmatch         # Switch database
db.dropDatabase()      # Delete database
```

---

## 📝 Code Snippets

### Create Game from Frontend
```javascript
import { gameService } from '../services/api';

const createGame = async () => {
  const gameData = {
    title: "Cricket Match",
    sportType: "Cricket",
    venueId: venueId,
    date: new Date(),
    maxPlayers: 22
  };
  
  try {
    const response = await gameService.createGame(gameData);
    console.log(response.data.game);
  } catch (error) {
    console.error(error);
  }
};
```

### Search Players
```javascript
import { userService } from '../services/api';

const searchPlayers = async () => {
  try {
    const response = await userService.searchUsers({
      skill: 'cricket',
      city: 'New York'
    });
    setPlayers(response.data.users);
  } catch (error) {
    console.error(error);
  }
};
```

### Get User Location
```javascript
const getUserLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    getNearbyVenues(longitude, latitude);
  });
};
```

---

## 🎯 Next Steps

1. **Setup**: Follow SETUP.md
2. **Explore**: Check all features in frontend
3. **Test API**: Use Postman or curl
4. **Modify**: Customize for your needs
5. **Deploy**: Follow DEPLOYMENT.md
6. **Scale**: Add more features as needed

---

## 📞 Help & Support

- **Documentation**: See README.md
- **Setup Issues**: Check SETUP.md
- **API Help**: See API_DOCUMENTATION.md
- **Deployment**: Check DEPLOYMENT.md
- **Architecture**: See PROJECT_OVERVIEW.md

---

## ✅ Checklist for First Run

- [ ] MongoDB installed and running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Environment variables configured
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can view games/venues/jobs

---

## 📈 Performance Tips

### Backend
```bash
# Monitor performance
pm2 monit

# Check resource usage
top

# View logs
pm2 logs skillmatch-api
```

### Frontend
```bash
# Check performance
npm run build
# Check build size: less than 200KB recommended

# Use React DevTools browser extension
# Monitor component renders in DevTools
```

### Database
```javascript
// Add indexes for common queries
db.users.createIndex({ email: 1 })
db.games.createIndex({ date: 1 })
db.venues.createIndex({ 'location.coordinates': '2dsphere' })
```

---

**Happy Coding! 🎉**

For more details, refer to the comprehensive documentation files included in the project.
