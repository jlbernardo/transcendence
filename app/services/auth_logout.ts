import api from '../lib/axios_instance';

export async function logout() {
    const response = await api.post('/auth/logout/')
    return response.data
}
