import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const statusStyles = {
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const stats = [
  {
    label: "Total Bookings",
    key: "total",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-6 h-6"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    label: "Confirmed",
    key: "confirmed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-6 h-6"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    label: "Pending",
    key: "pending",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-6 h-6"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    label: "Total Revenue",
    key: "revenue",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="w-6 h-6"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-5 h-5"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "bookings",
      label: "All Bookings",
      path: "/admin/bookings",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="w-5 h-5"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("/api/booking", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Normalize: handle array, { bookings: [] }, { data: [] }, or any wrapper object
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.bookings)
            ? raw.bookings
            : Array.isArray(raw?.data)
              ? raw.data
              : [];
        setBookings(list);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const statValues = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    revenue:
      "NPR " +
      bookings
        .filter((b) => b.status === "COMPLETED")
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
        .toLocaleString(),
  };

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out shrink-0`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-700">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <circle cx="5" cy="17" r="2" fill="white" />
              <circle cx="19" cy="17" r="2" fill="white" />
              <path
                d="M3 17H1v-4l4-5h11l4 4v5h-2M7 17h10"
                stroke="white"
                strokeWidth={2}
              />
            </svg>
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-sm tracking-wide">RideExpress</p>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          )}
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium
                ${location.pathname === item.path ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-6">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-all"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-5 h-5 shrink-0"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-400">Welcome back, Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center mb-4`}
                >
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? (
                    <span className="inline-block w-16 h-7 bg-gray-100 rounded animate-pulse" />
                  ) : (
                    statValues[stat.key]
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Recent Bookings</h2>
              <button
                onClick={() => navigate("/admin/bookings")}
                className="text-sm text-violet-600 font-medium hover:underline"
              >
                View All →
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                No bookings yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 uppercase tracking-wider bg-gray-50/60">
                      <th className="text-left px-6 py-3">Booking ID</th>
                      <th className="text-left px-6 py-3">User</th>
                      <th className="text-left px-6 py-3">Vehicle</th>
                      <th className="text-left px-6 py-3">Pickup</th>
                      <th className="text-left px-6 py-3">Drop</th>
                      <th className="text-left px-6 py-3">Total Price</th>
                      <th className="text-left px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentBookings.map((b) => (
                      <tr
                        key={b._id}
                        onClick={() => navigate(`/admin/bookings/${b._id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-violet-600">
                          {b._id?.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {b.user?.name || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {b.bookingItems?.[0]?.vehicle?.name || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {b.pickupLocation}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {b.dropLocation}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          NPR {b.totalPrice?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[b.status] || "bg-gray-100 text-gray-600"}`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
