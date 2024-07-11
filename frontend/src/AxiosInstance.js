import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',  // Adjust this to your API base URL
    timeout: 5000,  // Adjust timeout as needed
});

let isRefreshing = false;
let refreshSubscribers = [];

// Add a request interceptor to include JWT token in all requests
axiosInstance.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('jwt-access-token');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh(() => {
                        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('jwt-access-token')}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise((resolve, reject) => {
                axiosInstance.post('/token/refresh/', { refresh: localStorage.getItem('jwt-refresh-token') })
                    .then(response => {
                        const { access } = response.data;
                        localStorage.setItem('jwt-access-token', access);
                        originalRequest.headers.Authorization = `Bearer ${access}`;
                        processQueue(null, access);
                        resolve(axiosInstance(originalRequest));
                    })
                    .catch(error => {
                        console.error('Refresh token failed:', error);
                        processQueue(error, null);
                        reject(error);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

// Function to subscribe to token refresh
function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

// Function to process queued requests after token refresh
function processQueue(error, token = null) {
    refreshSubscribers.forEach(callback => callback(error, token));
    refreshSubscribers = [];
}

export default axiosInstance;
