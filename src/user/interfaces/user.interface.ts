// Contrato para mostrar información pública o de perfil (Seguro)
export interface IUserBase {
    id: string;
    name: string;
    lastname: string;
    email: string;
    role: any;
    isEmailConfirmed: boolean;
}

// Contrato para procesos de autenticación (Interno)
export interface IUserAuth extends IUserBase {
    password?: string;
    birthdate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    failedAttempts: number;
    lockedUntil?: Date;
    resetToken?: string;
}

// Contrato para perfiles completos con auditoría
export interface IUserProfile extends IUserBase {
    birthdate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

// Para métodos que solo confirman que la operación se realizó (softDelete, update, restore)
export interface IUserActionResponse {
    success: boolean;
    message: string;
    userId?: string;
}

// Para resultados de búsqueda paginados (útil si luego añades un findAll)
export interface IUserPaginatedResponse {
    data: IUserBase[];
    total: number;
    page: number;
    lastPage: number;
}