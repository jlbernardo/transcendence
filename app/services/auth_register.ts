import api from '../lib/axios_instance'
import { RegisterData, AuthResponse } from '@/types/user'

export async function register(data: RegisterData) {
    const response = await api.post<AuthResponse>('/auth/register/', data)
    return response.data
}