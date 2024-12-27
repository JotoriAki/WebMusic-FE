import axios from 'axios';
import { api } from '../api';
import {
  GET_ALL_SONG,
  GET_ALL_SONG_FOLLOWED_USERS,
  GET_ALL_SONG_LIKED_USERS,
  GET_ALL_SONG_OF_USER,
  GET_SONG_HOT,
} from './Types';
import { notification } from 'antd';

export const getSong = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(api('/api/song/getAllSong'));
      dispatch({
        type: GET_ALL_SONG,
        payload: res.data,
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin Song', error);
    }
  };
};
export const getSongHot = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(api('/api/song/getSongHot'));
      dispatch({
        type: GET_SONG_HOT,
        payload: res.data,
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin Song', error);
    }
  };
};

export const uploadSong = async (id_Types, title, actorUnique, content, jpgList, mp3List) => {
  try {
    const formData = new FormData();
    formData.append('id_Types', id_Types);
    formData.append('title', title);
    formData.append('actorUnique', actorUnique);
    formData.append('content', content);
    formData.append('fileMp3', mp3List[0]);
    formData.append('img', jpgList[0]);

    const res = await axios.post(api('/api/song/create'), formData);

    if (res.status === 200) {
      notification.success({
        message: 'Upload Song Successful',
        description: 'Your song has been uploaded successfully!',
      });
      return true;
    }
  } catch (error) {
    notification.error({
      message: error.response.data.error || 'Upload Song Failed',
      description: 'Your song has not been uploaded!',
    });
    return false;
  }
};
export const getAllSongOfUser = (actorUnique) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(api('/api/song/getAllSongOfUser'), {
        params: {
          actorUnique: actorUnique,
        },
      });
      if (res.status === 200) {
        dispatch({
          type: GET_ALL_SONG_OF_USER,
          payload: res.data,
        });
      }
    } catch (error) {
      console.error('>>', error);
    }
  };
};
export const editSong = async (id, id_Types, title, actorUnique, content, jpgList) => {
  try {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('id_Types', id_Types);
    formData.append('title', title);
    formData.append('actorUnique', actorUnique);
    formData.append('content', content);
    formData.append('img', jpgList[0]);

    const res = await axios.put(api('/api/song/update'), formData);

    if (res.status === 200) {
      notification.success({
        message: 'Chỉnh sửa Bài Hát Thành Công',
        description: 'Bài hát của bạn đã được Chỉnh sửa thành công!',
      });
      window.location.reload();
      return true;
    }
  } catch (error) {
    notification.error({
      message: error.response.data.error || 'chỉnh sửa bài hát thất bại',
      description: 'Your song has not been updated!',
    });
    console.error('Lỗi khi cập nhật Song', error);
  }
};
export const deleteSong = async (id, actorUnique) => {
  try {
    const res = await axios.delete(api('/api/song/delete'), {
      params: {
        id: id,
        actorUnique: actorUnique,
      },
    });

    if (res.status === 200) {
      notification.success({
        message: 'Ngon',
        description: 'Bài hát của bạn đã được xóa thành công!',
      });
      return true;
    }
  } catch (error) {
    notification.error({
      message: error.response.data.message || 'Delete Song Failed',
      description: 'Bài hát của bạn chưa được xóa!',
    });
    console.error('Lỗi khi xóa Song', error);
  }
};
export const listenSong = async (songId) => {
  try {
    await axios.post(api('/api/song/songViewChange'), { songId });
  } catch (error) {
    console.error('Lỗi khi nghe bài hát', error);
  }
};

export const likeSong = async (songId, action, notifiToUser, actorUnique) => {
  try {
    const res = await axios.post(api('/api/song/songLikeChange'), { songId, action, notifiToUser, actorUnique });
    if (res.status === 200) {
    }
  } catch (error) {}
};
export const searchSong = async (title) => {
  try {
    const res = await axios.get(api('/api/song/searchSong'), {
      params: {
        title: title,
      },
    });
    return res.data;
  } catch (error) {}
};

export const getSongByIdActor = async (id, actorUnique) => {
  try {
    const res = await axios.get(api('/api/song/getSongIdOfUser'), {
      params: {
        id: id,
        actorUnique: actorUnique,
      },
    });
    return res.data;
  } catch (error) {}
};

export const getSongById = async (songId) => {
  try {
    const res = await axios.get(api('/api/song/getSongById'), {
      params: {
        songId: songId,
      },
    });
    return res.data;
  } catch (error) {}
};

export const getSongBySameType = async (songId) => {
  try {
    const res = await axios.get(api('/api/song/getSongBySameType'), {
      params: {
        songId: songId,
      },
    });
    return res.data.sameSongs;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin Song', error);
  }
};

export const getAllSongsFollowedUsers = (userNameUnique) => async (dispatch) => {
  try {
    const res = await axios.get(api('/api/user/getFollowUser'), {
      params: {
        userNameUnique: userNameUnique,
      },
    });
    dispatch({
      type: GET_ALL_SONG_FOLLOWED_USERS,
      payload: res.data.data,
    });
    return res.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin getAllSongsFollowedUsers', error);
  }
};
export const getSongLiked = (actorUnique) => async (dispatch) => {
  try {
    const res = await axios.get(api('/api/user/getSongLiked'), {
      params: {
        actorUnique: actorUnique,
      },
    });
    dispatch({
      type: GET_ALL_SONG_LIKED_USERS,
      payload: res.data.data,
    });
  } catch (error) {
    console.error('Lỗi khi followUser', error);
  }
};
