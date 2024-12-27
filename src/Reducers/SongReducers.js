import {
  CLEAR_SEARCH,
  GET_ALL_SONG,
  GET_ALL_SONG_FOLLOWED_USERS,
  GET_ALL_SONG_LIKED_USERS,
  GET_ALL_SONG_OF_USER,
  GET_SONG_HOT,
} from '../Actions/Types';

const initialState = {
  song: [],
  songOfUser: [],
  songHot: [],
  error: null,
  songFollowedUser: [],
  songLikedUser: [],
  loading: true,
};

const SongReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SONG:
      return {
        ...state,
        song: action.payload,
        error: null,
        loading: false,
      };
    case GET_ALL_SONG_OF_USER:
      return {
        ...state,
        songOfUser: action.payload,
        error: null,
        loading: false,
      };
    case GET_SONG_HOT:
      return {
        ...state,
        songHot: action.payload,
        error: null,
        loading: false,
      };
    case GET_ALL_SONG_FOLLOWED_USERS:
      return {
        ...state,
        songFollowedUser: action.payload,
        error: null,
        loading: false,
      };

    case GET_ALL_SONG_LIKED_USERS:
      return {
        ...state,
        songLikedUser: action.payload,
        error: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default SongReducer;
