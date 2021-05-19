import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddUserUuidToSongPlay1597065157552 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const slotUuid = new TableColumn({
			name: 'slotUuid',
			type: 'varchar',
			default: null,
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('song_play', slotUuid);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
