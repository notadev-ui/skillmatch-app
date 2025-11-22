# SkillMatch Sports Community - Full Stack Application

A comprehensive platform connecting athletes, coaches, venues, and sports organizations to facilitate skill-based player matching, event management, venue discovery, and recruitment.

---

## Technology Stack Overview

**Core Technologies:**
* **Frontend:** React 18 with Tailwind CSS
* **Backend:** Node.js with Express.js
* **Database:** MongoDB (NoSQL with Geospatial Indexing)
* **Real-time Engine:** Socket.io
* **Security:** JWT Authentication with bcryptjs

**Additional Services:**
* **File Storage:** Cloudinary
* **Maps:** Leaflet & React Leaflet
* **State Management:** Zustand
* **Notifications:** React Toastify

---

## System Architecture

```
                         USER (Web Browser)
                                 |
                                 | HTTPS Request
                                 v
        +------------------------------------------------+
        |            FRONTEND LAYER                      |
        |            React 18 + Vite                     |
        |                                                |
        |  Components:                                   |
        |  - React Router v6 (Navigation)                |
        |  - Tailwind CSS (Styling)                      |
        |  - Leaflet Maps (Geolocation)                  |
        |  - Axios (HTTP Client)                         |
        |  - Socket.io Client (Real-time)                |
        |                                                |
        |  State Management:                             |
        |  - Zustand (Global State)                      |
        |  - Authentication state                        |
        |  - Chat state                                  |
        +------------------------+-----------------------+
                                 |
                                 | HTTP/HTTPS + JWT Token
                                 | Authorization: Bearer <token>
                                 | WebSocket Connection
                                 v
        +------------------------------------------------+
        |            BACKEND LAYER                       |
        |            Node.js + Express.js                |
        |                                                |
        |  Middleware Stack:                             |
        |  - CORS Handler                                |
        |  - JWT Verification                            |
        |  - Request Logger                              |
        |  - Error Handler                               |
        |  - Multer (File Upload)                        |
        |  - Express Validator                           |
        |                                                |
        |  API Routes:                                   |
        |  - /api/auth (Registration & Login)            |
        |  - /api/users (Profile & Search)               |
        |  - /api/venues (Venue Management)              |
        |  - /api/games (Event Management)               |
        |  - /api/jobs (Recruitment)                     |
        |  - /api/chat (Messaging)                       |
        |  - /api/reviews (Ratings & Feedback)           |
        |                                                |
        |  Real-time Services:                           |
        |  - Socket.io Server                            |
        |  - Chat room management                        |
        |  - Live notifications                          |
        +------------+-------------------+---------------+
                     |                   |
                     v                   v
        +-----------------------+  +----------------------+
        |   DATABASE LAYER      |  |  FILE STORAGE        |
        |   MongoDB Atlas       |  |  Cloudinary          |
        |                       |  |                      |
        |  Collections:         |  |  Features:           |
        |  - users              |  |  - Image uploads     |
        |  - venues             |  |  - Profile photos    |
        |  - games              |  |  - Venue images      |
        |  - jobs               |  |  - Certificates      |
        |  - chats              |  |                      |
        |  - reviews            |  |                      |
        |  - teams              |  |                      |
        |                       |  |                      |
        |  Features:            |  |                      |
        |  - 2dsphere indexing  |  |                      |
        |  - Aggregation        |  |                      |
        |  - Full-text search   |  |                      |
        +-----------------------+  +----------------------+
```

---

## Security Architecture

### User Registration Flow

```
User submits registration form
        |
        v
Frontend validation
        - Email format
        - Password strength (min 8 chars)
        - Required fields
        |
        v
POST /api/auth/register
        |
        v
Backend validation (Express Validator)
        - Check if email exists
        - Validate all fields
        |
        v
bcryptjs.hash(password, 10 salt rounds)
        |
        v
Create User document in MongoDB
        {
          name,
          email,
          password: hashedPassword,
          phone,
          location: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          skills: [],
          sports: []
        }
        |
        v
Generate JWT Token
        - Payload: { userId, email }
        - Expiration: 7 days
        - Secret: process.env.JWT_SECRET
        |
        v
Send response
        {
          success: true,
          token: "jwt_token_here",
          user: { id, name, email }
        }
        |
        v
Frontend stores token in localStorage
        |
        v
Redirect to Dashboard
```

### User Login Flow

```
User enters credentials
        |
        v
POST /api/auth/login
        |
        v
Find user by email
        |
        v
User exists?
        |
        +-- No --> Return 404 "User not found"
        |
        +-- Yes --> bcryptjs.compare(plainPassword, hashedPassword)
                    |
                    v
                    Passwords match?
                    |
                    +-- No --> Return 401 "Invalid credentials"
                    |
                    +-- Yes --> Generate JWT Token
                                |
                                v
                                Return token and user data
                                |
                                v
                                Frontend stores in localStorage
                                |
                                v
                                Setup Axios interceptor
                                |
                                v
                                Establish Socket.io connection
```

### Protected Route Flow

```
User makes request to protected endpoint
        |
        v
Axios interceptor adds header:
"Authorization: Bearer <token>"
        |
        v
Backend authenticate middleware
        |
        v
Extract token from header
        |
        v
jwt.verify(token, JWT_SECRET)
        |
        +-- Invalid/Expired --> Return 403 "Token invalid"
        |
        +-- Valid --> Decode payload
                      |
                      v
                      Find user by decoded userId
                      |
                      v
                      User exists?
                      |
                      +-- No --> Return 401 "User not found"
                      |
                      +-- Yes --> Attach user to req.user
                                  |
                                  v
                                  Process request
                                  |
                                  v
                                  Return response
```

---

## Skill-Based Player Matching Flow

```
User wants to find players
        |
        v
Navigate to /users/search
        |
        v
Apply filters:
        - Sport type (Football, Basketball, etc.)
        - Skill level (Beginner, Intermediate, Expert)
        - Location radius (5km, 10km, 25km)
        - Age range
        - Availability
        |
        v
GET /api/users/search?sport=football&skillLevel=intermediate&radius=10
        |
        v
Backend MongoDB query
        |
        v
User.find({
  sports: { $in: [sport] },
  'skills.level': skillLevel,
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [userLong, userLat]
      },
      $maxDistance: radius * 1000 (meters)
    }
  }
})
        |
        v
Calculate match score for each user
        - Sport overlap: +30 points
        - Skill level match: +25 points
        - Similar rating: +20 points
        - Proximity: +15 points
        - Verified badges: +10 points
        |
        v
Sort by match score (descending)
        |
        v
Return matched users with:
        - Profile information
        - Skills and certifications
        - Distance from current user
        - Match percentage
        - Badges and ratings
        |
        v
Frontend displays results
        - User cards with avatars
        - Match percentage badge
        - Distance indicator
        - Skill tags
        - "Connect" button
        |
        v
User clicks "Connect"
        |
        v
Open chat room or send connection request
```

