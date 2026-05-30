import {
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Pencil,
  Trash2
} from 'lucide-react';

import { Link } from 'react-router-dom';

import defaultUser from '../../assets/Default-user.jpg';


export default function UserCard({ user, onDelete, showUpdate = true }) {

  const API = import.meta.env.VITE_BASE_URL.replace('/api', '');

  return (

    <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition duration-300">

      {/* ================= TOP ================= */}
      <div className="flex items-center gap-4 mb-6">

        {/* image */}
        <img
          src={
            user.photo
              ? `${API}/uploads/${user.photo}`
              : defaultUser
          }
          alt={user.name}
          className="w-20 h-20 rounded-2xl object-cover border"
        />

        {/* name + role */}
        <div className="flex-1">

          <h2 className="text-xl font-bold text-gray-800">

            {user.name}

          </h2>

          <span className="inline-block mt-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">

            {user.role}

          </span>

        </div>

      </div>


      {/* ================= INFO ================= */}
      <div className="space-y-4 text-gray-700">

        {/* email */}
        <div className="flex items-center gap-3">

          <Mail size={18} />

          <span className="text-sm">

            {user.email}

          </span>

        </div>


        {/* phone */}
        <div className="flex items-center gap-3">

          <Phone size={18} />

          <span className="text-sm">

            {user.phone || 'No phone'}

          </span>

        </div>


        {/* department */}
        <div className="flex items-center gap-3">

          <Building2 size={18} />

          <span className="text-sm">

            {user.department || 'No department'}

          </span>

        </div>


        {/* active */}
        <div className="flex items-center gap-3">

          <ShieldCheck size={18} />

          <span className={`text-sm font-medium ${
            user.isActive
              ? 'text-green-600'
              : 'text-red-500'
          }`}>

            {
              user.isActive
                ? 'Active'
                : 'Inactive'
            }

          </span>

        </div>

      </div>


        {/* ================= ACTIONS ================= */}
        <div className={`grid ${showUpdate ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mt-8`}>

            {/* update */}
            {
                showUpdate && (
                <Link
                    to={`/users/edit/${user._id}`}
                >

                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition">

                    <Pencil size={18} />

                    Update

                    </button>

                </Link>
                )
            }


            {/* delete */}
            <button
                onClick={() => onDelete(user._id)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-medium transition"
            >

                <Trash2 size={18} />

                Delete

            </button>

        </div>

    </div>
  );
}