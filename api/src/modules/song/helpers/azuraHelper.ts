import got from "got/dist/source";
import { propOr } from "ramda";

import { Tenant } from "~entities";

const statusSuffixes = {
	icecast: 'status-json.xsl',
	shoutcast: 'stats?json=1',
	shoutcast2: 'stats?json=1'
}

export const fetchStatusFile = async (tenant: Tenant): Promise<{ streamUrl: string, streamType: string }> => {
	const stationInfo = await got.get<any>(`${tenant.settings?.azuraCastBaseUrl}/api/station/${tenant.settings?.azuraCastStationId}`, {
		resolveBodyOnly: true,
		responseType: 'json'
	});

	const streamType = (stationInfo?.frontend || 'icecast').replace(/[0-9]/g, '');
	const urlSegments = stationInfo?.listen_url.split('/');
	urlSegments.pop();
	const streamUrl = urlSegments.join('/') + '/' + propOr(statusSuffixes.icecast, streamType)(statusSuffixes);

	return {
		streamUrl,
		streamType,
	}
}
