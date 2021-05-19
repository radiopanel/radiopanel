import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateApiKey1596042631820 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const table = new Table({
			name: 'api_key',
			columns: [
				{
					name: 'uuid',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isUnique: true,
					isNullable: false,
				}, {
					name: 'name',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				},  {
					name: 'key',
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
				}, {
					name: 'expiresAt',
					type: 'timestamp',
					isPrimary: false,
					isNullable: true,
				},
			],
		});
		await queryRunner.createTable(table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		queryRunner.dropTable('api_key')
	}

}
