import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hotel-management-system-uqxt.onrender.com';
const API_URL = `${API_BASE_URL}/api/v1`;

export { API_BASE_URL };

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/users', { user: userData }),
    forgotPassword: (email) => api.post('/auth/forgot_password', { email }),
    resetPassword: (email, token, password) => api.post('/auth/reset_password', { email, token, password }),
};

export const roomsAPI = {
    getAll: (params) => api.get('/rooms', { params }),
    getById: (id) => api.get(`/rooms/${id}`),
    create: (roomData) => api.post('/rooms', { room: roomData }),
    update: (id, roomData) => api.put(`/rooms/${id}`, { room: roomData }),
    delete: (id) => api.delete(`/rooms/${id}`),
    getFeatured: () => api.get('/rooms/featured'),
};


export const bookingsAPI = {
    getAll: (params) => api.get('/bookings', { params }),
    getById: (id) => api.get(`/bookings/${id}`),
    create: (bookingData) => api.post('/bookings', { booking: bookingData }),
    update: (id, bookingData) => api.patch(`/bookings/${id}`, { booking: bookingData }),
    delete: (id) => api.delete(`/bookings/${id}`),
};


export const reviewsAPI = {
    getByRoom: (roomId) => api.get(`/rooms/${roomId}/reviews`),
    create: (roomId, reviewData) => api.post(`/rooms/${roomId}/reviews`, { review: reviewData }),
    update: (id, reviewData) => api.patch(`/reviews/${id}`, { review: reviewData }),
    delete: (id) => api.delete(`/reviews/${id}`),
    getAll: () => api.get('/reviews'),
    getByUser: (userId) => api.get('/my_reviews', { params: { user_id: userId } }),
};


export const usersAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => {
        if (userData instanceof FormData) {
            return api.patch(`/users/${id}`, userData);
        }
        return api.patch(`/users/${id}`, { user: userData });
    },
    delete: (id) => api.delete(`/users/${id}`),
};

export const inquiriesAPI = {
    getAll: () => api.get('/inquiries'),
    create: (inquiryData) => api.post('/inquiries', { inquiry: inquiryData }),
    update: (id, inquiryData) => api.patch(`/inquiries/${id}`, { inquiry: inquiryData }),
    delete: (id) => api.delete(`/inquiries/${id}`),
};

export default api;
