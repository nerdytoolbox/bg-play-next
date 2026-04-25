import React from "react";
import GameCard from "./GameCard.jsx";
import './GamesCards.scss'

export default function GamesCards({ games, nPlayers }) {
	return (
		<div className="games-cards">
			{games.map(game => <GameCard game={game} nPlayers={nPlayers} key={game.id} />)}
		</div>
  )
}

