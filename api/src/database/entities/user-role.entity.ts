import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Role } from './role.entity';

@Entity()
export class UserRole {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@OneToOne(() => Role, role => role.uuid, {
		eager: true,
	})
	@JoinColumn()
	public role: Role;

	@Column()
	public roleUuid: string;

	@Column()
	public userUuid: string;
}
