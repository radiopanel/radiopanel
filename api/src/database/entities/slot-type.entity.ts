import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Slot } from './slot.entity';

@Entity()
export class SlotType {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@OneToMany(() => Slot, slot => slot.slotType, {
		eager: false,
	})
	public slots: Slot[];

	@Column()
	public name: string;

	@Column()
	public description: string;

	@Column()
	public color: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
