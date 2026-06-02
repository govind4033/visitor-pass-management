import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../api/authApi';

export default function Login() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
          // Send request to your new unified API endpoint
          const data = await loginUser(formData);
          
          // Your backend unified payload returns: { success, token, role, user }
          const { user, token } = data;
          const role = user.role;

          // Commit to storage (including role info)
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);

          // Update Global Context State
          dispatch({
              type: 'LOGIN',
              payload: { user, token, role }
          });


          // Role-Based Smart Navigation
          switch (role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'security':
              navigate('/Security');
              break;
            case 'employee':
              navigate('/Employee');
              break;
            case 'visitor':
              navigate('/Visitor');
              break;
            default:
              navigate('/login'); // fallback generic path
          }

      } catch (err) {
          // Catching specific API errors or standard messages
          alert(err.response?.data?.error || err.response?.data?.message || 'Login failed');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 to-blue-50 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 p-10 relative z-10">

        {/* Central Icon */}
        <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-8">
          <LogIn size={36} className="text-gray-700" />
        </div>

        {/* Headings */}
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Welcome Back 
        </h1>

        <p className="text-gray-500 text-center mt-3 mb-10 text-lg">
          Sign in to access your portal space
        </p>

        {/* Authorization Input Block */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email input field */}
          <div className="relative">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-gray-100/80 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            />
          </div>

          {/* Password input field */}
          <div className="relative">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-gray-100/80 rounded-2xl py-4 pl-12 pr-14 outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-b from-gray-900 to-black text-white text-lg font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

        </form>

        {/* Public Visitor Registration Call to Action Footer */}
        <p className="text-center text-gray-500 mt-8">
          Are you a visitor?
          <Link
            to="/register"
            className="ml-2 text-blue-600 font-semibold hover:underline"
          >
            Pre-register here
          </Link>
        </p>

      </div>
    </div>
  );
}