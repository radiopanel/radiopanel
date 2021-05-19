import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddRequestContextToFormEntry1596393133798 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const summary = new TableColumn({
			name: 'requestContext',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: false,
		});

		await queryRunner.addColumn('form_entry', summary);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
