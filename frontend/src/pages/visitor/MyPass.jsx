import { useEffect, useState } from 'react';
import { Eye, QrCode, ShieldCheck, ShieldAlert, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import your api call function here (adjust path to your passApi file location)
import { getVisitorOwnPasses } from '../../api/passApi'; 

export default function MyPass() {
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVisitorPasses = async () => {
            try {
                // Execute your imported modular endpoint function
                const data = await getVisitorOwnPasses();
                
                // Matches your 'return res.data' payload wrapper perfectly
                setPasses(data.passes || data.data || []);
            } catch (err) {
                console.error("Pass log synchronization failed:", err);
                toast.error("Failed to sync your gate passes from terminal archives.");
                setPasses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVisitorPasses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-gray-500 font-medium">
                <QrCode className="animate-pulse text-blue-500" size={36} />
                <span>Loading your entry permits...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-2">

            {/* Heading Context */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Security Passes</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Present these active digital clearance tokens at terminal check-in checkpoints.
                </p>
            </div>

            {/* Data Grid Layout */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Table Column Headers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-50 text-gray-400 text-xs font-semibold uppercase tracking-wider p-4 border-b border-gray-100">
                    <span>Host Entity</span>
                    <span>Pass Code</span>
                    <span className="hidden sm:block">Valid Date</span>
                    <span className="text-right sm:text-left">Status / Action</span>
                </div>

                {/* Table Rows Iteration */}
                {passes.length > 0 ? (
                    passes.map((pass) => (
                        <div
                            key={pass._id}
                            className="grid grid-cols-2 sm:grid-cols-4 p-4 border-b last:border-none items-center hover:bg-gray-50/60 transition"
                        >
                            {/* Host Employee Context */}
                            <div className="flex flex-col">
                                <span className="text-gray-800 font-semibold">
                                    {pass.appointment?.host?.name || 'Gate Security'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {pass.appointment?.host?.department || 'Visitor Clearance'}
                                </span>
                            </div>

                            {/* Pass Identifiers Token */}
                            <div className="flex items-center gap-1.5">
                                <QrCode size={14} className="text-gray-400" />
                                <span className="text-blue-600 font-bold tracking-mono">
                                    {pass.passCode}
                                </span>
                            </div>

                            {/* Verification Validity Schedule Timelines */}
                            <div className="hidden sm:flex flex-col text-xs text-gray-600 gap-0.5">
                                <span className="flex items-center gap-1 text-gray-700 font-medium">
                                    <Calendar size={12} className="text-gray-400" />
                                    {pass.appointment?.scheduledAt 
                                        ? new Date(pass.appointment.scheduledAt).toLocaleDateString(undefined, {dateStyle: 'medium'}) 
                                        : new Date(pass.createdAt).toLocaleDateString(undefined, {dateStyle: 'medium'})
                                    }
                                </span>
                            </div>

                            {/* Status Flags & Action Controls */}
                            <div className="flex items-center justify-end sm:justify-between gap-4">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide capitalize
                                    ${pass.status === 'active' 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    {pass.status === 'active' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                    {pass.status}
                                </span>

                                <button
                                    onClick={() => navigate(`/passes/${pass._id}`)}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    <Eye size={16} />
                                    <span className="hidden sm:inline">View Pass</span>
                                </button>
                            </div>

                        </div>
                    ))
                ) : (
                    /* Empty Verification State Display Screen */
                    <div className="p-16 text-center text-gray-400 bg-gray-50/40 italic">
                        <QrCode className="mx-auto text-gray-300 mb-2" size={40} />
                        <p className="text-sm font-medium">No active entry passes generated.</p>
                        <p className="text-xs text-gray-400 not-italic mt-0.5">Once an appointment passes terminal review, your digital access keys generate right here.</p>
                    </div>
                )}

            </div>
        </div>
    );
}