import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSlotOverwrite1599816168953 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const table = new Table({
			name: 'slot_overwrite',
			columns: [
				{
					name: 'uuid',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isUnique: true,
					isNullable: false,
				}, {
					name: 'slotUuid',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'action',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'overwriteDate',
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
		queryRunner.dropTable('slot_overwrite')
	}

}
