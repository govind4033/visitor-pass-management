import { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Phone,
  Camera
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerVisitor } from '../../api/authApi';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    idType: 'passport',
    idNumber: '',
    photo: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file
      });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.photo) {
      alert('Please upload a profile photo for verification.');
      return;
    }

    setLoading(true);

    try {
      const multipartData = new FormData();
      Object.keys(formData).forEach((key) => {
        multipartData.append(key, formData[key]);
      });

      multipartData.append('role', 'visitor');

      await registerVisitor(multipartData);
      alert('Visitor profile registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-900 to-blue-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="w-full max-w-xl bg-white/60 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 p-10 relative z-10">
        
        {/* Central Brand Icon */}
        <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-4">
          <UserPlus size={36} className="text-gray-700" />
        </div>

        <h1 className="text-3xl font-extrabold text-center text-gray-900 tracking-tight">
          Create Visitor Account
        </h1>
        <p className="text-gray-500 text-center mt-2 mb-8 text-sm">
          Set up basic credentials. Details for specific appointments will be filled when booking.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          
          {/* Section: Profile Image Capture */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl p-4 bg-gray-100/50 mb-2">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Verification Target Preview"
                className="w-24 h-24 object-cover rounded-full shadow-md border-2 border-white"
              />
            ) : (
              <Camera size={32} className="text-gray-400 mb-1" />
            )}
            <label className="mt-2 text-sm text-blue-600 font-semibold cursor-pointer hover:text-blue-700">
              Upload Verification Photo *
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Full Name */}
          <div className="relative">
            <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-100/80 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
          </div>

          {/* Email Address */}
          <div className="relative">
            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-100/80 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
          </div>

          {/* Secure Password Input */}
          <div className="relative">
            <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="Create Security Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-100/80 rounded-2xl py-4 pl-12 pr-14 outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Operational Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="phone"
                required
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-100/80 rounded-2xl py-4 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
              />
            </div>

            <input
              type="text"
              name="company"
              placeholder="Company / Org Name"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-gray-100/80 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
          </div>

          {/* Credentials Validation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              className="w-full bg-gray-100/80 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 bg-white"
            >
              <option value="passport">Passport Document</option>
              <option value="aadhar">[Aadhaar Redacted]</option>
              <option value="driving_license">Driving License</option>
              <option value="other">Other Govt ID Identification</option>
            </select>

            <input
              type="text"
              name="idNumber"
              required
              placeholder="Document ID Number"
              value={formData.idNumber}
              onChange={handleChange}
              className="w-full bg-gray-100/80 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            />
          </div>

          {/* Execution Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 rounded-2xl bg-gray-900 hover:bg-black text-white text-lg font-semibold tracking-wide transition active:scale-[0.99] disabled:bg-gray-400"
          >
            {loading ? 'Processing Registration...' : 'Register Visitor Profile'}
          </button>
        </form>

        {/* Footer Navigation */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have a registration layout?
          <Link to="/login" className="ml-2 text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}