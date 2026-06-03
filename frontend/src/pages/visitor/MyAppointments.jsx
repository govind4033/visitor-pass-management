import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  FileText, 
  Loader2, 
  AlertCircle,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import { getVisitorOwnAppointments } from "../../api/appointmentApi";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchMyAppointments = async (showBackgroundSpinner = false) => {
    if (showBackgroundSpinner) setIsSyncing(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Hits your appointments tracking endpoint
      const data = await getVisitorOwnAppointments();
      
      if (data.success) {
        // Fallback checks matching varying array return layouts safely
        const list = data.appointments || [];
        setAppointments(list);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching visitor appointments:", err);
      setError("Failed to sync your appointment registry logs with the database.");
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Initial fetch on component mount
    fetchMyAppointments();

    // Polling Lifecycle Loop: Automatically refreshes status updates every 10 seconds
    const livePollingInterval = setInterval(() => {
      fetchMyAppointments(true);
    }, 10000);

    // Memory-safe cleanup hook on unmount
    return () => clearInterval(livePollingInterval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">Loading your scheduled gate passes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Track the validation status of your incoming building entry permits.</p>
        </div>
        
        {/* Subtle dynamic sync badge */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-gray-100 rounded-full text-gray-600">
          <RefreshCw size={12} className={`${isSyncing ? 'animate-spin text-blue-500' : ''}`} />
          {isSyncing ? 'Syncing Live...' : 'Auto-updated'}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error} — Attempting auto-reconnection...</span>
        </div>
      )}

      {/* Grid Layout Container */}
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {appointments.map((appt) => {
            // Unpack combined scheduled date safely
            const eventDate = appt.scheduledAt ? new Date(appt.scheduledAt) : null;
            
            return (
              <div 
                key={appt._id} 
                className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition duration-200"
              >
                <div className="space-y-4">
                  
                  {/* Card Header: Host Info & Status Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 shrink-0">
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 leading-tight">
                          {appt.host?.name || "Unassigned Staff"}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Building2 size={12} />
                          {appt.host?.department || "General / Administration"}
                        </p>
                      </div>
                    </div>

                    {/* Highly scannable status parameters mapping */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide capitalize border shrink-0
                      ${appt.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                      ${appt.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                      ${appt.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                      ${appt.status === 'completed' ? 'bg-gray-100 text-gray-600 border-gray-200' : ''}
                      ${appt.status === 'cancelled' ? 'bg-gray-100 text-gray-400 border-gray-200 line-through' : ''}
                    `}>
                      {appt.status}
                    </span>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Booking Details Fields */}
                  <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Date</p>
                        <p className="font-medium text-gray-700 mt-0.5">
                          {eventDate ? eventDate.toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} className="text-gray-400" />
                      <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Arrival Time</p>
                        <p className="font-medium text-gray-700 mt-0.5">
                          {eventDate ? eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Purpose Description Block */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <FileText size={12} /> Purpose of Visit
                    </p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 border border-gray-100 line-clamp-2">
                      {appt.purpose}
                    </p>
                  </div>

                  {/* Conditional Optional Notes Row */}
                  {appt.notes && (
                    <div className="text-xs text-gray-500 bg-blue-50/30 border border-blue-100/50 rounded-xl p-2.5 italic">
                      <span className="font-semibold text-blue-700 not-italic block text-[10px] uppercase tracking-wider mb-0.5">Declared Notes:</span>
                      "{appt.notes}"
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Fallback Layout State Grid */
        <div className="text-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/50 max-w-xl mx-auto mt-6">
          <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
          <h3 className="text-lg font-bold text-gray-800">No appointments recorded</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            You haven't scheduled any entry clearances yet. Once you dispatch a schedule visit request, your interactive pass records map out here.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;