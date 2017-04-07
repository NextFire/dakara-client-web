import { LIBRARY_REQUEST, LIBRARY_SUCCESS, LIBRARY_FAILURE } from '../actions'
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions'
import { WORKTYPES_REQUEST, WORKTYPES_SUCCESS, WORKTYPES_FAILURE } from '../actions'
import { ADDPLAYLIST_REQUEST, ADDPLAYLIST_SUCCESS, ADDPLAYLIST_FAILURE } from '../actions'
import { REMOVEPLAYLISTENTRY_REQUEST, REMOVEPLAYLISTENTRY_SUCCESS, REMOVEPLAYLISTENTRY_FAILURE } from '../actions'
import { PLAYERSTATUS_REQUEST, PLAYERSTATUS_SUCCESS, PLAYERSTATUS_FAILURE } from '../actions'
import { PLAYLIST_REQUEST, PLAYLIST_SUCCESS, PLAYLIST_FAILURE } from '../actions'
import { CLEAR_SONG_LIST_NOTIFICATION } from '../actions'
import { CLEAR_PLAYLIST_ENTRY_NOTIFICATION } from '../actions'
import { PLAYLIST_TOOGLE_COLLAPSED } from '../actions'
import { LOGOUT } from '../actions'
import { combineReducers } from 'redux'


/**
 * Authentication token with the Dakara server
 */

function token(state = null, action) {
    if (action.type === LOGIN_SUCCESS) {
        return action.payload.token
    } else if (action.type === LOGOUT) {
        return null
    } else {
        return state
    }
}


/**
 * Current content of the library
 */

const defaultLibraryEntries =  {
        current: 0,
        last: 0,
        count: 0,
        results: [],
        type: ''
}

function entries(state = defaultLibraryEntries, action) {
    if (action.type === LIBRARY_SUCCESS) {
        return {...action.payload, type:action.meta.libraryType};
    } else {
        return state;
    }
}

/**
 * Work Types
 */

const defaultWorkTypes =  {
        results: []
}

function workTypes(state = defaultWorkTypes, action) {
    if (action.type === WORKTYPES_SUCCESS) {
        return action.payload;
    } else {
        return state;
    }
}

/**
 * Add song to playlist message
 */

function songListNotifications(state = {}, action) {
    let songId
    switch (action.type) {
        case ADDPLAYLIST_REQUEST:
            songId = action.meta.songId
            return {...state, [songId]: {
                    message: "Adding...",
                    type: "success"
                }
            }

        case ADDPLAYLIST_SUCCESS:
            songId = action.meta.songId
            return {...state, [songId]: {
                    message: "Successfuly added!",
                    type: "success"
                }
            }

        case ADDPLAYLIST_FAILURE:
            songId = action.meta.songId
            return {...state, [songId]: {
                    message: "Error attempting to add song to playlist",
                    type: "danger"
                }
            }

        case CLEAR_SONG_LIST_NOTIFICATION:
            songId = action.songId
            let newState = { ...state }
            delete newState[songId]
            return newState

        default:
            return state
    }
}

/**
 * Library related state
 */

const library = combineReducers({
    entries,
    workTypes,
    songListNotifications
})


/**
 * Login Page message
 */

function loginMessage(state = null, action) {
    const payload = action.payload
    if (action.type === LOGIN_FAILURE) {
        if (action.error = true && payload.name == "ApiError") {
            const errors = payload.response.non_field_errors
            if (errors && errors.length > 0) {
                return errors[0]
            } else {
                return payload.message
            }
        } else {
            return "Unknown error."
        }
    } else if (action.type == LOGIN_REQUEST && action.error == true && payload.name == "RequestError") {
        return "Unable to contact server."
    } else if (action.type == LOGIN_SUCCESS || action.type == LOGIN_FAILURE) {
        return null 
    }

    return state
}

/**
 * Login Page loading 
 */

function loginLoading(state = false, action) {
    if (action.type === LOGIN_REQUEST) {
        return !action.error
    } else if (action.type == LOGIN_SUCCESS || action.type == LOGIN_FAILURE) {
        return false
    }

    return state
}

/**
 * Login Page state
 */

const loginPage = combineReducers({
    message: loginMessage,
    isLoading: loginLoading
})

/**
 * Player status from server
 */

const defaultPlayerStatus = {
    data: {
        playlist_entry: null,
        timing: 0
    },
    isFetching: false
}

function playerStatus(state = defaultPlayerStatus, action) {
    switch (action.type) {
        case PLAYERSTATUS_REQUEST:
            return { ...state, isFetching: true }
        case PLAYERSTATUS_SUCCESS:
            return { data: action.payload, isFetching: false }
        case PLAYERSTATUS_FAILURE:
            return { ...state, isFetching: false }
        default:
            return state
    }
}

/**
 * Playlist from server
 */

const defaultPlaylist = {
    data: {
        count: 0,
        results: []
    },
    isFetching: false
}

function playlistEntries(state = defaultPlaylist, action) {
    switch (action.type) {
        case PLAYLIST_REQUEST:
            return { ...state, isFetching: true }
        case PLAYLIST_SUCCESS:
            return { data: action.payload, isFetching: false }
        case PLAYLIST_FAILURE:
            return { ...state, isFetching: false }
        default:
            return state
    }
}

/** Playlist collapsed status
 */

function playlistCollapsed(state = true, action) {
    if (action.type === PLAYLIST_TOOGLE_COLLAPSED) {
        return !state
    }

    return state
}

/**
 * Remove song from playlist message
 */

function playlistNotifications(state = {}, action) {
    let entryId
    switch (action.type) {
        case REMOVEPLAYLISTENTRY_REQUEST:
            entryId = action.meta.entryId
            return {...state, [entryId]: {
                    message: "Removing...",
                    type: "success"
                }
            }

        case REMOVEPLAYLISTENTRY_SUCCESS:
            entryId = action.meta.entryId
            return {...state, [entryId]: {
                    message: "Successfuly removed!",
                    type: "success"
                }
            }

        case REMOVEPLAYLISTENTRY_FAILURE:
            entryId = action.meta.entryId
            return {...state, [entryId]: {
                    message: "Error attempting to remove song from playlist",
                    type: "danger"
                }
            }

        case CLEAR_PLAYLIST_ENTRY_NOTIFICATION:
            entryId = action.entryId
            let newState = { ...state }
            delete newState[entryId]
            return newState

        default:
            return state
    }
}
/**
 * Playlist related state
 */

const playlist = combineReducers({
    entries: playlistEntries,
    collapsed: playlistCollapsed,
    notifications: playlistNotifications
})

/**
 * Player related state
 */

const player = combineReducers({
    status: playerStatus,
    playlist
})

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    loginPage,
    player
})

export default rootReducer
