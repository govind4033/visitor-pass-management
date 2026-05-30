import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  getAppointments,
  approveAppointment,
  rejectAppointment,
  completeAppointment
} from "../../api/appointmentApi";

import AppointmentCard from "../../components/cards/AppointmentCard";

export default function ManageAppointments() {

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {

    fetchAppointments();

  }, []);

  const fetchAppointments = async () => {

    try {

      const data = await getAppointments();

      setAppointments(data.appointments || []);

    } catch (err) {

      console.error(err);

      toast.error("Failed to fetch appointments");

    } finally {

      setLoading(false);
    }
  };

  const handleApprove = async (id) => {

    try {

      setProcessingId(id);

      await approveAppointment(id);

      toast.success("Appointment approved");

      fetchAppointments();

    } catch (err) {

      toast.error(err.response?.data?.message);

    } finally {

      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {

    try {

      setProcessingId(id);

      await rejectAppointment(id);

      toast.success("Appointment rejected");

      fetchAppointments();

    } catch (err) {

      toast.error(err.response?.data?.message);

    } finally {

      setProcessingId(null);
    }
  };

  const handleComplete = async (id) => {

    try {

      setProcessingId(id);

      await completeAppointment(id);

      toast.success("Appointment completed");

      fetchAppointments();

    } catch (err) {

      toast.error(err.response?.data?.message);

    } finally {

      setProcessingId(null);
    }
  };

  if (loading) {

    return (
      <div className="text-center py-20 text-gray-500">
        Loading appointments...
      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* heading */}
      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Manage Appointments
        </h1>

        <p className="text-gray-500 mt-1">
          Approve or manage visitor meetings
        </p>

      </div>


      {/* cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {
          appointments.map((appointment) => (

            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onApprove={handleApprove}
              onReject={handleReject}
              onComplete={handleComplete}
              processingId={processingId}
            />
          ))
        }

      </div>

    </div>
  );
}