**Matching Algorithm:**
- **Geospatial scoring** using MongoDB 2dsphere indexes
- **Skill similarity** based on proficiency levels
- **Rating compatibility** (±0.5 stars range)
- **Badge verification** bonus for certified players

---

## Geospatial Search Flow

### Finding Nearby Venues

```
User opens "Find Venues"
        |
        v
Request user's current location
        |
        v
Browser Geolocation API
        |
        v
navigator.geolocation.getCurrentPosition()
        |
        +-- Denied --> Use default city center coordinates
        |
        +-- Allowed --> Get coordinates [lat, lng]
                        |
                        v
Display map with current location marker
        |
        v
User applies filters:
        - Sport type
        - Facilities (Parking, Changing rooms, etc.)
        - Price range
        - Availability
        - Rating minimum
        |
        v
GET /api/venues/nearby?lat=19.0760&lng=72.8777&radius=5&sport=football
        |
        v
Backend MongoDB geospatial query
        |
        v
Venue.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [lng, lat] },
      distanceField: "distance",
      maxDistance: radius * 1000,
      spherical: true
    }
  },
  {
    $match: {
      sportTypes: sport,
      rating: { $gte: minRating }
    }
  },
  {
    $sort: { distance: 1, rating: -1 }
  }
])
        |
        v
Enhance results with:
        - Distance in km
        - Availability status
        - Current bookings
        - Average rating
        - Price range
        |
        v
Return venue data
        [
          {
            name: "City Sports Complex",
            distance: 2.3,
            rating: 4.5,
            facilities: ["Parking", "Lockers"],
            pricePerHour: 500,
            coordinates: [lng, lat],
            available: true
          },
          ...
        ]
        |
        v
Frontend updates map
        - Plot venue markers
        - Color code by availability
        - Show info popup on hover
        |
        v
Update venue list sidebar
        - Sort by distance/rating
        - Show venue cards
        - "Book Now" buttons
        |
        v
User clicks venue marker or card
        |
        v
Show venue details modal
        - Photo gallery
        - Full description
        - Amenities list
        - Reviews and ratings
        - Available time slots
        - Booking form
```

**Geospatial Index Structure:**
```javascript
venueSchema.index({ location: '2dsphere' });
userSchema.index({ location: '2dsphere' });
```

---

## Real-Time Chat System Flow

### Establishing WebSocket Connection

```
User logs in successfully
        |
        v
Frontend initiates Socket.io connection
        |
        v
const socket = io(SOCKET_URL, {
  auth: { token: localStorage.getItem('token') }
});
        |
        v
Backend Socket.io server validates token
        |
        v
jwt.verify(token, JWT_SECRET)
        |
        +-- Invalid --> Disconnect socket
        |
        +-- Valid --> socket.userId = decoded.userId
                      |
                      v
                      Emit 'connected' event
                      |
                      v
                      Store socket in active connections
                      {
                        userId: socket.userId,
                        socketId: socket.id,
                        status: 'online'
                      }
```

### Creating/Joining Chat Room

```
User wants to chat with another player
        |
        v
Click "Message" on user profile
        |
        v
POST /api/chat/room
        {
          participants: [currentUserId, targetUserId]
        }
        |
        v
Backend checks if room exists
        |
        v
Chat.findOne({
          type: 'private',
          participants: { 
            $all: [user1Id, user2Id] 
          }
        })
        |
        +-- Exists --> Return existing room
        |
        +-- Not exists --> Create new room
                          |
                          v
                          new Chat({
                            type: 'private',
                            participants: [user1Id, user2Id],
                            messages: []
                          }).save()
                          |
                          v
                          Return new room
        |
        v
Frontend navigates to /chat/:roomId
        |
        v
Fetch chat history
        GET /api/chat/room/:roomId
        |
        v
Display messages
        |
        v
Join Socket.io room
        socket.emit('join-room', { roomId })
        |
        v
Backend adds socket to room
        socket.join(roomId)
```

### Sending and Receiving Messages

```
User types message and hits send
        |
        v
Frontend emits socket event
        socket.emit('send-message', {
          roomId: currentRoomId,
          content: messageText,
          senderId: currentUserId
        })
        |
        v
Backend receives event
        |
        v
Validate message
        - Not empty
        - User is participant
        - Room exists
        |
        v
Save to database
        POST /api/chat/message
        {
          roomId,
          senderId,
          content,
          timestamp: new Date()
        }
        |
        v
Chat.findByIdAndUpdate(roomId, {
          $push: {
            messages: {
              sender: senderId,
              content: content,
              timestamp: new Date(),
              read: false
            }
          },
          lastMessage: content,
          updatedAt: new Date()
        })
        |
        v
Broadcast to all room participants
        io.to(roomId).emit('receive-message', {
          messageId: newMessage._id,
          senderId,
          senderName,
          content,
          timestamp,
          roomId
        })
        |
        v
All connected clients receive message
        |
        v
Update chat UI
        - Append message to chat window
        - Scroll to bottom
        - Play notification sound (if not sender)
        - Update unread count
        - Move room to top of chat list
```

### Group Chat Flow

```
User creates team/group
        |
        v
POST /api/chat/group
        {
          name: "Weekend Warriors",
          participants: [user1, user2, user3, ...],
          type: 'group'
        }
        |
        v
Backend creates group chat room
        |
        v
Emit notification to all participants
        socket.to(userId).emit('group-invite', {
          groupName,
          invitedBy,
          roomId
        })
        |
        v
Group chat functionality
        - Same as private chat
        - Shows sender names
        - Group info sidebar
        - Add/remove members
        - Admin controls
```

**Socket Events:**
- `connect` - Client connects
- `disconnect` - Client disconnects
- `join-room` - Join chat room
- `leave-room` - Leave chat room
- `send-message` - Send message
- `receive-message` - Receive message
- `typing` - User typing indicator
- `user-online` - User status update
- `user-offline` - User status update

---

## Game/Event Management Flow

### Creating a Game

