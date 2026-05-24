import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const statusStyles = {
  COMPLETED: {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  CONFIRMED: { badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  PENDING: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  CANCELLED: { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
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

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400 w-40 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusInput, setStatusInput] = useState("");
  const [updateMsg, setUpdateMsg] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        // GET /api/booking/:id
        // Returns: { _id, vehicleNumber, user:{name,email,phone,address},
        //   bookingItems:[{vehicle:{name,brand,model,type,year,pricePerDay}, quantity, pricePerDay, subtotal}],
        //   startDate, endDate, pickupLocation, dropLocation, totalPrice,
        //   status (PENDING|CONFIRMED|CANCELLED|COMPLETED),
        //   paymentStatus (unpaid|paid|refunded), payment:{...}, createdAt }
        const res = await axios.get(`/api/booking/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // Normalize: handle direct object or wrapped { booking: {}, data: {} }
        const raw = res.data;
        const data = raw?._id
          ? raw
          : raw?.booking?._id
            ? raw.booking
            : raw?.data?._id
              ? raw.data
              : raw;
        setBooking(data);
        setStatusInput(data?.status || "PENDING");
      } catch (err) {
        console.error("Failed to fetch booking", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      // PUT /api/booking/:id  — body: { status }
      await axios.put(
        `/api/booking/${id}`,
        { status: statusInput },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setBooking((prev) => ({ ...prev, status: statusInput }));
      setUpdateMsg({ type: "success", text: "Status updated successfully!" });
    } catch (err) {
      setUpdateMsg({ type: "error", text: "Failed to update status." });
    } finally {
      setUpdating(false);
      setTimeout(() => setUpdateMsg(null), 3000);
    }
  };

  const s = booking
    ? statusStyles[booking.status] || statusStyles.PENDING
    : statusStyles.PENDING;

  const daysBetween = (start, end) => {
    if (!start || !end) return "—";
    const diff = Math.ceil(
      (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24),
    );
    return `${diff} day${diff !== 1 ? "s" : ""}`;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/bookings")}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Booking Detail
              </h1>
              <p className="text-xs text-gray-400 font-mono">
                #{id?.slice(-12).toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !booking ? (
            <div className="text-center py-20 text-gray-400">
              <p className="font-medium">Booking not found.</p>
              <button
                onClick={() => navigate("/admin/bookings")}
                className="mt-3 text-violet-600 text-sm hover:underline"
              >
                ← Back to bookings
              </button>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-5">
              {/* Header Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono mb-1">
                    Vehicle # {booking.vehicleNumber}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900">
                    {booking.pickupLocation} → {booking.dropLocation}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Booked on{" "}
                    {new Date(booking.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${s.badge}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                    {booking.status}
                  </span>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    NPR {booking.totalPrice?.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs font-semibold mt-1 capitalize ${booking.paymentStatus === "paid" ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    Payment: {booking.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Booking Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="w-4 h-4 text-violet-500"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                    Booking Details
                  </h3>
                  <InfoRow
                    label="Pickup Location"
                    value={booking.pickupLocation}
                  />
                  <InfoRow label="Drop Location" value={booking.dropLocation} />
                  <InfoRow
                    label="Start Date"
                    value={
                      booking.startDate
                        ? new Date(booking.startDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )
                        : "—"
                    }
                  />
                  <InfoRow
                    label="End Date"
                    value={
                      booking.endDate
                        ? new Date(booking.endDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" },
                          )
                        : "—"
                    }
                  />
                  <InfoRow
                    label="Duration"
                    value={daysBetween(booking.startDate, booking.endDate)}
                  />
                  <InfoRow
                    label="Total Price"
                    value={`NPR ${booking.totalPrice?.toLocaleString()}`}
                  />
                  <InfoRow
                    label="Payment Status"
                    value={
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${booking.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : booking.paymentStatus === "refunded" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    }
                  />
                </div>

                {/* User Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      className="w-4 h-4 text-violet-500"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                    </svg>
                    User Info
                  </h3>
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {booking.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {booking.user?.name}
                      </p>
                      <p className="text-xs text-gray-400">Customer</p>
                    </div>
                  </div>
                  <InfoRow label="Email" value={booking.user?.email} />
                  <InfoRow label="Phone" value={booking.user?.phone} />
                  <InfoRow label="Address" value={booking.user?.address} />
                </div>
              </div>

              {/* Booked Vehicles */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="w-4 h-4 text-violet-500"
                  >
                    <circle cx="5" cy="17" r="2" />
                    <circle cx="19" cy="17" r="2" />
                    <path d="M3 17H1v-4l4-5h11l4 4v5h-2M7 17h10" />
                  </svg>
                  Booked Vehicles
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase tracking-wider bg-gray-50/60">
                        <th className="text-left px-4 py-2">Vehicle</th>
                        <th className="text-left px-4 py-2">Brand</th>
                        <th className="text-left px-4 py-2">Type</th>
                        <th className="text-left px-4 py-2">Year</th>
                        <th className="text-left px-4 py-2">Price/Day</th>
                        <th className="text-left px-4 py-2">Qty</th>
                        <th className="text-left px-4 py-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {booking.bookingItems?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {item.vehicle?.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {item.vehicle?.brand || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {item.vehicle?.type || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {item.vehicle?.year || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            NPR {item.pricePerDay?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900">
                            NPR {item.subtotal?.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Update Status */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="w-4 h-4 text-violet-500"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Update Booking Status
                </h3>

                {updateMsg && (
                  <div
                    className={`mb-4 p-3 rounded-xl text-sm font-medium ${updateMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}
                  >
                    {updateMsg.text}
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white min-w-[180px]"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updating || statusInput === booking.status}
                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-200 flex items-center gap-2"
                  >
                    {updating && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    {updating ? "Saving..." : "Update Status"}
                  </button>
                  <button
                    onClick={() => navigate("/admin/bookings")}
                    className="px-5 py-2 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    ← Back to Bookings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
