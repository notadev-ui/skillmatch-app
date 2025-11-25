import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUsers, FaMapPin, FaCalendar, FaBriefcase, FaComments, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import skillmatchLogo from "../assets/images/skillmatch_Logo.png";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
        <img
         src={skillmatchLogo}
         alt="SkillMatch Logo"
         className="h-14 w-auto object-contain rounded-md"/>
         <p className="text-2xl font-bold">SkillMatch</p >
        </Link>
      

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center">
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
                <Link to="/games" className="flex items-center gap-2 hover:text-blue-200">
                  <FaCalendar /> Games
                </Link>
              </li>
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 border-t border-blue-500">
          <ul className="flex flex-col gap-4 p-4">
            <li>
              <Link to="/" className="flex items-center gap-2 hover:text-blue-200" onClick={toggleMenu}>
                <FaHome /> Home
              </Link>
            </li>
            <li>
              <Link to="/players" className="flex items-center gap-2 hover:text-blue-200" onClick={toggleMenu}>
                <FaUsers /> Players
              </Link>
            </li>
            <li>
              <Link to="/venues" className="flex items-center gap-2 hover:text-blue-200" onClick={toggleMenu}>
                <FaMapPin /> Venues
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="flex items-center gap-2 hover:text-blue-200" onClick={toggleMenu}>
                <FaBriefcase /> Jobs
              </Link>
            </li>
            <li>
              <Link to="/chat" className="flex items-center gap-2 hover:text-blue-200" onClick={toggleMenu}>
                <FaComments /> Chat
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link to="/games" className="flex items-center gap-2 hover:text-blue-200" onClick={toggleMenu}>
                    <FaCalendar /> Games
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="flex items-center gap-2 hover:text-blue-200" onClick={toggleMenu}>
                    <FaUser /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onLogout();
                      toggleMenu();
                    }}
                    className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-200" onClick={toggleMenu}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 inline-block" onClick={toggleMenu}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
