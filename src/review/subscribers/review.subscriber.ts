import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Review } from '../entities/review.entity';

@EventSubscriber()
export class ReviewSubscriber implements EntitySubscriberInterface<Review> {
    listenTo() {
        return Review;
    }

    // Se ejecuta automáticamente DESPUÉS de que se inserta una reseña
    async afterInsert(event: InsertEvent<Review>) {
        const productRepository = event.manager.getRepository(Product);
        const reviewRepository = event.manager.getRepository(Review);

        const productId = event.entity.product.id;

        // 1. Calculamos el nuevo promedio y total directamente en la DB
        const { avgRating, count } = await reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'avgRating')
            .select('COUNT(review.id)', 'count')
            .where('review.product_id = :productId', { productId })
            .getRawOne();

        // 2. Actualizamos el producto de forma atómica
        await productRepository.update(productId, {
            averageRating: parseFloat(avgRating) || 0,
            totalReviews: parseInt(count) || 0,
        });
    }
}