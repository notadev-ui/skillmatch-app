**SkillMatch — Project Synopsis**

**Project Overview:**
- **Name:** SkillMatch
- **Type:** Full‑stack web application (SaaS / community platform)
- **Primary Domain:** Sports community, skills matching, events, venues and job marketplace for sport-related roles
- **Repository Layout:** Monorepo-like structure containing a Node/Express backend (`backend/`) and a React frontend (`frontend/`).

**Purpose & Goals:**
- **Primary goal:** Connect players, coaches, umpires, venues and event organizers to facilitate match-making for games, staffing (jobs), venue discovery, and in-app communication.
- **Target users:** Players, Coaches, Umpires, Venue Managers, Organizers, and Staff.
- **Secondary goals:** Provide location-aware venue discovery, role/job postings, team formation, event scheduling, ratings & reviews, and real-time chat.

**Key Features (at-a-glance):**
- User authentication, registration and JWT-based authorization.
- Rich user profiles with skills, badges, geographic location and availability.
- Venue management (listing, operating hours, geospatial coordinates, photos).
- Events/Games system (create, join, manage attendance and capacity limits).
- Job board for sports-related roles (apply, shortlist, status updates).
- Teams with membership roles and basic stats.
- Reviews and ratings for users, events and venues.
- Real-time chat powered by Socket.IO (rooms, groups, private chat).
- Map support (Leaflet + react-leaflet) for spatial queries and venue search.

**Technology Stack:**
- Backend: Node.js + Express, MongoDB (Mongoose ORM), Socket.IO for realtime, Cloudinary for media (optional), multer for multipart uploads.
- Frontend: React (create-react-app), Tailwind CSS for styling, React Router, React Query, Zustand for state, Socket.IO client, react-leaflet for maps.
- Dev tools & libs: nodemon (dev), jest (basic test setup), axios for HTTP requests.

**Repository Structure (short):**
- `backend/` — Express API server, models, controllers, routes, config.
  - `controllers/` — business logic for auth, users, venues, games, jobs, reviews, chat.
  - `models/` — Mongoose schemas (User, Venue, Game, Job, Team, Review, Chat).
  - `routes/` — route definitions mounted under `/api/*`.
  - `config/db.js` — MongoDB connection (reads `MONGODB_URI`).
  - `server.js` — app bootstrap, Socket.IO setup, route mounting and error handling.
- `frontend/` — React app (`src/` contains pages, components, services and store).

**API Surface (high-level):**
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (protected)
- Users: CRUD and profile endpoints under `/api/users` (profile fetch, update, search, etc.)
- Venues: `GET/POST/PUT/DELETE /api/venues` — venue discovery, geospatial indexing supports location queries
- Games: `GET/POST/PUT /api/games` — create and manage events, register players
- Jobs: `GET/POST/PUT /api/jobs` — job postings and applicant lifecycle
- Chat: `GET/POST /api/chat` + Socket.IO channels for `join_room`, `send_message`, `leave_room`, `receive_message`
- Reviews: `GET/POST /api/reviews` — structured reviews with categories

Note: Routes are mounted in `backend/server.js` as `/api/auth`, `/api/users`, `/api/venues`, `/api/games`, `/api/jobs`, `/api/chat`, `/api/reviews`.

**Data Model Summaries (from `backend/models`)**
The repository implements rich Mongoose schemas — below are concise summaries of important models and fields.

- **User** (`User.js`)
  - Identity: `firstName`, `lastName`, `email` (unique), `password` (hashed with bcrypt)
  - Contact & profile: `phone`, `profilePhoto`, `bio`
  - Location: `location.address`, `city`, `state`, `location.coordinates` (GeoJSON `Point` indexed `2dsphere`)
  - Skills: array of objects `{ skillName, proficiencyLevel, verified, certification, yearsExperience }`
  - Preferences: `preferredSports`, `availableHours`
  - Ratings and badges: `ratings.average`, `ratings.count`, `badges[]`
  - Role & verification: `userType` (Player, Coach, Umpire, Staff, Venue Manager), `isVerified`, `verificationToken`
  - Relations: `teams` (ref `Team`)

- **Venue** (`Venue.js`)
  - Basic: `name`, `description`, `type` (Stadium/Court/Field/Gym/Pool/Other)
  - Location: address block and `coordinates` (GeoJSON `Point`, required)
  - Contact: `contactEmail`, `contactPhone`
  - Media & attributes: `photos[]`, `facilities[]`, `amenities[]`, `capacity`, `pricePerHour`
  - Manager: `manager` (ref `User`)
  - Operating hours: `operatingHours` object (monday..sunday open/close)
  - Reviews & ratings aggregated in `ratings`, `reviews[]`

- **Job** (`Job.js`)
  - `title`, `description`, `jobType` (Coach/Umpire/Helper/Staff/Other)
  - `requiredSkills[]`, `venue` (ref `Venue`), `postedBy` (ref `User`)
  - Salary object `{ min, max, currency }`, start/end dates, `duration`
  - Applicants list tracks `userId`, `appliedAt`, and `status` (Applied/Shortlisted/Selected/Rejected)
  - `status` (Open/Closed/Filled)

- **Game** (`Game.js`)
  - `title`, `description`, `sportType`, `skillLevel`, `venue` (ref `Venue`)
  - Timing: `date`, `startTime`, `endTime`, `maxPlayers`
  - `registeredPlayers[]` tracks users, join time and status
  - `organizer` (ref `User`), `eventType` (Training/Match/Tournament/Friendly), `cost`, `status`

