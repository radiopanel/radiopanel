import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ban {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public identifier: string;

	@Column()
	public comment: string;

	@Column()
	public createdByUuid: string;

	@Column()
	public expiresAt?: Date;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
