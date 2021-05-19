import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Dashboard {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column({ type: 'jsonb', nullable: true })
	public data: any;

	@Column()
	public userUuid: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
