import { Injectable } from '@nestjs/common';
import { Repository, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';
import moment from 'moment';

import { Form, FormEntry } from '~entities';
import { Paginated } from '~shared/types';


@Injectable()
export class FormEntryService {

	constructor(
    	@InjectRepository(FormEntry) private formEntryRepository: Repository<FormEntry>,
		@InjectRepository(Form) private formRepository: Repository<Form>,
	) { }

	public async findByForm(formUuid: string, page = 1, pagesize = 20): Promise<Paginated<FormEntry>> {
		const query = this.formEntryRepository.createQueryBuilder('FormEntry')
			.where('FormEntry.formUuid = :formUuid', { formUuid })

		return {
			_embedded: await query
				.skip((page - 1) * pagesize)
				.take(pagesize)
				.getMany(),
			_page: {
				totalEntities: await query.getCount(),
				currentPage: page,
				itemsPerPage: pagesize,
			},
		};
	}

	public findRecent(requestContext: string, minutes: number): Promise<FormEntry | undefined> {
		return this.formEntryRepository.findOne({
			requestContext,
			createdAt: MoreThan(moment().subtract(minutes, 'minutes').toDate())
		});
	}

	public async findOne(formUuid: string, entryUuid: string): Promise<any> {
		return this.formEntryRepository.findOne({
			formUuid, uuid: entryUuid
		});
	}

	public async create(formUuid: string, content: FormEntry): Promise<FormEntry> {
		// Look up the contentType
		const form = await this.formRepository.findOne(formUuid);

		content.form = form;
		content.createdAt = new Date();
		content.updatedAt = new Date();
		content.uuid = uuid.v4();
		return await this.formEntryRepository.save(content);
	}

	public async update(formUuid: string, entryUuid: string, content: Partial<FormEntry>): Promise<any> {
		content.updatedAt = new Date();
		content.uuid = entryUuid;
		content.updatedAt = new Date();
		return this.formEntryRepository.update({
			uuid: entryUuid,
		}, content);
	}

	public async delete(formSlug: string, entryUuid: string): Promise<void> {
		await this.formEntryRepository.delete({
			uuid: entryUuid
		});

		return;
	}
}
