import {
  Users,
  Calendar,
  ScanLine,
  BadgeCheck,
} from "lucide-react";

const Dashboard = ({ user }) => {
  const stats = [
    {
      label: "Total Visitors",
      value: "1,245",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Appointments",
      value: "320",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      label: "Check-ins Today",
      value: "87",
      icon: ScanLine,
      color: "bg-purple-500",
    },
    {
      label: "Active Passes",
      value: "154",
      icon: BadgeCheck,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Here’s what’s happening in your VPMS system today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-lg text-white ${item.color}`}>
                <Icon size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h2 className="text-xl font-bold text-gray-800">
                  {item.value}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-2">
          Activity Overview
        </h2>
        <p className="text-gray-500 text-sm">
          (Charts or recent activity will go here later)
        </p>
      </div>
    </div>
  );
};

export default Dashboard;