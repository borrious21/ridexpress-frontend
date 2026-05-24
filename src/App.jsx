import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/SignupPage";
import Login from "./pages/LoginPage";
import UpdateBooking from "./pages/admin/UpdateBooking";
import ConfirmPayment from "./pages/admin/ConfirmPayment";
import AdminDashboard from "./pages/admin/AdminDashboard";

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

                <div className="flex gap-4">
                  <Link
                    to="/admin/bookings/edit/1"
                    className="text-blue-600 hover:underline"
                  >
                    Demo Edit Booking
                  </Link>

                  <Link
                    to="/admin/bookings/1/confirm-payment"
                    className="text-blue-600 hover:underline"
                  >
                    Demo Confirm Payment
                  </Link>

                  <Link to="/signup" className="text-blue-600 hover:underline">
                    Signup Page
                  </Link>

                  <Link to="/login" className="text-blue-600 hover:underline">
                    Login Page
                  </Link>
                </div>
              </div>
            }
          />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin/bookings/edit/:id" element={<UpdateBooking />} />
          <Route
            path="/admin/bookings/:id/confirm-payment"
            element={<ConfirmPayment />}
          />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
