import {
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  User,
  FileText
} from "lucide-react";

export default function AppointmentCard({
  appointment,
  onApprove,
  onReject,
  onComplete,
  processingId
}) {

  const date = new Date(appointment.scheduledAt);

  return (

    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

      {/* top */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">

            <User className="text-blue-600" size={20} />

          </div>

          <div>

            <h2 className="font-bold text-gray-900 text-lg">
              {appointment.visitor?.name}
            </h2>

            <p className="text-sm text-gray-500">
              {appointment.visitor?.phone}
            </p>

          </div>

        </div>


        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize

          ${
            appointment.status === "pending"
              ? "bg-yellow-100 text-yellow-700"

              : appointment.status === "approved"
              ? "bg-green-100 text-green-700"

              : appointment.status === "completed"
              ? "bg-gray-200 text-gray-700"

              : "bg-red-100 text-red-700"
          }`}
        >

          {appointment.status}

        </span>

      </div>


      {/* date */}
      <div className="grid grid-cols-2 gap-4 text-sm">

        <div className="flex items-center gap-2 text-gray-600">

          <Calendar size={16} />

          {date.toLocaleDateString()}

        </div>

        <div className="flex items-center gap-2 text-gray-600">

          <Clock size={16} />

          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}

        </div>

      </div>


      {/* purpose */}
      <div>

        <p className="text-sm font-semibold text-gray-700 mb-1">
          Purpose
        </p>

        <p className="text-gray-600 text-sm">
          {appointment.purpose}
        </p>

      </div>


      {/* notes */}
      {
        appointment.notes && (

          <div className="bg-blue-50 rounded-xl p-3 flex gap-2">

            <FileText
              size={16}
              className="text-blue-600 mt-0.5"
            />

            <p className="text-sm text-blue-700">
              {appointment.notes}
            </p>

          </div>
        )
      }


      {/* buttons */}
      <div className="flex gap-3 pt-2">

        {
          appointment.status === "pending" && (

            <>
              <button
                disabled={processingId}
                onClick={() => onApprove(appointment._id)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >

                <CheckCircle size={18} />

                Approve

              </button>

              <button
                disabled={processingId}
                onClick={() => onReject(appointment._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >

                <XCircle size={18} />

                Reject

              </button>
            </>
          )
        }


        {
          appointment.status === "approved" && (

            <button
              disabled={processingId}
              onClick={() => onComplete(appointment._id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >

              Complete Appointment

            </button>
          )
        }

      </div>

    </div>
  );
}