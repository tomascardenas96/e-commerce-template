"use client";

import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export const LogOutBtn = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleAuth = () => {
    if (isAuthenticated) {
      authService.logout();
    } else {
      router.push("/login");
    }
  };

  return <p onClick={handleAuth}>{isAuthenticated ? "Sign out" : "Sign in"}</p>;
};
