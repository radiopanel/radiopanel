import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateTenant1578144414543 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const table = new Table({
			name: 'tenant',
			columns: [
				{
					name: 'uuid',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isNullable: false,
				}, {
					name: 'slug',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'url',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'name',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'rules',
					type: 'text',
					isPrimary: false,
					isNullable: true,
				}, {
					name: 'settings',
					type: 'jsonb',
					isPrimary: false,
					isNullable: true,
				}, {
					name: 'profileFields',
					type: 'jsonb',
					isPrimary: false,
					isNullable: true,
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
		await queryRunner.dropTable('tenant');
	}

}
