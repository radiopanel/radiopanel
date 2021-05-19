import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Tenant } from './tenant.entity';
import { Role } from './role.entity';

@Entity()
export class Invite {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public emailAddress: string;

	@Column()
	public username: string;

	@Column()
	public roleUuid: string;

	@ManyToOne(() => Role, {
		eager: true,
	})
	public role: Role;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
