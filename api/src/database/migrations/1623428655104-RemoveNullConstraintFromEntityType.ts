import {MigrationInterface, QueryRunner} from 'typeorm';

export class RemoveNullConstraintFromEntityType1623428655104 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(`ALTER TABLE page_type_field ALTER COLUMN "pageTypeUuid" DROP NOT NULL`);
		await queryRunner.query(`ALTER TABLE content_type_field ALTER COLUMN "contentTypeUuid" DROP NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// GL
	}

}
