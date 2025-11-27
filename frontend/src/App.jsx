import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GamesList from './pages/GamesList';
import PlayerSearch from './pages/PlayerSearch';
import VenueSearch from './pages/VenueSearch';
import JobBoard from './pages/JobBoard';
import ChatInterface from './pages/ChatInterface';
import Profile from './pages/Profile';
import './index.css';
import ProfileDetail from './pages/ProfileDetail';
import GameDetail from './pages/GameDetail';
import VenueDetail from './pages/VenueDetail';
import JobDetail from './pages/JobDetail';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';

function AppContent() {
  const { user, logout, login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  const handleLogin = (userData, token) => {
    login(userData, token);
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/games" element={<GamesList />} />
        <Route path="/players" element={<PlayerSearch />} />
        <Route path="/venues" element={<VenueSearch />} />
        <Route path="/jobs" element={<JobBoard />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<ProfileDetail />} />
        <Route path="/games/:id" element={<GameDetail />} />
        <Route path="/venues/:id" element={<VenueDetail />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
      <Footer />
    </Router>
  );
}

export default App;
