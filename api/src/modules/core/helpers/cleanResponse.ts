const removeProps = (obj: any, propsToRemove: string[], maxLevel = 10) => {
	if (typeof maxLevel !== "number") maxLevel = 10
	for (const prop in obj) {
		if (typeof propsToRemove === "string" && prop === propsToRemove)
			obj[prop] = "hidden";
		else if (propsToRemove.indexOf(prop) >= 0)      // it must be an array
			obj[prop] = "hidden";
		else if (typeof obj[prop] === "object" && maxLevel>0)
			removeProps(obj[prop], propsToRemove, maxLevel-1);
	}
	return obj
}

export const GENERIC_CLEAN = ['password', 'key', 'email', 'patreonAccessToken', 'azuraCastApiKey', 'spotifyClientSecret', 'spotifyClientId', 'streamUrl'];

export const cleanResponse = (data: any, toClean = GENERIC_CLEAN) => {
	return removeProps(data, toClean)
}