import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProductVariantService {
    private readonly logger: Logger = new Logger(ProductVariantService.name);

    generateSku(productName: string, attributes: Record<string, any>): string {
        // [2026-01-31] Log: Iniciando generación de SKU profesional
        this.logger.log(`Generando SKU para el producto: ${productName}`);

        // 1. Sanitizar y normalizar el nombre (Ej: "Remera Árbol!" -> "REM")
        const cleanName = productName
            .trim()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quita acentos
            .replace(/[^a-zA-Z0-9]/g, '') // Quita todo lo que no sea letra o número
            .substring(0, 3)
            .toUpperCase();

        // 2. Procesar atributos de forma dinámica
        // Extraemos las primeras 2 letras de cada valor (Ej: { color: 'Rojo', talle: 'XL' } -> 'ROXL')
        const attrValues = Object.values(attributes)
            .map(val => String(val)
                .trim()
                .replace(/[^a-zA-Z0-9]/g, '')
                .substring(0, 2)
                .toUpperCase()
            )
            .join('');

        // 3. Sufijo de unicidad basado en Timestamp (Base 36 para brevedad)
        // Esto es más profesional que un número random porque es cronológico y compacto
        const timestamp = Date.now().toString(36).toUpperCase().slice(-4);

        const sku = `${cleanName}-${attrValues}-${timestamp}`;

        this.logger.debug(`SKU generado exitosamente: ${sku}`);
        return sku;
    }
}
