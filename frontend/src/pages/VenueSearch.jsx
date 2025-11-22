import React, { useState, useEffect } from 'react';
import { venueService } from '../services/api';
import { FaMapPin, FaStar, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import VenueDetail from './VenueDetail';

import { useAuthStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

const VenueSearch = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      toast.error('Please login to access venues');
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    city: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Event details modal state
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    if (user) fetchVenues();
  }, [filters, user]);

  const fetchVenues = async () => {
    setIsLoading(true);
    try {
      const response = await venueService.getAllVenues(filters);
      setVenues(response.data.venues);
    } catch (error) {
      toast.error('Failed to fetch venues');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const closeEventModal = () => {
    setSelectedEventId(null);
    setIsEventModalOpen(false);
  };

  const openEventModal = (eventId) => {
    setSelectedEventId(eventId);
    setIsEventModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Find Venues</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Venue Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Stadium">Stadium</option>
                <option value="Court">Court</option>
                <option value="Field">Field</option>
                <option value="Gym">Gym</option>
                <option value="Pool">Pool</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="City name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Venues Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading venues...</div>
        ) : venues.length === 0 ? (
          <div className="text-center py-12">No venues found</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <div key={venue._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                {venue.photos && venue.photos[0] && (
                  <img
                    src={venue.photos[0]}
                    alt={venue.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{venue.name}</h3>

                  <p className="text-gray-600 mb-4 text-sm">{venue.description}</p>

                  <div className="space-y-2 mb-4">
                    <p className="flex items-center gap-2">
                      <FaMapPin className="text-blue-600" />
                      {venue.location?.address}
                    </p>

                    <p className="flex items-center gap-2">
                      <FaStar className="text-yellow-500" />
                      {venue.ratings.average.toFixed(1)} ({venue.ratings.count} reviews)
                    </p>

                    <p className="flex items-center gap-2">
                      <FaClock className="text-green-600" />
                      ${venue.pricePerHour}/hour
                    </p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Amenities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {venue.amenities?.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => openEventModal(venue._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {isEventModalOpen && (
          <VenueDetail id={selectedEventId} onClose={closeEventModal} />
        )}
      </div>
    </div>
  );
};

export default VenueSearch;

