import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid'
import { Repository } from "typeorm";

import { Dashboard } from "~entities";

@Injectable()
export class DashboardService {
	constructor(
		@InjectRepository(Dashboard) private dashboardRepository: Repository<Dashboard>,
	) { }

	public async findOne(userUuid: string): Promise<Dashboard | null> {
		return this.dashboardRepository.findOne({ userUuid });
	}

	public async update(userUuid: string, data: any): Promise<Dashboard> {
		const existingDashboard = await this.dashboardRepository.findOne({ userUuid });

		if (!existingDashboard) {
			return this.dashboardRepository.save({
				uuid: uuid.v4(),
				data,
				userUuid,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
		}

		return this.dashboardRepository.save({
			...existingDashboard,
			data,
			updatedAt: new Date(),
		})
	}
}
