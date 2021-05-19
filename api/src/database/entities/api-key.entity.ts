import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';

import { ApiKeyPermission } from './api-key-permission.entity';
import { ApiKeyUsage } from './api-key-usage.entity';

@Entity()
export class ApiKey {
	@PrimaryGeneratedColumn('uuid')
	public uuid: string;

	@Column()
	public name: string;

	@OneToMany(() => ApiKeyPermission, apiKeyPermission => apiKeyPermission.apiKey, {
		eager: true,
		cascade: true,
		onDelete: 'CASCADE',
	})
	public permissions: ApiKeyPermission[];

	@OneToMany(() => ApiKeyUsage, apiKeyUsage => apiKeyUsage.apiKey, {
		eager: false,
	})
	public usage: ApiKeyUsage[];

	@Column()
	public key: string;

	@Column()
	public updatedAt: Date;

	@Column()
	public createdAt: Date;
}
