import axiosClient from '../api-client';
export const createUserAPI = async (userData) => {
  try {
    const { data } = await axiosClient.post('/api/users', userData);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateUserProfileAPI = async (userData) => {
  try {
    const { data } = await axiosClient.put(
      `/api/users/${userData.userId}`,
      userData
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserAPI = async (userId) => {
  try {
    const { data } = await axiosClient.get(`/api/users/${userId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsersAPI = async (role) => {
  try {
    const { data } = await axiosClient.get(`/api/users/userrole?role=${role}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};
