# SkillMatch Setup Guide

## Quick Start Instructions

### Step 1: Backend Setup

#### 1.1 Install Backend Dependencies
```bash
cd skillmatch-app/backend
npm install
```

#### 1.2 Configure Environment Variables
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/skillmatch

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary (optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Client URL
CLIENT_URL=http://localhost:3000
```

#### 1.3 Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Backend runs on: `http://localhost:5000`

---

### Step 2: Frontend Setup

#### 2.1 Install Frontend Dependencies
```bash
cd skillmatch-app/frontend
npm install
```

#### 2.2 Configure Environment Variables
Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 2.3 Start Frontend Server
```bash
npm start
```

Frontend runs on: `http://localhost:3000`

---

## Database Setup

### Using MongoDB Locally

1. **Install MongoDB Community Edition**
   - Windows: Download from https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow official MongoDB installation guide

2. **Start MongoDB Service**
   - Windows: MongoDB Compass or command line
   - Mac/Linux: `brew services start mongodb-community`

3. **Verify Connection**
   - Default: `mongodb://localhost:27017`
   - Test with MongoDB Compass

### Using MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillmatch
   ```

---

## API Testing

### Using Postman or Insomnia

#### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "userType": "Player",
  "city": "New York"
}
```

#### 2. Login User
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. Get Current User (Protected)
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token_from_login>
```

#### 4. Search Users
```
GET http://localhost:5000/api/users/search?skill=cricket&city=New%20York
```

#### 5. Get Nearby Venues
```
GET http://localhost:5000/api/venues/nearby?longitude=-74.0060&latitude=40.7128&maxDistance=50000
```

---

## Frontend Features

### Navigation Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/games` - Games/Events listing
- `/players` - Player search
- `/venues` - Venue search
- `/jobs` - Job listings
- `/chat` - Chat interface
- `/profile` - User profile (protected)

### Key Components

1. **Navbar** - Navigation and authentication
2. **Home** - Landing page with features
3. **Auth Pages** - Login/Register
4. **GamesList** - Browse and filter games
5. **User Search** - Find players by skills
6. **Venue Search** - Find nearby venues
7. **Job Board** - Browse job opportunities

---

## Backend Features Implementation

### User Management
- [x] Registration and login
- [x] Profile management
- [x] Skill tracking
- [x] User search by skills/location
- [x] Geospatial queries

### Venue Management
- [x] Create venues
- [x] Update venue details
- [x] Search venues by location
- [x] Nearby venue discovery
- [x] Operating hours management

### Game Management
- [x] Create games/events
- [x] Register players
- [x] Game status tracking
- [x] Game filtering by sport/skill level
- [x] Player capacity management

### Job Management
- [x] Post jobs
- [x] Apply for jobs
- [x] Application tracking
- [x] Skill-based filtering
- [x] Job status management

### Chat System
- [x] One-to-one chat
- [x] Group chat
- [x] Message history
- [x] Real-time messaging (Socket.io)
- [x] Room management

### Review System
- [x] User reviews and ratings
- [x] Category-based feedback
- [x] Rating aggregation
- [x] Review verification

---

## Socket.io Events

The app uses Socket.io for real-time features:

### Server Events
```javascript
// Join room
socket.on('join_room', (roomId) => { })

// Send message
socket.on('send_message', (data) => { })

// Leave room
socket.on('leave_room', (roomId) => { })

// Disconnect
socket.on('disconnect', () => { })
```

### Client Listening
```javascript
// Receive message
socket.on('receive_message', (data) => { })
```

---

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env`
- Use MongoDB Compass to test connection

### CORS Issues
- Ensure backend has correct CLIENT_URL
- Check browser console for specific errors
- Verify Axios headers

### JWT Token Issues
- Clear localStorage and log in again
- Check token expiration (7 days default)
- Verify JWT_SECRET matches between frontend/backend

### Socket.io Connection
- Check backend and frontend use same port/URL
- Verify Socket.io middleware is registered
- Check CORS settings for Socket.io

---

## Development Workflow

### Typical Development Session

1. **Start MongoDB**
   ```bash
   mongod
   # or
   brew services start mongodb-community
   ```

2. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - API Docs: Test with Postman

---

## Production Deployment

### Backend (Node.js)

1. **Use Process Manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

2. **Environment Setup**
   - Set `NODE_ENV=production`
   - Use strong JWT_SECRET
   - Setup HTTPS/SSL
   - Configure CORS properly

3. **Hosting Options**
   - Heroku
   - AWS (EC2, Elastic Beanstalk)
   - DigitalOcean
   - Google Cloud Platform

### Frontend (React)

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Vercel
   - Netlify
   - Firebase Hosting
   - AWS S3 + CloudFront

---

## Additional Commands

### Backend
```bash
# Start dev server
npm run dev

# Start production server
npm start

# Run tests (when configured)
npm test
```

### Frontend
```bash
# Start dev server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject configuration (not recommended)
npm eject
```

---

## Key Files to Customize

### Authentication
- `backend/controllers/authController.js` - Auth logic
- `frontend/pages/Login.jsx` - Login UI
- `frontend/pages/Register.jsx` - Registration UI

### Models
- `backend/models/User.js` - User schema
- `backend/models/Venue.js` - Venue schema
- `backend/models/Game.js` - Game schema

### API Integration
- `frontend/services/api.js` - API client
- `frontend/store/store.js` - State management

### Styling
- `frontend/src/index.css` - Global styles
- `frontend/tailwind.config.js` - Tailwind config

---

## Next Steps

1. ✅ Setup and run both servers
2. ✅ Test API endpoints with Postman
3. ✅ Register a user account
4. ✅ Create venues and games
5. ✅ Test player search functionality
6. ✅ Join games as a player
7. ✅ Create job postings
8. ✅ Test chat functionality
9. ✅ Leave reviews and ratings
10. ✅ Deploy to production

---

## Support & Resources

- MongoDB Documentation: https://docs.mongodb.com/
- Express.js Guide: https://expressjs.com/
- React Documentation: https://react.dev/
- Socket.io Guide: https://socket.io/docs/
- Tailwind CSS: https://tailwindcss.com/docs

---

**Happy coding with SkillMatch! 🚀⚽**
