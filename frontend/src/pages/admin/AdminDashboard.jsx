import { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  Calendar,
  ScanLine,
  BadgeCheck,
  ArrowRight,
  Loader2
} from "lucide-react";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ visitorsToday: 0, activePasses: 0, appointments: 0, checkIns: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Execute both database queries concurrently for performance
        const [statsRes, activityRes] = await Promise.all([
          axios.get("/api/admin/dashboard-stats", config),
          axios.get("/api/admin/recent-activity", config)
        ]);

        if (statsRes.data.success) setMetrics(statsRes.data.data);
        if (activityRes.data.success) setRecentActivities(activityRes.data.data);
        
        setError(null);
      } catch (err) {
        console.error("Dashboard synchronization error:", err);
        setError("Failed to fetch operational stats.");
      } finally {
        setLoading(false);
      }
    };

    // Run initial data fetch on component mount
    fetchDashboardData();

    // Setup Polling Logic: Refreshes real-time metrics every 10 seconds
    const liveFeedInterval = setInterval(fetchDashboardData, 10000);

    // Cleanup function: Prevents memory leaks when user changes pages
    return () => clearInterval(liveFeedInterval);
  }, []);

  const stats = [
    { label: "Visitors Today", value: metrics.visitorsToday, icon: Users, color: "bg-blue-600" },
    { label: "Active Passes", value: metrics.activePasses, icon: BadgeCheck, color: "bg-emerald-600" },
    { label: "Appointments Due", value: metrics.appointments, icon: Calendar, color: "bg-amber-500" },
    { label: "Check-ins Completed", value: metrics.checkIns, icon: ScanLine, color: "bg-indigo-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">Syncing system metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          ⚠️ {error} — Retrying background sync...
        </div>
      )}

      {/* Admin Title Heading */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Console</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time status updates from terminal entries.</p>
      </div>

      {/* Dynamic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      
    </div>
  );
};

export default AdminDashboard;