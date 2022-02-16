/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, Brackets } from "typeorm";
import { pathOr, prop, map, omit, propOr } from "ramda";
import { WebSocketServer, WebSocketGateway } from "@nestjs/websockets";

import { User, UserRole, UserMeta, UserPermission, Role } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class UserService {
	@WebSocketServer() private server: any

	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
		@InjectRepository(UserPermission) private userPermissionRepository: Repository<UserPermission>,
		@InjectRepository(UserMeta) private userMetaRepository: Repository<UserMeta>
	) { }

	public async find(page = 1, pagesize = 200): Promise<Paginated<any>> {
		const query = this.userRepository.createQueryBuilder('User')
			.leftJoin('User.roles', 'Roles')
			.leftJoin('User._userMeta', 'UserMeta')
			.leftJoin('User.authenticationMethod', 'AuthenticationMethod')
			.select(['User', 'Roles', 'UserMeta', 'AuthenticationMethod.name']);

		const embedded = await query
			.skip((page - 1) * pagesize)
			.take(pagesize)
			.getMany();

		return {
			_embedded: embedded
				.map((user) => ({
					...omit(['_userMeta'])(user),
					...(user._userMeta.find((x) => x.key === 'customData') && { customData: propOr(null, 'value')(user._userMeta.find((x) => x.key === 'customData')) } )
				}))
				.sort((a, b) => {
					return Math.max(...b.roles.map((r) => r.weight)) - Math.max(...a.roles.map((r) => r.weight));
				}),
			_page: {
				totalEntities: await query.getCount(),
				currentPage: page,
				itemsPerPage: pagesize,
			},
		};
	}

	public async findAll(page = 1, pagesize = 200, search = null): Promise<Paginated<User>> {
		const query = this.userRepository.createQueryBuilder('User');

		if (search) {
			query
				.andWhere(new Brackets(qb => qb
					.where('User.firstName LIKE :search', { search: `%${search}%` })
					.orWhere('User.lastName LIKE :search', { search: `%${search}%` })
					.orWhere('User.email LIKE :search', { search: `%${search}%` })))
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

	public async findOne(search: any): Promise<any> {
		const query = this.userRepository.createQueryBuilder('User');

		if (search.uuid) {
			query.andWhere('User.uuid = :uuid', { uuid: search.uuid })
		}

		if (search.email) {
			query.andWhere('User.email = :email', { email: search.email })
		}

		if (search.authenticationMethodUuid) {
			query.andWhere('User.authenticationMethodUuid = :authenticationMethodUuid', { authenticationMethodUuid: search.authenticationMethodUuid })
		}

		const [user, userMeta] = await Promise.all([
			query.getOne(),
			this.getMeta(search.uuid)
		]);

		if (!user) {
			return null;
		}

		const customData = userMeta.find((x) => x.key === "customData");

		return {
			...user,
			...(pathOr(null, ['value'])(customData) && { customData: pathOr(null, ['value'])(customData) }),
		};
	}

	public async create(user: Omit<Partial<User>, 'hashPassword'>): Promise<User> {
		const newUser = await this.userRepository.save({
			uuid: uuid.v4(),
			...user,
			admin: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		return newUser;
	}

	public async update(id: string, user: Partial<User>): Promise<User> {
		user.uuid = id;
		return this.userRepository.save(user);
	}

	public async deleteFromTenant(userUuid: string): Promise<User> {
		const user = await this.userRepository.findOne(userUuid, {
			relations: ['tenants']
		});

		await this.userRoleRepository.delete({
			userUuid,
		});
		await this.userRepository.save(user);

		return await this.userRepository.findOne(userUuid);
	}

	public async assignRole(userUuid: string, roleUuid: string): Promise<void> {
		await this.userRoleRepository.delete({
			userUuid,
		});

		await this.userRoleRepository.save({
			uuid: uuid.v4(),
			roleUuid,
			userUuid,
		});

		this.server.emit('user-role-updated');
		return;
	}

	public async assignRoles(userUuid: string, roleUuids: string[]): Promise<void> {
		await this.userRoleRepository.delete({
			userUuid,
		});

		await Promise.all(roleUuids.map((roleUuid) => this.userRoleRepository.save({
			uuid: uuid.v4(),
			roleUuid,
			userUuid,
		})))

		this.server.emit('user-role-updated');
		return;
	}

	public async updatePermissions(userUuid: string, permissions: any[]): Promise<void> {
		// First we find the current fields and kill em off
		await this.userPermissionRepository.delete({
			userUuid,
		});

		const permissionObjects = Object.keys(permissions).reduce((acc, permissionKey) => {
			const permissionType = permissions[permissionKey];

			// Don't bother with inherited shit
			if (permissionType === "grant" || permissionType === "deny" ) {
				return [
					...acc,
					{
						uuid: uuid.v4(),
						userUuid,
						permission: permissionKey,
						permissionType: permissionType,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				];
			}

			return acc;
		}, []);

		await this.userPermissionRepository.save(permissionObjects);
		return;
	}

	public async getPermissions(userUuid: string): Promise<UserPermission[]> {
		return this.userPermissionRepository.find({
			userUuid,
		});
	}

	public async assignMeta(key: string, userUuid: string, value: any): Promise<void> {
		try {
			await this.userMetaRepository.delete({
				userUuid,
				key
			});
		} catch(e) {}

		await this.userMetaRepository.save({
			uuid: uuid.v4(),
			key,
			userUuid,
			value,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	public async deleteMeta(key: string, userUuid: string): Promise<void> {
		try {
			await this.userMetaRepository.delete({
				userUuid,
				key
			});
		} catch(e) {}
	}

	public async getRole(userUuid: string): Promise<any> {
		const roleRelation = await this.userRoleRepository.findOne({
			userUuid,
		});

		return prop('role')(roleRelation);
	}

	public async getRoles(userUuid: string): Promise<Role[]> {
		const roleRelations = await this.userRoleRepository.find({
			userUuid,
		});

		return roleRelations.map((role) => role.role);
	}

	public async getMeta(userUuid: string): Promise<any> {
		return (await this.userMetaRepository.find({
			userUuid,
		})).map((meta) => ({
			...meta,
			type: meta.key,
		}));
	}

	public async delete(userUuid: string): Promise<void> {
		await this.userRepository.delete(userUuid);

		return ;
	}
}
