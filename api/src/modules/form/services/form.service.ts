import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";

import { Form, FormField } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
export class FormService {

	constructor(
		@InjectRepository(Form) private formRepository: Repository<Form>,
		@InjectRepository(FormField) private formFieldRepository: Repository<FormField>
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<Form>> {
		const query = this.formRepository.createQueryBuilder('Content')
			.leftJoinAndSelect('Content.fields', 'Fields')
			.leftJoinAndSelect('Content.entries', 'Entry')
			.orderBy('Fields.order', 'ASC');

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

	public findOne(id: string): Promise<Form | undefined> {
		return this.formRepository.createQueryBuilder('Content')
			.where('Content.uuid = :id', { id })
			.leftJoinAndSelect('Content.fields', 'Fields')
			.orderBy('Fields.order', 'ASC')
			.getOne();
	}

	public findOnePure(params: any): Promise<Form | undefined> {
		return this.formRepository.findOne(params);
	}

	public async create(form: Form): Promise<Form> {
		form.uuid = uuid.v4();
		form.createdAt = new Date();
		form.updatedAt = new Date();
		form.fields = this.mapFieldsWithOrder(form.uuid, form.fields || []);

		return await this.formRepository.save(form);
	}

	public async update(id: string, form: Form): Promise<any> {
		// First we find the current fields and kill em off
		await this.formFieldRepository.delete({
			formUuid: id,
		});

		form.uuid = id;
		form.updatedAt = new Date();
		form.fields = this.mapFieldsWithOrder(form.uuid, form.fields || []);

		return this.formRepository.save(form);
	}

	public async delete(id: string): Promise<void> {
		await this.formRepository.delete(id);
		return;
	}

	private mapFieldsWithOrder(formUuid: string, fields: FormField[], isSubfield = false): FormField[] {
		let order = 0;
		return fields.map((field) => ({
			formUuid: isSubfield ? undefined : formUuid,
			createdAt: new Date(),
			...field,
			uuid: uuid.v4(),
			updatedAt: new Date(),
			order: order++,
		}));
	}
}
