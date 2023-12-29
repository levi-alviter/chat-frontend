import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./chat-slice";
import authSlice from "./auth-slice";

const store = configureStore({
  reducer: {
    chat: chatSlice.reducer,
    auth: authSlice.reducer,
  },
});

export default store;
