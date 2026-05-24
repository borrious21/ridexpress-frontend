import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Car, 
  DollarSign, 
  Activity, 
  ChevronRight, 
  Eye, 
  Edit, 
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  
  // Metrics states
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    revenue: 0,
  });

  const demoBookings = [
    {
      id: '1',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+1 (555) 234-5678',
      carId: 'car-101',
      carModel: 'Tesla Model 3',
      startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
      endDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      status: 'confirmed',
      paymentStatus: 'paid',
      totalPrice: 450,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]
    },
    {
      id: '2',
      customerName: 'Alice Smith',
      customerEmail: 'alice.smith@example.com',
      customerPhone: '+1 (555) 345-6789',
      carId: 'car-102',
      carModel: 'Ford Mustang GT',
      startDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'active',
      paymentStatus: 'paid',
      totalPrice: 600,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0]
    },
    {
      id: '3',
      customerName: 'Bob Johnson',
      customerEmail: 'bob.j@example.com',
      customerPhone: '+1 (555) 456-7890',
      carId: 'car-103',
      carModel: 'Toyota RAV4 Hybrid',
      startDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      status: 'pending',
      paymentStatus: 'pending',
      totalPrice: 320,
      createdAt: new Date(Date.now()).toISOString().split('T')[0]
    },
    {
      id: '4',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.j@example.com',
      customerPhone: '+1 (555) 567-8901',
      carId: 'car-104',
      carModel: 'BMW M4 Competition',
      startDate: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
      endDate: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
      status: 'completed',
      paymentStatus: 'paid',
      totalPrice: 1200,
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0]
    },
    {
      id: '5',
      customerName: 'Michael Brown',
      customerEmail: 'michael.b@example.com',
      customerPhone: '+1 (555) 678-9012',
      carId: 'car-105',
      carModel: 'Chevrolet Corvette C8',
      startDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 8).toISOString().split('T')[0],
      status: 'cancelled',
      paymentStatus: 'refunded',
      totalPrice: 950,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0]
    }
  ];

  import { getBookings } from '../../services/api';
  // Import API service
import { getBookings } from '../../services/api';

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError('Could not load bookings from API. Using demo data.');
        setBookings(demoBookings);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

    const fetchBookings = async () => {
      try {
        const data = await getBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError('Could not load bookings from API. Using demo data.');
        setBookings(demoBookings);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/booking');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError('Could not load bookings from API. Using demo data.');
        setBookings(demoBookings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Update metrics whenever bookings list changes
  useEffect(() => {
    if (bookings.length === 0) return;

    const newMetrics = bookings.reduce((acc, curr) => {
      acc.total += 1;
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      if (curr.paymentStatus === 'paid') {
        acc.revenue += curr.totalPrice || 0;
      }
      return acc;
    }, {
      total: 0,
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      revenue: 0,
    });

    setMetrics(newMetrics);
  }, [bookings]);

  // Apply filters and searches
  useEffect(() => {
    let result = [...bookings];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.customerName.toLowerCase().includes(term) ||
        b.carModel?.toLowerCase().includes(term) ||
        b.id.toString().includes(term) ||
        b.customerEmail?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      result = result.filter(b => b.paymentStatus === paymentFilter);
    }

    setFilteredBookings(result);
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'active':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentBadgeClass = (pStatus) => {
    switch (pStatus) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-montserrat">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <ChevronRight className="w-5 h-5 mr-1 rotate-180" />
            Back to Dashboard
          </Link>
          <div className="font-bold text-xl tracking-tight text-gray-900">
            Admin <span className="text-blue-600">Panel</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bookings Command Center</h1>
            <p className="mt-1 text-gray-500">Overview, lookup, status tracking, and financials for all bookings.</p>
          </div>
        </div>

        {/* Error / Warning Alert for Demo mode */}
        {error && (
          <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 rounded-xl flex items-start shadow-sm">
            <AlertCircle className="w-5 h-5 mr-3 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Offline / Demonstration Mode</p>
              <p className="text-sm text-amber-700">{error}</p>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center transition-all hover:shadow-md hover:scale-[1.02]">
            <div className="p-4 rounded-xl bg-blue-50 text-blue-600 mr-4">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{metrics.total}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center transition-all hover:shadow-md hover:scale-[1.02]">
            <div className="p-4 rounded-xl bg-amber-50 text-amber-600 mr-4">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Approval</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{metrics.pending}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center transition-all hover:shadow-md hover:scale-[1.02]">
            <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600 mr-4">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Rentals</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{metrics.active}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center transition-all hover:shadow-md hover:scale-[1.02]">
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 mr-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-2xl font-black text-gray-900 mt-1">${metrics.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Filter and Search Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by customer, car, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">Booking Status:</span>
              </div>
              <div className="flex rounded-xl bg-gray-100 p-1">
                {['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      statusFilter === status 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table / Cards */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No bookings found</h3>
              <p className="text-gray-500 mt-1">Try modifying your search or filter options.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-500">Car / Vehicle</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-500">Rental Duration</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-500">Amount</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-500">Payment</th>
                      <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-gray-900">#{b.id}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 text-sm">
                              {b.customerName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{b.customerName}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{b.customerEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <Car className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="font-semibold text-gray-900 text-sm">{b.carModel || 'Vehicle Info'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900 font-semibold">{b.startDate} to {b.endDate}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {Math.ceil((new Date(b.endDate) - new Date(b.startDate)) / (1000 * 60 * 60 * 24))} Days
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-black text-gray-950 text-sm">${b.totalPrice}</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(b.status)}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPaymentBadgeClass(b.paymentStatus)}`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link 
                              to={`/admin/bookings/${b.id}`} 
                              title="View Details"
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </Link>
                            <Link 
                              to={`/admin/bookings/edit/${b.id}`} 
                              title="Edit Booking"
                              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <Edit className="w-4.5 h-4.5" />
                            </Link>
                            {b.paymentStatus !== 'paid' && b.status !== 'cancelled' && (
                              <Link 
                                to={`/admin/bookings/${b.id}/confirm-payment`} 
                                title="Confirm Payment"
                                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                              >
                                <CreditCard className="w-4.5 h-4.5" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Grid View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase">Booking ID</span>
                        <h4 className="text-lg font-bold text-gray-900">#{b.id}</h4>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(b.status)}`}>
                          {b.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPaymentBadgeClass(b.paymentStatus)}`}>
                          {b.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer</span>
                        <span className="text-sm font-semibold text-gray-900">{b.customerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Car Model</span>
                        <span className="text-sm font-semibold text-gray-900">{b.carModel}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Duration</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {Math.ceil((new Date(b.endDate) - new Date(b.startDate)) / (1000 * 60 * 60 * 24))} Days
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Cost</span>
                        <span className="text-sm font-black text-gray-900">${b.totalPrice}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-gray-500">
                        Dates: {b.startDate} to {b.endDate}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/admin/bookings/${b.id}`} 
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                        >
                          Details
                        </Link>
                        <Link 
                          to={`/admin/bookings/edit/${b.id}`} 
                          className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
                        >
                          Edit
                        </Link>
                        {b.paymentStatus !== 'paid' && b.status !== 'cancelled' && (
                          <Link 
                            to={`/admin/bookings/${b.id}/confirm-payment`} 
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                          >
                            Pay
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
