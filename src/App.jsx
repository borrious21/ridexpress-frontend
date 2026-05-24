import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './pages/SignupPage';
import Login from './pages/LoginPage';
import UpdateBooking from './pages/admin/UpdateBooking';
import ConfirmPayment from './pages/admin/ConfirmPayment';
import AllBookings from './pages/admin/AllBookings';
import BookingDetail from './pages/admin/BookingDetail';

function App() {
  return (
    <Router>
      <div className="font-montserrat text-gray-900 bg-gray-50 min-h-screen">
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl max-w-md w-full">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-black mb-2 text-gray-900 tracking-tight">RideXpress Admin</h1>
                <p className="text-gray-500 mb-8 font-medium">Control center for vehicle rentals and bookings.</p>
                <div className="flex flex-col gap-3">
                  <Link to="/admin/bookings" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all text-sm uppercase tracking-wider">
                    Go to Bookings Center
                  </Link>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <Link to="/admin/bookings/edit/1" className="py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold transition-all">
                      Demo Edit (#1)
                    </Link>
                    <Link to="/admin/bookings/1/confirm-payment" className="py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold transition-all">
                      Demo Pay (#1)
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/signup" className="py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold transition-all">
                      Sign Up Page
                    </Link>
                    <Link to="/login" className="py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold transition-all">
                      Log In Page
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/bookings" element={<AllBookings />} />
          <Route path="/admin/bookings/:id" element={<BookingDetail />} />
          <Route path="/admin/bookings/edit/:id" element={<UpdateBooking />} />
          <Route path="/admin/bookings/:id/confirm-payment" element={<ConfirmPayment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;