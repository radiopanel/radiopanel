import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddSocialsToTenant1593186548498 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const socials = new TableColumn({
			name: 'socials',
			type: 'jsonb',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('tenant', socials);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
