import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { SlotType } from './slot-type.entity';
import { User } from './user.entity';

@Entity()
export class Slot {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public title: string;

	@ManyToOne(() => SlotType, slotType => slotType.uuid)
	public slotType: SlotType;

	@Column()
	public userUuid: string;

	@ManyToOne(() => User, user => user.uuid, {
		eager: true,
	})
	public user: User;

	@Column()
	public slotTypeUuid: string;

	@Column()
	public start: number;

	@Column()
	public end: number;

	@Column()
	public recurring: boolean;

	@Column({ type: 'jsonb', nullable: true })
	public customData: any;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
