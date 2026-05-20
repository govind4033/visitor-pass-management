import {
    CalendarDays,
    Clock,
    FileText,
    User,
    StickyNote
} from 'lucide-react';

export default function AppointmentCard({
    appointment,
    user,
    onApprove,
    onReject,
    onCancel,
    onComplete
}) {

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        completed: 'bg-blue-100 text-blue-700',
        cancelled: 'bg-gray-100 text-gray-700'
    };

    const formattedDate = new Date(
        appointment.scheduledAt
    ).toLocaleString();

    return (

        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 space-y-5">

            {/* top */}
            <div className="flex items-start justify-between">

                <div>

                    <h3 className="text-xl font-bold text-gray-800">
                        {appointment.visitor?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                        Visitor Appointment
                    </p>

                </div>

                <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold capitalize ${statusColors[appointment.status]}`}
                >
                    {appointment.status}
                </span>

            </div>


            {/* info */}
            <div className="space-y-3 text-gray-700">

                {/* host */}
                <div className="flex items-center gap-3">

                    <User size={18} />

                    <span>
                        Host: {appointment.host?.name}
                    </span>

                </div>


                {/* datetime */}
                <div className="flex items-center gap-3">

                    <CalendarDays size={18} />

                    <span>
                        {formattedDate}
                    </span>

                </div>


                {/* purpose */}
                <div className="flex items-start gap-3">

                    <FileText
                        size={18}
                        className="mt-1"
                    />

                    <span>
                        {appointment.purpose}
                    </span>

                </div>


                {/* notes */}
                {
                    appointment.notes && (

                        <div className="flex items-start gap-3">

                            <StickyNote
                                size={18}
                                className="mt-1"
                            />

                            <span>
                                {appointment.notes}
                            </span>

                        </div>
                    )
                }

            </div>


            {/* actions */}
            <div className="flex flex-wrap gap-3 pt-3">

                {/* admin / security */}
                {
                    user?.role !== 'employee' &&
                    appointment.status === 'pending' && (

                        <>
                            <button
                                onClick={() => onApprove(appointment._id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => onReject(appointment._id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition"
                            >
                                Reject
                            </button>
                        </>
                    )
                }


                {/* complete */}
                {
                    user?.role !== 'employee' &&
                    appointment.status === 'approved' && (

                        <button
                            onClick={() => onComplete(appointment._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition"
                        >
                            Complete
                        </button>
                    )
                }


                {/* employee cancel */}
                {
                    user?.role === 'employee' &&
                    ['pending', 'approved'].includes(appointment.status) && (

                        <button
                            onClick={() => onCancel(appointment._id)}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-medium transition"
                        >
                            Cancel
                        </button>
                    )
                }

            </div>

        </div>
    );
}