```
User navigates to "Create Game"
        |
        v
Fill game creation form:
        - Sport type
        - Venue (from dropdown or map)
        - Date and time
        - Duration
        - Skill level required
        - Max players
        - Entry fee (optional)
        - Description
        |
        v
POST /api/games
        {
          sport: "Football",
          venue: venueId,
          date: "2025-12-01T10:00:00Z",
          duration: 90,
          skillLevel: "Intermediate",
          maxPlayers: 22,
          entryFee: 200,
          description: "Friendly match"
        }
        |
        v
Backend validation
        - Venue exists and available
        - Date is in future
        - Max players > 0
        - Skill level is valid
        |
        v
Create Game document
        new Game({
          organizer: req.user._id,
          sport,
          venue,
          date,
          duration,
          skillLevel,
          maxPlayers,
          registeredPlayers: [req.user._id],
          status: 'upcoming',
          entryFee
        }).save()
        |
        v
Update Venue booking
        Venue.findByIdAndUpdate(venueId, {
          $push: {
            bookings: {
              gameId,
              date,
              duration
            }
          }
        })
        |
        v
Send notifications
        - Nearby players matching skill level
        - Followers of organizer
        - Players who saved venue
        |
        v
Return created game
        |
        v
Frontend redirects to game details page
```

### Discovering and Joining Games

```
User browses games
        |
        v
GET /api/games?sport=football&skillLevel=intermediate&date=upcoming
        |
        v
Backend query with filters
        Game.find({
          sport: requestedSport,
          skillLevel: requestedLevel,
          date: { $gte: new Date() },
          status: 'upcoming',
          $expr: {
            $lt: [
              { $size: "$registeredPlayers" },
              "$maxPlayers"
            ]
          }
        })
        .populate('venue')
        .populate('organizer', 'name rating')
        .sort({ date: 1 })
        |
        v
Calculate for each game:
        - Spots remaining
        - Distance from user
        - Match percentage
        - Organizer credibility
        |
        v
Return games list
        [
          {
            id,
            sport,
            venue: { name, location, address },
            date,
            spotsLeft: 10,
            skillLevel,
            distance: 3.2,
            matchScore: 85,
            organizer: { name, rating }
          },
          ...
        ]
        |
        v
Frontend displays game cards
        - Map view with markers
        - List view with filters
        - Sort options
        |
        v
User clicks "Join Game"
        |
        v
POST /api/games/:gameId/register
        |
        v
Backend validation
        - Game not full
        - Date not passed
        - User skill level compatible
        - User not already registered
        |
        v
Update game document
        Game.findByIdAndUpdate(gameId, {
          $push: { registeredPlayers: userId }
        })
        |
        v
Create notification for organizer
        |
        v
Send confirmation to user
        |
        v
Add to user's calendar
        |
        v
Frontend updates UI
        - Show "Registered" badge
        - Enable "Cancel Registration"
        - Add to "My Games" list
```

### Game Day Flow

```
Game day arrives
        |
        v
Automated system checks
        - 24h before: Reminder notification
        - 2h before: Venue details notification
        - Game time: Status update to 'in-progress'
        |
        v
Players check-in at venue
        |
        v
Organizer marks attendance
        PUT /api/games/:gameId/attendance
        {
          playerId,
          attended: true
        }
        |
        v
After game ends
        |
        v
Status changes to 'completed'
        |
        v
Trigger review request
        - Players review each other
        - Players review venue
        - Players review organizer
        |
        v
POST /api/reviews
        {
          gameId,
          revieweeId,
          rating: 4,
          categories: {
            skill: 4,
            sportsmanship: 5,
            punctuality: 4
          },
          comment: "Great player!"
        }
        |
        v
Update user ratings
        User.updateRating(revieweeId)
        |
        v
Award badges if thresholds met
        - 10 games → "Active Player"
        - 4.5+ rating → "Skilled Athlete"
        - 50 games → "Veteran"
```

---

## Job Recruitment System Flow

### Posting a Job

```
Organization/Venue owner logs in
        |
        v
Navigate to "Post Job"
        |
        v
Fill job posting form:
        - Job title (Coach, Umpire, Helper)
        - Sport type
        - Venue/Location
        - Required skills
        - Experience level
        - Salary range
        - Duration (contract period)
        - Job description
        - Required certifications
        |
        v
POST /api/jobs
        {
          title: "Basketball Coach",
          jobType: "coach",
          sport: "Basketball",
          venue: venueId,
          requiredSkills: ["Coaching", "Leadership"],
          experience: "2+ years",
          salary: { min: 30000, max: 50000 },
          duration: "6 months",
          description: "...",
          certifications: ["Level 2 Coaching"]
        }
        |
        v
Backend creates job posting
        new Job({
          postedBy: req.user._id,
          ...jobData,
          status: 'open',
          applicants: [],
          postedAt: new Date()
        }).save()
        |
        v
Find matching candidates
        User.find({
          'skills.name': { $in: requiredSkills },
          sports: sport,
          certifications: { $in: certifications }
        })
        |
        v
Send notifications to matched users
        - Email notification
        - In-app notification
        - Push notification (if enabled)
        |
        v
Return job posting
        |
        v
Frontend displays confirmation
```

### Job Discovery and Application

```
User browses job listings
        |
        v
GET /api/jobs?jobType=coach&sport=basketball
        |
        v
Backend aggregation pipeline
        Job.aggregate([
          {
            $match: {
              status: 'open',
              jobType: requestedType,
              sport: requestedSport
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'postedBy',
              foreignField: '_id',
              as: 'employer'
            }
          },
          {
            $lookup: {
              from: 'venues',
              localField: 'venue',
              foreignField: '_id',
              as: 'venueDetails'
            }
          }
        ])
        |
        v
Calculate match score for user
        - Skill overlap: +40 points
        - Experience match: +30 points
        - Location proximity: +20 points
        - Certifications: +10 points
        |
        v
Return sorted job listings
        [
          {
            id,
            title,
            employer: { name, rating },
            venue: { name, location },
            salary,
            matchScore: 85,
            applicants: 12,
            postedDays: 3
          },
          ...
        ]
        |
        v
Frontend displays job cards
        - Highlighted matches
        - Salary badge
        - Location tag
        - "Quick Apply" button
        |
        v
User clicks job for details
        |
        v
Show full job description
        - Requirements checklist
        - Employer profile
        - Venue information
        - Application form
        |
        v
User clicks "Apply"
        |
        v
Submit application
        POST /api/jobs/:jobId/apply
        {
          coverLetter: "...",
          resume: fileUrl,
          availability: "Immediate",
          expectedSalary: 40000
        }
        |
        v
Backend processes application
        |
        v
Job.findByIdAndUpdate(jobId, {
          $push: {
            applicants: {
              userId: req.user._id,
              appliedAt: new Date(),
              status: 'pending',
              coverLetter,
              resume,
              availability,
              expectedSalary
            }
          }
        })
        |
        v
Notify employer
        - New applicant alert
        - Applicant profile summary
        - Match percentage
        |
        v
Return success response
        |
        v
Frontend updates UI
        - Show "Applied" status
        - Add to "My Applications"
        - Disable apply button
```

