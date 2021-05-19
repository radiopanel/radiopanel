export const permissions = [
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
				icon: 'calendar',
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
				name: 'Requests',
				icon: 'comment-lines',
				permissions: [
					{
						label: 'Create requests',
						value: 'requests/create',
					},
					{
						label: 'Ignore request timeout',
						value: 'requests/ignore-timeout',
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
						label: 'Read requests',
						value: 'requests/read',
					},
					{
						label: 'Update requests',
						value: 'requests/update',
					},
					{
						label: 'Delete requests',
						value: 'requests/delete',
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
				name: 'Content',
				icon: 'align-left-justify',
				permissions: [
					{
						label: 'Create content',
						value: 'content/create',
					},
					{
						label: 'Read content',
						value: 'content/read',
					},
					{
						label: 'Update content',
						value: 'content/update',
					},
					{
						label: 'Delete content',
						value: 'content/delete',
					},
				],
			},
			{
				name: 'Pages',
				icon: 'file',
				permissions: [
					{
						label: 'Create pages',
						value: 'pages/create',
					},
					{
						label: 'Read pages',
						value: 'pages/read',
					},
					{
						label: 'Update pages',
						value: 'pages/update',
					},
					{
						label: 'Delete pages',
						value: 'pages/delete',
					},
				],
			},
			{
				name: 'Forms',
				requiresFeature: 'forms',
				icon: 'notes',
				permissions: [
					{
						label: 'Create forms',
						value: 'forms/create',
					},
					{
						label: 'Read forms',
						value: 'forms/read',
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
						label: 'Create form entries',
						value: 'form-entries/create',
					},
					{
						label: 'Read form entries',
						value: 'form-entries/read',
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
						label: 'Create users',
						value: 'users/create',
					},
					{
						label: 'Read users',
						value: 'users/read',
					},
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
						label: 'Create roles',
						value: 'roles/create',
					},
					{
						label: 'Read roles',
						value: 'roles/read',
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
						label: 'Create invites',
						value: 'invites/create',
					},
					{
						label: 'Read invites',
						value: 'invites/read',
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
						label: 'Create webhooks',
						value: 'webhooks/create',
					},
					{
						label: 'Read webhooks',
						value: 'webhooks/read',
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
						label: 'Create api keys',
						value: 'api-keys/create',
					},
					{
						label: 'Read api keys',
						value: 'api-keys/read',
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
						label: 'Create content-types',
						value: 'content-types/create',
					},
					{
						label: 'Read content-types',
						value: 'content-types/read',
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
						label: 'Create page-types',
						value: 'page-types/create',
					},
					{
						label: 'Read page-types',
						value: 'page-types/read',
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
						label: 'Create bans',
						value: 'bans/create',
					},
					{
						label: 'Read bans',
						value: 'bans/read',
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
						label: 'Create rule pages',
						value: 'rule-pages/create',
					},
					{
						label: 'Read rule pages',
						value: 'rule-pages/read',
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
		]
	}
]
