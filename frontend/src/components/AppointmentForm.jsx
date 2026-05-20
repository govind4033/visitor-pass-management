import { useState } from 'react';

export default function AppointmentForm({
    visitors = [],
    onSubmit,
    loading = false
}) {

    const [formData, setFormData] = useState({
        visitor: '',
        scheduledAt: '',
        purpose: '',
        notes: ''
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);

        // reset form
        setFormData({
            visitor: '',
            scheduledAt: '',
            purpose: '',
            notes: ''
        });
    };

    return (

        <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Create Appointment
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* visitor */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Visitor
                    </label>

                    <select
                        name="visitor"
                        value={formData.visitor}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">
                            Choose Visitor
                        </option>

                        {
                            visitors.map((visitor) => (
                                <option
                                    key={visitor._id}
                                    value={visitor._id}
                                >
                                    {visitor.name}
                                </option>
                            ))
                        }
                    </select>
                </div>


                {/* date and time */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schedule Date & Time
                    </label>

                    <input
                        type="datetime-local"
                        name="scheduledAt"
                        value={formData.scheduledAt}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>


                {/* purpose */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purpose
                    </label>

                    <input
                        type="text"
                        name="purpose"
                        placeholder="Meeting purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>


                {/* notes */}
                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                    </label>

                    <textarea
                        name="notes"
                        rows="4"
                        placeholder="Additional notes..."
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    />
                </div>


                {/* submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition"
                >
                    {
                        loading
                        ? 'Creating...'
                        : 'Create Appointment'
                    }
                </button>

            </form>

        </div>
    );
}