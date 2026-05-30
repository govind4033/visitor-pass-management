import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    getVisitorById,
    updateVisitor
} from '../../api/visitorApi';

export default function EditVisitor() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        visitDate: '',
        photo: null
    });

    const [loading, setLoading] = useState(true);

    // fetch existing visitor
    useEffect(() => {

        const fetchVisitor = async () => {

            try {

                const data =
                    await getVisitorById(id);

                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    company: data.company || '',
                    visitDate: data.visitDate
                        ? data.visitDate.split('T')[0]
                        : ''
                });

            } catch (err) {

                console.error(err);
                alert('Failed to load visitor');

            } finally {

                setLoading(false);
            }
        };

        fetchVisitor();

    }, [id]);



    // input change
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // update visitor
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = new FormData();

            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('company', formData.company);
            data.append('visitDate', formData.visitDate);

            // optional photo
            if (formData.photo) {
                data.append('photo', formData.photo);
            }

            await updateVisitor(id, data);

            alert('Visitor updated successfully');

            navigate('/visitors');

        } catch (err) {

            console.error(err);

            alert('Failed to update visitor');
        }
    };


    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }


    return (

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow">

            <h1 className="text-3xl font-bold mb-6">
                Edit Visitor
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="date"
                    name="visitDate"
                    value={formData.visitDate}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            photo: e.target.files[0]
                        })
                    }
                    className="w-full border p-3 rounded-xl"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                >
                    Update Visitor
                </button>

            </form>

        </div>
    );
}