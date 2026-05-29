import api from './axios';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn("Warning: Attempting an authenticated API request without a saved local token!");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUsers = async (role) => {
    const config = getAuthConfig();
    
    if (role) {
        config.params = { role };
    }

    const res = await api.get(`/users`, config);
    return res.data; 
};

// GET /api/users/:id - Fetch single user data
export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`, getAuthConfig());
  return res.data;
};

// POST /api/users - Create a new user profile
export const createUser = async (data) => {
  // Axios will auto-configure multipart headers if data is an instance of FormData
  const res = await api.post('/users', data, getAuthConfig());
  return res.data;
};

// PATCH /api/users/:id - Modify existing data parameters
export const updateUser = async (id, data) => {
  const res = await api.patch(`/users/${id}`, data, getAuthConfig());
  return res.data;
};

// DELETE /api/users/:id - Remove a personnel record completely
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`, getAuthConfig());
  return res.data;
};