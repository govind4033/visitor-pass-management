import api from './axios';

export const checkIn = async (data) => {
    const res = await api.post('/check/in/', data);
    return res.data;
};

export const checkOut = async (data) => {
    const res = await api.post('/check/out', data);
    return res.data;
};

export const getLogs = async (params) => {
    const res = await api.get('/check/logs', { params });
    return res.data;
};

export const getSelectedLogs = async (date) => {
    const res = await api.get(`/check/logs/${date}`);
    return res.data;
};

export const getSecurityDashboardStats = async () => {
    const res = await api.get("/check/dashboard");
    return res.data;
};