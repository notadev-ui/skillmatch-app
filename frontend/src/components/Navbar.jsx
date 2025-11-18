import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaMapPin, FaCalendar, FaBriefcase, FaComments, FaUser } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          SkillMatch
        </Link>

        <ul className="flex gap-6 items-center">
          <li>
            <Link to="/" className="flex items-center gap-2 hover:text-blue-200">
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/players" className="flex items-center gap-2 hover:text-blue-200">
              <FaUsers /> Players
            </Link>
          </li>
          <li>
            <Link to="/venues" className="flex items-center gap-2 hover:text-blue-200">
              <FaMapPin /> Venues
            </Link>
          </li>
          <li>
            <Link to="/games" className="flex items-center gap-2 hover:text-blue-200">
              <FaCalendar /> Games
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="flex items-center gap-2 hover:text-blue-200">
              <FaBriefcase /> Jobs
            </Link>
          </li>
          <li>
            <Link to="/chat" className="flex items-center gap-2 hover:text-blue-200">
              <FaComments /> Chat
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/profile" className="flex items-center gap-2 hover:text-blue-200">
                  <FaUser /> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={onLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-blue-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
