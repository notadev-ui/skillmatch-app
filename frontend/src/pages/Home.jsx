import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaCalendar, FaBriefcase, FaStar, FaUsers, FaMapPin, FaClock, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import SkillmatchBanner from "../assets/images/skillMatch_Banner.png";
import { gameService, jobService } from '../services/api';

const Home = ({ user }) => {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState({ games: false, jobs: false });

  useEffect(() => {
    const fetchData = async () => {
      setLoading({ games: true, jobs: true });
      try {
        const [gamesRes, jobsRes] = await Promise.all([
          gameService.getAllGames({ status: 'Upcoming', limit: 6 }).catch(() => ({ data: { games: [] } })),
          jobService.getAllJobs({ status: 'Open', limit: 6 }).catch(() => ({ data: { jobs: [] } }))
        ]);
        setUpcomingGames(gamesRes.data.games || gamesRes.data || []);
        setFeaturedJobs(jobsRes.data.jobs || jobsRes.data || []);
      } finally {
        setLoading({ games: false, jobs: false });
      }
    };
    fetchData();
  }, []);

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

  <img
    src={SkillmatchBanner}
    alt="SkillMatch Banner"
    className="
      w-full 
      h-[60vh] md:h-[92vh]
      object-cover 
      object-[70%]     
      md:object-right 
    "
  />

  <div
    className="
      absolute inset-0 
      flex flex-col 
      justify-end
      items-center 
      text-center 
      pb-10
    "
  >
    <div className="flex gap-4 justify-center">
      <Link
        to="/games"
        className="bg-black px-8 py-3 rounded-lg hover:bg-gray-900 font-semibold text-white"
      >
        Find Games
      </Link>

      <Link
        to="/players"
        className="bg-blue-500 px-8 py-3 rounded-lg hover:bg-blue-600 font-semibold text-white"
      >
        Find Players
      </Link>
    </div>
  </div>
</section>

      {/* Upcoming Games */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Upcoming Games</h2>
            <Link to="/games" className="text-blue-600 hover:underline">View all</Link>
          </div>

          {loading.games ? (
            <p>Loading games...</p>
          ) : upcomingGames.length === 0 ? (
            <p className="text-gray-500">No upcoming games found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingGames.slice(0,6).map((g) => (
                <div key={g._id || g.id} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-2">{g.title || g.name}</h3>
                  <div className="space-y-1 text-gray-600 mb-3">
                    <p className="flex items-center gap-2">
                      <FaClock className="text-blue-600" />
                      {g.date ? new Date(g.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date TBA'}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-600" />
                      {g.venue?.name || g.location?.city || 'Venue TBA'}
                    </p>
                    {g.cost != null && (
                      <p className="flex items-center gap-2">
                        <FaRupeeSign className="text-green-600" />
                        {g.cost}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/games/${g._id || g.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* Featured Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Jobs</h2>
            <Link to="/jobs" className="text-blue-600 hover:underline">Browse jobs</Link>
          </div>

          {loading.jobs ? (
            <p>Loading jobs...</p>
          ) : featuredJobs.length === 0 ? (
            <p className="text-gray-500">No jobs available right now.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.slice(0,6).map((j) => (
                <div key={j._id || j.id} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-1">{j.title || j.role}</h3>
                  <p className="text-gray-600 mb-2">{j.company || j.organization || 'Company'}</p>
                  <div className="space-y-1 text-gray-600 mb-3">
                    <p className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-600" />
                      {j.location?.city || j.city || 'Remote'}
                    </p>
                    {j.salary && (
                      <p className="flex items-center gap-2">
                        <FaRupeeSign className="text-green-600" />
                        {typeof j.salary === 'object'
                          ? (() => {
                              const min = j.salary.min ?? j.salary?.range?.min;
                              const max = j.salary.max ?? j.salary?.range?.max;
                              if (min != null && max != null) {
                                return `₹${min} - ₹${max}`;
                              }
                              if (min != null) {
                                return `₹${min}`;
                              }
                              if (max != null) {
                                return `₹${max}`;
                              }
                              return `₹${j.salary.amount ?? ''}`;
                            })()
                          : `₹${j.salary}`}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/jobs/${j._id || j.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Details</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
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
