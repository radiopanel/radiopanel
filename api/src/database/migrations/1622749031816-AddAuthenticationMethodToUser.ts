import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddIssuerToUser1622749031816 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
		const issuer = new TableColumn({
			name: 'authenticationMethodUuid',
			type: 'varchar',
			length: '255',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('user', issuer);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
