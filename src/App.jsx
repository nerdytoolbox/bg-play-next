import React, { useState } from "react";
import getBGGUserCollection from "./util/getBBGUserCollection.js";

export default function App() {
  const [userNameInput, setUserNameInput] = React.useState("");

  const [userName, setUserName] = useState("");
  const [data, setData] = useState([])

  const [nPlayers, setNPlayers] = useState("")
  const [nMinutes, setNMinutes] = useState("")

  const handleUserNameChange = (event) => {
    setUserNameInput(event.target.value);
  }

  const handleSearch = async () => {
    await getBGGUserCollection(userNameInput)
      .then(data => {
        setData(data)
        setUserName(userNameInput)
        setUserNameInput("")
      })
      .catch(error => alert(error))
  }

  const handlePlayerChange = (event) => {
    setNPlayers(event.target.value)
  }

  const handleTimeChange = (event) => {
    setNMinutes(event.target.value);
  }

  const filteredData = data.filter(game => {
    if (nPlayers !== "") {
      if (game.minPlayers > nPlayers || game.maxPlayers < nPlayers) {
        return false;
      }
    }
    if (nMinutes !== "") {
      if (game.minPlayTime > nMinutes || game.maxPlayTime < nMinutes) {
        return false;
      }
    }
    return true
  })

  return (
    <div className="align-vertical align-center">
      <div className="align-horizontal align-center">
        <input className="input-username" placeholder="BGG username" value={userNameInput} onChange={handleUserNameChange} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="align-vertical align-center">
        <div className="align-horizontal">
          <span>How many players are playing?</span>
          <input className="input-number" type="number" min={0} value={nPlayers} onChange={handlePlayerChange} />
        </div>
        <div className="align-horizontal">
          <span>How much time do you have?</span>
          <input className="input-number" type="number" min={0} value={nMinutes} onChange={handleTimeChange} />
          <span>min</span>
        </div>
      </div>
      <h1>{userName}</h1>
      {filteredData.length > 0 && (
        <table className="games-table">
          <tr>
            <th>Name</th>
            <th>Players</th>
            <th>Duration (minutes)</th>
          </tr>
          {filteredData.map(game => {
            return (
              <tr key={game.id}>
                <td className="game name">{game.name}</td>
                <td className="game players">{game.minPlayers} - {game.maxPlayers}</td>
                <td className="game time">{game.minPlayTime} - {game.maxPlayTime}</td>
              </tr>
            )
          })}
        </table>
      )}
    </div>
  )
}