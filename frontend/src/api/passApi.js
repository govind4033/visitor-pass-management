import api from './axios';

export const generatePass = async (visitorId) => {
    const res = await api.post('/passes', { visitorId });
    return res.data;
};

export const getPassById = async (id) => {
    const res = await api.get(`/passes/${id}`);
    return res.data;
};

export const getAllPasses = async () => {
    const res = await api.get('/passes');
    return res.data;
};