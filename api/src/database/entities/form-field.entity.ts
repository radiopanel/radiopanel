import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Form } from './form.entity';

@Entity()
export class FormField {
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

	@ManyToOne(() => Form, form => form.fields, {
		onDelete: 'CASCADE',
	})
	public form: Form;

	@Column()
	public formUuid: string;

	@Column({ type: 'jsonb', nullable: true })
	public config: any;

	@Column()
	public showOnOverview: boolean;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
