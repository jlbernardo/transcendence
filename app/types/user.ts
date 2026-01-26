export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password2: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  is_online: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
  errors?: Record<string, string[]>;
}

export interface Profile {
  id: number;
  user: User;
  bio: string;
  avatar: string;
}

export interface FriendListResponse {
  success: boolean;
  message: string;
  error: string;
  data?: Profile[];
}

export interface FriendsResponse {
  success: boolean;
  message: string;
  error: string;
  data?: FriendRequest[];
}

export interface FriendRequest {
  id: number;
  from_user: Profile;
  to_user: Profile;
  accepted: boolean;
  created_at: string;
}