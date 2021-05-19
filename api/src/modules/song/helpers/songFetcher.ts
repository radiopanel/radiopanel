/* eslint-disable @typescript-eslint/no-empty-function */
import { path, prop, mergeAll, pathOr } from "ramda";
import UserAgent from "user-agents";
import got from "got";

export const fetchSongData = async (streamUrl: string, streamType: string) => {
	const userAgent = new UserAgent();
	if(streamType == "icecast"){
		const radioServerResponse = await got.get(streamUrl ,{
			resolveBodyOnly: true,
			responseType: 'json',
			timeout: 5000,
			headers: {
				'User-Agent': userAgent.toString()
			}
		}).catch((e) => {});

		if (Array.isArray(path(['icestats', 'source'])(radioServerResponse))) {
			const source = mergeAll<any>(path<object[]>(['icestats', 'source'])(radioServerResponse));
			return (prop('title')(source) as string);
		} else {
			return pathOr('', ['icestats', 'source', 'title'])(radioServerResponse);
		}
	};

	if(streamType == "shoutcast"){
		const radioServerResponse = await got.get(streamUrl ,{
			resolveBodyOnly: true,
			responseType: 'json',
			timeout: 5000,
			headers: {
				'User-Agent': userAgent.toString()
			}
		}).catch(() => {});

		return pathOr('', ['songtitle'])(radioServerResponse);
	};

	if(streamType == "zeno"){
		const radioServerResponse = await got.get(streamUrl, {
			resolveBodyOnly: true,
			responseType: 'json',
			timeout: 5000,
			headers: {
				'User-Agent': userAgent.toString()
			}
		}).catch(() => {});

		return pathOr('', ['artist'])(radioServerResponse) + ' - ' + pathOr('', ['title'])(radioServerResponse);
	};
}
