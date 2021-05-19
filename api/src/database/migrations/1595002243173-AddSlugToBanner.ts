import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class CreateBanner1595002243173 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const slug = new TableColumn({
			name: 'slug',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: false,
		});

		await queryRunner.addColumn('banner', slug);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
