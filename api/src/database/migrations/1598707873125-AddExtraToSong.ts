import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddExtraToSong1598707873125 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const extraInfo = new TableColumn({
			name: 'extraInfo',
			type: 'jsonb',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('song', extraInfo);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
