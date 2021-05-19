import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddSongMeta1593711697535 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const duration = new TableColumn({
			name: 'durationMs',
			type: 'integer',
			isPrimary: false,
			isNullable: true,
		});

		const preview = new TableColumn({
			name: 'previewUrl',
			type: 'varchar',
			length: '512',
			isPrimary: false,
			isNullable: true,
		});

		const releaseDate = new TableColumn({
			name: 'releaseDate',
			type: 'timestamp',
			isPrimary: false,
			isNullable: true,
		})

		await queryRunner.addColumn('song', duration);
		await queryRunner.addColumn('song', preview);
		await queryRunner.addColumn('song', releaseDate);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// DO nothinf
	}

}
