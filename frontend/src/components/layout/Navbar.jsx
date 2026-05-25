import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/visitors":
        return "Visitors";
      case "/new-visitor":
        return "New Visitor";
      case "/appointments":
        return "Appointments";
      case "/checkin":
        return "Check-In";
      case "/passes":
        return "Pass View";
      case "/users":
        return "Users";
      case "/reports":
        return "Reports";
      case "/settings":
        return "Settings";
      default:
        return "VPMS";
    }
  };

  return (
    <div className="h-16 w-full bg-white border-b flex items-center justify-between px-6">
      {/* Left - Page Title */}
      <h2 className="text-lg font-semibold text-gray-800">
        {getPageTitle()}
      </h2>

      {/* Right - User Info */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">
            {user?.role}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          <LogOut size={16} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;