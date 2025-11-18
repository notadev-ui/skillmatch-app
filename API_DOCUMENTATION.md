# SkillMatch API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Request:
```json
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

Response (201):
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "Player"
  }
}
```

---

### 2. Login User
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "userType": "Player",
    "profilePhoto": null
  }
}
```

---

### 3. Get Current User
**GET** `/auth/me` (Protected)

Response (200):
```json
{
  "message": "User retrieved successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "userType": "Player",
    "skills": [],
    "ratings": {
      "average": 0,
      "count": 0
    }
  }
}
```

---

## 👥 User Endpoints

### 1. Get User Profile
**GET** `/users/:userId`

Response (200):
```json
{
  "message": "User profile retrieved",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profilePhoto": null,
    "bio": "Love playing cricket!",
    "location": {
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "coordinates": {
        "type": "Point",
        "coordinates": [-74.0060, 40.7128]
      }
    },
    "skills": [
      {
        "skillName": "Cricket",
        "proficiencyLevel": "Advanced",
        "verified": true,
        "yearsExperience": 5
      }
    ],
    "ratings": {
      "average": 4.5,
      "count": 10
    }
  }
}
```

---

### 2. Update User Profile
**PUT** `/users/profile` (Protected)

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Professional cricket player",
  "location": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY"
  },
  "preferredSports": ["Cricket", "Football"],
  "availableHours": {
    "type": "Weekends"
  }
}
```

Response (200): Updated user object

---

### 3. Search Users
**GET** `/users/search?skill=cricket&city=New%20York`

Query Parameters:
- `skill` - Skill name (optional)
- `city` - City name (optional)

Response (200):
```json
{
  "message": "Users found",
  "count": 5,
  "users": [/* array of user objects */]
}
```

---

### 4. Get Nearby Users
**GET** `/users/nearby?longitude=-74.0060&latitude=40.7128&maxDistance=5000`

Query Parameters:
- `longitude` - Longitude coordinate (required)
- `latitude` - Latitude coordinate (required)
- `maxDistance` - Max distance in meters (default: 5000)

---

### 5. Add Skill to Profile
**POST** `/users/skill` (Protected)

Request:
```json
{
  "skillName": "Tennis",
  "proficiencyLevel": "Intermediate",
  "yearsExperience": 3,
  "certification": "USTA Certified"
}
```

---

## 🏟️ Venue Endpoints

### 1. Get All Venues
**GET** `/venues?type=Stadium&city=New%20York`

Query Parameters:
- `type` - Venue type (Stadium, Court, Field, Gym, Pool)
- `city` - City name

Response (200):
```json
{
  "message": "Venues retrieved",
  "count": 10,
  "venues": [/* array of venue objects */]
}
```

---

### 2. Create Venue
**POST** `/venues` (Protected - Manager only)

Request:
```json
{
  "name": "Central Park Courts",
  "description": "Premium tennis courts in the heart of NYC",
  "type": "Court",
  "location": {
    "address": "123 Park Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": [-74.0060, 40.7128]
  },
  "contactEmail": "info@cpanks.com",
  "contactPhone": "2125551234",
  "facilities": ["Restrooms", "Parking", "Lighting"],
  "amenities": ["WiFi", "Cafe", "Lockers"],
  "capacity": 100,
  "pricePerHour": 50,
  "operatingHours": {
    "monday": { "open": "06:00", "close": "22:00" },
    "tuesday": { "open": "06:00", "close": "22:00" }
  }
}
```

---

### 3. Get Venue by ID
**GET** `/venues/:venueId`

Response (200): Single venue object

---

### 4. Update Venue
**PUT** `/venues/:venueId` (Protected - Manager only)

Request: (Partial fields allowed)
```json
{
  "pricePerHour": 60,
  "facilities": ["Restrooms", "Parking"]
}
```

---

### 5. Get Nearby Venues
**GET** `/venues/nearby?longitude=-74.0060&latitude=40.7128`

