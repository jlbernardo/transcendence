import { api } from '../lib/axios_instance'
import { LoginData, AuthResponse, RegisterData } from '@/types/user'

export async function register(data: RegisterData) {
    const response = await api.post<AuthResponse>('/auth/register/', data)
    return response.data
}

export async function login(data: LoginData) {
    const response = await api.post<AuthResponse>('/auth/login/', data)
    return response.data
}

export async function logout() {
    const response = await api.post('/auth/logout/')
    return response.data
}