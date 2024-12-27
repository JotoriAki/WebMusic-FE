import {
  ADD_SONG_WAITPLAYLIST,
  AUTO_PLAYLIST,
  GET_PLAYLIST_OF_USER,
  NEXT_SONG,
  PLAY_SONG,
  PLAY_SONG_ON_AUTO_PLAYLIST,
  PLAY_SONG_ON_PREVIOUS_PLAYLIST,
  PLAY_SONG_ON_WAIT_PLAYLIST,
  PRIVEOUS_SONG,
  REMOVE_SONG,
} from '../Actions/Types';

const initialState = {
  autoPlaylist: JSON.parse(localStorage.getItem('autoPlaylist')) || [],
  waitPlaylist: JSON.parse(localStorage.getItem('waitPlaylist')) || [],
  previousPlaylist: JSON.parse(localStorage.getItem('previousPlaylist')) || [],
  playing: JSON.parse(localStorage.getItem('playing')) || null,
  PlaylistOfUser: [],
  error: null,
  loading: true,
};

const PlayListReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SONG_WAITPLAYLIST:
      const updatedWaitPlaylist = [...state.waitPlaylist, action.payload];
      localStorage.setItem('waitPlaylist', JSON.stringify(updatedWaitPlaylist));
      return {
        ...state,
        waitPlaylist: updatedWaitPlaylist,
        error: null,
      };
    case PLAY_SONG:
      localStorage.setItem('playing', JSON.stringify(action.payload));
      const updatedPreviousPlaylist = [...state.previousPlaylist, state.playing];
      localStorage.setItem('previousPlaylist', JSON.stringify(updatedPreviousPlaylist));
      return {
        ...state,
        playing: action.payload,
        previousPlaylist: updatedPreviousPlaylist,
      };
    case AUTO_PLAYLIST:
      // const allready = JSON.parse(localStorage.getItem('autoPlaylist'));
      // localStorage.setItem('autoPlaylist', JSON.stringify(allready != null? allready : action.payload));
      // localStorage.setItem('autoPlaylist', JSON.stringify(action.payload));
      localStorage.removeItem('previousPlaylist');
      localStorage.removeItem('waitPlaylist');
      return {
        ...state,
        autoPlaylist: action.payload,
        previousPlaylist: [],
        waitPlaylist: [],
      };
    case NEXT_SONG:
      if (state.autoPlaylist.length === 0 && state.waitPlaylist.length === 0) {
        return state;
      }
      if (state.waitPlaylist.length !== 0) {
        const nextSong = state.waitPlaylist[0];
        localStorage.setItem('playing', JSON.stringify(nextSong));
        const nextList = state.waitPlaylist.slice(1);
        localStorage.setItem('waitPlaylist', JSON.stringify(nextList));
        if (nextList.length === 0) {
          localStorage.removeItem('waitPlaylist');
        }
        const updatedPreviousPlaylist = [...state.previousPlaylist, state.playing];
        localStorage.setItem('previousPlaylist', JSON.stringify(updatedPreviousPlaylist));
        return {
          ...state,
          playing: nextSong,
          waitPlaylist: nextList,
          previousPlaylist: updatedPreviousPlaylist,
        };
      } else {
        const nextList = state.autoPlaylist.slice(1);
        localStorage.setItem('autoPlaylist', JSON.stringify(nextList));
        const updatedPreviousPlaylist = [...state.previousPlaylist, state.playing];
        localStorage.setItem('previousPlaylist', JSON.stringify(updatedPreviousPlaylist));

        if (nextList.length === 0) {
          localStorage.removeItem('autoPlaylist');
        }
        const nextSong = state.autoPlaylist[0];
        localStorage.setItem('playing', JSON.stringify(nextSong));
        return {
          ...state,
          playing: nextSong,
          autoPlaylist: nextList,
          previousPlaylist: updatedPreviousPlaylist,
        };
      }
    case PRIVEOUS_SONG:
      if (state.previousPlaylist.length === 0) {
        return state;
      }
      const previousSong = state.previousPlaylist[state.previousPlaylist.length - 1];
      const updatedPreviousList = state.previousPlaylist.slice(0, -1);
      localStorage.setItem('previousPlaylist', JSON.stringify(updatedPreviousList));

      const updatedAutoPlaylist = [state.playing, ...state.autoPlaylist];
      if (!previousSong) {
        return {
          ...state,
          autoPlaylist: updatedAutoPlaylist,
          previousPlaylist: updatedPreviousList,
        };
      }

      localStorage.setItem('playing', JSON.stringify(previousSong));

      if (updatedPreviousList.length === 0) {
        localStorage.removeItem('previousPlaylist');
      }

      return {
        ...state,
        playing: previousSong,
        previousPlaylist: updatedPreviousList,
        autoPlaylist: updatedAutoPlaylist,
      };

    case PLAY_SONG_ON_PREVIOUS_PLAYLIST:
      const songPlay = action.payload[0];
      const updateToAutoPlaylist = state.previousPlaylist.slice(action.payload[1] + 1);

      const updatedPreviousListPlay = state.previousPlaylist.slice(0, action.payload[1]);
      localStorage.setItem('previousPlaylist', JSON.stringify(updatedPreviousListPlay));

      let updatedAutoPlaylistPlay = [];
      updateToAutoPlaylist.forEach((element) => {
        updatedAutoPlaylistPlay.push(element);
      });
      updatedAutoPlaylistPlay.push(state.playing);
      updatedAutoPlaylistPlay = [...updatedAutoPlaylistPlay, ...state.autoPlaylist];
      localStorage.setItem('autoPlaylist', JSON.stringify(updatedAutoPlaylistPlay));
      localStorage.setItem('playing', JSON.stringify(songPlay));
      return {
        ...state,
        playing: songPlay,
        autoPlaylist: updatedAutoPlaylistPlay,
        previousPlaylist: updatedPreviousListPlay,
      };
    case PLAY_SONG_ON_WAIT_PLAYLIST:
      const songPlay1 = action.payload[0];
      const updateToPrevious = state.waitPlaylist.slice(0, action.payload[1]);

      const updatedWait = state.waitPlaylist.slice(action.payload[1] + 1);

      let updatedPrevious = [...state.previousPlaylist, state.playing];
      updateToPrevious.forEach((element) => {
        updatedPrevious.push(element);
      });
      localStorage.setItem('previousPlaylist', JSON.stringify(updatedPrevious));
      localStorage.setItem('waitPlaylist', JSON.stringify(updatedWait));
      localStorage.setItem('playing', JSON.stringify(songPlay1));

      return {
        ...state,
        playing: songPlay1,
        previousPlaylist: updatedPrevious,
        waitPlaylist: updatedWait,
      };
    case PLAY_SONG_ON_AUTO_PLAYLIST:
      const songPlay2 = action.payload[0];
      const updateToPrevious2 = state.autoPlaylist.slice(0, action.payload[1]);

      const updatedAuto = state.autoPlaylist.slice(action.payload[1] + 1);

      let updatedPrevious2 = [...state.previousPlaylist, state.playing];
      state.waitPlaylist.forEach((element) => {
        updatedPrevious2.push(element);
      });
      updateToPrevious2.forEach((element) => {
        updatedPrevious2.push(element);
      });
      localStorage.setItem('previousPlaylist', JSON.stringify(updatedPrevious2));
      localStorage.setItem('playing', JSON.stringify(songPlay2));
      localStorage.setItem('waitPlaylist', JSON.stringify([]));
      localStorage.setItem('autoPlaylist', JSON.stringify(updatedAuto));

      return {
        ...state,
        playing: songPlay2,
        previousPlaylist: updatedPrevious2,
        autoPlaylist: updatedAuto,
        waitPlaylist: [],
      };
    case REMOVE_SONG:
      if (action.payload[1] === 'auto') {
        const updatedAuto1 = state.autoPlaylist.filter((_, index) => index !== action.payload[0]);
        localStorage.setItem('autoPlaylist', JSON.stringify(updatedAuto1));
        return {
          ...state,
          autoPlaylist: updatedAuto1,
        };
      }
      if (action.payload[1] === 'wait') {
        const updatedWait = state.waitPlaylist.filter((_, index) => index !== action.payload[0]);
        localStorage.setItem('waitPlaylist', JSON.stringify(updatedWait));
        return {
          ...state,
          waitPlaylist: updatedWait,
        };
      }
      if (action.payload[1] === 'previous') {
        const updatedPrevious = state.previousPlaylist.filter((_, index) => index !== action.payload[0]);
        localStorage.setItem('previousPlaylist', JSON.stringify(updatedPrevious));
        return {
          ...state,
          previousPlaylist: updatedPrevious,
        };
      }
      return state;
    case GET_PLAYLIST_OF_USER:
      return {
        ...state,
        PlaylistOfUser: action.payload,
        error: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default PlayListReducer;
