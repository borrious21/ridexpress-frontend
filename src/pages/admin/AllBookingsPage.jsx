import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const statusStyles = {
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function Sidebar() {
  const navigate = useNavigate();
  const navItems = [
    {
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
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-700">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
            <circle cx="5" cy="17" r="2" fill="white" />
            <circle cx="19" cy="17" r="2" fill="white" />
            <path
              d="M3 17H1v-4l4-5h11l4 4v5h-2M7 17h10"
              stroke="white"
              strokeWidth={2}
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-sm tracking-wide">RideExpress</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium
              ${location.pathname === item.path ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
          >
            {item.icon}
            <span>{item.label}</span>
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
            className="w-5 h-5"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default function AllBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // GET /api/booking — returns array of bookings
        // Each booking: { _id, user: {name,email,phone,address}, bookingItems: [{vehicle:{name,brand,type}, quantity, pricePerDay, subtotal}],
        //   startDate, endDate, pickupLocation, dropLocation, totalPrice, status, paymentStatus, vehicleNumber, payment, createdAt }
        const res = await axios.get("/api/booking", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Normalize: handle array, { bookings: [] }, { data: [] }, or any wrapper
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
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const statuses = ["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

  const counts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b._id?.toLowerCase().includes(q) ||
      b.user?.name?.toLowerCase().includes(q) ||
      b.user?.email?.toLowerCase().includes(q) ||
      b.pickupLocation?.toLowerCase().includes(q) ||
      b.dropLocation?.toLowerCase().includes(q) ||
      b.vehicleNumber?.toLowerCase().includes(q) ||
      b.bookingItems?.some((item) =>
        item.vehicle?.name?.toLowerCase().includes(q),
      );
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900">All Bookings</h1>
            <p className="text-xs text-gray-400">Manage all vehicle bookings</p>
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Tabs */}
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize border
                  ${statusFilter === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"}`}
              >
                {s}{" "}
                <span className="ml-1 text-xs opacity-60">({counts[s]})</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            {/* Search */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by user, vehicle, location..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <span className="text-sm text-gray-400">
                {filtered.length} results
              </span>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-12 h-12 mx-auto mb-3 text-gray-300"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <p className="font-medium">No bookings found</p>
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
                      <th className="text-left px-6 py-3">Start Date</th>
                      <th className="text-left px-6 py-3">End Date</th>
                      <th className="text-left px-6 py-3">Total Price</th>
                      <th className="text-left px-6 py-3">Payment</th>
                      <th className="text-left px-6 py-3">Status</th>
                      <th className="text-left px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((b) => (
                      <tr
                        key={b._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-violet-600">
                          #{b._id?.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">
                            {b.user?.name || "—"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {b.user?.email || ""}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-700 font-medium">
                            {b.bookingItems?.[0]?.vehicle?.name || "—"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {b.bookingItems?.[0]?.vehicle?.type || ""}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-500 max-w-[110px] truncate">
                          {b.pickupLocation}
                        </td>
                        <td className="px-6 py-4 text-gray-500 max-w-[110px] truncate">
                          {b.dropLocation}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {b.startDate
                            ? new Date(b.startDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs">
                          {b.endDate
                            ? new Date(b.endDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          NPR {b.totalPrice?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${b.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : b.paymentStatus === "refunded" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                          >
                            {b.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[b.status] || "bg-gray-100 text-gray-600"}`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/admin/bookings/${b._id}`)}
                            className="text-xs font-medium text-violet-600 hover:text-violet-800 border border-violet-200 hover:border-violet-400 px-3 py-1 rounded-lg transition-all"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Showing {(currentPage - 1) * perPage + 1}–
                  {Math.min(currentPage * perPage, filtered.length)} of{" "}
                  {filtered.length}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all
                        ${p === currentPage ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
