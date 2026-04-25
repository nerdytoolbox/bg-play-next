import React from 'react'

const GameCard = ({ game, nPlayers} ) => {
	const percentageRecommends = Math.round(game.resultVotes / game.totalVotes * 100)

	return (
		<div className="game-card">
			<div className="game-name">{game.name}</div>
			<div className="img-container"><img src={game.thumbnail} alt="game thumbnail" /></div>
			{nPlayers && <div className="recommends-stats">{percentageRecommends}% recommends this for {nPlayers} players ({game.totalVotes} votes)</div>}
		</div>
	)
}

export default GameCard