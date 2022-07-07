import { ContentType } from "~entities/content-type.entity";
import { PageType } from "~entities/page-type.entity";

export const permissions = (pageTypes: PageType[], contentTypes: ContentType[]) => ([
	{
		name: 'User permissions',
		groups: [
			{
				name: 'General',
				icon: 'home',
				permissions: [
					{
						label: 'View Connection Info',
						value: 'dashboard/read-connection-info',
					},
				],
			},
			{
				name: 'Timetable',
				icon: 'calender',
				permissions: [
					{
						label: 'View timetable',
						value: 'timetable/read',
					},
					{
						label: 'Book slots',
						value: 'timetable/book',
					},
					{
						label: 'Book for other users',
						value: 'timetable/book-other',
					},
					{
						label: 'Update other slots',
						value: 'timetable/update-other',
					},
					{
						label: 'Delete own slots',
						value: 'timetable/delete-own',
					},
					{
						label: 'Delete other slots',
						value: 'timetable/delete-other',
					},
				],
			},
			{
				name: 'Song History',
				icon: 'music-note',
				permissions: [
					{
						label: 'View Song History',
						value: 'song-history/read',
					},
				],
			},
			{
				name: 'Storage',
				icon: 'server-alt',
				permissions: [
					{
						label: 'List directory',
						value: 'storage/list',
					},
					{
						label: 'Upload file',
						value: 'storage/upload',
					},
					{
						label: 'Edit file',
						value: 'storage/edit',
					},
					{
						label: 'Delete file',
						value: 'storage/delete',
					},
					{
						label: 'Create directory',
						value: 'storage/create-directory',
					},
					{
						label: 'Delete directory',
						value: 'storage/delete-directory',
					},
				],
			},
			{
				name: 'Requests',
				icon: 'comment-lines',
				permissions: [
					{
						label: 'Read requests',
						value: 'requests/read',
					},
					{
						label: 'View request origin',
						value: 'requests/read-origin',
					},
					// {
					// 	label: 'View request context (IP)',
					// 	value: 'requests/read-context',
					// },
					{
						label: 'Create requests',
						value: 'requests/create',
					},
					{
						label: 'Delete requests',
						value: 'requests/delete',
					},
					{
						label: 'Ignore request timeout',
						value: 'requests/ignore-timeout',
					},
				],
			},
			{
				name: 'Banners',
				icon: 'image',
				permissions: [
					{
						label: 'Read banners',
						value: 'banners/read',
					},
					{
						label: 'Create banners',
						value: 'banners/create',
					},
					{
						label: 'Update banners',
						value: 'banners/update',
					},
					{
						label: 'Delete banners',
						value: 'banners/delete',
					},
				],
			},
			{
				name: 'Song Database',
				icon: 'music',
				permissions: [
					{
						label: 'Read songs',
						value: 'songs/read',
					},
					{
						label: 'Create songs',
						value: 'songs/create',
					},
					{
						label: 'Update songs',
						value: 'songs/update',
					},
					{
						label: 'Delete songs',
						value: 'songs/delete',
					},
				],
			},
			{
				name: 'Forms',
				icon: 'notes',
				permissions: [
					{
						label: 'Read forms',
						value: 'forms/read',
					},
					{
						label: 'Create forms',
						value: 'forms/create',
					},
					{
						label: 'Update forms',
						value: 'forms/update',
					},
					{
						label: 'Delete forms',
						value: 'forms/delete',
					},
					{
						label: 'Read form entries',
						value: 'form-entries/read',
					},
					{
						label: 'Create form entries',
						value: 'form-entries/create',
					},
					{
						label: 'Update form entries',
						value: 'form-entries/update',
					},
					{
						label: 'Delete form entries',
						value: 'form-entries/delete',
					},
				],
			},
		]
	},
	{
		name: 'Admin permissions',
		groups: [
			{
				name: 'Settings',
				icon: 'cog',
				permissions: [
					{
						label: 'Read settings',
						value: 'settings/read',
					},
					{
						label: 'Update settings',
						value: 'settings/update',
					},
				],
			},
			{
				name: 'Users',
				icon: 'user-plus',
				permissions: [
					{
						label: 'Read users',
						value: 'users/read',
					},
					//{
					//	label: 'Create users',
					//	value: 'users/create',
					//},
					{
						label: 'Update users',
						value: 'users/update',
					},
					{
						label: 'Delete users',
						value: 'users/delete',
					},
				],
			},
			{
				name: 'Roles',
				icon: 'shield',
				permissions: [
					{
						label: 'Read roles',
						value: 'roles/read',
					},
					{
						label: 'Create roles',
						value: 'roles/create',
					},
					{
						label: 'Update roles',
						value: 'roles/update',
					},
					{
						label: 'Delete roles',
						value: 'roles/delete',
					},
				],
			},
			{
				name: 'Invites',
				icon: 'user-plus',
				permissions: [
					{
						label: 'Read invites',
						value: 'invites/read',
					},
					{
						label: 'Create invites',
						value: 'invites/create',
					},
					{
						label: 'Update invites',
						value: 'invites/update',
					},
					{
						label: 'Delete invites',
						value: 'invites/delete',
					},
				],
			},
			{
				name: 'Slot Types',
				icon: 'list-ul',
				permissions: [
					{
						label: 'Read slot types',
						value: 'slot-types/read',
					},
					{
						label: 'Create slot types',
						value: 'slot-types/create',
					},
					{
						label: 'Update slot types',
						value: 'slot-types/update',
					},
					{
						label: 'Delete slot types',
						value: 'slot-types/delete',
					},
				],
			},
			{
				name: 'Webhooks',
				icon: 'cog',
				permissions: [
					{
						label: 'Read webhooks',
						value: 'webhooks/read',
					},
					{
						label: 'Create webhooks',
						value: 'webhooks/create',
					},
					{
						label: 'Update webhooks',
						value: 'webhooks/update',
					},
					{
						label: 'Delete webhooks',
						value: 'webhooks/delete',
					},
				],
			},
			{
				name: 'Api Keys',
				icon: 'key-skeleton-alt',
				permissions: [
					{
						label: 'Read api keys',
						value: 'api-keys/read',
					},
					{
						label: 'Create api keys',
						value: 'api-keys/create',
					},
					{
						label: 'Update api keys',
						value: 'api-keys/update',
					},
					{
						label: 'Delete api keys',
						value: 'api-keys/delete',
					},
				],
			},
			{
				name: 'Content Types',
				icon: 'align-left-justify',
				permissions: [
					{
						label: 'Read content-types',
						value: 'content-types/read',
					},
					{
						label: 'Create content-types',
						value: 'content-types/create',
					},
					{
						label: 'Update content-types',
						value: 'content-types/update',
					},
					{
						label: 'Delete content-types',
						value: 'content-types/delete',
					},
				],
			},
			{
				name: 'Page Types',
				icon: 'file',
				permissions: [
					{
						label: 'Read page-types',
						value: 'page-types/read',
					},
					{
						label: 'Create page-types',
						value: 'page-types/create',
					},
					{
						label: 'Update page-types',
						value: 'page-types/update',
					},
					{
						label: 'Delete page-types',
						value: 'page-types/delete',
					},
				],
			},
			{
				name: 'Bans',
				icon: 'ban',
				permissions: [
					{
						label: 'Read bans',
						value: 'bans/read',
					},
					{
						label: 'Create bans',
						value: 'bans/create',
					},
					{
						label: 'Update bans',
						value: 'bans/update',
					},
					{
						label: 'Delete bans',
						value: 'bans/delete',
					},
				],
			},
			{
				name: 'Rule Pages',
				icon: 'book-alt',
				permissions: [
					{
						label: 'Read rule pages',
						value: 'rule-pages/read',
					},
					{
						label: 'Create rule pages',
						value: 'rule-pages/create',
					},
					{
						label: 'Update rule pages',
						value: 'rule-pages/update',
					},
					{
						label: 'Delete rule pages',
						value: 'rule-pages/delete',
					},
				],
			},
			{
				name: 'Audit Log',
				icon: 'eye',
				permissions: [
					{
						label: 'Read audit log',
						value: 'audit-log/read',
					},
				],
			},
			{
				name: 'Auth Methods',
				icon: 'eye',
				permissions: [
					{
						label: 'Read auth methods',
						value: 'authentication-methods/read',
					},
					{
						label: 'Create auth methods',
						value: 'authentication-methods/create',
					},
					{
						label: 'Update auth methods',
						value: 'authentication-methods/update',
					},
					{
						label: 'Delete auth methods',
						value: 'authentication-methods/delete',
					},
				],
			},
		]
	},
	{
		name: 'Content permissions',
		groups: contentTypes.map((contentType) => ({
			name: contentType.name,
			icon: contentType.icon || 'subject',
			permissions: [
				{
					label: `Read ${contentType.name}`,
					value: `content/${contentType.uuid}/read`,
				},
				{
					label: `Create ${contentType.name}`,
					value: `content/${contentType.uuid}/create`,
				},
				{
					label: `Update ${contentType.name}`,
					value: `content/${contentType.uuid}/update`,
				},
				{
					label: `Delete ${contentType.name}`,
					value: `content/${contentType.uuid}/delete`,
				},
			],
		})),
	},
	{
		name: 'Page permissions',
		groups: pageTypes.map((pageType) => ({
			name: pageType.name,
			icon: pageType.icon || 'file',
			permissions: [
				{
					label: `Read ${pageType.name}`,
					value: `pages/${pageType.uuid}/read`,
				},
				{
					label: `Update ${pageType.name}`,
					value: `pages/${pageType.uuid}/update`,
				},
			],
		})),
	}
])
