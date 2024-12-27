import { notification } from 'antd';
import { api } from '../api';
import { GET_COMMENT } from './Types';
import axios from 'axios';

export const getComment = (songId) => async (dispatch) => {
  try {
    console.log('songid', songId);
    const res = await axios.get(api('/api/comment/getListCmtOfSong'), {
      params: {
        songId: songId,
      },
    });
    dispatch({
      type: GET_COMMENT,
      payload: res.data,
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin Comment', error);
  }
};
export const createComment = async (actorUnique, song_id, content, parent_id) => {
  try {
    const res = await axios.post(api('/api/comment/create'), {
      actorUnique,
      song_id,
      content,
      parent_id,
    });
    if (res.status === 200) {
      notification.success({
        message: 'Đã Bình Luận',
      });
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin Comment', error);
  }
};

export const deleteComment = async (actorUnique, commentId) => {
  try {
    const res = await axios.delete(api('/api/comment/deleteCmt'), {
      params: {
        actorUnique: actorUnique,
        commentId: commentId,
      },
    });
    if (res.status === 200) {
      notification.success({
        message: 'Đã Xóa Bình Luận',
      });
    }
  } catch (error) {
    console.error('Lỗi khi lấy thông tin Comment', error);
  }
};

export const commentLikeChange = async (actorUnique, commentId, action, replyId) => {
  try {
    const res = await axios.post(api('/api/comment/commentLikeChange'), {
      actorUnique,
      commentId,
      action,
      replyId,
    });
    if (res.status === 200) {
    }
  } catch (error) {}
};
