import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddCustomDataToSlot1623428655106 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const column = new TableColumn({
			name: 'customData',
			type: 'jsonb',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('slot', column);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		//
	}

}
