import React, { useState } from 'react';

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple fetch to backend – replace URL as needed
    try {
      await fetch(`${process.env.REACT_APP_API_URL || ''}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-100 to-orange-200 p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
        {sent ? (
          <p className="text-green-600">Reset link sent! Check your email.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="you@example.com"
            />
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
