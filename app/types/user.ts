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
}

export interface FriendsResponse {
  id: number;
  from_user: User;
  to_user: User;
  accepted: boolean;
  created_at: string;
}