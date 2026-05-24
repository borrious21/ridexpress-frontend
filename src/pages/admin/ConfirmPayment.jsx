import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle, CreditCard, DollarSign, FileText } from 'lucide-react';

const ConfirmPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [payment, setPayment] = useState({
    amount: 0,
    paymentMethod: 'credit_card',
    transactionId: '',
  });
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/booking/${id}`);
        if (!response.ok) throw new Error('Failed to fetch booking details');
        const data = await response.json();
        setBookingDetails(data);
        setPayment(prev => ({ ...prev, amount: data.totalPrice || 0 }));
      } catch (err) {
        console.error(err);
        setError('Could not load booking details from API. Using demo data.');
        const demoPrice = 450;
        setBookingDetails({
          customerName: 'John Doe',
          carId: 'car-123',
          totalPrice: demoPrice,
          status: 'pending'
        });
        setPayment(prev => ({ ...prev, amount: demoPrice }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsConfirming(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/booking/${id}/payment/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment),
      });
      
      if (!response.ok) throw new Error('Failed to confirm payment');
      
      setSuccess('Payment confirmed successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || 'An error occurred while confirming payment.');
    } finally {
      setIsConfirming(false);
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>
          <div className="font-bold text-xl tracking-tight text-gray-900">
            Admin <span className="text-blue-600">Panel</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 border-4 border-blue-400 shadow-inner">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Confirm Payment</h1>
            <p className="text-blue-100 opacity-90">Booking #{id}</p>
          </div>

          <div className="px-6 py-8 sm:p-10">
            {bookingDetails && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="font-bold text-gray-900">{bookingDetails.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Due</p>
                  <p className="font-black text-2xl text-blue-600">${bookingDetails.totalPrice}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleConfirm} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  Amount Received
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-medium">$</span>
                  </div>
                  <input type="number" name="amount" value={payment.amount} onChange={handleChange} required min="0" step="0.01" className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white text-lg font-semibold" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                  Payment Method
                </label>
                <select name="paymentMethod" value={payment.paymentMethod} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white appearance-none font-medium text-gray-700">
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 mr-2 text-gray-400" />
                  Transaction ID / Receipt Number
                </label>
                <input type="text" name="transactionId" value={payment.transactionId} onChange={handleChange} placeholder="e.g. TXN-987654321" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white" />
              </div>

              <div className="pt-8">
                <button type="submit" disabled={isConfirming} className="w-full flex items-center justify-center py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 hover:shadow-green-300 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  {isConfirming ? 'Confirming...' : 'Mark as Paid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPayment;
