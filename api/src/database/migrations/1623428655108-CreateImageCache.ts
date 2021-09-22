import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateImageCache1623428655108 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const table = new Table({
			name: 'image_cache',
			columns: [
				{
					name: 'uuid',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isUnique: true,
					isNullable: false,
				}, {
					name: 'slug',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'data',
					type: 'bytea',
					isNullable: true,
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
		await queryRunner.dropTable('image_cache');
	}

}
