import { useEffect, useState } from 'react';
import { getAllPasses } from '../../api/passApi';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Passes() {

    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPasses = async () => {
            try {
                const data = await getAllPasses();
                setPasses(data.passes || []);
            } catch (err) {
                console.error(err);
                setPasses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPasses();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading passes...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Passes
                </h1>
                <p className="text-gray-500 mt-1">
                    Manage all generated visitor passes
                </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow border overflow-hidden">

                {/* Table Header */}
                <div className="grid grid-cols-4 bg-gray-100 text-gray-600 font-semibold p-4">
                    <span>Visitor</span>
                    <span>Pass Code</span>
                    <span>Status</span>
                    <span>Action</span>
                </div>

                {/* Table Body */}
                {passes.length > 0 ? (
                    passes.map((pass) => (
                        <div
                            key={pass._id}
                            className="grid grid-cols-4 p-4 border-b items-center hover:bg-gray-50"
                        >

                            {/* Visitor */}
                            <span className="text-gray-800">
                                {pass.visitor?.name || 'Unknown'}
                            </span>

                            {/* Pass Code */}
                            <span className="text-blue-600 font-medium">
                                {pass.passCode}
                            </span>

                            {/* Status */}
                            <span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    pass.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-200 text-gray-600'
                                }`}>
                                    {pass.status}
                                </span>
                            </span>

                            {/* Action */}
                            <button
                                onClick={() => window.open(pass.pdfUrl, "_blank")}
                                className="flex items-center gap-2 text-blue-600 hover:underline"
                                >
                                <Eye size={16} />
                                View
                            </button>

                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center text-gray-500">
                        No passes available
                    </div>
                )}

            </div>
        </div>
    );
}