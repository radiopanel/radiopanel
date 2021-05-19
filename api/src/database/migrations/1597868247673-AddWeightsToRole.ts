import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddWeightsToRole1597868247673 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const weight = new TableColumn({
			name: 'weight',
			type: 'integer',
			isPrimary: false,
			isNullable: true,
			default: 0,
		});

		await queryRunner.addColumn('role', weight);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Memes
	}

}
