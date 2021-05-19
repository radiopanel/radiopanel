import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { SongPlay } from './song-play.entity';

@Entity()
export class Song {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@OneToMany(() => SongPlay, songPlay => songPlay.song)
	public songPlays: SongPlay[];

	@Column()
	public externalId: string;

	@Column()
	public title: string;

	@Column()
	public artist: string;

	@Column()
	public album: string;

	@Column()
	public originalTitle: string;

	@Column()
	public previewUrl: string;

	@Column()
	public durationMs: number;

	@Column()
	public releaseDate: Date;

	@Column({ type: 'jsonb', nullable: true })
	public graphic: any;

	@Column({ type: 'jsonb', nullable: true })
	public extraInfo: any;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
