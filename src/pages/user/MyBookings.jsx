import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, Car, MapPin, Calendar, CreditCard,
  Clock, CheckCircle, XCircle, AlertCircle, PackageOpen,
} from 'lucide-react';

const STATUS_META = {
  PENDING: {
    label: 'Pending',
    icon: <Clock className="w-3.5 h-3.5" />,
    cls: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  CONFIRMED: {
    label: 'Confirmed',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    cls: 'bg-green-50 text-green-700 border-green-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: <XCircle className="w-3.5 h-3.5" />,
    cls: 'bg-red-50 text-red-700 border-red-200',
  },
  COMPLETED: {
    label: 'Completed',
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    cls: 'bg-blue-50 text-blue-700 border-blue-200',
  },
};

const PAYMENT_META = {
  unpaid:   { label: 'Unpaid',   cls: 'bg-red-50 text-red-600 border-red-200' },
  paid:     { label: 'Paid',     cls: 'bg-green-50 text-green-600 border-green-200' },
  refunded: { label: 'Refunded', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
};

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NP', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function nights(start, end) {
  const diff = new Date(end) - new Date(start);
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.PENDING;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${m.cls}`}>
      {m.icon}{m.label}
    </span>
  );
}

function PaymentBadge({ status }) {
  const m = PAYMENT_META[status] || PAYMENT_META.unpaid;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${m.cls}`}>
      <CreditCard className="w-3 h-3" />{m.label}
    </span>
  );
}

function BookingCard({ booking }) {
  const vehicle = booking.bookingItems?.[0]?.vehicle;
  const n = nights(booking.startDate, booking.endDate);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">

      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Booking ID</p>
          <p className="text-sm font-bold text-gray-700 font-mono">#{booking._id?.slice(-8).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-2">
          <PaymentBadge status={booking.paymentStatus} />
          <StatusBadge status={booking.status} />
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 space-y-4">

        {/* Vehicle info */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate">
              {vehicle?.name || vehicle?.model || 'Vehicle'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {vehicle?.type || 'Car'} &middot; {vehicle?.brand || '—'}
            </p>
          </div>
          <div className="ml-auto text-right flex-shrink-0">
            <p className="text-xl font-extrabold text-blue-600">Rs. {booking.totalPrice?.toLocaleString()}</p>
            <p className="text-xs text-gray-400">{n} {n === 1 ? 'day' : 'days'}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-100" />

        {/* Dates & locations */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Pick-up</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-gray-800">{fmt(booking.startDate)}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-500 truncate">{booking.pickupLocation}</p>
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Drop-off</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <p className="text-sm font-semibold text-gray-800">{fmt(booking.endDate)}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-500 truncate">{booking.dropLocation}</p>
            </div>
          </div>
        </div>

        {/* Pay now button — only for pending + unpaid */}
        {booking.status === 'PENDING' && booking.paymentStatus === 'unpaid' && (
          <Link
            to={`/booking/${booking._id}/payment`}
            className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <CreditCard className="w-4 h-4" />
            Pay Now
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/booking/user', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Could not load your bookings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* ── Top bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Home
          </Link>
          <div className="font-bold text-xl tracking-tight text-gray-900">
            Ride<span className="text-blue-600">Xpress</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* ── Page header ── */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-blue-600 p-8 text-white text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 border-4 border-blue-400 shadow-inner">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2">My Bookings</h1>
            <p className="text-blue-100 opacity-90">Track and manage all your rentals</p>
          </div>
        </div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
            <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            <p className="text-sm">Loading your bookings…</p>
          </div>
        )}

        {/* ── Error ── */}
        {!isLoading && error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <PackageOpen className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-lg">No bookings yet</p>
              <p className="text-gray-400 text-sm mt-1">When you book a vehicle, it'll show up here.</p>
            </div>
            <Link
              to="/vehicles"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Car className="w-4 h-4" />
              Browse Vehicles
            </Link>
          </div>
        )}

        {/* ── Booking list ── */}
        {!isLoading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 pb-2 border-b border-gray-200">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
            {bookings.map(b => (
              <BookingCard key={b._id} booking={b} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}