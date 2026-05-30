import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  User,
  ShieldAlert,
  Calendar, 
  Clock,
  Search
} from 'lucide-react';
// 🛠️ FIX: Using your correct API function import name here
import { getLogs } from '../../api/checkApi'; 

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input to avoid spamming backend on every keypress
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Passing the search string parameter into your clean getLogs handler
        const data = await getLogs({ search: debouncedSearch });
        setLogs(data.logs || data || []);
      } catch (err) {
        console.error("Error reading gate log history:", err);
        toast.error("Failed to sync log history.");
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [debouncedSearch]);

  const formatLogDate = (dateString) => {
    if (!dateString) return { day: '---', time: '---' };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: '---', time: '---' };
    
    return {
      day: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <History className="text-blue-600" size={28} />
            Access Entry Logs
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time tracking of security checkpoint pass verifications
          </p>
        </div>
      </div>

      {/* FILTER CONTROL PANEL */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-3 w-full max-w-md">
        <Search className="text-gray-400 flex-shrink-0" size={20} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by visitor name..."
          className="w-full text-sm text-gray-800 bg-transparent focus:outline-none placeholder-gray-400"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-100 px-2 py-1 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* WORKSPACE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Table Titles */}
        <div className="hidden md:grid grid-cols-4 bg-gray-50 border-b border-gray-200 text-gray-600 font-bold text-xs tracking-wider uppercase p-4">
          <span>Activity Event</span>
          <span>Visitor / Guest</span>
          <span>Scanned By</span>
          <span>Timestamp Metrics</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></div>
            <p className="text-sm font-medium">Syncing terminal entries...</p>
          </div>
        ) : logs.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => {
              const isCheckIn = log.type === 'check-in';
              
              // Checks fallback options for date attributes 
              const { day, time } = formatLogDate(log.createdAt || log.timestamp || log.date);

              // Tries to grab populated field values, otherwise falls back safely
              const visitorDisplay = log.visitor?.name || 'Unassigned Visitor';

              return (
                <div 
                  key={log._id} 
                  className="grid grid-cols-1 md:grid-cols-4 p-4 md:p-5 items-center hover:bg-gray-50/70 transition-colors gap-2 md:gap-0"
                >
                  {/* REQUIREMENT 1: ACTIVITY EVENT BADGE */}
                  <div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wide border ${
                      isCheckIn 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {isCheckIn ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      {log.type}
                    </span>
                  </div>

                  {/* REQUIREMENT 2: VISITOR NAME */}
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 rounded-lg text-gray-500 md:hidden">
                      <User size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-base md:text-sm">
                        {visitorDisplay}
                      </span>
                    </div>
                  </div>

                  {/* REQUIREMENT 3: SCANNED BY */}
                  <div className="flex flex-col text-gray-700 text-sm">
                    <span className="text-xs text-gray-400 md:hidden font-medium">Scanned By:</span>
                    <span className="font-semibold text-gray-800">
                      {log.scannedBy?.name || 'System Auto'}
                    </span>
                  </div>

                  {/* REQUIREMENT 4: TIME METRICS */}
                  <div className="flex items-center md:flex-col md:items-start gap-4 md:gap-0 bg-gray-50 md:bg-transparent p-2 md:p-0 rounded-xl">
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{day}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Clock size={13} className="text-gray-400" />
                      <span>{time}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center max-w-sm mx-auto flex flex-col items-center justify-center">
            <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-4">
              <ShieldAlert size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No logs found</h3>
            <p className="text-gray-400 text-sm mt-1">
              No checkpoints logs match your search criteria.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}