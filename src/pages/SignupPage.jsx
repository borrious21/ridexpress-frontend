import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, User, Mail, Phone,
  Home, MapPin, Map, Lock, Eye, EyeOff,
  CheckCircle, UserPlus, AlertCircle,
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/auth';

const PROVINCES = [
  'Koshi', 'Madhesh', 'Bagmati', 'Gandaki',
  'Lumbini', 'Karnali', 'Sudurpashchim',
];

function StrengthMeter({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const meta = [
    { label: 'Weak',   color: 'bg-red-500' },
    { label: 'Fair',   color: 'bg-yellow-500' },
    { label: 'Good',   color: 'bg-blue-500' },
    { label: 'Strong', color: 'bg-green-500' },
  ];
  const { label, color } = meta[score - 1] || { label: '', color: '' };

  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {label && (
        <p className={`text-xs font-medium ${
          score === 1 ? 'text-red-500'
          : score === 2 ? 'text-yellow-500'
          : score === 3 ? 'text-blue-500'
          : 'text-green-500'
        }`}>{label}</p>
      )}
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />{error}
        </p>
      )}
    </div>
  );
}

function IconInput({ icon: Icon, error, className = '', ...props }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <input
        {...props}
        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border ${
          error
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-200'
        } focus:ring-2 focus:bg-white transition-all outline-none text-sm ${className}`}
      />
    </div>
  );
}

function validate(f) {
  const e = {};
  if (!f.name || f.name.length < 2)         e.name            = 'Full name is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email   = 'Enter a valid email address.';
  if (!/^[0-9]{10}$/.test(f.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit phone number.';
  if (!f.street || f.street.length < 2)     e.street          = 'Street is required.';
  if (!f.city   || f.city.length   < 2)     e.city            = 'City is required.';
  if (!f.province)                           e.province        = 'Province is required.';
  if (!f.password || f.password.length < 8) e.password        = 'Password must be at least 8 characters.';
  if (f.password !== f.confirmPassword)      e.confirmPassword = 'Passwords do not match.';
  if (!f.terms)                              e.terms           = 'You must accept the terms to continue.';
  return e;
}

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    street: '', city: '', province: '',
    password: '', confirmPassword: '',
    terms: false,
  });
  const [errors,      setErrors]      = useState({});
  const [apiError,    setApiError]    = useState('');
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = key => e =>
    setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setApiError('');
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name:            form.name,
          email:           form.email,
          phone:           form.phone.replace(/\D/g, ''),
          password:        form.password,
          confirmPassword: form.confirmPassword,
          address: {
            street:  form.street,
            city:    form.city,
            province: form.province,
            country: 'Nepal',
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) { setApiError(data.message || 'Something went wrong.'); setLoading(false); return; }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Card header band */}
          <div className="bg-blue-600 p-8 text-white text-center">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 border-4 border-blue-400 shadow-inner">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Create Account</h1>
            <p className="text-blue-100 opacity-90">
              Already have an account?{' '}
              <Link to="/login" className="underline font-semibold hover:text-white transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Form body */}
          <div className="px-6 py-8 sm:p-10 space-y-6">

            {/* API error */}
            {apiError && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{apiError}</p>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm font-medium">Account created! Redirecting…</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* ── Personal info ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">
                  Personal Information
                </p>
                <div className="space-y-4">
                  <Field label={<><User className="w-4 h-4 mr-1.5 text-gray-400" />Full Name</>} error={errors.name}>
                    <IconInput
                      icon={User} type="text" placeholder="Aayush Sharma"
                      value={form.name} onChange={set('name')} error={errors.name}
                    />
                  </Field>

                  <Field label={<><Mail className="w-4 h-4 mr-1.5 text-gray-400" />Email Address</>} error={errors.email}>
                    <IconInput
                      icon={Mail} type="email" placeholder="you@example.com"
                      value={form.email} onChange={set('email')} error={errors.email}
                    />
                  </Field>

                  <Field label={<><Phone className="w-4 h-4 mr-1.5 text-gray-400" />Phone Number</>} error={errors.phone}>
                    <IconInput
                      icon={Phone} type="tel" placeholder="98XXXXXXXX"
                      value={form.phone} onChange={set('phone')} error={errors.phone}
                    />
                  </Field>
                </div>
              </div>

              {/* ── Address ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">
                  Address
                </p>
                <div className="space-y-4">
                  <Field label={<><Home className="w-4 h-4 mr-1.5 text-gray-400" />Street</>} error={errors.street}>
                    <IconInput
                      icon={Home} placeholder="e.g. Putali Sadak"
                      value={form.street} onChange={set('street')} error={errors.street}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label={<><MapPin className="w-4 h-4 mr-1.5 text-gray-400" />City</>} error={errors.city}>
                      <IconInput
                        icon={MapPin} placeholder="e.g. Dharan"
                        value={form.city} onChange={set('city')} error={errors.city}
                      />
                    </Field>

                    <Field label={<><Map className="w-4 h-4 mr-1.5 text-gray-400" />Province</>} error={errors.province}>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Map className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                          value={form.province} onChange={set('province')}
                          className={`w-full pl-9 pr-4 py-2.5 rounded-xl border ${
                            errors.province
                              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-200'
                          } focus:ring-2 focus:bg-white transition-all outline-none text-sm appearance-none`}
                        >
                          <option value="">Select…</option>
                          {PROVINCES.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                      {errors.province && (
                        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3" />{errors.province}
                        </p>
                      )}
                    </Field>
                  </div>
                </div>
              </div>

              {/* ── Security ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-100">
                  Security
                </p>
                <div className="space-y-4">
                  <Field label={<><Lock className="w-4 h-4 mr-1.5 text-gray-400" />Password</>} error={errors.password}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        value={form.password} onChange={set('password')}
                        className={`w-full pl-9 pr-10 py-2.5 rounded-xl border ${
                          errors.password
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-200'
                        } focus:ring-2 focus:bg-white transition-all outline-none text-sm`}
                      />
                      <button
                        type="button" tabIndex={-1}
                        onClick={() => setShowPass(v => !v)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <StrengthMeter password={form.password} />
                  </Field>

                  <Field label={<><Lock className="w-4 h-4 mr-1.5 text-gray-400" />Confirm Password</>} error={errors.confirmPassword}>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        value={form.confirmPassword} onChange={set('confirmPassword')}
                        className={`w-full pl-9 pr-10 py-2.5 rounded-xl border ${
                          errors.confirmPassword
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-200'
                        } focus:ring-2 focus:bg-white transition-all outline-none text-sm`}
                      />
                      <button
                        type="button" tabIndex={-1}
                        onClick={() => setShowConfirm(v => !v)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                </div>
              </div>

              {/* ── Terms ── */}
              <div className="space-y-1">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox" id="terms"
                    checked={form.terms} onChange={set('terms')}
                    className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
                    I agree to RideXpress's{' '}
                    <a href="/terms" className="text-blue-600 font-medium hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-blue-600 font-medium hover:underline">Privacy Policy</a>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-500 flex items-center gap-1 pl-7">
                    <AlertCircle className="w-3 h-3" />{errors.terms}
                  </p>
                )}
              </div>

              {/* ── Submit ── */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full flex items-center justify-center py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Creating account…
                    </>
                  ) : success ? (
                    <><CheckCircle className="w-6 h-6 mr-2" />Account created!</>
                  ) : (
                    <><UserPlus className="w-6 h-6 mr-2" />Create Account</>
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