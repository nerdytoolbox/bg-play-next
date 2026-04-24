import React from "react";

export default function GamesTable({ games }) {
  return (
    <table className="games-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Players</th>
          <th>Duration (minutes)</th>
        </tr>
      </thead>
      <tbody>
        {games.map(game => {
          return (
            <tr key={game.id}>
              <td className="game name">{game.name}</td>
              <td className="game players">
                {game.minPlayers} - {game.maxPlayers}
              </td>
              <td className="game time">
                {game.minPlayTime} - {game.maxPlayTime}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

