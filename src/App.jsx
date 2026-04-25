import React, { useEffect, useState } from "react";
import { Title, useAnalyticsConsent } from "nerdy-lib";
import getBGGUserCollection from "./util/getBBGUserCollection.js";
import { BG_PLAY_NEXT_STORAGE_KEY, EMPTY_GAME_STATE } from "./util/constants.js";
import { filterGames } from "./util/filterUtils.js";
import { getCurrentPlayer, updatePlayerData } from "./util/storageUtils.js";
import SearchSection from "./components/SearchSection.jsx";
import FilterSection from "./components/FilterSection.jsx";
import GamesTable from "./components/GamesTable.jsx";
import { LoadingState, NoGamesMessage } from "./components/StateMessages.jsx";
import GamesCards from "./components/GamesCards/GamesCards.jsx";

export default function App() {
	useAnalyticsConsent()

	const [storageData, setStorageData] = useState(JSON.parse(localStorage.getItem(BG_PLAY_NEXT_STORAGE_KEY) || JSON.stringify(EMPTY_GAME_STATE)))
	const [userName, setUserName] = useState("")
	const [fetchDate, setFetchDate] = useState("")
	const [bggData, setBggData] = useState([])
	const [isCachedPlayer, setIsCachedPlayer] = useState(false)
	const [loading, setLoading] = useState(false)
	const [nPlayers, setNPlayers] = useState("")
	const [nMinutes, setNMinutes] = useState("")

	// Initialize user data from storage
	useEffect(() => {
		const currentPlayer = getCurrentPlayer(storageData)
		if (currentPlayer) {
			setUserName(currentPlayer.name)
			setBggData(currentPlayer.data)
			setFetchDate(currentPlayer.fetchDate)
			setIsCachedPlayer(true)
		} else {
			setUserName("")
			setBggData([])
			setFetchDate(null)
			setIsCachedPlayer(false)
		}

	}, [])

	// Persist storage data to localStorage whenever it changes
	useEffect(() => {
		if (storageData === null) return
		localStorage.setItem(BG_PLAY_NEXT_STORAGE_KEY, JSON.stringify(storageData))
	}, [storageData])

  const handleUserNameChange = (e) => {
    setUserName(e.target.value)
		setBggData([])
	  setFetchDate(null)
	  setIsCachedPlayer(false)
  }

	const handlePlayerAmountChange = (e) => {
		setNPlayers(e.target.value)
	}

	const handleTimeChange = (e) => {
		setNMinutes(e.target.value)
	}

  const handleSearch = async () => {
    setLoading(true)
    try {
      const bggData = await getBGGUserCollection(userName)
      const newStorageData = updatePlayerData(storageData, userName, bggData)
      setStorageData(newStorageData)
      setLoading(false)
    } catch (error) {
      alert(error)
      setLoading(false)
    }
  }

  const filteredData = filterGames(bggData, nPlayers, nMinutes)

  return (
    <div className="bg-play-next-container">
      <Title icon="bggThumbnail.png" text="Boardgames - What to play next?" />
	    <div className="align-vertical align-center">
		    <img src="poweredByBGG.webp" alt="Powered by BoardGameGeek" />
        <SearchSection
          userName={userName}
          onUserNameChange={handleUserNameChange}
          fetchDate={fetchDate}
          isCachedPlayer={isCachedPlayer}
          onSearch={handleSearch}
        />
        <FilterSection
          nPlayers={nPlayers}
          onPlayerChange={handlePlayerAmountChange}
          nMinutes={nMinutes}
          onTimeChange={handleTimeChange}
        />
        <h2>{userName}</h2>
        {loading && <LoadingState />}
        {bggData.length > 0 && filteredData.length === 0 && <NoGamesMessage />}
        {filteredData.length > 0 && <GamesCards games={filteredData} nPlayers={nPlayers} />}
      </div>
    </div>
  )
}