const retryDelay = 3000;
const thingDelay = 500;
const maxRetries = 5;
const batchSize = 20;

async function fetchThingApi(gameIds) {
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		const idsParam = gameIds.join(',');
		const response = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${idsParam}`, {
			headers: {
				'Authorization': `Bearer 894e37a4-a4fe-43d7-8f97-523fcbd92220`
			}
		});

		if (response.status === 200) {
			return await response.text();
		}

		if (response.status !== 202) {
			throw new Error(`Unexpected status from thing API: ${response.status}`);
		}

		await new Promise(res => setTimeout(res, retryDelay));
	}
	throw new Error('Max retries reached for thing API');
}

function parseGameDetails(xmlText) {
	const parsedDOM = new window.DOMParser().parseFromString(xmlText, 'text/xml');
	const detailsMap = new Map();

	Array.from(parsedDOM.getElementsByTagName("item")).forEach(item => {
		const gameId = item.getAttribute("id");
		const suggestedPlayersPoll = Array.from(item.getElementsByTagName("poll"))
			.find(poll => poll.getAttribute("name") === "suggested_numplayers");

		let suggestedPlayers = [];
		if (suggestedPlayersPoll) {
			suggestedPlayers = Array.from(suggestedPlayersPoll.getElementsByTagName("results")).map(results => ({
				numPlayers: results.getAttribute("numplayers"),
				results: Array.from(results.getElementsByTagName("result")).map(result => ({
					value: result.getAttribute("value"),
					numvotes: result.getAttribute("numvotes")
				}))
			}));
		}

		detailsMap.set(gameId, { suggestedPlayers });
	});

	return detailsMap;
}

async function enrichCollectionWithDetails(collectionItems) {
	const gameIds = collectionItems.map(item => item.id);
	const detailsMap = new Map();

	// Fetch details in batches of 20
	for (let i = 0; i < gameIds.length; i += batchSize) {
		const batch = gameIds.slice(i, i + batchSize);
		const xmlText = await fetchThingApi(batch);
		const batchDetails = parseGameDetails(xmlText);

		// Merge batch details into the map
		batchDetails.forEach((details, gameId) => {
			detailsMap.set(gameId, details);
		});

		// Add delay between requests (except after the last batch)
		if (i + batchSize < gameIds.length) {
			await new Promise(res => setTimeout(res, thingDelay));
		}
	}

	// Enrich collection items with details
	return collectionItems.map(item => ({
		...item,
		suggestedPlayers: detailsMap.get(item.id)?.suggestedPlayers ?? [],
	}));
}

export default async function getBGGUserCollection(userName) {
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		const response = await fetch(`https://boardgamegeek.com/xmlapi2/collection/?username=${userName}&excludesubtype=boardgameexpansion`,
			{
				headers: {
					'Authorization': `Bearer 894e37a4-a4fe-43d7-8f97-523fcbd92220`
				}
			});
		if (response.status === 200) {
			const text = await response.text();
			const parsedDOM = new window.DOMParser().parseFromString(text, 'text/xml')
			const collection = Array.from(parsedDOM.getElementsByTagName("item")).map(item => ({
				id: item.getAttribute("objectid") ?? "",
				subtype: item.getAttribute("subtype") ?? "",
				name: item.getElementsByTagName("name")[0]?.textContent ?? "",
				yearPublished: item.getElementsByTagName("yearpublished")[0]?.textContent ?? "",
				thumbnail: item.getElementsByTagName("thumbnail")[0]?.textContent ?? "",
				image: item.getElementsByTagName("image")[0]?.textContent ?? "",
				minPlayers: item.getElementsByTagName("stats")[0]?.getAttribute("minplayers") ?? "",
				maxPlayers: item.getElementsByTagName("stats")[0]?.getAttribute("maxplayers") ?? "",
				minPlayTime: item.getElementsByTagName("stats")[0]?.getAttribute("minplaytime") ?? "",
				maxPlayTime: item.getElementsByTagName("stats")[0]?.getAttribute("maxplaytime") ?? "",
			}))

			// Enrich with detailed game information
			return await enrichCollectionWithDetails(collection);
		}
		if (response.status !== 202) {
			throw new Error(`Unexpected status: ${response.status}`);
		}
		await new Promise(res => setTimeout(res, retryDelay));
	}
	throw new Error('Max retries reached');
}



