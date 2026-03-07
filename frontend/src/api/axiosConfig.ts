import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // ודאי שזה הכתובת שבה ה-Laravel רץ
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// הוספת ה-Bearer Token לכל בקשה באופן אוטומטי
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;