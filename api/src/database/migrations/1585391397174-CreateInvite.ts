import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateInvite1585391397174 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const table = new Table({
			name: 'invite',
			columns: [
				{
					name: 'uuid',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isUnique: true,
					isNullable: false,
				}, {
					name: 'emailAddress',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'username',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'roleUuid',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'updatedAt',
					type: 'timestamp',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'createdAt',
					type: 'timestamp',
					isPrimary: false,
					isNullable: false,
				},
			],
		});
		await queryRunner.createTable(table);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropTable('invite');
	}

}
