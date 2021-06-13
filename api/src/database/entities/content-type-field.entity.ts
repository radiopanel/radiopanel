import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ContentType } from './content-type.entity';

@Entity()
export class ContentTypeField {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public name: string;

	@Column()
	public slug: string;

	@Column()
	public order: number;

	@Column()
	public fieldType: string;

	@ManyToOne(() => ContentType, contentType => contentType.fields)
	public contentType: ContentType;

	@Column()
	public contentTypeUuid: string;

	@OneToMany(() => ContentTypeField, contentTypeField => contentTypeField.parent, {
		cascade: true,
	})
	public subfields: ContentTypeField[];

	@ManyToOne(() => ContentTypeField, contentTypeField => contentTypeField.parentUuid)
	public parent: ContentTypeField;

	@Column()
	public parentUuid: string;

	@Column({ type: 'jsonb', nullable: true })
	public config: any;

	@Column()
	public showOnOverview: boolean;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
