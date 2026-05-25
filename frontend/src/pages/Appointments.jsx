import { useEffect, useState } from 'react';

import AppointmentForm from '../components/AppointmentForm';
import AppointmentCard from '../components/AppointmentCard';

import { useAuth } from '../context/AuthContext';

import {
    createAppointment,
    getAppointments,
    approveAppointment,
    rejectAppointment,
    cancelAppointment,
    completeAppointment
} from '../api/appointmentApi';

import { getVisitors } from '../api/visitorApi';


export default function Appointments() {

    const { user } = useAuth();

    const [appointments, setAppointments] = useState([]);

    const [visitors, setVisitors] = useState([]);

    const [loading, setLoading] = useState(false);


    // ====================================
    // update appointment in state
    // ====================================
    const updateAppointment = (updatedData) => {

        setAppointments((prev) =>
            prev.map((item) =>
                item._id === updatedData._id
                    ? updatedData
                    : item
            )
        );
    };


    // ====================================
    // fetch appointments
    // ====================================
    const fetchAppointments = async () => {

        try {

            const data = await getAppointments();

            setAppointments(data.appointments);

        } catch (error) {

            console.error(error);
        }
    };


    // ====================================
    // fetch visitors
    // ====================================
    const fetchVisitors = async () => {

        try {

            const data = await getVisitors();

            setVisitors(data);

        } catch (error) {

            console.error(error);
        }
    };


    // ====================================
    // create appointment
    // ====================================
    const handleCreate = async (formData) => {

        try {

            setLoading(true);

            const newAppointment =
                await createAppointment(formData);

            setAppointments((prev) => [
                newAppointment,
                ...prev
            ]);

        } catch (error) {

            alert(
                error.response?.data?.message ||
                'Failed to create appointment'
            );

        } finally {

            setLoading(false);
        }
    };


    // ====================================
    // approve appointment
    // ====================================
    const handleApprove = async (id) => {

        try {

            const updated =
                await approveAppointment(id);

            updateAppointment(updated);

        } catch (error) {

            console.error(error);
        }
    };


    // ====================================
    // reject appointment
    // ====================================
    const handleReject = async (id) => {

        try {

            const updated =
                await rejectAppointment(id);

            updateAppointment(updated);

        } catch (error) {

            console.error(error);
        }
    };


    // ====================================
    // cancel appointment
    // ====================================
    const handleCancel = async (id) => {

        try {

            const updated =
                await cancelAppointment(id);

            updateAppointment(updated);

        } catch (error) {

            console.error(error);
        }
    };


    // ====================================
    // complete appointment
    // ====================================
    const handleComplete = async (id) => {

        try {

            const updated =
                await completeAppointment(id);

            updateAppointment(updated);

        } catch (error) {

            console.error(error);
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

                <h1 className="text-3xl font-bold text-gray-800">
                    Appointments
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage visitor appointments
                </p>

            </div>


            {/* appointment form */}
            {
                user?.role === 'employee' && (

                    <AppointmentForm
                        visitors={visitors}
                        onSubmit={handleCreate}
                        loading={loading}
                    />
                )
            }


            {/* appointment cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {
                    appointments.length === 0 ? (

                        <div className="col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">

                            No appointments found

                        </div>

                    ) : (

                        appointments.map((appointment) => (

                            <AppointmentCard
                                key={appointment._id}

                                appointment={appointment}

                                user={user}

                                onApprove={handleApprove}

                                onReject={handleReject}

                                onCancel={handleCancel}

                                onComplete={handleComplete}
                            />
                        ))
                    )
                }

            </div>

        </div>
    );
}