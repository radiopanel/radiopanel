import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ContentType } from './content-type.entity';

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

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
