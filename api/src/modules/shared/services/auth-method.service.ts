import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, LessThan, IsNull } from "typeorm";

import { AuthenticationMethod } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
export class AuthMethodService {

	constructor(
		@InjectRepository(AuthenticationMethod) private authenticationMethodRepository: Repository<AuthenticationMethod>,
	) { }

	public async find(page = 1, pagesize = 20, showOnlyEnabled = false): Promise<Paginated<AuthenticationMethod>> {
		const query = this.authenticationMethodRepository.createQueryBuilder('AuthenticationMethod')
			.orderBy('AuthenticationMethod.weight', 'DESC')

		if (showOnlyEnabled) {
			query.andWhere('AuthenticationMethod.enabled = TRUE')
		}

		return {
			_embedded: await query
				.skip((page - 1) * pagesize)
				.take(pagesize)
				.getMany(),
			_page: {
				totalEntities: await query.getCount(),
				currentPage: page,
				itemsPerPage: pagesize,
			},
		};
	}

	public findOne(search: any): Promise<AuthenticationMethod | undefined> {
		return this.authenticationMethodRepository.findOne(search);
	}

	public async create(authenticationMethod: Partial<AuthenticationMethod>): Promise<AuthenticationMethod> {
		const createdAuthenticationMethod = await this.authenticationMethodRepository.save({
			uuid: uuid.v4(),
			...authenticationMethod,
			updatedAt: new Date(),
			createdAt: new Date(),
		});

		return createdAuthenticationMethod;
	}

	public async update(uuid: string, authenticationMethod: AuthenticationMethod): Promise<AuthenticationMethod> {
		return this.authenticationMethodRepository.save({
			uuid,
			...authenticationMethod,
			updatedAt: new Date(),
		});
	}

	public async delete(id: string): Promise<void> {
		await this.authenticationMethodRepository.delete(id);
		
		return;
	}

}
