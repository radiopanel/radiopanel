import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PageType } from './page-type.entity';

@Entity()
export class PageTypeField {
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

	@ManyToOne(() => PageType, pageType => pageType.fields)
	public pageType: PageType;

	@Column()
	public pageTypeUuid: string;

	@OneToMany(() => PageTypeField, pageTypeField => pageTypeField.parent, {
		cascade: true,
	})
	public subfields: PageTypeField[];

	@ManyToOne(() => PageTypeField, pageTypeField => pageTypeField.parentUuid)
	public parent: PageTypeField;

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
