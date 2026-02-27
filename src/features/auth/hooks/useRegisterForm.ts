"use client"

import { useState } from "react"
import { useForm } from "react-hook-form";
import { RegisterFormValues, registerSchema } from "../schemas/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { logger } from "@/lib/logger";
import { authService } from "../services/authService";

export const useRegisterForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setServerError(null);
        logger.info("REGISTER_FORM", "Iniciando intento de registro para: ", data.email);

        if (data.password !== data.confirmPassword) {
            setServerError("Las contraseñas no coinciden");
            return;
        }

        try {
            await authService.register({
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                password: data.password,
            });
            logger.info("REGISTER_FORM", "Registro exitoso. Sesión iniciada.");

            window.location.href = "/login";
        } catch (err: any) {
            const msg = err.response?.data?.message || "Error al intentar registrar a un usuario"
            setServerError(msg);
            logger.error("REGISTER_FORM", "Fallo en el registro del usuario", msg);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit),
        isLoading,
        serverError,
    }
}