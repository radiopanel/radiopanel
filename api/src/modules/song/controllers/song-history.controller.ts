import { Controller, Get, Headers, UseGuards, Param, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { SongPlay } from '~entities';
import { AuthGuard } from '~shared/guards/auth.guard';
import { Permissions } from '~shared/decorators';

import { SongService } from '../services/song.service';

@Controller('song-history')
@ApiTags('Songs')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class SongHistoryController {
	constructor(
		private songService: SongService,
	) { }

	@Get('/now-playing')
	@Permissions('song-history/read')
	public async latest(): Promise<SongPlay> {
		return this.songService.fetchLatestSongFromDatabase();
	}

	@Get()
	@Permissions('song-history/read')
	public async find(
		@Query('page') page,
		@Query('pagesize') pagesize,
		@Query('beforeDate') beforeDate?: string,
		@Query('afterDate') afterDate?: string,
	): Promise<any> {
		return this.songService.findSongHistory(page, pagesize, beforeDate, afterDate);
	}
}
