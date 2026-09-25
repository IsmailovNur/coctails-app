export type UserRole = "admin" | "user";

export interface User {
  _id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  token: string;
  role: UserRole;
  googleId?: string | null;
}

export interface RegisterMutation {
  username: string;
  displayName: string;
  email: string;
  password: string;
  avatar: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    }
  },
  name: string;
  message: string;
  _message: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface GlobalError {
  error: string;
}