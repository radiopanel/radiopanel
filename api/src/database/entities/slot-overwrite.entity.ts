import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SlotOverwrite {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public slotUuid: string;

	@Column()
	public action: string;

	@Column()
	public overwriteDate: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