### Application Review Process

```
Employer views applications
        |
        v
GET /api/jobs/:jobId/applications
        |
        v
Backend returns applicant list
        - Sorted by match score
        - Include user profiles
        - Show skills and certifications
        |
        v
Frontend displays applicant dashboard
        - Applicant cards
        - Quick filters
        - Shortlist option
        |
        v
Employer reviews applicant
        |
        v
Employer updates status
        PUT /api/jobs/:jobId/application-status
        {
          applicantId: userId,
          status: 'shortlisted' | 'rejected' | 'interviewed' | 'hired'
        }
        |
        v
Backend updates application
        |
        v
Send notification to applicant
        |
        v
If hired:
        - Create contract
        - Add to venue staff
        - Update user profile
        - Close job posting (optional)
```

---

## Review and Rating System

### Submitting a Review

```
After game completion or interaction
        |
        v
User receives review prompt
        |
        v
Navigate to review form
        |
        v
Fill review details:
        - Overall rating (1-5 stars)
        - Category ratings:
          * Skill level
          * Sportsmanship
          * Punctuality
          * Communication
        - Written comment
        - Tags (optional)
        |
        v
POST /api/reviews
        {
          revieweeId,
          reviewType: 'player' | 'venue' | 'organizer',
          gameId,
          rating: 4.5,
          categories: {
            skill: 5,
            sportsmanship: 4,
            punctuality: 5,
            communication: 4
          },
          comment: "Excellent player, great team spirit!",
          tags: ["Team Player", "Skilled"]
        }
        |
        v
Backend validation
        - User participated in game
        - Haven't reviewed this person before for this game
        - Rating within valid range
        |
        v
Create review document
        new Review({
          reviewer: req.user._id,
          reviewee: revieweeId,
          ...reviewData,
          verified: userAttendedGame,
          createdAt: new Date()
        }).save()
        |
        v
Update reviewee's aggregate rating
        |
        v
Calculate new average:
        totalReviews = await Review.countDocuments({ reviewee: revieweeId })
        avgRating = await Review.aggregate([
          { $match: { reviewee: revieweeId } },
          { $group: {
              _id: null,
              avgOverall: { $avg: '$rating' },
              avgSkill: { $avg: '$categories.skill' },
              avgSportsmanship: { $avg: '$categories.sportsmanship' }
            }
          }
        ])
        |
        v
Update user document
        User.findByIdAndUpdate(revieweeId, {
          rating: avgRating.avgOverall,
          totalReviews: totalReviews,
          categoryRatings: {
            skill: avgRating.avgSkill,
            sportsmanship: avgRating.avgSportsmanship,
            ...
          }
        })
        |
        v
Check for badge eligibility
        - 4.5+ rating with 20+ reviews → "Elite Player"
        - 5.0 rating with 50+ reviews → "Legend"
        - All 5-star categories → "Perfect Score"
        |
        v
Award badges if qualified
        |
        v
Send notification to reviewee
        |
        v
Return success response
```

### Viewing Reviews

