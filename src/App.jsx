import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Signup from "./pages/SignupPage";
import Login from "./pages/LoginPage";

import MyBookings from "./pages/MyBookings";
import UpdateBooking from "./pages/admin/UpdateBooking";
import ConfirmPayment from "./pages/admin/ConfirmPayment";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllBookings from "./pages/admin/AllBookingsPage";
import BookingDetail from "./pages/admin/BookingDetailPage";

function App() {
  return (
    <Router>
      <div className="font-montserrat text-gray-900 bg-gray-50 min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-bold mb-4">
                  RideXpress Dashboard
                </h1>
                <p className="text-gray-600 mb-8">
                  Admin routing setup successfully.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link to="/admin/bookings/edit/1" className="text-blue-600 hover:underline">
                    Demo Edit Booking
                  </Link>
                  <Link to="/admin/bookings/1/confirm-payment" className="text-blue-600 hover:underline">
                    Demo Confirm Payment
                  </Link>
                  <Link to="/signup" className="text-blue-600 hover:underline">
                    Signup Page
                  </Link>
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Login Page
                  </Link>
                  <Link to="/admin" className="text-blue-600 hover:underline">
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/bookings" className="text-blue-600 hover:underline">
                    All Bookings
                  </Link>
                </div>
              </div>
            }
          />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AllBookings />} />
          <Route path="/admin/bookings/edit/:id" element={<UpdateBooking />} />
          <Route path="/admin/bookings/:id" element={<BookingDetail />} />
          <Route path="/admin/bookings/:id/confirm-payment" element={<ConfirmPayment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;