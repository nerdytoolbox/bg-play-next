/**
 * Filters games based on number of players and play time
 * @param {Array} games - Array of game objects
 * @param {string} nPlayers - Number of players (empty string to skip filter)
 * @param {string} nMinutes - Play time in minutes (empty string to skip filter)
 * @returns {Array} Filtered games array
 */
export function filterGames(games, nPlayers, nMinutes) {
  const filteredGames = games.filter(game => {
    // Filter out games that cannot be played with the number of players or time entered
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

	if (nPlayers !== "") {
		// For each game, determine what percentage of votes recommends this game for the number of players entered
		filteredGames.forEach(game => {
			// Find the matching suggested players entry for this number of players
			const matchedEntry = game.suggestedPlayers.find(entry => {
				const numPlayersStr = entry.numPlayers;
				// Handle ranges like "4+" and exact matches
				if (numPlayersStr.includes('+')) {
					const baseNum = parseInt(numPlayersStr);
					return !isNaN(baseNum) && nPlayers > baseNum;
				}
				return parseInt(numPlayersStr) === parseInt(nPlayers);
			});

			if (matchedEntry && matchedEntry.results) {
				// Calculate total votes from all categories
				const totalVotes = matchedEntry.results.reduce((sum, result) => {
					return sum + parseInt(result.numvotes || 0);
				}, 0);

				// Calculate votes for "Best" and "Recommended" only
				const resultVotes = matchedEntry.results.reduce((sum, result) => {
					if (result.value === "Best" || result.value === "Recommended") {
						return sum + parseInt(result.numvotes || 0);
					}
					return sum;
				}, 0);

				game.totalVotes = totalVotes;
				game.resultVotes = resultVotes;
			} else {
				// No data found for this player count
				game.totalVotes = 0;
				game.resultVotes = 0;
			}
		});
		
		// Sort filteredGames on the heighest percentage of votes (resultVotes / totalVotes * 100)
		filteredGames.sort((a, b) => {
			const percentageA = a.totalVotes > 0 ? (a.resultVotes / a.totalVotes) * 100 : 0;
			const percentageB = b.totalVotes > 0 ? (b.resultVotes / b.totalVotes) * 100 : 0;
			return percentageB - percentageA;
		});
	}

	return filteredGames;
}

