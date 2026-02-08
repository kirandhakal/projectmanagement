import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const projectService = {
    getAll: () => api.get('/projects'),
    create: (data) => api.post('/projects', data),
    getDashboard: () => api.get('/projects/dashboard'),
};

export const boardService = {
    getByProject: (projectId) => api.get(`/boards/project/${projectId}`),
    create: (data) => api.post('/boards', data),
    delete: (id) => api.delete(`/boards/${id}`),
    addMember: (boardId, data) => api.post(`/boards/${boardId}/members`, data),
};

export const inviteService = {
    create: (data) => api.post('/invites', data), // Should point to the invite routes
    getProjectInvites: (projectId) => api.get(`/invites/project/${projectId}`),
};

export default api;
