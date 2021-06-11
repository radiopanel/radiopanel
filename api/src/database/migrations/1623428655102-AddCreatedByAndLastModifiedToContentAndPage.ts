import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddCreatedByAndLastModifiedToContentAndPage1623428655102 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
		const createdByUuid = new TableColumn({
			name: 'createdByUuid',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: true,
		});

		const updatedByUuid = new TableColumn({
			name: 'updatedByUuid',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('content', createdByUuid);
		await queryRunner.addColumn('page', createdByUuid);

		await queryRunner.addColumn('content', updatedByUuid);
		await queryRunner.addColumn('page', updatedByUuid);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
