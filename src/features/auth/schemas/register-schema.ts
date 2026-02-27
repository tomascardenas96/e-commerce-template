import z from "zod";

export const registerSchema = z.object({
    name: z.string()
        .min(1, "El nombre es obligatorio")
        .max(70, "El nombre debe tener menos de 70 caracteres"),
    lastname: z.string()
        .min(1, "El apellido es obligatorio")
        .max(70, "El apellido debe tener menos de 70 caracteres"),
    email: z.string()
        .min(1, "El correo electrónico es obligatorio")
        .email("Debe ser un correo electrónico válido"),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(16, "La contraseña debe tener menos de 16 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número o un carácter especial"),
    confirmPassword: z.string()
        .min(8, "La confirmación de contraseña debe tener al menos 8 caracteres")
        .max(16, "La confirmación de contraseña debe tener menos de 16 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/, "La confirmación de contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número o un carácter especial"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;