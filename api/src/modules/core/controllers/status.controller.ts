import { Controller, Get } from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';

import { version, commitHash, commitHashShort, buildDate, buildBranch } from '../../../../package.json';

@Controller('status')
@ApiTags('Core')
export class StatusController {
	@Get('/')
	public find(): any {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		return {
			status: 'ok',
			version,
			commitHash,
			commitHashShort,
			buildDate,
			buildBranch
		};
	}
}
