import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import skillmatchLogo from "../assets/images/skillmatch_Logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-gray-100 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* FIXED GRID */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr] gap-8">

          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={skillmatchLogo}
                alt="SkillMatch"
                className="h-10 w-10 rounded"
              />
              <span className="text-2xl font-semibold">SkillMatch</span>
            </div>

            <p className="text-sm text-slate-300">
              A community-driven platform that connects players, coaches and venues
              for easier event planning, staffing and discovery.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                 aria-label="facebook"
                 className="bg-slate-700 hover:bg-blue-700 p-2 rounded-md text-white">
                <FaFacebookF />
              </a>

              <a href="https://twitter.com" target="_blank" rel="noreferrer"
                 aria-label="twitter"
                 className="bg-slate-700 hover:bg-sky-500 p-2 rounded-md text-white">
                <FaTwitter />
              </a>

              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                 aria-label="instagram"
                 className="bg-slate-700 hover:bg-pink-500 p-2 rounded-md text-white">
                <FaInstagram />
              </a>

              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                 aria-label="linkedin"
                 className="bg-slate-700 hover:bg-blue-600 p-2 rounded-md text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="flex flex-col gap-2 text-slate-200">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/players" className="hover:text-white">Players</Link></li>
              <li><Link to="/venues" className="hover:text-white">Venues</Link></li>
              <li><Link to="/jobs" className="hover:text-white">Jobs</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="flex flex-col gap-2 text-slate-200">
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-semibold mb-3">Stay updated</h4>
            <p className="text-sm text-slate-300 mb-3">
              Subscribe for updates, events and opportunities.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                aria-label="Email for newsletter"
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-md bg-slate-700 placeholder-slate-300 text-white focus:outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          <div className="max-w-3xl mx-auto">
            © {new Date().getFullYear()} SkillMatch. All rights reserved. — Built with community in mind.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
