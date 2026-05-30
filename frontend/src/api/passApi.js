import api from './axios';

export const generatePass = async (data) => {
    const res = await api.post('/passes', data);
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

export const getVisitorOwnPasses = async () => {
    const res = await api.get('/passes/my-passes');
    return res.data;
};