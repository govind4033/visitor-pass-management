import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPassById } from '../api/passApi';
import { QrCode, Download } from 'lucide-react';

export default function PassView() {
    const { id } = useParams();

    const [pass, setPass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const BASE_URL = import.meta.env.VITE_BASE_URL?.replace('/api', '');

    useEffect(() => {
        const fetchPass = async () => {
            try {
                const data = await getPassById(id);

                setPass(data.pass);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.msg ||
                    err.response?.data?.message ||
                    'Failed to load pass'
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPass();
    }, [id]);

    // loading UI
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Loading pass...
            </div>
        );
    }

    // error UI
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    // no data safety
    if (!pass) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                No pass found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">

                {/* header */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <QrCode className="text-blue-600" />
                    </div>

                    <h1 className="text-2xl font-bold">Visitor Pass</h1>
                </div>

                {/* QR */}
                <div className="flex justify-center mb-6">
                    {pass.qrCodeUrl ? (
                        <img
                            src={`${BASE_URL}/uploads/${pass.qrCodeUrl}`}
                            alt="QR Code"
                            className="w-48 h-48 border p-2 rounded-xl"
                        />
                    ) : (
                        <p className="text-gray-400">No QR found</p>
                    )}
                </div>

                {/* details */}
                <div className="space-y-3 text-sm">

                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Visitor</span>
                        <span className="font-medium">
                            {pass.visitor?.name || 'N/A'}
                        </span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Pass Code</span>
                        <span className="font-semibold text-blue-600">
                            {pass.passCode}
                        </span>
                    </div>

                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Status</span>
                        <span className="capitalize">
                            {pass.status}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Expires</span>
                        <span>
                            {pass.expiresAt
                                ? new Date(pass.expiresAt).toLocaleString()
                                : 'N/A'}
                        </span>
                    </div>
                </div>

                {/* download */}
                {pass.pdfUrl && (
                    <a
                        href={`${BASE_URL}/uploads/${pass.pdfUrl}`}
                        target="_blank"
                        className="mt-6 block"
                    >
                        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl flex items-center justify-center gap-2">
                            <Download size={18} />
                            Download Pass
                        </button>
                    </a>
                )}

            </div>
        </div>
    );
}