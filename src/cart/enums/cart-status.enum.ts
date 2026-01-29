export enum CartStatus {
    OPEN = 'open',           // Carrito actual
    ORDERED = 'ordered',     // Ya se convirtió en pedido
    ABANDONED = 'abandoned', // Usuario lo dejó olvidado
    PROCESSING = 'processing' // Útil durante la pasarela de pago
}