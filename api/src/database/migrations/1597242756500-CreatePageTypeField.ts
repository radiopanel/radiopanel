import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePageTypeField1597242756500 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const table = new Table({
			name: 'page_type_field',
			columns: [
				{
					name: 'uuid',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isNullable: false,
				}, {
					name: 'name',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'slug',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'showOnOverview',
					type: 'boolean',
					default: 'false',
				}, {
					name: 'config',
					type: 'jsonb',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'fieldType',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'pageTypeUuid',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'order',
					type: 'int',
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
		await queryRunner.dropTable('page_type_field');
	}

}
