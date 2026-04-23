import React, { useEffect, useState } from "react";
import getBGGUserCollection from "./util/getBBGUserCollection.js";
import { Button, TextInput, Title } from "nerdy-lib";
import { useAnalyticsConsent } from "nerdy-lib";
import { BG_PLAY_NEXT_STORAGE_KEY, EMPTY_GAME_STATE } from "./util/constants.js";

export default function App() {
	useAnalyticsConsent()

	const [storageData, setStorageData] = useState(JSON.parse(localStorage.getItem(BG_PLAY_NEXT_STORAGE_KEY) || JSON.stringify(EMPTY_GAME_STATE)))

	useEffect(() => {
		if (storageData === null) return
		localStorage.setItem(BG_PLAY_NEXT_STORAGE_KEY, JSON.stringify(storageData))
		setUserName(storageData.currentPlayerId !== null ? storageData.players[storageData.currentPlayerId].name : "")
		setBggData(storageData.currentPlayerId !== null ? storageData.players[storageData.currentPlayerId].data : [])
	}, [storageData]);

	const [userName, setUserName] = useState(storageData.currentPlayerId !== null ? storageData.players[storageData.currentPlayerId].name : "");
	const [bggData, setBggData] = useState(storageData.currentPlayerId !== null ? storageData.players[storageData.currentPlayerId].data : []);
	const [loading, setLoading] = useState(false);

	const [nPlayers, setNPlayers] = useState("")
	const [nMinutes, setNMinutes] = useState("")

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
		setBggData([])
  }

  const handleSearch = async () => {
    setLoading(true)
    await getBGGUserCollection(userName)
      .then(bggData => {
				const newStorageData = JSON.parse(JSON.stringify(storageData));

	      // Find if player is already in the list
	      const playerIndex = storageData.players.findIndex(player => player.name === userName);
				if (playerIndex !== -1) {
				  // Player exists, update their data
					newStorageData.currentPlayerId = playerIndex;
					newStorageData.players[playerIndex].data = bggData
				} else {
				  // Player doesn't exist, create a new player
					newStorageData.currentPlayerId = newStorageData.players.length
					newStorageData.players.push({ name: userName, data: bggData })
				}

				setStorageData(newStorageData)

				setLoading(false)
      })
      .catch(error => alert(error))
  }

  const handlePlayerChange = (event) => {
    setNPlayers(event.target.value)
  }

  const handleTimeChange = (event) => {
    setNMinutes(event.target.value);
  }

  const filteredData = bggData.filter(game => {
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
    return true
  })

	console.log(bggData)

  return (
    <div className="bg-play-next-container">
      <Title icon="bggThumbnail.png" text="Boardgames - What to play next?" />
      <div className="align-vertical align-center">
        <img src="poweredByBGG.webp" alt="Powered by BoardGameGeek" />
        <div className="align-horizontal align-center">
          <TextInput extraClassNames="input-username" placeholder="BGG username" value={userName} onChange={handleUserNameChange} />
          <Button size="size2" color="blue" shade1="shade3" onClick={handleSearch}>Search</Button>
        </div>
        <div className="align-vertical align-center">
          <div className="align-horizontal">
            <span>How many players are playing?</span>
            <input className="input-number" type="number" min={0} value={nPlayers} onChange={handlePlayerChange} />
          </div>
          <div className="align-horizontal">
            <span>How much time do you have?</span>
            <input className="input-number" type="number" min={0} value={nMinutes} onChange={handleTimeChange} />
            <span>min</span>
          </div>
        </div>
        <h1>{userName}</h1>
        {loading && <div>Loading data...</div>}
        {bggData.length > 0 && filteredData.length === 0 && <div>There are no games in your collection fitting with the number of players and time given.</div>}
        {filteredData.length > 0 && (
          <table className="games-table">
            <tr>
              <th>Name</th>
              <th>Players</th>
              <th>Duration (minutes)</th>
            </tr>
            {filteredData.map(game => {
              return (
                <tr key={game.id}>
                  <td className="game name">{game.name}</td>
                  <td className="game players">{game.minPlayers} - {game.maxPlayers}</td>
                  <td className="game time">{game.minPlayTime} - {game.maxPlayTime}</td>
                </tr>
              )
            })}
          </table>
        )}
      </div>
    </div>
  )
}