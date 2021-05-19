import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Song } from './song.entity'
import { Slot } from './slot.entity';

@Entity()
export class SongPlay {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@ManyToOne(() => Song, song => song.uuid, {
		eager: true,
	})
	public song: Song;

	@Column()
	public songUuid: string;

	@Column()
	public slotUuid: string;

	@ManyToOne(() => Slot, slot => slot.uuid, {
		eager: true,
	})
	public slot: Slot;

	@Column()
	public createdAt: Date;
}
