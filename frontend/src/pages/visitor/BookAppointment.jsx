import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  User,
  Calendar,
  Clock,
  FileText,
  Loader2
} from 'lucide-react';
import { getUsers } from '../../api/userApi';
import { createAppointment } from '../../api/appointmentApi';

export default function BookAppointment() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    hostId: '',
    visitDate: '',
    visitTime: '',
    purpose: '',
    notes: ''
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Reusing your application query logic to isolate only employees
        const data = await getUsers('employee');
        
        // Handle variations in your server API wrappers safely
        setEmployees(data.users || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load company host directory.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Dispatch tracking properties straight to your controller
      await createAppointment(formData);
      
      toast.success('Appointment submitted successfully!');
      navigate('/visitor');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to request appointment pass.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">Assembling appointment configuration context...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-8 space-y-6">
        
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Schedule a Visit</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your meeting parameters to dispatch a digital access authorization permit.</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          
          {/* Host Employee Selection Dropdown */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Select Host Employee *</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="hostId"
                required
                value={formData.hostId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
              >
                <option value="">N/A</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} {emp.department ? `— (${emp.department})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time Metrics Split Layout Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Visit Date *</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="visitDate"
                  required
                  min={new Date().toISOString().split('T')[0]} // Prevents historical dates selection
                  value={formData.visitDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Arrival Time *</label>
              <div className="relative">
                <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="visitTime"
                  required
                  value={formData.visitTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Core Visit Objective (Maps to Schema purpose field) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Purpose of Visit *</label>
            <div className="relative">
              <FileText size={18} className="absolute left-4 top-4 text-gray-400" />
              <textarea
                name="purpose"
                required
                rows="3"
                placeholder="description in detail (e.g. Delivery, Interview...)"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400 resize-none text-gray-800"
              />
            </div>
          </div>

          {/* Notes Input Field (Maps directly to Schema notes field) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Additional Notes / Asset Declarations (Optional)</label>
            <textarea
              name="notes"
              rows="2"
              placeholder="Additional info "
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-blue-400 resize-none text-gray-800"
            />
          </div>

          {/* Trigger Request Submission Action Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-semibold shadow-md transition duration-150 active:scale-[0.99] mt-2 flex items-center justify-center"
          >
            {submitting ? 'Transmitting Request Parameters...' : 'Request Entry Appointment'}
          </button>

        </form>
      </div>
    </div>
  );
}