import { User } from "@/types/auth";

export interface AuthState {
    /** El objeto de usuario sincronizado con el backend */
    user: User | null;
    /** Flag rápido para comprobación de acceso en componentes */
    isAuthenticated: boolean;
    /** Estado de transición mientras se valida la cookie HttpOnly */
    isChecking: boolean;

    // Acciones (Mutaciones del estado)
    setAuth: (user: User) => void;
    clearAuth: () => void;
    setChecking: (status: boolean) => void;
}