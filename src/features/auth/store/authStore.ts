import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState } from "../types/state.types";
import { logger } from "@/lib/logger";

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isChecking: true,

            setAuth: (user) => {
                logger.info("AUTH_STORE", `Actualizando estado: Usuario autenticado (${user.email})`);
                set({
                    user,
                    isAuthenticated: true,
                    isChecking: false,
                });
            },

            clearAuth: () => {
                logger.info("AUTH_STORE", "Limpiando estado de autenticación");
                set({
                    user: null,
                    isAuthenticated: false,
                    isChecking: false,
                });
            },

            setChecking: (status) => set({ isChecking: status }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);