import moment from 'moment';

export const discordTransform = {
	'posts/update': (data: any) => ({
		title: data.title,
		description: data.summary,
		image: {
			url: data.featuredImage
		},
		footer: {
			text: `Posted by ${data.user.firstName} ${data.user.lastName}`,
		},
		timestamp: data.updatedAt,
	}),
	'posts/create': (data: any) => ({
		title: data.title,
		description: data.summary,
		image: {
			url: data.featuredImage
		},
		footer: {
			text: `Posted by ${data.user.firstName} ${data.user.lastName}`,
		},
		timestamp: data.updatedAt,
	}),
	'posts/published': (data: any) => ({
		title: data.title,
		description: data.summary,
		image: {
			url: data.featuredImage
		},
		footer: {
			text: `Posted by ${data.user.firstName} ${data.user.lastName}`,
		},
		timestamp: data.updatedAt,
	}),
	'song-history/create': (data: any) => ({
		title: 'Now playing',
		description: `${data.artist} - ${data.title}`,
		image: {
			url: data.graphic.medium
		},
		timestamp: data.updatedAt,
	}),
	'slots/start': (data: any) => ({
		title: `${data.user.firstName} ${data.user.lastName} has now gone live!`,
		description: `${data.title} will be live from ${moment.unix(data.start).format('HH:mm')} to ${moment.unix(data.end).format('HH:mm')} (GMT)`,
		image: {
			url: data.user.avatar
		},
		timestamp: moment.unix(data.start).toDate(),
	}),
	'twitch-channels/live': (data: any) => ({
		title: `${data.user_name} is now live on twitch!`,
		url: `https://twitch.tv/${data.user_name.toLowerCase()}`,
		description: data.title,
		image: {
			url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${data.user_name.toLowerCase()}-500x280.jpg`
		},
		timestamp: new Date(data.started_at),
	})
}
