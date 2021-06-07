import {MigrationInterface, QueryRunner, Table} from "typeorm";
import * as uuid from 'uuid';

export class CreateAuthenticationMethod1622885955531 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
		const table = new Table({
			name: 'authentication_method',
			columns: [
				{
					name: 'uuid',
					type: 'varchar',
					length: '255',
					isPrimary: true,
					isUnique: true,
					isNullable: false,
				}, {
					name: 'name',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'type',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'weight',
					type: 'integer',
					isPrimary: false,
					isNullable: true,
					default: 0,
				}, {
					name: 'defaultRoleUuid',
					type: 'varchar',
					length: '255',
					isPrimary: false,
					isNullable: true,
				}, {
					name: 'enabled',
					type: 'boolean',
					default: 'false',
					isPrimary: false,
					isNullable: false,
				}, {
					name: 'config',
					type: 'jsonb',
					isPrimary: false,
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

		queryRunner.manager.insert('authentication_method', {
			uuid: uuid.v4(),
			name: 'Local',
			type: 'local',
			defaultRoleUuid: null,
			config: {},
			enabled: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('authentication_method')
    }

}
