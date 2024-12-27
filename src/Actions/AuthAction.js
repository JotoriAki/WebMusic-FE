import axios from 'axios';
import { SIGNUP_SUCCESS, SIGNUP_FAILURE, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS } from './Types';
import { notification } from 'antd';
import { api } from '../api';
import { io } from 'socket.io-client';
import socket from '../socket';

// Đăng ký
export const signup = (userData) => async (dispatch) => {
  try {
    const res = await axios.post(api('/api/auth/verifyOtpForSignup'), userData);
    console.log('res', res);
    if (res.status === 200) {
      socket.emit('signin', userData.email);
      localStorage.setItem('authenticate', true);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('user', res?.data?.user?.userNameUnique);
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: res.data,
      });
      notification.success({
        description: 'Đăng ký thành công',
      });
      window.location.reload();
    } else {
      dispatch({
        type: SIGNUP_FAILURE,
        payload: { error: res.data.error },
      });
      notification.error({
        description: 'Đăng ký không thành công',
      });
    }
  } catch (error) {
    dispatch({
      type: SIGNUP_FAILURE,
      payload: { error: error.response.data.error },
    });
    notification.error({
      description: error.response.data.error,
    });
  }
};
export const signin = (userData) => async (dispatch) => {
  try {
    const socket = io('http://localhost:7000');
    socket.emit('signin', userData.email);
    const res = await axios.post(api('/api/auth/signin'), userData);
    if (res.status === 200) {
      localStorage.setItem('authenticate', true);
      localStorage.setItem('email', userData.email);
      console.log('res', res);
      localStorage.setItem('user', res?.data?.user?.userNameUnique);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      notification.success({
        message: 'Thành Công',
        description: 'Đăng Nhập thành công',
      });
      window.location.reload();
    } else if (res.status === 202) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: { error: res.data.error },
      });
      notification.error({
        message: 'Lỗi',
        description: res.data.error,
      });
      console.log('error', res.data.error);
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: { error: error.response.data.message },
    });
    notification.error({
      message: 'Lỗi',
      description: error.response.data.error,
    });
  }
};

export const sendOtp = async (email) => {
  try {
    const res = await axios.post(api('/api/auth/checkEmailForSignup'), { email });
    if (res.status === 200) {
      notification.success({
        description: res.data.message,
      });
    }
  } catch (error) {
    notification.error({
      description: error.response.data.error,
    });
    console.error('>>', error);
  }
};
