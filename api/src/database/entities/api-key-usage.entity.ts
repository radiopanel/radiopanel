import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { ApiKey } from './api-key.entity';

@Entity()
export class ApiKeyUsage {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public value: number;

	@ManyToOne(() => ApiKey, apiKey => apiKey.uuid)
	public apiKey: ApiKey;

	@Column()
	public apiKeyUuid: string;

	@Column()
	public createdAt: Date;

	@Column()
	public updatedAt: Date;
}
