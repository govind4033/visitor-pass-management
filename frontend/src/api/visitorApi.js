import api from './axios';

export const getVisitors = async () => {
  const res = await api.get('/visitors');
  return res.data;
};

export const getVisitorById = async (id) => {
  const res = await api.get(`/visitors/${id}`);
  return res.data;
};

export const createVisitor = async (data) => {
  const res = await api.post('/visitors', data);
  return res.data;
};

export const updateVisitor = async (id, data) => {
  const res = await api.patch(`/visitors/${id}`, data);
  return res.data;
};

export const deleteVisitor = async (id) => {
  const res = await api.delete(`/visitors/${id}`);
  return res.data;
};