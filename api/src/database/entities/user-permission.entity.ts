import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class UserPermission {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public permission: string;

	@Column()
	public permissionType: "grant" | "deny";

	@ManyToOne(() => User, user => user.uuid)
	public user: User;

	@Column()
	public userUuid: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
