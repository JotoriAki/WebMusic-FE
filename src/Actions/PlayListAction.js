import axios from 'axios';
import { api } from '../api';
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
} from './Types';
import { notification } from 'antd';

export const addSongWaitPlayList = (song) => (dispatch) => {
  try {
    dispatch({
      type: ADD_SONG_WAITPLAYLIST,
      payload: song,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin Song', error);
  }
};
export const playSong = (song) => (dispatch) => {
  try {
    if (!song) {
      notification.error({
        message: 'Playlist không có bài hát nào',
      });
      return;
    }
    dispatch({
      type: PLAY_SONG,
      payload: song,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin Song', error);
  }
};
export const autoPlaylist = (playlist, songPlay) => (dispatch) => {
  try {
    const playlists = playlist.filter((song) => song._id !== songPlay._id);

    dispatch({
      type: AUTO_PLAYLIST,
      payload: playlists,
    });
  } catch (error) {}
};

export const nextSong = () => (dispatch) => {
  try {
    dispatch({
      type: NEXT_SONG,
      payload: null,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin Song', error);
  }
};
export const previousSong = () => (dispatch) => {
  try {
    dispatch({
      type: PRIVEOUS_SONG,
      payload: null,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin Song', error);
  }
};

export const playSongOnPreviousPlaylist = (selectedSong, indexSong) => (dispatch) => {
  try {
    const song = [selectedSong, indexSong];

    dispatch({
      type: PLAY_SONG_ON_PREVIOUS_PLAYLIST,
      payload: song,
    });
  } catch (error) {
    console.error('Lỗi khi phát bài hát trong playlist', error);
  }
};
export const playSongOnWaitPlaylist = (selectedSong, indexSong) => (dispatch) => {
  try {
    const song = [selectedSong, indexSong];
    dispatch({
      type: PLAY_SONG_ON_WAIT_PLAYLIST,
      payload: song,
    });
  } catch (error) {
    console.error('Lỗi khi phát bài hát trong playlist', error);
  }
};
export const playSongOnAutoPlaylist = (selectedSong, indexSong) => (dispatch) => {
  try {
    const song = [selectedSong, indexSong];
    dispatch({
      type: PLAY_SONG_ON_AUTO_PLAYLIST,
      payload: song,
    });
  } catch (error) {
    console.error('Lỗi khi phát bài hát trong playlist', error);
  }
};

export const removeSong = (indexSong, action) => (dispatch) => {
  try {
    const song = [indexSong, action];
    dispatch({
      type: REMOVE_SONG,
      payload: song,
    });
  } catch (error) {}
};

export const createPlaylist = async (actorUnique, namePlaylist, publics) => {
  try {
    const res = await axios.post(api('/api/playlist/createPlaylist'), { actorUnique, namePlaylist, publics });
    if (res.status === 200) {
      notification.success({
        message: 'Tạo Playlist Thành Công',
      });
    }
  } catch (error) {
    notification.error({
      message: error.response.data.error,
    });
    console.error('Lỗi khi tạo Playlist', error);
  }
};

export const getPlayListOfUser = (actorUnique, actorLogin) => async (dispatch) => {
  try {
    const res = await axios.get(api('/api/playlist/getPlaylistOfUser'), {
      params: {
        actorUnique: actorUnique,
        actorLogin: actorLogin,
      },
    });
    dispatch({
      type: GET_PLAYLIST_OF_USER,
      payload: res.data.playlists,
    });
  } catch (error) {}
};

export const addSongToPlaylists = async (actorUnique, playListId, songId) => {
  try {
    const res = await axios.post(api('/api/playlist/addSongtoPlaylist'), { actorUnique, playListId, songId });
    if (res.status === 200) {
      notification.success({
        message: 'Đã thêm bài hát vào Playlist',
      });
    }
  } catch (error) {
    notification.error({
      message: error.response.data.message,
    });
  }
};
export const deleteSongToPlaylist = async (actorUnique, playListId, songId) => {
  try {
    console.log(actorUnique, playListId, songId);
    const res = await axios.delete(api('/api/playlist/deleteSongtoPlaylist'), {
      params: {
        actorUnique: actorUnique,
        playListId: playListId,
        songId: songId,
      },
    });
    if (res.status === 200) {
      notification.success({
        message: 'Đã xóa bài hát khỏi Playlist',
      });
    }
  } catch (error) {
    console.error('Lỗi khi xóa bài hát khỏi Playlist', error);
  }
};

export const deletePlaylist = async (actorUnique, playListId) => {
  try {
    console.log(actorUnique, playListId);
    const res = await axios.delete(api('/api/playlist/deletePlaylist'), {
      params: {
        actorUnique: actorUnique,
        id: playListId,
      },
    });
    if (res.status === 200) {
      notification.success({
        message: 'Đã xóa Playlist',
      });
      window.location.href = '/library';
    }
  } catch (error) {
    console.error('Lỗi khi xóa Playlist', error);
  }
};

export const updatePlaylist = async (id, actorUnique, namePlaylist, publics) => {
  try {
    const res = await axios.put(api('/api/playlist/updatePlaylist'), { id, actorUnique, namePlaylist, publics });
    if (res.status === 200) {
      notification.success({
        message: 'Đã sửa thành công Playlist',
      });
    }
  } catch (error) {
    console.error('Lỗi khi sửa Playlist', error);
  }
};
export const getPlaylistById = async (actorUnique, playlistId) => {
  try {
    const res = await axios.get(api('/api/playlist/getPlaylistById'), {
      params: {
        actorUnique: actorUnique,
        playlistId: playlistId,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi sửa Playlist', error);
  }
};
