import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { createUser } from '../../api/userApi';

export default function CreateUser() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromQuery = searchParams.get('role') || 'employee';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      role: roleFromQuery,
      name: '',
      email: '',
      password: '',
      phone: '',
      department: ''
    }
  });

  const onSubmit = async (formData) => {
    try {
      await createUser(formData);

      toast.success(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} created successfully`);

      // Smart Redirect: Send the admin to the exact list page they just added a user to
      if (formData.role === 'security') {
        navigate('/security-staff');
      } else {
        navigate('/employees');
      }

    } catch (error) {
      console.error("User creation submission failure:", error);
      // Fixed error target key to read .data.error from your controller layout
      toast.error(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Failed to create user'
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
      {/* heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create User</h1>
        <p className="text-gray-500 mt-2">Add employee or security staff profiles to the portal system.</p>
      </div>

      {/* form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Full Name</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter full name"
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* email */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Email Address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Enter email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-7._%+-]+@[A-Z0-7.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* password */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Create strong password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters long' }
              })}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Must contain 8+ characters, uppercase, lowercase, numbers, and symbols.</p>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* phone */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Phone Number (Optional)</label>
          <div className="relative">
            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Phone number"
              {...register('phone')}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* department */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Department (Optional)</label>
          <div className="relative">
            <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. HR, Engineering, Operations"
              {...register('department')}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* role */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">System Role Permission</label>
          <div className="relative">
            <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              {...register('role')}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="employee">Employee</option>
              <option value="security">Security</option>
            </select>
          </div>
        </div>

        {/* submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-2xl font-semibold shadow-md active:scale-[0.99] transition duration-150 mt-4"
        >
          {isSubmitting ? 'Syncing Profile Fields...' : 'Create Access Account'}
        </button>

      </form>
    </div>
  );
}