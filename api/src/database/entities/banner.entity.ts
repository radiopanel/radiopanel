import { IsNotEmpty } from 'class-validator';
import {
	Column, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Banner {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@IsNotEmpty()
	@Column()
	public name: string;

	@IsNotEmpty()
	@Column()
	public slug: string;

	@Column()
	public link?: string;

	@Column()
	public tag?: string;

	@IsNotEmpty()
	@Column()
	public image: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
