export interface Role {
    id: string;
    name: string;
}

export interface User {
    id: string;
    name: string;
    lastname: string;
    email: string;
    birthdate: string;
    isEmailConfirmed: boolean;
    role: Role;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface AuthResponse {
    user: User;
    message: string;
}