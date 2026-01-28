import { api } from "@/lib/axios_instance";
import { Profile, FriendListResponse } from "@/types/user";

export async function getProfile() {
    const response = await api.get<Profile>("/profile/")
    return response.data
}

export async function putProfile(data: any) {
    const response = await api.put<Profile>("/profile/", data)
    return response.data
}

export async function putAvatar(file: File) {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await api.put<any>("/profile/avatar/", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    return response.data
}

export async function deleteAvatar() {
    const response = await api.delete<any>("/profile/avatar/")
    return response.data
}

export async function getAllActiveUsers() {
    const response = await api.get<FriendListResponse>("/profile/all/")
    return response.data
}