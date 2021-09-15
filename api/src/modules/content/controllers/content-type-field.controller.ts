import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";

import { AuthGuard } from "~shared/guards/auth.guard";

@Controller('/content-type-fields')
@ApiTags('Content Type Fields')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class ContentTypeFieldController {
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
					{
						identifier: 'type',
						name: 'Type',
						component: 'text-input',
						config: {
							placeholder: 'text'
						}
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
				config: [
					{
						identifier: 'multiple',
						name: 'Multiple',
						component: 'boolean-input',
					},
				],
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
			{
				identifier: 'repeater',
				name: 'Repeater',
				description: 'Repeat one or more fields in a content item',
				icon: 'repeat',
				config: [],
			},
			{
				identifier: 'content-input',
				name: 'Content',
				description: 'Link content with each other',
				icon: 'align-left',
				config: [
					{
						identifier: 'contentTypeUuid',
						name: 'Content type',
						component: 'content-type-input',
					},
				],
			},
			{
				identifier: 'page-input',
				name: 'Page',
				description: 'Link pages with each other',
				icon: 'file',
				config: [],
			},
		];
	}
}
