"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { logger } from "@/lib/logger";
import { authService } from "../services/authService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AuthInitializerProps {
  children: ReactNode;
}

/**
 * Inicializador de sesión global.
 * Maneja la hidratación del estado y previene errores de mismatch entre servidor y cliente.
 */
export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  // Extraemos los estados necesarios del store de Zustand
  const isChecking = useAuthStore((state) => state.isChecking);
  const setChecking = useAuthStore((state) => state.setChecking);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Estado local para garantizar que el componente está montado en el navegador
  const [isMounted, setIsMounted] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Marcamos el componente como montado (esto solo ocurre en el cliente)
    setIsMounted(true);

    // Evitamos doble ejecución en StrictMode
    if (initialized.current) return;
    initialized.current = true;

    const syncSession = async () => {
      logger.info("AUTH_INITIALIZER", "Sincronizando identidad del usuario...");

      try {
        // Llamada al servicio que ya actualiza el Store internamente
        await authService.getMe();
      } catch (error) {
        logger.error(
          "AUTH_INITIALIZER",
          "Error crítico durante la sincronización",
          error,
        );
        clearAuth();
      } finally {
        // Liberamos el estado de carga pase lo que pase
        setChecking(false);
      }
    };

    syncSession();
  }, [clearAuth, setChecking]);

  /**
   * Pantalla de Carga (Splash Screen).
   * Se muestra mientras 'isChecking' es true para evitar que el usuario vea
   * contenido parpadeando antes de saber si tiene sesión.
   */
  if (isChecking) return <LoadingSpinner label="Cargando usuario..." />;

  /**
   * Control de Hidratación.
   * Si no estamos en el cliente, retornamos null. Esto evita que Next.js intente
   * comparar el HTML del servidor con un estado de cliente que aún no existe.
   */
  if (!isMounted) {
    return null;
  }

  // Renderizado de la aplicación una vez autenticada/verificada.
  return <>{children}</>;
};
