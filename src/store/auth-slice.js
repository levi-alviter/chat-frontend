import { createSlice } from "@reduxjs/toolkit";

const id = localStorage.getItem("id") ?? '';
const username = localStorage.getItem("username") ?? '';
const token = localStorage.getItem("token") ?? '';
const isAuthenticated = username && token;

const initialState = {
  id,
  username,
  token,
  isAuthenticated,
};

const authSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    login(state, action) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("id", action.payload.id);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      localStorage.removeItem("id");
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      state.id = null;
      state.username = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;