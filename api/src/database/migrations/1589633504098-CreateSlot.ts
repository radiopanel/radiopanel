import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSlot1589633504098 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const table = new Table({
			name: 'slot',
			columns: [
				{
					name: 'uuid',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isUnique: true,
					isNullable: false,
				}, {
					name: 'recurring',
					type: 'boolean',
					default: false,
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'slotTypeUuid',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'userUuid',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'start',
					type: 'integer',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'end',
					type: 'integer',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'title',
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
		await queryRunner.dropTable('slot');
	}

}
