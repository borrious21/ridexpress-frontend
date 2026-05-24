/* src/services/api.js */
// Vite exposes env variables prefixed with VITE_ via import.meta.env
const API_BASE = import.meta.env.VITE_API_BASE || '';

/** Fetch all bookings */
export const getBookings = async () => {
  const response = await fetch(`${API_BASE}/api/booking`);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  return response.json();
};

/** Fetch a single booking by ID */
export const getBooking = async (id) => {
  const response = await fetch(`${API_BASE}/api/booking/${id}`);
  if (!response.ok) throw new Error(`Failed to fetch booking ${id}`);
  return response.json();
};

/** Update a booking */
export const updateBooking = async (id, data) => {
  const response = await fetch(`${API_BASE}/api/booking/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(`Failed to update booking ${id}`);
  return response.json();
};

/** Delete a booking */
export const deleteBooking = async (id) => {
  const response = await fetch(`${API_BASE}/api/booking/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Failed to delete booking ${id}`);
  return response.json();
};
