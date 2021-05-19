import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddStorageToTenant1583435040290 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const column = new TableColumn({
			name: 'storage',
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
