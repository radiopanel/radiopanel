import { IsNotEmpty } from 'class-validator';
import {
	Column, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Webhook {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@IsNotEmpty()
	@Column()
	public type: string;

	@IsNotEmpty()
	@Column()
	public url: string;

	@Column()
	public destination: string;

	@Column({ type: 'jsonb', nullable: true })
	public lastStatus: any;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
