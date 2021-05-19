import { IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { FormField } from './form-field.entity';
import { FormEntry } from './form-entry.entity';

@Entity()
export class Form {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@IsNotEmpty()
	@Column()
	public name: string;

	@Column()
	public slug: string;

	@Column()
	public timeout: number;

	@Column()
	public description: string;

	@OneToMany(() => FormField, formField => formField.form, {
		eager: true,
		cascade: true,
		onDelete: 'CASCADE',
	})
	public fields: FormField[];

	@OneToMany(() => FormEntry, formEntry => formEntry.form)
	public entries: FormEntry[];

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
