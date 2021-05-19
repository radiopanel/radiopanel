import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RulePage {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public name: string;

	@Column()
	public content: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
