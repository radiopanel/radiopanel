import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddIconToContentTypesAndPageTypes1623428531167 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
		const icon = new TableColumn({
			name: 'icon',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('content_type', icon);
		await queryRunner.addColumn('page_type', icon);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
