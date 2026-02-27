"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuthStore } from "@/features/auth/store/authStore";
import { logger } from "@/lib/logger";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      logger.info(
        "GUEST_GUARD",
        "Usuario ya autenticado en memoria. Redirigiendo a /",
      );
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
};
