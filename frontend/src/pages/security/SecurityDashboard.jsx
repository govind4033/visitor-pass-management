import { useEffect, useState } from "react";
import {
  Users,
  LogIn,
  LogOut,
  ShieldCheck,
  Loader2,
  AlertCircle
} from "lucide-react";

import { getSecurityDashboardStats } from "../../api/checkApi";

export default function SecurityDashboard() {
  const [stats, setStats] = useState({
    activeVisitors: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    activePasses: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const data = await getSecurityDashboardStats();

      setStats({
        activeVisitors: data.activeVisitors || 0,
        todayCheckIns: data.todayCheckIns || 0,
        todayCheckOuts: data.todayCheckOuts || 0,
        activePasses: data.activePasses || 0,
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load security dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Active Visitors Inside",
      value: stats.activeVisitors,
      icon: Users,
      color: "bg-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      title: "Today's Check-ins",
      value: stats.todayCheckIns,
      icon: LogIn,
      color: "bg-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
    {
      title: "Today's Check-outs",
      value: stats.todayCheckOuts,
      icon: LogOut,
      color: "bg-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-700",
    },
    {
      title: "Active Passes",
      value: stats.activePasses,
      icon: ShieldCheck,
      color: "bg-violet-600",
      bg: "bg-violet-50",
      text: "text-violet-700",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">
          Loading security operations dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Security Dashboard
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Monitor live visitor movement and gate activity.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition"
            >
              <div className={`${card.color} p-4 rounded-2xl text-white shadow-sm`}>
                <Icon size={24} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  {card.title}
                </p>

                <h2 className={`text-3xl font-extrabold mt-1 ${card.text}`}>
                  {card.value}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}