import React from "react";

export default function FilterSection({ nPlayers, onPlayerChange, onGameNameChange, nMinutes, onTimeChange, gameName }) {
  return (
    <div className="filter-section align-vertical align-center">
      <div className="align-horizontal">
        <span>How many players are playing?</span>
        <input
          className="input-number"
          value={nPlayers}
          onChange={onPlayerChange}
        />
      </div>
      <div className="align-horizontal">
        <span>How much time do you have?</span>
        <input
          className="input-number"
          value={nMinutes}
          onChange={onTimeChange}
        />
        <span>min</span>
      </div>
	    <div className="align-horizontal">
		    <input
			    className="input-game-name"
			    placeholder={"Search for a game..."}
			    value={gameName}
			    onChange={onGameNameChange}
		    />
	    </div>
    </div>
  );
}

