import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddTagToBanner1595879910403 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const tag = new TableColumn({
			name: 'tag',
			type: 'varchar',
			length: '255',
			default: null,
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('banner', tag);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
