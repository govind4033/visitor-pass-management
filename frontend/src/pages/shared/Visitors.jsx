import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import {
    Users,
    Plus
} from 'lucide-react';

import VisitorCard from '../../components/VisitorCard';

import { deleteVisitor, getVisitors } from '../../api/visitorApi';


export default function Visitors() {

    const [visitors, setVisitors] = useState([]);

    const [loading, setLoading] = useState(true);

    const handleDelete = async (id) => {
        try {
            await deleteVisitor(id);
            fetchVisitors();
        } catch (err) {
            console.error(err);
        }
    };


    // =========================
    // fetch visitors
    // =========================
    const fetchVisitors = async () => {

        try {

            const data = await getVisitors();

            setVisitors(data.visitors);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // initial fetch
    // =========================
    useEffect(() => {

        fetchVisitors();

    }, []);


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
            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">

                        <Users size={32} />

                        Visitors

                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage all registered visitors
                    </p>

                </div>


                {/* add visitor */}
                <Link to="/visitors/new">

                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 transition">

                        <Plus size={20} />

                        Add Visitor

                    </button>

                </Link>

            </div>


            {/* visitor list */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {
                    visitors.length > 0 ? (

                        visitors.map((visitor) => (

                            <VisitorCard
                                key={visitor._id}
                                visitor={visitor}
                                onDelete={handleDelete}
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