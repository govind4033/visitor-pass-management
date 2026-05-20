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


    // fetch appointments
    const fetchAppointments = async () => {

        try {

            const data = await getAppointments();

            setAppointments(data);

        } catch (err) {

            console.error(err);
        }
    };


    // fetch visitors
    const fetchVisitors = async () => {

        try {

            const data = await getVisitors();

            setVisitors(data);

        } catch (err) {

            console.error(err);
        }
    };


    // create appointment
    const handleCreate = async (formData) => {

        try {

            setLoading(true);

            const newAppointment =
                await createAppointment(formData);

            setAppointments((prev) => [
                newAppointment,
                ...prev
            ]);

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                'Failed to create appointment'
            );

        } finally {

            setLoading(false);
        }
    };


    // approve
    const handleApprove = async (id) => {

        try {

            const updated =
                await approveAppointment(id);

            setAppointments((prev) =>
                prev.map((item) =>
                    item._id === id
                    ? updated
                    : item
                )
            );

        } catch (err) {

            console.error(err);
        }
    };


    // reject
    const handleReject = async (id) => {

        try {

            const updated =
                await rejectAppointment(id);

            setAppointments((prev) =>
                prev.map((item) =>
                    item._id === id
                    ? updated
                    : item
                )
            );

        } catch (err) {

            console.error(err);
        }
    };


    // cancel
    const handleCancel = async (id) => {

        try {

            const updated =
                await cancelAppointment(id);

            setAppointments((prev) =>
                prev.map((item) =>
                    item._id === id
                    ? updated
                    : item
                )
            );

        } catch (err) {

            console.error(err);
        }
    };


    // complete
    const handleComplete = async (id) => {

        try {

            const updated =
                await completeAppointment(id);

            setAppointments((prev) =>
                prev.map((item) =>
                    item._id === id
                    ? updated
                    : item
                )
            );

        } catch (err) {

            console.error(err);
        }
    };


    // initial fetch
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


            {/* create form */}
            {
                user?.role === 'employee' && (

                    <AppointmentForm
                        visitors={visitors}
                        onSubmit={handleCreate}
                        loading={loading}
                    />
                )
            }


            {/* appointments list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {
                    appointments.length > 0 ? (

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

                    ) : (

                        <div className="bg-white rounded-3xl p-10 text-center text-gray-500 shadow-sm border border-gray-100 col-span-full">
                            No appointments found
                        </div>
                    )
                }

            </div>

        </div>
    );
}