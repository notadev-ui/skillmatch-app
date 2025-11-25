import React, { useState, useEffect } from 'react';
import { venueService } from '../services/api';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

const VenueDetail = ({ id, onClose }) => {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchVenue = async () => {
      setLoading(true);
      try {
        const response = await venueService.getVenueById(id);
        setVenue(response.data.venue);
      } catch (error) {
        toast.error('Failed to load venue details.');
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (!id) return null;

  return (
    <Modal onClose={onClose}>
      {loading ? (
        <div>Loading venue details...</div>
      ) : !venue ? (
        <div>Venue not found.</div>
      ) : (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-4">{venue.name || 'Venue Detail'}</h1>
            <p className="mb-2"><strong>Description:</strong> {venue.description}</p>
            <p className="mb-2"><strong>Location:</strong> {venue.location?.address || 'N/A'}</p>
            <p className="mb-2"><strong>City:</strong> {venue.location?.city || 'N/A'}</p>
            <p className="mb-2"><strong>Type:</strong> {venue.type}</p>
            <p className="mb-2"><strong>Price Per Hour:</strong> ₹{venue.pricePerHour}</p>
            {/* Add more venue details here as needed */}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default VenueDetail;
