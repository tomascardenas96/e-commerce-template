import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../entities/product.entity";

export class GetProductsResponseDto {
    @ApiProperty({ example: 10, description: 'Total de productos' })
    total: number;

    @ApiProperty({
        type: [Product],
        description: 'Lista de productos',
        example: [
            {
                "id": "6d3f6326-fd9d-458a-9f15-5d746175172f",
                "createdAt": "2026-01-31T10:10:21.303Z",
                "updatedAt": "2026-01-31T10:10:21.303Z",
                "name": "Zapatillas Adidas",
                "description": "Las mejores zapas",
                "slug": "zapatillas-adidas",
                "isActive": true,
                "averageRating": "0.00",
                "totalReviews": 0,
                "category": {
                    "id": "ccffa88d-1692-4658-a392-e49907bb7bee",
                    "createdAt": "2026-01-30T14:32:06.532Z",
                    "updatedAt": "2026-01-30T14:32:06.532Z",
                    "name": "Zapatillas",
                    "slug": "zapatillas"
                },
                "variants": [
                    {
                        "id": "fc742921-681c-4a15-99f3-cd1b18708378",
                        "createdAt": "2026-01-31T10:10:21.303Z",
                        "updatedAt": "2026-01-31T10:10:21.303Z",
                        "sku": "ZAP-42-I96Y",
                        "price": "1500.00",
                        "stock": 4,
                        "attributes": null
                    }
                ]
            }
        ]
    })
    products: Product[];
}