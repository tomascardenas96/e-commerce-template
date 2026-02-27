"use client";

import { useLoginForm } from "../hooks/useLoginForm";
import { Input } from "../ui/Input";

export const LoginForm = () => {
  const { form, onSubmit, isLoading, serverError } = useLoginForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <Header
        title="Iniciar Sesión"
        subtitle="Ingresa tus credenciales para iniciar sesión"
      />

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Input
          label="Correo Electrónico"
          placeholder="ejemplo@correo.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        {serverError && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg animate-pulse">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? (
            // <LoadingSpinner label="Verificando..." />
            <p>Verificando...</p>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </form>
    </div>
  );
};

// Componente interno pequeño para no crear archivos extra innecesarios
const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center">
    <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
    <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
  </div>
);
