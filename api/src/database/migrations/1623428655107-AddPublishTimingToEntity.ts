import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddPublishTimingToEntity1623428655107 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const published = new TableColumn({
			name: 'published',
			type: 'boolean',
			default: 'true',
			isPrimary: false,
			isNullable: false,
		});

		const publishScheduledAt = new TableColumn({
			name: 'publishScheduledAt',
			type: 'timestamp',
			isPrimary: false,
			isNullable: true,
		});

		const unPublishScheduledAt = new TableColumn({
			name: 'unPublishScheduledAt',
			type: 'timestamp',
			isPrimary: false,
			isNullable: true,
		});

		const publishedAt = new TableColumn({
			name: 'publishedAt',
			type: 'timestamp',
			isPrimary: false,
			isNullable: true,
		});

		await queryRunner.addColumn('content', published);
		await queryRunner.addColumn('page', published);

		await queryRunner.addColumn('content', publishScheduledAt);
		await queryRunner.addColumn('page', publishScheduledAt);

		await queryRunner.addColumn('content', unPublishScheduledAt);
		await queryRunner.addColumn('page', unPublishScheduledAt);

		await queryRunner.addColumn('content', publishedAt);
		await queryRunner.addColumn('page', publishedAt);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// Do nothing
	}

}
