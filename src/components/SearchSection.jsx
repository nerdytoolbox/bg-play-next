import React from "react";
import { Button, TextInput } from "nerdy-lib";

export default function SearchSection({ userName, onUserNameChange, onSearch }) {
  return (
    <div className="search-section">
      <img src="poweredByBGG.webp" alt="Powered by BoardGameGeek" />
      <div className="align-horizontal align-center">
        <TextInput
          extraClassNames="input-username"
          placeholder="BGG username"
          value={userName}
          onChange={onUserNameChange}
        />
        <Button size="size2" color="blue" shade1="shade3" onClick={onSearch}>
          Search
        </Button>
      </div>
    </div>
  );
}