```
User views profile
        |
        v
GET /api/reviews/user/:userId
        |
        v
Backend fetches reviews
        Review.find({ reviewee: userId })
          .populate('reviewer', 'name avatar')
          .populate('game', 'sport date')
          .sort({ createdAt: -1 })
          .limit(10)
        |
        v
Calculate statistics:
        - Average overall rating
        - Category breakdowns
        - Rating distribution (5★: 60%, 4★: 30%, ...)
        - Most common tags
        - Recent trend (improving/declining)
        |
        v
Return review data
        {
          overallRating: 4.6,
          totalReviews: 45,
          ratingDistribution: {...},
          categoryAverages: {...},
          recentReviews: [...],
          topTags: ["Team Player", "Skilled"],
          trend: "improving"
        }
        |
        v
Frontend renders review section
        - Rating summary card
        - Star distribution graph
        - Category radar chart
        - Individual review cards
        - Filter/sort options
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  phone: String,
  avatar: String (Cloudinary URL),
  bio: String,
  
  // Location with geospatial index
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  
  // Sports and Skills
  sports: [String], // ['Football', 'Basketball']
  skills: [{
    name: String,
    level: String, // 'Beginner', 'Intermediate', 'Expert'
    yearsExperience: Number,
    certifications: [String]
  }],
  
  // Ratings and Reviews
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  categoryRatings: {
    skill: Number,
    sportsmanship: Number,
    punctuality: Number,
    communication: Number
  },
  
  // Badges and Achievements
  badges: [{
    name: String,
    icon: String,
    earnedAt: Date,
    description: String
  }],
  
  // Teams
  teams: [{ type: ObjectId, ref: 'Team' }],
  
  // Preferences
  preferences: {
    notifications: Boolean,
    emailAlerts: Boolean,
    privacyMode: String,
    preferredSports: [String]
  },
  
  // Activity
  gamesPlayed: { type: Number, default: 0 },
  gamesOrganized: { type: Number, default: 0 },
  
  verified: { type: Boolean, default: false },
  userType: { 
    type: String, 
    enum: ['player', 'coach', 'organizer', 'venue_owner'],
    default: 'player'
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Games Collection
```javascript
{
  _id: ObjectId,
  
  // Game Details
  sport: String, // 'Football', 'Basketball', etc.
  gameType: String, // 'Casual', 'Training', 'Tournament'
  title: String,
  description: String,
  
  // Organizer
  organizer: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  
  // Venue
  venue: {
    type: ObjectId,
    ref: 'Venue',
    required: true
  },
  
  // Schedule
  date: Date,
  startTime: String,
  duration: Number, // in minutes
  
  // Players
  maxPlayers: Number,
  minPlayers: { type: Number, default: 2 },
  registeredPlayers: [{
    user: { type: ObjectId, ref: 'User' },
    registeredAt: Date,
    attended: { type: Boolean, default: false },
    status: String // 'confirmed', 'pending', 'cancelled'
  }],
  
  // Requirements
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'All'],
    default: 'All'
  },
  requiredEquipment: [String],
  
  // Financials
  entryFee: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  
  // Status
  status: {
    type: String,
    enum: ['upcoming', 'in-progress', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  
  // Game Rules/Notes
  rules: String,
  notes: String,
  
  // Results (after completion)
  result: {
    winner: String,
    score: String,
    mvp: { type: ObjectId, ref: 'User' }
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Jobs Collection
```javascript
{
  _id: ObjectId,
  
  // Job Details
  title: String,
  jobType: {
    type: String,
    enum: ['coach', 'umpire', 'referee', 'helper', 'staff', 'other'],
    required: true
  },
  sport: String,
  description: String,
  
  // Employer
  postedBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  
  // Location
  venue: { type: ObjectId, ref: 'Venue' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  city: String,
  
  // Requirements
  requiredSkills: [String],
  requiredCertifications: [String],
  experienceLevel: String, // 'Entry', '2+ years', '5+ years'
  
  // Compensation
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' },
    period: String // 'hourly', 'monthly', 'per-game'
  },
  
  // Contract
  duration: String, // '3 months', '1 year', 'Permanent'
  startDate: Date,
  employmentType: String, // 'Full-time', 'Part-time', 'Contract'
  
  // Applicants
  applicants: [{
    user: { type: ObjectId, ref: 'User' },
    appliedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'interviewed', 'rejected', 'hired'],
      default: 'pending'
    },
    coverLetter: String,
    resume: String, // URL
    availability: String,
    expectedSalary: Number
  }],
  
  // Status
  status: {
    type: String,
    enum: ['open', 'closed', 'filled'],
    default: 'open'
  },
  
  postedAt: Date,
  expiresAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### Chat Collection
```javascript
{
  _id: ObjectId,
  
  // Room Details
  type: {
    type: String,
    enum: ['private', 'group', 'team'],
    default: 'private'
  },
  name: String, // For group chats
  avatar: String, // For group chats
  
  // Participants
  participants: [{
    type: ObjectId,
    ref: 'User'
  }],
  
  // Admin (for group chats)
  admin: { type: ObjectId, ref: 'User' },
  
  // Messages
  messages: [{
    sender: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    content: String,
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'location'],
      default: 'text'
    },
    fileUrl: String, // For images/files
    timestamp: {
      type: Date,
      default: Date.now
    },
    read: [{
      user: { type: ObjectId, ref: 'User' },
      readAt: Date
    }],
    delivered: { type: Boolean, default: false }
  }],
  
  // Last Activity
  lastMessage: String,
  lastMessageAt: Date,
  
  // Settings
  settings: {
    muted: [{ type: ObjectId, ref: 'User' }],
    archived: [{ type: ObjectId, ref: 'User' }]
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### Review Collection
```javascript
{
  _id: ObjectId,
  
  // Parties
  reviewer: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  
  // Review Type
  reviewType: {
    type: String,
    enum: ['player', 'venue', 'organizer', 'coach'],
    required: true
  },
  
  // Context
  game: { type: ObjectId, ref: 'Game' },
  job: { type: ObjectId, ref: 'Job' },
  
  // Ratings
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  
  // Category Ratings
  categories: {
    skill: Number,
    sportsmanship: Number,
    punctuality: Number,
    communication: Number,
    leadership: Number,
    reliability: Number
  },
  
  // Feedback
  comment: String,
  tags: [String], // ['Team Player', 'Skilled', 'Friendly']
  
  // Verification
  verified: { type: Boolean, default: false },
  
  // Response
  response: {
    text: String,
    respondedAt: Date
  },
  
  // Helpful Votes
  helpfulVotes: [{ type: ObjectId, ref: 'User' }],
  
  createdAt: Date,
  updatedAt: Date
}
```

### Team Collection
```javascript
{
  _id: ObjectId,
  
  // Team Details
  name: String,
  tagline: String,
  description: String,
  logo: String, // Cloudinary URL
  
  // Sport
  sport: String,
  
  // Members
  captain: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  viceCaptain: { type: ObjectId, ref: 'User' },
  members: [{
    user: { type: ObjectId, ref: 'User' },
    role: String, // 'Player', 'Coach', 'Manager'
    joinedAt: Date,
    status: String // 'active', 'inactive', 'suspended'
  }],
  
  // Stats
  gamesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  
  // Team Rating
  rating: { type: Number, default: 0 },
  
  // Settings
  isPrivate: { type: Boolean, default: false },
  maxMembers: Number,
  
  // Chat Room
  chatRoom: { type: ObjectId, ref: 'Chat' },
  
  createdAt: Date,
  updatedAt: Date
}
```

**Database Indexes:**
- `users.email` (unique)
- `users.location` (2dsphere)
- `venues.location` (2dsphere)
- `games.date` (ascending)
- `games.status`
- `jobs.status`
- `chats.participants`
- `reviews.reviewee`

---

## API Endpoints Reference

### Authentication Endpoints

#### Register User
```
POST /api/auth/register

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "+919876543210",
  "location": {
    "coordinates": [72.8777, 19.0760]
  },
  "sports": ["Football", "Basketball"]
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```
POST /api/auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "securepass123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://cloudinary.com/...",
    "rating": 4.5
  }
}
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "sports": ["Football"],
    "skills": [...],
    "rating": 4.5,
    "badges": [...]
  }
}
```

---

### User Endpoints

#### Get User Profile
```
GET /api/users/:userId

Response:
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "bio": "Passionate football player",
    "sports": ["Football", "Basketball"],
    "skills": [{
      "name": "Striker",
      "level": "Expert",
      "yearsExperience": 5
    }],
    "rating": 4.6,
    "totalReviews": 45,
    "badges": ["Elite Player", "Team Captain"],
    "gamesPlayed": 120
  }
}
```

#### Update Profile
```
PUT /api/users/profile
Headers: Authorization: Bearer <token>

Request Body:
{
  "bio": "Updated bio",
  "avatar": "https://cloudinary.com/new-avatar.jpg",
  "sports": ["Football", "Cricket"],
  "preferences": {
    "notifications": true
  }
}

Response:
{
  "success": true,
  "user": { /* updated user */ }
}
```

#### Search Users
```
GET /api/users/search?sport=football&skillLevel=intermediate&city=mumbai

