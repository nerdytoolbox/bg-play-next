/**
 * Gets the current player's data
 * @param {Object} storageData - Storage data object
 * @returns {Object} Current player object or empty data
 */
export function getCurrentPlayer(storageData) {
  if (storageData.currentPlayerId === null) {
    return null
  }
  return storageData.players[storageData.currentPlayerId];
}

/**
 * Updates or creates a player in the storage data
 * @param {Object} storageData - Current storage data
 * @param {string} userName - Player username
 * @param {Array} bggData - BGG collection data
 * @returns {Object} Updated storage data
 */
export function updatePlayerData(storageData, userName, bggData) {
  const newStorageData = JSON.parse(JSON.stringify(storageData));

  // Find if player is already in the list
  const playerIndex = storageData.players.findIndex(player => player.name === userName);

  if (playerIndex !== -1) {
    // Player exists, update their data
    newStorageData.currentPlayerId = playerIndex;
    newStorageData.players[playerIndex].data = bggData;
	newStorageData.players[playerIndex].fetchDate = new Date().toISOString().split('T')[0];
  } else {
    // Player doesn't exist, create a new player
    newStorageData.currentPlayerId = newStorageData.players.length;
    newStorageData.players.push({ 
      name: userName, 
      data: bggData, 
      fetchDate: new Date().toISOString().split('T')[0],
      favorites: [],
      unwanted: []
    });
  }

  return newStorageData;
}

/**
 * Toggles a game as favorite
 * @param {Object} storageData - Current storage data
 * @param {number} gameId - Game ID
 * @returns {Object} Updated storage data
 */
export function toggleGameFavorite(storageData, gameId) {
  const newStorageData = JSON.parse(JSON.stringify(storageData));
  const player = newStorageData.players[newStorageData.currentPlayerId];
  
  if (!player.favorites) {
    player.favorites = [];
  }
  
  const index = player.favorites.indexOf(gameId);
  if (index > -1) {
    player.favorites.splice(index, 1);
  } else {
    player.favorites.push(gameId);
  }
  
  return newStorageData;
}

/**
 * Toggles a game as unwanted
 * @param {Object} storageData - Current storage data
 * @param {number} gameId - Game ID
 * @returns {Object} Updated storage data
 */
export function toggleGameUnwanted(storageData, gameId) {
  const newStorageData = JSON.parse(JSON.stringify(storageData));
  const player = newStorageData.players[newStorageData.currentPlayerId];
  
  if (!player.unwanted) {
    player.unwanted = [];
  }
  
  const index = player.unwanted.indexOf(gameId);
  if (index > -1) {
    player.unwanted.splice(index, 1);
  } else {
    player.unwanted.push(gameId);
  }
  
  return newStorageData;
}

/**
 * Checks if a game is marked as favorite
 * @param {Object} player - Player object
 * @param {number} gameId - Game ID
 * @returns {boolean} True if game is favorite
 */
export function isFavorite(player, gameId) {
  return player && player.favorites && player.favorites.includes(gameId);
}

/**
 * Checks if a game is marked as unwanted
 * @param {Object} player - Player object
 * @param {number} gameId - Game ID
 * @returns {boolean} True if game is unwanted
 */
export function isUnwanted(player, gameId) {
  return player && player.unwanted && player.unwanted.includes(gameId);
}

