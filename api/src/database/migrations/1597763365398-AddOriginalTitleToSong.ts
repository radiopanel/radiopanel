import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddOriginalTitleToSong1597763365398 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const slotUuid = new TableColumn({
			name: 'originalTitle',
			type: 'varchar',
			default: null,
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('song', slotUuid);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
