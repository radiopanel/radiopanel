import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SongPlay, Song } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { SongHistoryController } from './controllers/song-history.controller';
import { SongService } from './services/song.service';
import { SongController } from './controllers/song.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([SongPlay, Song]),
		SharedModule,
	],
	controllers: [SongHistoryController, SongController],
	providers: [SongService],
})
export class SongModule {}