Query Parameters:
- `longitude` - Longitude coordinate
- `latitude` - Latitude coordinate
- `maxDistance` - Max distance in meters (default: 50000)

---

## ⚽ Game/Event Endpoints

### 1. Get All Games
**GET** `/games?sportType=Cricket&skillLevel=Advanced&status=Upcoming`

Query Parameters:
- `sportType` - Sport type (Cricket, Football, Tennis, etc.)
- `skillLevel` - Skill level (Beginner, Intermediate, Advanced, Mixed)
- `status` - Status (Upcoming, Ongoing, Completed)

Response (200):
```json
{
  "message": "Games retrieved",
  "count": 5,
  "games": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Weekend Cricket Match",
      "description": "Friendly match at Central Park",
      "sportType": "Cricket",
      "skillLevel": "Advanced",
      "venue": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Central Park"
      },
      "date": "2024-02-15T00:00:00.000Z",
      "startTime": "18:00",
      "endTime": "20:00",
      "maxPlayers": 22,
      "registeredPlayers": [/* array */],
      "cost": 50,
      "status": "Upcoming"
    }
  ]
}
```

---

### 2. Create Game
**POST** `/games` (Protected)

Request:
```json
{
  "title": "Weekend Cricket Match",
  "description": "Friendly match for intermediate players",
  "sportType": "Cricket",
  "skillLevel": "Advanced",
  "venueId": "507f1f77bcf86cd799439012",
  "date": "2024-02-15",
  "startTime": "18:00",
  "endTime": "20:00",
  "maxPlayers": 22,
  "eventType": "Friendly",
  "cost": 50
}
```

---

### 3. Get Game by ID
**GET** `/games/:gameId`

---

### 4. Register for Game
**POST** `/games/:gameId/register` (Protected)

Response (200):
```json
{
  "message": "Registered for game successfully",
  "game": {/* updated game object */}
}
```

---

### 5. Cancel Registration
**DELETE** `/games/:gameId/cancel-registration` (Protected)

---

### 6. Get User's Games
**GET** `/games/user/games` (Protected)

Returns games organized by current user

---

### 7. Update Game Status
**PUT** `/games/:gameId/status` (Protected)

Request:
```json
{
  "status": "Completed"
}
```

---

## 💼 Job Endpoints

### 1. Get All Jobs
**GET** `/jobs?jobType=Coach&status=Open`

Query Parameters:
- `jobType` - Job type (Coach, Umpire, Helper, Staff)
- `status` - Status (Open, Closed, Filled)
- `location` - Location filter

Response (200):
```json
{
  "message": "Jobs retrieved",
  "count": 10,
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Cricket Coach Needed",
      "description": "Experienced coach for training sessions",
      "jobType": "Coach",
      "requiredSkills": [
        {
          "skillName": "Cricket",
          "proficiencyLevel": "Advanced"
        }
      ],
      "location": "New York",
      "salary": {
        "min": 50,
        "max": 100,
        "currency": "USD"
      },
      "startDate": "2024-02-01",
      "endDate": "2024-12-31",
      "status": "Open"
    }
  ]
}
```

---

### 2. Create Job
**POST** `/jobs` (Protected - Venue Manager)

Request:
```json
{
  "title": "Cricket Coach Needed",
  "description": "Experienced coach for our cricket academy",
  "jobType": "Coach",
  "requiredSkills": [
    {
      "skillName": "Cricket",
      "proficiencyLevel": "Advanced"
    }
  ],
  "venueId": "507f1f77bcf86cd799439012",
  "location": "New York, NY",
  "salary": {
    "min": 50,
    "max": 100,
    "currency": "USD"
  },
  "startDate": "2024-02-01",
  "endDate": "2024-12-31",
  "duration": "Full-time",
  "experienceRequired": "5+ years",
  "workSchedule": "Monday-Friday, 9AM-5PM",
  "benefits": ["Health Insurance", "Flexible Hours"]
}
```

