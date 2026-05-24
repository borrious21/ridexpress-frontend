import React from 'react';

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-teal-200 p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to Ridexpress Landing</h1>
        <p className="text-gray-600 mb-6">
          Discover seamless vehicle rentals with our intuitive platform.
        </p>
        <a
          href="/"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}
