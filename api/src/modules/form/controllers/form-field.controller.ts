import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "~shared/guards/auth.guard";

@Controller('/form-fields')
@ApiTags('Form Fields')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class FormFieldController {
	@Get()
	public find(): any[] {
		return [
			{
				identifier: 'text-input',
				name: 'Text Field',
				description: 'This a useful text field',
				icon: 'bold',
				config: [
					{
						identifier: 'placeholder',
						name: 'Placeholder',
						component: 'text-input',
					},
				],
			},
			{
				identifier: 'textarea-input',
				name: 'Textarea',
				description: 'This is a text field but larger',
				icon: 'align-justify',
				config: [
					{
						identifier: 'placeholder',
						name: 'Placeholder',
						component: 'text-input',
					},
				],
			},
			{
				identifier: 'boolean-input',
				name: 'Yes / No',
				description: 'Pretty much a yes or no',
				icon: 'check-square',
				config: [],
			},
			{
				identifier: 'dynamic-file-input',
				name: 'File',
				description: 'Server files / images / ... easily',
				icon: 'file',
				config: [],
			},
			{
				identifier: 'richtext-input',
				name: 'Rich text',
				description: 'Allows you to save HTML',
				icon: 'edit-alt',
				config: [],
			},
			{
				identifier: 'song-input',
				name: 'Song',
				description: 'Add some song to your content',
				icon: 'music-note',
				config: [],
			},
			{
				identifier: 'tag-input',
				name: 'Tags',
				description: 'Add some tags to your content',
				icon: 'pricetag-alt',
				config: [],
			},
		];
	}
}
