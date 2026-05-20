import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    QrCode,
    BadgeCheck,
    CalendarDays,
    Download
} from 'lucide-react';
import { getPassById } from '../api/passApi';


export default function PassView() {

    const { id } = useParams();

    const [pass, setPass] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');


    // backend url
    const BASE_URL =
        import.meta.env.VITE_API_URL.replace('/api', '');


    // fetch pass
    useEffect(() => {
        const fetchPass = async () => {

            try {
                const data = await getPassById(id);

                setPass(data.pass);

            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    'Failed to load pass'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPass();

    }, [id]);


    // loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
                Loading pass...
            </div>
        );
    }


    // error
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
                {error}
            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

                {/* heading */}
                <div className="text-center mb-8">

                    <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-4">

                        <QrCode
                            size={40}
                            className="text-blue-600"
                        />

                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        Visitor Pass
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Digital visitor access pass
                    </p>

                </div>


                {/* qr */}
                <div className="flex justify-center mb-8">

                    <img
                        src={`${BASE_URL}/uploads/${pass.qrCodeUrl}`}
                        alt="QR Code"
                        className="w-56 h-56 border rounded-2xl p-3 bg-white"
                    />

                </div>


                {/* details */}
                <div className="space-y-5">

                    {/* visitor */}
                    <div className="flex items-start justify-between border-b pb-3">

                        <span className="text-gray-500">
                            Visitor
                        </span>

                        <span className="font-semibold text-gray-800 text-right">
                            {pass.visitor?.name}
                        </span>

                    </div>


                    {/* pass code */}
                    <div className="flex items-start justify-between border-b pb-3">

                        <span className="text-gray-500">
                            Pass Code
                        </span>

                        <span className="font-bold tracking-wide text-blue-600">
                            {pass.passCode}
                        </span>

                    </div>


                    {/* status */}
                    <div className="flex items-start justify-between border-b pb-3">

                        <span className="text-gray-500">
                            Status
                        </span>

                        <span className="capitalize bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">

                            {pass.status}

                        </span>

                    </div>


                    {/* expiry */}
                    <div className="flex items-start justify-between">

                        <span className="text-gray-500">
                            Expires
                        </span>

                        <span className="text-gray-800 font-medium text-right">
                            {
                                new Date(
                                    pass.expiresAt
                                ).toLocaleString()
                            }
                        </span>

                    </div>

                </div>


                {/* download */}
                <a
                    href={`${BASE_URL}/uploads/${pass.pdfUrl}`}
                    download
                    className="block mt-8"
                >

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
                    >
                        <Download size={20} />
                        Download Badge
                    </button>
                    
                </a>
            </div>
        </div>
    );
}