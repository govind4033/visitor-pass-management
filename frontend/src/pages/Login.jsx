import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authApi";

export default function Login() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          const data = await loginUser(formData);
          const { user, token } = data;

          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);

          dispatch({
              type: 'LOGIN',
              payload: { user, token }
          });

          navigate('/dashboard');

      } catch (err) {
          alert( err.response?.data?.message || 'Login failed' );
      }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 to-blue-50 flex items-center justify-center px-4 relative overflow-hidden">

      {/* card */}
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-[40px] shadow-2xl border border-white/40 p-10 relative z-10">

        {/* icon */}
        <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-8">
          <LogIn size={36} className="text-gray-700" />
        </div>

        {/* heading */}
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Welcome Back 
        </h1>

        <p className="text-gray-500 text-center mt-3 mb-10 text-lg">
          Sign in to manage visitors, passes and appointments
        </p>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* email */}
          <div className="relative">

            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-100/80 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>


          {/* password */}
          <div className="relative">

            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-100/80 rounded-2xl py-4 pl-12 pr-14 outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {
                showPassword
                  ? <EyeOff size={20} />
                  : <Eye size={20} />
              }
            </button>

          </div>


          {/* submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-b from-gray-900 to-black text-white text-lg font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            Sign In
          </button>

        </form>


        {/* footer */}
        <p className="text-center text-gray-500 mt-8">
          Don&apos;t have an account?
          <Link
            to="/register"
            className="ml-2 text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}