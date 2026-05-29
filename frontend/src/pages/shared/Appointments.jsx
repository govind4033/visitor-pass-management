import { useEffect, useState } from 'react';
import AppointmentForm from '../../components/AppointmentForm';
import AppointmentCard from '../../components/AppointmentCard';
import { useAuth } from '../../context/AuthContext';
import {
    createAppointment,
    getAppointments,
    approveAppointment,
    rejectAppointment,
    cancelAppointment,
    completeAppointment
} from '../../api/appointmentApi';
import { getVisitors } from '../../api/visitorApi';

export default function Appointments() {
    const { user } = useAuth();

    const [appointments, setAppointments] = useState([]);
    const [visitors, setVisitors] = useState([]);
    
    // Global loading for initial page data fetch
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    // Contextual loading state for handling card actions
    const [actionLoading, setActionLoading] = useState({
        id: null,
        action: ''
    });

    // ====================================
    // update appointment in state
    // ====================================
    const updateAppointment = (updatedData) => {
        setAppointments((prev) =>
            prev.map((item) =>
                item._id === updatedData._id ? updatedData : item
            )
        );
    };

    // ====================================
    // fetch appointments
    // ====================================
    const fetchAppointments = async () => {
        try {
            setPageLoading(true);
            const data = await getAppointments();
            setAppointments(data.appointments || []);
        } finally {
            setPageLoading(false);
        }
    };

    // ====================================
    // fetch visitors
    // ====================================
    const fetchVisitors = async () => {
        try {
            const data = await getVisitors();
            setVisitors(data.visitors || []);
        } catch (error) {
            console.error(error);
        }
    };

    // ====================================
    // create appointment
    // ====================================
    const handleCreate = async (formData) => {
        try {
            setCreateLoading(true);

            const res = await createAppointment(formData);

            const appointment = res.appointment;

            setAppointments((prev) => [appointment, ...prev]);

            alert("Appointment created successfully"); // ✅ SUCCESS MESSAGE

        } catch (error) {
            alert(error.response?.data?.message || "Failed to create appointment");
        } finally {
            setCreateLoading(false);
        }
    };

    // ====================================
    // approve appointment
    // ====================================
    const handleApprove = async (id) => {
        try {
            setActionLoading({ id, action: 'approve' });
            const updated = await approveAppointment(id);
            updateAppointment(updated.appointment);
        } catch (error) {
            console.error(error);
            alert('Failed to approve appointment');
        } finally {
            setActionLoading({ id: null, action: '' });
        }
    };

    // ====================================
    // reject appointment
    // ====================================
    const handleReject = async (id) => {
        try {
            setActionLoading({ id, action: 'reject' });
            const updated = await rejectAppointment(id);
            updateAppointment(updated.appointment);
        } catch (error) {
            console.error(error);
            alert('Failed to reject appointment');
        } finally {
            setActionLoading({ id: null, action: '' });
        }
    };

    // ====================================
    // cancel appointment
    // ====================================
    const handleCancel = async (id) => {
        try {
            setActionLoading({ id, action: 'cancel' });
            const updated = await cancelAppointment(id);
            updateAppointment(updated.appointment);
        } catch (error) {
            console.error(error);
            alert('Failed to cancel appointment');
        } finally {
            setActionLoading({ id: null, action: '' });
        }
    };

    // ====================================
    // complete appointment
    // ====================================
    const handleComplete = async (id) => {
        try {
            setActionLoading({ id, action: 'complete' });
            const updated = await completeAppointment(id);
            updateAppointment(updated.appointment);
        } catch (error) {
            console.error(error);
            alert('Failed to complete appointment');
        } finally {
            setActionLoading({ id: null, action: '' });
        }
    };

    // ====================================
    // initial fetch
    // ====================================
    useEffect(() => {
        fetchAppointments();
        fetchVisitors();
    }, []);

    return (
        <div className="space-y-8">
            {/* heading */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
                <p className="text-gray-500 mt-1">Manage visitor appointments</p>
            </div>

            {/* appointment form */}
            {user?.role === 'employee' && (
                <AppointmentForm
                    visitors={visitors}
                    onSubmit={handleCreate}
                    loading={createLoading}
                />
            )}

            {/* appointment cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading && appointments.length === 0 ? (
                    <div className="col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">
                        Loading appointments...
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">
                        No appointments found
                    </div>
                ) : (
                    appointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment._id}
                            appointment={appointment}
                            user={user}
                            loading={actionLoading}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onCancel={handleCancel}
                            onComplete={handleComplete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}