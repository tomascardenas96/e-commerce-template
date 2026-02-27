import { RegisterForm } from "@/features/auth/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="p-10">
      <RegisterForm />
      <span>¿Ya tienes una cuenta?:</span>
      <Link href="/login">Inicia sesión</Link>
    </main>
  );
}
