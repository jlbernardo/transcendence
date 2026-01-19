import api from '../lib/axios_instance'
import { LoginData, AuthResponse } from '@/types/user'

export async function login(data: LoginData) {
    const response = await api.post<AuthResponse>('/auth/login/', data)
    return response.data
}