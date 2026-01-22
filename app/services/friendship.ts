import { api } from "@/lib/axios_instance";
import { FriendsResponse, User} from "@/types/user";

export async function getFriendsList() {
    const response = await api.get<User[]>("/friends/");
    return response.data;
}

export async function sendFriendRequest(to_user_id: number) {
    const response = await api.post<FriendsResponse>("/friends/request/", { to_user_id });
    return response.data;
}

export async function acceptFriendRequest(request_id: number) {
    const response = await api.post<FriendsResponse>("/friends/accept/", { request_id });
    return response.data;
}

export async function getPendingRequestsList() {
    const response = await api.get<FriendsResponse[]>("/friends/pending/");
    return response.data;
}