import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class UserMeta {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public key: string;

	@Column({ type: 'jsonb', nullable: true })
	public value: any;

	@ManyToOne(() => User, user => user.uuid)
	public user: User;

	@Column()
	public userUuid: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
