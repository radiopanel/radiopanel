import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ContentType } from './content-type.entity';
import { User } from './user.entity';

@Entity()
export class Content {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public name: string;

	@Column()
	public slug: string;

	@Column({ type: 'jsonb', nullable: true })
	public fields: any;

	@Column()
	public contentTypeUuid: string;

	@ManyToOne(() => ContentType, contentType => contentType.uuid)
	public contentType: ContentType;

	@ManyToOne(() => User, user => user.uuid, {
		eager: true,
	})
	public createdBy: User;

	@Column()
	public createdByUuid: string;

	@ManyToOne(() => User, user => user.uuid, {
		eager: true,
	})
	public updatedBy: User;

	@Column()
	public updatedByUuid: string;

	@Column()
	public published: boolean;

	@Column()
	public publishScheduledAt?: Date | null;

	@Column()
	public unPublishScheduledAt?: Date | null;

	@Column()
	public publishedAt: Date;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
