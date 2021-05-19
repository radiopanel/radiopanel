import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { RolePermission, Role } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class RoleService {
	@WebSocketServer() private server: any

	constructor(
		@InjectRepository(Role) private roleRepository: Repository<Role>,
		@InjectRepository(RolePermission) private rolePermissionRepository: Repository<RolePermission>
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<Role>> {
		const query = this.roleRepository.createQueryBuilder('Role')
			.leftJoinAndSelect('Role.permissions', 'Permission')
			.orderBy('Role.weight', 'DESC')

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

	public findOne(search: any, loadUsers = false): Promise<Role | undefined> {
		return this.roleRepository.findOne(search, {
			relations: loadUsers ? ['users'] : []
		});
	}

	public async create(role: Partial<Role>): Promise<Role> {
		role.permissions = Object.keys(role.permissions).reduce((acc, permissionKey) => {
			const permissionEnabled = role.permissions[permissionKey];
			if (permissionEnabled) {
				return [
					...acc,
					{
						uuid: uuid.v4(),
						permission: permissionKey,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				];
			}

			return acc;
		}, []);

		const createdRole = await this.roleRepository.save({
			...role,
		});

		this.server.emit('role-updated');
		return createdRole;
	}

	public async update(id: string, role: Role): Promise<Role> {
		// First we find the current fields and kill em off
		await this.rolePermissionRepository.delete({
			roleUuid: id,
		});

		role.permissions = Object.keys(role.permissions).reduce((acc, permissionKey) => {
			const permissionEnabled = role.permissions[permissionKey];
			if (permissionEnabled) {
				return [
					...acc,
					{
						uuid: uuid.v4(),
						permission: permissionKey,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				];
			}

			return acc;
		}, []);
		role.uuid = id;

		const updatedRole = await this.roleRepository.save(role);
		this.server.emit('role-updated');
		return updatedRole;
	}

	public async delete(id: string): Promise<void> {
		await this.roleRepository.delete(id);
		return;
	}

}
