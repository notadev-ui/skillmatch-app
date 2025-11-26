import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { venueService, bookingService } from '../services/api';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import { useAuthStore } from '../store/store';

const VenueDetail = ({ id: propId, onClose }) => {
  const { user } = useAuthStore();
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = propId || routeId;
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    duration: 1,
    contactPhone: user?.phone || '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchVenue = async () => {
      setLoading(true);
      try {
        const response = await venueService.getVenueById(id);
        setVenue(response.data.venue);
        
        // Auto-show booking form if ?book=1 in URL
        if (searchParams.get('book') === '1') {
          setShowBookingForm(true);
        }
      } catch (error) {
        toast.error('Failed to load venue details.');
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id, searchParams]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateDuration = () => {
    if (!bookingData.startTime || !bookingData.endTime) return 0;
    const start = parseInt(bookingData.startTime.split(':')[0]);
    const end = parseInt(bookingData.endTime.split(':')[0]);
    return end > start ? end - start : 0;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to make a booking');
      return;
    }

    const duration = calculateDuration();
    if (duration <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await bookingService.createBooking({
        venueId: id,
        ...bookingData,
        duration
      });
      
      console.log('Booking created:', response.data);
      
      toast.success(
        <div>
          <p>Booking request submitted successfully!</p>
          <button
            onClick={() => navigate('/profile?tab=bookings')}
            className="mt-2 bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 font-semibold"
          >
            View My Bookings
          </button>
        </div>,
        { autoClose: 5000 }
      );
      
      setShowBookingForm(false);
      setBookingData({
        bookingDate: '',
        startTime: '',
        endTime: '',
        duration: 1,
        contactPhone: user?.phone || '',
        notes: ''
      });
    } catch (error) {
      console.error('Booking error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!id) return null;

  const duration = calculateDuration();
  const totalCost = venue ? venue.pricePerHour * duration : 0;

  const Content = (
    <>
      {loading ? (
        <div>Loading venue details...</div>
      ) : !venue ? (
        <div>Venue not found.</div>
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-4">
            <h1 className="text-3xl font-bold">{venue.name || 'Venue Detail'}</h1>
            
            {venue.photos && venue.photos[0] && (
              <img
                src={venue.photos[0]}
                alt={venue.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            
            <p><strong>Description:</strong> {venue.description}</p>
            <p><strong>Location:</strong> {venue.location?.address || 'N/A'}</p>
            <p><strong>City:</strong> {venue.location?.city || 'N/A'}</p>
            <p><strong>Type:</strong> {venue.type}</p>
            <p><strong>Price Per Hour:</strong> ₹{venue.pricePerHour}</p>
            <p><strong>Capacity:</strong> {venue.capacity}</p>
            
            {venue.facilities && venue.facilities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Facilities:</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.facilities.map((facility, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {venue.amenities && venue.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Amenities:</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              {!showBookingForm ? (
                <button
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                  onClick={() => setShowBookingForm(true)}
                >
                  Book Now
                </button>
              ) : (
                <div className="border-t pt-4">
                  <h2 className="text-2xl font-bold mb-4">Book This Venue</h2>
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Booking Date</label>
                        <input
                          type="date"
                          name="bookingDate"
                          value={bookingData.bookingDate}
                          onChange={handleBookingChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Contact Phone</label>
                        <input
                          type="tel"
                          name="contactPhone"
                          value={bookingData.contactPhone}
                          onChange={handleBookingChange}
                          required
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Time</label>
                        <input
                          type="time"
                          name="startTime"
                          value={bookingData.startTime}
                          onChange={handleBookingChange}
                          required
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">End Time</label>
                        <input
                          type="time"
                          name="endTime"
                          value={bookingData.endTime}
                          onChange={handleBookingChange}
                          required
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                      <textarea
                        name="notes"
                        value={bookingData.notes}
                        onChange={handleBookingChange}
                        rows="3"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Any special requirements or notes..."
                      />
                    </div>
                    
                    {duration > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-lg"><strong>Duration:</strong> {duration} hour{duration > 1 ? 's' : ''}</p>
                        <p className="text-xl font-bold text-green-600"><strong>Total Cost:</strong> ₹{totalCost}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting || duration <= 0}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingForm(false)}
                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );

  // If used as a modal (prop provided), wrap in Modal; otherwise render as page content
  return onClose ? <Modal onClose={onClose}>{Content}</Modal> : Content;
};

export default VenueDetail;
