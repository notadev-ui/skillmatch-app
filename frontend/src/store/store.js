import create from 'zustand';

// Helper to get persisted user data from localStorage
const getPersistedUser = () => {
  try {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      return { 
        user: JSON.parse(user),
        token,
        isAuthenticated: true
      };
    }
    return {
      user: null,
      token: null,
      isAuthenticated: false
    };
  } catch {
    return {
      user: null,
      token: null,
      isAuthenticated: false
    };
  }
};

const initialState = getPersistedUser();

export const useAuthStore = create((set) => ({
  user: initialState.user,
  token: initialState.token,
  isAuthenticated: initialState.isAuthenticated,
  isLoading: false,
  error: null,

  login: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    if(token) localStorage.setItem('token', token);
    set({
      user: userData,
      token,
      isAuthenticated: true,
      error: null
    });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  updateUser: (userData) => {
    set((state) => ({ user: { ...state.user, ...userData } }));
    localStorage.setItem('user', JSON.stringify({ ...initialState.user, ...userData }));
  },

  setUser: (user) => {
    set({ user });
    localStorage.setItem('user', JSON.stringify(user));
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

export const useGameStore = create((set) => ({
  games: [],
  selectedGame: null,
  isLoading: false,

  setGames: (games) => set({ games }),
  setSelectedGame: (game) => set({ selectedGame: game }),
  addGame: (game) => set((state) => ({ games: [...state.games, game] })),
  setLoading: (isLoading) => set({ isLoading })
}));

export const useVenueStore = create((set) => ({
  venues: [],
  selectedVenue: null,
  isLoading: false,

  setVenues: (venues) => set({ venues }),
  setSelectedVenue: (venue) => set({ selectedVenue: venue }),
  addVenue: (venue) => set((state) => ({ venues: [...state.venues, venue] })),
  setLoading: (isLoading) => set({ isLoading })
}));

export const useChatStore = create((set) => ({
  chatRooms: [],
  activeRoom: null,
  messages: [],

  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  setActiveRoom: (room) => set({ activeRoom: room }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] }))
}));
