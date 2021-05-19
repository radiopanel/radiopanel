import { IsNotEmpty } from 'class-validator';
import {
	Column, Entity, PrimaryGeneratedColumn, ManyToOne
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class AuditLog {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@IsNotEmpty()
	@Column()
	public userUuid: string;

	@IsNotEmpty()
	@Column()
	public action: string;

	@Column({ type: 'jsonb', nullable: true })
	public actionData: any;

	@Column({ type: 'jsonb', nullable: true })
	public actionContext: any;

	@ManyToOne(() => User, user => user.uuid, {
		eager: true,
		cascade: false,
	})
	public user: User;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
