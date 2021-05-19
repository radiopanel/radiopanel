import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddMailToTenant1585511357225 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const column = new TableColumn({
			name: 'mail',
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
