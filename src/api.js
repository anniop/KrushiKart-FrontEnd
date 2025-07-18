import axios from 'axios';

const API_URL = 'https://krushikart-backend.onrender.com/'; 

export default axios.create({
  baseURL: API_URL
});

