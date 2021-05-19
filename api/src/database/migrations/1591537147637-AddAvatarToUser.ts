import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAvatarToUser1591537147637 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const column = new TableColumn({
			name: 'avatar',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: true,
		});

		queryRunner.addColumn('user', column);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
