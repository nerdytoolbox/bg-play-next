import React from "react";
import { Button, TextInput } from "nerdy-lib";

export default function SearchSection({ userName, onUserNameChange, fetchDate, isCachedPlayer, onSearch }) {
  return (
    <div className="search-section">
      <div className="align-horizontal align-center">
        <TextInput
          extraClassNames="input-username"
          placeholder="BGG username"
          value={userName}
          onChange={onUserNameChange}
        />
        <Button size="size2" color="blue" shade1="shade3" onClick={onSearch}>
	        {isCachedPlayer ? "Refresh" : "Search"}
        </Button>
      </div>
	    <div className="align-center">
		    {isCachedPlayer && fetchDate && <span>BGG data from: {fetchDate}</span>}
	    </div>
    </div>
  );
}

