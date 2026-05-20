import api from './axios';

export const createAppointment = async (data) => {
  const res = await api.post('/appointments', data);
  return res.data;
};

export const getAppointments = async () => {
  const res = await api.get('/appointments');
  return res.data;
};

export const getAppointmentById = async (id) => {
  const res = await api.get(`/appointments/${id}`);
  return res.data;
};

export const approveAppointment = async (id) => {
  const res = await api.patch(`/appointments/${id}/approve`);
  return res.data;
};

export const rejectAppointment = async (id) => {
  const res = await api.patch(`/appointments/${id}/reject`);
  return res.data;
};

export const cancelAppointment = async (id) => {
  const res = await api.patch(`/appointments/${id}/cancel`);
  return res.data;
};

export const completeAppointment = async (id) => {
  const res = await api.patch(`/appointments/${id}/complete`);
  return res.data;
};