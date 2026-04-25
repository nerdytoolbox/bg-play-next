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
    newStorageData.players.push({ name: userName, data: bggData, fetchDate: new Date().toISOString().split('T')[0] });
  }

  return newStorageData;
}

