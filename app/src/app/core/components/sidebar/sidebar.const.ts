import { AuthService } from '../../services';

export const coreLinks = (permissions: string[], features: string[]) => [
	{
		icon: 'home',
		name: 'Dashboard',
		link: '/dashboard',
		show: true
	},
	{
		icon: 'calender',
		name: 'Timetable',
		link: '/timetable',
		show: permissions.includes('timetable/read')
	},
	{
		icon: 'comment-lines',
		name: 'Requests',
		link: '/requests',
		show: permissions.includes('requests/read')
	},
	{
		icon: 'music-note',
		name: 'Song History',
		link: '/song-history',
		show: permissions.includes('song-history/read')
	},
	{
		icon: 'music',
		name: 'Song Database',
		link: '/songs',
		show: permissions.includes('songs/read')
	},
	{
		icon: 'image',
		name: 'Banners',
		link: '/banners',
		show: permissions.includes('banners/read')
	},
	{
		icon: 'microphone',
		name: 'Podcasts',
		link: '/podcasts',
		show: permissions.includes('podcasts/read')
	},
	{
		icon: 'notes',
		name: 'Forms',
		link: '/forms',
		show: permissions.includes('forms/read')
	},
	{
		icon: 'camera',
		name: 'Twitch Channels',
		link: '/twitch-channels',
		show: permissions.includes('twitch-channels/read')
	},
	{
		icon: 'bookmark',
		name: 'Imaging',
		link: '/imaging',
		show: permissions.includes('imaging/read')
	},
	{
		icon: 'book-open',
		name: 'Rules',
		link: '/rules/view',
		show: permissions.includes('rule-pages/read')
	},
];

export const adminLinks = (permissions: string[], features: string[]) => [
	{
		icon: 'user-plus',
		name: 'Users',
		link: '/users',
		show: permissions.includes('users/read')
	},
	{
		icon: 'shield',
		name: 'Roles',
		link: '/roles',
		show: permissions.includes('roles/read')
	},
	{
		icon: 'list-ul',
		name: 'Slot Types',
		link: '/slot-types',
		show: permissions.includes('slot-types/update')
	},
	{
		icon: 'anchor',
		name: 'Webhooks',
		link: '/webhooks',
		show: permissions.includes('webhooks/read')
	},
	{
		icon: 'eye',
		name: 'Audit Log',
		link: '/audit-log',
		show: permissions.includes('audit-log/read')
	},
	{
		icon: 'key-skeleton-alt',
		name: 'API Keys',
		link: '/api-keys',
		show: permissions.includes('api-keys/read')
	},
	{
		icon: 'window',
		name: 'Embeds',
		link: '/embeds',
		show: permissions.includes('embeds/read')
	},
	{
		icon: 'align-left-justify',
		name: 'Content Types',
		link: '/content/content-types',
		show: permissions.includes('content-types/update'),
	},
	{
		icon: 'file',
		name: 'Page Types',
		link: '/pages/page-types',
		show: permissions.includes('page-types/update'),
	},
	{
		icon: 'ban',
		name: 'Bans',
		link: '/bans',
		show: permissions.includes('bans/read'),
	},
	{
		icon: 'book-alt',
		name: 'Rule Pages',
		link: '/rules/pages',
		show: permissions.includes('rule-pages/update'),
	},
];

export const myStationLinks = (permissions: string[], features: string[]) => [
	{
		icon: 'cog',
		name: 'Settings',
		link: '/tenants/settings',
		show: permissions.includes('settings/read')
	},
	{
		icon: 'text',
		name: 'Custom Profile Fields',
		link: '/tenants/profile-fields',
		show: permissions.includes('settings/read')
	},
	{
		icon: 'calender',
		name: 'Custom Slot Fields',
		link: '/tenants/slot-fields',
		show: permissions.includes('settings/read')
	},
	{
		icon: 'pen',
		name: 'Customisation',
		link: '/tenants/customisation',
		show: permissions.includes('settings/read')
	},
	{
		icon: 'user-plus',
		name: 'Auth Methods',
		link: '/authentication-methods',
		show: permissions.includes('authentication-methods/read')
	},
];
