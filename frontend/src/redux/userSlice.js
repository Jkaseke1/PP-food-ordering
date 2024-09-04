import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    token: null,
  },
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.userInfo = null;
      state.token = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;