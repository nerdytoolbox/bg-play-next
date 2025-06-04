import React, { useState } from "react";
import getBGGUserCollection from "./util/getBBGUserCollection.js";
import { Button, TextInput } from "nerdy-lib";

export default function App() {
  const [userNameInput, setUserNameInput] = React.useState("");

  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [nPlayers, setNPlayers] = useState("")
  const [nMinutes, setNMinutes] = useState("")

  const handleUserNameChange = (event) => {
    setUserNameInput(event.target.value);
  }

  const handleSearch = async () => {
    setLoading(true)
    await getBGGUserCollection(userNameInput)
      .then(data => {
        setData(data)
        setUserName(userNameInput)
        setUserNameInput("")
        setLoading(false)
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
      if (parseInt(game.minPlayers) > nPlayers || parseInt(game.maxPlayers) < nPlayers) {
        return false;
      }
    }
    if (nMinutes !== "") {
      if (parseInt(game.minPlayTime) > nMinutes) {
        return false;
      }
    }
    return true
  })

  return (
    <div className="align-vertical align-center">
      <div className="align-center block">
        Enter your BGG username to search for games in your collection. You can filter the results by number of players and time available to see what games you could play.
      </div>
      <div className="align-horizontal align-center">
        <TextInput extraClassNames="input-username" placeholder="BGG username" value={userNameInput} onChange={handleUserNameChange} />
        <Button size="size2" color="blue" shade1="shade3" onClick={handleSearch}>Search</Button>
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
      {loading && <div>Loading data...</div>}
      {data.length > 0 && filteredData.length === 0 && <div>There are no games in your collection fitting with the number of players and time given.</div>}
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