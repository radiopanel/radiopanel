import * as moment from 'moment';
import { ActionViewComponent } from '~lib/ui/components/action-view/action-view.component';
import { TablePreviewComponent } from '~lib/ui/components/table-preview/table-preview.component';
import { TableColumn } from '~lib/ui/components/table/table.types';
import { ContentStatusComponent } from '../../components/content-status/content-status.component';

export const getColumns = (contentTypeFields: any[] = []): TableColumn[] => [
	{
		id: 'name',
		label: 'Administration name',
		value: 'name',
	},
	...contentTypeFields.filter((field) => !!field.showOnOverview).map((field) => ({
		id: `fields.${field.slug}`,
		label: field.name,
		value: `fields.${field.slug}`,
		component: TablePreviewComponent,
		extraComponentProps: {
			fieldType: field.fieldType,
		}
	})),
	{
		id: 'status',
		label: 'Status',
		value: 'published',
		disableSorting: true,
		width: '150px',
		component: ContentStatusComponent,
	},
	{
		id: 'updatedAt',
		label: 'Last updated',
		value: 'updatedAt',
		width: '150px',
		format: (value) => moment(value).fromNow()
	},
	{
		id: 'action',
		label: '',
		value: 'uuid',
		disableSorting: true,
		width: '50px',
		component: ActionViewComponent,
	},
];
