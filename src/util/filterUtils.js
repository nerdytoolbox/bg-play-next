/**
 * Filters games based on number of players and play time
 * @param {Array} games - Array of game objects
 * @param {string} nPlayers - Number of players (empty string to skip filter)
 * @param {string} nMinutes - Play time in minutes (empty string to skip filter)
 * @returns {Array} Filtered games array
 */
export function filterGames(games, nPlayers, nMinutes) {
  return games.filter(game => {
    if (nPlayers !== "") {
      if (parseInt(game.minPlayers) > nPlayers || parseInt(game.maxPlayers) < nPlayers) {
        return false;
      }
    }
    if (nMinutes !== "") {
      if (parseInt(game.minPlayTime) > nMinutes) {
        return false;
      }
    }
    return true;
  });
}

