import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateApiKeyPermission1596042633682 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const table = new Table({
			name: 'api_key_permission',
			columns: [
				{
					name: 'uuid',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isUnique: true,
					isNullable: false,
				}, {
					name: 'apiKeyUuid',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				},  {
					name: 'permission',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'updatedAt',
					type: 'timestamp',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'createdAt',
					type: 'timestamp',
					isPrimary: false,
					isNullable: false,
				},
			],
		});
		await queryRunner.createTable(table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		queryRunner.dropTable('api_key_permission')
	}

}
