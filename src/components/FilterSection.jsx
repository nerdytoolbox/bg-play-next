import React from "react";

export default function FilterSection({ nPlayers, onPlayerChange, nMinutes, onTimeChange }) {
  return (
    <div className="filter-section align-vertical align-center">
      <div className="align-horizontal">
        <span>How many players are playing?</span>
        <input
          className="input-number"
          type="number"
          min={0}
          value={nPlayers}
          onChange={onPlayerChange}
        />
      </div>
      <div className="align-horizontal">
        <span>How much time do you have?</span>
        <input
          className="input-number"
          type="number"
          min={0}
          value={nMinutes}
          onChange={onTimeChange}
        />
        <span>min</span>
      </div>
    </div>
  );
}

