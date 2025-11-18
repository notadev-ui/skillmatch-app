# SkillMatch Sports Community - Full Stack Application

A comprehensive platform connecting athletes, coaches, venues, and sports organizations to facilitate skill-based player matching, event management, venue discovery, and recruitment.

## 🎯 Main Features

### 1. **Skill-Based Player Search**
- Create detailed profiles with sports skills and certifications
- Match with local players of similar skill levels
- Find games at nearby stadiums or courts
- Skill verification and badges system

### 2. **Event & Venue Locator**
- Search stadiums, courts, and training facilities by location
- Real-time availability and booking
- Join scheduled games, training sessions, or tournaments
- Geospatial queries for nearby venues

### 3. **Smart Recruitment**
- Post job openings for coaches, umpires, helpers, and staff
- Skill-based applicant matching
- Direct notifications and alerts for matching candidates
- Application tracking system

### 4. **Verification System**
- Skill badges and rating system
- Post-game feedback and reviews
- Trust and reputation building
- Verified badges display

### 5. **Community & Chat**
- Real-time chat rooms and group discussions
- Team formation and management
- Game planning and coordination
- Community boards

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Validation**: Express Validator
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Maps**: Leaflet & React Leaflet
- **Notifications**: React Toastify

### Additional Tools
- Multer (File uploads)
- Cloudinary (Image storage)
- Geolocation Utils (Location services)
- Date-fns (Date formatting)

## 📁 Project Structure

```
skillmatch-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Venue.js
│   │   ├── Game.js
│   │   ├── Job.js
│   │   ├── Chat.js
│   │   ├── Review.js
│   │   └── Team.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── venueController.js
│   │   ├── gameController.js
│   │   ├── jobController.js
│   │   ├── chatController.js
│   │   └── reviewController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── venueRoutes.js
│   │   ├── gameRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── chatRoutes.js
│   │   └── reviewRoutes.js
│   ├── middleware/
│   │   └── authenticate.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── GamesList.jsx
    │   │   └── ...
    │   ├── services/
    │   │   └── api.js
    │   ├── store/
    │   │   └── store.js
    │   ├── styles/
    │   │   └── index.css
    │   ├── App.jsx
    │   └── index.js
    ├── public/
    │   └── index.html
    ├── tailwind.config.js
    ├── tsconfig.json
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file** (copy from `.env.example`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillmatch
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. **Start the server**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile (Protected)
- `GET /api/users/search` - Search users by skills/location
- `GET /api/users/nearby` - Get nearby users (Geospatial)
- `POST /api/users/skill` - Add skill to profile (Protected)

### Venues
- `GET /api/venues` - Get all venues
- `POST /api/venues` - Create venue (Protected)
- `GET /api/venues/:venueId` - Get venue details
- `PUT /api/venues/:venueId` - Update venue (Protected)
- `GET /api/venues/nearby` - Get nearby venues

### Games/Events
- `GET /api/games` - Get all games
- `POST /api/games` - Create game (Protected)
- `GET /api/games/:gameId` - Get game details
- `POST /api/games/:gameId/register` - Register for game (Protected)
- `DELETE /api/games/:gameId/cancel-registration` - Cancel registration (Protected)

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Post job (Protected)
- `GET /api/jobs/:jobId` - Get job details
- `POST /api/jobs/:jobId/apply` - Apply for job (Protected)
- `PUT /api/jobs/:jobId/application-status` - Update application status (Protected)

### Chat
- `POST /api/chat/room` - Get or create chat room (Protected)
- `GET /api/chat/room/:roomId` - Get chat messages (Protected)
- `POST /api/chat/message` - Save message (Protected)
- `GET /api/chat/user/rooms` - Get user's chat rooms (Protected)
- `POST /api/chat/group` - Create group chat (Protected)

### Reviews
- `POST /api/reviews` - Create review (Protected)
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews` - Get all reviews
- `PUT /api/reviews/:reviewId` - Update review (Protected)
- `DELETE /api/reviews/:reviewId` - Delete review (Protected)

## 🔐 Authentication

The application uses JWT-based authentication. After login/registration:

1. Token is stored in localStorage
2. Included automatically in all protected requests via Axios interceptor
3. Format: `Authorization: Bearer <token>`

## 📊 Database Models

### User Schema
- Personal information (name, email, phone)
- Skills and certifications
- Ratings and badges
- Location with geospatial indexing
- Teams and preferences

### Venue Schema
- Location details with coordinates
- Facilities and amenities
- Operating hours
- Manager information
- Reviews and ratings

### Game Schema
- Sport type and skill level
- Venue reference
- Date, time, and capacity
- Registered players
- Status tracking

### Job Schema
- Job type and requirements
- Salary and duration
- Applicants and status
- Required skills

### Chat Schema
- Room management (private/group)
- Message history
- Participants list

### Review Schema
- Ratings and comments
- Category-based feedback
- Verified badge support

## 🗺️ Geospatial Features

- Find users near a location
- Search venues within radius
- Distance calculations
- MongoDB 2dsphere indexing

## 💬 Real-time Features

Socket.io integration for:
- Live chat messaging
- Room management
- User presence
- Real-time notifications

## 🎨 UI Components

- Responsive navigation bar
- Authentication pages
- Game listing with filters
- User search interface
- Venue discovery map
- Chat interface
- Review system

## 📦 Dependencies Overview

**Backend Key Dependencies:**
- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: Authentication
- bcryptjs: Password encryption
- socket.io: Real-time communication
- cors: Cross-origin requests

**Frontend Key Dependencies:**
- react: UI library
- react-router-dom: Navigation
- axios: HTTP client
- zustand: State management
- tailwindcss: CSS framework
- socket.io-client: Real-time client

## 🔧 Configuration

All configuration is managed through `.env` files:

**Backend (.env)**
- Database connection
- JWT secrets
- Port configuration
- Environment variables

**Frontend (.env)**
- API base URL
- Map API keys (if needed)
- Third-party service endpoints

## 🚦 Running in Production

1. Build frontend: `npm run build`
2. Set NODE_ENV to 'production'
3. Use process manager (PM2) for backend
4. Deploy to hosting platform (Heroku, AWS, etc.)

## 📝 Future Enhancements

- Payment integration
- Video call features
- AI-based player matching
- Mobile app
- Advanced analytics
- Push notifications
- Email notifications
- Social sharing features
- Team statistics
- Tournament management

## 🤝 Contributing

Contributions are welcome! Please follow the project structure and coding standards.

## 📄 License

MIT License

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**SkillMatch** - Connecting Sports Communities, One Match at a Time! ⚽🏀🎾
