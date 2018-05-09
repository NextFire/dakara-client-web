import { combineReducers } from 'redux'
import library from './library'
import token from './token'
import playlist from './playlist'
import authenticatedUser from './authenticatedUser'
import alterationsResponse from './alterationsResponse'
import settings from './settings'

/**
 * Root reducer
 */

const rootReducer = combineReducers({
    token,
    library,
    playlist,
    settings,
    authenticatedUser,
    alterationsResponse,
})

export default rootReducer
