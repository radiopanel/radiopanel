import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { PageType } from './page-type.entity';

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

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
