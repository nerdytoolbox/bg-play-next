export const BG_PLAY_NEXT_STORAGE_KEY = "bgg-play-next-key"

export const EMPTY_GAME_STATE = Object.freeze({
	version: 1,
	currentPlayerId: null,
	players: [],
})

export const GAME_VIEW_TYPES = {
	ALL: "all",
	FAVORITES: "favorites",
	UNWANTED: "unwanted",
}
