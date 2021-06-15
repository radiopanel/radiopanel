import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddSlotFieldsToTenant1623428655105 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const column = new TableColumn({
			name: 'slotFields',
			type: 'jsonb',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('tenant', column);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		//
	}

}
