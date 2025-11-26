import axios from 'axios';

const API_BASE_URL =process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getCurrentUser: () => apiClient.get('/auth/me')
};

export const userService = {
  getUserProfile: (userId) => apiClient.get(`/users/${userId}`),
  updateProfile: (userData) => apiClient.put('/users/profile', userData),
  searchUsers: (params) => apiClient.get('/users/search', { params }),
  getUsersNearLocation: (params) => apiClient.get('/users/nearby', { params }),
  addSkill: (skillData) => apiClient.post('/users/skill', skillData)
};

export const venueService = {
  getAllVenues: (params) => apiClient.get('/venues', { params }),
  getVenueById: (venueId) => apiClient.get(`/venues/${venueId}`),
  createVenue: (venueData) => apiClient.post('/venues', venueData),
  updateVenue: (venueId, venueData) => apiClient.put(`/venues/${venueId}`, venueData),
  getVenuesNearLocation: (params) => apiClient.get('/venues/nearby', { params })
};

export const gameService = {
  getAllGames: (params) => apiClient.get('/games', { params }),
  getGameById: (gameId) => apiClient.get(`/games/${gameId}`),
  createGame: (gameData) => apiClient.post('/games', gameData),
  registerForGame: (gameId) => apiClient.post(`/games/${gameId}/register`),
  cancelRegistration: (gameId) => apiClient.delete(`/games/${gameId}/cancel-registration`),
  getUserGames: () => apiClient.get('/games/user/games'),
  updateGameStatus: (gameId, status) => apiClient.put(`/games/${gameId}/status`, { status })
};

export const jobService = {
  getAllJobs: (params) => apiClient.get('/jobs', { params }),
  getJobById: (jobId) => apiClient.get(`/jobs/${jobId}`),
  createJob: (jobData) => apiClient.post('/jobs', jobData),
  applyForJob: (jobId) => apiClient.post(`/jobs/${jobId}/apply`),
  getUserJobs: () => apiClient.get('/jobs/user/posted'),
  getAppliedJobs: () => apiClient.get('/jobs/user/applied'),
  updateApplicationStatus: (jobId, applicantId, status) =>
    apiClient.put(`/jobs/${jobId}/application-status`, { applicantId, status }),
  closeJob: (jobId) => apiClient.put(`/jobs/${jobId}/close`)
};

export const chatService = {
  getOrCreateChatRoom: (data) => apiClient.post('/chat/room', data),
  getChatMessages: (roomId) => apiClient.get(`/chat/room/${roomId}`),
  saveMessage: (data) => apiClient.post('/chat/message', data),
  getUserChatRooms: () => apiClient.get('/chat/user/rooms'),
  createGroupChat: (data) => apiClient.post('/chat/group', data)
};

export const reviewService = {
  createReview: (reviewData) => apiClient.post('/reviews', reviewData),
  getUserReviews: (userId) => apiClient.get(`/reviews/user/${userId}`),
  getMyReviews: () => apiClient.get('/reviews/my-reviews'),
  getAllReviews: (params) => apiClient.get('/reviews', { params }),
  updateReview: (reviewId, reviewData) => apiClient.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => apiClient.delete(`/reviews/${reviewId}`)
};

export default apiClient;
