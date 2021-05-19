import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddTypeToWebhook1596542712346 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const destination = new TableColumn({
			name: 'destination',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('webhook', destination);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// eShrug
	}

}