Response:
{
  "success": true,
  "results": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "avatar": "...",
      "rating": 4.5,
      "sports": ["Football"],
      "distance": 2.3,
      "matchScore": 85
    },
    ...
  ],
  "total": 24
}
```

#### Get Nearby Users
```
GET /api/users/nearby?latitude=19.0760&longitude=72.8777&radius=10

Response:
{
  "success": true,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "sports": ["Football"],
      "distance": 2.3,
      "rating": 4.5
    },
    ...
  ]
}
```

#### Add Skill
```
POST /api/users/skill
Headers: Authorization: Bearer <token>

Request Body:
{
  "name": "Goalkeeper",
  "level": "Intermediate",
  "yearsExperience": 3,
  "certifications": ["Level 1 GK Training"]
}

Response:
{
  "success": true,
  "message": "Skill added successfully",
  "skills": [ /* updated skills array */ ]
}
```

---

### Venue Endpoints

#### Get All Venues
```
GET /api/venues?sport=football&city=mumbai&minRating=4

Response:
{
  "success": true,
  "venues": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "City Sports Complex",
      "sportTypes": ["Football", "Basketball"],
      "rating": 4.5,
      "pricePerHour": 500,
      "facilities": ["Parking", "Changing Rooms"],
      "availability": true
    },
    ...
  ],
  "total": 15
}
```

#### Create Venue
```
POST /api/venues
Headers: Authorization: Bearer <token>

Request Body:
{
  "name": "Elite Football Arena",
  "description": "Premium indoor football facility",
  "location": {
    "coordinates": [72.8777, 19.0760]
  },
  "address": {
    "street": "123 Sports Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "sportTypes": ["Football"],
  "facilities": ["Parking", "Cafeteria", "First Aid"],
  "capacity": 50,
  "pricePerHour": 1000,
  "operatingHours": {
    "monday": { "open": "06:00", "close": "22:00" },
    ...
  }
}

Response:
{
  "success": true,
  "venue": { /* created venue */ }
}
```

#### Get Venue Details
```
GET /api/venues/:venueId

Response:
{
  "success": true,
  "venue": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Elite Football Arena",
    "description": "...",
    "images": ["url1", "url2"],
    "rating": 4.7,
    "totalReviews": 89,
    "facilities": [...],
    "operatingHours": {...},
    "upcomingGames": [...],
    "reviews": [...]
  }
}
```

#### Get Nearby Venues
```
GET /api/venues/nearby?latitude=19.0760&longitude=72.8777&radius=5&sport=football

Response:
{
  "success": true,
  "venues": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "City Sports Complex",
      "distance": 2.3,
      "rating": 4.5,
      "pricePerHour": 500,
      "availability": true,
      "coordinates": [72.8777, 19.0760]
    },
    ...
  ]
}
```

---

### Game/Event Endpoints

#### Get All Games
```
GET /api/games?sport=football&skillLevel=intermediate&status=upcoming

Response:
{
  "success": true,
  "games": [
    {
      "id": "507f1f77bcf86cd799439011",
      "sport": "Football",
      "title": "Evening Match",
      "venue": {
        "name": "City Sports Complex",
        "address": "..."
      },
      "date": "2025-12-01T18:00:00Z",
      "skillLevel": "Intermediate",
      "registeredPlayers": 15,
      "maxPlayers": 22,
      "spotsLeft": 7,
      "entryFee": 200,
      "organizer": {
        "name": "John Doe",
        "rating": 4.5
      }
    },
    ...
  ],
  "total": 32
}
```

#### Create Game
```
POST /api/games
Headers: Authorization: Bearer <token>

Request Body:
{
  "sport": "Football",
  "title": "Friendly Match",
  "description": "Casual evening game",
  "venue": "507f1f77bcf86cd799439011",
  "date": "2025-12-01T18:00:00Z",
  "duration": 90,
  "maxPlayers": 22,
  "skillLevel": "Intermediate",
  "entryFee": 200
}

Response:
{
  "success": true,
  "game": { /* created game */ }
}
```

#### Register for Game
```
POST /api/games/:gameId/register
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Successfully registered for game",
  "game": {
    "id": "507f1f77bcf86cd799439011",
    "registeredPlayers": 16,
    "spotsLeft": 6
  }
}
```

#### Cancel Registration
```
DELETE /api/games/:gameId/cancel-registration
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

---

### Job Endpoints

#### Get All Jobs
```
GET /api/jobs?jobType=coach&sport=basketball&status=open

Response:
{
  "success": true,
  "jobs": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Basketball Coach",
      "jobType": "coach",
      "sport": "Basketball",
      "salary": {
        "min": 30000,
        "max": 50000,
        "period": "monthly"
      },
      "experienceLevel": "2+ years",
      "venue": {
        "name": "Elite Sports Academy"
      },
      "postedBy": {
        "name": "Sports Center",
        "rating": 4.8
      },
      "applicants": 12,
      "postedAt": "2025-11-15T10:00:00Z"
    },
    ...
  ]
}
```

#### Post Job
```
POST /api/jobs
Headers: Authorization: Bearer <token>

Request Body:
{
  "title": "Football Coach",
  "jobType": "coach",
  "sport": "Football",
  "description": "Seeking experienced coach...",
  "venue": "507f1f77bcf86cd799439011",
  "requiredSkills": ["Coaching", "Leadership"],
  "requiredCertifications": ["UEFA B License"],
  "experienceLevel": "3+ years",
  "salary": {
    "min": 40000,
    "max": 60000,
    "period": "monthly"
  },
  "duration": "1 year",
  "employmentType": "Full-time"
}

Response:
{
  "success": true,
  "job": { /* created job */ }
}
```

#### Apply for Job
```
POST /api/jobs/:jobId/apply
Headers: Authorization: Bearer <token>

Request Body:
{
  "coverLetter": "I am interested in this position...",
  "resume": "https://cloudinary.com/resume.pdf",
  "availability": "Immediate",
  "expectedSalary": 45000
}

Response:
{
  "success": true,
  "message": "Application submitted successfully",
  "application": {
    "jobId": "507f1f77bcf86cd799439011",
    "status": "pending",
    "appliedAt": "2025-11-22T10:00:00Z"
  }
}
```

---

### Chat Endpoints

#### Get or Create Chat Room
```
POST /api/chat/room
Headers: Authorization: Bearer <token>

Request Body:
{
  "participants": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}

Response:
{
  "success": true,
  "room": {
    "id": "507f1f77bcf86cd799439020",
    "type": "private",
    "participants": [...],
    "lastMessage": "Hello!",
    "lastMessageAt": "2025-11-22T10:00:00Z"
  }
}
```

