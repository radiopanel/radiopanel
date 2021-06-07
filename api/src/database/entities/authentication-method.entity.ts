import { IsNotEmpty } from 'class-validator';
import {
	Column, Entity, PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class AuthenticationMethod {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@IsNotEmpty()
	@Column()
	public name: string;

	@IsNotEmpty()
	@Column()
	public type: string;

	@IsNotEmpty()
	@Column()
	public enabled: boolean;

	@IsNotEmpty()
	@Column()
	public weight: number;

	@Column()
	public defaultRoleUuid: string | null;

	@Column({ type: 'jsonb', nullable: true })
	public config: any;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
