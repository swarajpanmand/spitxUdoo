import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    signup: (data: { name: string; email: string; password: string; role: string }) =>
        api.post('/auth/signup', data),

    requestPasswordReset: (email: string) =>
        api.post('/auth/request-reset', { email }),

    verifyOTP: (email: string, otp: string) =>
        api.post('/auth/verify-otp', { email, otp }),

    resetPassword: (email: string, otp: string, newPassword: string) =>
        api.post('/auth/reset-password', { email, otp, newPassword }),
};

// Users API
export const usersAPI = {
    getAll: () => api.get('/users'),
    getById: (id: string) => api.get(`/users/${id}`),
    getByRole: (role: string) => api.get(`/users/role/${role}`),
    getStats: () => api.get('/users/stats/summary'),
};

// Products API
export const productsAPI = {
    getAll: () => api.get('/products'),
    getById: (id: string) => api.get(`/products/${id}`),
    create: (data: any) => api.post('/products', data),
    update: (id: string, data: any) => api.put(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
    getLowStock: () => api.get('/products/low-stock'),
};

// Warehouses API
export const warehousesAPI = {
    getAll: () => api.get('/warehouses'),
    getById: (id: string) => api.get(`/warehouses/${id}`),
    create: (data: any) => api.post('/warehouses', data),
    update: (id: string, data: any) => api.put(`/warehouses/${id}`, data),
    delete: (id: string) => api.delete(`/warehouses/${id}`),
};

// Receipts API
export const receiptsAPI = {
    getAll: () => api.get('/receipts'),
    getById: (id: string) => api.get(`/receipts/${id}`),
    create: (data: any) => api.post('/receipts', data),
    update: (id: string, data: any) => api.put(`/receipts/${id}`, data),
    validate: (id: string) => api.post(`/receipts/${id}/validate`),
    cancel: (id: string) => api.post(`/receipts/${id}/cancel`),
};

// Delivery Orders API
export const deliveriesAPI = {
    getAll: () => api.get('/deliveries'),
    getById: (id: string) => api.get(`/deliveries/${id}`),
    create: (data: any) => api.post('/deliveries', data),
    update: (id: string, data: any) => api.put(`/deliveries/${id}`, data),
    pick: (id: string) => api.post(`/deliveries/${id}/pick`),
    pack: (id: string) => api.post(`/deliveries/${id}/pack`),
    validate: (id: string) => api.post(`/deliveries/${id}/validate`),
    cancel: (id: string) => api.post(`/deliveries/${id}/cancel`),
};

// Internal Transfers API
export const transfersAPI = {
    getAll: () => api.get('/transfers'),
    getById: (id: string) => api.get(`/transfers/${id}`),
    create: (data: any) => api.post('/transfers', data),
    update: (id: string, data: any) => api.put(`/transfers/${id}`, data),
    validate: (id: string) => api.post(`/transfers/${id}/validate`),
    cancel: (id: string) => api.post(`/transfers/${id}/cancel`),
};

// Inventory Adjustments API
export const adjustmentsAPI = {
    getAll: () => api.get('/adjustments'),
    getById: (id: string) => api.get(`/adjustments/${id}`),
    create: (data: any) => api.post('/adjustments', data),
};

// Stock Movements API
export const movementsAPI = {
    getAll: (filters?: any) => api.get('/moves', { params: filters }),
    getByProduct: (productId: string) => api.get('/moves', { params: { productId } }),
};

// Dashboard API
export const dashboardAPI = {
    getKPIs: () => api.get('/dashboard/kpis'),
    getRecentActivity: () => api.get('/dashboard/recent-activity'),
};

export default api;
