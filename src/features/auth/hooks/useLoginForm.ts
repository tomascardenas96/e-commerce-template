
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "../schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@/lib/logger";
import { authService } from "../services/authService";

export const useLoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setServerError(null);
        logger.info("LOGIN_FORM", `Iniciando intento de login para: ${data.email}`);

        try {
            await authService.login(data.email, data.password);
            logger.info(
                "LOGIN_FORM",
                "Autenticación exitosa. Sincronizando sesión...",
            );

            // Redireccionamos al dashboard. El AuthInitializer hará el resto.
            window.location.href = "/";
        } catch (err: any) {
            const msg =
                err.response?.data?.message || "Error de conexión con el servidor";
            setServerError(msg);
            logger.error("LOGIN_FORM", "Fallo en la autenticación", msg);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading,
        serverError,
    };
}