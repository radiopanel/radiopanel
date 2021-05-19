import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";
import AdmZip from 'adm-zip';
import got from "got/dist/source";

import { Imaging } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
export class ImagingService {

	constructor(
		@InjectRepository(Imaging) private imagingRepository: Repository<Imaging>,
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<Imaging>> {
		const query = this.imagingRepository.createQueryBuilder('Imaging');

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

	public findOne(search: any): Promise<Imaging | undefined> {
		return this.imagingRepository.findOne(search);
	}

	public async download(search: any): Promise<any> {
		const imaging = await this.imagingRepository.findOne(search);

		const files = await Promise.allSettled([...imaging.entries.map(async (entry: { source: string, name: string }) => ({
			name: entry.name,
			source: entry.source,
			data: await got.get(entry.source).buffer(),
		}))]);
	
		const zip = new AdmZip();

		files.forEach((file) => {
			if (file.status !== "fulfilled") {
				return;
			}

			const fileName = `${file.value.name}.${file.value.source.split('.').pop()}`;
			zip.addFile(fileName, file.value.data)
		})

		return zip.toBuffer();
	}

	public async create(imaging: Imaging): Promise<Imaging> {
		const createdImaging = await this.imagingRepository.save({
			uuid: uuid.v4(),
			...imaging,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return createdImaging;
	}

	public async update(id: string, imaging: Imaging): Promise<Imaging> {
		imaging.uuid = id;
		const updatedImaging = await this.imagingRepository.save(imaging);

		return updatedImaging;
	}

	public async delete(imagingUuid: string): Promise<void> {
		await this.imagingRepository.delete(imagingUuid);
		return;
	}
}
