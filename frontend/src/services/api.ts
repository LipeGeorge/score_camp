import axios from 'axios';

const api = axios.create({

  baseURL: 'https://scorecamp-backend.onrender.com', 
  
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Se a internet estiver muito lenta, ele desiste após 10 segundos
});

export default api;