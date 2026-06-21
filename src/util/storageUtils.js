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
 * Toggles a game as favorite (and removes from unwanted if present)
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
  if (!player.unwanted) {
    player.unwanted = [];
  }
  
  const favIndex = player.favorites.indexOf(gameId);
  const unwantedIndex = player.unwanted.indexOf(gameId);
  
  if (favIndex > -1) {
    // Remove from favorites
    player.favorites.splice(favIndex, 1);
  } else {
    // Add to favorites and remove from unwanted if present
    player.favorites.push(gameId);
    if (unwantedIndex > -1) {
      player.unwanted.splice(unwantedIndex, 1);
    }
  }
  
  return newStorageData;
}

/**
 * Toggles a game as unwanted (and removes from favorites if present)
 * @param {Object} storageData - Current storage data
 * @param {number} gameId - Game ID
 * @returns {Object} Updated storage data
 */
export function toggleGameUnwanted(storageData, gameId) {
  const newStorageData = JSON.parse(JSON.stringify(storageData));
  const player = newStorageData.players[newStorageData.currentPlayerId];
  
  if (!player.favorites) {
    player.favorites = [];
  }
  if (!player.unwanted) {
    player.unwanted = [];
  }
  
  const favIndex = player.favorites.indexOf(gameId);
  const unwantedIndex = player.unwanted.indexOf(gameId);
  
  if (unwantedIndex > -1) {
    // Remove from unwanted
    player.unwanted.splice(unwantedIndex, 1);
  } else {
    // Add to unwanted and remove from favorites if present
    player.unwanted.push(gameId);
    if (favIndex > -1) {
      player.favorites.splice(favIndex, 1);
    }
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

