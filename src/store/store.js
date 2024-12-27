import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Reducers/authReducers';
import SongReducer from '../Reducers/SongReducers';
import { thunk } from 'redux-thunk';
import PlayListReducer from '../Reducers/PlayListReducer';
import CommentReducers from '../Reducers/CommentReducers';

const store = configureStore({
  reducer: {
    Auth: authReducer,
    AllSong: SongReducer,
    PlayList: PlayListReducer,
    Comment: CommentReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
