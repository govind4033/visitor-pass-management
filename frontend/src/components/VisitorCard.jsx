import {
    Mail,
    Phone,
    Building2,
    CalendarDays,
    Eye,
    Pencil,
    Trash2,
    BadgeCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import defaultUser from '../assets/Default-user.jpg';
import { useNavigate } from 'react-router-dom';
import { generatePass } from '../api/passApi';
import { useState } from 'react';

export default function VisitorCard({
    visitor,
    onDelete
}) {

    const navigate = useNavigate();
    const [issuing, setIssuing] = useState(false);
    const [issued, setIssued] = useState(false);

    const API = import.meta.env.VITE_BASE_URL.replace('/api', '');

    const handleGeneratePass = async () => {
        try {

            setIssuing(true);

            const data = await generatePass(visitor._id);

            // success
            setIssued(true);

            alert('Pass generated successfully');

            navigate(`/passes/${data.pass._id}`);

        } catch (error) {

            console.error(error);

            // already generated
            if (
                error.response?.status === 400
            ) {

                alert('Pass already generated for today');

                setIssued(true);

            } else {

                alert('Failed to generate pass. Try again.');
            }

        } finally {

            setIssuing(false);
        }
    };

    return (

        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition duration-300">

            {/* top */}
            <div className="flex items-center gap-4 mb-6">

                {/* photo */}
                <img
                    src={
                        visitor.photo
                            ? `${API}/uploads/${visitor.photo}`
                            : defaultUser
                    }
                    alt={visitor.name}
                    className="w-20 h-20 rounded-2xl object-cover border"
                />


                {/* name */}
                <div className="flex-1">

                    <h2 className="text-xl font-bold text-gray-800">
                        {visitor.name}
                    </h2>

                    <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">

                        {visitor.status || 'visitor'}

                    </span>

                </div>

            </div>


            {/* info */}
            <div className="space-y-4 text-gray-700">

                {/* email */}
                <div className="flex items-center gap-3">

                    <Mail size={18} />

                    <span className="text-sm">
                        {visitor.email}
                    </span>

                </div>


                {/* phone */}
                <div className="flex items-center gap-3">

                    <Phone size={18} />

                    <span className="text-sm">
                        {visitor.phone}
                    </span>

                </div>


                {/* company */}
                <div className="flex items-center gap-3">

                    <Building2 size={18} />

                    <span className="text-sm">
                        {visitor.company || 'No company'}
                    </span>

                </div>


                {/* visit date */}
                <div className="flex items-center gap-3">

                    <CalendarDays size={18} />

                    <span className="text-sm">

                        {
                            visitor.visitDate
                                ? new Date(
                                    visitor.visitDate
                                ).toLocaleDateString()
                                : 'No date'
                        }

                    </span>

                </div>

            </div>


            {/* actions */}
            <div className="grid grid-cols-2 gap-3 mt-8">

                {/* view */}
                <Link
                    to={`/visitors/${visitor._id}`}
                >

                    <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium transition">

                        <Eye size={18} />

                        View

                    </button>

                </Link>


                {/* edit */}
                <Link
                    to={`/visitors/edit/${visitor._id}`}
                >

                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition">

                        <Pencil size={18} />

                        Edit

                    </button>

                </Link>


                {/* delete */}
                <button
                    onClick={() => onDelete(visitor._id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-medium transition"
                >

                    <Trash2 size={18} />

                    Delete

                </button>

                {/* generate pass */}
                <button
                    onClick={handleGeneratePass}
                    disabled={issuing || issued}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition text-white
                        ${
                            issued
                                ? 'bg-gray-500 cursor-not-allowed'
                                : issuing
                                ? 'bg-green-400 cursor-wait'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                >
                    {
                        issuing
                            ? 'Issuing...'
                            : issued
                            ? 'Issued'
                            : 'Issue Pass'
                    }
                </button>

            </div>

        </div>
    );
}