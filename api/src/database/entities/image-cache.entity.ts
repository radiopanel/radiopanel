import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ImageCache {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public slug: string;

	@Column({ type: 'bytea', nullable: true })
	public data: Buffer;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
