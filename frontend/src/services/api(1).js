import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to automatically inject the JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Simplest auth approach for now
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
