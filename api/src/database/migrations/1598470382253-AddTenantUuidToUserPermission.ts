import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddTenantUuidToUserPermission1598470382253 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const permissionType = new TableColumn({
			name: 'permissionType',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: false,
		});

		await queryRunner.addColumn('user_permission', permissionType);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
