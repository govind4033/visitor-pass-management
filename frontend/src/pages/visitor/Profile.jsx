import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Loader2,
  Mail,
  Phone,
  Shield,
  Building2,
  Calendar,
  Edit
} from "lucide-react";

import { getProfile } from "../../api/userApi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2
          size={42}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Profile not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow border border-gray-100 p-8">

          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Photo */}
            <img
              src={
                user.photo
                  ? `http://localhost:4004/uploads/${user.photo}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name
                    )}&background=random`
              }
              alt={user.name}
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-100 shadow"
            />

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">

              <h1 className="text-3xl font-bold text-gray-800">
                {user.name}
              </h1>

              <p className="text-gray-500 mt-2">
                {user.email}
              </p>

              <span className="inline-block mt-4 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold capitalize">
                {user.role}
              </span>

            </div>

            {/* Edit Button */}
            <button
              onClick={() => navigate("/profile/edit")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              <Edit size={18} />
              Edit Profile
            </button>

          </div>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {/* Email */}
          <div className="bg-white rounded-3xl shadow border p-6">

            <div className="flex items-center gap-3 mb-3">
              <Mail size={20} className="text-blue-600" />
              <h3 className="font-semibold text-gray-800">
                Email
              </h3>
            </div>

            <p className="text-gray-600">
              {user.email}
            </p>

          </div>

          {/* Phone */}
          <div className="bg-white rounded-3xl shadow border p-6">

            <div className="flex items-center gap-3 mb-3">
              <Phone size={20} className="text-green-600" />
              <h3 className="font-semibold text-gray-800">
                Phone
              </h3>
            </div>

            <p className="text-gray-600">
              {user.phone || "Not Provided"}
            </p>

          </div>

          {/* Role */}
          <div className="bg-white rounded-3xl shadow border p-6">

            <div className="flex items-center gap-3 mb-3">
              <Shield size={20} className="text-purple-600" />
              <h3 className="font-semibold text-gray-800">
                Role
              </h3>
            </div>

            <p className="text-gray-600 capitalize">
              {user.role}
            </p>

          </div>

          {/* Department */}
          <div className="bg-white rounded-3xl shadow border p-6">

            <div className="flex items-center gap-3 mb-3">
              <Building2 size={20} className="text-orange-600" />
              <h3 className="font-semibold text-gray-800">
                Department
              </h3>
            </div>

            <p className="text-gray-600">
              {user.department || "N/A"}
            </p>

          </div>

          {/* Created Date */}
          <div className="bg-white rounded-3xl shadow border p-6 md:col-span-2">

            <div className="flex items-center gap-3 mb-3">
              <Calendar size={20} className="text-red-600" />
              <h3 className="font-semibold text-gray-800">
                Account Created
              </h3>
            </div>

            <p className="text-gray-600">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}