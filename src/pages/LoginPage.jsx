import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, LogIn, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/auth';

function validate(form) {
  const errors = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.password || form.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setApiError('');
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setApiError(data.message || 'Invalid email or password.'); setLoading(false); return; }
      setSuccess(true);
      setTimeout(() => navigate('/'), 1800);
    } catch {
      setApiError('Unable to reach the server. Please check your connection.');
      setLoading(false);
    }
  };

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

      {/* ── Card ── */}
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Header band */}
          <div className="bg-blue-600 p-8 text-white text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 border-4 border-blue-400 shadow-inner">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Welcome back</h1>
            <p className="text-blue-100 opacity-90">
              Don't have an account?{' '}
              <Link to="/signup" className="underline font-semibold hover:text-white transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {/* Form body */}
          <div className="px-6 py-8 sm:p-10 space-y-6">

            {apiError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{apiError}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm font-medium">Logged in! Redirecting…</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-1.5 text-gray-400" />
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set('email')}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border ${
                      errors.email
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-200'
                    } focus:ring-2 focus:bg-white transition-all outline-none text-sm`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4 mr-1.5 text-gray-400" />
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-600 font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={set('password')}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border ${
                      errors.password
                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-200'
                    } focus:ring-2 focus:bg-white transition-all outline-none text-sm`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass(v => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full flex items-center justify-center py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Signing in…
                    </>
                  ) : success ? (
                    <><CheckCircle className="w-6 h-6 mr-2" />Signed in!</>
                  ) : (
                    <><LogIn className="w-6 h-6 mr-2" />Sign In</>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
