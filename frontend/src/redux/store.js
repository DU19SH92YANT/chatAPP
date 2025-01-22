import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducer/userSlice";
import chatSlice from "./reducer/chatSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatSlice,
  },
});

export default store;
