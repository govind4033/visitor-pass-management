import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Loader2,
  Ticket
} from "lucide-react";

import toast from "react-hot-toast";

import {
  getAppointments,
  cancelAppointment
} from "../../api/appointmentApi";

import { generatePass } from "../../api/passApi";

import VerifyAppointCard from "../../components/cards/VerifyAppointCard";

export default function VerifyAppointments() {

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // unified processing state (IMPORTANT FIX)
  const [processing, setProcessing] = useState({
    id: null,
    action: null
  });

  // FETCH APPOINTMENTS
  const fetchAppointments = async () => {
    try {

      const data = await getAppointments();

      const approved =
        (data.appointments || []).filter(
          (appt) => appt.status === "approved"
        );

      setAppointments(approved);
      setFilteredAppointments(approved);

    } catch (err) {

      console.error(err);
      toast.error("Failed to load appointments.");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // SEARCH FILTER
  useEffect(() => {

    const value = search.toLowerCase();

    const filtered = appointments.filter((appt) =>
      appt.visitor?.name?.toLowerCase().includes(value) ||
      appt.visitor?.email?.toLowerCase().includes(value) ||
      appt.host?.name?.toLowerCase().includes(value) ||
      appt.purpose?.toLowerCase().includes(value)
    );

    setFilteredAppointments(filtered);

  }, [search, appointments]);

  // GENERATE PASS
  const handleGeneratePass = async (appointment) => {

    try {

      setProcessing({ id: appointment._id, action: "generate" });

      const data = await generatePass({
        visitorId: appointment.visitor._id,
        appointmentId: appointment._id
      });

      toast.success("Pass generated successfully");

      await fetchAppointments();

      // redirect to passes page
      navigate("/passes");

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to generate pass"
      );

    } finally {

      setProcessing({ id: null, action: null });

    }
  };

  // CANCEL APPOINTMENT
  const handleCancelAppointment = async (id) => {

    try {

      setProcessing({ id, action: "cancel" });

      await cancelAppointment(id);

      toast.success("Appointment cancelled");

      fetchAppointments();

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to cancel appointment"
      );

    } finally {

      setProcessing({ id: null, action: null });

    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-3">
        <Loader2 size={40} className="animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">
          Loading approved appointments...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          Verify Appointments
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate passes or cancel approved appointments
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search visitor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* CARDS */}
      {filteredAppointments.length > 0 ? (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {filteredAppointments.map((appt) => (

            <VerifyAppointCard
              key={appt._id}
              appointment={appt}
              processing={processing}
              onGeneratePass={handleGeneratePass}
              onCancel={handleCancelAppointment}
            />

          ))}

        </div>

      ) : (

        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-16 text-center text-gray-400">

          <Ticket size={42} className="mx-auto mb-3 text-gray-300" />

          <p className="font-medium">
            No approved appointments found.
          </p>

        </div>

      )}

    </div>
  );
}