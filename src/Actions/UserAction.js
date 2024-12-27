import axios from 'axios';
import { api } from '../api';
import { notification } from 'antd';

export const getUserByEmail = async (email) => {
  try {
    const res = await axios.get(api('/api/user/getUserByEmail'), {
      params: {
        email: email,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error('>>', error);
  }
};
export const getUserByUserUnique = async (UserUnique) => {
  try {
    const res = await axios.get(api('/api/user/getUserByUnique'), {
      params: {
        userNameUnique: UserUnique,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.error('>>', error);
  }
};
export const searchUser = async (username) => {
  try {
    const res = await axios.get(api('/api/user/searchUser'), {
      params: {
        username: username,
      },
    });
    return res.data;
  } catch (error) {}
};

export const uploadAvt = async (userNameUnique, avtUrl) => {
  try {
    const formData = new FormData();
    formData.append('userNameUnique', userNameUnique);
    formData.append('img', avtUrl);
    const res = await axios.put(api('/api/user/updateAvt'), formData);
    if (res.status === 200) {
      notification.success({
        message: 'Sửa ảnh đại diện thành công',
      });
      window.location.reload();
    }
  } catch (error) {
    console.error('>>', error);
  }
};

export const veryAccount = async (formData) => {
  try {
    const res = await axios.post(api('/api/user/verifyOTPForChangePass'), formData);
    if (res.status === 200) {
      notification.success({
        description: res.data.message,
      });
      return res.data;
    }
  } catch (error) {
    notification.error({
      description: error.response.data.message,
    });
    console.error('>>', error);
  }
};

export const sendOtpForRePass = async (email) => {
  try {
    const res = await axios.post(api('/api/user/checkEmail'), { email });
    if (res.status === 200) {
      notification.success({
        description: res.data.message,
      });
    }
  } catch (error) {
    notification.error({
      description: error.response.data.message,
    });
  }
};
export const changePassword = async (formData) => {
  try {
    const res = await axios.post(api('/api/user/changePassword'), formData);
    if (res.status === 200) {
      notification.success({
        description: res.data.message,
      });
      window.location.reload();
    }
  } catch (error) {
    notification.error({
      description: error.response.data.message,
    });
  }
};

export const updateUserInterest = async (userNameUnique, musicGenres) => {
  try {
    const res = await axios.post(api('/api/user/addInterests'), { userNameUnique, musicGenres });
    if (res.status === 200) {
      notification.success({
        description: res.data.message,
      });
      window.location.reload();
    }
  } catch (error) {
    notification.error({
      description: error.response.data.message,
    });
  }
};

export const followUser = async (targetName, action, name) => {
  try {
    const res = await axios.post(api('/api/user/follow'), { targetName, action, name });
    if (res.status === 200) {
      notification.success({
        description: res.data.message,
      });
    }
  } catch (error) {}
};

export const updateUsernameUnique = async (email, userNameUnique) => {
  if (!userNameUnique) {
    notification.error({
      description: 'Hãy điền tên của bạn',
    });
    return;
  }

  // Check if userNameUnique contains only letters and numbers
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(userNameUnique)) {
    notification.error({
      description: 'Tên ID chỉ được chứa chữ cái và số, không có ký tự đặc biệt',
    });
    return;
  }

  // Convert userNameUnique to lowercase
  userNameUnique = userNameUnique.toLowerCase();
  try {
    const res = await axios.put(api('/api/user/changeNameUnique'), {
      email,
      userNameUnique,
    });
    if (res.status === 200) {
      notification.success({
        description: res.data.message,
      });

      localStorage.setItem('user', JSON.stringify(res.data.newNameUnique.userNameUnique).replace(/"/g, ''));
      window.location.reload();
    }
  } catch (error) {
    notification.error({
      description: error.response.data.error,
    });
  }
};

export const updateUsername = async (userNameUnique, username) => {
  if (!username) {
    notification.error({
      description: 'Hãy điền tên của bạn',
    });
    return;
  }

  // Check if username contains only letters, numbers, spaces, and Vietnamese characters
  const regex = /^[a-zA-Z0-9\sÀ-ỹ]+$/;
  if (!regex.test(username)) {
    notification.error({
      description: 'Tên chỉ được chứa chữ cái, số, dấu cách và ký tự tiếng Việt',
    });
    return;
  }

  try {
    const res = await axios.put(api('/api/user/changeName'), {
      username,
      userNameUnique,
    });
    if (res.status === 200) {
      notification.success({
        description: res.data.message,
      });
      window.location.reload();
    }
  } catch (error) {
    notification.error({
      description: error.response.data.error,
    });
  }
};

export const seen = async (idNotifi, userNameUnique) => {
  try {
    await axios.post(api('/api/user/seen'), { idNotifi, userNameUnique });
  } catch (error) {
    console.error('>>', error);
  }
};
