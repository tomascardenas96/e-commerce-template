import { apiClient } from "@/lib/api-client";
import { logger } from "@/lib/logger";
import { AuthResponse } from "@/types/auth";
import { useAuthStore } from "../store/authStore";
import { RegisterFormValues } from "../schemas/register-schema";
import { useRouter } from "next/navigation";

/**
 * Servicio de Autenticación Centralizado.
 * Maneja la comunicación con la API y la sincronización del Store Global.
 */
export const authService = {
    /**
     * Recupera la sesión activa mediante la cookie HttpOnly.
     */
    getMe: async (): Promise<void> => {
        const { setAuth, clearAuth, setChecking } = useAuthStore.getState();

        try {
            setChecking(true);
            const { data } = await apiClient.get<AuthResponse>("/auth/me");

            if (data?.user) {
                setAuth(data.user);
                logger.info("AUTH_SERVICE", `Sesión recuperada: ${data.user.email}`);
            }
        } catch (error: any) {
            clearAuth();

            if (error.response?.status === 401) {
                logger.info("AUTH_SERVICE", "Navegación como invitado.");
                // No hacemos throw, pero nos aseguramos de que el flujo termine aquí
                return;
            }

            logger.error("AUTH_SERVICE", "Fallo técnico", error.message);
            // Solo lanzamos para errores que NO sean 401
            throw error;
        } finally {
            // Garantizando liberación de UI.
            setChecking(false);
        }
    },

    /**
     * Inicia sesión y permite que el servidor plante la cookie HttpOnly.
     */
    login: async (email: string, password: string): Promise<void> => {
        const { setAuth, setChecking } = useAuthStore.getState();

        try {
            setChecking(true);
            logger.info("AUTH_SERVICE", `Intentando login para: ${email}`);

            const { data } = await apiClient.post<AuthResponse>("/auth/login", {
                email,
                password,
            });

            if (data?.user) {
                setAuth(data.user);
                logger.info("AUTH_SERVICE", "Login exitoso y Store actualizado.");
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Error en el servidor";
            logger.error("AUTH_SERVICE", "Fallo en el inicio de sesión", errorMsg);
            throw error;
        } finally {
            setChecking(false);
        }
    },

    /**
     * Cierra la sesión y limpia la cookie mediante el servidor.
     */
    logout: async (): Promise<void> => {
        const { clearAuth, setChecking } = useAuthStore.getState();
        // const router = useRouter();

        try {
            setChecking(true);
            logger.info("AUTH_SERVICE", "Solicitando cierre de sesión al servidor...");

            await apiClient.post("/auth/logout");

            logger.info("AUTH_SERVICE", "Cookie invalidada y sesión terminada.");
        } catch (error: any) {
            logger.error("AUTH_SERVICE", "Error al cerrar sesión en el servidor", error.message);
        } finally {
            clearAuth();
            setChecking(false);
            // Forzamos recarga para limpiar cualquier estado residual de la memoria
            // router.push("/login");
            window.location.href = "/login";
        }
    },

    /**
     * Registra un nuevo usuario e iniciar sesion
     */
    register: async (userData: Omit<RegisterFormValues, "confirmPassword">): Promise<void> => {
        const { setAuth, setChecking } = useAuthStore.getState();

        try {
            setChecking(true);
            logger.info("AUTH_SERVICE", "Intentando registro de nuevo usuario para ", userData.email);

            const { data } = await apiClient.post<AuthResponse>("/auth/register", userData);

            if (data?.user) {
                setAuth(data.user);
                logger.info("AUTH_SERVICE", "Registro exitoso y sesión iniciada");
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Error al intentar registrar a un usuario"
            logger.error("AUTH_SERVICE", "Fallo en el registro de usuario", errorMsg);

            throw error;
        } finally {
            setChecking(false);
        }
    }
};