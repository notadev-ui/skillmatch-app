import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: (userData, token) =>
    set({
      user: userData,
      token,
      isAuthenticated: true,
      error: null
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false
    }),

  setUser: (user) => set({ user }),
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
