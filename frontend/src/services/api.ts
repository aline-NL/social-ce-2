import axios from 'axios';
import type { Presenca, EntregaDeCesta, Familia, Turma } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});


// Add a request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@SAS:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('@SAS:user');
      localStorage.removeItem('@SAS:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  me: () => api.get('/auth/me'),
};

// Familias API
export const familiasApi = {
  listFamilias: (params: any) => api.get('/familias/', { params }).then((res) => res.data),
  getFamiliaById: (id: string) => api.get(`/familias/${id}/`).then((res) => res.data),
  createFamilia: (data: any) => api.post('/familias/', data).then((res) => res.data),
  updateFamilia: (id: string, data: any) => api.put(`/familias/${id}/`, data).then((res) => res.data),
  deleteFamilia: (id: string) => api.delete(`/familias/${id}/`),
};

// Membros API
export const membrosApi = {
  listMembros: (params: any) => api.get('/membros/', { params }).then((res) => res.data),
  getMembroById: (id: string) => api.get(`/membros/${id}/`).then((res) => res.data),
  createMembro: (data: any) => api.post('/membros/', data).then((res) => res.data),
  updateMembro: (id: string, data: any) => api.put(`/membros/${id}/`, data).then((res) => res.data),
  deleteMembro: (id: string) => api.delete(`/membros/${id}/`),
};

// Turmas API
export const turmasApi = {
  listTurmas: (params: any) => api.get('/turmas/', { params }).then((res) => res.data),
  getTurmaById: (id: string) => api.get(`/turmas/${id}/`).then((res) => res.data),
  createTurma: (data: any) => api.post('/turmas/', data).then((res) => res.data),
  updateTurma: (id: string, data: any) => api.put(`/turmas/${id}/`, data).then((res) => res.data),
  deleteTurma: (id: string) => api.delete(`/turmas/${id}/`),
};

// Presencas API
export const presencaApi = {
  listPresencas: (params: any) => api.get('/presencas/', { params }).then((res) => res.data),
  getPresencaById: (id: string) => api.get(`/presencas/${id}/`).then((res) => res.data),
  createPresenca: (data: any) => api.post('/presencas/', data).then((res) => res.data),
  updatePresenca: (id: string, data: any) => api.put(`/presencas/${id}/`, data).then((res) => res.data),
  deletePresenca: (id: string) => api.delete(`/presencas/${id}/`),
};

// Cestas API
export const cestasApi = {
  listCestas: (params: any) => api.get('/cestas/', { params }).then((res) => res.data),
  getCestaById: (id: string) => api.get(`/cestas/${id}/`).then((res) => res.data),
  createCesta: (data: any) => api.post('/cestas/', data).then((res) => res.data),
  updateCesta: (id: string, data: any) => api.put(`/cestas/${id}/`, data).then((res) => res.data),
  deleteCesta: (id: string) => api.delete(`/cestas/${id}/`),
};

// Relatorios API
export const relatoriosApi = {
  getFrequencia: () => api.get('/relatorios/frequencia/'),
  getCestas: () => api.get('/relatorios/cestas/'),
  getTamanhos: () => api.get('/relatorios/tamanhos/'),
  getProgramas: () => api.get('/relatorios/programas/'),
  frequencia: (params = {}) => api.get('/relatorios/frequencia', { params }),
  cestas: (params = {}) => api.get('/relatorios/cestas', { params }),
  tamanhos: () => api.get('/relatorios/tamanhos'),
  programasSociais: () => api.get('/relatorios/programas-sociais'),
};
export default api;