import { useForm } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import { createVisitor } from '../api/visitorApi';


export default function NewVisitor() {

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();


  // submit form
  const onSubmit = async (formData) => {

      try {
          // create FormData object
          const visitorData = new FormData();


          // normal fields
          visitorData.append('name', formData.name);

          visitorData.append('email', formData.email);

          visitorData.append('phone', formData.phone);

          visitorData.append('company', formData.company);

          visitorData.append('purpose', formData.purpose);

          visitorData.append('visitDate', formData.visitDate);

          visitorData.append('idType', formData.idType);

          visitorData.append('idNumber', formData.idNumber);

          visitorData.append('hostEmployee', formData.hostEmployee);


          // image file
          if ( formData.photo && formData.photo.length > 0 ) {
              visitorData.append(
                  'photo',
                  formData.photo[0]
              );
          }


          // api call
          await createVisitor(visitorData);


          // success message
          toast.success(
              'Visitor registered successfully'
          );


          // redirect
          navigate('/visitors');

      } catch (error) {

          toast.error(
              error.response?.data?.message ||
              'Registration failed'
          );
      }
  };


  return (

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-3xl p-8">

          {/* heading */}
          <div className="mb-8">

              <h1 className="text-3xl font-bold text-gray-800">
                  Register Visitor
              </h1>

              <p className="text-gray-500 mt-2">
                  Create a new visitor entry
              </p>

          </div>


          {/* form */}
          <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
          >

              {/* name */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      Full Name
                  </label>

                  <input
                      type="text"
                      placeholder="Enter full name"
                      {...register('name', {
                          required: true
                      })}
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />

              </div>


              {/* email */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      Email
                  </label>

                  <input
                      type="email"
                      placeholder="Enter email"
                      {...register('email', {
                          required: true
                      })}
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />

              </div>


              {/* phone */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      Phone
                  </label>

                  <input
                      type="text"
                      placeholder="Enter phone number"
                      {...register('phone', {
                          required: true
                      })}
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />

              </div>


              {/* company */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      Company
                  </label>

                  <input
                      type="text"
                      placeholder="Company name"
                      {...register('company')}
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />

              </div>


              {/* purpose */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      Purpose
                  </label>

                  <input
                      type="text"
                      placeholder="Reason for visit"
                      {...register('purpose', {
                          required: true
                      })}
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />

              </div>


              {/* visit date */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      Visit Date
                  </label>

                  <input
                      type="date"
                      {...register('visitDate', {
                          required: true
                      })}
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />

              </div>


              {/* host employee */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      Host Employee ID
                  </label>

                  <input
                      type="text"
                      placeholder="Employee ID"
                      {...register('hostEmployee', {
                          required: true
                      })}
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />

              </div>


              {/* id type */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      ID Type
                  </label>

                  <select
                      {...register('idType')}
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  >

                      <option value="aadhar">
                          Aadhar
                      </option>

                      <option value="passport">
                          Passport
                      </option>

                      <option value="driving_license">
                          Driving License
                      </option>

                      <option value="other">
                          Other
                      </option>

                  </select>

              </div>


              {/* id number */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      ID Number
                  </label>

                  <input
                      type="text"
                      placeholder="Enter ID number"
                      {...register('idNumber')}
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                  />

              </div>


              {/* photo */}
              <div>

                  <label className="block mb-2 font-medium text-gray-700">
                      Upload Photo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    {...register('photo')}
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3"
                  />
              </div>


              {/* submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition"
              >
                { isSubmitting ? 'Saving...' : 'Register Visitor' }
              </button>

          </form>

      </div>
  );
}