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
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
    const { user } = useAuth();
  const role = user?.role;

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: ["admin", "employee", "security"],
    },
    {
      label: "Visitors",
      icon: Users,
      path: "/visitors",
      roles: ["admin", "employee", "security"],
    },
    {
      label: "New Visitor",
      icon: UserPlus,
      path: "/visitors/new",
      roles: ["admin", "employee"],
    },
    {
      label: "Appointments",
      icon: Calendar,
      path: "/appointments",
      roles: ["admin", "employee"],
    },
    {
      label: "Check-In",
      icon: ScanLine,
      path: "/checkin",
      roles: ["admin", "security"],
    },
    {
      label: "Passes",
      icon: BadgeCheck,
      path: "/passes/",
      roles: ["admin", "employee", "security"],
    },
    {
      label: "Reports",
      icon: BarChart3,
      path: "/reports",
      roles: ["admin"],
    },
    // implementing afterwards with delete users by admin, dark mode fon't size etc
    // {
    //   label: "Settings",
    //   icon: Settings,
    //   path: "/settings",
    //   roles: ["admin"],
    // },
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