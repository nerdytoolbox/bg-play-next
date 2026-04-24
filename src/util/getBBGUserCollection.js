// ============================================================================
// Configuration Constants
// ============================================================================
const API_BASE_URL = 'https://boardgamegeek.com/xmlapi2';
const AUTHORIZATION_HEADER = 'Bearer 894e37a4-a4fe-43d7-8f97-523fcbd92220';

const CONFIG = {
	maxRetries: 5,
	retryDelay: 3000,      // 3 seconds between retries
	batchSize: 20,         // Games fetched per API request
	batchDelay: 500,       // Delay between batch requests
};

const API_HEADERS = {
	'Authorization': AUTHORIZATION_HEADER
};

// ============================================================================
// Helper Functions - API Communication
// ============================================================================

/**
 * Fetches game details from BGG API with retry logic
 * @param {string[]} gameIds - Array of game IDs to fetch
 * @returns {Promise<string>} XML response text
 */
async function fetchThingApi(gameIds) {
	const idsParam = gameIds.join(',');
	const url = `${API_BASE_URL}/thing?id=${idsParam}`;

	for (let attempt = 0; attempt < CONFIG.maxRetries; attempt++) {
		const response = await fetch(url, { headers: API_HEADERS });

		if (response.status === 200) {
			return await response.text();
		}

		if (response.status !== 202) {
			throw new Error(`Unexpected status from thing API: ${response.status}`);
		}

		// Wait before retrying if not on last attempt
		if (attempt < CONFIG.maxRetries - 1) {
			await new Promise(res => setTimeout(res, CONFIG.retryDelay));
		}
	}

	throw new Error('Max retries reached for thing API');
}

/**
 * Fetches user's collection from BGG with retry logic
 * @param {string} userName - BGG username
 * @returns {Promise<string>} XML response text
 */
async function fetchUserCollection(userName) {
	const url = `${API_BASE_URL}/collection/?username=${userName}&excludesubtype=boardgameexpansion`;

	for (let attempt = 0; attempt < CONFIG.maxRetries; attempt++) {
		const response = await fetch(url, { headers: API_HEADERS });

		if (response.status === 200) {
			return await response.text();
		}

		if (response.status !== 202) {
			throw new Error(`Unexpected status from collection API: ${response.status}`);
		}

		// Wait before retrying if not on last attempt
		if (attempt < CONFIG.maxRetries - 1) {
			await new Promise(res => setTimeout(res, CONFIG.retryDelay));
		}
	}

	throw new Error('Max retries reached for collection API');
}

// ============================================================================
// Helper Functions - XML Data Extraction
// ============================================================================

/**
 * Extracts text content from first matching element
 * @param {Element} parent - Parent XML element
 * @param {string} tagName - Tag name to search for
 * @returns {string} Element text content or empty string
 */
function getElementText(parent, tagName) {
	return parent.getElementsByTagName(tagName)[0]?.textContent ?? "";
}

/**
 * Extracts attribute value from first matching element
 * @param {Element} parent - Parent XML element
 * @param {string} tagName - Tag name to search for
 * @param {string} attrName - Attribute name to extract
 * @returns {string} Attribute value or empty string
 */
function getElementAttr(parent, tagName, attrName) {
	return parent.getElementsByTagName(tagName)[0]?.getAttribute(attrName) ?? "";
}

/**
 * Finds first element with matching attribute value
 * @param {Element} parent - Parent XML element
 * @param {string} tagName - Tag name to search for
 * @param {string} attrName - Attribute name to match
 * @param {string} attrValue - Attribute value to match
 * @returns {Element|null} First matching element or null
 */
function findElementByAttr(parent, tagName, attrName, attrValue) {
	return Array.from(parent.getElementsByTagName(tagName))
		.find(el => el.getAttribute(attrName) === attrValue) ?? null;
}

/**
 * Gets a direct attribute from an element
 * @param {Element} element - XML element
 * @param {string} attrName - Attribute name
 * @returns {string} Attribute value or empty string
 */
function getAttr(element, attrName) {
	return element.getAttribute(attrName) ?? "";
}

