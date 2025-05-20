const delay = 3000;
const maxRetries = 5;

export default async function getBGGUserCollection(userName) {
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		const response = await fetch(`https://boardgamegeek.com/xmlapi2/collection/?username=${userName}`);
		if (response.status === 200) {
			const text = await response.text();
			const parsedDOM = new window.DOMParser().parseFromString(text, 'text/xml')
			return Array.from(parsedDOM.getElementsByTagName("item")).map(item => ({
				id: item.getAttribute("objectid") ?? "",
				subtype: item.getAttribute("subtype") ?? "",
				name: item.getElementsByTagName("name")[0]?.textContent ?? "",
				yearPublished: item.getElementsByTagName("yearpublished")[0]?.textContent ?? "",
				thumbnail: item.getElementsByTagName("thumbnail")[0]?.textContent ?? "",
				image: item.getElementsByTagName("image")[0]?.textContent ?? "",
				minPlayers: item.getElementsByTagName("stats")[0]?.getAttribute("minplayers") ?? "",
				maxPlayers: item.getElementsByTagName("stats")[0]?.getAttribute("maxplayers") ?? "",
				minPlayTime: item.getElementsByTagName("stats")[0]?.getAttribute("minplaytime") ?? "",
				maxPlayTime: item.getElementsByTagName("stats")[0]?.getAttribute("maxplaytime") ?? ""
			}))
		}
		if (response.status !== 202) {
			throw new Error(`Unexpected status: ${response.status}`);
		}
		await new Promise(res => setTimeout(res, delay));
	}
	throw new Error('Max retries reached');
}

