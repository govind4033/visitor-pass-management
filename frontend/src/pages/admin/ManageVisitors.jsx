import { useEffect, useState } from 'react';

import {
  Users,
  Search
} from 'lucide-react';

import UserCard from '../../components/UserCard';

import {
  getUsers,
  deleteUser
} from '../../api/userApi';


export default function ManageVisitors() {

  const [visitors, setVisitors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');


  // =========================
  // fetch visitors
  // =========================
  const fetchVisitors = async () => {

    try {

      const data = await getUsers('visitor');

      // support all possible backend shapes
      setVisitors(
        data.users ||
        data.visitors ||
        data ||
        []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  };


  // =========================
  // delete visitor
  // =========================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      'Delete this visitor?'
    );

    if (!confirmDelete) return;

    try {

      await deleteUser(id);

      fetchVisitors();

    } catch (error) {

      console.error(error);
    }
  };


  // =========================
  // initial fetch
  // =========================
  useEffect(() => {

    fetchVisitors();

  }, []);


  // =========================
  // search filter
  // =========================
  const filteredVisitors = visitors.filter((visitor) =>
    visitor.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );


  // loading
  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen text-gray-500">

        Loading visitors...

      </div>
    );
  }


  return (

    <div className="space-y-8">

      {/* heading */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">

            <Users size={32} />

            Visitor Accounts

          </h1>

          <p className="text-gray-500 mt-2">

            Manage registered visitor accounts

          </p>

        </div>


        {/* search */}
        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search visitor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-2xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />

        </div>

      </div>


      {/* visitors */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {
          filteredVisitors.length > 0 ? (

            filteredVisitors.map((visitor) => (

              <UserCard
                key={visitor._id}
                user={visitor}
                onDelete={handleDelete}
                showUpdate={false}
              />
            ))

          ) : (

            <div className="col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">

              No visitors found

            </div>
          )
        }

      </div>

    </div>
  );
}