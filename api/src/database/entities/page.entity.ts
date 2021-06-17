import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PageType } from './page-type.entity';
import { User } from './user.entity';

@Entity()
export class Page {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public name: string;

	@Column()
	public slug: string;

	@Column({ type: 'jsonb', nullable: true })
	public fields: any;

	@Column()
	public pageTypeUuid: string;

	@ManyToOne(() => PageType, pageType => pageType.uuid)
	public pageType: PageType;

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
