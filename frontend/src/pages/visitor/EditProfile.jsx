import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getProfile,
    updateProfile
} from '../../api/userApi';

export default function EditProfile() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        photo: null
    });

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await getProfile();

                const user = res.data;

                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    photo: null
                });

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);
            }
        };

        fetchProfile();

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = new FormData();

            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);

            if (formData.photo) {
                data.append('photo', formData.photo);
            }

            await updateProfile(data);

            alert('Profile updated successfully');

            navigate('/profile');

        } catch (err) {

            console.error(err);

            alert('Failed to update profile');
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
                Edit Profile
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border p-3 rounded-xl"
                />

                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
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
                    Update Profile
                </button>

            </form>

        </div>
    );
}