import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Role } from './role.entity';

@Entity()
export class RolePermission {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public permission: string;

	@ManyToOne(() => Role, role => role.uuid)
	public role: Role;

	@Column()
	public roleUuid: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
