import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { User } from './user.entity';
import { Role } from './role.entity';

@Entity()
export class Tenant {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public name: string;

	@Column()
	public slug: string;

	@Column()
	public url: string;

	@Column()
	public rules: string;

	@Column({ type: 'jsonb', nullable: true })
	public settings: any;

	@Column({ type: 'jsonb', nullable: true })
	public socials: any;

	@Column({ type: 'jsonb', nullable: true })
	public profileFields: any;

	@Column({ type: 'jsonb', nullable: true })
	public slotFields: any;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}

