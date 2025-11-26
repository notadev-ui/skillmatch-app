import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendar, FaBriefcase, FaStar, FaUsers, FaMapPin } from 'react-icons/fa';
import SkillmatchBanner from "../assets/images/skillMatch_Banner.png";

const Home = ({ user }) => {
  const features = [
    {
      Icon: FaSearch,
      title: 'Skill-Based Search',
      desc: 'Find players matched to your skill level and preferred sports in your local area.',
      link: '/players',
    },
    {
      Icon: FaMapPin,
      title: 'Venue Locator',
      desc: 'Discover and book nearby stadiums, courts, and training facilities.',
      link: '/venues',
    },
    {
      Icon: FaBriefcase,
      title: 'Smart Recruitment',
      desc: 'Connect with venues and clubs looking for coaches, umpires, and staff.',
      link: '/jobs',
    },
    {
      Icon: FaStar,
      title: 'Verified Badges',
      desc: 'Build trust with skill badges and community ratings after every game or job.',
      link: '/badges',
    },
    {
      Icon: FaUsers,
      title: 'Community',
      desc: 'Connect with other sports enthusiasts, plan matches, and form teams.',
      link: '/chat',
    },
    {
      Icon: FaCalendar,
      title: 'Event Management',
      desc: 'Create and manage tournaments, training sessions, and friendly matches easily.',
      link: '/venues',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full">
        {/* Banner Image */}
        <div className="relative w-full h-[50vh] md:h-[92vh]">
          <img
            src={SkillmatchBanner}
            alt="SkillMatch Banner"
            className="w-full h-full object-cover object-center md:object-right"
          />
          {/* Overlay gradient for better text readability on mobile */}
          <div className="absolute inset-0 bg-black/30 md:bg-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div
          className="
            absolute inset-0 
            flex flex-col 
            justify-center md:justify-end    
            items-center 
            text-center 
            pb-10
          "
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-12 justify-center w-full px-4">
            <Link
              to="/games"
              className="bg-gray-900 px-8 py-3 rounded-lg hover:bg-gray-800 font-semibold text-white w-full md:w-auto max-w-xs mx-auto md:mx-0"
            >
              Find Games
            </Link>

            <Link
              to="/players"
              className="bg-blue-500 px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold text-white w-full md:w-auto max-w-xs mx-auto md:mx-0"
            >
              Find Players
            </Link>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const { Icon, title, desc, link } = feature;
              return (
                <Link
                  key={index}
                  to={link}
                  className="bg-white p-6 rounded-lg shadow-lg block cursor-pointer transition transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <Icon className="text-3xl text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p>{desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-gray-800 py-16">
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
