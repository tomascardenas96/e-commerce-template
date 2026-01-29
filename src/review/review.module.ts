import { Module } from '@nestjs/common';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule { }
