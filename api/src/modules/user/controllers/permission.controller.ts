import { Get, Controller, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '~shared/guards/auth.guard';
import { permissions } from '~shared/permissions';

@Controller('/permissions')
@ApiTags('Permissions')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class PermissionController {
	@Get()
	public find(): any[] {
		return permissions;
	}
}
