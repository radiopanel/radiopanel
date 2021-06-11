import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PageTypeField } from './page-type-field.entity';
import { Page } from './page.entity';

@Entity()
export class PageType {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@IsNotEmpty()
	@Column()
	public name: string;

	@Column()
	public slug: string;

	@Column()
	public description: string;

	@OneToMany(() => PageTypeField, pageTypeField => pageTypeField.pageType, {
		eager: true,
		cascade: true,
		onDelete: 'CASCADE',
	})
	public fields: PageTypeField[];

	@OneToMany(() => Page, page => page.pageType)
	public page: Page[];

	@Column()
	public icon: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
