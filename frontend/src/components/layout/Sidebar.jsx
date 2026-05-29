import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  ScanLine,
  BadgeCheck,
  BarChart3,
  Settings,
  ShieldCheck,
  User,
  ClipboardList,
  CalendarPlus,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
    const { user } = useAuth();
  const role = user?.role;

  const menuItems = [
    // ================= ADMIN =================
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      roles: ["admin"],
    },
    {
      label: "Employees",
      icon: Users,
      path: "/employees",
      roles: ["admin"],
    },
    {
      label: "Security Staff",
      icon: ShieldCheck,
      path: "/security-staff",
      roles: ["admin"],
    },
    {
      label: "Visitors",
      icon: Users,
      path: "/ManageVisitors",
      roles: ["admin"],
    },
    {
      label: "Reports",
      icon: BarChart3,
      path: "/reports",
      roles: ["admin"],
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
      roles: ["admin"],
    },
    // ================= EMPLOYEE =================
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/employee",
      roles: ["employee"],
    },
    {
      label: "Appointments",
      icon: Calendar,
      path: "/manage-appointments",
      roles: ["employee"],
    },
    {
      label: "My Visitors",
      icon: Users,
      path: "/my-visitors",
      roles: ["employee"],
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
      roles: ["employee"],
    },
    // ================= SECURITY =================
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/security",
      roles: ["security"],
    },
    {
      label: "Visitors",
      icon: Users,
      path: "/visitors",
      roles: ["security"],
    },
    {
      label: "Appointments",
      icon: Calendar,
      path: "/appointments",
      roles: ["security"],
    },
    {
      label: "Passes",
      icon: BadgeCheck,
      path: "/passes",
      roles: ["security"],
    },
    {
      label: "Check-In",
      icon: ScanLine,
      path: "/checkin",
      roles: ["security"],
    },
    {
      label: "Check-Out",
      icon: LogOut,
      path: "/checkout",
      roles: ["security"],
    },
    {
      label: "Logs",
      icon: ClipboardList,
      path: "/logs",
      roles: ["security"],
    },
    // ================= VISITOR =================
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/visitor",
      roles: ["visitor"],
    },
    {
      label: "Book Appointment",
      icon: CalendarPlus,
      path: "/book-appointment",
      roles: ["visitor"],
    },
    {
      label: "My Appointments",
      icon: Calendar,
      path: "/my-appointments",
      roles: ["visitor"],
    },
    {
      label: "My Pass",
      icon: BadgeCheck,
      path: "/my-pass",
      roles: ["visitor"],
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
      roles: ["visitor"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  return (
    <div className="h-screen w-[260px] bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-xl font-bold">VPMS</h1>
        <p className="text-xs text-slate-400">Visitor Management</p>
      </div>

      {/* Menu */}
      <div className="flex-1 px-3 py-4 space-y-1">
        {filteredMenu.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 text-xs text-slate-400">
        Role: {role}
      </div>
    </div>
  );
};

export default Sidebar;