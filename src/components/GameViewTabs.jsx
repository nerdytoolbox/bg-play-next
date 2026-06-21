import React from 'react';
import { GAME_VIEW_TYPES } from '../util/constants.js';
import './GameViewTabs.scss';

export default function GameViewTabs({ currentView, onViewChange, favoriteCount, unwantedCount }) {
  return (
    <div className="game-view-tabs">
      <button
        className={`tab-button ${currentView === GAME_VIEW_TYPES.FAVORITES ? 'active' : ''}`}
        onClick={() => onViewChange(GAME_VIEW_TYPES.FAVORITES)}
        title="View favorites"
      >
        ❤️ {favoriteCount}
      </button>
      <button
        className={`tab-button ${currentView === GAME_VIEW_TYPES.UNWANTED ? 'active' : ''}`}
        onClick={() => onViewChange(GAME_VIEW_TYPES.UNWANTED)}
        title="View unwanted games"
      >
        👎 {unwantedCount}
      </button>
      {(currentView === GAME_VIEW_TYPES.FAVORITES || currentView === GAME_VIEW_TYPES.UNWANTED) && (
        <button
          className={`tab-button ${currentView === GAME_VIEW_TYPES.ALL ? 'active' : ''}`}
          onClick={() => onViewChange(GAME_VIEW_TYPES.ALL)}
          title="View all games"
        >
          All
        </button>
      )}
    </div>
  );
}

