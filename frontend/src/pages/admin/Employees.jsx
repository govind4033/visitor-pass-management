import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import {
  Users,
  Plus,
  Search
} from 'lucide-react';

import UserCard from '../../components/cards/UserCard';

import {
  getUsers,
  deleteUser
} from '../../api/userApi';


export default function Employees() {

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');


  // =========================
  // fetch employees
  // =========================
  const fetchEmployees = async () => {

    try {

      const data = await getUsers('employee');

      setEmployees(data.users);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };


  // =========================
  // delete employee
  // =========================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      'Delete this employee?'
    );

    if (!confirmDelete) return;

    try {

      await deleteUser(id);

      fetchEmployees();

    } catch (error) {

      console.error(error);
    }
  };


  // =========================
  // initial fetch
  // =========================
  useEffect(() => {

    fetchEmployees();

  }, []);


  // =========================
  // search filter
  // =========================
  const filteredEmployees = employees.filter((employee) =>
    employee.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  // =========================
  // loading state
  // =========================
  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen text-gray-500">

        Loading employees...

      </div>
    );
  }


  return (

    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* title */}
        <div>

          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">

            <Users size={32} />

            Employees

          </h1>

          <p className="text-gray-500 mt-2">

            Manage all employee accounts

          </p>

        </div>


        {/* actions */}
        <div className="flex items-center gap-4">

          {/* search */}
          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-2xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />

          </div>


          {/* add employee */}
          <Link to="/users/new?role=employee">

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition">

              <Plus size={20} />

              Add Employee

            </button>

          </Link>

        </div>

      </div>


      {/* ================= EMPLOYEE LIST ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {
          filteredEmployees.length > 0 ? (

            filteredEmployees.map((employee) => (

              <UserCard
                key={employee._id}
                user={employee}
                onDelete={handleDelete}
              />
            ))

          ) : (

            <div className="col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">

              No employees found

            </div>
          )
        }

      </div>

    </div>
  );
}