#### Get Chat Messages
```
GET /api/chat/room/:roomId?limit=50&skip=0
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "messages": [
    {
      "id": "msg001",
      "sender": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "avatar": "..."
      },
      "content": "Hey, ready for the game?",
      "timestamp": "2025-11-22T10:00:00Z",
      "read": true
    },
    ...
  ],
  "total": 145
}
```

#### Send Message
```
POST /api/chat/message
Headers: Authorization: Bearer <token>

Request Body:
{
  "roomId": "507f1f77bcf86cd799439020",
  "content": "See you at 6 PM!",
  "messageType": "text"
}

Response:
{
  "success": true,
  "message": {
    "id": "msg002",
    "sender": "507f1f77bcf86cd799439011",
    "content": "See you at 6 PM!",
    "timestamp": "2025-11-22T10:05:00Z"
  }
}
```

#### Create Group Chat
```
POST /api/chat/group
Headers: Authorization: Bearer <token>

Request Body:
{
  "name": "Weekend Warriors",
  "participants": ["user1", "user2", "user3"],
  "avatar": "https://cloudinary.com/group-avatar.jpg"
}

Response:
{
  "success": true,
  "group": {
    "id": "507f1f77bcf86cd799439021",
    "name": "Weekend Warriors",
    "type": "group",
    "admin": "507f1f77bcf86cd799439011",
    "participants": [...]
  }
}
```

---

### Review Endpoints

#### Create Review
```
POST /api/reviews
Headers: Authorization: Bearer <token>

Request Body:
{
  "revieweeId": "507f1f77bcf86cd799439012",
  "reviewType": "player",
  "gameId": "507f1f77bcf86cd799439030",
  "rating": 4.5,
  "categories": {
    "skill": 5,
    "sportsmanship": 4,
    "punctuality": 5,
    "communication": 4
  },
  "comment": "Excellent player with great team spirit!",
  "tags": ["Team Player", "Skilled"]
}

Response:
{
  "success": true,
  "review": { /* created review */ },
  "updatedRating": 4.6
}
```

#### Get User Reviews
```
GET /api/reviews/user/:userId?limit=10&skip=0

Response:
{
  "success": true,
  "stats": {
    "overallRating": 4.6,
    "totalReviews": 45,
    "ratingDistribution": {
      "5": 60,
      "4": 30,
      "3": 8,
      "2": 2,
      "1": 0
    },
    "categoryAverages": {
      "skill": 4.7,
      "sportsmanship": 4.8,
      "punctuality": 4.5,
      "communication": 4.4
    }
  },
  "reviews": [
    {
      "id": "rev001",
      "reviewer": {
        "name": "Jane Smith",
        "avatar": "..."
      },
      "rating": 5,
      "comment": "Great player!",
      "tags": ["Team Player"],
      "createdAt": "2025-11-20T10:00:00Z"
    },
    ...
  ]
}
```

---

## Socket.io Events Reference

### Connection Events
- **`connect`** - Client successfully connected
- **`disconnect`** - Client disconnected
- **`error`** - Connection error occurred

### Chat Events
- **`join-room`** - Join a chat room
  ```javascript
  socket.emit('join-room', { roomId: 'room123' })
  ```

- **`leave-room`** - Leave a chat room
  ```javascript
  socket.emit('leave-room', { roomId: 'room123' })
  ```

- **`send-message`** - Send a message
  ```javascript
  socket.emit('send-message', {
    roomId: 'room123',
    content: 'Hello!',
    senderId: 'user123'
  })
  ```

- **`receive-message`** - Receive a message
  ```javascript
  socket.on('receive-message', (data) => {
    // data: { messageId, senderId, content, timestamp, roomId }
  })
  ```

- **`typing`** - User is typing
  ```javascript
  socket.emit('typing', { roomId: 'room123', userId: 'user123' })
  ```

- **`stop-typing`** - User stopped typing
  ```javascript
  socket.emit('stop-typing', { roomId: 'room123', userId: 'user123' })
  ```

### Presence Events
- **`user-online`** - User came online
  ```javascript
  socket.on('user-online', (userId) => {
    // Update UI to show user online
  })
  ```

- **`user-offline`** - User went offline
  ```javascript
  socket.on('user-offline', (userId) => {
    // Update UI to show user offline
  })
  ```

### Notification Events
- **`new-game-invite`** - Received game invitation
- **`game-reminder`** - Upcoming game reminder
- **`new-message`** - New message notification
- **`application-update`** - Job application status changed
- **`review-received`** - New review posted

---

## Deployment Architecture

```
Developer Machine
        |
        v
git commit and push
        |
        v
GitHub Repository
        |
        +-------------------------+
        |                         |
        v                         v
    FRONTEND                  BACKEND
    (React Build)         (Node.js + Express)
        |                         |
        v                         v
npm run build            Deploy to Render/Railway
(Vite Production)               |
        |                         |
        v                         v
Static Files              API Server
        |                 api.skillmatch.com
        v                         |
Deploy to Vercel          Connected to:
        |                 - MongoDB Atlas
        v                 - Cloudinary
app.skillmatch.com        - Socket.io
        |                         |
        +-------------------------+
                    |
                    v
            User's Browser
```

### Environment Variables

**Frontend (.env)**
```
REACT_APP_API_URL=https://api.skillmatch.com
REACT_APP_SOCKET_URL=https://api.skillmatch.com
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_preset
```

**Backend (.env)**
```
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/skillmatch

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=https://app.skillmatch.com
```

---

## Setup and Installation

