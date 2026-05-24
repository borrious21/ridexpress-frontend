import React from 'react';

export default function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-200 p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-6">
          Have questions or need support? Reach out to us and we’ll get back to you promptly.
        </p>
        <form className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows="4" placeholder="Your message..." />
          </div>
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
