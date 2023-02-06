import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../api-client';

const initialState = {
  isSignedIn: false,
  getUserLoading: false,
  userId: '',
  userData: {},
};

export const fetchUser = createAsyncThunk('FETCH_USER', async (user) => {
  if (user !== null) {
    const userId = user.uid;
    try {
      const { data } = await axiosClient.get(`/api/users/${userId}`);
      return data;
    } catch (error) {
      throw new Error(400);
    }
  } else {
    throw new Error(400);
  }
});

export const authSlice = createSlice({
  name: 'authStatus',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state, action) => ({
      ...state,
      getUserLoading: true,
    }));
    builder.addCase(fetchUser.fulfilled, (state, action) => ({
      ...state,
      isSignedIn: true,
      userId: action.payload.userId,
      userData: action.payload,
      getUserLoading: false,
    }));
    builder.addCase(fetchUser.rejected, (state, action) => ({
      ...initialState,
    }));
  },
  reducers: {
    signout: (state) => {
      state.isSignedIn = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { signout } = authSlice.actions;

export default authSlice.reducer;
