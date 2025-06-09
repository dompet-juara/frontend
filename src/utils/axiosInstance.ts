import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://yogaardiansyah.my.id/backenddompetjuara',
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isGuestModeActive = localStorage.getItem('isGuestMode') === 'true';

      if (!isGuestModeActive) { // Hanya lakukan jika BUKAN mode tamu
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        if (window.location.pathname !== '/login') {
           window.location.href = '/login';
        }
      } else {
        console.warn("Axios interceptor: Received 401 in Guest Mode. Not redirecting.", error.config.url);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;