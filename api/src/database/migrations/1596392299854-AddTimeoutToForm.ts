import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddTimeoutToForm1596392299854 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const summary = new TableColumn({
			name: 'timeout',
			type: 'integer',
			default: null,
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('form', summary);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
