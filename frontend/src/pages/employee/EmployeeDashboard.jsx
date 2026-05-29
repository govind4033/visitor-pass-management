import { useEffect, useState } from "react";

import {
  Clock,
  Calendar,
  CheckCircle,
  ClipboardList,
  Loader2
} from "lucide-react";

import { getAppointments } from "../../api/appointmentApi";

export default function EmployeeDashboard() {

  const [metrics, setMetrics] = useState({
    pending: 0,
    approved: 0,
    completed: 0,
    today: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchMetrics();

  }, []);

  const fetchMetrics = async () => {

    try {

      const data = await getAppointments();

      const appointments = data.appointments || [];

      const todayStr = new Date().toDateString();

      setMetrics({

        pending: appointments.filter(
          a => a.status === "pending"
        ).length,

        approved: appointments.filter(
          a => a.status === "approved"
        ).length,

        completed: appointments.filter(
          a => a.status === "completed"
        ).length,

        today: appointments.filter(
          a =>
            new Date(a.scheduledAt).toDateString() === todayStr
        ).length
      });

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Pending",
      value: metrics.pending,
      icon: Clock,
      color: "bg-yellow-500"
    },
    {
      title: "Approved",
      value: metrics.approved,
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Completed",
      value: metrics.completed,
      icon: ClipboardList,
      color: "bg-gray-700"
    },
    {
      title: "Today's Meetings",
      value: metrics.today,
      icon: Calendar,
      color: "bg-blue-600"
    }
  ];

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* heading */}
      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          Employee Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Overview of your appointments
        </p>

      </div>


      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {
          stats.map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4"
              >

                <div className={`${item.color} text-white p-4 rounded-2xl`}>

                  <Icon size={24} />

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-900">
                    {item.value}
                  </h2>

                </div>

              </div>
            );
          })
        }

      </div>

    </div>
  );
}