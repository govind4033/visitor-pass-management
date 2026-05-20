import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createVisitor } from '../api/visitorApi';

export default function NewVisitor() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Must use FormData — axios will set correct Content-Type automatically
      const fd = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'photo') fd.append('photo', value[0]); // FileList[0]
        else fd.append(key, value);
      });

      await createVisitor(fd);
      toast.success('Visitor registered!');
      navigate('/visitors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Register visitor</h2>

      <input placeholder="Full name"  {...register('name',    { required: true })} />
      <input placeholder="Email"      {...register('email',   { required: true })} />
      <input placeholder="Phone"      {...register('phone',   { required: true })} />
      <input placeholder="Company"    {...register('company')} />
      <input placeholder="Purpose"    {...register('purpose',  { required: true })} />
      <input type="date"             {...register('visitDate', { required: true })} />

      <select {...register('idType')}>
        <option value="aadhar">Aadhar</option>
        <option value="passport">Passport</option>
        <option value="driving_license">Driving license</option>
      </select>

      <input placeholder="ID number" {...register('idNumber')} />

      {/* Photo upload — FileList, not string */}
      <label>Photo
        <input type="file" accept="image/*" {...register('photo')} />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Register visitor'}
      </button>
    </form>
  );
}