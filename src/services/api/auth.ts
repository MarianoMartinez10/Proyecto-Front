import axios from 'axios';

// Establece el mismo puerto que ApiClient
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tipos de datos simplificados
export interface RegisterData { name: string; email: string; password: string; }
export interface LoginData { email: string; password: string; }
export interface AuthResponse {
  success: boolean;
  token: string;
  user: { id: string; name: string; email: string; role: string; };
}

// Rutas con prefijo /api/auth
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar usuario');
  }
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

export const getProfile = async (token: string) => {
  try {
    const response = await api.get('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener perfil');
  }
};

export const logoutUser = async (token: string) => {
  try {
    await api.post('/api/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
    return { success: true };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cerrar sesión');
  }
};

export default api;