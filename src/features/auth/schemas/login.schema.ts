import { z } from "zod";

export const loginSchema = z.object({
    email: z.string()
        .min(1, 'El email es requerido')
        .email('El email es invalido'),
    password: z.string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(16, 'La contraseña debe tener menos de 16 caracteres')
});

export type LoginFormValues = z.infer<typeof loginSchema>;