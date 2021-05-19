import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from 'typeorm';

import { RolePermission } from './role-permission.entity';
import { User } from './user.entity';
import { Tenant } from './tenant.entity';

@Entity()
export class Role {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public name: string;

	@OneToMany(() => RolePermission, rolePermission => rolePermission.role, {
		eager: true,
		cascade: true,
		onDelete: 'CASCADE',
	})
	public permissions: RolePermission[];

	@ManyToMany(() => User, user => user.roles)
	public users: User[];

	@Column()
	public weight: number;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
