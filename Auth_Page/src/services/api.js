import axios from 'axios';

// Substitua pelo seu URL do Render
const api = axios.create({
    baseURL: 'https://api-rest-utopic.onrender.com', // Substitua com o URL correto do Render
});

export default api;
