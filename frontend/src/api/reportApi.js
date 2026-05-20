import api from './axios';

export const getSummary = async () => {
  const res = await api.get('/reports/summary');
  return res.data;
};

export const getDailyStats = async () => {
  const res = await api.get('/reports/daily-stats');
  return res.data;
};

export const getPeakHours = async () => {
  const res = await api.get('/reports/peak-hours');
  return res.data;
};

export const exportCSV = async () => {
  const res = await api.get('/reports/export-csv');
  return res.data;
};