- **Team** (`Team.js`)
  - `name`, `description`, `logo`, `captain` (ref `User`)
  - `members[]` with role (Captain/Co-Captain/Member) and joinedAt, sportType, simple `stats` and `isPublic`

- **Review** (`Review.js`)
  - `reviewer` (ref `User`), `reviewee` (ref `User`), `rating`, `comment`
  - Optional refs: `relatedGame`, `relatedJob` and detailed `categories` (sportsmanship, skillLevel, teamwork, punctuality)

- **Chat** (`Chat.js`)
  - `roomId`, `participants[]` (refs to `User`), `messages[]` (sender ref, message text, timestamp)
  - `roomType` (Private/Group/Team)

These schemas use `timestamps: true` and several models provide geospatial indexing to support location-based queries.

**Realtime / Socket.IO**
- Socket.IO is set up in `backend/server.js`. Key client events used by the app:
  - `join_room` — join a Socket.IO room
  - `send_message` — emit message payloads; server broadcasts `receive_message` to room
  - `leave_room` — leave a room
  - Standard `connect` and `disconnect` lifecycle logging

**Frontend Structure & Important Files**
- `frontend/src/` contains:
  - `App.jsx` — top-level routes and bootstrapping
  - `index.js` / `index.css` — app entry and global styles (Tailwind configured)
  - `components/` — shared UI elements (`Navbar.jsx`, `Modal.jsx`)
  - `pages/` — feature pages such as `Home.jsx`, `JobBoard.jsx`, `GameDetail.jsx`, `GamesList.jsx`, `ChatInterface.jsx`, `Profile.jsx`, `VenueSearch.jsx`, `VenueDetail.jsx`, `Register.jsx`, `Login.jsx` and others
  - `services/api.js` — HTTP API wrapper (axios)
  - `store/store.js` — global state management (Zustand)

Frontend libraries of note: `react-query` (data fetching/caching patterns), `socket.io-client` (real-time chat), `react-leaflet` + `leaflet` (maps), `react-icons`, `react-toastify`.

**Development & Run Instructions (concise)**
1. Backend (API + Socket.IO)
   - From `backend/` install and run:
```
   cd backend
   npm install
   npm run dev    # nodemon server.js (development)
```
   - Production: `npm start` runs `node server.js`.

2. Frontend (React)
   - From `frontend/`:
```
   cd frontend
   npm install
   npm start      # runs react-scripts start (development)
```

**Recommended Environment Variables (.env example for backend):**
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.example.mongodb.net/skillmatch
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
PORT=5000
# Optional (if using Cloudinary or other services):
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**Testing & Quality**
- Basic test script placeholder is configured (`backend` has `jest` in devDependencies). Add focused unit and integration tests for controllers and route handlers.
- Linting and type checks can be added (ESLint, Prettier, TypeScript improvements for frontend).

**Deployment Guidance:**
- Typical deployment pattern:
  1. Deploy backend to a Node-friendly host (Heroku, Railway, Render, DigitalOcean App Platform, or a container on AWS/GCP/Azure). Ensure `MONGODB_URI` and `JWT_SECRET` are configured in the environment.
  2. Configure CORS / `CLIENT_URL` to only allow the production frontend origin.
  3. Build frontend (`npm run build`) and host on Vercel / Netlify / static host; or serve behind a reverse proxy with the backend.
  4. For uploads/media use Cloudinary or S3 and keep credentials in environment variables.
  5. Use HTTPS in production and rotate secrets periodically.

**Security & Privacy Considerations:**
- Never commit `.env` or secrets to Git. Use secret storage provided by the host.
- Use `JWT_SECRET` strong random value and keep token expiry reasonable. Consider refresh tokens for long sessions.
- Validate and sanitize inputs (express-validator is installed; use in controllers where needed).
- Rate-limit authentication endpoints and implement account lockout or CAPTCHA after repeated failures.
- Ensure uploaded files are size‑limited and validated (multer + Cloudinary used).
- For geolocation, be explicit in the privacy policy on how coordinates are stored and shared.

**Extensibility & Recommended Improvements:**
- Add role‑based authorization middleware (granular RBAC) for manager/organizer actions.
- Add background jobs (e.g., with BullMQ) for email notifications, batch rating recalculation and media processing.
- Strengthen type-safety: migrate frontend to TypeScript completely, add types for API responses.
- Add paging, filtering and faceted search on list endpoints (venues, games, jobs) and server-side caching for frequently-requested resources.
- Add analytics events and admin dashboards for monitoring usage, bookings and revenue if monetization is intended.

**Contributors & Onboarding Notes:**
- Important files & entrypoints:
  - Backend: `backend/server.js`, `backend/config/db.js`, `backend/controllers/*`, `backend/models/*`, `backend/routes/*`.
  - Frontend: `frontend/src/App.jsx`, `frontend/src/pages/`, `frontend/src/services/api.js`, `frontend/src/store/store.js`.
- For new contributors: run both backend and frontend locally, seed sample data (`backend/addSampleJobs.js`, `backend/addSampleVenues.js` exist) to bootstrap development flows.

**Appendix: Useful commands**
- Start both apps locally (two terminals):
```
# Terminal A - backend
cd backend
npm install
npm run dev

# Terminal B - frontend
cd frontend
npm install
npm start
```

**File Added:** `synopsis.md` — this document (summary and guide). Use this as the canonical high-level project reference. For deeper technical edits, review specific controllers and route files under `backend/`.