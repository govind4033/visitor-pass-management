import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { useNavigate, useParams } from 'react-router-dom';

import toast from 'react-hot-toast';

import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck
} from 'lucide-react';

import {
  getUserById,
  updateUser
} from '../../api/userApi';


export default function EditUser() {

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm();


  // =========================
  // fetch user
  // =========================
  useEffect(() => {
    const fetchUser = async () => {
        try {
        // 1. Actually call the API function and save the result into 'response'
        const response = await getUserById(id); 
        
        // 2. Destructure the data object out of the successful API response
        const { data } = response; 

        // 3. Populate your form values safely
        if (data) {
            setValue('name', data.name);
            setValue('email', data.email);
            setValue('phone', data.phone || '');
            setValue('department', data.department || '');
            setValue('role', data.role);
        }
        } catch (error) {
        console.error("User payload load error:", error);
        toast.error('Failed to load user profile');
        }
    };

    if (id) {
        fetchUser();
    }
    }, [id, setValue]);


  // =========================
  // submit
  // =========================
  const onSubmit = async (formData) => {

    try {

      await updateUser(id, formData);

      toast.success('User updated successfully');

      navigate('/employees');

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        'Update failed'
      );
    }
  };


  return (

    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Update User
        </h1>

        <p className="text-gray-500 mt-2">
          Edit employee details
        </p>

      </div>


      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        {/* name */}
        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Full Name
          </label>

          <div className="relative">

            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              {...register('name')}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>

        </div>


        {/* email */}
        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Email
          </label>

          <div className="relative">

            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              {...register('email')}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>

        </div>


        {/* phone */}
        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Phone
          </label>

          <div className="relative">

            <Phone
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              {...register('phone')}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>

        </div>


        {/* department */}
        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Department
          </label>

          <div className="relative">

            <Building2
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              {...register('department')}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>

        </div>


        {/* role */}
        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Role
          </label>

          <div className="relative">

            <ShieldCheck
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              {...register('role')}
              className="w-full border border-gray-300 rounded-2xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >

              <option value="employee">
                Employee
              </option>

              <option value="security">
                Security
              </option>

            </select>

          </div>

        </div>


        {/* submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition"
        >

          {
            isSubmitting
              ? 'Updating...'
              : 'Update User'
          }

        </button>

      </form>

    </div>
  );
}