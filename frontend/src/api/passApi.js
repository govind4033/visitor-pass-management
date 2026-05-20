import api from './axios';

export const issuePass = async (data) => {
    const res = await api.post('/passes', data);
    return res.data;
};