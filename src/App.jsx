import React, { useEffect, useState } from "react";
import { Title, useAnalyticsConsent } from "nerdy-lib";
import getBGGUserCollection from "./util/getBBGUserCollection.js";
import { BG_PLAY_NEXT_STORAGE_KEY, EMPTY_GAME_STATE, GAME_VIEW_TYPES } from "./util/constants.js";
import { filterGames } from "./util/filterUtils.js";
import { getCurrentPlayer, updatePlayerData, toggleGameFavorite, toggleGameUnwanted } from "./util/storageUtils.js";
import SearchSection from "./components/SearchSection.jsx";
import FilterSection from "./components/FilterSection.jsx";
import { LoadingState, NoGamesMessage } from "./components/StateMessages.jsx";
import GamesCards from "./components/GamesCards/GamesCards.jsx";
import GameViewTabs from "./components/GameViewTabs.jsx";

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
	const [gameName, setGameName] = useState("")
	const [currentGameView, setCurrentGameView] = useState(GAME_VIEW_TYPES.ALL)

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

	}, [storageData])

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
		setNPlayers(e.target.value.replace(/\D/g, ""))
	}

	const handleTimeChange = (e) => {
		setNMinutes(e.target.value.replace(/\D/g, ""))
	}

	const handleGameNameChange = (e) => {
		setGameName(e.target.value)
	}

  const handleSearch = async () => {
    setLoading(true)
    try {
      const bggData = await getBGGUserCollection(userName)
      const newStorageData = updatePlayerData(storageData, userName, bggData)
      setStorageData(newStorageData)
	    setFetchDate(getCurrentPlayer(newStorageData).fetchDate)
      setLoading(false)
    } catch (error) {
      alert(error)
      setLoading(false)
    }
  }

	const handleToggleFavorite = (gameId) => {
		const newStorageData = toggleGameFavorite(storageData, gameId)
		setStorageData(newStorageData)
	}

	const handleToggleUnwanted = (gameId) => {
		const newStorageData = toggleGameUnwanted(storageData, gameId)
		setStorageData(newStorageData)
	}

  const filteredData = filterGames(bggData, nPlayers, nMinutes, gameName)
  const currentPlayer = getCurrentPlayer(storageData)

	// Filter games based on the current view
	let displayedGames = filteredData
	if (currentGameView === GAME_VIEW_TYPES.FAVORITES && currentPlayer?.favorites) {
		displayedGames = filteredData.filter(game => currentPlayer.favorites.includes(game.id))
	} else if (currentGameView === GAME_VIEW_TYPES.UNWANTED && currentPlayer?.unwanted) {
		displayedGames = filteredData.filter(game => currentPlayer.unwanted.includes(game.id))
	} else {
		// In ALL view, exclude unwanted games
		displayedGames = filteredData.filter(game => !currentPlayer?.unwanted?.includes(game.id))
	}

	const favoriteCount = currentPlayer?.favorites?.length || 0
	const unwantedCount = currentPlayer?.unwanted?.length || 0

  return (
    <div className="bg-play-next-container">
      <div className="header-with-tabs">
        <Title icon="bggThumbnail.png" text="Boardgames - What to play next?" />
      </div>
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
          gameName={gameName}
          onGameNameChange={handleGameNameChange}
        />
        <div className="player-header">
          <h2>{userName}</h2>
          {bggData.length > 0 && (
            <GameViewTabs
              currentView={currentGameView}
              onViewChange={setCurrentGameView}
              favoriteCount={favoriteCount}
              unwantedCount={unwantedCount}
            />
          )}
        </div>
        {loading && <LoadingState />}
		{bggData.length > 0 && (
			<>
				{displayedGames.length === 0 && <NoGamesMessage />}
				{displayedGames.length > 0 && (
					<GamesCards 
						games={displayedGames} 
						nPlayers={nPlayers}
						currentPlayer={currentPlayer}
						onToggleFavorite={handleToggleFavorite}
						onToggleUnwanted={handleToggleUnwanted}
					/>
				)}
			</>
		)}
       </div>
    </div>
  )
}