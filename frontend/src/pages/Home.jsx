import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendar, FaBriefcase, FaStar, FaUsers, FaMapPin } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to SkillMatch</h1>
          <p className="text-xl mb-8">
            Find skilled players, venues, and opportunities in your local sports community
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/games" className="bg-green-500 px-8 py-3 rounded-lg hover:bg-green-600 font-semibold">
              Find Games
            </Link>
            <Link to="/players" className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-semibold">
              Find Players
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <FaSearch className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Skill-Based Search</h3>
              <p>Find players matched to your skill level and preferred sports in your local area.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <FaMapPin className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Venue Locator</h3>
              <p>Discover and book nearby stadiums, courts, and training facilities.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <FaBriefcase className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Recruitment</h3>
              <p>Connect with venues and clubs looking for coaches, umpires, and staff.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <FaStar className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Badges</h3>
              <p>Build trust with skill badges and community ratings after every game or job.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <FaUsers className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p>Connect with other sports enthusiasts, plan matches, and form teams.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <FaCalendar className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Event Management</h3>
              <p>Create and manage tournaments, training sessions, and friendly matches easily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-lg mb-8">
            Register now to connect with your local sports community and find your perfect match.
          </p>
          <Link
            to="/register"
            className="bg-green-500 px-8 py-3 rounded-lg hover:bg-green-600 font-semibold inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
