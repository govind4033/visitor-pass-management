import {
  BadgeCheck,
  User,
  Building2,
  Calendar,
  Clock,
  FileText,
  Ticket,
  XCircle,
  Loader2
} from "lucide-react";

export default function VerifyAppointCard({
  appointment,
  processing,
  onGeneratePass,
  onCancel
}) {

  const date = new Date(appointment.scheduledAt);

  const isGenerating =
    processing.id === appointment._id &&
    processing.action === "generate";

  const isCancelling =
    processing.id === appointment._id &&
    processing.action === "cancel";

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-5">

      {/* TOP */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-2">

          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            {appointment.visitor?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="font-bold text-lg text-gray-900">
              {appointment.visitor?.name}
            </h2>

            <p className="text-sm text-gray-500">
              {appointment.visitor?.email}
            </p>
          </div>

        </div>

        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <BadgeCheck size={12} />
          Approved
        </span>

      </div>

      {/* INFO */}
      <div className="space-y-3 text-sm">

        <div className="flex items-center gap-2 text-gray-700">
          <User size={16} className="text-gray-400" />
          Host: {appointment.host?.name}
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Building2 size={16} className="text-gray-400" />
          {appointment.host?.department || "No Department"}
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={16} className="text-gray-400" />
          {date.toLocaleDateString()}
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={16} className="text-gray-400" />
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </div>

        <div className="flex items-start gap-2 text-gray-700">

          <FileText size={16} className="text-gray-400 mt-0.5" />

          <div>
            <p className="font-medium">
              {appointment.purpose}
            </p>

            {appointment.notes && (
              <p className="text-xs text-gray-500 mt-1">
                Notes: {appointment.notes}
              </p>
            )}
          </div>

        </div>

      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 pt-2">

        {/* GENERATE PASS */}
        <button
          disabled={isGenerating || isCancelling}
          onClick={() => onGeneratePass(appointment)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <Ticket size={18} />
              Generate Pass
            </>
          )}
        </button>

        {/* CANCEL */}
        <button
          disabled={isGenerating || isCancelling}
          onClick={() => onCancel(appointment._id)}
          className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
        >
          {isCancelling ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Cancelling...
            </>
          ) : (
            <>
              <XCircle size={18} />
              Cancel
            </>
          )}
        </button>

      </div>

    </div>
  );
}