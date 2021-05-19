import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PasswordReset {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public emailAddress: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
