import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Request {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public name: string;

	@Column()
	public type: string;

	@Column()
	public message: string;

	@Column()
	public requestContext: string;

	@Column()
	public requestOrigin: string;

	@Column({ nullable: true })
	public deletedAt: Date;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}

