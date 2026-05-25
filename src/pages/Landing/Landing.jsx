import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, Shield, Clock, MapPin, Star, ChevronRight,
  Phone, Mail, Globe, Share2, MessageCircle,
  CheckCircle, Zap, Users, Award
} from 'lucide-react';
import api from '../../api/api';

const VEHICLE_TYPES = ['All', 'Car', 'Bike', 'SUV', 'Van'];

const STATS = [
  { icon: Car,    value: '500+',  label: 'Vehicles Available' },
  { icon: Users,  value: '12K+',  label: 'Happy Customers' },
  { icon: MapPin, value: '20+',   label: 'Cities in Nepal' },
  { icon: Award,  value: '4.9★',  label: 'Average Rating' },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Fully Insured',
    desc: 'Every vehicle is comprehensively insured so you can drive worry-free.',
  },
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Book in under 2 minutes. Get confirmation immediately.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    desc: 'Our team is always on standby to help you on the road.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Shrestha',
    city: 'Kathmandu',
    rating: 5,
    text: 'Rented an SUV for our Pokhara trip. The car was spotless and the booking took just 2 minutes!',
    initials: 'PS',
  },
  {
    name: 'Rohan Thapa',
    city: 'Lalitpur',
    rating: 5,
    text: 'Best vehicle rental service in Nepal. Affordable prices and very professional staff.',
    initials: 'RT',
  },
  {
    name: 'Anisha Karki',
    city: 'Bhaktapur',
    rating: 4,
    text: 'Used RideXpress three times now. Consistently good experience and great vehicles.',
    initials: 'AK',
  },
];

// Placeholder vehicles shown before API loads
const PLACEHOLDER_VEHICLES = [
  { _id: '1', name: 'Toyota Hiace', type: 'Van',  pricePerDay: 4500, location: 'Kathmandu', rating: 4.8, photos: [] },
  { _id: '2', name: 'Honda CB350', type: 'Bike', pricePerDay: 1200, location: 'Pokhara',   rating: 4.7, photos: [] },
  { _id: '3', name: 'Hyundai Creta', type: 'SUV', pricePerDay: 5500, location: 'Kathmandu', rating: 4.9, photos: [] },
  { _id: '4', name: 'Maruti Swift',  type: 'Car', pricePerDay: 2800, location: 'Chitwan',   rating: 4.6, photos: [] },
  { _id: '5', name: 'Mahindra Thar', type: 'SUV', pricePerDay: 6000, location: 'Pokhara',   rating: 5.0, photos: [] },
  { _id: '6', name: 'Bajaj Pulsar',  type: 'Bike',pricePerDay:  900, location: 'Butwal',    rating: 4.5, photos: [] },
];

function VehicleCard({ vehicle }) {
  const hasPhoto = vehicle.photos && vehicle.photos.length > 0;
  const typeColor = {
    Car: 'bg-blue-50 text-blue-700',
    Bike: 'bg-green-50 text-green-700',
    SUV: 'bg-purple-50 text-purple-700',
    Van: 'bg-orange-50 text-orange-700',
  }[vehicle.type] || 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-blue-50 to-gray-100 overflow-hidden">
        {hasPhoto ? (
          <img
            src={vehicle.photos[0]}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-16 h-16 text-blue-200" />
          </div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${typeColor}`}>
          {vehicle.type}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight">{vehicle.name}</h3>
          <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold shrink-0 ml-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            {vehicle.rating || '—'}
          </div>
        </div>

        <div className="flex items-center text-gray-400 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1" />
          {vehicle.location || 'Nepal'}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <span className="text-2xl font-extrabold text-blue-600">
              Rs {vehicle.pricePerDay?.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 ml-1">/day</span>
          </div>
          <Link
            to="/login"
            className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [vehicles, setVehicles]     = useState(PLACEHOLDER_VEHICLES);
  const [filter, setFilter]         = useState('All');
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  useEffect(() => {
    api.get('/api/vehicles')
      .then(res => {
        const data = res.data?.vehicles || res.data || [];
        if (Array.isArray(data) && data.length > 0) setVehicles(data);
      })
      .catch(() => {
        // keep placeholders on error
      })
      .finally(() => setLoadingVehicles(false));
  }, []);

  const filtered = filter === 'All'
    ? vehicles
    : vehicles.filter(v => v.type === filter);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-black text-xl tracking-tight text-gray-900">
            Ride<span className="text-blue-600">Xpress</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#vehicles" className="hover:text-blue-600 transition-colors">Vehicles</a>
            <a href="#features"  className="hover:text-blue-600 transition-colors">Why Us</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login"  className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-100">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative bg-blue-600 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-2 border-white" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border-2 border-white translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full border border-white -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500 text-blue-100 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-blue-400">
            <Zap className="w-3.5 h-3.5" />
            Nepal's #1 Vehicle Rental Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
            Rent Any Vehicle,<br />
            <span className="text-blue-200">Anywhere in Nepal</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            From bikes for city rides to SUVs for mountain adventures — find and book the perfect vehicle in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl text-lg"
            >
              Browse Vehicles <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="#vehicles"
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-400 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-500 transition-all text-lg"
            >
              View Fleet
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative bg-blue-700 border-t border-blue-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="text-center">
                  <Icon className="w-5 h-5 text-blue-300 mx-auto mb-1" />
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="text-xs text-blue-300">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Vehicles ── */}
      <section id="vehicles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Our Fleet</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Hand-picked, well-maintained vehicles for every journey across Nepal.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {VEHICLE_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === type
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No vehicles found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(v => <VehicleCard key={v._id} vehicle={v} />)}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Sign Up to Book <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Why Choose RideXpress?</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              We've built the smoothest rental experience in Nepal from the ground up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="mt-20">
            <h3 className="text-2xl font-black text-gray-900 text-center mb-12">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Create Account', desc: 'Sign up in 2 minutes with your details.' },
                { step: '02', title: 'Browse Vehicles', desc: 'Filter by type, location and price.' },
                { step: '03', title: 'Book Instantly',  desc: 'Select your dates and confirm booking.' },
                { step: '04', title: 'Hit the Road!',   desc: 'Pick up your vehicle and enjoy.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="relative text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white font-black text-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {step}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">What Customers Say</h2>
          <p className="text-gray-500 text-lg">Real experiences from real travelers across Nepal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, city, rating, text, initials }) => (
            <div key={name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Hit the Road?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join 12,000+ travelers who trust RideXpress across Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-xl text-lg"
            >
              Create Free Account <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-400 text-white font-bold px-8 py-4 rounded-2xl hover:bg-blue-500 transition-all text-lg"
            >
              Sign In
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-blue-200 text-sm">
            {['No hidden fees', 'Free cancellation', 'Instant confirmation'].map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="font-black text-xl text-white mb-3">
                Ride<span className="text-blue-400">Xpress</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Nepal's trusted vehicle rental platform. Cars, bikes, SUVs and vans across 20+ cities.
              </p>
              <div className="flex gap-3">
                {[Globe, Share2, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                {['About Us', 'Careers', 'Blog', 'Press'].map(item => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Support</h4>
              <ul className="space-y-2 text-sm">
                {['Help Center', 'Terms of Service', 'Privacy Policy', 'Contact Us'].map(item => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  +977 980-0000000
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  support@ridexpress.com.np
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  Kathmandu, Nepal
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-xs">
            © {new Date().getFullYear()} RideXpress. All rights reserved. Built with ❤️ in Nepal.
          </div>
        </div>
      </footer>
    </div>
  );
}