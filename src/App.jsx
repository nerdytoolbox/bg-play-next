import React, { useState } from "react";
import getBGGUserCollection from "./util/getBBGUserCollection.js";

export default function App() {
  const [userName, setUserName] = React.useState("");
  const [data, setData] = useState(null)

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  }

  const handleSearch = async () => {
    await getBGGUserCollection(userName)
      .then(data => setData(data))
      .catch(error => alert(error))
  }

  return (
    <div className="bg-play-next">
      <div className="align-horizontal">
        <input placeholder="What is your BoardGameGeek username?" value={userName} onChange={handleUserNameChange} />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {data.map(game => <div>{game.name}</div>)}
      </div>
    </div>
  )
}