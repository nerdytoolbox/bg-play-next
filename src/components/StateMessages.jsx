import React from "react";

export function LoadingState() {
  return <div className="loading-state">Loading data...</div>;
}

export function NoGamesMessage() {
  return (
    <div className="no-games-message">
      There are no games in your collection fitting with the number of players and time given.
    </div>
  );
}

