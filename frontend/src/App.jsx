import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GamesList from './pages/GamesList';
import './index.css';

function App() {
  const { user, logout, login } = useAuthStore();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
  };

  const handleLogin = (userData, token) => {
    login(userData, token);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/games" element={<GamesList />} />
      </Routes>
    </Router>
  );
}

export default App;
