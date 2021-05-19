import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { ApiKey } from './api-key.entity';

@Entity()
export class ApiKeyPermission {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public permission: string;

	@ManyToOne(() => ApiKey, apiKey => apiKey.uuid)
	public apiKey: ApiKey;

	@Column()
	public apiKeyUuid: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
