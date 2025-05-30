// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8001/api/v1', // Adjust if your backend runs on a different port or path
// });

// export default api;



// import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8001/api/v1';


// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor for adding the auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for handling errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized access
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL:  'http://localhost:8001/api/v1', 
});

// Add request interceptor for token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log(localStorage.getItem('access_token'));

  }
  return config;
});

export default api;