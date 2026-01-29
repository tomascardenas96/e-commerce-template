import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../../user/entities/user.entity";
import { NotificationType } from "../enums/notification-type.enum";

@Entity('notifications')
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.ORDER_STATUS
    })
    type: NotificationType;

    @Column({ default: false })
    isRead: boolean;

    @Column({ type: 'timestamp', nullable: true })
    readAt: Date;

    // Metadata para redirección (Ej: { "orderId": "uuid-123" })
    // Útil para que cuando el usuario haga clic, la App sepa a dónde llevarlo
    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}