import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Form } from './form.entity';

@Entity()
export class FormEntry {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column({ type: 'jsonb', nullable: true })
	public fields: any;

	@Column()
	public formUuid: string;

	@Column()
	public requestContext: string;

	@ManyToOne(() => Form, form => form.uuid)
	public form: Form;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
