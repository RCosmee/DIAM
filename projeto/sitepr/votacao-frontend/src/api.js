// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // troca se usares outro host
  withCredentials: true, // se precisares de cookies (ex: autenticação)
});

export default api;
