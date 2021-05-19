import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateImaging1598102215810 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const table = new Table({
			name: 'imaging',
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
					isPrimary: true,
					isNullable: false,
				}, {
					name: 'description',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isNullable: false,
				}, {
					name: 'entries',
					type: 'jsonb',
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
		queryRunner.dropTable('imaging')
	}

}
