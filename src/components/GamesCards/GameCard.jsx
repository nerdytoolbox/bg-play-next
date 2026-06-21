import React from 'react'

const GameCard = ({ game, nPlayers, isFav, isUnw, onToggleFavorite, onToggleUnwanted }) => {
	const percentageRecommends = Math.round(game.resultVotes / game.totalVotes * 100)

	return (
		<div className="game-card">
			<div className="game-card-header">
				<div className="game-name">{game.name}</div>
				<div className="game-actions">
					<button
						className={`action-button favorite-btn ${isFav ? 'active' : ''}`}
						onClick={() => onToggleFavorite(game.id)}
						title={isFav ? "Remove from favorites" : "Add to favorites"}
					>
						❤️
					</button>
					<button
						className={`action-button unwanted-btn ${isUnw ? 'active' : ''}`}
						onClick={() => onToggleUnwanted(game.id)}
						title={isUnw ? "Remove from unwanted" : "Add to unwanted"}
					>
						👎
					</button>
				</div>
			</div>
			<div className="img-container"><img src={game.thumbnail} alt="game thumbnail" /></div>
			{nPlayers && <div className="recommends-stats">{percentageRecommends}% recommends this for {nPlayers} players ({game.totalVotes} votes)</div>}
		</div>
	)
}

export default GameCard