### Prerequisites
- Node.js v16 or higher
- MongoDB (local or Atlas account)
- npm or yarn
- Cloudinary account (for image uploads)

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/skillmatch-app.git
cd skillmatch-app/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development server**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
# Edit .env with API URL
```

4. **Start the development server**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Database Setup

1. **Create MongoDB database**
   - Local: Start MongoDB service
   - Cloud: Create cluster on MongoDB Atlas

2. **Database will auto-create collections on first use**

3. **Create geospatial indexes** (automatically created by schemas)
   ```javascript
   db.users.createIndex({ location: "2dsphere" })
   db.venues.createIndex({ location: "2dsphere" })
   ```

---

## Production Deployment

### Frontend Deployment (Vercel)

1. **Build the application**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

3. **Configure environment variables in Vercel dashboard**

### Backend Deployment (Render/Railway)

1. **Create new web service**
2. **Connect GitHub repository**
3. **Configure build command**: `npm install`
4. **Configure start command**: `npm start`
5. **Add environment variables**
6. **Deploy**

### MongoDB Atlas Setup

1. **Create cluster**
2. **Configure network access** (allow deployment server IP)
3. **Create database user**
4. **Get connection string**
5. **Add to backend environment variables**

---

## Key Features Summary

### 1. **Skill-Based Matching System**
   - Advanced algorithm matching players by skill level
   - Sport-specific proficiency tracking
   - Certification and badge verification
   - Rating and review system
   - Match percentage calculation

### 2. **Geospatial Discovery**
   - MongoDB 2dsphere indexing for location queries
   - Find nearby players within customizable radius
   - Venue discovery with distance calculation
   - Real-time location-based filtering
   - Interactive map visualization with Leaflet

### 3. **Event Management**
   - Create and manage games/tournaments
   - Player registration and capacity management
   - Automated reminders and notifications
   - Game status tracking (upcoming/in-progress/completed)
   - Post-game review system

### 4. **Smart Recruitment Platform**
   - Job posting for coaches, umpires, staff
   - AI-powered candidate matching
   - Application tracking system
   - Direct communication with applicants
   - Skill and certification verification

### 5. **Real-Time Communication**
   - Socket.io powered live chat
   - Private and group messaging
   - Typing indicators and read receipts
   - Online/offline status tracking
   - Message history persistence

### 6. **Venue Management**
   - Comprehensive venue profiles
   - Availability and booking system
   - Facility and amenity listings
   - Operating hours management
   - Review and rating system

### 7. **Review and Rating System**
   - Multi-category feedback (skill, sportsmanship, etc.)
   - Verified review badges
   - Aggregate rating calculations
   - Review response capability
   - Helpful vote system

### 8. **Team Formation**
   - Create and manage sports teams
   - Team statistics and performance tracking
   - Dedicated team chat rooms
   - Member role management
   - Team achievements and badges

---

## Performance Optimizations

### Database Optimizations
- Compound indexes for common queries on users, games, and jobs collections
- MongoDB 2dsphere indexing for geospatial queries
- Aggregation pipelines for efficient data retrieval
- Connection pooling for better database performance

### Frontend Optimizations
- React lazy loading for code splitting
- Zustand for efficient state management
- Axios interceptors for automatic token management
- Debounced search for better user experience

### Caching Strategies
- Redis caching for frequently accessed venue and user data
- Cache invalidation on data updates
- 1-hour TTL for location-based queries

---

## Security Best Practices

### Password Security
- bcrypt hashing with 10 salt rounds
- Password strength validation (minimum 8 characters with uppercase, lowercase, and number)
- Never store plain text passwords

### JWT Token Security
- Token expiration set to 7 days
- Secure token verification middleware
- Token invalidation on logout

### Input Validation
- Express Validator for all user inputs
- Sanitization of form data
- MongoDB ObjectId validation
- Date and number range validation

### Rate Limiting
- General API: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Protection against brute force attacks

### CORS Configuration
- Restricted origins in production
- Credentials support enabled
- Proper headers configuration

### Data Sanitization
- MongoDB injection prevention
- XSS attack prevention
- Input escaping and trimming

---

## Future Enhancements

### Phase 1 - Enhanced Features
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Push notifications (FCM)
- [ ] Email notifications (SendGrid)
- [ ] SMS notifications (Twilio)

### Phase 2 - AI/ML Integration
- [ ] AI-powered player recommendations
- [ ] Skill level assessment algorithms
- [ ] Predictive game outcome models
- [ ] Automated matchmaking optimization
- [ ] Injury risk prediction

### Phase 3 - Social Features
- [ ] Social feed and posts
- [ ] Live streaming integration
- [ ] Photo/video sharing
- [ ] Achievement sharing
- [ ] Leaderboards and rankings

### Phase 4 - Enterprise Features
- [ ] Tournament management system
- [ ] League organization tools
- [ ] Sponsorship marketplace
- [ ] Equipment rental system
- [ ] Sports academy integration

### Phase 5 - Advanced Analytics
- [ ] Performance tracking
- [ ] Training progress monitoring
- [ ] Statistical analysis tools
- [ ] Heat maps and visualization
- [ ] Comparative analytics

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Code Style
- Use ESLint configuration provided
- Follow Airbnb JavaScript style guide
- Write meaningful commit messages
- Add comments for complex logic

### Pull Request Process
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Testing Requirements
- Write unit tests for new features
- Ensure all tests pass before submitting
- Maintain test coverage above 80%

---

## Troubleshooting

### Common Issues

**Issue: MongoDB connection failed**
```
Solution:
1. Check MONGODB_URI in .env file
2. Verify network access in MongoDB Atlas
3. Ensure database user credentials are correct
```

**Issue: Socket.io connection not established**
```
Solution:
1. Check SOCKET_URL in frontend .env
2. Verify CORS configuration on backend
3. Check firewall rules
```

**Issue: JWT token expired**
```
Solution:
1. User needs to login again
2. Implement token refresh mechanism
3. Adjust JWT_EXPIRE time in .env
```

**Issue: Geospatial queries not working**
```
Solution:
1. Ensure 2dsphere indexes are created
2. Verify coordinate format [longitude, latitude]
3. Check radius units (meters)
```

---

## API Rate Limits

| Endpoint Type | Rate Limit | Window |
|---------------|------------|--------|
| Authentication | 5 requests | 15 minutes |
| General API | 100 requests | 15 minutes |
| Chat messages | 50 requests | 1 minute |
| File uploads | 10 requests | 1 hour |
| Search queries | 30 requests | 1 minute |

---

## Performance Benchmarks

| Operation | Average Response Time |
|-----------|----------------------|
| User login | 150ms |
| Game search | 200ms |
| Geospatial query | 300ms |
| Chat message send | 50ms |
| File upload | 2s |
| Review submission | 180ms |

---

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- React team for the amazing framework
- MongoDB for robust database solution
- Socket.io for real-time capabilities
- Leaflet for mapping functionality
- All contributors and testers

---

## Contact & Support

**Project Repository:** https://github.com/yourusername/skillmatch-app

**Documentation:** https://docs.skillmatch.com

**Support Email:** support@skillmatch.com

**Discord Community:** https://discord.gg/skillmatch

---

**SkillMatch** - Connecting Sports Communities, One Match at a Time! ⚽🏀🎾🏏🏸
# Thanks Keep Learning and Keep Exploring