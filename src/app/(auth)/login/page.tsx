import { LoginForm } from "@/features/auth/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="p-10">
      <LoginForm />
      <span>¿No tienes una cuenta?:</span>
      <Link href="/register">Registrarse</Link>
    </main>
  );
}