/**
 * Parses game stats from collection XML item
 * @param {Element} item - XML item element
 * @returns {Object} Game stats object
 */
function parseGameStats(item) {
	return {
		minPlayers: getElementAttr(item, "stats", "minplayers"),
		maxPlayers: getElementAttr(item, "stats", "maxplayers"),
		minPlayTime: getElementAttr(item, "stats", "minplaytime"),
		maxPlayTime: getElementAttr(item, "stats", "maxplaytime"),
	};
}

/**
 * Converts collection XML into structured game objects
 * @param {string} xmlText - XML response text from collection API
 * @returns {Object[]} Array of game objects
 */
function parseCollectionXml(xmlText) {
	const parsedDOM = new window.DOMParser().parseFromString(xmlText, 'text/xml');

	return Array.from(parsedDOM.getElementsByTagName("item")).map(item => ({
		id: getAttr(item, "objectid"),
		name: getElementText(item, "name"),
		yearPublished: getElementText(item, "yearpublished"),
		thumbnail: getElementText(item, "thumbnail"),
		...parseGameStats(item),
	}));
}

/**
 * Parses suggested player counts from game details XML
 * @param {Element} item - XML item element
 * @returns {Object[]} Array of suggested player count data
 */
function parseSuggestedPlayers(item) {
	const suggestedPlayersPoll = findElementByAttr(item, "poll", "name", "suggested_numplayers");

	if (!suggestedPlayersPoll) {
		return [];
	}

	return Array.from(suggestedPlayersPoll.getElementsByTagName("results")).map(results => ({
		numPlayers: getAttr(results, "numplayers"),
		results: Array.from(results.getElementsByTagName("result")).map(result => ({
			value: getAttr(result, "value"),
			numvotes: getAttr(result, "numvotes")
		}))
	}));
}

/**
 * Extracts game details from thing API XML response
 * @param {string} xmlText - XML response text from thing API
 * @returns {Map<string, Object>} Map of game ID to details
 */
function parseGameDetailsXml(xmlText) {
	const parsedDOM = new window.DOMParser().parseFromString(xmlText, 'text/xml');
	const detailsMap = new Map();

	Array.from(parsedDOM.getElementsByTagName("item")).forEach(item => {
		const gameId = getAttr(item, "id");
		const suggestedPlayers = parseSuggestedPlayers(item);
		detailsMap.set(gameId, { suggestedPlayers });
	});

	return detailsMap;
}

// ============================================================================
// Helper Functions - Data Enrichment
// ============================================================================

/**
 * Fetches and merges game details into collection items
 * @param {Object[]} collectionItems - Array of game objects from collection
 * @returns {Promise<Object[]>} Collection items enriched with game details
 */
async function enrichCollectionWithDetails(collectionItems) {
	const gameIds = collectionItems.map(item => item.id);
	const detailsMap = new Map();

	// Fetch details in batches
	for (let i = 0; i < gameIds.length; i += CONFIG.batchSize) {
		const batch = gameIds.slice(i, i + CONFIG.batchSize);
		const xmlText = await fetchThingApi(batch);
		const batchDetails = parseGameDetailsXml(xmlText);

		// Merge batch details into the map
		batchDetails.forEach((details, gameId) => {
			detailsMap.set(gameId, details);
		});

		// Add delay between batch requests (except after the last batch)
		const isLastBatch = i + CONFIG.batchSize >= gameIds.length;
		if (!isLastBatch) {
			await new Promise(res => setTimeout(res, CONFIG.batchDelay));
		}
	}

	// Enrich collection items with details
	return collectionItems.map(item => ({
		...item,
		suggestedPlayers: detailsMap.get(item.id)?.suggestedPlayers ?? [],
	}));
}

// ============================================================================
// Main Export Function
// ============================================================================

/**
 * Fetches and returns a user's board game collection from BoardGameGeek
 * @param {string} userName - BGG username to fetch collection for
 * @returns {Promise<Object[]>} Array of game objects with details and statistics
 */
export default async function getBGGUserCollection(userName) {
	const xml = await fetchUserCollection(userName);
	const collection = parseCollectionXml(xml);
	return await enrichCollectionWithDetails(collection);
}