---

### 3. Get Job by ID
**GET** `/jobs/:jobId`

---

### 4. Apply for Job
**POST** `/jobs/:jobId/apply` (Protected)

---

### 5. Get Posted Jobs
**GET** `/jobs/user/posted` (Protected)

Returns jobs posted by current user

---

### 6. Get Applied Jobs
**GET** `/jobs/user/applied` (Protected)

Returns jobs user has applied for

---

### 7. Update Application Status
**PUT** `/jobs/:jobId/application-status` (Protected)

Request:
```json
{
  "applicantId": "507f1f77bcf86cd799439013",
  "status": "Shortlisted"
}
```

Statuses: Applied, Shortlisted, Selected, Rejected

---

### 8. Close Job
**PUT** `/jobs/:jobId/close` (Protected)

---

## 💬 Chat Endpoints

### 1. Get or Create Chat Room
**POST** `/chat/room` (Protected)

Request:
```json
{
  "participantIds": ["507f1f77bcf86cd799439013"],
  "roomType": "Private",
  "roomName": "Chat with John"
}
```

---

### 2. Get Chat Messages
**GET** `/chat/room/:roomId` (Protected)

Response (200):
```json
{
  "message": "Messages retrieved",
  "messages": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "sender": {
        "_id": "507f1f77bcf86cd799439013",
        "firstName": "John",
        "profilePhoto": null
      },
      "message": "Hey, are you interested in playing this weekend?",
      "timestamp": "2024-02-10T15:30:00.000Z"
    }
  ]
}
```

---

### 3. Save Message
**POST** `/chat/message` (Protected)

Request:
```json
{
  "roomId": "private_507f1f77bcf86cd799439013_507f1f77bcf86cd799439014",
  "message": "Yes, I'm interested!"
}
```

---

### 4. Get User Chat Rooms
**GET** `/chat/user/rooms` (Protected)

---

### 5. Create Group Chat
**POST** `/chat/group` (Protected)

Request:
```json
{
  "participantIds": ["507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"],
  "roomName": "Cricket Team Discussion"
}
```

---

## ⭐ Review Endpoints

### 1. Create Review
**POST** `/reviews` (Protected)

Request:
```json
{
  "revieweeId": "507f1f77bcf86cd799439013",
  "rating": 5,
  "comment": "Great player, very professional!",
  "relatedGame": "507f1f77bcf86cd799439015",
  "categories": {
    "sportsmanship": 5,
    "skillLevel": 5,
    "teamwork": 4,
    "punctuality": 5
  }
}
```

---

### 2. Get User Reviews
**GET** `/reviews/user/:userId`

Response (200):
```json
{
  "message": "Reviews retrieved",
  "count": 5,
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "reviewer": {
        "_id": "507f1f77bcf86cd799439013",
        "firstName": "Jane",
        "profilePhoto": null
      },
      "rating": 5,
      "comment": "Excellent coach!",
      "createdAt": "2024-02-10T15:30:00.000Z"
    }
  ]
}
```

---

### 3. Get My Reviews
**GET** `/reviews/my-reviews` (Protected)

Returns reviews given by current user

---

### 4. Get All Reviews
**GET** `/reviews?minRating=4&maxRating=5`

Query Parameters:
- `minRating` - Minimum rating filter
- `maxRating` - Maximum rating filter

---

### 5. Update Review
**PUT** `/reviews/:reviewId` (Protected)

Request:
```json
{
  "rating": 4,
  "comment": "Good player",
  "categories": {
    "sportsmanship": 4
  }
}
```

---

### 6. Delete Review
**DELETE** `/reviews/:reviewId` (Protected)

---

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting
Currently no rate limiting is implemented. Consider adding it for production.

---

## Pagination
Future versions will include pagination support with limit/offset parameters.

---

## Webhooks
Future feature for real-time notifications.

---

**Last Updated:** February 2024
**API Version:** 1.0.0
