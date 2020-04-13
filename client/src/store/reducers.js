import {combineReducers} from 'redux';
import AlbumPageReducer from './AlbumPage/reducer'

export default combineReducers({
    albumPage: AlbumPageReducer
})