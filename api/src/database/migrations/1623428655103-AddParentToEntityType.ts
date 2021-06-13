import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddParentToEntityType1623428655103 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const column = new TableColumn({
			name: 'parentUuid',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('content_type_field', column);
		await queryRunner.addColumn('page_type_field', column);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// (╯°Д°）╯︵/(.□ . )
	}

}
