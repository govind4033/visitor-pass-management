import { useEffect, useState } from "react";

import {
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
  Users
} from "lucide-react";

import toast from "react-hot-toast";

import { getMyVisitors } from "../../api/appointmentApi";

export default function MyVisitors() {

  const [visitors, setVisitors] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchVisitors();

  }, []);

  const fetchVisitors = async () => {

    try {

      const data = await getMyVisitors();

      setVisitors(data.visitors || []);

    } catch (err) {

      console.error(err);

      toast.error("Failed to load visitors");

    } finally {

      setLoading(false);

    }
  };

  if (loading) {

    return (

      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">

        <Loader2
          className="animate-spin text-blue-600"
          size={40}
        />

        <p className="text-gray-500 font-medium">
          Loading visitors...
        </p>

      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* heading */}
      <div>

        <h1 className="text-3xl font-bold text-gray-900">
          My Visitors
        </h1>

        <p className="text-gray-500 mt-1">
          Visitors connected with your appointments
        </p>

      </div>


      {/* empty state */}
      {
        visitors.length === 0 && (

          <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-16 text-center">

            <Users
              className="mx-auto text-gray-300 mb-4"
              size={48}
            />

            <h2 className="text-lg font-semibold text-gray-700">
              No visitors found
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Approved visitors will appear here
            </p>

          </div>
        )
      }


      {/* visitor cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {
          visitors.map((visitor) => (

            <div
              key={visitor._id}
              className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6"
            >

              {/* top */}
              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">

                  <User
                    className="text-blue-600"
                    size={24}
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    {visitor.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Visitor
                  </p>

                </div>

              </div>


              {/* info */}
              <div className="mt-6 space-y-4 text-sm">

                <div className="flex items-center gap-3 text-gray-600">

                  <Mail size={16} />

                  <span>
                    {visitor.email}
                  </span>

                </div>

                <div className="flex items-center gap-3 text-gray-600">

                  <Phone size={16} />

                  <span>
                    {visitor.phone}
                  </span>

                </div>

                <div className="flex items-center gap-3 text-gray-600">

                  <Calendar size={16} />

                  <span>

                    {
                      new Date(
                        visitor.appointmentDate
                      ).toLocaleDateString(undefined, {
                        dateStyle: "medium"
                      })
                    }

                  </span>

                </div>

              </div>


              {/* purpose */}
              <div className="mt-6">

                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Purpose
                </p>

                <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600">

                  {visitor.purpose}

                </div>

              </div>


              {/* status */}
              <div className="mt-5">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize

                  ${
                    visitor.appointmentStatus === "approved"
                      ? "bg-green-100 text-green-700"

                      : visitor.appointmentStatus === "completed"
                      ? "bg-blue-100 text-blue-700"

                      : "bg-gray-100 text-gray-600"
                  }`}
                >

                  {visitor.appointmentStatus}

                </span>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}