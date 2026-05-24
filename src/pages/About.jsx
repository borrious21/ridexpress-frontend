import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">About Ridexpress</h1>
        <p className="text-gray-600 mb-6">
          Ridexpress is your premier platform for hassle‑free vehicle rentals and bookings. Our mission is to provide reliable, convenient, and affordable transportation solutions.
        </p>
        <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition">
          Back to Home
        </a>
      </div>
    </div>
  );
}
