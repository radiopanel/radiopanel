import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ContentTypeField } from './content-type-field.entity';
import { Content } from './content.entity';

@Entity()
export class ContentType {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@IsNotEmpty()
	@Column()
	public name: string;

	@Column()
	public slug: string;

	@Column()
	public description: string;

	@OneToMany(() => ContentTypeField, contentTypeField => contentTypeField.contentType, {
		eager: true,
		cascade: true,
		onDelete: 'CASCADE',
	})
	public fields: ContentTypeField[];

	@OneToMany(() => Content, content => content.contentType)
	public content: Content[];

	@Column()
	public icon: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
