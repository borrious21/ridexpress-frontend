import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  Car, 
  DollarSign, 
  Activity, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit,
  CreditCard,
  AlertTriangle,
  Info
} from 'lucide-react';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const demoBookings = {
    '1': {
      id: '1',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+1 (555) 234-5678',
      customerAddress: '123 Main St, Seattle, WA 98101',
      carId: 'car-101',
      carModel: 'Tesla Model 3',
      carBrand: 'Tesla',
      carYear: '2023',
      carColor: 'Midnight Silver Metallic',
      dailyRate: 150,
      startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      status: 'confirmed',
      paymentStatus: 'paid',
      totalPrice: 450,
      pickupLocation: 'Seattle-Tacoma International Airport (SEA)',
      dropoffLocation: 'Downtown Seattle Office',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]
    },
    '2': {
      id: '2',
      customerName: 'Alice Smith',
      customerEmail: 'alice.smith@example.com',
      customerPhone: '+1 (555) 345-6789',
      customerAddress: '456 Oak Ave, Portland, OR 97201',
      carId: 'car-102',
      carModel: 'Ford Mustang GT',
      carBrand: 'Ford',
      carYear: '2022',
      carColor: 'Shadow Black',
      dailyRate: 200,
      startDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'active',
      paymentStatus: 'paid',
      totalPrice: 600,
      pickupLocation: 'Portland International Airport (PDX)',
      dropoffLocation: 'Portland International Airport (PDX)',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0]
    },
    '3': {
      id: '3',
      customerName: 'Bob Johnson',
      customerEmail: 'bob.j@example.com',
      customerPhone: '+1 (555) 456-7890',
      customerAddress: '789 Pine Rd, San Francisco, CA 94101',
      carId: 'car-103',
      carModel: 'Toyota RAV4 Hybrid',
      carBrand: 'Toyota',
      carYear: '2021',
      carColor: 'Magnetic Gray Metallic',
      dailyRate: 80,
      startDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      status: 'pending',
      paymentStatus: 'pending',
      totalPrice: 320,
      pickupLocation: 'San Francisco International Airport (SFO)',
      dropoffLocation: 'San Jose Local Hub',
      createdAt: new Date(Date.now()).toISOString().split('T')[0]
    },
    '4': {
      id: '4',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.j@example.com',
      customerPhone: '+1 (555) 567-8901',
      customerAddress: '808 Maple Dr, Los Angeles, CA 90001',
      carId: 'car-104',
      carModel: 'BMW M4 Competition',
      carBrand: 'BMW',
      carYear: '2023',
      carColor: 'Sao Paulo Yellow',
      dailyRate: 400,
      startDate: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
      endDate: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      status: 'completed',
      paymentStatus: 'paid',
      totalPrice: 1200,
      pickupLocation: 'Los Angeles International Airport (LAX)',
      dropoffLocation: 'Los Angeles International Airport (LAX)',
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0]
    },
    '5': {
      id: '5',
      customerName: 'Michael Brown',
      customerEmail: 'michael.b@example.com',
      customerPhone: '+1 (555) 678-9012',
      customerAddress: '555 Birch Ln, Las Vegas, NV 89101',
      carId: 'car-105',
      carModel: 'Chevrolet Corvette C8',
      carBrand: 'Chevrolet',
      carYear: '2022',
      carColor: 'Torch Red',
      dailyRate: 316,
      startDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0],
      status: 'cancelled',
      paymentStatus: 'refunded',
      totalPrice: 950,
      pickupLocation: 'Harry Reid International Airport (LAS)',
      dropoffLocation: 'Harry Reid International Airport (LAS)',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0]
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/booking/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        console.error(err);
        setError('Could not load booking details from API. Using local demo details.');
        // Fall back to matching demo booking or create a template
        const match = demoBookings[id.toString()] || {
          id: id,
          customerName: 'Unknown Customer',
          customerEmail: 'customer@example.com',
          customerPhone: '+1 (555) 000-0000',
          customerAddress: 'Not Available',
          carId: 'car-unknown',
          carModel: 'Standard Sedan',
          carBrand: 'Standard',
          carYear: '2022',
          carColor: 'Silver',
          dailyRate: 100,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          status: 'pending',
          paymentStatus: 'pending',
          totalPrice: 300,
          pickupLocation: 'Main Terminal',
          dropoffLocation: 'Main Terminal',
          createdAt: new Date().toISOString().split('T')[0]
        };
        setBooking(match);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setIsUpdating(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/booking/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update booking status');
      
      setBooking(prev => ({ ...prev, status: newStatus }));
      setSuccess(`Booking status successfully updated to ${newStatus}!`);
    } catch (err) {
      console.error(err);
      // Fallback local status change
      setBooking(prev => ({ ...prev, status: newStatus }));
      setSuccess(`[Demo Mode] Booking status updated locally to "${newStatus}"`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this booking? This action is permanent.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/booking/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete booking');
      
      navigate('/admin/bookings');
    } catch (err) {
      console.error(err);
      // Fallback local deletion
      alert('[Demo Mode] Booking deleted locally.');
      navigate('/admin/bookings');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-3.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded-full uppercase tracking-wider">Pending</span>;
      case 'confirmed':
        return <span className="px-3.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full uppercase tracking-wider">Confirmed</span>;
      case 'active':
        return <span className="px-3.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full uppercase tracking-wider">Active</span>;
      case 'completed':
        return <span className="px-3.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full uppercase tracking-wider">Completed</span>;
      case 'cancelled':
        return <span className="px-3.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-full uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="px-3.5 py-1 text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200 rounded-full uppercase tracking-wider">{status}</span>;
    }
  };

  const getPaymentBadge = (pStatus) => {
    switch (pStatus) {
      case 'paid':
        return <span className="px-3 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full">Paid</span>;
      case 'pending':
        return <span className="px-3 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 rounded-full">Unpaid</span>;
      case 'refunded':
        return <span className="px-3 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200 rounded-full">Refunded</span>;
      default:
        return <span className="px-3 py-0.5 text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 rounded-full">Failed</span>;
    }
  };

  const calculateDays = () => {
    if (!booking) return 0;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const durationDays = calculateDays();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-montserrat">
      {/* Top Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/admin/bookings" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Bookings
          </Link>
          <div className="font-bold text-xl tracking-tight text-gray-900">
            Admin <span className="text-blue-600">Panel</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 rounded-xl flex items-start shadow-sm">
            <Info className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Offline / Demonstration Mode</p>
              <p className="text-sm text-amber-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-xl flex items-start shadow-sm">
            <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{success}</p>
          </div>
        )}

        {/* Booking Summary Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 hidden sm:block">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Booking #{booking.id}</h1>
                {getStatusBadge(booking.status)}
                {getPaymentBadge(booking.paymentStatus)}
              </div>
              <p className="mt-1.5 text-sm text-gray-500 font-medium">
                Created on {booking.createdAt} &bull; Booking Reference: DX-{booking.id * 1234 + 9876}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link 
              to={`/admin/bookings/edit/${booking.id}`} 
              className="flex items-center px-4.5 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm shadow-inner"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit details
            </Link>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center px-4.5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold hover:bg-rose-100 hover:text-rose-700 transition-colors text-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        {/* 2 Column Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Rental Information */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                Rental Schedule & Specifications
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-gray-100 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Pick-up Info</span>
                  <p className="text-sm font-black text-gray-800">{booking.startDate}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {booking.pickupLocation}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Drop-off Info</span>
                  <p className="text-sm font-black text-gray-800">{booking.endDate}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    {booking.dropoffLocation}
                  </p>
                </div>
              </div>

              {/* Vehicle specifications */}
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-full sm:w-48 h-32 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 shadow-inner p-4">
                  <div className="text-center text-gray-400">
                    <Car className="w-12 h-12 mx-auto mb-1 text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{booking.carBrand} Model</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Rented Vehicle</span>
                    <h4 className="text-xl font-bold text-gray-900">{booking.carModel}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Year</span>
                      <span className="text-gray-900 font-bold">{booking.carYear}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Color</span>
                      <span className="text-gray-900 font-bold">{booking.carColor}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Daily Rate</span>
                      <span className="text-blue-600 font-black">${booking.dailyRate}/day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details / Invoice Breakdown */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-5 h-5 text-emerald-500 mr-2" />
                Invoice Breakdown
              </h3>
              
              <div className="space-y-4 font-semibold text-gray-600">
                <div className="flex justify-between items-center text-sm">
                  <span>Rental Subtotal ({durationDays} days &times; ${booking.dailyRate})</span>
                  <span className="text-gray-900">${booking.dailyRate * durationDays}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Taxes & Service Fees (10%)</span>
                  <span className="text-gray-900">${((booking.dailyRate * durationDays) * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Promotional Discount</span>
                  <span className="text-rose-600">-$0.00</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-lg font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-blue-600 text-2xl">${booking.totalPrice}</span>
                </div>
              </div>
              
              {booking.paymentStatus !== 'paid' && (
                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
                  <div className="flex items-center text-emerald-800 font-semibold text-sm">
                    <AlertTriangle className="w-5 h-5 mr-3 text-emerald-600 flex-shrink-0" />
                    This invoice is currently outstanding.
                  </div>
                  <Link 
                    to={`/admin/bookings/${booking.id}/confirm-payment`} 
                    className="flex items-center px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl shadow-md hover:bg-emerald-600 transition-all transform active:scale-95 text-xs uppercase tracking-wider"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Record Payment
                  </Link>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Booking Timeline</h3>
              <div className="space-y-6">
                {[
                  { title: 'Booking Submitted', date: booking.createdAt, desc: 'Customer selected vehicle and submitted request.', done: true },
                  { title: 'Booking Approved', date: booking.status !== 'pending' && booking.status !== 'cancelled' ? 'Approved' : null, desc: 'Vehicle reservation locked and approved by admin.', done: booking.status !== 'pending' && booking.status !== 'cancelled' },
                  { title: 'Payment Confirmed', date: booking.paymentStatus === 'paid' ? 'Completed' : null, desc: 'Full transaction amount settled.', done: booking.paymentStatus === 'paid' },
                  { title: 'Rental Active', date: booking.status === 'active' || booking.status === 'completed' ? 'Active' : null, desc: 'Customer has picked up the vehicle keys.', done: booking.status === 'active' || booking.status === 'completed' },
                  { title: 'Booking Concluded', date: booking.status === 'completed' ? 'Completed' : null, desc: 'Vehicle returned and inspected. Rental concluded.', done: booking.status === 'completed' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="flex flex-col items-center mr-4 mt-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        item.done 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-300'
                      }`}>
                        {item.done && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                      {idx < 4 && <div className={`w-0.5 h-12 ${item.done ? 'bg-blue-300' : 'bg-gray-200'}`} />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${item.done ? 'text-gray-900' : 'text-gray-400'}`}>{item.title}</h4>
                      {item.date && <p className="text-[10px] text-blue-600 font-bold mt-0.5">{item.date}</p>}
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer & Actions Column */}
          <div className="space-y-8">
            {/* Customer Details */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-center sm:justify-start">
                <User className="w-5 h-5 text-indigo-500 mr-2" />
                Customer Account
              </h3>
              
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-2xl mb-4 border border-blue-200 shadow-inner">
                  {booking.customerName.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="text-xl font-bold text-gray-900">{booking.customerName}</h4>
                <div className="flex items-center text-emerald-600 font-bold text-xs mt-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verified Driver
                </div>
              </div>
              
              <div className="space-y-4 text-xs font-semibold text-gray-600 border-t border-gray-50 pt-4">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-800 break-all">{booking.customerEmail}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-800">{booking.customerPhone}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800 text-left">{booking.customerAddress}</span>
                </div>
              </div>
            </div>

            {/* Lifecycle Action Panel */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <Activity className="w-5 h-5 text-amber-500 mr-2" />
                Administrative Actions
              </h3>
              
              <div className="space-y-3.5">
                {booking.status === 'pending' && (
                  <button 
                    onClick={() => updateStatus('confirmed')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all transform active:scale-95 text-sm"
                  >
                    <CheckCircle className="w-4.5 h-4.5 mr-2" />
                    Approve Reservation
                  </button>
                )}

                {booking.status === 'confirmed' && (
                  <button 
                    onClick={() => updateStatus('active')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all transform active:scale-95 text-sm"
                  >
                    <Car className="w-4.5 h-4.5 mr-2" />
                    Activate Rental
                  </button>
                )}

                {booking.status === 'active' && (
                  <button 
                    onClick={() => updateStatus('completed')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all transform active:scale-95 text-sm"
                  >
                    <CheckCircle className="w-4.5 h-4.5 mr-2" />
                    Mark as Completed
                  </button>
                )}

                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                  <button 
                    onClick={() => updateStatus('cancelled')}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center py-3 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 font-bold rounded-xl transition-all transform active:scale-95 text-sm"
                  >
                    <XCircle className="w-4.5 h-4.5 mr-2" />
                    Cancel Booking
                  </button>
                )}

                {booking.status === 'cancelled' && (
                  <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-100 text-xs font-semibold flex items-start">
                    <AlertTriangle className="w-4.5 h-4.5 mr-2 text-rose-600 flex-shrink-0 mt-0.5" />
                    This booking has been cancelled and cannot be activated.
                  </div>
                )}

                {booking.status === 'completed' && (
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-xs font-semibold flex items-start">
                    <CheckCircle className="w-4.5 h-4.5 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                    This booking is fully completed and archived.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
