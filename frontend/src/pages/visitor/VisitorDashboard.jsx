import { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarClock,
  CalendarCheck,
  QrCode,
  Loader2,
  Building2,
  Clock
} from "lucide-react";

const VisitorDashboard = () => {
  const [metrics, setMetrics] = useState({ pendingAppointments: 0, approvedAppointments: 0, activePasses: 0 });
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Concurrent database hits matching your admin layout architecture
        const [statsRes, appointmentsRes] = await Promise.all([
          axios.get("/api/visitor/dashboard-stats", config),
          axios.get("/api/visitor/my-appointments", config)
        ]);

        if (statsRes.data.success) setMetrics(statsRes.data.data);
        if (appointmentsRes.data.success) setAppointmentsList(appointmentsRes.data.data);
        
        setError(null);
      } catch (err) {
        console.error("Visitor profile sync breakdown:", err);
        setError("Failed to stream your live appointment passes.");
      } finally {
        setLoading(false);
      }
    };

    // Run core lifecycle fetch on mount
    fetchVisitorData();

    // Background Synchronization Polling Loop (Refreshes counts live every 10 seconds)
    const activeSyncInterval = setInterval(fetchVisitorData, 10000);

    // Garbage clean memory safe hook teardown
    return () => clearInterval(activeSyncInterval);
  }, []);

  const stats = [
    { label: "Pending Approvals", value: metrics.pendingAppointments, icon: CalendarClock, color: "bg-amber-500" },
    { label: "Approved Visits", value: metrics.approvedAppointments, icon: CalendarCheck, color: "bg-blue-600" },
    { label: "Active Gate Passes", value: metrics.activePasses, icon: QrCode, color: "bg-emerald-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p className="text-gray-500 font-medium">Assembling pass registers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm font-medium">
          🔄 Connecting to server terminal... updates might temporarily pause.
        </div>
      )}

      {/* Visitor Welcome Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Visitor Console</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your building access permits and host status.</p>
      </div>

      {/* Structured Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className={`p-4 rounded-xl text-white ${item.color}`}><Icon size={24} /></div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{item.label}</p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">{item.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Operational Visit Activity Log */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Your Booked Appointments & Entry Permits</h2>
          </div>
          
          {appointmentsList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-medium">
                    <th className="pb-3">Host Employee</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Scheduled Date</th>
                    <th className="pb-3 text-right">Gate Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointmentsList.map((appt) => (
                    <tr key={appt._id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 font-semibold text-gray-800">{appt.hostEmployee?.name || "Unassigned"}</td>
                      <td className="py-4 text-gray-600 flex items-center gap-1.5">
                        <Building2 size={14} className="text-gray-400" />
                        {appt.hostEmployee?.department || "N/A"}
                      </td>
                      <td className="py-4 text-gray-500 text-xs">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-gray-400" />
                          {new Date(appt.visitDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize
                          ${appt.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                          ${appt.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
                          ${appt.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                          ${appt.status === 'completed' ? 'bg-gray-100 text-gray-600' : ''}
                        `}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <p className="text-sm font-medium">No appointment bookings logged.</p>
              <p className="text-xs text-gray-400 mt-1">When you configure a schedule visit path, status keys map out here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitorDashboard;