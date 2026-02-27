const isDev = process.env.NODE_ENV === 'development';

export const logger = {
    info: (context: string, message: string, ...args: any[]) => {
        if (isDev) {
            console.log(
                `%c[${context}] %c${message}`,
                'color: #3b82f6; font-weight: bold;', // Azul para el contexto
                'color: inherit;',
                ...args
            );
        }
    },

    error: (context: string, message: string, error?: any) => {
        // Los errores siempre se reportan, pero con un formato controlado
        console.error(
            `%c[${context} - ERROR] %c${message}`,
            'color: #ef4444; font-weight: bold;',
            'color: #ef4444;',
            error || ''
        );
    },

    warn: (context: string, message: string) => {
        if (isDev) {
            console.warn(`[${context} - WARN] ${message}`);
        }
    }
};