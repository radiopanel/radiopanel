import { FallbackComponent, CurrentlyLiveComponent, NextLiveComponent, SongHistoryComponent, NoteComponent } from './components/dashboard/items';

export const DASHBOARD_COMPONENTS = [
	{
		type: 'currently-live',
		component: CurrentlyLiveComponent,
		title: 'Currently Live',
		icon: ''
	},
	{
		type: 'next-live',
		component: NextLiveComponent,
		title: 'Next Live',
		icon: ''
	},
	{
		type: 'song-history',
		component: SongHistoryComponent,
		title: 'Song History',
		icon: ''
	},
	{
		type: 'note',
		component: NoteComponent,
		title: 'Note',
		icon: ''
	},
];

export const DASHBOARD_COMPONENTS_FALLBACK = FallbackComponent;
