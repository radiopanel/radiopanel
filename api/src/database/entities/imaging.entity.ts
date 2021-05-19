import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Imaging {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public name: string;

	@Column()
	public description: string;

	@Column({ type: 'jsonb', nullable: true })
	public entries: any;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
