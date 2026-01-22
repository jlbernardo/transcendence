import { api } from "@/lib/axios_instance";
import { Profile } from "@/types/user";

export async function getProfile() {
    const response = await api.get<Profile>("/profile/")
    return response.data
}

export async function putProfile(data: any) {
    const response = await api.put<Profile>("/profile/", data)
    return response.data
}

export async function putAvatar(data: any) {
    const response = await api.put<Profile>("/profile/avatar/", data)
    return response.data
}

export async function deleteAvatar() {
    const response = await api.delete<Profile>("/profile/avatar/")
    return response.data
}