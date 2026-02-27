"use client";

import { useAuthStore } from "@/features/auth/store/authStore";

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <main className="p-10">
      <h1>
        {user ? `Bienvenido ${user.name} ${user.lastname}!` : "Bienvenido!"}
      </h1>
    </main>
  );
}
