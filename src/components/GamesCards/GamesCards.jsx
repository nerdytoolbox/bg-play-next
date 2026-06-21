import React from "react";
import GameCard from "./GameCard.jsx";
import './GamesCards.scss'

export default function GamesCards({ games, nPlayers, currentPlayer, onToggleFavorite, onToggleUnwanted }) {
	return (
		<div className="games-cards">
			{games.map(game => (
				<GameCard 
					game={game} 
					nPlayers={nPlayers} 
					key={game.id}
					isFav={currentPlayer?.favorites?.includes(game.id)}
					isUnw={currentPlayer?.unwanted?.includes(game.id)}
					onToggleFavorite={onToggleFavorite}
					onToggleUnwanted={onToggleUnwanted}
				/>
			))}
		</div>
  )
}

