import api from './axios';

export const checkIn = async (data) => {
    const res = await api.post('/check/in', data);
    return res.data;
};

export const checkOut = async (data) => {
    const res = await api.post('/check/out', data);
    return res.data;
};

export const getLogs = async () => {
    const res = await api.get('/check/logs');
    return res.data;
};

export const getSelectedLogs = async (date) => {
    const res = await api.get(`/check/logs/${date}`);
    return res.data;
};