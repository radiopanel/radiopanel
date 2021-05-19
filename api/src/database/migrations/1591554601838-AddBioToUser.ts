import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddBioToUser1591554601838 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const bio = new TableColumn({
			name: 'bio',
			type: 'text',
			isPrimary: false,
			isNullable: true,
		});

		const socials = new TableColumn({
			name: 'socials',
			type: 'jsonb',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('user', bio);
		await queryRunner.addColumn('user', socials);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
