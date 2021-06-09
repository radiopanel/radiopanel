import { Get, Controller, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '~shared/guards/auth.guard';
import { permissions } from '~shared/permissions';
import { ContentTypeService } from '~shared/services/content-type.service';
import { PageTypeService } from '~shared/services/page-type.service';

@Controller('/permissions')
@ApiTags('Permissions')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class PermissionController {
	constructor(
		private readonly contentTypeService: ContentTypeService,
		private readonly pageTypeService: PageTypeService,
	) {}

	@Get()
	// TODO: Update typings
	public async find(): Promise<any[]> {
		const [contentTypes, pageTypes] = await Promise.all([
			this.contentTypeService.find(1, 500),
			this.pageTypeService.find(1, 500)
		]);

		return permissions( pageTypes._embedded, contentTypes._embedded);
	}
}
